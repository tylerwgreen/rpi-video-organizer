var winston = require('winston');
var path	= require('path');

var logger = {
	init: function(params){
		// console.log('logger.init()', params);
		winston.remove(winston.transports.Console);
		if(false !== params.config.console){
			// console.log('logger: adding console logger with level (' + params.config.console + ')');
			winston.add(winston.transports.Console, {
				level: params.config.console
			});
		}else{
			// console.log('logger: console logger was removed');
		}
		Object.keys(params.config.file).forEach(function(fileName){
			var logLevel = params.config.file[fileName];
			var file = path.join(
				params.logDir,
				params.config.fileDir,
				fileName + params.config.fileExt
			);
			// console.log('logger: creating file logger for file (' + file + ') with level (' + logLevel + ')');
			winston.add(winston.transports.File, {
				name: fileName,
				filename: file,
				level: logLevel
			});
		});
		return winston;
	}
}
module.exports = logger;