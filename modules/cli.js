var readline = require('readline');

var cli = {
	params: {
		callbacks: {
			keep: null,
			reject: null,
			skip: null,
			// exit: null
		},
		numVideosToSkip: null,
	},
	init: function(params){
		this.params = Object.assign(this.params, params.config);
		this.params.callbacks = Object.assign(this.params, params.callbacks);
		this.params.numVideosToSkip = params.numVideosToSkip;
		this.readline = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return cli;
	},
	menus: {
		main: function(){
			cli.readline.question('Please Choose an option:\n'
				+ '1) Keep video\n'
				+ '2) Reject video\n'
				+ '3) Skip ' + cli.params.numVideosToSkip + ' videos\n'
				// + '4) Exit\n'
				, function(line){
					switch(line){
						case '1':
							console.log('\nVideo kept\n');
							cli.params.callbacks.keep();
							break;
						case '2':
							console.log('\nVideo rejected\n');
							cli.params.callbacks.reject();
							break;
						case '3':
							console.log('\nSkipped ' + cli.params.numVideosToSkip + ' videos\n');
							cli.params.callbacks.skip();
							break;
						// case '4':
							// cli.params.callbacks.exit();
							// return cli.readline.close();
							// break;
						default:
							console.log('\nNo such option\n');
					}
					cli.menus.main();
				}
			);
		}
	}
}
module.exports = cli;
