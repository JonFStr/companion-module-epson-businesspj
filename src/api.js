const {InstanceStatus} = require('@companion-module/base');

const Client = require('urllib');

module.exports = {
	initConnection: function () {
		let self = this;

		self.updateStatus(InstanceStatus.Ok);

		//self.getInformation();
		//self.setupInterval();
	},

	setupInterval: function () {
		let self = this;

		self.stopInterval();

		if (self.config.polling == true) {
			self.INTERVAL = setInterval(self.getInformation.bind(self), self.config.interval);
			self.log('info', 'Starting Update Interval: Every ' + self.config.interval + 'ms');
		}
	},

	stopInterval: function () {
		let self = this;

		if (self.INTERVAL !== null) {
			self.log('info', 'Stopping Update Interval.');
			clearInterval(self.INTERVAL);
			self.INTERVAL = null;
		}
	},

	getInformation: async function () {
		let self = this;

		//send commands to request status about the projector
	},

	sendCommand: function (path) {
		let self = this;

		if (self.config.host !== '' && self.config.host !== undefined) {
			const https = self.config.https;
			const timestamp = new Date().getTime();
			const urlBase = "http" + (https ? "s" : "") + "://" + self.config.host + '/cgi-bin/'
			const url = urlBase + 'directsend?' + path + "&_=" + timestamp;

			let options = {
				digestAuth: 'EPSONWEB:' + self.config.password,
				headers: {'Referer': urlBase}
			};

			if (self.config.verbose) {
				self.log('debug', 'Requesting: ' + url);
			}

			Client.request(url, options).then(function (response) {
				//do something with response
				self.checkFeedbacks();
				self.checkVariables();
			}, function (error) {
				self.log('error', 'Error Sending Command ' + error.toString());
			})
		}
	}
}