const restler = require('@jc21/restler');
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
					.get(url, {
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
						logger.debug('exchangeCodeForTokens response:', response);

						if (data instanceof Error) {
							reject(data);
						} else if (response.statusCode != 200) {
							if (typeof data === 'object' && typeof data.error === 'object' && typeof data.error.message !== 'undefined') {
								reject(new Error(data.error.code + ': ' + data.error.message));
							} else {
								reject(new Error('Error ' + response.statusCode));
							}
						} else {
							resolve(data);
						}
					});
			}
		});
	}

};

module.exports = Paypal;
