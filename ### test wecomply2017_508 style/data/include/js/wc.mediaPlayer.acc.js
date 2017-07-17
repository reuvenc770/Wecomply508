if (typeof (wc) == 'undefined')
	wc = {};


//flash-mp3-player.net/players/js
//audio flash player
wc.mediaPlayer = { debugMode: false, platforms: { flash: 1, html5: 2, none: 0 }, types: { video: 1, audio: 2, none: 0 }, actions: { playing: 1, paused: 2, stopped: 3, none: 0} };
var wcMediaPlayerAudioListener = new Object();
wcMediaPlayerAudioListener.onInit = function () {
	if (isDefined(wc.mediaPlayer.tmpAudioPosition))
		this.position = wc.mediaPlayer.tmpAudioPosition;
	wc.mediaPlayer.tmpAudioPosition = 0;

};
wc.mediaPlayer.dataFilePath = '/datafiles/';
wc.mediaPlayer.flashvideodatafilepath = '/datafiles/';
wc.mediaPlayer.status = { action: wc.mediaPlayer.actions.none, platform: wc.mediaPlayer.platforms.none, type: wc.mediaPlayer.types.none, chapterIndex: 0, mimeType: null };
wc.mediaPlayer.support = {};
wc.mediaPlayer.support.html5Audio = function(checkMp3Specific) {
	var audioElm;
	try {
		audioElm = document.createElement('audio');
	} catch(e) {
		return false;
	}

	if (typeof(audioElm) == 'undefined' || audioElm == null || !audioElm.canPlayType)
		return false;

	if (checkMp3Specific)
		return audioElm.canPlayType('audio/mpeg');
	else
		return true;
};
wc.mediaPlayer.support.flashAudio = function() {
	var playerVersion = swfobject.getFlashPlayerVersion();
	if (playerVersion.major > 6)
		return true;
	else
		return false;
};
wc.mediaPlayer.support.flashVideo = function() {
	var playerVersion = swfobject.getFlashPlayerVersion();
	if (playerVersion.major > 8)
		return true;
	else
		return false;
};
wc.mediaPlayer.support.html5Video = function(checkMp4Specific) {
	var videoElm;
	try {
		videoElm = document.createElement('video');
	} catch(e) {
		return false;
	}

	if (typeof(videoElm) == 'undefined' || videoElm == null || !videoElm.canPlayType)
		return false;

	if (checkMp4Specific)
		return videoElm.canPlayType('video/mp4; codecs="avc1.42E01E"') == 'probably' || videoElm.canPlayType('video/mp4; codecs="avc1.42E01E"') == 'maybe';
	else
		return true;
};
//This function will cleanup all known video and audio elements
wc.mediaPlayer.cleanup = function () {
	try {
		try {
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
			wc.mediaPlayer.status.platform = wc.mediaPlayer.platforms.none;
			wc.mediaPlayer.status.type = wc.mediaPlayer.types.none;
			wc.mediaPlayer.status.chapterIndex = 0;
			wc.mediaPlayer.status.mimeType =null;
		}
		catch (e) {
		}


		if (isDefined(wc.mediaPlayer.video.activeElement)) {
		if (wc.mediaPlayer.video.activeElement.controls != 'undefined' && isDefined(wc.mediaPlayer.video.activeElement.controls) && wc.mediaPlayer.video.activeElement.controls.isAvailable('Stop'))
				wc.mediaPlayer.video.activeElement.controls.stop();

			// this shouldn't be necessary, but it is in IE
			wc.mediaPlayer.video.activeElement.style.display='none';
			flushThis('viewPort');
//alert('cleaned up');
		}

		//TODO: cleanup HTML5 audio
		//TODO: cleanup video (both video or audio)
		try { $f().unload(); } catch (e1) { }
		if (isDefined(wc.mediaPlayer.audio.activeElement)) {
			if (isDefined(wc.mediaPlayer.audio.activeElement) && isDefined(wc.mediaPlayer.audio.activeElement.unload))
				try { wc.mediaPlayer.audio.activeElement.unload(); } catch (e2) { }

			var oldElement = document.getElementById('flashAudio' + wc.interface.currentElement.chapterIndex);
			if (isDefined(oldElement)) {
				oldElement.innerHTML = '';
				oldElement.parentNode.removeChild(oldElement);
			}

			wc.mediaPlayer.audio.activeElement = null;
		}
		var audioContainerId = 'AudioPlayerContainer';
		var audioContainerElement = document.getElementById(audioContainerId);
		if (isDefined(audioContainerElement)) {
			while (audioContainerElement.firstChild) {
				audioContainerElement.removeChild(audioContainerElement.firstChild);
			}

			audioContainerElement.parentNode.removeChild(audioContainerElement);
		}

		wc.mediaPlayer.tmpAudioPosition = 0;

	} catch (e) {
		alert(e);
	}
};
//this function will attempt to find video or audio elements for the id passed in and if start is true, attempt to play it, otherwise attempt to stop it
wc.mediaPlayer.ExternalMediaToggle = function (start, chapterIndex) {
	wc.mediaPlayer.logs.push('Calling audio.play from ExternalMediaToggle');
	if (typeof (wc.data.jsonData.chapters[chapterIndex].audio) != 'undefined') {
		if (start)
			wc.mediaPlayer.audio.play(chapterIndex);
		else
			wc.mediaPlayer.audio.stop();
	}
	if (typeof (wc.data.jsonData.chapters[chapterIndex].video) != 'undefined') {
		if (start)
			wc.mediaPlayer.video.play(chapterIndex);
		else
			wc.mediaPlayer.video.stop();
	}
};
wc.mediaPlayer.video = {activeElement:null, files : {}, flashPlayerSrc: ''};
wc.mediaPlayer.video.add = function(src, chapterIndex, mimeType, autoPlay, streamUrl, containerId, width, height) {
	wc.data.jsonData.chapters[chapterIndex].video = { src: src, chapterIndex: chapterIndex, mimeType: mimeType, autoPlay: autoPlay, streamUrl: streamUrl, containerId: containerId, width: width, height: height };
};
wc.mediaPlayer.video.stop = function() {
	if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && (typeof (wc.mediaPlayer.video.activeElement) != 'undefined') && (wc.mediaPlayer.video.activeElement != null)) {
		wc.mediaPlayer.video.activeElement.pause();
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
	} else {
		if (typeof(wc.mediaPlayer.video.activeElement) != 'undefined' &&  wc.mediaPlayer.video.activeElement != null && wc.mediaPlayer.video.activeElement.controls != 'undefined' && wc.mediaPlayer.video.activeElement.controls != null) {
			try {
//				wc.mediaPlayer.video.activeElement.GotoFrame(5); // stop
// accenture 
//alert("stopping previous video - hello");
//wc.mediaPlayer.video.activeElement.controls.stop();
					if (wc.mediaPlayer.video.activeElement.controls != 'undefined' && wc.mediaPlayer.video.activeElement.controls.isAvailable('Stop'))
						wc.mediaPlayer.video.activeElement.controls.stop();


// this shouldn't be necessary, but it is in IE
wc.mediaPlayer.video.activeElement.style.display='none';

wc.mediaPlayer.video.activeElement.style.display='none';

//wc.mediaPlayer.video.activeElement.style.opacity=99;

//alert("done stopping and hiding");
//wc.mediaPlayer.video.activeElement.controls.close();

//wc.mediaPlayer.video.activeElement.controls.Dispose();
//alert("active media " + wc.mediaPlayer.video.activeElement.toString());
//alert("player status " + wc.mediaPlayer.video.activeElement.status);
//wc.mediaPlayer.video.activeElement.Ctlcontrols.stop();

//wc.mediaPlayer.video.activeElement.Ctlcontrols.Dispose();
var videocontainer = wc.mediaPlayer.video.activeElement.parentNode;
//alert("container html " + videocontainer.innerHTML);
//videocontainer.innerHTML="";
//alert("done clearing video");

			} catch(e) {
alert("caught error " + e.message);
			}
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
		}		
	}
};
wc.mediaPlayer.video.pause = function () {
	if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.video.activeElement) != 'undefined') {
		wc.mediaPlayer.video.activeElement.pause();
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
	} else {
		if (typeof (wc.mediaPlayer.video.activeElement) != 'undefined') {
			try {
				wc.mediaPlayer.video.activeElement.GotoFrame(5); // stop
			} catch (e) {
			}
			;
		}
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
	}
};

