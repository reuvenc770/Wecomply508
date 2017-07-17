wc.flashInterface = { requiredMajorVersion :'9',jsVersion : '1.0', alternateContent : '', src :'../static/training/xmlplayer943615.swf', languageId : '1033',alphabet :'other',
    fixedImagePath: '../images/training/', fixedMediaPath: '/datafiles/', staticPath : '../static/training/', styleSheetPath: '', customStyleSheetPath: '', flashSkin: '', elementId: 'flashChapter', wrapperDivId: 'flashChapterDiv'
};
wc.flashInterface.getPlayerVersion = function() {
    return swfobject.getFlashPlayerVersion();
};
wc.flashInterface.isSupportedFlashVersion = function () {
    if (wc.flashInterface.getPlayerVersion().major >= wc.flashInterface.requiredMajorVersion)
        return true;
    else
        return false;
};
wc.flashInterface.embed = function (src, id, width, height, flashVersion, flashVars, params, attributes, callBack) {
    wc.flashInterface.log('embed(' + src + ', ' + id + ', ' + width + ', ' + height + ', ' + flashVersion + ', ' + flashVars + ', ' + params + ', ' + attributes + ', ' + callBack + ')');
    swfobject.embedSWF(src, id, width, height, flashVersion, false, flashVars, params, attributes, callBack);
};
wc.flashInterface.log = function (val) {	
	if (isDefined(window.console) && isDefined(window.console.log)) {		
		console.log(val);		
	}
};

wc.flashInterface.setChapterNumber = function (chapterNumber) {
    wc.flashInterface.log('setChapterNumber('+chapterNumber+')');
    g_curPage = chapterNumber;
    wc.interface.currentElement.chapterIndex = chapterNumber - 1;

    if (chapterNumber > g_highestPage)
        g_highestPage = chapterNumber; // set the highest page visited
};

wc.flashInterface.setLanguage = function () {
    wc.flashInterface.log('setLanguage()');
    if (isDefined(wc.data.jsonData.language))
        wc.flashInterface.languageId = wc.data.jsonData.language;

    for (var i = 0; i < wc.languages.length; i++) {
        if (wc.languages[i].id == wc.flashInterface.languageId) {
            wc.flashInterface.alphabet = wc.languages[i].alphabet;
            break;
        }
    }
};

wc.flashInterface.getFlashElement = function() {
    return document.getElementById(wc.flashInterface.elementId);
};
wc.flashInterface._isFlashElementLoaded = null;
wc.flashInterface.isFlashElementLoaded = function () {
    wc.flashInterface.log('isFlashElementLoaded()');
    if (wc.flashInterface._isFlashElementLoaded == null) {
        if (isDefined(wc.flashInterface.getFlashElement())) {
            if (isDefined(wc.flashInterface.getFlashElement().StartChapter))
                return true;
            //wc.flashInterface._isFlashElementLoaded = true;
        }
    }
    if (wc.flashInterface._isFlashElementLoaded)
        return true;
    else
        return false;

};

wc.flashInterface.maxLoadAttempts =20;
wc.flashInterface.loadAttempts = 0;
wc.flashInterface.startOnFlashReady = function (start) {
    wc.flashInterface.log('loadstartOnFlashReady(' + start + ')');
    if (!isDefined(start))
        start = true;

    if (wc.flashInterface.isFlashElementLoaded()) {
        g_bFlashAvailable = true;
        wc.flashInterface.toggleMultimedia(start);
    } else {
        if (wc.flashInterface.maxLoadAttempts > wc.flashInterface.loadAttempts) {
            wc.flashInterface.currentLoadTime++;
            setTimeout(function () {
                wc.flashInterface.startOnFlashReady(start);
            }, 500);
        } else {
            wc.flashInterface.log('cannot load flash');
        }
    }
};

/*wc.flashInterface.doFlashCheck = function() {
    if (wc.flashInterface.isSupportedFlashVersion()) {
       wc.flashInterface.alternateContent = '<br/>This content requires an updated version of Macromedia Flash Player.';
       wc.flashInterface.alternateContent += '<br/>Follow the instructions after clicking the button and close all other browser windows.<br/>';
       wc.flashInterface.alternateContent += '<br/>For help, please contact your local IT helpdesk.<br/>';
       wc.flashInterface.alternateContent += '<br/><input type="button" onclick="getNewPlayer()" value="Get the latest Flash player">';
       document.getElementById("FlashUpdate").innerHTML = wc.flashInterface.alternateContent; // insert non-flash content
    } else {
       wc.flashInterface.init();
    }
};*/
wc.flashInterface.loadGameChoice = function () {
    wc.flashInterface.load(getNumChapters());
};
wc.flashInterface.load = function (chapterIndex) {
    wc.flashInterface.log('load(' + chapterIndex + ')');
    if (!isDefined(chapterIndex)) {
        chapterIndex = 0;
    }

    wc.flashInterface.staticPath = wc.data.values["StaticHtmlPath"];
    var location = window.location.pathname
    var directory = location.substring(0, location.lastIndexOf('/'));
    wc.flashInterface.staticPath = directory + '/';

    wc.flashInterface.setChapterNumber(chapterIndex + 1);

    wc.flashInterface.setLanguage();

    document.getElementById('viewPort').style.display = 'none';
    document.getElementById('flashViewPort').innerHTML = '<div id="' + wc.flashInterface.wrapperDivId + '" style="width:100%;height:100%;"><div id="flashChapter"></div></div>';

    wc.flashInterface.fixedImagePath = wc.flashInterface.fixStaticPath(wc.data.values["ImagePath"]);
    wc.flashInterface.fixedMediaPath = wc.flashInterface.fixStaticPath(wc.data.values["MediaPath"]);
    //wc.flashInterface.fixedImagePath = wc.data.values["ImagePath"];
    //wc.flashInterface.fixedMediaPath = wc.data.values["MediaPath"];
    wc.flashInterface.src = wc.flashInterface.fixStaticPath(wc.data.values["StaticHtmlPath"] + 'xmlplayer943615.swf');
    
    //,
    wc.flashInterface.flashSkin = wc.data.values["FlashSkin"];

    var flashVars = { ImageFolder: wc.flashInterface.fixedImagePath, MediaFolder: wc.flashInterface.fixedMediaPath, Alphabet: wc.flashInterface.alphabet, MinimumPassingScore: 0, waitForAudio: 0, SkinName: wc.flashInterface.flashSkin, useAltIntroAudio: true };
    var params = {};
    var flashAttributes = {};

    wc.flashInterface.embed(wc.flashInterface.src, wc.flashInterface.elementId, '100%', '100%', wc.flashInterface.requiredMajorVersion, flashVars, params, flashAttributes, function () {
        wc.flashInterface.startOnFlashReady();
    });

    /*f.setAttribute("loop", "false");
    f.setAttribute("menu", "false");
    f.setAttribute("quality", "high");
    f.setAttribute("salign", "t");
    f.setAttribute("align", "t");
    f.setAttribute("scale", "default");
    f.setAttribute("bgcolor", "#FFFFFF");
    f.setAttribute("WIDTH", "100%");
    f.setAttribute("HEIGHT", "100%");
    f.setAttribute("play", "true");
    f.setAttribute("allowScriptAccess", "sameDomain");
			
    f.setAttribute("pluginspage", "http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0");
    */


    //FlashReady();
    //doFlashCheck();

};

