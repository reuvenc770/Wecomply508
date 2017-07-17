// Module:     LMS_UTIL.JS
// Purpose:    JavaScript utilities for use in LMS Client
// Author:     David Rubin
// Date:       12/24/03
// Based on:   Original code used in WeComply Offline programs

// Function:   onLMSLaunch
// Purpose:    Initialize the session and
//             return an object with the info from the LMS.
// Called by:  onLoad() handler of the page launched by the LMS
function onLMSLaunch(win)
{
	// Define an object to hold all the info from the LMS
	var objInfo = null;
	var lmsAPI = null;
	var bHACP = false;
	// If the API is already defined in this window, use it
	if (typeof(API) == "object")
		lmsAPI = API;
	if (lmsAPI == null)
	{
		// Get the query string parameters (if any)
		var objQS = getQueryString(win);
		// See if AICC parameters were specified
		if (objQS.AICC_URL)
		{
			// Try HACP
			var aicc_url = objQS.AICC_URL;
			if (aicc_url.toUpperCase().indexOf("HTTP") < 0)
				aicc_url = "http://" + aicc_url;
			if (canDoHACP(aicc_url))
			{
				bHACP = true;
				var aicc_sid = objQS.AICC_SID ? objQS.AICC_SID : "";
					debug("Opening connection to LMS at [" + aicc_url + "] using sid [" + aicc_sid + "]");
				var strData = AICCSendCommand("getParam", aicc_url, aicc_sid, "");
				if (typeof(strData) == "undefined" || strData == "")
				{
					alert("Error: server did not return any data.");
				}
				else
				{	
						debug("Got data from AICC: [" + strData + "]");
					var AICCResponse = AICCParseResponse(strData);
					//alert("Error_text: " + AICCResponse.ERROR_TEXT);
					var strStudentID = AICCResponse.STUDENT_ID;
//Patch forceParse to handle some rare cases where AICCResponse doesn't parse correctly
//Should fix AICCParseResponse along with parseKeyValueString2
if(typeof(strStudentID) == "undefined" || strStudentID == "")
{
	strStudentID = forceParse("STUDENT_ID",strData);
}	
					if (typeof(strStudentID) == "undefined" || strStudentID == "")
					{
						alert("Error: server returned invalid data.");
					}
					else
					{
						objInfo = new Object();
						strFullName = AICCResponse.STUDENT_NAME;
						
						if (typeof(strFullName) != "undefined" && strFullName != "")
						{
							objInfo.firstName = getFirstName(strFullName);
							objInfo.lastName = getLastName(strFullName);
						}
						else
						{
//Patch forceParse to handle some rare cases where AICCResponse doesn't parse correctly
//Should fix AICCParseResponse along with parseKeyValueString2
strFullName = forceParse("STUDENT_NAME",strData);

if (typeof(strFullName) != "undefined" && strFullName != "")
{
	objInfo.firstName = getFirstName(strFullName);
	objInfo.lastName = getLastName(strFullName);
}
else
{
	// Maybe this should be an error since Student_Name is required
	objInfo.firstName = "N/A";
	objInfo.lastName = "N/A";
}
						}
						objInfo.aicc_sid = aicc_sid;
						objInfo.aicc_url = aicc_url;
						objInfo.student_id = strStudentID;

//Patch forceParse to handle some rare cases where AICCResponse doesn't parse correctly
//Should fix AICCParseResponse along with parseKeyValueString2
if(typeof(AICCResponse.LESSON_LOCATION) == "undefined" || AICCResponse.LESSON_LOCATION == "")
{
	objInfo.location = forceParse("LESSON_LOCATION",strData);	
}
else
{
	objInfo.location = AICCResponse.LESSON_LOCATION;
}
						
					}
					AICCResponse = null;
				}
			}
			else
				alert("Error: communication with server is not possible due to security restrictions or incompatible browser."); 
		}
		objQS = null;
	}
	if (!bHACP)
	{
		if (lmsAPI == null)
			lmsAPI = getAPI();
		if (lmsAPI != null)
		{
			// API found
			var result = lmsAPI.LMSInitialize("");
			if (result == "false")
			{
				alert("Error initializing LMS API");
			}
			else
			{
				var strFullName = lmsApiGetValue(lmsAPI, "cmi.core.student_name");
				objInfo = new Object();
				objInfo.firstName = getFirstName(strFullName);
				objInfo.lastName = getLastName(strFullName);
				var mode = lmsApiGetValue(lmsAPI, "cmi.core.lesson_mode");
				if (lmsAPI.LMSGetLastError() == 0)
				{
					objInfo.mode = mode;
					if (mode == "browse")
					{ 
						//employee is browsing the program
					}
					else if (mode == "review")
					{
						//employee is reviewing the program
					}
					else
					{
						//employee is launching the program in the normal mode
					}
				}
				//objInfo.status = lmsApiGetValue(lmsAPI, "cmi.core.lesson_status");
				objInfo.location = lmsApiGetValue(lmsAPI, "cmi.core.lesson_location");
				//objInfo.credit = lmsApiGetValue(lmsAPI, "cmi.core.credit");
				//objInfo.score = lmsApiGetValue(lmsAPI, "cmi.core.score.raw");
				objInfo.student_id = lmsApiGetValue(lmsAPI, "cmi.core.student_id");
			}
		}
	}
	if (objInfo == null)
		alert("Your progress is not being tracked by a learning management system.\nPlease print and save your Certificate of Completion.");
	else if (objInfo.location)
		objInfo.bookmark = objInfo.location;
	//{
	//	var page = parseInt(objInfo.location);
	//	objInfo.bookmark = isNaN(page) ? 0 : page;
	//}
				
	return objInfo;
}

