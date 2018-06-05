var readline = require('readline');

var cli = {
	params: {
	},
	init: function(params){
console.log('cli.init()', params);
		this.params = Object.assign(this.params, params);
		this.readline = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		return cli;
	},
	menus: {
		main: function(){
			cli.readline.question("Please Choose an option:\n"
				+ "1) Like video\n"
				+ "2) Dislike video\n"
				+ "3) Exit\n"
				, function(line){
					switch(line){
						case "1":
							console.log("this is option 1");
							break;
						case "2":
							console.log("this is option 2");
							break;
						case "3":
							return cli.readline.close();
							break;
						default:
							console.log("No such option. Please enter another: ");
					}
					cli.menus.main();
				}
			);
		}
	}
}
module.exports = cli;
