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
 * GET /debug/decodeInitToken?token=
 */
router.get('/decodeInitToken', (req, res/*, next*/) => {
	if (typeof req.query.token === 'undefined' || !req.query.token) {
		next(new Error('Token was not supplied'));
	} else {
		res.status(200).send(PayPal.decodeInitializeToken(req.query.token));
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
		next(new Error(`Login with PayPal Error! ${req.query.error}: ${req.query.error_description}`));
		return
	}

	// Now we want to take this code and exchange it for Tokens
	if (typeof req.query.code !== 'undefined' && req.query.code) {
		PayPal.exchangeCodeForTokens(req.query.code)
			.then((data) => {
				return PayPal.generateInitializeToken(data)
					.then((initToken) => {
						data.initializeToken = initToken;
						return data;
					});
			})
			.then((data) => {
				res.status(200).send(data);
			})
			.catch(next);
	} else {
		res.status(200).send({
			body:   req.body,
			params: req.params,
			query:  req.query,
		});
	}
});

/**
 * Refresh endpoint used by Paypal Here SDK to get fresh access tokens
 *
 * GET /oauth/refresh
 */
router.get('/refresh', (req, res, next) => {
	logger.debug('Paypal Refresh URI Hit:', req.originalUrl);

	PayPal.refreshFromToken(req.query.token)
		.then((data) => {
			res.status(200).send(data);
		})
		.catch(next);
});

module.exports = router;