// Function:   lmsApiGetValue
// Purpose:    Wrap calls to LMSGetValue in order to coerce the data type to string
// Note:       This assumes all returns from the LMS are string types, even those
//             that are inherently different types such as decimal or integer.
//             This is the case in SCORM 1.2 but who knows about future versions.
// TODO:       This function should support error handling.
function lmsApiGetValue(api, val)
{
	var ret = api.LMSGetValue(val);
	return ret.toString();
}

// Function:   getElapsedTime
// Purpose:    Compute the elapsed time from a start time to the present in HH:MM:SS format
function getElapsedTime(strStartTime)
{
	var startTime = new Date(strStartTime);
	var endTime = new Date();
	var ms, sec, min, hr, strElapsedTime;
	ms = endTime.getTime() - startTime.getTime();
	sec = Math.floor(ms / 1000);
	min = Math.floor(sec / 60);
	sec = sec % 60;
	hr  = Math.floor(min / 60);
	min = min % 60;
	strElapsedTime = hr < 10 ? "0" + hr : hr;
	strElapsedTime += ":" + (min < 10 ? "0" + min : min);
	strElapsedTime += ":" + (sec < 10 ? "0" + sec : sec);
	return strElapsedTime;
}

// Function:   onLMSProgress
// Purpose:    Report progress to LMS.
// Called by:  Points within the program where the elapsed time should be updated in the LMS.
function onLMSProgress(objInfo)
{
	return lmsSendInfo(objInfo, false);
}

// Function:   onLMSFinish
// Purpose:    Send the score to the LMS.
// Called by:  The last page of the game/quiz.
function onLMSFinish(objInfo)
{
	return lmsSendInfo(objInfo, false);
}

// Function:   onLMSEnd
// Purpose:    Closes the session with the LMS.
// Called by:  The end of the program.
function onLMSEnd(objInfo)
{
	var bResult  = true;

	// If AICC_URL is present, we are using HACP
	if (objInfo.aicc_url)
	{
		var aicc_url = objInfo.aicc_url;
		var aicc_sid = objInfo.aicc_sid;
		var strAICCResult;
		strAICCResult = AICCSendCommand("exitAU", aicc_url, aicc_sid, "");
			debug("exitAU result: [" + strAICCResult + "]");
		if (strAICCResult == "")
			bResult = false;
	}
	else
	{
		// Use LMS API
		var lmsApi = getAPI();
		if (lmsApi == null)
		{
			//alert("Your progress has not been tracked by a learning management system.\nPlease print and save your Certificate of Completion.");
			return false;
		}
		// Send info to LMS
		var result = lmsApi.LMSFinish("");
			debug("LMSFinish:" + result);
		if (result == "false") 
		{
			alert("Error communicating with LMS: LMSFinish failed");
			bResult = false;
		}
	}
	return bResult;
}

