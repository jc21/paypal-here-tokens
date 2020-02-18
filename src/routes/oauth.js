const express = require('express');
const config   = require('../config');

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
		'&redirect_uri=' + encodeURIComponent(config.getRedirectURI());

	res.status(200).send({
		url: url,
	});
});

module.exports = router;
