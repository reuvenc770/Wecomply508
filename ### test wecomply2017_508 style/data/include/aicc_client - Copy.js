// Module:   AICC_CLIENT.JS
//
// Purpose:  Utility functions for implementing AICC communication from the client
//
// Adapted from AICC_CLIENT.VBS
//
// Author:   David Rubin
// Date:     6/6/02
//
// Modified on 10/23/02 by Dave Rubin
//   - Support HACP via Java applet or XMLHTTP
//
// Modified on 11/12/02 by Dave Rubin
//   - Support the use of a proxy
//
// Modified on 11/1/03 by Dave Rubin
//   - Support for DEBUG_MODE
//
// Modified on 9/30/04 by Dave Rubin
//   - Retry HTTP communication if blank response received
//   - Prefer XMLHTTP over Java
//
// Modified on 2/23/05 by Dave Rubin
//   - Use substring instead of substr
//   - Use XMLHttpRequest on other browsers if possible
//
// Modified on 7/28/05 by Dave Rubin
//   - Remove use of Java applet

// Method:     trimLR
// Purpose:    Truncate white space from the beginning and end of a string
String.prototype.trimLR = new Function("return this.replace(/\\s+$|^\\s*/gi, '');");

// Determine browser
var _appName = window.navigator.appName;
var _appVersion = window.navigator.appVersion;
var _brwNetscape = (_appName == "Netscape");
var _brwIE = (_appName == "Microsoft Internet Explorer");
var _brwMacintosh = (_appVersion.indexOf("Macintosh") > 0);
var _brwWindows = (_appVersion.indexOf("Windows") > 0);
var _brwVersion = parseInt(_appVersion.substring(0, 1));

var _bTestedHACP = false;
var _bPostUsingJava = false;
var _bUseProxy = false;
var _strProxyURL = "";

var _httpRetries = 10;

//
// function: parseKeyValueString
//
// Purpose:  Parse a string of key/value pairs and return
//           an object with the results.
//
function parseKeyValueString(strData, strKeyDelim, strValDelim, bUnescape, obj)
{
	var objResult;
	var arr1, i;
	
	if (obj != null)
		objResult = obj;
	else
		objResult = new Object();

	var arr1 = strData.split(strKeyDelim);
	for (var i in arr1)
	{
		var strKey, strVal;
		var arr2 = arr1[i].split(strValDelim, 2);
		if (arr2.length > 1)
		{
			strKey = arr2[0].trimLR().toUpperCase();
			if (bUnescape)
				strVal = unescape(arr2[1].trimLR().replace(/\+/g, " "));
			else
				strVal = arr2[1].trimLR();
			//alert("Key: " + strKey + "Val: " + strVal);
		}
		else
		{
			strKey = arr1[i].toUpperCase();
			strVal = "";
		}
		if (strKey != "")
			objResult[strKey] = strVal;
	}
	return objResult;
}

//
// function: parseKeyValueString2
//
// Purpose:  Parse a string of key/value pairs delimited only by spaces
//
function parseKeyValueString2(strData, strKeyDelim, strValDelim, bUnescape, obj)
{
	var objResult;
	var arr1, i;
	var lenKeyDelim = strKeyDelim.length;
	var lenValDelim = strValDelim.length;
	
	if (obj != null)
		objResult = obj;
	else
		objResult = new Object();
		
	var i = strData.lastIndexOf(strValDelim);
	var end = 0;
	while (i > 0)
	{
		var strKey, strVal;
		
		var j = strData.lastIndexOf(strKeyDelim, i-1);
		if (j < 0)
			strKey = strData.substring(0, i).toUpperCase();
		else
			strKey = strData.substring(j+lenKeyDelim, i).toUpperCase();
		if (end == 0)
			strVal = strData.substring(i+lenValDelim);
		else
			strVal = strData.substring(i+lenValDelim, end);
		if (j > 0)
		{
			end = j;
			i = strData.lastIndexOf(strValDelim, end-1);
		}
		else
			i = -1;
		if (bUnescape)
			strVal = unescape(strVal.trimLR().replace(/\+/g, " "));

		strVal = strVal.replace( /__EQUAL__/g , '=');
//		alert("[" + strKey + "]=[" + strVal + "]");
		objResult[strKey] = strVal;
	}

	return objResult;
}

