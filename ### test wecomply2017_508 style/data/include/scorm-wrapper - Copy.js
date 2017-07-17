//var strStatus = "";
/* CONSTANTS */
var SCORM2004_TRUE = "true";
var SCORM2004_FALSE = "false";

// cmi.completion_status
var SCORM2004_COMPLETED = "completed";
var SCORM2004_INCOMPLETE = "incomplete";
var SCORM2004_NOT_ATTEMPTED = "not attempted";

var SCORM2004_NORMAL = "normal";

// cmi.success_status
var SCORM2004_UNKNOWN = "unknown";
var SCORM2004_PASSED = "passed";
var SCORM2004_FAILED = "failed";

// SCORM 1.2 CONSTANTS
var SCORM12_NOT_ATTEMPTED = "not attempted";
var SCORM12_INCOMPLETE = "incomplete";

//var objInfo = null; // this is the object used by the AICC API
var DebugMode = { console: 1, popup: 2, http: 3, alert: 4 };
var DEBUG_MODE = false;

//LESSON_STATUS_NOT_ATTEMPTED

/* SCORM 1.2 implementation */
var API = { };
API.LMSInitialize = function (something) {
	//	if (window.location.href.indexOf("debug=1") > -1) {
	//		debugController.active = true;
	//	}
	//	if (window.location.href.indexOf("debugMode=") > -1) {
	//		
	//	}
	//	debugController.setMode(debugController.modes.popupWindow);
	if (getQsParam("debug") == "1") {
		debugController.active = true;

		var debugMode = getQsParam("debugMode");
		if (debugMode != null) {
			// none:0, alert:1,server:2, popupWindow: 3
			switch (debugMode) {
				case "0":
					debugController.setMode(debugController.modes.none);
					break;
				case "1":
					debugController.setMode(debugController.modes.alert);
					break;
				case "2":
					debugController.setMode(debugController.modes.server);
					break;
				case "3":
					debugController.setMode(debugController.modes.popupWindow);
					break;
				default:
					debugController.setMode(debugController.modes.alert);
					break;
			}
		}
	}	
	
	return API_1_2_WRAPPER.Initialize(something);
};


API.LMSGetValue = function (key) {
	return API_1_2_WRAPPER.GetValue(key);
};

API.LMSSetValue = function (key, value) {
	return API_1_2_WRAPPER.SetValue(key, value);
};

API.LMSGetLastError = function () {
	return API_1_2_WRAPPER.GetLastError();
};

API.LMSGetErrorString = function (errorId) {
	return API_1_2_WRAPPER.GetErrorString(errorId);
};

API.LMSGetDiagnostic = function (key) {
	return API_1_2_WRAPPER.GetDiagnostic(key); ;
};

API.LMSCommit = function (key) {
	return API_1_2_WRAPPER.Commit(key); ;
};

API.LMSFinish = function () {
	return API_1_2_WRAPPER.Finish();
};

var API_1484_11 = { debugMode: true };
API_1484_11.Initialize = function (something) {
	//return API_1_2_WRAPPER.Initialize(something);
	//alert('Initializing Scrom 2004');
	//return  SCORM2004_TRUE 
	if (getQsParam("debug") == "1") {
		debugController.active = true;

		var debugMode = getQsParam("debugMode");
		if (debugMode != null) {
			// none:0, alert:1,server:2, popupWindow: 3
			switch (debugMode) {
				case "0":
					debugController.setMode(debugController.modes.none);
					break;
				case "1":
					debugController.setMode(debugController.modes.alert);
					break;
				case "2":
					debugController.setMode(debugController.modes.server);
					break;
				case "3":
					debugController.setMode(debugController.modes.popupWindow);
					break;
				default:
					debugController.setMode(debugController.modes.alert);
					break;
			}
		}
	}
	return API_2004_WRAPPER.Initialize(something);
};

API_1484_11.GetValue = function (key) {
	return API_2004_WRAPPER.GetValue(key);
};

API_1484_11.SetValue = function (key, value) {
	API_2004_WRAPPER.SetValue(key, value);
};

API_1484_11.GetLastError = function () {
	//return API_WC.GetLastError();
	return API_2004_WRAPPER.GetLastError();
};

API_1484_11.GetErrorString = function (errorId) {
	//return API_WC.GetErrorString(errorId);
};

API_1484_11.GetDiagnostic = function (key) {
	//return API_WC.GetDiagnostic(key);
};

API_1484_11.Commit = function (key) {
	return API_2004_WRAPPER.Commit(key);
};

API_1484_11.Terminate = function (value) {
	return API_2004_WRAPPER.Terminate(value);
}
/* This is our wrapper for SCORM 1.2 API*/
var API_1_2_WRAPPER = { };

