const logger = require('./logger').global;

const config = {

	/**
	 * @returns {string}
	 */
	getClientID: function () {
		return process.env.CLIENT_ID || '';
	},

	/**
	 * @returns {string}
	 */
	getSecret: function () {
		return process.env.SECRET || '';
	},

	/**
	 * @returns {string}
	 */
	getRedirectURI: function () {
		return process.env.getRedirectURI || '';
	},

	/**
	 * @returns {bool}
	 */
	isSandboxMode: function () {
		const sb = process.env.SANDBOX || '';
		if (sb == 'true' || sb == '1' || sb == 'on') {
			return true;
		}

		return false;
	},

	check: function () {
		let exit = false;
		// Check for required environment variables
		if (typeof process.env.CLIENT_ID === 'undefined' || process.env.CLIENT_ID == '') {
			logger.error('CLIENT_ID env variable was not specified');
			exit = true;
		}

		if (typeof process.env.SECRET === 'undefined' || process.env.SECRET == '') {
			logger.error('SECRET env variable was not specified');
			exit = true;
		}

		if (typeof process.env.REDIRECT_URI === 'undefined' || process.env.REDIRECT_URI == '') {
			logger.error('REDIRECT_URI env variable was not specified');
			exit = true;
		}

		if (exit) {
			logger.info('Terminating due to missing requirements');
			process.exit(1);
		} else if (config.getRedirectURI().indexOf('/oauth/return') === -1) {
			logger.warn('Redirect URI doesn\'t seem to point back to this service');
		}
	}
};

module.exports = config;
