if (typeof (wc) == 'undefined')
	wc = {};


wc.lms = {
	window: null,
	startTime: null,
	objInfo: null,
	delayStart: false,
	bookmark :1,
	highestBookmark: 0
};

wc.lms.recheckConnectivity = function(fromDiv)
{
	if (/*objInfo != null && */wc.lms.window != null && typeof(wc.lms.window) == "object" && wc.lms.window.bFinished != null)
	{
		wc.lms.updateBookmark();	// make sure that connectivity is checked

		// either online or offline certificate
		if (true == wc.lms.window.bHasConnectitivity || true == wc.lms.window.bNoLMS)
		{
			//TODO: Navigate to div
			//NavigateDiv(fromDiv, g_curPage + 1);
			return;	// successful!
		}
	}

//if no objInfo, never connected ---- should be doing the email thing...
	//var divCert = </xsl:text><xsl:value-of select="$CertificatePage"/>;<xsl:text disable-output-escaping="yes">
	if (divCert == wc.lms.currentPage + 1)
		wc.lms.noConnectivityAtCertificate(fromDiv);
	else
		wc.lms.noConnectivityAtSurvey(fromDiv);
}


wc.lms.reportNoAck = function(bExit){
	// Report to the LMS
	if (wc.lms.objInfo != null && wc.lms.window != null)
	{
		if (typeof(wc.lms.window) == "object")
		{
			if (typeof(wc.lms.window.fail) == "function")
				wc.lms.window.fail(bExit);
		}
	}
}

wc.lms.earlyExit = function(){
	// Report to the LMS
	if (objInfo != null && wc.lms.window != null)
	{
		if (typeof(wc.lms.window) == "object")
		{
			if (typeof(wc.lms.window.earlyExit) == "function")
				wc.lms.window.earlyExit();
		}
	}
}

wc.lms.reportScore = function (correctQuestions, totalQuestions, bGame)
{
	// bGame = true if program has a game
	if (true == wc.lms.window.bNoLMS)
		return true;
		
	var nLMSResult = 999;	// general failure

	// Report score to the LMS
	if (wc.lms.objInfo != null && wc.lms.window != null)
	{
		if (typeof(wc.lms.window) == "object")
		{
			if (typeof(wc.lms.window.finish) == "function")
			{
				try
				{
					nLMSResult = wc.lms.window.finish(correctQuestions, totalQuestions);
					if (wc.values.companyId == 125 && bGame)
							alert("Score: " + Math.round(correctQuestions * 100 / totalQuestions) + "%");
				}
				catch(e)
				{
				}
			}
		}
	}

	if (0 != nLMSResult)
		wc.lms.noConnectivityAtCertificate(wc.lms.currentPage - 1);
	
	return (0 == nLMSResult);
}

wc.lms.lostSession = function(){
	//"You have restarted this course from the Programs page and invalidate the current session.\nExit the program and start the program again.";
	var strWarning = wc.data.resources['LostSession'];
	//TODO: add navigate warning element
	//NavigateWarning(strWarning, -1, false, true, false);
}

wc.lms.noConnectivityAtCertificate = function(fromDiv){
	//"You have previously lost connectivity - you cannot receive your Certificate unless you are online.\nExit the program or press Retry to try to reestablish connectivity.";
	var strWarning = wc.data.resources['NoConnectivityAtCertificate'];
	//TODO: add navigate warning element
	//NavigateWarning(strWarning, fromDiv, false, true, true);
}

wc.lms.noConnectivityAtSurvey = function(fromDiv){
	//"You have lost connectivity - the Survey cannot be recorded unless you are online.\nExit the program or press Retry to try to reestablish connectivity.";
	var strWarning = wc.data.resources['NoConnectivityAtSurvey'];
	//TODO: add navigate warning element
	//NavigateWarning(strWarning, fromDiv, false, true, true);
}

