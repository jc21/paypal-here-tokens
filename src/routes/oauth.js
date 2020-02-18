const express = require('express');
const config  = require('../config');
const logger  = require('../logger').express;
const PayPal  = require('../paypal');

let router = express.Router({
	caseSensitive: true,
	strict:        true,
	mergeParams:   true
});

/**
 * Login URL for Oauth
 *
 * GET /oauth/login
 */
router.get('/login', (req, res/*, next*/) => {
	let url = 'https://www.' + (config.isSandboxMode() ? 'sandbox.' : '') + 'paypal.com/connect' +
		'?response_type=code' +
		'&client_id=' + encodeURIComponent(config.getClientID()) +
		'&scope=' + encodeURIComponent('openid email profile address https://uri.paypal.com/services/paypalhere https://uri.paypal.com/services/paypalattributes/business') +
		'&redirect_uri=' + encodeURIComponent(config.getRedirectURI()) +
		'&state=' + encodeURIComponent(req.query.state || '');

	if (typeof req.query.follow !== 'undefined') {
		res.redirect(302, url);
	} else {
		res.status(200).send({
			url: url,
		});
	}
});

/**
 * Return URL for Oauth
 *
 * GET /oauth/return
 */
router.get('/return', (req, res, next) => {
	logger.debug('Paypal Redirect URI Hit:', req.originalUrl);

	// Check for errors from Paypal
	if (req.query.error) {
		next(new Error(util.format('Login with PayPal Error! %s: %s', req.query.error, req.query.error_description)));
		return
	}

	// Now we want to take this code and exchange it for Tokens
	if (typeof req.query.code !== 'undefined' && req.query.code) {
		PayPal.exchangeCodeForTokens(req.query.code)
			.then((data) => {
				res.status(200).send(data);
			})
			.catch(next);

	} else {
		res.status(200).send({
			body: req.body,
			params: req.params,
			query: req.query,
		});
	}
});

module.exports = router;