API_1_2_WRAPPER.debugPopupWindow = null;
API_1_2_WRAPPER.cmi = new Object();
API_1_2_WRAPPER.cmi.core = null;
API_1_2_WRAPPER.AICC = null;

API_1_2_WRAPPER.Initialize = function (something) {
	debug('Initiallizing... ' + something);
	// Get the query string parameters (if any)
	var objQS = getQueryString(window);

	if (objQS.AICC_URL) {
		// Try HACP
		var aicc_url = objQS.AICC_URL;
		if (aicc_url.toUpperCase().indexOf("HTTP") < 0)
			aicc_url = "http://" + aicc_url;
		if (canDoHACP(aicc_url)) {
			bHACP = true;
			var aicc_sid = objQS.AICC_SID ? objQS.AICC_SID : "";
			debug("Opening connection to LMS at [" + aicc_url + "] using sid [" + aicc_sid + "]");
			var strData = AICCSendCommand("getParam", aicc_url, aicc_sid, "");
			if (typeof (strData) == "undefined" || strData == "") {
				alert("Error: server did not return any data.");
			}
			else {
				debug("Got data from AICC: [" + strData + "]");
				var AICCResponse = AICCParseResponse(strData);
				//alert("Error_text: " + AICCResponse.ERROR_TEXT);
				var strStudentID = AICCResponse.STUDENT_ID;
				if (typeof (strStudentID) == "undefined" || strStudentID == "") {
					debug("Error: server returned invalid data.");
				}
				else {
					//objInfo = new Object();									
					this.cmi.core = new Object();
					this.cmi.core.student_name = AICCResponse.STUDENT_NAME;
					this.cmi.core.student_id = AICCResponse.STUDENT_ID;
					this.cmi.core.lesson_location = '';
					if (AICCResponse.SUSPEND_DATA != undefined)
						this.cmi.core.lesson_location = AICCResponse.SUSPEND_DATA;
					//					if (this.cmi.core.lesson_location == '') {
					//						this.cmi.core.lesson_location = '1';
					//					}
					this.cmi.core.lesson_mode = 'normal';
					this.cmi.core.lesson_status = "";
					switch (AICCResponse.LESSON_STATUS) {
						case "N,A":
							this.cmi.core.lesson_status = SCORM12_NOT_ATTEMPTED;
							break;
						case "I":
							this.cmi.core.lesson_status = SCORM12_INCOMPLETE;
							break;
						default:
							this.cmi.core.lesson_status = SCORM12_NOT_ATTEMPTED;
							break;
					}
					this.cmi.student_data = new Object();
					this.cmi.student_data.mastery_score = 0;

					this.cmi.core.score = new Object();
					this.cmi.core.score.raw = 0;

					this.AICC = new Object();
					this.AICC.sid = aicc_sid;
					this.AICC.url = aicc_url;
					this.AICC.startTime = new Date();
					/*
					objInfo.student_id = strStudentID;
					objInfo.location = AICCResponse.LESSON_LOCATION;
					objInfo.startTime = new Date();
					*/
				}
				AICCResponse = null;
			}
		}
		else
			debug("Error: communication with server is not possible due to security restrictions or incompatible browser.");
	}


	debug('cmi.core: ' + this.cmi.core);
	return SCORM2004_TRUE;
};

API_1_2_WRAPPER.GetValue = function (key) {
	debug('API_1_2_WRAPPER Getting key: ' + key);
	var value = eval('this.' + key);

//	var value;
//	if (key.indexOf("cmi.interactions.") == 0) {
//		if (key == "cmi.interactions._count") {
//			value = 0;
//			if (typeof (this.cmi.interactions.length) != 'undefined') {
//				value = this.cmi.interactions.length;
//			}

//		}
//		else {
//			key = key.replace(/\.(\d+)\./g, '[i$1].');
//			value = eval('this.' + key);
//		}
//	}
//	else {
//		value = eval('this.' + key);
//	}

	debug('API_1_2_WRAPPER Value = ' + value);
	return value;
};

API_1_2_WRAPPER.SetValue = function (key, value) {
	debug('Setting ' + key + '=' + value);
	var keyObjects = key.split('.');
	var object = "this";
	for (var i = 0; i < keyObjects.length - 1; i++) {

		object += '.' + keyObjects[i];
		try {
			var x = eval(object);
			if (typeof (x) == 'undefined')
				eval(object + ' = new Object()');
		} catch (e) {

		}
	}
	eval('this.' + key + ' = ' + '"' + value + '"');
	return true;
};


API_1_2_WRAPPER.GetLastError = function () {
	//this.WriteDebugMessage('Retrieving last error.');
	debug('Retrieving last error.');
	return '';
};