//Obsolete
function DoMultimedia(bStart) {
    wc.flashInterface.toggleMultimedia(bStart);
}

wc.flashInterface.toggleMultimedia = function (start) {
    wc.flashInterface.log('toggleMultimedia('+start+')');
    if (!wc.flashInterface.isFlashElementLoaded()) {
        // Flash object not available yet, wait 100ms and try again
        wc.flashInterface.startOnFlashReady(start);
        return;
    }

    var flashChapter = wc.flashInterface.getFlashElement();
    if (isDefined(flashChapter)) {
        if (start) {
            var startParam = (g_curPage == 1);
            flashChapter.StartChapter(startParam);
        } else {
            flashChapter.StopChapter();
        }
    } else {
        wc.flashInterface.log("No " + wc.flashInterface.wrapperDivId + " or flashChapter object!!!");
        alert("No " + wc.flashInterface.wrapperDivId + " or flashChapter object!!!");
    }
};



var objQueryString;


var objQueryString = getQueryString(this);
var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;
var isFF = (navigator.userAgent.indexOf("Firefox") != -1) ? true : false;

var g_bFlashAvailable = false;

var urlArgs;
var popupHandle;
var g_timer = 0;
var g_arrWrongAnswer;
var g_correctQuestions = 0;
var g_totalQuestions = 0;
//var strLastName = "";
//var strFirstName = "[Employee's Name]";
var g_objLocalizedStrings;
var g_arrChapterXML;
//var g_arrChapterFooter;
var g_varietyGame = "";
//var g_arrGameNamesToIndex; 

var g_bDelayStart = false;
var g_bookmark = 1;
var g_highestBookmark = 0;
var g_gamePage = 10;

var g_highestPage = 0;
var g_curPage = 0;
var g_bDoBookmarkUpdate = true;

function runtimeSub(mainHTML) {
    wc.flashInterface.log('runtimeSub(mainHTML)');
	//get all span elements
	var newText;
	var spans = null;
	spans = mainHTML.document.getElementsByTagName("span");

	if (spans != null) {
		if (typeof(spans.length) != "undefined") {
			for (i = 0; i < spans.length; i++) {
				newText = GetGlobal(spans.item(i).id);
				if (newText != null && (typeof(newText) == "object" || typeof(newText) == "string"))
					spans.item(i).innerHTML = newText;
			}
		} else {
			if (spans.id) {
				newText = GetGlobal(spans.id);
				if (newText != null && (typeof(newText) == "object" || typeof(newText) == "string"))
					spans.innerHTML = newText;
			}
		}
	}
}


function getCopyrightYears() {
    wc.flashInterface.log('getCopyrightYears()');
	var str;
	var baseYear = "2000";
	var now = new Date();
	var thisYear = now.getFullYear();
	if (baseYear != thisYear)
		str = baseYear + " - " + thisYear;
	else
		str = thisYear;

	return str;
}

function GetGlobal(id) {
    wc.flashInterface.log('GetGlobal(' + id + ')');
    var str;
	switch (id) {
		case "FirstName":
		    return wc.lms.objInfo.firstName;
			break;

		case "LastName":
		    return wc.lms.objInfo.lastName;
			break;
		case "CurDate":
			str = getCurDate();
			break;

		case "CopyrightYears":
			str = getCopyrightYears();
			break;

		default:
			return id;
			break;
	}

	return str;
}

function getCurDate() {
	var today = new Date();
	return today.toLocaleString();
}

function GetLocalizedString(key) {
    wc.flashInterface.log('GetLocalizedString('+key+')');
   try {
       switch (key) {
       case "FirstName":
       case "LastName":
           return GetGlobal(key);
       case "CurDate":
           return getCurDate();
       case "PageOf":
           {
               var out, str = wc.data.values["key"];
               var re;
               re = /P1/g ;
               out = str.replace(re, g_curPage.toString());
               var total = 9;
               re = /P2/g ;
               str = out.replace(re, total.toString());
               return str;
           }
       case "Copyright":
           {
               var str = 'Copyright \xA9 ';
               str += getCopyrightYears();
               str += '. All rights reserved.';

               return str;
           }
       case "ProgramName":
           {
               return wc.data.values["courseName"];
           }
       default:
           if (wc.data.resources[key.toString().toLowerCase()])
               try {
                   return wc.data.resources[key.toString().toLowerCase()];
               } catch(e) {
                   return key;
               }
           else {
               return key;
           }
       }
   }catch (ex) {
    wc.flashInterface.log(ex);
   }
}