//
// function: AICCSendCommand
//
// Purpose:  Issue a command to the AICC server and
//           return the result in a string
//
function AICCSendCommand(strCommand, strAICCURL, strAICCSessionID, strAICCData)
{
	var strPostData;
 
	strPostData = "command=" + strCommand + "&version=2.0&session_id=" + strAICCSessionID;
	if (strAICCData != "")
		strPostData = strPostData + "&aicc_data=" + strAICCData;
	return doHTTPPost(strAICCURL, strPostData);
}

//
// function: AICCSendScore
//
// Purpose:  Send a putParam command to the AICC server to report the user's score
//
function AICCSendScore(strTime, strScore, strStatus, strLocation, strAICCURL, strAICCSessionID, strSuspendData)
{
	var strAICCData;
	if (typeof(strSuspendData) != 'undefined' && strSuspendData != null && strSuspendData != '') {
		strSuspendData = strSuspendData.replace(/=/g, "__EQUAL__");
	}
	strAICCData = "[CORE]\r\nlesson_location=" + strLocation + "\r\nlesson_status=" + strStatus + "\r\nTime=" + strTime + "\r\nscore=" + strScore + "\r\n" + (strSuspendData != 'undefined' && strSuspendData != null ? "suspend_data=" + strSuspendData + "\r\n" : "");
	// @@@ [DR] 4/22/02 : for IntraLearn -- remove when (if) implemented properly
	strAICCData = strAICCData + "\r\n[Core_Lesson]\r\n\r\n[Core_Vendor]\r\n";
	return AICCSendCommand("putParam", strAICCURL, strAICCSessionID, escape(strAICCData));
}
//
// function: forceParse
//
// Purpose:  A backup function to force the parsing of an AICCResponse
function forceParse(key, str)
{
	var myVal = "";
	key = key.toUpperCase();
	var index = str.toUpperCase().indexOf(key);
	index += key.length;
	
	while(str.charAt(index) != "=")
	{
		index++;
	}
	
	index++;
	
	while(str.charAt(index) == " ")
	{
		index++;
	}

	while(str.charAt(index) != "\n" && str.charAt(index) != "\r")
	{
		myVal+= str.charAt(index);
		index++;		
	}

	myVal.replace("<", "");
	myVal.replace(">", "");

	while(myVal.charAt(myVal.length) == " ")
	{
		myVal = myVal.substring(0, myVal.length -1);
	}

	return myVal;
}

//
// function: AICCParseResponse
//
// Purpose:  Parse the data returned from the AICC and return the results
//           as an object. All fields are combined into one object,
//           including the primary fields as well as the AICC_Data section.
//
function AICCParseResponse(strAICCResponse)
{
	var objResult, strFirstPart, strAICCData, n;
	
	n = strAICCResponse.toUpperCase().indexOf("AICC_DATA=");
	if (n > 0)
	{
		var obj1;
		strFirstPart = strAICCResponse.substring(0, n).trimLR();
		strAICCData =  strAICCResponse.substring(n + 10).trimLR();
		// Kludge: get rid of the section ids
		//strAICCData = strAICCData.replace(/\r\n\[.*?\]\r\n/g, "\r\n");
		strAICCData = strAICCData.replace(/\r\n\[[^\]]*\]\r\n/g, "\r\n");
		obj1 = parseKeyValueString2(strFirstPart, "\r\n", "=", false, null);
		objResult = parseKeyValueString2(strAICCData, "\r\n", "=", false, obj1);
	}
	else
	{
		objResult = parseKeyValueString2(strAICCResponse, "\r\n", "=", false, null);
	}
	return objResult;
}