// Function:   lmsSendInfo
// Purpose:    Report progress to LMS, and optionally close the session.
// Called by:  onLMSProgress, onLMSFinish
function lmsSendInfo(objInfo, bFinish)
{
	var nResult = 0;

	if (objInfo.noLMS)
		return nResult;

	if (!objInfo.startTime || !objInfo.status)
	{
		alert("Error: startTime and/or status not available");
		nResult = -1;
		return nResult;
	}

	var score = objInfo.score;
	var scoreMax = objInfo.scoreMax;
	var scoreMin = objInfo.scoreMin;
	if (typeof(score) == "undefined")
	{
		score = scoreMax = scoreMin = "";
	}
	else
	{
		if (typeof(scoreMax) == "undefined")
			scoreMax = 100;
		if (typeof(scoreMin) == "undefined")
			scoreMin = 0;
	}
	var lesson_location;
	if (objInfo.bookmark)
		lesson_location = objInfo.bookmark.toString();
	else
		lesson_location = "0";
	if (objInfo.qrevid && objInfo.qchoice && objInfo.qchoice != 0)
		lesson_location += ":WRAN:" + objInfo.qrevid + "," + objInfo.qchoice;
	else if (objInfo.svrevid && (objInfo.svchoices || objInfo.svresponse))
	{
		lesson_location += ":SVAN:" + objInfo.svrevid + ",";
		if (objInfo.svchoices && objInfo.svchoices.length > 0)
			lesson_location += objInfo.svchoices;
		lesson_location += ",";
		if (objInfo.svresponse && objInfo.svresponse.length > 0)
			lesson_location += objInfo.svresponse;
	}

	var suspend_data = null;
	if (objInfo.suspend_data != 'undefined' && objInfo.suspend_data != '') {
		suspend_data = objInfo.suspend_data;
	}

var strAICCTime = getElapsedTime(objInfo.startTime);

	// If AICC_URL is present, we are using HACP
	if (objInfo.aicc_url)
	{
		var aicc_url = objInfo.aicc_url;
		var aicc_sid = objInfo.aicc_sid;
		var status = objInfo.status.substring(0, 1).toUpperCase();	// For AICC use a 1-character status
		var strAICCResult;
		var aiccScore = score;
		if (scoreMax != "")
			aiccScore += "," + scoreMax + "," + scoreMin;
		// Send info to LMS
		debug("Sending AICC data: score=" + aiccScore + "; time=" + strAICCTime + "; status=" + status + "; lesson_location=" + lesson_location + (suspend_data != null ? "; suspend_data=" + objInfo.suspend_data : ''));
		strAICCResult = AICCSendScore(strAICCTime, aiccScore, status, lesson_location, aicc_url, aicc_sid, suspend_data);
		
		if (strAICCResult != "") {
		    var err = strAICCResult.split("\r\n", 1);
		    if (err != null && typeof (err) == "object" && err.length == 1) {
			        var errNum = err[0].split("=");
			        if (errNum != null && typeof (errNum) == "object" && errNum.length == 2)
			            nResult = parseInt(errNum[1]);
                    else
                        nResult = 999;
			    }
			    else {
			        nResult = 999;
			    }
		}
		else	// Empty result indicates no connectivity
			nResult = 999;
		// TODO: Check Error and ErrorText
			debug("putParam result: [" + strAICCResult + "]");
		if (bFinish)
		{
			strAICCResult = AICCSendCommand("exitAU", aicc_url, aicc_sid, "");
				debug("exitAU result: [" + strAICCResult + "]");
		}
	}
	else
	{
		// Use LMS API
		var lmsApi = getAPI();
		if (lmsApi == null)
		{
			//alert("Your progress has not been tracked by a learning management system.\nPlease print and save your Certificate of Completion.");
			nResult = -2;
			return nResult;
		}
		// Send info to LMS
		var status = objInfo.status;
		if (score != "")
		{
			if (scoreMax != "")
			{
				if (scoreMax > 100)
				{
					// Normalize to 100
					var f = 100 / scoreMax;
					score = Math.round(score * f);
					scoreMax = 100;
				}
				lmsApi.LMSSetValue("cmi.core.score.max", scoreMax);
				lmsApi.LMSSetValue("cmi.core.score.min", scoreMin);
			}
			lmsApi.LMSSetValue("cmi.core.score.raw", score);
		}
		lmsApi.LMSSetValue("cmi.core.session_time", strAICCTime);
		lmsApi.LMSSetValue("cmi.core.lesson_status", status);
		lmsApi.LMSSetValue("cmi.core.lesson_location", lesson_location);
			debug("Setting SCORM values: score=" + score + "; score.max=" + scoreMax + "; score.min=" + scoreMin + "; time=" + strAICCTime + "; status=" + status + "; lesson_location=" + lesson_location);
		var result = lmsApi.LMSCommit("");
			debug("LMSCommit:" + result);
		if (result == "false") 
		{
   			alert("Error communicating with LMS: LMSCommit failed");
			nResult = -3;
		}
		if (bFinish)
		{
			result = lmsApi.LMSFinish("");
				debug("LMSFinish:" + result);
			if (result == "false") 
			{
   				alert("Error communicating with LMS: LMSFinish failed");
				nResult = -4;
			}
		}
	}
	return nResult;
}

