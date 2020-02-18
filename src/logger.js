const {Signale} = require('signale');

module.exports = {
	global:  new Signale({scope: 'Global   '}),
	express: new Signale({scope: 'Express  '}),
	paypal:  new Signale({scope: 'PayPal   '}),
};
