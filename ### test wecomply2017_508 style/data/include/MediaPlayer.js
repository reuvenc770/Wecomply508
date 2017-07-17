var MediaPlayer = {debugMode:false, platforms:{flash:1,html5:2, none:0}, types:{video:1, audio: 2,none:0}, actions:{playing:1, paused:2, stopped:3, none:0}};
MediaPlayer.status = {action:MediaPlayer.actions.none,platform:MediaPlayer.platforms.none, type:MediaPlayer.types.none, id:0,mimeType:null};
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
//this function will attempt to find video or audio elements for the id passed in and if start is true, attempt to play it, otherwise attempt to stop it
MediaPlayer.ExternalMediaToggle = function(start, id){
    if (typeof(MediaPlayer.audio.files[id]) != 'undefined'){
        if (start)
            MediaPlayer.audio.play(id);
        else
            MediaPlayer.audio.stop();
    }
    if (typeof(MediaPlayer.video.files[id]) != 'undefined'){
        if (start)
            MediaPlayer.video.play(id);
        else
            MediaPlayer.video.stop();
    }
}
MediaPlayer.video = {activeElement:null, files : {}, flashPlayerSrc: ''};
MediaPlayer.video.add = function(src, id, mimeType, autoPlay, streamUrl, containerId, width, height){
	MediaPlayer.video.files[id] = {src:src, id:id, mimeType:mimeType, autoPlay:autoPlay, streamUrl:streamUrl, containerId:containerId, width:width, height:height};
}
MediaPlayer.video.stop = function () {
    if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof (MediaPlayer.video.activeElement) != 'undefined') {
        MediaPlayer.video.activeElement.pause();
        MediaPlayer.status.action = MediaPlayer.actions.paused;
    }
    else {
        if (typeof (MediaPlayer.video.activeElement) != 'undefined') {
            try {
                MediaPlayer.video.activeElement.GotoFrame(5); // stop
        } catch (e) { }; }
        MediaPlayer.status.action = MediaPlayer.actions.none;
    }
}
MediaPlayer.video.play = function(id){

	if (MediaPlayer.status.action != MediaPlayer.actions.none 
		&& (MediaPlayer.status.type != MediaPlayer.types.video 
		&& id != MediaPlayer.status.id)){
		MediaPlayer.stopCurrentActiveMedia();

        MediaPlayer.controls.toggleToggleImage('play');
        MediaPlayer.controls.unsetAutoUpdate();
	}
    
    if (MediaPlayer.status.type == MediaPlayer.types.video && (id == MediaPlayer.status.id || typeof(id) == 'undefined') && MediaPlayer.status.action == MediaPlayer.actions.playing){
		MediaPlayer.logs.push('pausing video');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.video.activeElement) != 'undefined'){
			MediaPlayer.video.activeElement.pause();
			MediaPlayer.status.action = MediaPlayer.actions.paused;
            
            
            MediaPlayer.controls.toggleToggleImage('play');
            MediaPlayer.controls.unsetAutoUpdate();
		}
        else {
            if (typeof (MediaPlayer.video.activeElement) != 'undefined')
                MediaPlayer.video.activeElement.GotoFrame(5); // stop
			MediaPlayer.status.action = MediaPlayer.actions.paused;
		}
	}else if (MediaPlayer.status.type == MediaPlayer.types.video && (id == MediaPlayer.status.id || typeof(id) == 'undefined')){
		MediaPlayer.logs.push('continuing video');
		if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof(MediaPlayer.video.activeElement) != 'undefined'){
			MediaPlayer.video.activeElement.play();
			MediaPlayer.status.action = MediaPlayer.actions.playing;

            MediaPlayer.controls.toggleToggleImage('pause');
            MediaPlayer.controls.setAutoUpdate();
		}
		else{
		    //start playing flash again
		    if (typeof (MediaPlayer.video.activeElement) != 'undefined')
		        MediaPlayer.video.activeElement.GotoFrame(4); // start
			MediaPlayer.status.action = MediaPlayer.actions.playing;
		}
	}
	else
	{
		if (typeof(MediaPlayer.video.files[id]) != 'undefined'){
			MediaPlayer.status.type = MediaPlayer.types.video;
			MediaPlayer.status.id = id;
			if (MediaPlayer.support.flashVideo()){
				MediaPlayer.video.activeElement = document.createElement('embed');
				MediaPlayer.video.activeElement.src = MediaPlayer.video.flashPlayerSrc + '?res=' + MediaPlayer.video.files[id].src + '&autostart=true&protocol=http'; 
				MediaPlayer.video.activeElement.setAttribute('FlashVars', 'res=' + MediaPlayer.video.files[id].src + '&autostart=true&protocol=http');				
				MediaPlayer.video.activeElement.setAttribute('quality', 'high');
				MediaPlayer.video.activeElement.setAttribute('scale', 'exactfit');
				MediaPlayer.video.activeElement.setAttribute('width', MediaPlayer.video.files[id].width);
				MediaPlayer.video.activeElement.setAttribute('menu', 'false');
				MediaPlayer.video.activeElement.setAttribute('height', MediaPlayer.video.files[id].height);
				MediaPlayer.video.activeElement.setAttribute('salign','1');
				MediaPlayer.video.activeElement.setAttribute('swLiveConnect','true');
				MediaPlayer.video.activeElement.name='flashVideo' + id;
				MediaPlayer.video.activeElement.id= 'flashVideo' + id;
				MediaPlayer.video.activeElement.setAttribute('allowScriptAccess', 'sameDomain');
				MediaPlayer.video.activeElement.type='application/x-shockwave-flash';
				MediaPlayer.video.activeElement.setAttribute('PluginsPage', 'http://www.macromedia.com/go/getflashplayer');
				
               if (typeof(MediaPlayer.video.files[id].containerId) != 'undefined' && MediaPlayer.video.files[id].containerdD != '')
				{
					var containerElm = document.getElementById(MediaPlayer.video.files[id].containerId);
					containerElm.innerHTML = '';
					containerElm.appendChild(MediaPlayer.video.activeElement);
				}

				var checkFlash = function(){
					if (typeof(MediaPlayer.video.activeElement) == 'undefined')// || MediaPlayer.video.activeElement.PercentLoaded() < 100)
					{	window.setTimeout(checkFlash, 500);}
					else
					{
						//MediaPlayer.video.activeElement.SetVariable('currentSong', 'http://test.wecomply.com' + MediaPlayer.video.files[id].src);
						//MediaPlayer.video.activeElement.TCallLabel('/','load');
						//MediaPlayer.video.activeElement.TCallLabel('/','play');
						//MediaPlayer.video.activeElement.SetVariable('onSongOver', function(){
							//MediaPlayer.status.action = MediaPlayer.actions.playing;
						//});
						MediaPlayer.status.action = MediaPlayer.actions.playing;
					}
				}
				//window.setTimeout(checkFlash, 500);
				
				MediaPlayer.logs.push('playing flash video');
			}
			else if (MediaPlayer.support.html5Video(true)){
				MediaPlayer.status.platform = MediaPlayer.platforms.html5;
				MediaPlayer.logs.push('playing html5 video');
				
				if (typeof(MediaPlayer.video.activeElement) == 'undefined' || MediaPlayer.video.activeElement == null)
				{	MediaPlayer.video.activeElement = document.createElement('video');}
				else
				{try{MediaPlayer.video.activeElement.stop();}catch(e){}}
				MediaPlayer.video.activeElement.autoplay = true;
				
				if (typeof(MediaPlayer.video.files[id].width) != 'undefined' && MediaPlayer.video.files[id].width > 0)
					MediaPlayer.video.activeElement.width = MediaPlayer.video.files[id].width;
				if (typeof(MediaPlayer.video.files[id].height) != 'undefined' && MediaPlayer.video.files[id].height > 0)
					MediaPlayer.video.activeElement.height = MediaPlayer.video.files[id].height;

				//MediaPlayer.video.activeElement.src = MediaPlayer.video.files[id].src.replace('.flv', '.mp4');
				MediaPlayer.video.activeElement.id = 'videoElement' + id;
				/*MediaPlayer.video.activeElement.addEventListener('ended', function(){
					this.currentTime = 0;
					this.pause();
					MediaPlayer.status.action = MediaPlayer.actions.none;
				}, false);*/

				
				
				var source= document.createElement('source');
				source.type= 'video/mp4';
				//source.type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
				source.id = 'video' + id + '_mp4';
				source.src= MediaPlayer.video.files[id].src.replace('.flv', '.mp4');
				MediaPlayer.video.activeElement.appendChild(source);
				MediaPlayer.video.activeElement.controls = false;
                MediaPlayer.video.activeElement.onended = function(){
                    MediaPlayer.status.action = MediaPlayer.actions.stopped;				
                }
				
				if (typeof(MediaPlayer.video.files[id].containerId) != 'undefined' && MediaPlayer.video.files[id].containerdD != '')
				{
					var containerElm = document.getElementById(MediaPlayer.video.files[id].containerId);
					containerElm.innerHTML = '';
					containerElm.appendChild(MediaPlayer.video.activeElement);

                    containerElm.appendChild(MediaPlayer.controls.generate());
                    MediaPlayer.controls.toggleToggleImage('pause');
                    MediaPlayer.controls.setAutoUpdate(MediaPlayer.video.activeElement, 0);
				}
				MediaPlayer.video.activeElement.play();
				MediaPlayer.status.action = MediaPlayer.actions.playing;				
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
MediaPlayer.controls = {element : null,autoElement : null, intval: null, updateActive:false};
MediaPlayer.controls.setAutoUpdate = function(autoElement, startProgress){

    if (typeof(autoElement) == 'undefined' && typeof(MediaPlayer.controls.autoElement) != 'undefined')
    {
        MediaPlayer.controls.intval = self.setInterval(MediaPlayer.controls.autoUpdate, 1000);
    }
    else{
        MediaPlayer.controls.autoElement = autoElement;
        MediaPlayer.controls.update(startProgress);
        MediaPlayer.controls.intval = self.setInterval(MediaPlayer.controls.autoUpdate, 1000);
    }
    MediaPlayer.controls.updateActive = false;
}
MediaPlayer.controls.unsetAutoUpdate = function(){
    MediaPlayer.controls.updateActive = true; 
   try{ self.clearInterval(MediaPlayer.controls.inval);}catch(e){}
}
MediaPlayer.controls.autoUpdate = function(){
    try{
    var progress = (100 / MediaPlayer.controls.autoElement.duration) * MediaPlayer.controls.autoElement.currentTime;
    MediaPlayer.controls.update(parseInt(progress));
    }catch(e){alert(e);}
}

MediaPlayer.controls.update = function (progress){
    if (MediaPlayer.controls.updateActive)
        return;

    MediaPlayer.controls.updateActive = true;

    if (typeof(MediaPlayer.element) == 'undefined')
        MediaPlayer.controls.element = MediaPlayer.controls.generate();
        
    var progressBar = MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsProgressBar');
    var seekerBar = MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar');
   // var progressBar = document.getElementById('mediaPlayerControlsProgressBar');
    //var seekerBar = document.getElementById('mediaPlayerControlsSeekerBar');
    
    var progressBarWidth = parseInt(progressBar.style.width);
    var seekerBarWidth = parseInt(seekerBar.style.width);
    var newProgressWidth = (progressBarWidth / 100) * progress;
    
    var currentProgress = (progressBarWidth / 100) * seekerBarWidth;

    if (currentProgress > progress)
        seekerBar.style.width = newProgressWidth;
    else
        MediaPlayer.controls.animateSeekerbar(newProgressWidth);
    
       

    MediaPlayer.controls.updateActive = false;
}
MediaPlayer.controls.animateSeekerbar = function(endPosition){
    if (parseInt(MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width) < endPosition){   
        //var tweenAmount = (endPosition - MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width)/MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsProgressBar').style.width;
        //alert(tweenAmount);
        var tweenAmount = 1;
        MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width = (parseInt(MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width) + tweenAmount) + ('px')

        setTimeout('MediaPlayer.controls.animateSeekerbar(' + endPosition + ')', 5);
    }
}
MediaPlayer.controls.toggleToggleImage = function(newImg){
    try{
    var playPauseToggleImage = MediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsPlayPauseToggleImage');
    playPauseToggleImage.src = '../images/training/button_blue_' + newImg + '.png';}catch(e){}
}
MediaPlayer.controls.generate = function (){
    var controlContainer = document.createElement('div');
    controlContainer.style.width = 100 + 'px';
    controlContainer.style.height = 20 + 'px';
    //controlContainer.style.backgroundColor = '';
    controlContainer.style.paddingTop = 5 + 'px';
    controlContainer.id = 'mediaPlayerControlsContainer';
    
    var progressBar = document.createElement('div');
    progressBar.style.height = 10 + 'px';
    progressBar.style.width = 70 + 'px';
    progressBar.style.marginLeft = 10 + 'px';
    progressBar.style.backgroundColor = '#dedede';
    progressBar.id = 'mediaPlayerControlsProgressBar';
    progressBar.style.float = 'left';
    progressBar.onclick = function(e){
        var cords = MediaPlayer.GetClickCoordsWithinElement(e);
        var seekPercentage = (100 / parseInt(progressBar.style.width)) * cords.x;
        var duration = MediaPlayer.video.activeElement.duration;
        var newVideoTime = (duration / 100) * seekPercentage;
        //alert(newVideoTime + ' - ' + seekPercentage);
        MediaPlayer.video.activeElement.currentTime = parseInt(newVideoTime);
        MediaPlayer.controls.update(seekPercentage);

    }


    var seekerBar = document.createElement('div');
    seekerBar.style.height = 10 + 'px';
    seekerBar.style.width = 0 + 'px';
    seekerBar.style.backgroundColor = '#a87622';
    seekerBar.id = 'mediaPlayerControlsSeekerBar';
    progressBar.appendChild(seekerBar);

    var playPauseToggle = document.createElement('div');
    var playPauseToggleImage = document.createElement('img');
    playPauseToggle.style.float = 'left';
    playPauseToggle.style.marginLeft = 2 + 'px';
    playPauseToggle.style.height = 10  + 'px';
    playPauseToggleImage.src = '../images/training/button_blue_play.png';
    playPauseToggleImage.id = 'mediaPlayerControlsPlayPauseToggleImage'
    playPauseToggleImage.style.height = 10  + 'px';
    playPauseToggleImage.onclick = function(){MediaPlayer.video.play();}
    playPauseToggle.appendChild(playPauseToggleImage);

    controlContainer.appendChild(progressBar);
    controlContainer.appendChild(playPauseToggle);

    return controlContainer;
}

MediaPlayer.audio = {activeElement:null, files : {}, flashPlayerSrc: ''};
MediaPlayer.audio.add = function (src, id) {
    src = src.replace('.flv', '.mp3');
    //src = '/wc2/static/training/creeeeak.mp3';
    //src = 'http://test.wecomply.com/datafiles/media-165920.mp3'
	MediaPlayer.audio.files[id] = {src:src, id:id};
}
MediaPlayer.audio.stop = function () {
    if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof (MediaPlayer.audio.activeElement) != 'undefined') {
        MediaPlayer.audio.activeElement.pause();
        MediaPlayer.status.action = MediaPlayer.actions.paused;
    }
    else {
        if (typeof (MediaPlayer.audio.activeElement) != 'undefined')
            MediaPlayer.audio.activeElement.TCallLabel('/', 'stop');
        MediaPlayer.status.action = MediaPlayer.actions.none;
    }
}
MediaPlayer.audio.play = function (id) {

    if (MediaPlayer.status.action != MediaPlayer.actions.none
		&& (MediaPlayer.status.type != MediaPlayer.types.audio
		&& id != MediaPlayer.status.id)) {
        MediaPlayer.stopCurrentActiveMedia();
    }

    if (MediaPlayer.status.type == MediaPlayer.types.audio && id == MediaPlayer.status.id && MediaPlayer.status.action == MediaPlayer.actions.playing) {
        MediaPlayer.logs.push('pausing audio');
        if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof (MediaPlayer.audio.activeElement) != 'undefined') {
            MediaPlayer.audio.activeElement.pause();
            MediaPlayer.status.action = MediaPlayer.actions.paused;
        }
        else {
            if (typeof (MediaPlayer.audio.activeElement) != 'undefined')
                MediaPlayer.audio.activeElement.TCallLabel('/', 'pause');
            MediaPlayer.status.action = MediaPlayer.actions.paused;
        }
    } else if (MediaPlayer.status.type == MediaPlayer.types.audio && id == MediaPlayer.status.id) {
        MediaPlayer.logs.push('continuing audio');
        if (MediaPlayer.status.platform == MediaPlayer.platforms.html5 && typeof (MediaPlayer.audio.activeElement) != 'undefined') {
            MediaPlayer.audio.activeElement.play();
            MediaPlayer.status.action = MediaPlayer.actions.playing;
        }
        else {
            //start playing flash again
            if (typeof(MediaPlayer.audio.activeElement) != 'undefined')
                MediaPlayer.audio.activeElement.TCallLabel('/', 'play');
            MediaPlayer.status.action = MediaPlayer.actions.playing;
        }
    }
    else {
        if (typeof (MediaPlayer.audio.files[id]) != 'undefined') {
            MediaPlayer.status.type = MediaPlayer.types.audio;
            MediaPlayer.status.id = id;
            if (MediaPlayer.support.flashAudio()) {

                /*MediaPlayer.audio.activeElement = document.createElement('embed');
                //<!--flashfile.swf?file=mp3file.mp4&as=1 (as=autostart) , if these prams -->
                //MediaPlayer.audio.activeElement.setAttribute('FlashVars', 'res=' + MediaPlayer.audio.files[id].src + '&autostart=true&protocol=http');				
                MediaPlayer.audio.activeElement.setAttribute('quality', 'high');
                MediaPlayer.audio.activeElement.setAttribute('scale', 'exactfit');
                MediaPlayer.audio.activeElement.setAttribute('width', 300);
                MediaPlayer.audio.activeElement.setAttribute('menu', 'false');
                MediaPlayer.audio.activeElement.setAttribute('height', 300);
                //MediaPlayer.audio.activeElement.setAttribute('salign','1');
                //MediaPlayer.audio.activeElement.setAttribute('swLiveConnect','true');
                MediaPlayer.audio.activeElement.setAttribute('allowScriptAccess', 'sameDomain');
                //MediaPlayer.audio.activeElement.setAttribute('style', 'left:-1000px;');
                MediaPlayer.audio.activeElement.type = 'application/x-shockwave-flash';
                MediaPlayer.audio.activeElement.setAttribute('PluginsPage', 'http://www.macromedia.com/go/getflashplayer');
                //document.createElement('audio');
                MediaPlayer.audio.activeElement.id = 'flashAudio' + id;
                MediaPlayer.audio.activeElement.name = 'flashAudio' + id;*/

                var flashvars = { res: MediaPlayer.audio.files[id].src, autostart: true, protocol: 'http' };
                var params = {};
                var attributes = { id: 'flashAudio' + id };
                swfobject.embedSWF(MediaPlayer.audio.flashPlayerSrc, 'AudioContainer' + id, '0', '0', '6', false, flashvars, params, attributes);
                
                MediaPlayer.audio.activeElement = document.getElementById('flashAudio' + id);
                //TODO: remove flash that are not being used from the memory

                //document.getElementById('AudioContainer' + id).innerHTML = '';
                //document.getElementById('AudioContainer' + id).appendChild(MediaPlayer.audio.activeElement);
                //alert(document.getElementById('AudioContainer' + id).innerHTML);
                //swfobject.registerObject('AudioContainer' + id, "6", "expressInstall.swf");

                //MediaPlayer.audio.activeElement.src = MediaPlayer.audio.flashPlayerSrc;
                //MediaPlayer.audio.activeElement.name = 'flashAudio' + id;
                //MediaPlayer.audio.activeElement.id = 'flashAudio' + id;
                //MediaPlayer.audio.activeElement.GotoFrame(5);//stop
                //MediaPlayer.audio.activeElement.GotoFrame(6);//gotobeginning
                //MediaPlayer.audio.activeElement.GotoFrame(4);//play
                window.checkFlashTestCount = 0;
                var checkFlash = function () {

                    if (typeof (MediaPlayer.audio.activeElement) == 'undefined')
                        MediaPlayer.audio.activeElement = document.getElementById('flashAudio' + id);

                    if (typeof (MediaPlayer.audio.activeElement) == 'undefined' || MediaPlayer.audio.activeElement.PercentLoaded() < 100) {
                        var timeoutValue = 500;
                        if (window.checkFlashTestCount > 10)
                            return;
                        else if (window.checkFlashTestCount > 3)
                        { timeoutValue = 5000; }

                        if (window.checkFlashTestCount == 3)
                        //alert('Flash not yet loaded');

                            window.checkFlashTestCount++;
                        window.setTimeout(checkFlash, timeoutValue);
                    }
                    else {
                        window.checkFlashTestCount = 0;
                        MediaPlayer.audio.activeElement.SetVariable('currentSong', MediaPlayer.audio.files[id].src);
                        MediaPlayer.audio.activeElement.TCallLabel('/', 'load');
                        MediaPlayer.audio.activeElement.TCallLabel('/', 'play');
                        MediaPlayer.audio.activeElement.SetVariable('onSongOver', function () {
                            MediaPlayer.status.action = MediaPlayer.actions.playing;
                        });
                        MediaPlayer.status.action = MediaPlayer.actions.playing;
                    }
                }
                window.setTimeout(checkFlash, 500);

                MediaPlayer.logs.push('playing flash audio');
            }
            else if (MediaPlayer.support.html5Audio(true)) {
                MediaPlayer.status.platform = MediaPlayer.platforms.html5;
                MediaPlayer.logs.push('playing html5 audio');
                if (typeof (MediaPlayer.audio.activeElement) == 'undefined' || MediaPlayer.audio.activeElement == null)
                { MediaPlayer.audio.activeElement = document.createElement('audio'); }
                else
                { try { MediaPlayer.audio.activeElement.stop(); } catch (e) { } }

                try { MediaPlayer.audio.activeElement.src = MediaPlayer.audio.files[id].src.replace('.flv', '.mp3'); } catch (e1) { MediaPlayer.audio.activeElement.src = MediaPlayer.audio.files[id].src; }
                MediaPlayer.audio.activeElement.addEventListener('ended', function () {
                    this.currentTime = 0;
                    this.pause();
                    MediaPlayer.status.action = MediaPlayer.actions.paused;
                }, false);

                MediaPlayer.audio.activeElement.play();
                MediaPlayer.status.action = MediaPlayer.actions.playing;
            }
            else {
                alert('no support');
                MediaPlayer.logs.push('not sufficient audio support');
            }
        }
        else {
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

MediaPlayer.GetClickCoordsWithinElement = function(event){
	var coords = { x: 0, y: 0};
 
	if(!event) // then we're in a non-DOM (probably IE) browser
	{
		event = window.event;
		coords.x = event.offsetX;
		coords.y = event.offsetY;
	}
	else		// we assume DOM modeled javascript
	{
		var Element = event.target ;
		var CalculatedTotalOffsetLeft = 0;
		var CalculatedTotalOffsetTop = 0 ;
 
		while (Element.offsetParent)
 		{
 			CalculatedTotalOffsetLeft += Element.offsetLeft ;     
			CalculatedTotalOffsetTop += Element.offsetTop ;
 			Element = Element.offsetParent ;
 		}
 
		coords.x = event.pageX - CalculatedTotalOffsetLeft ;
		coords.y = event.pageY - CalculatedTotalOffsetTop ;
	}
 
	return coords;
}