function reportNoAck(bExit) {
    wc.flashInterface.log('reportNoAck(' + bExit +')');
	// Report to the LMS
	if (objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
			if (typeof (parent.lmswin.fail) == "function")
				parent.lmswin.fail(bExit);
		}
	}
}

function earlyExit() {
    wc.flashInterface.log('earlyExit()');
	// Report to the LMS
	if (objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
			if (typeof (parent.lmswin.earlyExit) == "function")
				parent.lmswin.earlyExit();
		}
	}
}

function reportScore(correctQuestions, totalQuestions, bGame) {
    wc.flashInterface.log('reportScore(' + correctQuestions + ', ' + totalQuestions + ', '+ bGame + ')');
	// bGame = true if program has a game
	if (true == parent.lmswin.bNoLMS)
		return true;

	var nLMSResult = 999; // general failure

	// Report score to the LMS
	if (objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
			if (typeof (parent.lmswin.finish) == "function") {
				try {
					nLMSResult = parent.lmswin.finish(correctQuestions, totalQuestions);

				}
				catch (e) {
				}
			}
		}
	}

	if (0 != nLMSResult)
		NoConnectivityAtCertificate(g_curPage - 1);

	return (0 == nLMSResult);
}

function LostSession() {
    wc.flashInterface.log('LostSession()');
	//"You have restarted this course from the Programs page and invalidate the current session.\nExit the program and start the program again.";
	var strWarning = "This session has been invalidated.\nPlease exit and start the program again.";
	NavigateWarning(strWarning, -1, false, true, false);
}

function NoConnectivityAtCertificate(fromDiv) {
    wc.flashInterface.log('NoConnectivityAtCertificate(' + fromDiv + ')');
	//"You have previously lost connectivity - you cannot receive your Certificate unless you are online.\nExit the program or press Retry to try to reestablish connectivity.";
	var strWarning = "You have previously lost the connection. You cannot receive the Certificate unless you are online. Exit and restart the program, or press Retry to try to connect.";

	NavigateWarning(strWarning, fromDiv, false, true, true);
}

function NoConnectivityAtSurvey(fromDiv) {
    wc.flashInterface.log('NoConnectivityAtSurvey(' + fromDiv + ')');
	//"You have lost connectivity - the Survey cannot be recorded unless you are online.\nExit the program or press Retry to try to reestablish connectivity.";
	var strWarning = "You have lost connectivity - the Survey cannot be recorded unless you are online.\nExit the program or press Retry to try to reestablish connectivity.";

	NavigateWarning(strWarning, fromDiv, false, true, true);
}

function LostConnectivity(strWantedPage) {
    wc.flashInterface.log('LostConnectivity(' + strWantedPage + ')');
	var divCert = parseInt(12);
	if (divCert == parseInt(strWantedPage))
		return NoConnectivityAtCertificate(divCert - 1);

	//"You have lost connectivity. You may continue with the program but not the Game and will not receive a Certificate unless connectivity is restored.\nExit the program or press Continue to continue with the program.";
	var strWarning = "The connection is no longer available. You may continue with the program but bookmarks will not be saved, and you may not receive a Certificate unless connectivity is restored. Exit and restart the program, or press Continue to work offline.";
	NavigateWarning(strWarning, strWantedPage, true, true, false);
}

function GainedConnectivity(strWantedPage) {
    wc.flashInterface.log('LostConnectivity('+strWantedPage+')');
	//"You have regained connectivity.\nPress Continue to finish the program.";
	var strWarning = "The connection has been restored.\nPress Continue to finish the program.";
	NavigateWarning(strWarning, strWantedPage, true, false, false);
}

var divWarnContinuePrev, divWarnContinueNext;
function WarnContinue() {
    wc.flashInterface.log('WarnContinue()');
	NavigateDiv(divWarnContinuePrev, divWarnContinueNext);
}

function NavigateWarning(strWarning, div, bContinue, bExit, bRetry) {
    wc.flashInterface.log('NavigateWarning(' + strWarning + ','+div+','+bContinue +','+bExit+','+bRetry+')');
	// note: there is no exit button - gives script warning trying to close window, display no button and just let user close it
	var divFrom = g_curPage; // this div is probably hidden already - we came from NavigateDiv....
	var btn1 = document.getElementById("idWarnBtn1");
	var btn2 = document.getElementById("idWarnBtn2");
	var text = document.getElementById("idWarnText");
//	text.innerHTML = strWarning;
alert("NavigateWarning "  + strWarning);

	if (bContinue) {
		btn1.value = "Continue";
		divWarnContinuePrev = "WARN";
		divWarnContinueNext = div;
		btn1.style.display = "inline";
	}
	else
		btn1.style.display = "none";

	if (bRetry) {
		btn2.value = "Retry";
		btn2.style.display = "inline";
		divFrom = div;
	}
	else
		btn2.style.display = "none";

	NavigateDiv(divFrom, "WARN");
}

function RecheckConnectivity(fromDiv) {
    wc.flashInterface.log('RecheckConnectivity(' + fromDiv + ')');
	if (/*objInfo != null && */parent.lmswin != null && typeof (parent.lmswin) == "object" && parent.lmswin.bFinished != null) {
		updateBookmark(); // make sure that connectivity is checked

		// either online or offline certificate
		if (true == parent.lmswin.bHasConnectitivity || true == parent.lmswin.bNoLMS) {
			NavigateDiv(fromDiv, g_curPage + 1);
			return; // successful!
		}
	}

	//if no objInfo, never connected ---- should be doing the email thing...
	var divCert = 12;
	if (divCert == g_curPage + 1)
		NoConnectivityAtCertificate(fromDiv);
	else
		NoConnectivityAtSurvey(fromDiv);
}