API_1_2_WRAPPER.GetErrorString = function (errorId) {
	//this.WriteDebugMessage('Retrieving last error for error id:' + errorId);
	debug('Retrieving last error for error id:' + errorId);
	return '';
};

API_1_2_WRAPPER.GetDiagnostic = function (key) {
	debug('Retrieving Diagnostic: key = ' + key);
	return '';
};

API_1_2_WRAPPER.Commit = function (key) {
	debug('Commit: ' + key);
	//TODO: call lmsSendInfo(objInfo, false);
	lmsSendInfo(this.GetAICCObject(), false);
	return true;
};

API_1_2_WRAPPER.Finish = function () {
	debug('Finish');
};

API_1_2_WRAPPER.GetAICCObject = function () {
	var objInfo = new Object();
	objInfo.aicc_sid = this.AICC.sid;
	objInfo.aicc_url = this.AICC.url;
	objInfo.startTime = this.AICC.startTime;
	objInfo.status = this.cmi.core.lesson_status;
	// for scorm courses, we will ignore the bookmark and use the suspend_data since we can decode the lession_location for all SCORM courses out there.
	objInfo.bookmark = 0;
	objInfo.suspend_data = this.cmi.core.lesson_location;

	// pass the score values only if these are defined
	if (typeof (this.cmi.core.score) == 'object') {

		if (typeof (this.cmi.core.score.raw) == 'string')
			objInfo.score = this.cmi.core.score.raw;

		if (typeof (this.cmi.core.score.max) == 'string')
			objInfo.scoreMax = this.cmi.core.score.max;

		if (typeof (this.cmi.core.score.min) == 'string')
			objInfo.scoreMin = this.cmi.core.score.min;
	}

	return objInfo;
};

/* This is our wrapper for SCORM 2004 API*/
var API_2004_WRAPPER = { };
API_2004_WRAPPER.cmi = new Object();
API_2004_WRAPPER.cmi.core = null;
API_2004_WRAPPER.AICC = null;
API_2004_WRAPPER.Initialize = function (something) {
	debug("Initialize(" + something + ")");
	// Get the query string parameters (if any)
	var objQS = getQueryString(window);

	if (objQS.AICC_URL) {
		// Try HACP
		var aicc_url = objQS.AICC_URL;
		if (aicc_url.toUpperCase().indexOf("HTTP") < 0)
			aicc_url = "http://" + aicc_url;
		if (canDoHACP(aicc_url)) {
			bHACP = true;
			var aicc_sid = objQS.AICC_SID ? objQS.AICC_SID : "";
			debug("Opening connection to LMS at [" + aicc_url + "] using sid [" + aicc_sid + "]");
			var strData = AICCSendCommand("getParam", aicc_url, aicc_sid, "");
			if (typeof (strData) == "undefined" || strData == "") {
				debug("Error: server did not return any data.");
			}
			else {
				debug("Got data from AICC: [" + strData + "]");
				var AICCResponse = AICCParseResponse(strData);
				//console.log(AICCResponse);
				//alert("Error_text: " + AICCResponse.ERROR_TEXT);
				var strStudentID = AICCResponse.STUDENT_ID;
				if (typeof (strStudentID) == "undefined" || strStudentID == "") {
					debug("Error: server returned invalid data.");
				}
				else {
					//objInfo = new Object();
					if (AICCResponse.LESSON_STATUS == "N,A") {
						this.cmi.completion_status = SCORM2004_NOT_ATTEMPTED;
					}
					this.cmi.core = new Object();
					this.cmi.learner_name = AICCResponse.STUDENT_NAME;
					this.cmi.learner_id = AICCResponse.STUDENT_ID;
					this.cmi.location = AICCResponse.LESSON_LOCATION;
					this.cmi.suspend_data = "";
					if (typeof(AICCResponse.SUSPEND_DATA) != 'undefined')
						this.cmi.suspend_data = AICCResponse.SUSPEND_DATA;
					
					this.cmi.mode = SCORM2004_NORMAL;

					this.cmi.interactions = [];
					this.cmi.interactions._count = 0;

					this.AICC = new Object();
					this.AICC.sid = aicc_sid;
					this.AICC.url = aicc_url;
					this.AICC.startTime = new Date();
					/*
					objInfo.student_id = strStudentID;
					objInfo.location = AICCResponse.LESSON_LOCATION;
					objInfo.startTime = new Date();
					*/
				}
				AICCResponse = null;
			}
		}
		else
			debug("Error: communication with server is not possible due to security restrictions or incompatible browser.");
	}
	return SCORM2004_TRUE;
};

