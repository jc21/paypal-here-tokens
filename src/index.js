#!/usr/bin/env node

const logger = require('./logger').global;

function appStart () {
	const httpPort = process.env.HTTP_PORT || 3000;
	const config   = require('./config');
	const app      = require('./app');

	config.check();

	const server = app.listen(httpPort, () => {
		logger.info(`Server listening on port ${httpPort} ...`);
		logger.warn('App is running in ' + (config.isSandboxMode() ? 'Sandbox' : 'Live') + ' Mode');

		process.on('SIGTERM', () => {
			logger.info('PID ' + process.pid + ' received SIGTERM');
			server.close(() => {
				logger.info('Stopping.');
				process.exit(0);
			});
		});
	});
}

try {
	appStart();
} catch (err) {
	logger.error(err.message, err);
	process.exit(1);
}