function gotoSelected() {
    wc.flashInterface.log('gotoSelect()');
	g_highestBookmark = 0; // always reset bookmark to whatever the user picked

	var selectedDiv = "1"; // default to page 1
	if (document.LMSForm.bookmark[0].checked)
		selectedDiv = g_bookmark.toString();

	NavigateDiv("0", selectedDiv);
}

function getNewPlayer() {
    wc.flashInterface.log('getNewPlayer()');
	window.open("http://www.macromedia.com/go/getflash");
	setTimeout("top.close()", 100);
}



function updateBookmarkDiv() {
    wc.flashInterface.log('updateBookmarkDiv()');
	var questionSpan, answerSpan1, answerSpan2;


	questionSpan = document.getElementById("spanQuestion");
	answerSpan1 = document.getElementById("spanAnswer1");
	answerSpan2 = document.getElementById("spanAnswer2");

	if (g_bookmark == g_gamePage) {
		if (objInfo.bookmark == "-2") {
			questionSpan.innerHTML = GetLocalizedString("PodcastDownloaded");
			answerSpan1.innerHTML = GetLocalizedString("PodcastReviewed");
			answerSpan2.innerHTML = GetLocalizedString("PodcastRestartCourse");
		} else {
			questionSpan.innerHTML = GetLocalizedString("PreviouslyCompleted");
			answerSpan1.innerHTML = GetLocalizedString("ProceedtoGame");
			answerSpan2.innerHTML = GetLocalizedString("BeginWithLesson");
		}
	}
	else {
		questionSpan.innerHTML = GetLocalizedString("PreviouslyBegun");
		answerSpan1.innerHTML = GetLocalizedString("Continuewith") + g_bookmark;
		answerSpan2.innerHTML = GetLocalizedString("BeginWithLesson");
	}
	//document.LMSForm.bookmark[0].value = " " + g_bookmark + " ";	// ??? DR
	document.LMSForm.bookmark[0].value = g_bookmark;
	document.LMSForm.bookmark[0].checked = true;

	document.getElementById('div0').style.display = 'block';
	document.getElementById('divINTRO').style.display = 'none';
}

function updateBookmark(strPage) {
    wc.flashInterface.log('UpdateBookmark('+strPage+')');
	var lastBookmark = g_highestBookmark;
	if (strPage != null) {
		var nPage = parseInt(strPage);

		if (nPage > g_highestBookmark)
			g_highestBookmark = nPage;
	}

	// Report progress to the LMS
if (wc.lms.objInfo != null && wc.lms.window != null) {
		var nLMSResult = 999; // general error

		if (typeof (wc.lms.window) == "object") {
		    if (typeof (wc.lms.window.progress) == "function") {
				var str;
				if (g_highestBookmark >= g_gamePage) {
					// allowing navigatation to GamePage to display "do not close" message
					//	can be > g_gamePage (when more than one game - it is the game choice page)
				    if (wc.lms.objInfo.bookmark == "-2")
						str = "-2";
					else
						str = "-1";
				}
				else
					str = g_highestBookmark.toString();

				try {
					if (typeof (strCurQuestionID) != "undefined" && strCurQuestionID != null && nAnswerMissedFirst != 0)
					    nLMSResult = wc.lms.window.progress(str, strCurQuestionID, nAnswerMissedFirst);
					else
					    nLMSResult = wc.lms.window.progress(str, 0, 0);
				}
				catch (e) {
					nLMSResult = 999; // assume no connectivity
				}
			}

			if (0 != nLMSResult) {
				g_highestBookmark = lastBookmark; // reset bookmark if error, never got there....
			}

			if (3 == nLMSResult) {
				// session has been deleted - can't continue
				LostSession();
				return false;
				//alert("session has been deleted - can't continue!");
			}

            if (nLMSResult != 0 && wc.lms.window.bHasConnectitivity || nLMSResult == 0 && !wc.lms.window.bHasConnectitivity) {
				// only if changed...
                wc.lms.window.bHasConnectitivity = (0 == nLMSResult);

				if (0 == nLMSResult)
					GainedConnectivity(strPage);
				else
					LostConnectivity(strPage);

				return false;
			}
		}
	}
	else {
		// from quiz, strPage is not specified
		// don't send answers that weren't missed (== 0)
		if (null == strPage && strCurQuestionID != null && nAnswerMissedFirst != 0) {
			// do some offline tracking
			if (g_arrWrongAnswer == null && typeof (g_arrWrongAnswer) != "object")
				g_arrWrongAnswer = new Array();

			var question = new Object();
			question["RevID"] = strCurQuestionID;
			question["index"] = nAnswerMissedFirst;
			g_arrWrongAnswer.push(question);
		}
	}

	return true;
}

function loadOfflineMailHref() {
    wc.flashInterface.log('loadOfflineMailHref');
	var oUser = document.getElementById("idUser");
	var oPassword = document.getElementById("idPassword");
	var oLink = document.getElementById("idMailLink");
	if (oUser.value == "") // allow blank password || oPassword.value == "")
	{
		oLink.href = "javascript:void(0)";
	}
	else {
		if (0 == g_totalQuestions) {
			g_correctQuestions = 1;
			g_totalQuestions = 1;
		}

		var strScore = g_correctQuestions + "," + g_totalQuestions;

		var strProgramID = objQueryString["PROGRAMID"];

		var str = "mailto:";
		str = str + "Tracker@WeComply.com";
		str = str + "?Subject=";
		str = str + "WeComply Training Completion";
		//WeComply Training Completion
		str = str + "&body=";
		str = str + "YOU MUST SEND THIS E-MAIL TO TRANSMIT TRAINING RESULTS";
		//YOU MUST SEND THIS E-MAIL TO TRANSMIT TRAINING RESULTS
		str = str + "%0A";
		str = str + "DO NOT MODIFY THE CONTENTS OF THIS MESSAGE.";
		//DO NOT MODIFY THE CONTENTS OF THIS MESSAGE.
		str = str + "%0A++==";
		var results = strScore + "," + strProgramID + "," + oUser.value + "," + oPassword.value + "," + 1033 + ",";
		var now = new Date();
		results = results + Date.parse(g_startTime) + "," + Date.parse(now) + ","; // start, stoptime

		var nWrongs = 0;
		if (typeof (g_arrWrongAnswer) == "object" && g_arrWrongAnswer != null)
			nWrongs = g_arrWrongAnswer.length;

		for (var nCur = 0; nCur < nWrongs; nCur++) {
			results = results + g_arrWrongAnswer[nCur]["RevID"] + "=" + g_arrWrongAnswer[nCur]["index"];
			if ((nCur + 1) < nWrongs)
				results = results + "+";
		}

		results = results + ":" + GetChecksum(results);
		results = Encode(results);
		results = results + " " + GetChecksum(results);

		str = str + results + "==++%0A";
		oLink.href = str;

		top.close();
	}
}

