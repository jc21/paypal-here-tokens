const logger = require('./logger').global;

const config = {

	/**
	 * @returns {string}
	 */
	getServerID: function () {
		return process.env.SERVER_ID || '';
	},

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
		return process.env.REDIRECT_URI || '';
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
		if (!config.getServerID()) {
			logger.error('CLIENT_ID env variable was not specified');
			exit = true;
		}

		if (!config.getClientID()) {
			logger.error('CLIENT_ID env variable was not specified');
			exit = true;
		}

		if (!config.getSecret()) {
			logger.error('SECRET env variable was not specified');
			exit = true;
		}

		if (!config.getRedirectURI()) {
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
