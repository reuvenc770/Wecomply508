/*** Detects internet explorer ( WIN ) ***/
winIEpass = ((navigator.appName.indexOf("Microsoft") != -1) && 
(navigator.appVersion.indexOf("Windows") != -1)) && 
(parseFloat(navigator.appVersion) >= 4) ? true : false;

/*** Detects netscape navigator ***/
NNpass = ((navigator.appName == "Netscape") && 
(navigator.userAgent.indexOf("Mozilla") != -1) && 
(parseFloat(navigator.appVersion) >= 4) && 
(navigator.javaEnabled())) ? true : false;

supportedBrowser = (winIEpass || NNpass) ? true : false;

minPlayer = 7;

/*** Get Flash plugin version for NN ( Mac/Win )  ***/
function Flash_checkForPlugIn()
{
	var plugin = (navigator.mimeTypes &&
	navigator.mimeTypes["application/x-shockwave-flash"]) ?
	navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin : 0;

	if (plugin) {
		var pluginversion = parseInt(plugin.description.substring(plugin.description.indexOf(".")-1)) 
		if(pluginversion >= minPlayer) { return true; }
	}
	return false;
}

/*** vbscript check for Flash ActiveX control in windows IE ***/
if(supportedBrowser && winIEpass)
{
document.write(
		'<script language=VBScript>' + '\n' +
		'Function Flash_checkForActiveX()' + '\n' +
			'Dim hasPlayer, playerversion' + '\n' +
			'hasPlayer = false' + '\n' +
			'playerversion = 10' + '\n' +
			'Do While playerversion >= minPlayer' + '\n' +
				'On Error Resume Next' + '\n' +
				'hasPlayer = (IsObject(CreateObject(\"ShockwaveFlash.ShockwaveFlash.\" & playerversion & \"\")))' + '\n' +
				'If hasPlayer = true Then Exit Do' + '\n' +
				'playerversion = playerversion - 1' + '\n' +
			'Loop' + '\n' +
			'Flash_checkForActiveX = hasPlayer' + '\n' +
		'End Function' + '\n' +
		'<\/script>'
		);
}

/*** Encapsulation function for ActiveX / Plugin case detections ***/
function Flash_checkForMinPlayer()
{
	if(!supportedBrowser) return false;
	if(NNpass){ return (Flash_checkForPlugIn());}
	if(winIEpass){ return (Flash_checkForActiveX());}
}

/*** Redirect if browser version is incompatible ***/
if(!Flash_checkForMinPlayer()) {
		//	Add code for handling redirection :
		window.location.href = "noflash7.html"; 
}

function Flash_embedSWF(id, srcURL, width, height)
{
if (!Flash_checkForMinPlayer()) return;
	if( NNpass ) {
		document.writeln(
		  '<embed src="' + srcURL + '" quality="high" bgcolor="#999999" ' +  
      'width="' + width + '" height="' + height + '" swLiveConnect=true id="' + id + '" ' +  
      'name="' + id + '" align="middle" allowScriptAccess="sameDomain" ' + 
      'type="application/x-shockwave-flash" ' + 
      'pluginspage="http://www.macromedia.com/go/getflashplayer" />' 
			);
	} else if(winIEpass){
			document.writeln(
      '<OBJECT id="' + id + '" ' + 
      'codeBase=http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0 ' + 
      'height="' + height + '" width="' + width + '" align=middle ' + 
      'classid=clsid:d27cdb6e-ae6d-11cf-96b8-444553540000>' +
			'<PARAM NAME="allowScriptAccess" VALUE="sameDomain">' +
			'<PARAM NAME="movie" VALUE="' + srcURL + '">' +
			'<PARAM NAME="quality" VALUE="high">' +
			'<PARAM NAME="bgcolor" VALUE="#999999">' +
      '<embed src="' + srcURL + '" quality="high" bgcolor="#999999" ' +  
      'width="' + width + '" height="' + height + '" swLiveConnect=true id="' + id + '" ' +  
      'name="' + id + '" align="middle" allowScriptAccess="sameDomain" ' + 
      'type="application/x-shockwave-flash" ' + 
      'pluginspage="http://www.macromedia.com/go/getflashplayer" />' + 
			'</OBJECT>'
			);
	}
}

/*** Return a valid flash object ***/
function object_flash( id ){
	if(!Flash_checkForMinPlayer()) {return null;}
	return document.getElementById(id);
}