API_2004_WRAPPER.GetValue = function (key) {
    debug("API_2004_WRAPPER.GetValue(" + key + ")");

    var value;
    if (key.indexOf("cmi.interactions.") == 0) {
        if (key == "cmi.interactions._count") {
            value = 0;
            if (typeof (this.cmi.interactions.length) != 'undefined') {
                value = this.cmi.interactions.length;
            }

        }
        else {
            key = key.replace(/\.(\d+)\./g, '[i$1].');
            value = eval('this.' + key);
        }
    }
    else {
        value = eval('this.' + key);
    }

    debug('API_2004_WRAPPER Value = ' + value);
    return value;
};

API_2004_WRAPPER.SetValue = function (key, value) {
	debug('Setting ' + key + '=' + value);

	if (key.indexOf("cmi.interactions.") == 0) {
		key = key.replace(/\.(\d+)\./g, '[$1].');
	}

	// remove all the new lines
	value = value.replace(/\n\r/g, "");
	
	var keyObjects = key.split('.');
	var object = "this";
	for (var i = 0; i < keyObjects.length - 1; i++) {
		// if the requested object is an array, before we check the element, make sure that the array is defined
		if (keyObjects[i].match(/\[(\d+)\]/)) {
			var baseKey = keyObjects[i].replace(/\[(\d+)\]/, '');
			var baseObject = object + '.' + baseKey;
			try {
				var b = eval(baseObject);
				if (typeof (b) == 'undefined')
					eval(baseObject + ' = []');
			}
			catch (e) {

			}
		}

		object += '.' + keyObjects[i];
		try {
			var x = eval(object);
			if (typeof (x) == 'undefined')
				eval(object + ' = []');
		} catch (e) {
		}
	}

	eval('this.' + key + ' = ' + '"' + value + '"');

	return true;
};

API_2004_WRAPPER.GetLastError = function () {
	debug("Retrieving last error");
	return '';
};

API_2004_WRAPPER.Commit = function (key) {
	debug('Commit: ' + key);
	lmsSendInfo(this.GetAICCObject(), false);
	return true;
};

API_2004_WRAPPER.Terminate = function (value) {
	debug('Terminate: ' + value);	
	return true;
};

API_2004_WRAPPER.GetAICCObject = function () {
    var objInfo = new Object();
    objInfo.aicc_sid = this.AICC.sid;
    objInfo.aicc_url = this.AICC.url;
    objInfo.startTime = this.AICC.startTime;
    objInfo.status = this.cmi.completion_status;
    objInfo.suspend_data = this.cmi.suspend_data;
    //	if (this.cmi.location != 'undefined') {
    //		// does it start with "viewed=" ? (Adobe courses)
    //		// ex: cmi.suspend_data=viewed=1,2|lastviewedslide=2|
    //		if (this.cmi.location.indexOf("viewed=") == 0) {
    //			var parts = cmi.suspend_data.split('|');
    //			if (parts.length > 0) {
    //				var viewsPages = parts[0].substring("viewed=").split(',');
    //				if (viewsPages.length > 0) {
    //					objInfo.bookmark = viewsPages[viewsPages.length - 1];
    //				}
    //			}
    //		}
    //	}

    // in case we couldn't figure out the format of the bookmark, set it to the first page as a backup solution
    if (objInfo.bookmark == 'undefined')
        objInfo.bookmark = "1";

    // pass the score values only if these are defined
    // we do some weird stuff here to accomodate the normalization that is being done in the code behind that is custom to WeComply's LMS
    // The idea is that the max is the scale(percentage) *1000 and the score is the scale * calculated max
    if (typeof (this.cmi.score) == 'object') {

        if (typeof (this.cmi.score.scaled) != 'undefined') {
            objInfo.scoreMax = this.cmi.score.scaled * 1000;
            objInfo.score = objInfo.scoreMax * this.cmi.score.scaled;
        }

        /*
        if (typeof (this.cmi.interactions._count) != 'undefined')
            objInfo.scoreMax = this.cmi.interactions._count * 100;

        if (typeof (this.cmi.score.min) == 'string')
            objInfo.scoreMin = this.cmi.score.min;
        */
    }

    return objInfo;
   };


function getQsParam(paramName) {
	var paramValue = null;
	var params = null;
	if ((window.frames != null)
		&& (window.frames[0] != null)		
		&& (window.frames[0].location.search.length > 0)) {
   		params = document.frames[0].document.location.search.substring(1).split('&');
   		for (i = 0; i<params.length; i++) {
   			var qsParam = params[i].split('=');
   			if (qsParam[0] == paramName) {
   				paramValue = qsParam[1];
   				break;
   			}
   		}
   	}

	return paramValue;
}