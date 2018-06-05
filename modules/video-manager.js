var execFile	= require('child_process').execFile;
var fs			= require('fs');

var videoManager = {
	params: {
		binDir:		null,
		videosDirs:	null,
		// initWait:	5000,	// time to wait for files to arrive in videos.dirs.old during init
		// newWait:	10000,	// time to wait to check for new files in videos.dirs.new
		// initWait:	1000,	// time to wait for files to arrive in videos.dirs.old during init
		// newWait:	1000,	// time to wait to check for new files in videos.dirs.new
	},
	init: function(params){
		console.log('videoManager.init', params);
		this.params = Object.assign(this.params, params);
		// this.files.init(videoManager.projectRandom);
		// this.files.checkNewTimerInit();
		// this.testRandomization();
	},
	testRandomization: function(){
		console.log('videoManager.testRandomization');
		this.files.init(function(){
			console.log('videoManager.testRandomization init callback');
			var its	= 25;
			for(var i = 0; i <= its; i++){
				console.log(i, videoManager.files.random());
			}
		});
	},
	projectRandom: function(){
		console.log('videoManager.project');
		if(true === videoManager.files.hasNew()){
			var file = videoManager.files.getNew();
			console.log('videoManager.project | Projecting new file: ' + file);
		}else{
			var file = videoManager.files.random();
			console.log('videoManager.project | Projecting random file: ' + file);
		}
		console.log('videoManager.project | executing file: ' + videoManager.params.binDir + 'videoManager-project');
		child		= execFile(
			videoManager.params.binDir + 'videoManager-project',
			[file],
			function(error, stdout, stderr){
				if(error){
					console.log('videoManager.project | videoManager.project.error.stderr: ' + stderr);
					throw new Error(error);
				}else{
					console.log('videoManager.project | videoManager.project.success.stdout: ' + stdout);
					videoManager.projectRandom();
				}
			}
		);
	},
	files: {
		file:	null,
		files:	{
			all:		[],
			new:		[],
			available:	[],
		},
		init:	function(callback){
			console.log('videoManager.files.init');
			// search for existing files in old dir
			fs.readdir(videoManager.params.videosDirs.old, (err, files) => {
				console.log('videoManager.files.init | Read files: ', files);
				if(err){
					throw new Error('videoManager.files.init | ' + err);
				}else if(files.length <= 0){
					console.log('videoManager.files.init | No video files in old dir, wait for files in new dir and re-init');
					setTimeout(function(){
						videoManager.files.init(callback);
					}, videoManager.params.initWait);
				}else{
					console.log('videoManager.files.init | generate list of files from old dir: ', files);
					var its = 1;
					console.log('videoManager.files.init | files.length: ' + files.length);
					files.forEach(function(file, err){
						console.log('videoManager.files.init | its: ' + its);
						// the first file could be in files.new, then added here, so check for existing files
						var existingIndex = videoManager.files.files.all.indexOf(file);
						if(existingIndex >= 0){
							console.log('videoManager.files.init | ' + file + ' already exists in files.all at index: ' + existingIndex);
						}else{
							console.log('videoManager.files.init | adding file ' + file + ' to end of files.all');
							videoManager.files.files.all.push(file);
						}
						if(its >= files.length){
							console.log('videoManager.files.init | starting projection', videoManager.files.files.all);
							callback();
						}else{
							its++;
						}
					});
				}
			});
		},
		checkNewTimerInit: function(){
			console.log('videoManager.files.checkNewTimerInit');
			videoManager.files.addNew();
			setInterval(videoManager.files.addNew, videoManager.params.newWait);
		},
		addNew: function(){
			console.log('videoManager.files.addNew');
			fs.readdir(videoManager.params.videosDirs.new, (err, files) => {
				if(err){
					throw new Error('videoManager.files.addNew | ' + err);
				}else if(files.length <= 0){
					console.log('videoManager.files.addNew | No new files to add');
				}else{
					files.forEach(function(file){
						console.log('videoManager.files.addNew | moving file ' + file + ' to videosDirs.old');
						fs.rename(videoManager.params.videosDirs.new + file, videoManager.params.videosDirs.old + file, function(){
							console.log('videoManager.files.addNew | adding file ' + file + ' to end of files.all');
							videoManager.files.files.all.push(file);
							console.log('videoManager.files.addNew | adding file ' + file + ' to end of files.new');
							videoManager.files.files.new.push(file);
						});
					});
				}
			});
		},
		hasNew: function(){
			// console.log('videoManager.files.hasNew');
			return videoManager.files.files.new.length > 0 ? true : false;
		},
		getNew: function(){
			// console.log('videoManager.files.getNew');
			if(false === videoManager.files.hasNew())
				throw new Error('videoManager.files.getNew | No new files available');
			var file = videoManager.files.files.new[0];
			videoManager.files.file	= file;
			console.log('videoManager.files.getNew | Removing file ' + file + ' from files.new');
			videoManager.files.files.new.splice(0, 1);
			return videoManager.params.videosDirs.old + file;
		},
// randI: 0,
		random: function(){
			console.log('videoManager.files.random');
// console.log('videoManager.files.random', videoManager.files.randI);
// if(videoManager.files.randI >= 10)
	// throw new Error('Too many its');
// videoManager.files.randI++;
// console.log('videoManager.files.random | files.all: ', videoManager.files.files.all);
// console.log('videoManager.files.random | files.available: ', videoManager.files.files.available);
			if(videoManager.files.files.available.length <= 0){
				console.log('videoManager.files.random | all available files have been played, copy all into available');
				videoManager.files.files.available = videoManager.files.files.all.slice(0);
			}
			var file		= videoManager.files.files.available[Math.floor(Math.random() * videoManager.files.files.available.length)];
			if(typeof file === 'undefined')
				throw new Error('videoManager.files.random | No files available in all arr, app was not properly initialized');
			if(
					file === videoManager.files.file
				&&	videoManager.files.files.available.length > 1
			){
				// console.log('videoManager.files.random | files.available.length: ' + videoManager.files.files.available.length);
				console.log('videoManager.files.random | file ' + file + ' was the previously played file, find another random file');
				return videoManager.files.random();
			}
			console.log('videoManager.files.random | removing file ' + file + ' from available arr');
			var fileIndex	= videoManager.files.files.available.indexOf(file);
			videoManager.files.files.available.splice(fileIndex, 1);
			videoManager.files.file	= file;
			return videoManager.params.videosDirs.old + file;
		}
	}
};
module.exports = videoManager;