function GetChecksum(str) {
    wc.flashInterface.log('GetChecksum(' + str + ')');
	// simply add up all the bytes - don't trucate (or negate?)
	var nVal = 0;
	var nLen = str.length;
	for (var nCur = 0; nCur < nLen; nCur++) {
		nVal += str.charCodeAt(nCur);
	}

	//	nVal *= -1;
	//	nVal &= 0xFF;
	var strVal = nVal.toString(16);

	return strVal;
}

function Encode(str) {
    wc.flashInterface.log('Encode(' + str + ')');
	var arrOut = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.'"; // 64 chars
	// low 5
	// middle 5
	// high 6 (rest)
	var strOut = "";
	var nVal = 0;
	var nLen = str.length;
	for (var nCur = 0; nCur < nLen; nCur++) {
		nVal = str.charCodeAt(nCur);
		strOut = strOut + arrOut.charAt(nVal & 0x1f);
		nVal = nVal >>> 5;
		strOut = strOut + arrOut.charAt(nVal & 0x1f);
		nVal = nVal >>> 5;
		strOut = strOut + arrOut.charAt(nVal);
	}

	return strOut;
}

function doHyperlink(hrefStr) {
    wc.flashInterface.log('doHyperlink()');
	var idFlash = "flashChapter";
	try {
		document.getElementById(idFlash).doHyperlink(hrefStr);
	}
	catch (e) {
	}
}

function getNumChapters() {
    wc.flashInterface.log('getNumChapters()');
	// include Ack if there is one
    return wc.data.jsonData.chapters.length;
}

function getChapterNum() {
    wc.flashInterface.log('getChapterNum()');
    return wc.interface.currentElement.chapterIndex + 1;
}

function getBrowserWindowSize() {
    wc.flashInterface.log('getBrowserWindowSize()');
	var myHeight = 0;
	var myWidth = 0;
	if (typeof (window.innerWidth) == 'number') {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	}
	else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	}
	else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}

	return [myWidth, myHeight];
}

//Obsolete
function getFlashMovieObject(movieName) {
    wc.flashInterface.log('getFlashMovieObject()');

    return wc.flashInterface.getFlashElement();
}

// THIS NEEDS TO BE PUT INTO AN EVENT!!!!
window.onresize = tellFlashOfBrowserResize;

function tellFlashOfBrowserResize() {
    wc.flashInterface.log('tellFlashOfBrowserResize');
	if (g_curPage >= 1 && g_curPage <= 11) {
		var flashChapter = wc.flashInterface.getFlashElement();
		if (flashChapter != null) {
			try {
				flashChapter.browserHasResized();
			}
			catch (e) {
			}
		}
	}
}

function sizeFlashWidth(newsize) {
    var idFlashDiv = wc.flashInterface.wrapperDivId;
    var idFlash = wc.flashInterface.elementId;
	try {
	    document.getElementById(wc.flashInterface.wrapperDivId).style.width = newsize + "px";
	    document.getElementById(wc.flashInterface.elementId).style.width = newsize + "px";
	}
	catch (e) {
	}
}

function sizeFlashHeight(newsize) {
    var idFlashDiv = wc.flashInterface.wrapperDivId;
    var idFlash = wc.flashInterface.elementId;
	try {
	    document.getElementById(wc.flashInterface.wrapperDivId).style.height = newsize + "px";
	    document.getElementById(wc.flashInterface.elementId).style.height = newsize + "px";
	}
	catch (e) {
	}
}

function getScrollBarPosition() {
	var posX = 0, posY = 0;

	if (window.innerWidth)
		posX = window.pageXOffset;
	else if (document.documentElement && document.documentElement.scrollLeft)
		posX = document.documentElement.scrollLeft;
	else if (document.body)
		posX = document.body.scrollLeft;

	if (window.innerHeight)
		posY = window.pageYOffset;
	else if (document.documentElement && document.documentElement.scrollTop)
		posY = document.documentElement.scrollTop;
	else if (document.body)
		posY = document.body.scrollTop;

	return [posX, posY];
}

function FlashReady() {
	g_bFlashAvailable = true;
}

function SendChapterSurvey(strChapter, responses) {
    wc.flashInterface.log('SendChapterSurvey(' +  strChapter+ ', '+ responses +')');
	if (true == parent.lmswin.bNoLMS)
		return true;

	var nLMSResult = 999; // general failure

	// Report score to the LMS
	if (objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
			if (typeof (parent.lmswin.svprogress) == "function") {
				try {
					if (typeof (responses.length) != "undefined") {
						var revId, choice, response, arrParams;
						for (var i = 0; i < responses.length; i++) {
							// make sure responses are all strings
							revId = responses[i++].toString();
							choice = responses[i++].toString();
							if ("null" == choice)
								choice = "";
							response = AdjustSurveyResponse(responses[i].toString());

							nLMSResult = parent.lmswin.svprogress(strChapter, revId, choice, response);
							if (0 != nLMSResult)
								break;
						}
					}
					else {
						alert("error in SendChapterSurvey, not enough data");
					}
				}
				catch (e) {
					alert("error in SendChapterSurvey, not enough data");
				}
			}
		}
	}

	if (0 != nLMSResult)
		NoConnectivityAtSurvey(strChapter);

	return (0 == nLMSResult);
}

