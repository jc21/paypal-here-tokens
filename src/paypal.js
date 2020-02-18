const restler = require('@jc21/restler');
const crypto  = require('crypto');
const config  = require('./config');
const logger  = require('./logger').paypal;

const Paypal = {

	/**
	 * Exchanges a Oauth callback code for Tokens
	 *
	 * @param   {string} code
	 * @returns {Promise}
	 */
	exchangeCodeForTokens: function (code) {
		const url = 'https://api' + (config.isSandboxMode() ? '.sandbox' : '') + '.paypal.com/v1/identity/openidconnect/tokenservice';

		return new Promise((resolve, reject) => {
			if (!code) {
				reject(new Error('Code was empty'));
			} else {
				restler
					.post(url, {
						username: config.getClientID(),
						password: config.getSecret(),
						headers: {
							Accept: 'application/json',
						},
						data: {
							grant_type:   'authorization_code',
							redirect_uri: config.getRedirectURI(),
							code:         code,
						},
					})
					.on('complete', function(data, response) {
						logger.debug('exchangeCodeForTokens data:', data);

						if (data instanceof Error) {
							reject(data);
						} else if (response.statusCode != 200) {
							if (typeof data === 'object' && typeof data.error !== 'undefined' && typeof data.error_description !== 'undefined') {
								reject(new Error(data.error + ': ' + data.error_description));
							} else {
								reject(new Error('Error ' + response.statusCode));
							}
						} else {
							resolve(data);
						}
					});
			}
		});
	},

	/**
	 * Creates a massive token string for use with PayPal Here SDK
	 * It's a base64 encoded array with 3 items, one of which is a bcrypt
	 * encoded token for use by this very same service in the /oauth/refresh
	 * endpoint.
	 *
	 * @param   {object} data
	 * @param   {string} data.token_type
	 * @param   {string} data.expires_in
	 * @param   {string} data.refresh_token
	 * @param   {string} data.id_token
	 * @param   {string} data.access_token
	 * @returns {Promise}
	 */
	generateInitializeToken: function (data) {
		const env = config.isSandboxMode() ? 'sandbox' : 'live';

		return Paypal.encrypt(JSON.stringify([env, data.refresh_token]))
			.then((encrypted) => {
				const tokenInformation = [
					data.access_token,
					data.expires_in,
					config.getRefreshURI() + '?token=' + encodeURIComponent(encrypted)
				];

				const buf          = Buffer.from(JSON.stringify(tokenInformation));
				const encodedToken = encodeURIComponent(buf.toString('base64'));

				return (config.isSandboxMode() ? 'sandbox' : 'live') + ':' + encodedToken;
			});
	},

	/**
	 * Encrypt tokens with the Server ID
	 *
	 * @param   {string} plainText
	 * @returns {Promise}
	 */
	encrypt: function (plainText) {
		const salt = Buffer.from(crypto.randomBytes(16), 'binary');
		const iv   = Buffer.from(crypto.randomBytes(16), 'binary');

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(config.getServerID(), salt, 1000, 32, 'sha512', function (err, key) {
				if (err) {
					reject(err)
					return;
				}

				const cipher  = crypto.createCipheriv('aes-256-cbc', key, iv);
				let buf       = Buffer.from(cipher.update(plainText, 'utf8', 'binary'), 'binary');
				buf           = Buffer.concat([buf, Buffer.from(cipher.final('binary'), 'binary')]);
				const hashKey = crypto.createHash('sha1').update(key).digest('binary');
				const hmac    = Buffer.from(crypto.createHmac('sha1', hashKey).update(buf).digest('binary'), 'binary');
				buf           = Buffer.concat([salt, iv, hmac, buf]);

				resolve(buf.toString('base64'));
			});
		});
	},

	/**
	 * Decrypt token with the Server ID
	 *
	 * @param   {string} plainText
	 * @returns {Promise}
	 */
	decrypt: function (cipherText) {
		const cipher = Buffer.from(cipherText, 'base64');
		const salt   = cipher.slice(0, 16);
		const iv     = cipher.slice(16, 32);
		const hmac   = cipher.slice(32, 52);
		cipherText   = cipher.slice(52);

		return new Promise((resolve, reject) => {
			crypto.pbkdf2(config.getServerID(), salt, 1000, 32, function (err, key) {
				if (err) {
					reject(err);
					return;
				}

				const cipher  = crypto.createDecipheriv('aes-256-cbc', key, iv);
				const hashKey = crypto.createHash('sha1').update(key).digest('binary');
				const hmacgen = Buffer.from(crypto.createHmac('sha1', hashKey).update(cipherText).digest('binary'), 'binary');

				if (hmacgen.toString('base64') !== hmac.toString('base64')) {
					rejcet(new Error('HMAC Mismatch!'));
					return;
				}

				let buf = Buffer.from(cipher.update(cipherText), 'binary');
				buf = Buffer.concat([buf, Buffer.from(cipher.final('binary'))]);

				resolve([buf.toString('utf8'), key]);
			});
		});
	}

};

module.exports = Paypal;