// Global var for the LMS API
var _findAPITries = 0;
var API;
var _APINotFound = false;

// Function:   findAPI
// Purpose:    Try to find the LMS API in a window and its parents.
// Called by:  getAPI()
//             (Client should not call findAPI directly)
function findAPI(win)
{
	// Check to see if the window (win) contains the API
	if (typeof(win.API) != "undefined" && win.API != null)
		return win.API;

	_findAPITries++;
	if (_findAPITries > 500)
	{
		alert("Error finding LMS API -- too deeply nested.");
		return null;
	}

	// Check to see if the window has child frames
	if (win.frames.length > 0)
		for (var i = 0; i < win.frames.length; i++, _findAPITries++)
			if (win != win.opener && typeof(win.frames[i].API) != "undefined" && win.frames[i].API != null)
				return win.frames[i].API;
				
	// Check the parent window
	if (typeof(win.parent) != "undefined" && win.parent != null && win.parent != win)
		return findAPI(win.parent);
}


// Function:   getAPI
// Purpose:    Return a handle to the LMS API, or null if no API is found.
function getAPI()
{
	// If our private reference is not already set...
	if (!_APINotFound && API == null)
	{
		// Search the window and its opener windows
		// NOTE: this will cause a "Permission denied" error on IE
		//       if the opener window is not in the same domain.
		var win = window;
		while ( ((API = findAPI(win)) == null) && 
				(win.top.opener != null) && 
				(win.top.opener != win) )
		{	
			win = win.top.opener;
		}
	}
	// if the API has not been found
	if (API == null)
	{
		// Alert the user that the API could not be found
		//alert("Unable to find LMS API");
		// Set a flag so that we won't bother to search in the future
		// NOTE: this assumes a static environment, where the API will not suddenly appear later
		_APINotFound = true;
	}
	return API;
}

// Method:     trim
// Purpose:    Truncate white space from the beginning and end of a string
String.prototype.trim = new Function("return this.replace(/\\s+$|^\\s*/gi, '');");

// Function:   getFirstName
// Purpose:    Parse a full name to return the first name
function getFirstName(strFullName)
{
	var strFirst;
	var n = strFullName.indexOf(",");
	if (n >= 0)
		strFirst = strFullName.substring(n + 1).trim();
	else
	{
		n = strFullName.lastIndexOf(" ");
		if (n >= 0)
			strFirst = strFullName.substring(0, n).trim();
		else
			strFirst = "";
	}
	return strFirst;
}

// Function:   getLastName
// Purpose:    Parse a full name to return the last name
function getLastName(strFullName)
{
	var strLast;
	var n = strFullName.indexOf(",");
	if (n >= 0)
		strLast = strFullName.substring(0, n).trim();
	else
	{
		n = strFullName.lastIndexOf(" ");
		if (n >= 0)
			strLast = strFullName.substring(n + 1).trim();
		else
			strLast = strFullName;
	}
	return strLast;
}

// Function:   getQueryString
// Purpose:    Parses the querystring and returns an object
//             with the resulting parameters.
function getQueryString(win)
{
	var objQS = new Object();
	var strQS = win.location.search.substring(1).replace(/\+/g, " ");
	var arrParams = strQS.split("&");
	for (var i in arrParams)
	{
		var key, val;
		var n = arrParams[i].indexOf("=");
		if (n != -1)
		{
			key = arrParams[i].substring(0, n).toUpperCase();
			val = unescape(arrParams[i].substring(n + 1));
		}
		else
		{
			key = arrParams[i].toUpperCase();
			val = "";
		}
		objQS[key] = val;
	}
	return objQS;
}
