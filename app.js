process.env['NODE_CONFIG_DIR'] = __dirname + '/config/';
var app = {
	init: function(){
		// load modules
		this.config = require('config');
		var logger = require(__dirname + '/modules/logger');
		var videoManager = require(__dirname + '/modules/video-manager');
		var cli = require(__dirname + '/modules/cli');
		// config modules
		this.logger = logger.init({
			config: this.config.get('logger'),
			logDir: __dirname
		});
		// this.logger.debug('test');
		this.videoManager = videoManager.init({
			initCallback: this.run,
			config: this.config.get('videoManager'),
		});
		this.cli = cli.init({
			callbacks: {
				keep: videoManager.files.keepFile,
				reject: videoManager.files.rejectFile,
				exit: videoManager.player.stop
			},
			config: this.config.get('cli'),
		});
	},
	run: function(){
		console.log('');
		app.cli.menus.main();
	}
}
app.init();