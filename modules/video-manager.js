var execFile	= require('child_process').execFile;
var fs			= require('fs');

var videoManager = {
	params: {
		binDir:		null,
		videosDirs:	null,
	},
	init: function(params){
		this.params = Object.assign(this.params, params.config);
		this.files.init(params.initCallback);
	},
	player: {
		playerProcess: null,
		stopProcess: null,
		play: function(){
			var file = videoManager.files.getFile();
			if(null !== videoManager.player.playerProcess)
				videoManager.player.playerProcess.kill();
			videoManager.player.playerProcess = execFile(
				videoManager.params.binDir + 'videoManager-play',
				[videoManager.params.videosDirs.srcDir + file],
				function(error, stdout, stderr){
					if(error){
						// throw new Error(error);
					}else{
						// file finished playing without any action
						videoManager.player.play();
					}
				}
			);
		},
		stop: function(){
			if(null !== videoManager.player.playerProcess)
				videoManager.player.playerProcess.kill();
			if(null !== videoManager.player.stopProcess)
				videoManager.player.stopProcess.kill();
			videoManager.player.stopProcess = execFile(
				videoManager.params.binDir + 'videoManager-stop',
				[],
				function(error, stdout, stderr){
					if(error){
						// throw new Error(error);
					}
				}
			);
		}
	},
	files: {
		file:	null,
		files:	[],
		init:	function(callback){
			// search for files in src dir
			fs.readdir(videoManager.params.videosDirs.srcDir, (err, files) => {
				if(err){
					throw new Error('videoManager.files.init | ' + err);
				}else if(files.length <= 0){
					throw new Error('videoManager.files.init | No video files in src dir');
				}else{
					console.log(files.length + ' files in ' + videoManager.params.videosDirs.srcDir);
					console.log('Rejected files will be moved to ' + videoManager.params.videosDirs.rejectedDir);
					videoManager.files.files = files;
					videoManager.player.play();
					callback();
				}
			});
		},
		getFile: function(){
			if(videoManager.files.files.length <= 0)
				throw new Error('No files available in ' + videoManager.params.videosDirs.srcDir);
			videoManager.files.file = videoManager.files.files[0];
			return videoManager.files.file;
		},
		keepFile: function(){
			videoManager.files.removeFileFromArrayAndPlayNext();
		},
		rejectFile: function(){
			videoManager.files.moveFileToRejectedDir();
			videoManager.files.removeFileFromArrayAndPlayNext();
		},
		removeFileFromArrayAndPlayNext: function(){
			videoManager.player.stop();
			videoManager.files.file = null;
			videoManager.files.files.splice(0, 1);
			videoManager.player.play();
		},
		moveFileToRejectedDir: function(){
			fs.rename(
				videoManager.params.videosDirs.srcDir + videoManager.files.file,
				videoManager.params.videosDirs.rejectedDir + videoManager.files.file,
				function(error){
					if(error)
						throw new Error('Error moving file (' + videoManager.files.file + ') |' + err);
				}
			);
		}
	}
};
module.exports = videoManager;