function AdjustSurveyResponse(responseIn) {
	var i;
	var outStr = "";

	// replace all less than signs
	var arrParams = responseIn.split("<");
	for (i = 0; i < arrParams.length; i++) {
		outStr += arrParams[i];

		if (i < (arrParams.length - 1))
			outStr += "&lt;";
	}

	// replace all greater than signs
	arrParams = outStr.split(">");
	for (i = 0; i < arrParams.length; i++) {
		if (0 == i)
			outStr = "";

		outStr += arrParams[i];

		if (i < (arrParams.length - 1))
			outStr += "&gt;";
	}

	// strip all plus signs
	arrParams = outStr.split("+");
	for (i = 0; i < arrParams.length; i++) {
		if (0 == i)
			outStr = "";

		outStr += arrParams[i];
	}

	// strip all equal signs
	arrParams = outStr.split("=");
	for (i = 0; i < arrParams.length; i++) {
		if (0 == i)
			outStr = "";

		outStr += arrParams[i];
	}

	return outStr;
}

function NavigateChapter(direction) {
    wc.flashInterface.log('NavigateChapter(' + direction + ')');
	if (direction > 0) {
		NavigateForward(1);
	}
	else if (direction < 0) {
		NavigateBackward(1);
	}
	else {
		NavigateDiv(g_curPage, 9 + 1);
	}
}

function NavigateForward(numChapters) {
    wc.flashInterface.log('NavigateForward(' + numChapters + ')');
	var chapCount = 9;
	if (g_curPage >= chapCount)
		numChapters = 1;

	var newChapter = g_curPage + numChapters;
	//wc.flashInterface.log('NavigateForward>g_curPage=' + g_curPage + ')');
	if (numChapters > 1) {
		if ((g_curPage < chapCount) && (newChapter > chapCount))
			NavigateExitChapters();
		else
			NavigateDiv(g_curPage, newChapter);
	}
	else {
		NavigateDiv(g_curPage, newChapter);
	}
}

function NavigateBackward(numChapters) {
    wc.flashInterface.log('NavigateBackward(' + numChapters + ')');
	if (g_curPage <= 9) {
		var newChapter = g_curPage - numChapters;
		if (newChapter <= 1)
			NavigateDiv(g_curPage, 1);
		else
			NavigateDiv(g_curPage, newChapter);
	}
}

function NavigateExitChapters() {
	NavigateDiv(g_curPage, 10);
}

function NavigateDiv(currentChapterValue, nextChapterValue) {
    wc.flashInterface.log('NavigateDiv(' + currentChapterValue + ', ' + nextChapterValue + ')');

    if (nextChapterValue < 1) {
        nextChapterValue = 1;
    } else {

    }

    wc.flashInterface.setChapterNumber(nextChapterValue);

    //Course 1-9 chapters (index 0-8)
    //GameChoice 10 (index 9)
    //Game 10  (index 9)
    //Certificate 11  (index 10)

    if (nextChapterValue <= getNumChapters()) {
        wc.flashInterface.toggleMultimedia(true);
        updateBookmark(nextChapterValue);
    } else {
        if (nextChapterValue == getNumChapters() + 1) {
            //Go to game choice
            wc.flashInterface.toggleMultimedia(true);
        } else {
            //TODO: implement logic to go to certificate
            document.getElementById('viewPort').style.display = '';
            document.getElementById('flashViewPort').style.display = 'none';
            wc.interface.actionHandler.displayCertificate();
        }
    }
    return;
	var bCurIsFlash = false;
	var bNextIsFlash = false;
	//var divCert = parseInt(12);
	//var gamepage = "11";

	if (isDefined(currentChapterValue)) {
		var curDivNum = 0;
		if (typeof (currentChapterValue) == "number") {
			curDivNum = currentChapterValue;
		}
		else if (typeof (currentChapterValue) == "string") {
			curDivNum = parseInt(currentChapterValue);
		}
		else {
			alert("currentChapterValue unknown " + currentChapterValue);
		}

		if ((curDivNum >= 1 && curDivNum <= 11) ||
					(curDivNum == gamepage)) {
			bCurIsFlash = true;
		}
	}

	var nextDivNum = 0;
	if (nextChapterValue != null) {
		if (typeof (nextChapterValue) == "number") {
			nextDivNum = nextChapterValue;
		}
		else if (typeof (nextChapterValue) == "string") {
			nextDivNum = parseInt(nextChapterValue);
		}
		else {
			alert("nextChapterValue unknown " + nextChapterValue);
		}

		// at this point, if the next page is the game page, we still don't know if there is a Flash game - FlashPageCount doesn't include games
		if ((nextDivNum >= 1 && nextDivNum <= 11) ||
					(nextDivNum == gamepage)) {

			bNextIsFlash = true;
		}
	}
    wc.flashInterface.log('NavigateDiv->' + bCurIsFlash + ', ' + bNextIsFlash + ')');
	if (currentChapterValue != null) {
		var cur;
		if (bCurIsFlash) {
			cur = document.getElementById("divChapter");
		} else {
		if (typeof (currentChapterValue) == "number") {
			var temp = "div" + currentChapterValue;
			cur = document.getElementById(temp);
		} else if (typeof (currentChapterValue) == "string") {
			cur = document.getElementById("div" + currentChapterValue);
		} else
			cur = currentChapterValue;
		}

		if (cur != null && typeof (cur) == "object") {
			// turn off multimedia BEFORE hiding div!
			if (bCurIsFlash)
				DoMultimedia(false);

			if (!bCurIsFlash || (bCurIsFlash && !bNextIsFlash)) {
				// turn off if not currently a chapter OR next is not a chapter
				if (cur.style.display == "block") {
					cur.style.display = "none";
				}
			}
		}
	}

	if (nextChapterValue != null) {
		var next;
		if (bNextIsFlash) {
			next = document.getElementById("divChapter");
		} else {
		if (typeof (nextChapterValue) == "number") {
			var temp = "div" + nextChapterValue;

			next = document.getElementById(temp);
		} else if (typeof (nextChapterValue) == "string") {

			next = document.getElementById("div" + nextChapterValue);
		} else
			next = nextChapterValue;
		}

		if (next != null && typeof (next) == "object") {
			var name = next.id.substring(3, next.id.length);
			if (name != "WARN") {
				// report to lms
				if (g_bDoBookmarkUpdate) {
					if (!updateBookmark(nextDivNum))
						return; // failed, don't continue with current navigation....
				}
				else
					g_bDoBookmarkUpdate = true;

				// save page values
				g_curPage = nextDivNum;
				if (g_curPage > g_highestPage)
					g_highestPage = g_curPage; // set the highest page visited
			}

			if (g_curPage == gamepage) {
				if (g_varietyGame == "") {
					alert("No game chosen!");
				}
			}

			if (g_curPage == divCert) {
				if (parent.lmswin != null && typeof (parent.lmswin) == "object") {
					var survey = document.getElementById("SurveyAnswers");
					if (survey != null && typeof (survey) == "object")
						survey.style.display = "inline";

					if (false == parent.lmswin.bFinished) {
						if (gamepage == "None") {
							// no game, tell lms we're 'finished' with game
							if (!reportScore(1, 1, false))
								return; 	// just return - no connectivity
						}
						else {
							if (!reportScore(g_correctQuestions, g_totalQuestions, true))
								return; 	// just return - no connectivity
						}
					}

					// tell lms we're completely done with program
					if (typeof (parent.lmswin.end) == "function")
						parent.lmswin.end();
				}
			}

			if (!(bCurIsFlash && bNextIsFlash)) {
				// do not do if within chapters
				if (next.style.display == "none") {
					next.style.display = "block";
				}
			}

			if (bNextIsFlash)
				DoMultimedia(true);

			scrollTo(0, 0);
		}
		else {
			cur.style.display = "block";
		}
	}
}




