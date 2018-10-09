var readline = require('readline');

var cli = {
	params: {
		callbacks: {
			keep: null,
			reject: null,
			exit: null
		}
	},
	init: function(params){
		this.params = Object.assign(this.params, params.config);
		this.params.callbacks = Object.assign(this.params, params.callbacks);
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
				// + '3) Exit\n'
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
						// case '3':
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