wc.mediaPlayer.video.videoParams = { chapterIndex:0, containerElementId : '', fileSrc : '', width:0,height:0};
wc.mediaPlayer.video.populateVideoParamsFromChapter = function (chapterIndex) {
	wc.mediaPlayer.video.videoParams = { chapterIndex: chapterIndex, containerElementId: 'Chapter_Video_Container', fileSrc: wc.data.jsonData.chapters[chapterIndex].video.src, width: wc.data.jsonData.chapters[chapterIndex].video.width, height: wc.data.jsonData.chapters[chapterIndex].video.height };
	return wc.mediaPlayer.video.videoParams;
};
wc.mediaPlayer.video.play = function (param)
{

	if (!isDefined(param))
	{
		param = wc.mediaPlayer.video.videoParams;
	} else
	{
		if (typeof (param) != 'object')
		{
			var chapterIndex = param;
			param = wc.mediaPlayer.video.populateVideoParamsFromChapter(chapterIndex);
		} else
		{
			wc.mediaPlayer.video.videoParams = param;
		}
	}



	if (wc.mediaPlayer.status.action != wc.mediaPlayer.actions.none
		&& (wc.mediaPlayer.status.type != wc.mediaPlayer.types.video
		&& param.chapterIndex != wc.mediaPlayer.status.chapterIndex))
	{
		wc.mediaPlayer.stopCurrentActiveMedia();

		wc.mediaPlayer.controls.toggleToggleImage('play');
		wc.mediaPlayer.controls.unsetAutoUpdate();
	}

	if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.video && (param.chapterIndex == wc.mediaPlayer.status.chapterIndex || typeof (param.chapterIndex) == 'undefined') && wc.mediaPlayer.status.action == wc.mediaPlayer.actions.playing)
	{
		wc.mediaPlayer.logs.push('pausing video');
		if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.video.activeElement) != 'undefined')
		{
			wc.mediaPlayer.video.activeElement.pause();
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;


			wc.mediaPlayer.controls.toggleToggleImage('play');
			wc.mediaPlayer.controls.unsetAutoUpdate();
		}
		else
		{
			if (typeof (wc.mediaPlayer.video.activeElement) != 'undefined')
				wc.mediaPlayer.video.activeElement.GotoFrame(5); // stop
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
		}
	} else if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.video && (param.chapterIndex == wc.mediaPlayer.status.chapterIndex || typeof (param.chapterIndex) == 'undefined'))
	{
		wc.mediaPlayer.logs.push('continuing video');
		if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.video.activeElement) != 'undefined')
		{
			wc.mediaPlayer.video.activeElement.play();
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;

			wc.mediaPlayer.controls.toggleToggleImage('pause');
			wc.mediaPlayer.controls.setAutoUpdate();
		}
		else
		{
			//start playing flash again
			if (typeof (wc.mediaPlayer.video.activeElement) != 'undefined')
			{
				try
				{
					wc.mediaPlayer.video.activeElement.GotoFrame(4); // start
				} catch (e)
				{
				}
				;

			}
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
		}
	}
	else
	{
		if (typeof (wc.mediaPlayer.video.videoParams) != 'undefined')
		{
			wc.mediaPlayer.status.type = wc.mediaPlayer.types.video;
			wc.mediaPlayer.status.chapterIndex = param.chapterIndex;
			if (wc.mediaPlayer.support.flashVideo())
			{
				//wc.mediaPlayer.video.activeElement = document.createElement('embed');
				//wc.mediaPlayer.video.activeElement.src = wc.mediaPlayer.video.flashPlayerSrc + '?res=' + wc.mediaPlayer.flashvideodatafilepath + param.fileSrc + '&autostart=true&protocol=http';
				//wc.mediaPlayer.video.activeElement.setAttribute('FlashVars', 'res=' + wc.mediaPlayer.flashvideodatafilepath + param.fileSrc + '&autostart=true&protocol=http');
				//wc.mediaPlayer.video.activeElement.setAttribute('quality', 'high');
				//wc.mediaPlayer.video.activeElement.setAttribute('scale', 'exactfit');
				//wc.mediaPlayer.video.activeElement.setAttribute('tabindex', '-1');

				//if (wc.interface.options.mediaPlayer.videoSizePercentage != null && typeof (wc.interface.options.mediaPlayer.videoSizePercentage) != 'undefined')
				//{
				//	wc.mediaPlayer.video.activeElement.setAttribute('width', (param.width / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
				//	wc.mediaPlayer.video.activeElement.setAttribute('height', (param.height / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
				//}

				//wc.mediaPlayer.video.activeElement.setAttribute('menu', 'false');
				//wc.mediaPlayer.video.activeElement.setAttribute('salign', '1');
				//wc.mediaPlayer.video.activeElement.setAttribute('swLiveConnect', 'true');
				//wc.mediaPlayer.video.activeElement.name = 'flashVideo' + param.chapterIndex;
				//wc.mediaPlayer.video.activeElement.id = 'flashVideo' + param.chapterIndex;
				//wc.mediaPlayer.video.activeElement.setAttribute('allowScriptAccess', 'sameDomain');
				//wc.mediaPlayer.video.activeElement.type = 'application/x-shockwave-flash';
				//wc.mediaPlayer.video.activeElement.setAttribute('PluginsPage', 'http://www.macromedia.com/go/getflashplayer');
				
				//swap to wmv for accenture

				// clear out any old video content

//alert("seeing if i can find flashVideo" + param.chapterIndex-1);

				var currentmediaobject = document.getElementById('MediaPlayer');
//alert("seeing if i can find flashVideo" + 1);
				if (currentmediaobject != null && currentmediaobject.controls != 'undefined' && currentmediaobject.controls != null) {
//alert('stoping video');
					if (currentmediaobject.controls != 'undefined' && currentmediaobject.controls != null && currentmediaobject.controls.isAvailable('Stop'))
						currentmediaobject.controls.stop();
//alert('video should be stopped');
				}

				if (wc.mediaPlayer.video.activeElement != null && wc.mediaPlayer.video.activeElement.innerHTML != null)
				{
        			//	var wmp = new Object();
        			//	wmp.wmv = wc.mediaPlayer.video.activeElement;
        			//	wmp.wmv.controls.stop();
				//	wc.mediaPlayer.video.activeElement.innerHTML = "";
				}
//alert('starting to build next video');

				param.fileSrc = param.fileSrc.replace('.flv', '.wmv');
	
				embedelement = document.createElement('embed');
				embedelement.src = wc.mediaPlayer.dataFilePath + param.fileSrc;

				embedelement.setAttribute('TYPE', 'application/x-mplayer2');

				embedelement.setAttribute('NAME', 'MediaPlayer1');

				embedelement.setAttribute('ShowControls', '1');
				embedelement.setAttribute('ShowStatusBar', '0');
				embedelement.setAttribute('ShowDisplay', '0');
				embedelement.setAttribute('AutoStart', '1');

				if (wc.interface.options.mediaPlayer.videoSizePercentage != null && typeof (wc.interface.options.mediaPlayer.videoSizePercentage) != 'undefined')
				{
					embedelement.setAttribute('width', (param.width / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
					embedelement.setAttribute('height', (param.height / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
				}

				//embedelement.name = 'flashVideo' + param.chapterIndex;
				//embedelement.id = 'flashVideo' + param.chapterIndex;
				embedelement.id = 'flashVideo';
				embedelement.setAttribute('allowScriptAccess', 'sameDomain');

				var tmpobject = document.createElement('object');

				tmpobject.setAttribute('TYPE', 'application/x-oleobject');

				//tmpobject.setAttribute('TYPE', 'video/x-ms-asf');
				tmpobject.setAttribute('ID', 'MediaPlayer');

				tmpobject.setAttribute('CLASSID', 'CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6');
				//tmpobject.setAttribute('STANDBY', 'Loading Windows Media Player components...');
				if (wc.interface.options.mediaPlayer.videoSizePercentage != null && typeof (wc.interface.options.mediaPlayer.videoSizePercentage) != 'undefined')
				{
					tmpobject.setAttribute('width', (param.width / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
					tmpobject.setAttribute('height', (param.height / 100) * wc.interface.options.mediaPlayer.videoSizePercentage);
				}


				//tmpobject.setAttribute('URL', wc.mediaPlayer.dataFilePath + param.fileSrc);

				var FileName = document.createElement('PARAM');
				FileName.setAttribute('name','FileName');
				FileName.setAttribute('VALUE',wc.mediaPlayer.dataFilePath + param.fileSrc);

				var Filesrc = document.createElement('PARAM');
				Filesrc.setAttribute('name','URL');
				Filesrc.setAttribute('VALUE',wc.mediaPlayer.dataFilePath + param.fileSrc);

				var ShowControls = document.createElement('PARAM');
				ShowControls.setAttribute('name','ShowControls');
				ShowControls.setAttribute('VALUE','true');

				var ShowStatusBar = document.createElement('PARAM');
				ShowStatusBar.setAttribute('name','ShowStatusBar');
				ShowStatusBar.setAttribute('VALUE','false');

				var ShowDisplay = document.createElement('PARAM');
				ShowDisplay.setAttribute('name','ShowDisplay');
				ShowDisplay.setAttribute('VALUE','false');

				var autostart = document.createElement('PARAM');
				autostart.setAttribute('name','AutoStart');
				autostart.setAttribute('VALUE','True');
				//autostart.AutoStart = "True";

				//tmpobject.appendChild(FileName);
				tmpobject.appendChild(Filesrc);
				//tmpobject.appendChild(ShowControls);
				//tmpobject.appendChild(ShowStatusBar);
				//tmpobject.appendChild(ShowDisplay);
				tmpobject.appendChild(autostart);
			//	tmpobject.appendChild(embedelement);

if('\v' != 'v')
{
//tmpobject.appendChild(embedelement);
}

				//if (typeof(wc.data.jsonData.chapters[chapterIndex].video.containerId) != 'undefined' && wc.data.jsonData.chapters[chapterIndex].video.containerdD != '')
				//{
				var containerElm = document.getElementById(param.containerElementId);

// ok, windows media player is horrible.  You can not simply build a normal dom, ie will eat the object and not let you modify the xml at or below that level, so one has to construct the xml string directly.
				if (isDefined(containerElm))
				{
					//var children = containerElm.childNodes;
        				//var i = 0;
        				//for (i = 0; i < children.length; i++) {
            				//	containerElm.removeChild(document.getElementById(children[i].id));
        				//}
					containerElm.innerHTML = '';
//alert('about to add next video');
					containerElm.innerHTML = ' <OBJECT width=570 height=386 TYPE="application/x-oleobject" ID="MediaPlayer" CLASSID="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" codebase="http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=6,0,02,902" class="myPlugin"><param name="pluginurl" value="http://www.microsoft.com/Windows/MediaPlayer/" /><PARAM NAME="URL" VALUE="' + wc.mediaPlayer.flashvideodatafilepath + param.fileSrc + '"><PARAM NAME="ShowControls" VALUE="True"><PARAM NAME="ShowStatusBar" VALUE="True"><PARAM NAME="ShowDisplay" VALUE="True"><PARAM NAME="AutoStart" VALUE="True"><embed pluginspage="http://www.microsoft.com/Windows/MediaPlayer/" TYPE="application/x-mplayer2" NAME="MediaPlayer1" ShowControls="1" ShowStatusBar="1" ShowDisplay="1" AutoStart="1" height=386 width=570 id="flashVideo" allowStriptAccess="sameDomain" src="' + wc.mediaPlayer.flashvideodatafilepath + param.fileSrc + '"/> </OBJECT>';
			//		containerElm.appendChild(tmpobject);
			//		containerElm.appendChild(embedelement);
				}
				//}

				wc.mediaPlayer.video.activeElement = document.getElementById('MediaPlayer');

				wc.mediaPlayer.video.activeElement.URL = wc.mediaPlayer.flashvideodatafilepath + param.fileSrc;

					if (wc.mediaPlayer.video.activeElement.controls != 'undefined' && wc.mediaPlayer.video.activeElement.controls != null && wc.mediaPlayer.video.activeElement.controls.isAvailable('play')) {
					wc.mediaPlayer.video.activeElement.controls.play();
					}
//alert("in play, container html " + containerElm.innerHTML);

currentmediaobject = document.getElementById('flashVideo');
if (currentmediaobject != null) {
//alert('flash video object not null'); 
} else {
//alert('flash video object is null');
}

				var checkFlash = function ()
				{
					if (typeof (wc.mediaPlayer.video.activeElement) == 'undefined')// || wc.mediaPlayer.video.activeElement.PercentLoaded() < 100)
					{
						window.setTimeout(checkFlash, 500);
					} else
					{
						//wc.mediaPlayer.video.activeElement.SetVariable('currentSong', 'http://test.wecomply.com' + wc.data.jsonData.chapters[chapterIndex].video.src);
						//wc.mediaPlayer.video.activeElement.TCallLabel('/','load');
						//wc.mediaPlayer.video.activeElement.TCallLabel('/','play');
						//wc.mediaPlayer.video.activeElement.SetVariable('onSongOver', function(){
						//wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
						//});
						wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
					}
				};
				//window.setTimeout(checkFlash, 500);

				wc.mediaPlayer.logs.push('playing flash video');
			}
			else if (wc.mediaPlayer.support.html5Video(true))
			{
				wc.mediaPlayer.status.platform = wc.mediaPlayer.platforms.html5;
				wc.mediaPlayer.logs.push('playing html5 video');

				if (typeof (wc.mediaPlayer.video.activeElement) == 'undefined' || wc.mediaPlayer.video.activeElement == null)
				{ wc.mediaPlayer.video.activeElement = document.createElement('video'); }
				else
				{
					try
					{
						//wc.mediaPlayer.video.activeElement.stop(); 
						wc.mediaPlayer.video.activeElement = document.createElement('video');
					} catch (e) { }
				}

				//	try {
				//		for (var elm in wc.mediaPlayer.video.activeElement.children) {
				//			var child = wc.mediaPlayer.video.activeElement.children[elm];
				//			if (isDefined(child) && ((child.tagName || '').toLowerCase() == 'source' || (child.nodeName || '').toLowerCase() == 'source')) {
				//				wc.mediaPlayer.video.activeElement.removeChild(child);
				//			}
				//		}
				//	}catch (ex1) {}

				wc.mediaPlayer.video.activeElement.autoplay = true;

				wc.mediaPlayer.video.activeElement.preload = "auto";

				wc.mediaPlayer.video.activeElement.controls = true;
				//	wc.mediaPlayer.video.activeElement.poster = "/wc2/images/training/PlayAudio.gif";

				if (typeof (param.width) != 'undefined' && param.width > 0)
					wc.mediaPlayer.video.activeElement.width = param.width;
				if (typeof (param.height) != 'undefined' && param.height > 0)
					wc.mediaPlayer.video.activeElement.height = param.height;

				if (wc.interface.options.mediaPlayer.videoSizePercentage != null && typeof (wc.interface.options.mediaPlayer.videoSizePercentage) != 'undefined')
				{
					wc.mediaPlayer.video.activeElement.width = (wc.mediaPlayer.video.activeElement.width / 100) * wc.interface.options.mediaPlayer.videoSizePercentage;
					wc.mediaPlayer.video.activeElement.height = (wc.mediaPlayer.video.activeElement.height / 100) * wc.interface.options.mediaPlayer.videoSizePercentage;
				}

				//wc.mediaPlayer.video.activeElement.src = wc.data.jsonData.chapters[chapterIndex].video.src.replace('.flv', '.mp4');
				wc.mediaPlayer.video.activeElement.id = 'videoElement' + param.chapterIndex;
				wc.mediaPlayer.video.activeElement.addEventListener('ended', function ()
				{
					this.currentTime = 0;
					this.pause();
					wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
				}, false);

				var source = document.createElement('source');
				source.type = 'video/mp4';
				//source.type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
				source.id = 'video' + param.chapterIndex + '_mp4';
				source.src = wc.mediaPlayer.dataFilePath + param.fileSrc.replace('.flv', '.mp4');

				// clear out any old video content
				if (wc.mediaPlayer.video.activeElement.innerHTML != null)
				{
					wc.mediaPlayer.video.activeElement.innerHTML = "";

				}

				wc.mediaPlayer.video.activeElement.appendChild(source);

				// TODO: clear source from previous playes; set current time to 0. We may have to manually load.
				//wc.mediaPlayer.video.activeElement.currentTime = 0;

				if (wc.interface.options.mediaPlayer.showVideoControls)
					wc.mediaPlayer.video.activeElement.controls = true;
				else
					wc.mediaPlayer.video.activeElement.controls = false;

				wc.mediaPlayer.video.activeElement.onended = function ()
				{
					wc.mediaPlayer.status.action = wc.mediaPlayer.actions.stopped;
				};

				//if (typeof (wc.data.jsonData.chapters[chapterIndex].video.containerId) != 'undefined' && wc.data.jsonData.chapters[chapterIndex].video.containerdId != '') {
				var containerElm = document.getElementById(param.containerElementId);
				containerElm.innerHTML = '';
				containerElm.appendChild(wc.mediaPlayer.video.activeElement);

				//containerElm.appendChild(wc.mediaPlayer.controls.generate());
				//wc.mediaPlayer.controls.toggleToggleImage('pause');
				//wc.mediaPlayer.controls.setAutoUpdate(wc.mediaPlayer.video.activeElement, 0);
				//}
				// call load for ios, to fix weird issue where second video doesn't play

				//videoElm.load();
				//wc.mediaPlayer.video.activeElement.currentTime = 0;
				wc.mediaPlayer.video.activeElement.load();

				wc.mediaPlayer.video.activeElement.play();
				wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
			}
			else
			{
				alert('no support');
				wc.mediaPlayer.logs.push('not sufficient video support');
			}
		}
		else
		{
			wc.mediaPlayer.logs.push('video file not found');
		}
	}
};
wc.mediaPlayer.controls = {element : null,autoElement : null, intval: null, updateActive:false};
wc.mediaPlayer.controls.setAutoUpdate = function(autoElement, startProgress) {

	if (typeof(autoElement) == 'undefined' && typeof(wc.mediaPlayer.controls.autoElement) != 'undefined') {
		wc.mediaPlayer.controls.intval = self.setInterval(wc.mediaPlayer.controls.autoUpdate, 1000);
	} else {
		wc.mediaPlayer.controls.autoElement = autoElement;
		wc.mediaPlayer.controls.update(startProgress);
		wc.mediaPlayer.controls.intval = self.setInterval(wc.mediaPlayer.controls.autoUpdate, 1000);
	}
	wc.mediaPlayer.controls.updateActive = false;
};
wc.mediaPlayer.controls.unsetAutoUpdate = function() {
	wc.mediaPlayer.controls.updateActive = true;
	try {
		self.clearInterval(wc.mediaPlayer.controls.inval);
	} catch(e) {
	}
};
wc.mediaPlayer.controls.autoUpdate = function() {
	try {
		var progress = (100 / wc.mediaPlayer.controls.autoElement.duration) * wc.mediaPlayer.controls.autoElement.currentTime;
		wc.mediaPlayer.controls.update(parseInt(progress));
	} catch(e) {
		alert(e);
	}
};

wc.mediaPlayer.controls.update = function(progress) {
	if (wc.mediaPlayer.controls.updateActive)
		return;

	wc.mediaPlayer.controls.updateActive = true;

	if (typeof(wc.mediaPlayer.element) == 'undefined')
		wc.mediaPlayer.controls.element = wc.mediaPlayer.controls.generate();

	var progressBar = wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsProgressBar');
	var seekerBar = wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar');
	// var progressBar = document.getElementById('mediaPlayerControlsProgressBar');
	//var seekerBar = document.getElementById('mediaPlayerControlsSeekerBar');

	var progressBarWidth = parseInt(progressBar.style.width);
	var seekerBarWidth = parseInt(seekerBar.style.width);
	var newProgressWidth = (progressBarWidth / 100) * progress;

	var currentProgress = (progressBarWidth / 100) * seekerBarWidth;

	if (currentProgress > progress)
		seekerBar.style.width = newProgressWidth;
	else
		wc.mediaPlayer.controls.animateSeekerbar(newProgressWidth);


	wc.mediaPlayer.controls.updateActive = false;
};
wc.mediaPlayer.controls.animateSeekerbar = function (endPosition) {
	if (parseInt(wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width) < endPosition) {
		//var tweenAmount = (endPosition - wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width)/wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsProgressBar').style.width;
		//alert(tweenAmount);
		var tweenAmount = 1;
		wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width = (parseInt(wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsSeekerBar').style.width) + tweenAmount) + ('px');

		setTimeout('wc.mediaPlayer.controls.animateSeekerbar(' + endPosition + ')', 5);
	}
};
wc.mediaPlayer.controls.toggleToggleImage = function(newImg) {
	try {
		var playPauseToggleImage = wc.mediaPlayer.video.activeElement.ownerDocument.getElementById('mediaPlayerControlsPlayPauseToggleImage');
		playPauseToggleImage.src = '../images/training/button_blue_' + newImg + '.png';
	} catch(e) {
	}
};
wc.mediaPlayer.controls.generate = function () {
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
	progressBar.onclick = function (e) {
		var cords = wc.mediaPlayer.GetClickCoordsWithinElement(e);
		var seekPercentage = (100 / parseInt(progressBar.style.width)) * cords.x;
		var duration = wc.mediaPlayer.video.activeElement.duration;
		var newVideoTime = (duration / 100) * seekPercentage;
		//alert(newVideoTime + ' - ' + seekPercentage);
		wc.mediaPlayer.video.activeElement.currentTime = parseInt(newVideoTime);
		wc.mediaPlayer.controls.update(seekPercentage);

	};


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
	playPauseToggle.style.height = 10 + 'px';
	playPauseToggleImage.src = '../images/training/button_blue_play.png';
	playPauseToggleImage.id = 'mediaPlayerControlsPlayPauseToggleImage';
	playPauseToggleImage.style.height = 10 + 'px';
	playPauseToggleImage.onclick = function () { wc.mediaPlayer.video.play(); };
	playPauseToggle.appendChild(playPauseToggleImage);

	controlContainer.appendChild(progressBar);
	controlContainer.appendChild(playPauseToggle);

	return controlContainer;
};

wc.mediaPlayer.audio = {activeElement:null, files : {}, flashPlayerSrc: '', flashPlayerAudioPluginSrc: ''};
wc.mediaPlayer.audio.add = function(src, chapterIndex) {
	src = src.replace('.flv', '.mp3');
	//src = '/wc2/static/training/creeeeak.mp3';
	//src = 'http://test.wecomply.com/datafiles/media-165920.mp3'
	wc.mediaPlayer.audio.files[chapterIndex] = { src: src, chapterIndex: chapterIndex };
};
wc.mediaPlayer.audio.stop = function () {
	if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {
		try {
			wc.mediaPlayer.audio.activeElement.pause();
			wc.mediaPlayer.tmpAudioPosition = 0;
		}catch (e) {
		}
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
	} else {
		try {
			if (typeof(wc.mediaPlayer.audio.activeElement) != 'undefined') {
				if (isDefined(wc.mediaPlayer.audio.activeElement.SetVariable)) {
					try {
						wc.mediaPlayer.audio.activeElement.SetVariable("method:stop", "");
						wc.mediaPlayer.tmpAudioPosition = 0;
					} catch(e) {
					}
				} else if (typeof wc.mediaPlayer.audio.activeElement.pause == 'function') {
					try {
						wc.mediaPlayer.audio.activeElement.pause();
						wc.mediaPlayer.tmpAudioPosition = 0;
					} catch(e) {
					}
				}
			}
		} catch(err) {
		}
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
	}
};
wc.mediaPlayer.audio.pause = function () {
	if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {
		try {
			wc.mediaPlayer.audio.activeElement.pause();
		} catch (e) {
		}
		wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
	} else {
		//		if (typeof (wc.mediaPlayer.audio.activeElement) != 'undefined' && isDefined(wc.mediaPlayer.audio.activeElement.SetVariable))
		try {
			//wc.mediaPlayer.audio.activeElement.SetVariable("method:pause", "");			
			wc.mediaPlayer.audio.activeElement.pause();
		} catch (e) {
		}
		// FIXME: Check with Rafael, why do we need to set the status.action to acions.none here. Why not actions.paused ?
		wc.mediaPlayer.logs.push("Audio paused");
		//wc.mediaPlayer.status.action = wc.mediaPlayer.actions.none;
	}
};
wc.mediaPlayer.audio.play = function (chapterIndex) {
	wc.mediaPlayer.logs.push('audio.play(' + chapterIndex + ')');
	if (wc.mediaPlayer.status.action != wc.mediaPlayer.actions.none
		&& (wc.mediaPlayer.status.type != wc.mediaPlayer.types.audio
			&& chapterIndex != wc.mediaPlayer.status.chapterIndex)) {
		wc.mediaPlayer.stopCurrentActiveMedia();
	}

	if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.audio && chapterIndex == wc.mediaPlayer.status.chapterIndex && wc.mediaPlayer.status.action == wc.mediaPlayer.actions.playing) {
		wc.mediaPlayer.logs.push('pausing audio');
		if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {
			try {
				wc.mediaPlayer.audio.activeElement.pause();
			} catch (e) { }
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
		} else {
			if (typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {
				try {
					wc.mediaPlayer.audio.activeElement.pause();
				} catch (e) {
				}
				// FIXME: Shouldn't this be set from the clip.onPause event?
				//wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
			}
		}
	}
	else if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.audio && chapterIndex == wc.mediaPlayer.status.chapterIndex && isDefined(chapterIndex)) {
		wc.mediaPlayer.logs.push('continuing audio');
		if (wc.mediaPlayer.status.platform == wc.mediaPlayer.platforms.html5 && typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {
			wc.mediaPlayer.audio.activeElement.play();
			wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
		}
		else {
			//start playing flash again
			if (typeof (wc.mediaPlayer.audio.activeElement) != 'undefined') {

				wc.mediaPlayer.logs.push('Continuing with an existing flash player');

				//wc.mediaPlayer.audio.activeElement.reset('["content"]');
				if (isDefined(wc.mediaPlayer.audio.activeElement) && wc.mediaPlayer.audio.activeElement.isLoaded()) {
					wc.mediaPlayer.logs.push('Player loaded. Play audio.');
					wc.mediaPlayer.audio.activeElement.play();
				} else {
					wc.mediaPlayer.logs.push('Player not loaded yet. Try loading and wait.');
					window.checkFlashTestCount = 0;
					var checkPlayer = function () {
						if (!isDefined(wc.mediaPlayer.audio.activeElement) || !wc.mediaPlayer.audio.activeElement.isLoaded()) {
							var timeoutValue = 500;
							if (window.checkFlashTestCount > 10)
								return;
							else if (window.checkFlashTestCount > 3) {
								timeoutValue = 5000;
							}

							window.checkFlashTestCount++;
							setTimeout(checkPlayer, timeoutValue);
						} else {
							wc.mediaPlayer.audio.activeElement.play();
						}
					};
					setTimeout(checkPlayer, 500);

				}
				//wc.mediaPlayer.audio.activeElement.getClip().update({ autoPlay: false });


				// TODO: resume playing.				
				//if (isDefined(wc.mediaPlayer.tmpAudioPosition)) {
				//wc.mediaPlayer.logs.push('current clip position: ' + wc.mediaPlayer.audio.activeElement.getTime());
				//wc.mediaPlayer.logs.push('restoring time position ' + wc.mediaPlayer.tmpAudioPosition);
				//wc.mediaPlayer.audio.activeElement.seek(wc.mediaPlayer.tmpAudioPosition);
				//}
				//wc.mediaPlayer.audio.activeElement.seek();
				//


				//				var flashvars = { listener: 'wcMediaPlayerAudioListener', interval: 500 };
				//				var params = {};
				//				var attributes = { id: 'flashAudio' + chapterIndex, allowScriptAccess: 'true' };
				//				swfobject.embedSWF(wc.mediaPlayer.audio.flashPlayerSrc, 'flashAudio' + chapterIndex, '1', '1', '6', false, flashvars, params, attributes);

				//				wc.mediaPlayer.audio.activeElement = document.getElementById('flashAudio' + chapterIndex);


				//				wc.mediaPlayer.tmpAudioPosition = wc.mediaPlayer.status.position;

				//				window.checkFlashTestCount = 0;
				//				var checkFlash = function () {

				//					if (typeof (wc.mediaPlayer.audio.activeElement) == 'undefined' || wc.mediaPlayer.audio.activeElement == null)
				//						wc.mediaPlayer.audio.activeElement = document.getElementById('flashAudio' + chapterIndex);

				//					if (typeof (wc.mediaPlayer.audio.activeElement) == 'undefined' || wc.mediaPlayer.audio.activeElement.PercentLoaded() < 100) {
				//						var timeoutValue = 500;
				//						if (window.checkFlashTestCount > 10)
				//							return;
				//						else if (window.checkFlashTestCount > 3) {
				//							timeoutValue = 5000;
				//						}

				//						if (window.checkFlashTestCount == 3)
				//						//alert('Flash not yet loaded');
				//							window.checkFlashTestCount++;
				//						window.setTimeout(checkFlash, timeoutValue);
				//					} else {
				//						window.checkFlashTestCount = 0;
				//						wc.mediaPlayer.audio.activeElement.SetVariable("method:setUrl", '/datafiles/' + wc.data.jsonData.chapters[chapterIndex].audio.src.replace('.flv', '.mp3'));
				//						wc.mediaPlayer.audio.activeElement.SetVariable("enabled", "true");
				//						wc.mediaPlayer.audio.activeElement.SetVariable("method:play", "");

				//						//wc.mediaPlayer.audio.activeElement.SetVariable("enabled", "true");
				//						wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
				//						wcMediaPlayerAudioListener.onInit = function () {
				//							if (isDefined(wc.mediaPlayer.tmpAudioPosition)) {
				//								this.position = wc.mediaPlayer.tmpAudioPosition;
				//								wc.mediaPlayer.audio.activeElement.SetVariable("method:setPosition", wc.mediaPlayer.tmpAudioPosition);
				//							}
				//							wc.mediaPlayer.tmpAudioPosition = 0;

				//						};
				//						wcMediaPlayerAudioListener.onUpdate = function () {

				//							if (!this.isPlaying) {
				//								wc.mediaPlayer.status.action = wc.mediaPlayer.actions.stopped;
				//							} else {
				//								if (isDefined(this.position) || this.position != 'undefined') {
				//									wc.mediaPlayer.status.position = this.position;

				//									//if (this.position == this.duration) {
				//									//	wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioComplete, null);
				//									//}
				//								}
				//							}
				//						};
				//						wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
				//					}
				//				};
				//				window.setTimeout(checkFlash, 500);

			}
		}
	}
	else {
		if (typeof (wc.data.jsonData.chapters[chapterIndex].audio) != 'undefined') {
			wc.mediaPlayer.status.type = wc.mediaPlayer.types.audio;
			wc.mediaPlayer.status.chapterIndex = chapterIndex;
			if (wc.mediaPlayer.support.flashAudio()) {
				var elementId = 'flashAudio' + chapterIndex; // + ('' + Math.floor((Math.random() * 6586667) + 1));
				wc.mediaPlayer.logs.push('Creating new flash player');

				if (!isDefined(wc.mediaPlayer.audio.activeElement)) {
					wc.mediaPlayer.audio.activeElement = document.createElement('div');
					wc.mediaPlayer.audio.activeElement.id = elementId;
				}
				/*
				try {
				$f().unload();

				if (isDefined(wc.mediaPlayer.audio.activeElement) && isDefined(wc.mediaPlayer.audio.activeElement.unload))
				wc.mediaPlayer.audio.activeElement.unload();
				} catch (e) {
				}*/
				/*var oldElement = document.getElementById('flashAudio' + chapterIndex);
				if (isDefined(oldElement)) {
				oldElement.innerHTML = '';
				document.getElementById('Chapter_Audio_Container').removeChild(oldElement);
				document.getElementById('Chapter_Audio_Container').removeChild(wc.mediaPlayer.audio.activeElement);
				}*/

				var containerId = 'AudioPlayerContainer';
				var audioPlayerContainer = document.getElementById(containerId);
				if (isDefined(audioPlayerContainer)) {
					//document.getElementById(containerId);
					//TODO: maybe reset iTop in certain cases
				} else {
					audioPlayerContainer = document.createElement('div');
					audioPlayerContainer.id = containerId;
					document.body.appendChild(audioPlayerContainer);

					while (audioPlayerContainer.firstChild) {
						audioPlayerContainer.removeChild(audioPlayerContainer.firstChild);
					}
				}

				//document.getElementById('Chapter_Audio_Container').appendChild(wc.mediaPlayer.audio.activeElement);
				if (!isDefined(document.getElementById(elementId)))
					audioPlayerContainer.appendChild(wc.mediaPlayer.audio.activeElement);
				wc.mediaPlayer.audio.activeElement =
					$f(wc.mediaPlayer.audio.activeElement.id, wc.mediaPlayer.audio.flashPlayerSrc, { width: 0, height: 0,
						screen: { width: 0, height: 0 },
						debug: false,
						log: { level: 'debug', filter: 'org.flowplayer.cuepoints.*' },
						plugins: {
							//						audio: {
							//							url: wc.mediaPlayer.audio.flashPlayerAudioPluginSrc
							//						},
							controls: {
								all: false,
								height: '0px',
								autohide: false
							}
						},

						clip: {
							autoPlay: false,
							url: wc.mediaPlayer.dataFilePath + wc.data.jsonData.chapters[chapterIndex].audio.src.replace('.flv', '.mp3'),
							onBeforeBegin: function (clip) {
								if (isDefined(wc.mediaPlayer.tmpAudioPosition)) {
									clip.onCuepoint = wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(wc.data.jsonData.chapters[chapterIndex].pithyQuote);
									clip.update();
								}
							},
							onBegin: function (clip) {
								if (isDefined(wc.mediaPlayer.tmpAudioPosition) && (wc.mediaPlayer.tmpAudioPosition != this.getTime())) {
									wc.mediaPlayer.logs.push("Move to position: " + wc.mediaPlayer.tmpAudioPosition);
									this.seek(wc.mediaPlayer.tmpAudioPosition);
								} else {
									wc.mediaPlayer.tmpAudioPosition = 0;
								}

								//clip.cuepoints = wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(wc.data.jsonData.chapters[chapterIndex].pithyQuote)[0];
							},
							onStart: function () {

								wc.mediaPlayer.logs.push("Clip started");
								//alert(wc.mediaPlayer.tmpAudioPosition + '|' + this.getTime());
								wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
								if (isDefined(wc.mediaPlayer.tmpAudioPosition) && wc.mediaPlayer.tmpAudioPosition > 0) {
									wc.mediaPlayer.audio.activeElement.onCuepoint = wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(wc.data.jsonData.chapters[chapterIndex].pithyQuote);
									//wc.mediaPlayer.audio.activeElement.update();
									wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioResumed, null);
								}
							},
							onPause: function () {
								wc.mediaPlayer.tmpAudioPosition = this.getTime();
								wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
								wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioPaused, null);
							},
							onUpdate: function (clip) {

							},
							onResume: function () {
								wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
								wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioResumed, null);
							},
							onFinish: function () {
								wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioComplete, null);
							},
							onCuepoint: wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(wc.data.jsonData.chapters[chapterIndex].pithyQuote)

						},
						onUnload: function () {
							//console.log('original onUnload');
						},
						onLoad: function () {
							//console.log('player loaded');
							//TODO: Find a beter way to hide audio player element, this hides it for now becasue it is 0 height and 1 px width , chainging it to 0width makes it full size
							try {
								//window.frames[0].document.getElementById('flashAudio1').style.width
								document.getElementById(elementId).style.width = '1px';
								document.getElementById(elementId).style.height = '1px';

							} catch (e) {
								alert(wc.mediaPlayer.audio.activeElement.id);
							}
						}
					});

				document.getElementById(elementId).style.width = '1px';
				document.getElementById(elementId).style.height = '1px';
				wc.mediaPlayer.audio.activeElement.play();
				wc.mediaPlayer.logs.push('playing flash audio (' + elementId + ')');
			}
			else if (wc.mediaPlayer.support.html5Audio(true)) {
				wc.mediaPlayer.status.platform = wc.mediaPlayer.platforms.html5;
				wc.mediaPlayer.logs.push('playing html5 audio');
				if (typeof (wc.mediaPlayer.audio.activeElement) == 'undefined' || wc.mediaPlayer.audio.activeElement == null) {
					wc.mediaPlayer.audio.activeElement = document.createElement('audio');
				} else {
					try {
						wc.mediaPlayer.audio.activeElement.pause();
					} catch (e) {
					}
					try {
						//
						for (var elm in wc.mediaPlayer.audio.activeElement.children) {
							var child = wc.mediaPlayer.audio.activeElement.children[elm];
							if (isDefined(child) && ((child.tagName || '').toLowerCase() == 'source' || (child.nodeName || '').toLowerCase() == 'source')) {
								wc.mediaPlayer.audio.activeElement.removeChild(child);
							}
						}
					} catch (e) {
						alert(e);
					}
				}

				try {
					wc.mediaPlayer.audio.activeElement.src = wc.mediaPlayer.dataFilePath + wc.data.jsonData.chapters[chapterIndex].audio.src.replace('.flv', '.mp3');
				} catch (e1) {
					wc.mediaPlayer.audio.activeElement.src = wc.mediaPlayer.dataFilePath + wc.data.jsonData.chapters[chapterIndex].audio.src;
				}
				wc.mediaPlayer.audio.activeElement.addEventListener('pause', function() {
					wc.mediaPlayer.tmpAudioPosition = this.currentTime;
					wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
					wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioPaused, null);
				}, false);
				wc.mediaPlayer.audio.activeElement.addEventListener('playing', function () {
					wc.mediaPlayer.logs.push("Clip started");
					wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
					if (isDefined(wc.mediaPlayer.tmpAudioPosition) && wc.mediaPlayer.tmpAudioPosition > 0) {
						wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioResumed, null);
					}
				}, false);
				wc.mediaPlayer.audio.activeElement.addEventListener('ended', function () {

					this.currentTime = 0; // need to reset the current time to continue playing from the beginning, sometimes it doesn't reset itself
					this.pause();  // need the pause here to make sure it doesn't start playing by itself after resetting the time
					wc.mediaPlayer.status.action = wc.mediaPlayer.actions.paused;
					wc.interface.handlers.mediaPlayer.fireEvent(wc.interface.handlers.mediaPlayer.onAudioComplete, null);

				}, false);
				wc.mediaPlayer.audio.activeElement.addEventListener('play', function () {
					try {
						if (isDefined(wc.mediaPlayer.tmpAudioPosition) && (wc.mediaPlayer.tmpAudioPosition != this.currentTime)) {
							wc.mediaPlayer.logs.push("Move to position: " + wc.mediaPlayer.tmpAudioPosition);
							this.currentTime = wc.mediaPlayer.tmpAudioPosition;
						} else {
							wc.mediaPlayer.tmpAudioPosition = 0;
						}
					} catch(e) {
						
					}
				}, false);
				

				// get the cuepoints here
				var activeCuepointIndex = -1;

				var cuepoints = wc.interface.elements.mediaBullets.getCuepointsForHtml5Player(wc.data.jsonData.chapters[chapterIndex].pithyQuote)[0];
				if (isDefined(wc.interface.handlers.events.mediaPlayer.onAudioTimeUpdate)) {
					wc.mediaPlayer.audio.activeElement.removeEventListener('timeupdate', wc.interface.handlers.events.mediaPlayer.onAudioTimeUpdate);
					wc.interface.handlers.events.mediaPlayer.onAudioTimeUpdate = null;
				}

				wc.interface.handlers.events.mediaPlayer.onAudioTimeUpdate = function () {
					for (var cuepointIndex in cuepoints) {
						if ((cuepointIndex != activeCuepointIndex) && (this.currentTime >= cuepoints[cuepointIndex].time) && (this.currentTime < cuepoints[cuepointIndex].time + 0.5)) {
							activeCuepointIndex = cuepointIndex;
							wc.interface.elements.mediaBullets.showCuepoint(this, cuepoints[cuepointIndex]);
						}
					}
				};

				if (cuepoints.length > 0) {
					wc.mediaPlayer.audio.activeElement.addEventListener('timeupdate', wc.interface.handlers.events.mediaPlayer.onAudioTimeUpdate);
				}
				wc.mediaPlayer.audio.activeElement.play();
				wc.mediaPlayer.status.action = wc.mediaPlayer.actions.playing;
			} else {
				alert('no support');
				wc.mediaPlayer.logs.push('not sufficient audio support');
			}
		} else {
			wc.mediaPlayer.logs.push('audio file not found');
		}
	}
};
wc.mediaPlayer.stopCurrentActiveMedia = function (allowPause) {
	wc.mediaPlayer.logs.push('Stopping current active media stopCurrentActiveMedia(' + allowPause + ')');
	if (wc.mediaPlayer.status.action != wc.mediaPlayer.actions.none) {
		if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.audio)
			if (allowPause)
				wc.mediaPlayer.audio.pause();
			else
				wc.mediaPlayer.audio.stop();
		else if (wc.mediaPlayer.status.type == wc.mediaPlayer.types.video)
			if (allowPause)
				wc.mediaPlayer.video.pause();
			else
				wc.mediaPlayer.video.stop();
	}
};
wc.mediaPlayer.logs = {loggedData:[]};
wc.mediaPlayer.logs.push = function(dataToLog) {
	if (wc.mediaPlayer.debugMode) {
		alert(dataToLog);
	}
	wc.mediaPlayer.logs.loggedData.push(dataToLog);
};
wc.mediaPlayer.GetClickCoordsWithinElement = function(event) {
	var coords = { x: 0, y: 0 };

	if (!event) // then we're in a non-DOM (probably IE) browser
	{
		event = window.event;
		coords.x = event.offsetX;
		coords.y = event.offsetY;
	} else		// we assume DOM modeled javascript
	{
		var element = event.target;
		var calculatedTotalOffsetLeft = 0;
		var calculatedTotalOffsetTop = 0;

		while (element.offsetParent) {
			calculatedTotalOffsetLeft += element.offsetLeft;
			calculatedTotalOffsetTop += element.offsetTop;
			element = element.offsetParent;
		}

		coords.x = event.pageX - calculatedTotalOffsetLeft;
		coords.y = event.pageY - calculatedTotalOffsetTop;
	}

	return coords;
};

function flushThis(id){
   var msie = 'Microsoft Internet Explorer';
   var tmp = 0;
   var elementOnShow = document.getElementById(id);
   if (navigator.appName == msie){
      tmp = elementOnShow.parentNode.offsetTop  +  'px';
   }else{
      tmp = elementOnShow.offsetTop;
   }
}