//
// function: canDoHACP
//
// Purpose:  Determine if client can do HACP
//
function canDoHACP(strURL)
{
	var strPostURL;

	_bTestedHACP = true;

	if (typeof(USE_PROXY) != "undefined" && USE_PROXY == true)
	{
		_bUseProxy = true;
		if (typeof(PROXY_URL) != "undefined" && PROXY_URL != "")
		{
	 		_strProxyURL = PROXY_URL;
		}
		else
		{
			// default proxy URL
			_strProxyURL = getBaseURL() + "aiccproxy.asp";
		}
		strPostURL = _strProxyURL;
	}
	else
		strPostURL = strURL;

	// First see if Microsoft XMLHTTP is available
	// NOTE: This also requires XMLHTTP to be installed, which is by default with IE5
	//       but not necessarily with older versions. Even if this succeeds, it is possible
	//       that the XMLHTTP will fail if the AICC server is on a different host than
	//       the content, and browser security does not allow data access across domains
	if (_brwIE && _brwWindows && _brwVersion >= 4)
	{
		// This function is implemented in a separate VBScript file so it will support
		// error trapping on IE4
		if (xmlHTTPAvail() == true)
		{
		    debug("Using Microsoft XMLHTTP for LMS communication");
			return true;
		}
	}
	else
	{
		// Not IE/Windows or XMLHTTP not available; see if XMLHttpRequest is available
		if (typeof(XMLHttpRequest) != "undefined")
		{
				debug("Using XMLHttpRequest for LMS communication");
			return true;
		}	
	}

	// See if the Java applet can do it
	// WARNING: this will return true in the case of an HTTP site attempting
	//          to connect to the same host via HTTPS, although it seems that
	//          this does not necessarily work properly in all browsers.
/*
 	if (typeof(document.HTTPPost) == "object" || typeof(document.HTTPPost) == "function")
	{
		if (DEBUG_MODE)
			alert("HTTPPost Java applet found");
		// Warning: try/catch works only on IE5+ and NS6+
		try
		{
			if (document.HTTPPost.canPost(strPostURL) == true)
			{
				if (DEBUG_MODE)
					alert("Using Java applet for LMS communication");
				_bPostUsingJava = true;
				return true;
			}
			else
			{
				if (DEBUG_MODE)
					alert("Java applet cannot connect to " + strPostURL);
			}
		}
		catch(e)
		{
			if (DEBUG_MODE)
				alert("Exception calling Java applet");
		}
	}
	else
	{
		if (DEBUG_MODE)
			alert("HTTPPost Java applet not loaded");
	}
*/

	return false;
}

//
// function: doHTTPPost
//
// Purpose:  POST a form to a web page and retrieve the result
// NOTE:     If canDoHACP() was previously called (as it should have been) we
//           assume it was called with the same URL.
//
function doHTTPPost(strURL, strData)
{
	var strPostURL;

	if (!_bTestedHACP)
	{
		// shouldn't happen but just in case
		if (!canDoHACP(strURL))
		{
			alert("ERROR: HACP communication invoked but is not possible -- contact tech support");
			return "";
		}
	}

 	if (_bUseProxy)
		strPostURL = _strProxyURL + "?aicc_url=" + escape(strURL);
	else
		strPostURL = strURL;

	for (var i = 0; i < _httpRetries; i++)
	{
		var s;
		if (_bPostUsingJava)
			s = document.HTTPPost.doPost(strPostURL, strData) + '';
		else if (_brwIE && _brwWindows)	// Use VB code
			s = xmlHTTPPost(strPostURL, strData);
		else
			s = xmlHTTPRequestPost(strPostURL, strData);
		if (s != "")
			return s;
	}
		debug("No response from server");
	return "";
}

//
// function: xmlHTTPRequestPost
//
// Purpose:  POST using XMLHttpRequest
// NOTE:     This code can theoretically be merged with 'xmlHTTPPost' since
//           Microsoft XMLHTTP and XMLHttpRequest have identical interfaces.
//           However, the existing code is well tested and therefore retained.
function xmlHTTPRequestPost(strURL, strData)
{
	var req = new XMLHttpRequest();
	req.open("POST", strURL, false);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	req.setRequestHeader("User-Agent", "Mozilla Compatible (MS IE 3.01 WinNT)");
	req.send(strData);
	return req.responseText;
}

// Function:	getBaseURL
// Purpose:	Returns the base URL of the current document
//
function getBaseURL()
{
	var str = document.location.href;
	var n = str.lastIndexOf("/") + 1;
	return str.substring(0, n);
}