wc.lms.lostConnectivity = function(strWantedPage){
	var divCert = 0;//parseInt(</xsl:text><xsl:value-of select="$CertificatePage"/><xsl:text>);
	if (divCert == parseInt(strWantedPage))
		return wc.lms.noConnectivityAtCertificate(divCert - 1);
		
	//"You have lost connectivity. You may continue with the program but not the Game and will not receive a Certificate unless connectivity is restored.\nExit the program or press Continue to continue with the program.";
	var strWarning = wc.data.resources['LostConnectivity'];
	//TODO: add navigate warning element
	//NavigateWarning(strWarning, strWantedPage, true, true, false);
}

wc.lms.gainedConnectivity = function(strWantedPage){
	//"You have regained connectivity.\nPress Continue to finish the program.";
	var strWarning = wc.data.resources['GainedConnectivity'];
	//TODO: add navigate warning element
	//NavigateWarning(strWarning, strWantedPage, true, false, false);
}


wc.lms.warnContinue = function(){
	//TODO: add navigate warning element
	//NavigateDiv(divWarnContinuePrev, divWarnContinueNext);
}

function NavigateWarning(strWarning, div, bContinue, bExit, bRetry)
{
// note: there is no exit button - gives script warning trying to close window, display no button and just let user close it
	var divFrom = g_curPage;	// this div is probably hidden already - we came from NavigateDiv....
	var btn1 = document.getElementById("idWarnBtn1");
	var btn2 = document.getElementById("idWarnBtn2");
	var text = document.getElementById("idWarnText");
	text.innerHTML = strWarning;
	
	if (bContinue)
	{
		btn1.value = wc.data.resources['Continue'];
		divWarnContinuePrev = "WARN";
		divWarnContinueNext = div;
		btn1.style.display = "inline";
	}
	else
		btn1.style.display = "none";
	
	if (bRetry)
	{
		btn2.value =  wc.data.resources['Retry'];
		btn2.style.display = "inline";
		divFrom = div;
	}
	else
		btn2.style.display = "none";

	//TODO: navigation to warn element
	//NavigateDiv(divFrom, "WARN");
}
wc.lms.updateBookmark = function(strPage)
{
	var lastBookmark = wc.lms.highestBookmark;
	if (strPage != null)
	{
		var nPage = parseInt(strPage);
		
		if (nPage > wc.lms.highestBookmark)
			wc.lms.highestBookmark = nPage;
	}

	// Report progress to the LMS
	if (wc.lms.objInfo != null && wc.lms.window != null)
	{
		var nLMSResult = 999;	// general error

		if (typeof(wc.lms.window) == "object")
		{
			if (typeof(wc.lms.window.progress) == "function")
			{
				var str;
				if (strPage == "-1" || strPage == "-2" || wc.lms.highestBookmark >= wc.lms.gamePage)
				{
					// allowing navigatation to GamePage to display "do not close" message
					//	can be > g_gamePage (when more than one game - it is the game choice page)
					if (wc.lms.objInfo.bookmark == "-2")
						str = "-2";
					else
						str = "-1";
				}
				else
					str = wc.lms.highestBookmark.toString();

				try
				{
					if (typeof(strCurQuestionID) != "undefined" && strCurQuestionID != null && nAnswerMissedFirst != 0)
						nLMSResult = wc.lms.window.progress(str, strCurQuestionID, nAnswerMissedFirst);
					else
						nLMSResult = wc.lms.window.progress(str, 0, 0);
				}
				catch(e)
				{
					nLMSResult = 999;	// assume no connectivity
				}
			}

			if (0 != nLMSResult)
				wc.lms.highestBookmark = lastBookmark;	// reset bookmark if error, never got there....
				
			// if we got here on a survey, then that data has been recorded, so normal connectivity handling is ok
			if (3 == nLMSResult)
			{
				// session has been deleted - can't continue
				wc.lms.lostSession();
				return false;
				//alert("session has been deleted - can't continue!");
			}

			if (nLMSResult != 0 && wc.lms.window.bHasConnectitivity || nLMSResult == 0 && !wc.lms.window.bHasConnectitivity)
			{
				// only if changed...
				wc.lms.window.bHasConnectitivity = (0 == nLMSResult);

				if (0 == nLMSResult)
					wc.lms.gainedConnectivity(strPage);
				else
					wc.lms.lostConnectivity(strPage);
					
				return false;
			}
		}
	}
	else
	{
		// from quiz, strPage is not specified
		// don't send answers that weren't missed (== 0)
		if (null == strPage && strCurQuestionID != null && nAnswerMissedFirst != 0)
		{
			// do some offline tracking
			if (g_arrWrongAnswer == null && typeof(g_arrWrongAnswer) != "object")
				g_arrWrongAnswer = new Array();
				
			var question = new Object();
			question["RevID"] = strCurQuestionID;
			question["index"] = nAnswerMissedFirst;
			g_arrWrongAnswer.push(question);
		}
	}
	
	return true;
}

