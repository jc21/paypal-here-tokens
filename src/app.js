const express     = require('express');
const bodyParser  = require('body-parser');
const compression = require('compression');
const log         = require('./logger').express;

/**
 * App
 */
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.disable('x-powered-by');
app.enable('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);
app.enable('strict routing');
app.set('json spaces', 2);

/**
 * Routes
 */
app.use('/oauth', require('./routes/oauth'));
app.use('/debug', require('./routes/debug'));
app.use('/', require('./routes'));

/**
 * Fallback Error Handler
 */
app.use(function (err, req, res, next) {

	let payload = {
		error: {
			code:    err.status,
			message: err.message || 'Internal Error',
		}
	};

	// Not every error is worth logging - but this is good for now until it gets annoying.
	if (err.status !== 404 && typeof err.stack !== 'undefined' && err.stack) {
		payload.debug = {
			stack:    typeof err.stack !== 'undefined' && err.stack ? err.stack.split('\n') : null,
			previous: err.previous
		};
		log.debug(err.stack);
	}

	res
		.status(err.status || 500)
		.send(payload);
});

module.exports = app;