function NavigateRefuseAck(bExit) {
    wc.flashInterface.log('NavigateRefuseAck()');
	if (bExit == null || typeof (bExit) == "undefined")
		bExit = true;

	if (bExit) {
		flashChapter.StopChapter();
		reportNoAck(true);
		top.close()
	}
	else {
		reportNoAck(false);
		NavigateForward(1);
	}
}

function NavigateGameSelection(gameVariety) {
    wc.flashInterface.log('NavigateGameSelection(' + gameVariety+ ')');
	g_varietyGame = gameVariety;
}

function GetGameSelection() {
    wc.flashInterface.log('GetGameSelection()');
	g_varietyGame = g_varietyGame.replace(/Both/i, "Flash");
	return g_varietyGame;
}

function SendWrongAnswer(idQuestion, nMissed) {
    wc.flashInterface.log('SendWrongAnswer()');
	strCurQuestionID = idQuestion;
	nAnswerMissedFirst = nMissed;
	if (0 == nMissed)
		g_correctQuestions++;
	g_totalQuestions++;
	updateBookmark();
}

function IsFreshContent() {
    wc.flashInterface.log('IsFreshContent()');
	return (g_curPage == g_highestPage);
}

function printCertificate() {
    //TODO: Either fix this to print the certificate or obsolete and remove this
	var bHidden = false;
	var divPrint = document.getElementById("idPrintCertificate");
	var divInstruct = document.getElementById("idCloseInstruction");
	var divMail = document.getElementById("idOfflineForm");
	if (divPrint != null && typeof (divPrint) == "object" &&
				divInstruct != null && typeof (divInstruct) == "object" &&
					divMail != null && typeof (divMail) == "object") {
		divPrint.style.visibility = "hidden";
		divInstruct.style.visibility = "hidden";
		divMail.style.display = "none";
		bHidden = true;
	}

	printWindow();

	if (bHidden) {
		divPrint.style.visibility = "visible";
		divInstruct.style.visibility = "visible";
		if (objInfo == null)
			divMail.style.display = "block";
	}
}

//Obsolete
function playAudio(chapterNum) {
    wc.flashInterface.log('playAudio()');
	var chapterFlashAudioPlayer = document.getElementById("FlashAudio" + chapterNum);
	if (null != chapterFlashAudioPlayer) {
		chapterFlashAudioPlayer.GotoFrame(5);
		chapterFlashAudioPlayer.GotoFrame(6);
		chapterFlashAudioPlayer.GotoFrame(4);
	}
}

function GetChapterXML(chapterNumber) {
    wc.flashInterface.log('GetChapterXML(' + chapterNumber + ')');
    if (!isDefined(chapterNumber)) {
        chapterNumber = g_curPage;
    }
    var chapXML = null;

  

	try {
		if (chapterNumber == null)
			chapterNumber = g_curPage;

		var chapterIndex = chapterNumber - 1;
	    var re, t, s;
	    if (chapterNumber < wc.data.jsonData.chaptersXml.length) {
		    s = wc.data.jsonData.chaptersXml[chapterIndex];
		} else {
		if (chapterNumber == wc.data.jsonData.chaptersXml.length)
		    s = '<Chapter>' + wc.data.jsonData.quizXml + '</chapter>';
		else
		    s = wc.flashInterface.getQuizQuestions();
		}

		//var re, t, s = eval("g_arrChapterXML[chapterNumber-1]");
		//var re, t, s = eval(" wc.data.jsonData.chaptersXml[chapterNumber-1]");
	    
		wc.flashInterface.log('GetChapterXML->Loading chapter xml for index: ' + chapterIndex);
        re = /\x26lt;/g;
		t = s.replace(re, "\x3c");
		re = /\x26gt;/g;
		chapXML = t.replace(re, "\x3e");
	}
catch (e) {
	    wc.flashInterface.log('GetChapterXML->' + e);
	}

	return chapXML;
}