wc.lms.updateQuizBookmark = function(strPage,strCurQuestionID,nAnswerMissedFirst)
{
	var lastBookmark = wc.lms.highestBookmark;
	if (strPage != null)
	{
		var nPage = parseInt(strPage);
		
		if (nPage > wc.lms.highestBookmark)
			wc.lms.highestBookmark = nPage;
	}

	// Report progress to the LMS
	if (wc.lms.objInfo != null && wc.lms.window != null)
	{
		var nLMSResult = 999;	// general error

		if (typeof(wc.lms.window) == "object")
		{
			if (typeof(wc.lms.window.progress) == "function")
			{
				var str;
				if (strPage == "-1" || strPage == "-2" || wc.lms.highestBookmark >= wc.lms.gamePage)
				{
					// allowing navigatation to GamePage to display "do not close" message
					//	can be > g_gamePage (when more than one game - it is the game choice page)
					if (wc.lms.objInfo.bookmark == "-2")
						str = "-2";
					else
						str = "-1";
				}
				else
					str = wc.lms.highestBookmark.toString();

				try
				{
					if (typeof(strCurQuestionID) != "undefined" && strCurQuestionID != null && nAnswerMissedFirst != 0)
						nLMSResult = wc.lms.window.progress(str, strCurQuestionID, nAnswerMissedFirst);
					else
						nLMSResult = wc.lms.window.progress(str, 0, 0);
				}
				catch(e)
				{
					nLMSResult = 999;	// assume no connectivity
				}
			}

			if (0 != nLMSResult)
				wc.lms.highestBookmark = lastBookmark;	// reset bookmark if error, never got there....
				
			// if we got here on a survey, then that data has been recorded, so normal connectivity handling is ok
			if (3 == nLMSResult)
			{
				// session has been deleted - can't continue
				wc.lms.lostSession();
				return false;
				//alert("session has been deleted - can't continue!");
			}

			if (nLMSResult != 0 && wc.lms.window.bHasConnectitivity || nLMSResult == 0 && !wc.lms.window.bHasConnectitivity)
			{
				// only if changed...
				wc.lms.window.bHasConnectitivity = (0 == nLMSResult);

				if (0 == nLMSResult)
					wc.lms.gainedConnectivity(strPage);
				else
					wc.lms.lostConnectivity(strPage);
					
				return false;
			}
		}
	}
	else
	{
		// from quiz, strPage is not specified
		// don't send answers that weren't missed (== 0)
		if (null == strPage && strCurQuestionID != null && nAnswerMissedFirst != 0)
		{
			// do some offline tracking
			if (g_arrWrongAnswer == null && typeof(g_arrWrongAnswer) != "object")
				g_arrWrongAnswer = new Array();
				
			var question = new Object();
			question["RevID"] = strCurQuestionID;
			question["index"] = nAnswerMissedFirst;
			g_arrWrongAnswer.push(question);
		}
	}
	
	return true;
}
wc.lms.objInfoSet = function () {
	if (typeof (wc.lms.objInfo) == 'undefined' || wc.lms.objInfo == null)
		return false
	else
		return true;
}

wc.lms.getFirstName = function () {
	if (!wc.lms.objInfoSet())
		return '[Employee\'s Name]';

	return wc.lms.objInfo.firstName;
}

wc.lms.getLastName = function () {
	if (!wc.lms.objInfoSet())
		return '';

	return wc.lms.objInfo.lastName;
}

wc.lms.getDate = function () {
	var today = new Date();
	return today.toLocaleDateString();
}

