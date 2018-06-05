var app = {
	init: function(){
		console.log('app.init()');
		// load modules
		this.config = require('config');
		var logger = require(__dirname + '/modules/logger');
		var videoManager = require(__dirname + '/modules/video-manager');
		var cli = require(__dirname + '/modules/cli');
		// config modules
		// console.log('config: ', this.config);
		this.logger = logger.init({
			config: this.config.get('logger'),
			logDir: __dirname
		});
		// this.logger.debug('test');
		this.videoManager = videoManager.init({
			config: this.config.get('videoManager'),
		});
		this.cli = cli.init({
			config: this.config.get('cli'),
		});
		this.run();
	},
	run: function(){
		console.log('app.run()');
		this.cli.menus.main();
	}
}
app.init();