wc.flashInterface.getQuizQuestions = function() {
    wc.flashInterface.log('getQuizQuestions()');

    var returnXml = '<Chapter><GameQuestions>';
    for (var chapterIndex in wc.data.jsonData.chapters) {
        var chapter = wc.data.jsonData.chapters[chapterIndex];
        if (isDefined(chapter) && isDefined(chapter.quizQuestionsXml)) {
            var questions = '<QuizQuestions>';

            for (var questionIndex in chapter.quizQuestionsXml) {
                questions += chapter.quizQuestionsXml[questionIndex];
            }

            questions += "</QuizQuestions>";
            returnXml += questions;
        }
    }

    returnXml += wc.data.jsonData.finalQuizQuestionXml;
    returnXml += '</GameQuestions></Chapter>';

    return returnXml;

};

function GetCourseDescription() {
    wc.flashInterface.log('GetCourseDescription()');
	return wc.data.jsonData.description;
}

function getHighestPage() {
    wc.flashInterface.log('GetHighestPage()');
	return g_highestPage;
}

function pageScroll(amount) {
	window.scrollBy(0, amount);
}

function getFlashWidthAfterScaling() {
    return document.getElementById(wc.flashInterface.wrapperDivId).clientWidth ? document.getElementById(wc.flashInterface.wrapperDivId).clientWidth : document.body.clientWidth;
}

function GetChapterFooter() {
    wc.flashInterface.log('GetChapterFooter()');
    return wc.data.jsonData.footer;
}

function getArg(me, name) {
    wc.flashInterface.log('getArg(' + me + ', ' + name + ')');
	if (urlArgs == null) {
		urlArgs = new Object();
		var query = me.location.search.substring(1); // get query string
		var pairs = query.split(','); 			// break at comma
		for (var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('='); 	// look for "name=value"
			if (pos == -1)							// if not found,
				continue; 						//	skip

			var argname = pairs[i].substring(0, pos); // extract the name
			var value = pairs[i].substring(pos + 1); 	// extract the value
			urlArgs[argname] = unescape(value); 	// store as property
		}
	}

	return urlArgs[name];
}





/*OLD SCRIPTS FOR FLASH*/
function fixStaticPath(path) {
    wc.flashInterface.fixStaticPath(path);
}

wc.flashInterface.fixStaticPath = function (path) {
    wc.flashInterface.log('fixStaticPath()');
    var outp = path;
    if (path.substr(0, 1) != "/") {
        var staticPath = wc.flashInterface.staticPath;
        var inp = path;
        while (staticPath.substr(0, 3) == "../" && inp.substr(0, 3) == "../") {
            staticPath = staticPath.substr(3);
            inp = inp.substr(3);
            outp = outp.substr(3);
        }
        var n = staticPath.indexOf("/");
        while (n > 0) {
            outp = "../" + outp;
            n = staticPath.indexOf("/", n + 1);
        }

        if (path.substr(0, 1) != "/" && staticPath.substr(0, 3) != "../") {
            outp = staticPath + inp;
        }

    }
    return outp;
};

function getStylesheetPath() {
    return fixStaticPath(wc.flashInterface.styleSheetPath);
}

function getCustomStylesheetPath() {
    return fixStaticPath(wc.flashInterface.customStyleSheetPath);
}

function printWindow() {
    var bV = parseInt(navigator.appVersion);
    if (bV >= 4)
        window.print();
}


function closePopup() {
    if (popupHandle != null) {

        if (!popupHandle.closed) {
            if (g_timer != 0) {
                clearTimeout(g_timer);
                g_timer = 0;
            }

            popupHandle.close();
        }
        popupHandle = null;

    }

    urlArgs = null; 	// cleanup this popup's arguments
}

// [DR] - the following is dynamically set to true if we're in Preview mode AND previewing a popup type (bulletin, term, or popquestion)
var popupPreview = false;

function popUp(url, name, width, height, resizable) {
    // [DR]
    if (popupPreview) {
        top.resizeTo(width, height);
        top.resizeBy(width - top.popup.document.body.offsetWidth, height - top.popup.document.body.offsetHeight);
        popupHandle = top.popup;
        popupHandle.location = url;
    }
    else {
        closePopup();
        var properties = "toolbar=0,location=0,menubar=0,height=" + height;
        properties = properties + ",width=" + width;
        properties = properties + ",left=" + 30;
        properties = properties + ",top=" + 30;
        properties = properties + ",scrollbars=0";
        if (resizable)
            properties = properties + ",resizable=yes";
        popupHandle = window.open(url, "", properties);
    }
    // [DR] commented this out: popupHandle.document.title = name;
    //g_timer = setTimeout("startPopup()", 10);
    //return popupHandle;
}


// Function:   getQueryString
// Purpose:    Parses the querystring and returns an object
//             with the resulting parameters.
function getQueryString(win) {
    var qs = new Object();
    var strQS = win.location.search.substring(1).replace(/\+/g, " ");
    var arrParams = strQS.split("&");
    for (var i in arrParams) {
        var key, val;
        var n = arrParams[i].indexOf("=");
        if (n != -1) {
            key = arrParams[i].substring(0, n).toUpperCase();
            val = unescape(arrParams[i].substring(n + 1));
        }
        else {
            key = arrParams[i].toUpperCase();
            val = "";
        }

        qs[key] = val;
    }
    return qs;
}


// -----------------------------------------------------------------------------
// Globals
// Major version of Flash required
var requiredMajorVersion = 9;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 0;
// the version of javascript supported
var jsVersion = 1.0;
// -----------------------------------------------------------------------------

