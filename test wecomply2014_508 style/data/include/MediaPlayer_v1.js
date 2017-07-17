var MediaPlayer = {debugMode:false, platforms:{flash:1,html5:2, none:0}, types:{video:1, audio: 2,none:0}, actions:{playing:1, paused:2, stopped:3, none:0}};
MediaPlayer.status = {action:MediaPlayer.actions.none,platform:MediaPlayer.platforms.none, type:MediaPlayer.types.none, index:0,mimeType:null};
MediaPlayer.support = {};
MediaPlayer.support.html5Audio = function(checkMp3Specific){
	var audioElm;
	try{audioElm = document.createElement('audio');}catch(e){return false;}
	
	if (typeof(audioElm) == 'undefined' || audioElm == null || !audioElm.canPlayType)
		return false;
	
	if (checkMp3Specific)
		return audioElm.canPlayType('audio/mpeg');
	else
		return true;
}
MediaPlayer.support.flashAudio = function () {
	var playerVersion = swfobject.getFlashPlayerVersion();
	if (playerVersion.major > 6)
		return true;
	else
		return false;
}
MediaPlayer.support.flashVideo = function () {
	var playerVersion = swfobject.getFlashPlayerVersion();
	if (playerVersion.major > 8)
		return true;
	else
		return false;
}
MediaPlayer.support.html5Video = function(checkMp4Specific){
	var videoElm;
	try{videoElm = document.createElement('video');}catch(e){return false;}
	
	if (typeof(videoElm) == 'undefined' || videoElm == null || !videoElm.canPlayType)
		return false;
	
	if (checkMp4Specific)
		return videoElm.canPlayType('video/mp4; codecs="avc1.42E01E"') == 'probably' || videoElm.canPlayType('video/mp4; codecs="avc1.42E01E"') == 'maybe';
	else
		return true;
}
MediaPlayer.video = {activeElement:null, files : [], flashPlayerSrc: ''};
MediaPlayer.video.add = function(src, id, mimeType, autoPlay, streamUrl, containerId, width, height){
	var newIndex = MediaPlayer.video.files.push({src:src, id:id, mimeType:mimeType, autoPlay:autoPlay, streamUrl:streamUrl, containerId:containerId, width:width, height:height});
	if (autoPlay && newIndex == 1)
		MediaPlayer.video.play(newIndex);
}
MediaPlayer.video.stop = function(){
    if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.video.activeElement) != 'undefined'){
		MediaPlayer.video.activeElement.stop();
		MediaPlayer.status.action = MediaPlayer.actions.none;
	}
	else{
		MediaPlayer.video.activeElement.TCallLabel('/','stop');
		MediaPlayer.status.action = MediaPlayer.actions.none	;
	}
}
MediaPlayer.video.play = function(index){
	index--; //this is because the chapter is 1 based and the arrays is 0 based
	if (MediaPlayer.status.action != MediaPlayer.actions.none 
		&& (MediaPlayer.status.type != MediaPlayer.types.video 
		&& index != MediaPlayer.status.index)){
		MediaPlayer.stopCurrentActiveMedia();
	}else if (MediaPlayer.status.type == MediaPlayer.types.video && index == MediaPlayer.status.index && MediaPlayer.status.action == MediaPlayer.actions.playing){
		MediaPlayer.logs.push('pausing video');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.video.activeElement) != 'undefined'){
			MediaPlayer.video.activeElement.pause();
			MediaPlayer.status.action = MediaPlayer.actions.paused;
		}
		else{
			MediaPlayer.video.activeElement.TCallLabel('/','pause');
			MediaPlayer.status.action = MediaPlayer.actions.paused	;
		}
	}else if (MediaPlayer.status.type == MediaPlayer.types.video && index == MediaPlayer.status.index){
		MediaPlayer.logs.push('continuing video');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.video.activeElement) != 'undefined'){
			MediaPlayer.video.activeElement.play();
			MediaPlayer.status.action = MediaPlayer.actions.playing;
		}
		else{
			//start playing flash again
			MediaPlayer.video.activeElement.TCallLabel('/','play');
			MediaPlayer.status.action = MediaPlayer.actions.playing;
		}
	}
	else
	{
		if (typeof(MediaPlayer.video.files[index]) != 'undefined'){
			MediaPlayer.status.type = MediaPlayer.types.video;
			MediaPlayer.status.index = index;
			if (MediaPlayer.support.html5Video(true)){
				MediaPlayer.status.platform = MediaPlayer.platforms.html5;
				MediaPlayer.logs.push('playing html5 video');
				
				if (typeof(MediaPlayer.video.activeElement) == 'undefined' || MediaPlayer.video.activeElement == null)
				{	MediaPlayer.video.activeElement = document.createElement('video');}
				else
				{try{MediaPlayer.video.activeElement.stop();}catch(e){}}
				MediaPlayer.video.activeElement.autoplay = true;
				
				if (typeof(MediaPlayer.video.files[index].width) != 'undefined' && MediaPlayer.video.files[index].width > 0)
					MediaPlayer.video.activeElement.width = MediaPlayer.video.files[index].width;
				if (typeof(MediaPlayer.video.files[index].height) != 'undefined' && MediaPlayer.video.files[index].height > 0)
					MediaPlayer.video.activeElement.height = MediaPlayer.video.files[index].height;

				//MediaPlayer.video.activeElement.src = MediaPlayer.video.files[index].src.replace('.flv', '.mp4');
				MediaPlayer.video.activeElement.id = 'videoElement' + index+1;
				/*MediaPlayer.video.activeElement.addEventListener('ended', function(){
					this.currentTime = 0;
					this.pause();
					MediaPlayer.status.action = MediaPlayer.actions.none;
				}, false);*/

				
				
				var source= document.createElement('source');
				source.type= 'video/mp4';
				//source.type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
				source.id = 'video' + index+1 + '_mp4';
				source.src= MediaPlayer.video.files[index].src.replace('.flv', '.mp4');
				MediaPlayer.video.activeElement.appendChild(source);
				//MediaPlayer.video.activeElement.type = 'video/mp4'//; codecs="avc1.42E01E"';
				//MediaPlayer.video.activeElement.src = MediaPlayer.video.files[index].src.replace('.flv', '.mp4');
				MediaPlayer.video.activeElement.controls = false;
				//MediaPlayer.video.activeElement.autoplay = true;
				if (typeof(MediaPlayer.video.files[index].containerId) != 'undefined' && MediaPlayer.video.files[index].containerdD != '')
				{
					var containerElm = document.getElementById(MediaPlayer.video.files[index].containerId);
					containerElm.innerHTML = '';
					containerElm.appendChild(MediaPlayer.video.activeElement);
				}
				MediaPlayer.video.activeElement.play();
				MediaPlayer.status.action = MediaPlayer.actions.playing;				
			}
			else if (MediaPlayer.support.flashVideo()){
				MediaPlayer.video.activeElement = document.createElement('embed');
				MediaPlayer.video.activeElement.src = MediaPlayer.video.flashPlayerSrc + '?res=' + MediaPlayer.video.files[index].src + '&autostart=true&protocol=http'; 
				MediaPlayer.video.activeElement.setAttribute('FlashVars', 'res=' + MediaPlayer.video.files[index].src + '&autostart=true&protocol=http');				
				MediaPlayer.video.activeElement.setAttribute('quality', 'high');
				MediaPlayer.video.activeElement.setAttribute('scale', 'exactfit');
				MediaPlayer.video.activeElement.setAttribute('width', MediaPlayer.video.files[index].width);
				MediaPlayer.video.activeElement.setAttribute('menu', 'false');
				MediaPlayer.video.activeElement.setAttribute('height', MediaPlayer.video.files[index].height);
				MediaPlayer.video.activeElement.setAttribute('salign','1');
				MediaPlayer.video.activeElement.setAttribute('swLiveConnect','true');
				MediaPlayer.video.activeElement.name='flashVideo' + MediaPlayer.video.files[index].id;
				MediaPlayer.video.activeElement.id= 'flashVideo' + MediaPlayer.video.files[index].id;
				MediaPlayer.video.activeElement.setAttribute('allowScriptAccess', 'sameDomain');
				MediaPlayer.video.activeElement.type='application/x-shockwave-flash';
				MediaPlayer.video.activeElement.setAttribute('PluginsPage', 'http://www.macromedia.com/go/getflashplayer');
				document.body.appendChild(MediaPlayer.video.activeElement);

				var checkFlash = function(){
					if (typeof(MediaPlayer.video.activeElement) == 'undefined')// || MediaPlayer.video.activeElement.PercentLoaded() < 100)
						window.setTimeout(checkFlash, 500);
					else
					{
						MediaPlayer.video.activeElement.SetVariable('currentSong', 'http://test.wecomply.com' + MediaPlayer.video.files[index].src);
						MediaPlayer.video.activeElement.TCallLabel('/','load');
						MediaPlayer.video.activeElement.TCallLabel('/','play');
						MediaPlayer.video.activeElement.SetVariable('onSongOver', function(){
							MediaPlayer.status.action = MediaPlayer.actions.playing;
						});
						MediaPlayer.status.action = MediaPlayer.actions.playing;
					}
				}
				window.setTimeout(checkFlash, 500);
				
				MediaPlayer.logs.push('playing flash video');
			}
			else{
			alert('no support');
				MediaPlayer.logs.push('not sufficient video support');
			}
		}
		else
		{
			MediaPlayer.logs.push('video file not found');
		}
	}
}
MediaPlayer.audio = {activeElement:null, files : [], flashPlayerSrc: ''};
MediaPlayer.audio.add = function (src, id){
	MediaPlayer.audio.files.push({src:src, id:id});
}
MediaPlayer.audio.stop = function (){
    if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.audio.activeElement) != 'undefined'){
		MediaPlayer.audio.activeElement.stop();
		MediaPlayer.status.action = MediaPlayer.actions.none;
	}
	else{
		MediaPlayer.audio.activeElement.TCallLabel('/','stop');
		MediaPlayer.status.action = MediaPlayer.actions.none;
	}
}
MediaPlayer.audio.play = function(index){
    index--; //this is because the chapter is 1 based and the arrays is 0 based
	if (MediaPlayer.status.action != MediaPlayer.actions.none 
		&& (MediaPlayer.status.type != MediaPlayer.types.audio 
		&& index != MediaPlayer.status.index)){
		MediaPlayer.stopCurrentActiveMedia();
	}else if (MediaPlayer.status.type == MediaPlayer.types.audio && index == MediaPlayer.status.index && MediaPlayer.status.action == MediaPlayer.actions.playing){
		MediaPlayer.logs.push('pausing audio');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.audio.activeElement) != 'undefined'){
			MediaPlayer.audio.activeElement.pause();
			MediaPlayer.status.action = MediaPlayer.actions.paused;
		}
		else{
			MediaPlayer.audio.activeElement.TCallLabel('/','pause');
			MediaPlayer.status.action = MediaPlayer.actions.paused	;
		}
	}else if (MediaPlayer.status.type == MediaPlayer.types.audio && index == MediaPlayer.status.index){
		MediaPlayer.logs.push('continuing audio');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.audio.activeElement) != 'undefined'){
			MediaPlayer.audio.activeElement.play();
			MediaPlayer.status.action = MediaPlayer.actions.playing;
		}
		else{
			//start playing flash again
			MediaPlayer.audio.activeElement.TCallLabel('/','play');
			MediaPlayer.status.action = MediaPlayer.actions.playing;
		}
	}
	else
	{
		if (typeof(MediaPlayer.audio.files[index]) != 'undefined'){
			MediaPlayer.status.type = MediaPlayer.types.audio;
			MediaPlayer.status.index = index;
			if (MediaPlayer.support.html5Audio(true)){
				MediaPlayer.status.platform = MediaPlayer.platforms.html5;
				MediaPlayer.logs.push('playing html5 audio');
				if (typeof(MediaPlayer.audio.activeElement) == 'undefined' || MediaPlayer.audio.activeElement == null)
				{	MediaPlayer.audio.activeElement = document.createElement('audio');}
				else
				{try{MediaPlayer.audio.activeElement.stop();}catch(e){}}
				MediaPlayer.audio.activeElement.src = MediaPlayer.audio.files[index].src;
				MediaPlayer.audio.activeElement.addEventListener('ended', function(){
					this.currentTime = 0;
					this.pause();
					MediaPlayer.status.action = MediaPlayer.actions.paused;
				}, false);

				MediaPlayer.audio.activeElement.play();
				MediaPlayer.status.action = MediaPlayer.actions.playing;
			}
			else if (MediaPlayer.support.flashAudio()){
				MediaPlayer.audio.activeElement = document.createElement('embed');
				MediaPlayer.audio.activeElement.src = MediaPlayer.audio.flashPlayerSrc;
				<!--flashfile.swf?file=mp3file.mp4&as=1 (as=autostart) , if these prams -->
				//MediaPlayer.audio.activeElement.setAttribute('FlashVars', 'res=' + MediaPlayer.audio.files[index].src + '&autostart=true&protocol=http');				
				MediaPlayer.audio.activeElement.setAttribute('quality', 'high');
				MediaPlayer.audio.activeElement.setAttribute('scale', 'exactfit');
				MediaPlayer.audio.activeElement.setAttribute('width', 0);
				MediaPlayer.audio.activeElement.setAttribute('menu', 'false');
				MediaPlayer.audio.activeElement.setAttribute('height', 0);
				//MediaPlayer.audio.activeElement.setAttribute('salign','1');
				//MediaPlayer.audio.activeElement.setAttribute('swLiveConnect','true');
				MediaPlayer.audio.activeElement.name='flashAudio' + MediaPlayer.audio.files[index].id;
				MediaPlayer.audio.activeElement.id= 'flashAudio' + MediaPlayer.audio.files[index].id;
				MediaPlayer.audio.activeElement.setAttribute('allowScriptAccess', 'sameDomain');
				MediaPlayer.audio.activeElement.type='application/x-shockwave-flash';
				MediaPlayer.audio.activeElement.setAttribute('PluginsPage', 'http://www.macromedia.com/go/getflashplayer');
				document.body.appendChild(MediaPlayer.audio.activeElement);
				//MediaPlayer.audio.activeElement.GotoFrame(5);//stop
				//MediaPlayer.audio.activeElement.GotoFrame(6);//gotobeginning
				//MediaPlayer.audio.activeElement.GotoFrame(4);//play
				var checkFlash = function(){
					if (typeof(MediaPlayer.audio.activeElement) == 'undefined' || MediaPlayer.audio.activeElement.PercentLoaded() < 100)
						window.setTimeout(checkFlash, 500);
					else
					{
						MediaPlayer.audio.activeElement.SetVariable('currentSong', 'http://test.wecomply.com' + MediaPlayer.audio.files[index].src);
						MediaPlayer.audio.activeElement.TCallLabel('/','load');
						MediaPlayer.audio.activeElement.TCallLabel('/','play');
						MediaPlayer.audio.activeElement.SetVariable('onSongOver', function(){
							MediaPlayer.status.action = MediaPlayer.actions.playing;
						});
						MediaPlayer.status.action = MediaPlayer.actions.playing;
					}
				}
				window.setTimeout(checkFlash, 500);
				
				MediaPlayer.logs.push('playing flash audio');
			}
			else{
			    alert('no support');
				MediaPlayer.logs.push('not sufficient audio support');
			}
		}
		else
		{
			MediaPlayer.logs.push('audio file not found');
		}
	}
}
MediaPlayer.stopCurrentActiveMedia = function (){
	if (MediaPlayer.status.action != MediaPlayer.actions.none){
        if (MediaPlayer.status.type == MediaPlayer.types.audio)
            MediaPlayer.audio.stop();
        else if (MediaPlayer.status.type == MediaPlayer.types.video)
            MediaPlayer.video.stop();
    }
}
MediaPlayer.logs = {loggedData:[]};
MediaPlayer.logs.push = function (dataToLog){
	if (MediaPlayer.debugMode){alert(dataToLog);}
	MediaPlayer.logs.loggedData.push(dataToLog);
}