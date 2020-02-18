const express = require('express');
const config   = require('../config');
const pjson   = require('../../package.json');

let router = express.Router({
	caseSensitive: true,
	strict:        true,
	mergeParams:   true
});

const itemNotFoundError = function (id, previous) {
	Error.captureStackTrace(this, this.constructor);
	this.name     = this.constructor.name;
	this.previous = previous;
	this.message  = 'Item Not Found - ' + id;
	this.public   = true;
	this.status   = 404;
};

/**
 * Health Check
 *
 * GET /
 */
router.get('/', (req, res/*, next*/) => {
	let version = pjson.version.split('-').shift().split('.');

	res.status(200).send({
		status:       'OK',
		sandbox:      config.isSandboxMode(),
		client_id:    config.getClientID(),
		redirect_uri: config.getRedirectURI(),
		refresh_uri:  config.getRefreshURI(),
		version: {
			major:    parseInt(version.shift(), 10),
			minor:    parseInt(version.shift(), 10),
			revision: parseInt(version.shift(), 10)
		}
	});
});

/**
 * API 404 for all other routes
 *
 * ALL /api/*
 */
router.all(/(.+)/, function (req, res, next) {
	req.params.page = req.params['0'];
	next(new itemNotFoundError(req.params.page));
});

module.exports = router;
