if(typeof (wc) == 'undefined')
	wc = {};


wc.interface = {
	currentChapterTime: 0,
	trycount: 0,
	beginTime: null,
	endTime: null,
	timingValid: false,
	//TODO: set minimum time for each chapter required
	g_arrMinChapterTimes: new Array(),
	contentDirection: 'ltr',
	dataFilePath: '/datafiles/',
	gameFilePath: '/Wc2/training/GameData.aspx',
	allowFlashInterface: true,
	doBullets: true,
	showBullets: true,
	directions: {
		next: 1,
		previous: 2
	},
	types: {
		flash: 1, html: 2
	},
	type: 2, /*set type to html, cannot do types.html since it is not initialized yet*/
	elementTypes: {
		none: 0, intro: 1, chapter: 2, term: 3, linkBulletin: 4, popQuestion: 5, finalQuizQuestion: 6, acknowledgment: 7, survey: 8, certificate: 9, bookmark: 10, gameChoice: 11, game: 12, gameIntro: 13, popBulletin: 14, popQuiz: 15, matchGame: 16, note: 17, tableOfContents: 18, help: 19, policy: 20, gameRestart :21
	},
	introTypes: {
		none: 1, textSphere: 2
	},
	linkBulletinTypes: {
		Code: { id: 1, varietyCode: 'Code', varietyName: 'Code', resourceName: 'CodeExcerpt' },
		News: { id: 2, varietyCode: 'News', varietyName: 'News', resourceName: 'InTheNews' },
		FAQs: { id: 3, varietyCode: 'FAQs', varietyName: 'FAQs', resourceName: 'FAQs' },
		Policy: { id: 4, varietyCode: 'Policy', varietyName: 'Policy', resourceName: 'Policy' },
		DosAndDonts: { id: 5, varietyCode: 'DosAndDonts', varietyName: "Do's and Dont's", resourceName: 'DosAndDonts' },
		CodeCompanion: { id: 6, varietyCode: 'CodeCompanion', varietyName: 'Code Companion', resourceName: 'CodeCompanion' }
	},
	displayTypes: { Container: 1, Layer: 2 },
	currentElement: {
		elementType: 1, /*set type to elementType, cannot do elementTypes.intro since it is not initialized yet*/
		chapterIndex: 0,
		displayType: 1
	},
	animationOptions: { none: 0, slideLeft: 1, textWriter: 2, slideLeftAndFade: 3, slideTop: 4, fadeOutIn: 5 },

	transitionOptions: { none: 0, slideDownUp: 1, zoomInOut : 2, slideLeft : 3 },

	mediaBulletinsDisplayTypes: {none: 0, bullets: 1, text: 2},
	options:
	{
		pageChange:
		{
			replacementMethod: 0,
			popupReplacementMethod: 0
		},
		displayLayer:
		{
			linkBulletin:
			{
				textDisplay: 0
			}
		},
		mediaPlayer:
		{
			showVideoControls: false,
			videoSizePercentage: null,
			allowAudioAutoPlay: true
		},
		games: {
			randomizeChoices: false,
			gameIntroDisplayAnimation: 5 /*wc.interface.animationOptions.fadeOutIn*/,
			gameChoiceDisplayAnimation: 5/*wc.interface.animationOptions.fadeOutIn*/,
			scrollToTopOnFeedback: false
		}		
	}
};

wc.init = function (data, dataFilePath) {
	
	if (isDefined(dataFilePath))
		wc.interface.dataFilePath = dataFilePath;
	
	if (typeof (data) != 'undefined') {
		wc.data = data;
	}
	if (typeof (wc.data) == 'undefined' || typeof (wc.data.jsonData) == 'undefined')
		return false; //TODO: show error to user or at least log it
	else if (typeof (wc.data.jsonData.chapters) == 'undefined')
		return false; //TODO: show error to user or at least log it
	
	wc.lms.window = parent.lmswin;
	
	if (!wc.WindowLoaded || typeof (wc.lms.window) != "object" || wc.lms.window.bReady != true) {
		// LMS window not loaded yet; wait 100ms and try again
                if (wc.interface.trycount < 3) {
		setTimeout("wc.init()", 100);
                }		
                wc.interface.trycount = wc.interface.trycount + 1;
                if (wc.interface.trycount > 3) {
                  alert("timed out on lms load, we are not tracking");
                                wc.lms.window = "";
				wc.lms.window.bNoLMS = true;
				wc.lms.window.bHasConnectitivity = false;
				wc.lms.startTime = new Date();
				wc.lms.strName = wc.lms.strFirstName = "";
			if (wc.interface.allowFlashInterface && wc.interface.type == wc.interface.types.flash) {
				return wc.flashInterface.load(0);
			} else {
				if (wc.interface.introTypes.none == wc.data.jsonData.introType) {					
					wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, 0);
				} else
					wc.interface.elements.intro.display();
			}
		} 
	} else {
		if (wc.lms.delayStart) {
			wc.lms.delayStart = false;
			setTimeout("wc.init()", 1500);
		}
		else {
			// Call the LMS Launch function to initialize communication and get info
			if (wc.interface.allowFlashInterface && wc.data.values["isFlashCourse"] == '1') {
				//first check if flash is available and a good version before deciding to actually use the flash course
				if (isDefined(wc.flashInterface) && wc.flashInterface.isSupportedFlashVersion())
					wc.interface.type = wc.interface.types.flash;
				else
					wc.interface.type = wc.interface.types.html;
			}
			else
				wc.interface.type = wc.interface.types.html;

			wc.lms.objInfo = wc.lms.window.onLMSLaunch(parent);

			if (wc.lms.objInfo == null) {
				//TODO: fix prompt
				//var len = 0;
				//wc.lms.strPrompt = wc.interface.getResource('NoLMSUserPrompt');
				//wc.lms.strDefault = wc.interface.getResource('NoLMSUserDefault');

				//var wc.lms.strName = window.prompt(wc.lms.strPrompt, wc.lms.strDefault);
				//if (wc.lms.strName == null || wc.lms.strName.length == 0)
				//	wc.lms.strName = window.prompt(wc.lms.strPrompt, wc.lms.strDefault);

				//if (wc.lms.strName != null && wc.lms.strName.length > 0)
				//	wc.lms.strFirstName = wc.lms.strName;
			}

			// do after getting wc.lms.objInfo, is used here...
			//runtimeSub(parent.main);

			// Check if we got a bookmark
			if (wc.lms.objInfo != null) {
				var now = new Date();
				wc.lms.objInfo.startTime = now.toGMTString();

				// set wc.lms.objInfo, cause it's needed by updateBookmark
				wc.lms.window.objInfo = wc.lms.objInfo;

				// For backwards compatibility, support bookmark of "GC" to mean "Game Choice" page
				//	new functionality, -1 means game, -2 means podcast / game
				var bm = 0;

				if (typeof (wc.lms.objInfo.bookmark) != "undefined") {
					if ((wc.lms.objInfo.bookmark == "-1" || wc.lms.objInfo.bookmark == "-2" || wc.lms.objInfo.bookmark == "GC")) {
						if (wc.lms.objInfo.bookmark == "GC")
							wc.lms.bookmark = bm = "-1";
					}
					else if (!isNaN(parseInt(wc.lms.objInfo.bookmark))) {
						wc.lms.bookmark = bm = parseInt(wc.lms.objInfo.bookmark);
					} else {
						wc.lms.bookmark = bm;
					}
					if (bm > 1 || ((wc.lms.objInfo.bookmark == "-1" || wc.lms.objInfo.bookmark == "-2" || wc.lms.objInfo.bookmark == "GC"))) {
						wc.lms.updateBookmark(bm); // update g_highestBookmark
						return wc.interface.displayLayer(wc.interface.elementTypes.bookmark, bm);
					}
				}
			}
			else {
				wc.lms.window.bNoLMS = true;
				wc.lms.window.bHasConnectitivity = false;
				wc.lms.startTime = new Date();
				//TODO: enable tracking
				var flagEnableTracking = wc.request.queryString("OFFTRK");
				//if (flagEnableTracking == null || typeof(flagEnableTracking) == "undefined" || 1 == flagEnableTracking)
				//TODO: alert for offline 
				//document.getElementById("idOfflineForm").style.display = "block";
			}
			if (wc.interface.allowFlashInterface && wc.interface.type == wc.interface.types.flash) {
				return wc.flashInterface.load(0);
			} else {
				if (wc.interface.introTypes.none == wc.data.jsonData.introType)
					wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, 0);
				else
					wc.interface.elements.intro.display();
			}
		}
	}
};

wc.interface.getResource = function (key) {
	if (typeof (wc.data.resources) != 'undefined' && wc.data.resources != null) {
		try {
			return wc.data.resources[key.toLowerCase()];
		}
		catch (e) {
			return key;
		}
	}
	else {
		return key;
	}
};

String.prototype.replaceTag = function (elementType, key, replacementValue) {
	return this.replace((new RegExp('\\{\\$' + elementType + ':' + key + '\\}', 'gi')), replacementValue);
};

wc.interface.loadGameTemplates = function (variety) {
	if (wc.interface.gameFilePath == '/Wc2/training/GameData.aspx') {
		var path = '';
		if (isDefined(wc.data.values.IsiPadFrame) && wc.data.values.IsiPadFrame == 'True') {
			path = '/Wc2/training/GameData.aspx?templatePlatform=' + wc.data.values.elementsName + '.' + wc.data.values.templatePlatform + '&gameVariety=' + variety;
		}
		else {
			path = '/Wc2/training/GameData.aspx?templatePlatform=' + wc.data.values.templatePlatform + '&gameVariety=' + variety;
		}
		//console.log(path);
		wc.ajax.get(path, function (data) {
			for (var itemKey in data.responseJson) {
				//if (typeof (wc.data.templateElements[itemKey]) == 'undefined' || wc.data.templateElements[itemKey] == null)
				wc.data.templateElements[itemKey] = data.responseJson[itemKey];
			}
		}, null, false);
	} else {
		wc.ajax.get(variety + '.' + wc.data.values.templatePlatform + '.Game.html', function (data) {
			for (var itemKey in data.responseJson) {
				//if (typeof (wc.data.templateElements[itemKey]) == 'undefined' || wc.data.templateElements[itemKey] == null)
				wc.data.templateElements[itemKey] = data.responseJson[itemKey];
				wc.data.templateElements[itemKey] = wc.data.templateElements[itemKey].replace(/\/wc2\/static\/training\/ceoImages/g,'images\/iPhone\/iPhone\/ceoImages');
				wc.data.templateElements[itemKey] = wc.data.templateElements[itemKey].replace(/\/wc2\/static\/training\/rubeGoldberg/g,'images\/iPhone\/iPhone\/rubeGoldberg');

			}
		}, null, false);
	}
};

wc.interface.replaceCurrentElement = function (nextElementType, nextChapterIndex) {

	if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp || wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut ||
	wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
		//transition
		//the Customized LayerElementContainer is setup only for wc.interface.elementTypes.popQuiz
		//we need to remove the overlay and show it only from popQuiz
		$("body div.modal-overlay").remove();
		$("#LayerElementContainer").removeClass("LayerElementContainerCustomized");
	}


		try {
			wc.mediaPlayer.video.stop();
			wc.mediaPlayer.audio.stop();
		}
		catch (e) { }

	wc.interface.layerData.initialize();
	try { wc.mediaPlayer.cleanup(); } catch (e) { }

	var buttonsToEnable = wc.interface.navigation.buttonTypes.Index | wc.interface.navigation.buttonTypes.ResizeFont | wc.interface.navigation.buttonTypes.Notes | wc.interface.navigation.buttonTypes.Help;
	var buttonsToDisable = wc.interface.navigation.buttonTypes.None;
	var buttonsToHide = wc.interface.navigation.buttonTypes.None;
	var buttonsToActivate = wc.interface.navigation.buttonTypes.None;

	// enable policy button only of there is some text for the policy
	if (isDefined(wc.data.jsonData.description) && wc.data.jsonData.description.length > 0) {
		buttonsToEnable |= wc.interface.navigation.buttonTypes.Policy;
	}
	else {
		buttonsToDisable = wc.interface.navigation.buttonTypes.Policy;
	}

	//TODO: add animation	
	var currentElementContainer = document.getElementById('CurrentElementContainer');

	if (nextElementType == wc.interface.elementTypes.chapter) {
		var nextChapter = wc.data.jsonData.chapters[nextChapterIndex];

		if (typeof (wc.data.templateElements.chapter) == 'undefined') {
			wc.debug('wc.interface.replaceCurrentElement - chapter template missing');
			return;
		}

		if (typeof (nextChapter.heading) == 'undefined')
			nextChapter.heading = '';

		if (typeof (nextChapter.discussion) == 'undefined')
			nextChapter.discussion = '';


		var templateHtml = '';
		if (nextChapter.chapterOptions.variety == 'Memorandum') {
			templateHtml = wc.data.templateElements.memorandumChapter;

			templateHtml = templateHtml.replaceTag('Content', 'firstName', wc.lms.getFirstName());
			templateHtml = templateHtml.replaceTag('Content', 'lastName', wc.lms.getLastName());
			templateHtml = templateHtml.replaceTag('Content', 'currentDate', wc.lms.getDate());

			templateHtml = templateHtml.replaceTag('Content', 'MemorandumChapter_Discussion', nextChapter.discussion);


			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', nextChapter.heading);

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Footer', nextChapter.footer);

			buttonsToDisable |= wc.interface.navigation.buttonTypes.Audio | wc.interface.navigation.buttonTypes.Bullets | wc.interface.navigation.buttonTypes.Text;

			currentElementContainer.innerHTML = templateHtml;
		}

		else if (nextChapter.chapterOptions.variety == 'Wide') {
			//if contains illustration is going on wideChapter, else widechapter_withVideo
			if (typeof (nextChapter.illustration) != 'undefined')
				templateHtml = wc.data.templateElements.wideChapter;
			else
				templateHtml = wc.data.templateElements.wideChapter_withVideo;

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', nextChapter.heading);

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Footer', nextChapter.footer);
			// if audio is enabled then display bulletins otherwise show discussion
			var chapterMediaBulletsListHtml = '';

			if (wc.interface.doBullets && isDefined(nextChapter.audio) && isDefined(nextChapter.pithyQuote) && wc.interface.elements.mediaBullets.hasBullets(nextChapter.pithyQuote)) {
				chapterMediaBulletsListHtml = wc.interface.elements.mediaBullets.render(nextChapter.pithyQuote);
			}

			// add the discussions (if any)
			//console.log(nextChapter);
			if (isDefined(nextChapter.video) && isDefined(nextChapter.video.transcript) && nextChapter.video.transcript.length != 0) {
				// FIXME: we should use a template for the transcript title
				templateHtml = templateHtml.replaceTag('Content', 'Chapter_Discussion', '<h1>Transcript</h1>' + nextChapter.video.transcript);
			} else {

				templateHtml = templateHtml.replaceTag('Content', 'Chapter_Discussion', nextChapter.discussion);
			}
			// add the media bullets list
			templateHtml = templateHtml.replaceTag("Content", 'Chapter_MediaBulletsList', chapterMediaBulletsListHtml);

			//LinkBulletin_Buttons
			var linkBulletinButtons = '';
			for (var linkBulletinIndex in wc.data.jsonData.chapters[nextChapterIndex].linkBulletins) {
				var linkBulletinButtonTemplate = wc.data.templateElements.linkBulletin_Button;
				linkBulletinButtons += linkBulletinButtonTemplate.replaceTag('Content', 'LinkBulletin_Variety', wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety).replaceTag('Content', 'LinkBulletin_VarietyResource', function () {
					switch (wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety.toLowerCase()) {
						case "news":
							return wc.interface.getResource('InTheNews');
							break;
						case "code":
							return wc.interface.getResource('CodeExcerpt');
							break;
						case "faqs":
							return wc.interface.getResource('FAQs');
							break;
						case "policy":
							return wc.interface.getResource('Policy');
							break;
						case "dosanddonts":
							return wc.interface.getResource('DosAndDonts');
							break;
						case "codecompanion":
							return wc.interface.getResource('CodeCompanion');
							break;
					}
					return wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety;
				});
			}
			templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Buttons', linkBulletinButtons);

			var chapterSurveyHtml = '';
			if (typeof (nextChapter.survey) != 'undefined')
				chapterSurveyHtml = wc.interface.buildSurveyHtml(nextChapter.survey);

			wc.interface.elements.mediaBullets.currentDisplayMode = wc.interface.mediaBulletinsDisplayTypes.bullets;
			wc.interface.elements.audioSpeechButton.isAudioOn = true;
			buttonsToActivate |= wc.interface.navigation.buttonTypes.Bullets;
			buttonsToActivate |= wc.interface.navigation.buttonTypes.Audio;

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Survey', chapterSurveyHtml);
		}
		else {
			templateHtml = wc.data.templateElements.chapter;

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', nextChapter.heading);
			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Footer', nextChapter.footer);

			// if audio is enabled then display bulletins otherwise show discussion
			var chapterMediaBulletsListHtml = '';
			//wc.interface.elements.mediaBullets.currentDisplayMode = wc.interface.mediaBulletinsDisplayTypes.none;
			if (wc.interface.doBullets && isDefined(nextChapter.audio) && isDefined(nextChapter.pithyQuote) && wc.interface.elements.mediaBullets.hasBullets(nextChapter.pithyQuote)) {
				chapterMediaBulletsListHtml = wc.interface.elements.mediaBullets.render(nextChapter.pithyQuote);

				wc.interface.elements.audioSpeechButton.isAudioOn = true;
				buttonsToActivate |= wc.interface.navigation.buttonTypes.Audio;

				if ((wc.interface.elements.mediaBullets.currentDisplayMode == wc.interface.mediaBulletinsDisplayTypes.bullets) || (wc.interface.elements.mediaBullets.currentDisplayMode == wc.interface.mediaBulletinsDisplayTypes.none)) {
					wc.interface.elements.mediaBullets.currentDisplayMode = wc.interface.mediaBulletinsDisplayTypes.bullets;
					buttonsToActivate |= wc.interface.navigation.buttonTypes.Bullets;
				} else {
					buttonsToActivate |= wc.interface.navigation.buttonTypes.Text;
					//buttonsToEnable |= wc.interface.navigation.buttonTypes.Text;
					//buttonsToEnable |= wc.interface.navigation.buttonTypes.Audio;
					//buttonsToEnable |= wc.interface.navigation.buttonTypes.Bullets;
				}

			}

			// add the discussions (if any)
			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Discussion', nextChapter.discussion);
			// add the media bullets list
			templateHtml = templateHtml.replaceTag("Content", 'Chapter_MediaBulletsList', chapterMediaBulletsListHtml);

			//LinkBulletin_Buttons
			var linkBulletinButtons = '';
			for (var linkBulletinIndex in wc.data.jsonData.chapters[nextChapterIndex].linkBulletins) {
				var linkBulletinButtonTemplate = wc.data.templateElements.linkBulletin_Button;
				linkBulletinButtons += linkBulletinButtonTemplate.replaceTag('Content', 'LinkBulletin_Variety', wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety).replaceTag('Content', 'LinkBulletin_VarietyResource', function () {
					switch (wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety.toLowerCase()) {
						case "news":
							return wc.interface.getResource('InTheNews');
							break;
						case "code":
							return wc.interface.getResource('CodeExcerpt');
							break;
						case "faqs":
							return wc.interface.getResource('FAQs');
							break;
						case "policy":
							return wc.interface.getResource('Policy');
							break;
						case "dosanddonts":
							return wc.interface.getResource('DosAndDonts');
							break;
						case "codecompanion":
							return wc.interface.getResource('CodeCompanion');
							break;
					}
					return wc.data.jsonData.chapters[nextChapterIndex].linkBulletins[linkBulletinIndex].variety;
				});
			}
			templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Buttons', linkBulletinButtons);

			var chapterSurveyHtml = '';
			if (typeof (nextChapter.survey) != 'undefined')
				chapterSurveyHtml = wc.interface.buildSurveyHtml(nextChapter.survey);

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Survey', chapterSurveyHtml);
		}

		//Terms
		templateHtml = templateHtml.replace(/<a href="term:([0-9]+)">/g, '<a href="javascript:;" id="Term_$1" class="wc-term-link" onclick="wc.interface.actionHandler.displayTerm($1);">');
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		currentElementContainer.innerHTML = templateHtml;

		//we need to fire this event after the next element's templatehtml is inserted in currentelementcontainer, in order to have access at template elements from template master
		wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_ReplaceCurrentElement, { elementType: nextElementType, nextChapter: wc.data.jsonData.chapters[nextChapterIndex] });

		if (isDefined(document.getElementById('Button_Next'))) {
			if (isDefined(nextChapter.survey)) {
				//wc.interface.elements.nextButton.disable(true);
				buttonsToHide |= wc.interface.navigation.buttonTypes.NextChapter;
				buttonsToDisable |= wc.interface.navigation.buttonTypes.NextChapter;
			} else {
				if (isDefined(nextChapter.audio) && isDefined(wc.data.jsonData.waitForAudio) && wc.data.jsonData.waitForAudio == '1') {
					//wc.interface.elements.nextButton.disable(true);
					buttonsToHide |= wc.interface.navigation.buttonTypes.NextChapter;
					buttonsToDisable |= wc.interface.navigation.buttonTypes.NextChapter;
				}
			}

			if ((buttonsToDisable & wc.interface.navigation.buttonTypes.NextChapter) != wc.interface.navigation.buttonTypes.NextChapter) {
				buttonsToEnable |= wc.interface.navigation.buttonTypes.NextChapter;
			}
		}

		// Media Bulletins
		var discussionContent = document.getElementById('Chapter_Discussion_Content');
		var mediaBulletins = document.getElementById('Chapter_Discussion_MediaBulletins');
		if (isDefined(mediaBulletins) && isDefined(discussionContent)) {
			if (wc.interface.doBullets && wc.interface.showBullets && wc.interface.elements.mediaBullets.hasBullets(nextChapter.pithyQuote) && (wc.interface.elements.mediaBullets.currentDisplayMode == wc.interface.mediaBulletinsDisplayTypes.bullets)) {
				discussionContent.style.display = 'none';
				mediaBulletins.style.display = '';
			} else {
				discussionContent.style.display = '';
				mediaBulletins.style.display = 'none';
			}
		}

		//Pagination, has to be done after the pagination is part of the DOM
		var cpic = document.getElementById('Chapter_PageInfo_Content');
		if (cpic) {
			cpic.innerHTML = document.getElementById('Chapter_PageInfo_Content').innerHTML.replace('$1', nextChapterIndex + 1).replace('$2', wc.data.jsonData.chapters.length);
			var pagesProgressBar = document.getElementById("pagesProgressBar");
			if (isDefined(pagesProgressBar)) {
				var percent = Math.round(((nextChapterIndex + 1) * 100) / wc.data.jsonData.chapters.length);
				var progressLength = Math.round((percent * 184) / 100);
				pagesProgressBar.style.width = progressLength.toString() + "px";
			}
		}

		if (nextChapterIndex == 0) {
			//wc.interface.elements.previousButton.disable(true);
			buttonsToHide |= wc.interface.navigation.buttonTypes.PreviousChapter;
			buttonsToDisable |= wc.interface.navigation.buttonTypes.PreviousChapter;
		}
		else {
			//wc.interface.elements.previousButton.enable();
			buttonsToEnable |= wc.interface.navigation.buttonTypes.PreviousChapter;
		}

		if (nextChapter.discussion == '' && isDefined(nextChapter.popQuestion)) {

			if (typeof (nextChapter.popQuestion) != 'undefined') {
				wc.interface.startChapterTiming();

				wc.interface.currentElement.chapterIndex = nextChapterIndex;
				wc.interface.currentElement.elementType = nextElementType;
				wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
				wc.lms.updateBookmark(nextChapterIndex + 1);
				return wc.interface.actionHandler.displayQuizQuestion(nextChapter.popQuestion, wc.interface.elementTypes.popQuestion);
			}
		}

		//illustration has to be done after element is in DOM
		var illustrationElement = document.getElementById('Chapter_Illustration_Content');
		if (typeof (nextChapter.illustration) != 'undefined') {
			if (isDefined(illustrationElement)) {
				wc.interface.elements.illustration.inject('Chapter_Illustration_Content', nextChapter.illustration, true);
			} else {
				illustrationElement = $('.backgroundIllustrationContainer');
				if (illustrationElement.length > 0) {
					illustrationElement.css('background-image', 'url("' + wc.interface.dataFilePath + nextChapter.illustration.src + '")');

				}
			}

		} else //no illustration found
		{
			if (isDefined(illustrationElement)) {
				document.getElementById('Chapter_Illustration_Content').innerHTML = '';
				document.getElementById('Chapter_Illustration_Content').style.display = 'none';
			}
		}


		//if current display type is layer then switch back to normal layer to display chapter
		if (wc.interface.currentElement.displayType == wc.interface.displayTypes.Layer) {
			//currentElementContainer.style.display = '';
			//document.getElementById('LayerElementContainer').style.display = 'none';

			var currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('LayerElementContainer').style.display = 'none';
				document.getElementById('CurrentElementContainer').style.display = '';
				var layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();
			};
			currentElementopacityTween.start();

			var t1 = new Tween(document.getElementById('CurrentElementContainer').style, 'left', Tween.regularEaseOut, 0 - wc.GetWindowWidth(), 0, 0.3, 'px');
			t1.start();
		}

		if (wc.interface.options.pageChange.replacementMethod == wc.interface.animationOptions.slideLeft || wc.interface.options.pageChange.replacementMethod == wc.interface.animationOptions.slideLeftAndFade) {

			if (wc.interface.options.pageChange.replacementMethod == wc.interface.animationOptions.slideLeftAndFade) {
				currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 1.2);
				currentElementopacityTween.start();
			} else {
				//TODO: implement better way to put opacity back
				currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 100, 0);
				currentElementopacityTween.start();
			}

			t1 = new Tween(document.getElementById('CurrentElementContainer').style, 'left', Tween.regularEaseOut, 0 - wc.GetWindowWidth(), 0, 0.3, 'px');
			t1.start();

			wc.interface.actionHandler.scrollToTop();

		}
		else {//if (wc.interface.options.pageChange == wc.interface.animationOptions.slideLeft) {
			//TODO: implement better way to put opacity back
			currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 100, 0);
			currentElementopacityTween.start();
			//currentElementContainer.innerHTML = templateHtml;
			wc.interface.actionHandler.scrollToTop();
		}


		//Video/Audio player has to be done after the elements are part of the DOM
		if (typeof (wc.data.jsonData.chapters[nextChapterIndex].video) != 'undefined' && wc.data.jsonData.chapters[nextChapterIndex].video != null) {
			if (wc.data.jsonData.chapters[nextChapterIndex].chapterOptions.autoplay == 'true')
				wc.mediaPlayer.video.play(nextChapterIndex);
		}

		if (typeof (wc.data.jsonData.chapters[nextChapterIndex].audio) != 'undefined' && wc.data.jsonData.chapters[nextChapterIndex].audio != null) {
			if (wc.interface.options.mediaPlayer.allowAudioAutoPlay && wc.data.jsonData.chapters[nextChapterIndex].chapterOptions.autoplay == 'true') {
				//wc.interface.elements.playButton.disable(true, true);
				//wc.interface.elements.pauseButton.enable();				
				buttonsToEnable |= wc.interface.navigation.buttonTypes.Pause;
				buttonsToDisable |= wc.interface.navigation.buttonTypes.Play;
				buttonsToHide |= wc.interface.navigation.buttonTypes.Play;
				wc.mediaPlayer.logs.push("Calling audio.play from replaceCurrentElement");
				wc.mediaPlayer.audio.play(nextChapterIndex);
			}
			else {
				//wc.interface.elements.playButton.enable();
				//wc.interface.elements.pauseButton.disable(true);
				buttonsToHide |= wc.interface.navigation.buttonTypes.Pause;
				buttonsToDisable |= wc.interface.navigation.buttonTypes.Pause;
				buttonsToEnable |= wc.interface.navigation.buttonTypes.Play;
			}
		}
		else {
			//wc.interface.elements.playButton.disable(true);
			//wc.interface.elements.pauseButton.disable(true);
			//wc.interface.elements.audioSpeechButton.disable();			
			buttonsToHide |= wc.interface.navigation.buttonTypes.Pause;
			if (!$('#Button_PlayAudio').hasClass('oneMustBeVisible'))
				buttonsToHide |= wc.interface.navigation.buttonTypes.Play;

			buttonsToDisable |= wc.interface.navigation.buttonTypes.Play | wc.interface.navigation.buttonTypes.Pause | wc.interface.navigation.buttonTypes.Audio;
		}
	}

	//Set bullets button/text button states 
	if (wc.interface.showBullets && chapterMediaBulletsListHtml != '') {
		var Button_Bullets = document.getElementById('Button_EnableBullets');
		if (isDefined(Button_Bullets) && wc.interface.elements.general.getClassName(Button_Bullets) != 'bulletsButton_Disabled') {
			//wc.interface.elements.bulletsButton.activate();
			//wc.interface.elements.fullTextButton.enable();
			buttonsToEnable |= (buttonsToDisable & wc.interface.navigation.buttonTypes.Text) == wc.interface.navigation.buttonTypes.Text ? wc.interface.navigation.buttonTypes.None : wc.interface.navigation.buttonTypes.Text;
		}
	}
	else {
		var Button_Bullets = document.getElementById('Button_EnableBullets');
		if (isDefined(Button_Bullets) && wc.interface.elements.general.getClassName(Button_Bullets) != 'bulletsButton_Disabled') {
			if (chapterMediaBulletsListHtml != '') {
				//wc.interface.elements.bulletsButton.enable();
				buttonsToEnable |= ((buttonsToDisable & wc.interface.navigation.buttonTypes.Bullets) == wc.interface.navigation.buttonTypes.Bullets) || ((buttonsToActivate & wc.interface.navigation.buttonTypes.Bullets) == wc.interface.navigation.buttonTypes.Bullets) ? wc.interface.navigation.buttonTypes.None : wc.interface.navigation.buttonTypes.Bullets;
				//console.log(buttonsToEnable & wc.interface.navigation.buttonTypes.Bullets);
			}
			else {
				//wc.interface.elements.bulletsButton.disable();
				buttonsToDisable |= wc.interface.navigation.buttonTypes.Bullets;
				buttonsToDisable |= wc.interface.navigation.buttonTypes.Text;
			}
			//wc.interface.elements.fullTextButton.activate();
		}
	}

	if (wc.data.jsonData.chapters[nextChapterIndex].chapterOptions.pagination == "false") {
		try {
			buttonsToEnable = wc.interface.navigation.buttonTypes.None;
			buttonsToDisable = wc.interface.navigation.buttonTypes.All;
			buttonsToHide = wc.interface.navigation.buttonTypes.All;
		}
		catch (err) { }
	}

	var paginationContainer = document.getElementById('Pagination_Container');

	wc.interface.startChapterTiming();
	wc.lms.updateBookmark(nextChapterIndex + 1);
	wc.interface.currentElement.chapterIndex = nextChapterIndex;
	wc.interface.currentElement.elementType = nextElementType;

	// apply the scroll if needed
	wc.interface.applyScroll('#CurrentElementContainer', true);

	//wc.interface.elements.memorandumChapter.resizeFont(true);	
	wc.interface.elements.resizeFont.reset();
	wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide, buttonsToActivate);
//  5 sec delay
wc.interface.navigation.saveButtonsCurrentState();
if (nextChapterIndex != 0) {
//  comment out set delay, to let waitforaudio work
//        wc.interface.navigation.disableButton("Button_Next");

//        wc.interface.navigation.disableButton("Button_PlayAudio");

//        wc.interface.navigation.disableButton("Button_PauseAudio");
}

//	if (! isDefined(nextChapter.survey)) {

	if (typeof (nextChapter.survey) != 'undefined') {
   //        alert('this is a survey page');
        } else {
if (nextChapterIndex != 0) {
  //	    alert(' set 5 sec nav time');
//  comment out set delay, to let waitforaudio work
  //	setTimeout("wc.interface.navigation.enableButtonFromDelay(\"Button_Next\");",5000);
}
	}

//	setTimeout("wc.interface.navigation.enableButtonFromDelay(\"Button_PlayAudio\");",5000);

//	setTimeout("wc.interface.navigation.enableButtonFromDelay(\"Button_PauseAudio\");",5000);

// end 5 sec delay



	wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
};

wc.interface.buildSurveyQuestionHtml = function (survey, choiceIndex) {
	var surveyQuestionsHtml = '';
	for (var questionIndex in survey.surveyQuestions) {
		var question = survey.surveyQuestions[questionIndex];

		if (question.variety == 'MultipleChoiceMultipleAnswers') {
			choiceTemplateHtml = wc.data.templateElements.survey_MultipleChoiceMultipleAnswer;
			questionTemplateHtml = wc.data.templateElements.survey;

			var choiceHtml = '';
			for (var choiceIndex in question.choices) {
				var tmpHtml = choiceTemplateHtml;
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceMultipleAnswer_Body', question.choices[choiceIndex].body);
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceMultipleAnswer_Name', 'Survey_Choices');
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceMultipleAnswer_Id', choiceIndex);
				tmpHtml = tmpHtml.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
				tmpHtml = tmpHtml.replaceTag('Content', 'questionIndex', questionIndex);

				choiceHtml += tmpHtml;
			}

			questionTemplateHtml = questionTemplateHtml.replace(/width:\d+px;/gi, 'width:' + question.width + ';');
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'idSuffix', '_subQuestion' + questionIndex);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Body', question.body);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Choices', choiceHtml);

			surveyQuestionsHtml += questionTemplateHtml;
		} else if (question.variety == 'Boolean') {
			var choiceTemplateHtml = wc.data.templateElements.survey_Boolean;
			var questionTemplateHtml = wc.data.templateElements.survey;

			var choiceHtml = choiceTemplateHtml;

			choiceHtml = choiceHtml.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
			choiceHtml = choiceHtml.replaceTag('Content', 'questionIndex', questionIndex);

			questionTemplateHtml = questionTemplateHtml.replace(/width:\d+px;/gi, 'width:' + question.width + ';');
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'idSuffix', '_subQuestion' + questionIndex);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Body', question.body);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Choices', choiceHtml);

			surveyQuestionsHtml += questionTemplateHtml;
		} else if (question.variety == "MultipleChoiceOneAnswer") {
			choiceTemplateHtml = wc.data.templateElements.survey_MultipleChoiceOneAnswer;
			questionTemplateHtml = wc.data.templateElements.survey;

			var choiceHtml = '';
			for (var choiceIndex in question.choices) {
				var tmpHtml = choiceTemplateHtml;
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceOneAnswer_Body', question.choices[choiceIndex].body);
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceOneAnswer_Name', 'Survey_Choices');
				tmpHtml = tmpHtml.replaceTag('Content', 'Survey_MultipleChoiceOneAnswer_Id', choiceIndex);
				tmpHtml = tmpHtml.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
				tmpHtml = tmpHtml.replaceTag('Content', 'questionIndex', questionIndex);

				choiceHtml += tmpHtml;
			}

			questionTemplateHtml = questionTemplateHtml.replace(/width:\d+px;/gi, 'width:' + question.width + ';');
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'idSuffix', '_subQuestion' + questionIndex);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Body', question.body);
			questionTemplateHtml = questionTemplateHtml.replaceTag('Content', 'Survey_Choices', choiceHtml);

			surveyQuestionsHtml += questionTemplateHtml;
		} else if (question.variety == "TextEssay") {
			choiceTemplateHtml = wc.data.templateElements.survey_TextEssay;

			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'Survey_TextEssay_Id', choiceIndex);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'Survey_TextEssay_Name', choiceIndex);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'Survey_TextEssay_height', question.height);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'Survey_TextEssay_width', question.width);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'Survey_TextEssay_Label', question.body);
			choiceTemplateHtml = choiceTemplateHtml.replaceTag('Content', 'questionIndex', questionIndex);

			surveyQuestionsHtml += choiceTemplateHtml;
			//templateHtml = templateHtml.replaceTag('Content', 'Survey_Body', question.body);
			//templateHtml = templateHtml.replaceTag('Content', 'Survey_Buttons', '');
			//templateHtml = templateHtml.replaceTag('Content', 'Survey_Choices', choiceHtml);
		}
	}
	return surveyQuestionsHtml;
}

wc.interface.buildSurveyHtml = function (survey, choiceIndex) {
	var templateHtml = wc.data.templateElements.survey;
	var choiceTemplateHtml = '';
	var continueButtonTemplate = wc.data.templateElements.survey_ContinueButton;

	//var isTrigger = survey.choices[choiceIndex].isTrigger == "true";


	//if (survey.pivotQuestion.variety == 'MultipleChoiceOneAnswer')
	choiceTemplateHtml = wc.data.templateElements.survey_PivotQuestion;
	var choiceHtml = '';

	if (!isDefined(survey.pivotQuestion) && isDefined(survey.surveyQuestions))
		return wc.interface.buildSurveyQuestionHtml(survey, choiceIndex);

	for (var choiceIndex in survey.pivotQuestion.choices) {
		var tmpHtml = choiceTemplateHtml;
		tmpHtml = tmpHtml.replaceTag('Content', 'Survey_PivotQuestion_Body', survey.pivotQuestion.choices[choiceIndex].body);
		tmpHtml = tmpHtml.replaceTag('Content', 'Survey_PivotQuestion_Id', choiceIndex);
		tmpHtml = tmpHtml.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);

		choiceHtml += tmpHtml;
	}

	templateHtml = templateHtml.replaceTag('Content', 'idSuffix', '');
	templateHtml = templateHtml.replaceTag('Content', 'Survey_Body', survey.pivotQuestion.body);
	templateHtml = templateHtml.replaceTag('Content', 'Survey_Choices', choiceHtml);

	return templateHtml;

};

wc.interface.game = {
	gameIndex: null,
	questionChapters: null,
	currentQuestionChapterIndex: null,
	questionCounter: 0,
	questionsCorrectOnFirstTry: 0,
	currentQuestions: null,
	currentQuestion: null,
	correctAnswerOnFirstTry: null,
	chapterQuestionsCompleted: false,
	gameComplete: false,
	variety: null,
	init: function (gameIndex) {
		wc.interface.game.gameIndex = gameIndex;
		wc.interface.game.questionChapters = new Array();
		wc.interface.game.currentQuestionChapterIndex = null;
		wc.interface.game.questionCounter = 0;
		wc.interface.game.questionsCorrectOnFirstTry = 0;
		wc.interface.game.questionsAskedPoolCount = 0;
		wc.interface.game.currentQuestions = null;
		wc.interface.game.currentQuestion = null;
		wc.interface.game.chapterQuestionsCompleted = false;
		wc.interface.game.variety = wc.data.jsonData.quiz.games[gameIndex].variety.replace('Both', '');
		var chapterIndexes = new Array();
		for (var chapterIndex in wc.data.jsonData.chapters)
			chapterIndexes.push(chapterIndex);

		for (var chapterIndex in wc.data.jsonData.chapters) {
			var chapter = wc.data.jsonData.chapters[chapterIndex];
			if (typeof (chapter.quizQuestions) != 'undefined') {
				wc.interface.game.questionChapters.push(chapterIndex);
			}
		}
		//If there are questions in the course itself they are there as filler and should also be added.
		//We will use id -1 to indicate they come from the course and not from a chapter
		if (isDefined(wc.data.jsonData.quizQuestions))
			wc.interface.game.questionChapters.push(-1);

		//questionChapters.sort(wc.tools.randomizeSort);
		wc.interface.game.questionChapters = wc.tools.shuffle(wc.interface.game.questionChapters);

	},
	answerQuestion: function (choiceIndex) {
		var question = wc.interface.game.currentQuestion;
		var choice = question.choices[choiceIndex];
		if (choice.isCorrect == "false") 
		{
			if (wc.interface.game.correctAnswerOnFirstTry == null)
				wc.interface.game.correctAnswerOnFirstTry = false;


// send a bookmark event - do it here to only report on failed attempts
                var correctedchoiceindex = choiceIndex + 1;
                var correctedquestion = "R" + wc.interface.game.currentQuestion.id;
		wc.lms.updateQuizBookmark(-1,correctedquestion,correctedchoiceindex);


// end quiz bookmarking
		} 
		else 
		{
			if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) 
			{
				wc.interface.game.gameComplete = true;
			} 
			else
			{
				if (wc.interface.game.correctAnswerOnFirstTry == null || wc.interface.game.currentQuestions.length == 1) 
				{
					if (wc.interface.game.correctAnswerOnFirstTry == null) {
					wc.interface.game.questionsCorrectOnFirstTry++;
					}
// answer on first try being false gets next in pool, which I want to avoid if the pool has only one question
					wc.interface.game.correctAnswerOnFirstTry = true;
					wc.interface.game.questionsAskedPoolCount++;
					if (wc.interface.game.questionsAskedPoolCount < wc.interface.game.questionChapters.length) 
					{
						wc.interface.game.currentQuestionChapterIndex++;

						if (wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex] == -1)
							wc.interface.game.currentQuestions = wc.data.jsonData.quizQuestions;
						else
							wc.interface.game.currentQuestions = wc.data.jsonData.chapters[wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex]].quizQuestions;

						wc.interface.game.currentQuestions = wc.tools.shuffle(wc.interface.game.currentQuestions);
					}
					else
					{
						wc.interface.game.currentQuestions = null;
						wc.interface.game.chapterQuestionsCompleted = true;
					}
				}
			}
		}
		return choice;
	},
	loadQuestion: function ()
	{
		if (wc.interface.game.gameIndex == null)
			return null;
		if (wc.interface.game.questionChapters == null)
			wc.interface.game.init(gameIndex);

		var question = null;
		if (wc.interface.game.chapterQuestionsCompleted) {
			question = wc.data.jsonData.finalQuizQuestion;
		} else {
			if (wc.interface.game.currentQuestionChapterIndex == null)
				wc.interface.game.currentQuestionChapterIndex = 0;

			if (wc.interface.game.currentQuestions == null) {
				if (wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex] == -1)
					wc.interface.game.currentQuestions = wc.data.jsonData.quizQuestions;
				else
					wc.interface.game.currentQuestions = wc.data.jsonData.chapters[wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex]].quizQuestions;
				wc.interface.game.currentQuestions = wc.tools.shuffle(wc.interface.game.currentQuestions);
			}
			question = wc.interface.game.currentQuestions.shift();
			wc.interface.game.currentQuestions.push(question);
			wc.interface.game.questionCounter++;
		}
		wc.interface.game.correctAnswerOnFirstTry = null;
		return wc.interface.game.currentQuestion = question;
	},
	reportScore: function (correctQuestions, totalQuestions, bGame) { // bGame = true if program has a game
		if (true == wc.lms.window.bNoLMS)
			return true;

		var nLMSResult = 999; // general failure

		// Report score to the LMS
		if (wc.lms.objInfo != null && wc.lms.window != null) {
			if (typeof (wc.lms.window) == "object") {
				if (typeof (wc.lms.window.finish) == "function") {
					try {
						nLMSResult = wc.lms.window.finish(correctQuestions, totalQuestions);
						if (wc.data.values.companyId == '125' && bGame)
							alert("Score: " + Math.round(correctQuestions * 100 / totalQuestions) + "%");

					} catch (e) {
					}
				}
			}
		}

		if (0 != nLMSResult)
			NoConnectivityAtCertificate(wc.interface.currentElement.chapterIndex);

		return (0 == nLMSResult);
	}
};

wc.interface.displayLayer = function (elementType, data) {
	wc.interface.layerData.elementType = elementType;
	wc.interface.layerData.data = data;
	wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_DisplayLayer, { elementType: elementType, data: data });

	var buttonsToDisable = wc.interface.navigation.buttonTypes.All ^ wc.interface.navigation.buttonTypes.ResizeFont;

	var buttonsToEnable = wc.interface.navigation.buttonTypes.ResizeFont;
	var buttonsToHide = wc.interface.navigation.buttonTypes.Pause;

	var buttonsCurrentState = wc.interface.navigation.getButtonsCurrentState();

	if (elementType == wc.interface.elementTypes.game) {

		wc.mediaPlayer.stopCurrentActiveMedia();

		var game = wc.data.jsonData.quiz.games[wc.interface.game.gameIndex];
		var question = wc.interface.game.loadQuestion();
		var templateHtml = wc.data.templateElements.game_quiz;
		var itemHtml = wc.data.templateElements.game_quiz_ChoiceItem;

		if (wc.interface.game.chapterQuestionsCompleted && (typeof(wc.data.jsonData.finalQuizQuestion) == 'undefined' || wc.data.jsonData.finalQuizQuestion == '')) {
			wc.interface.navigateToElement(wc.interface.directions.next);
		} else {

			var choiceHtml = '';
			for (var choiceIndex in (!wc.interface.game.chapterQuestionsCompleted && wc.interface.options.games.randomizeChoices ? wc.tools.shuffle(question.choices) : question.choices)) {
				var tmpHtml = itemHtml;
				tmpHtml = tmpHtml.replaceTag('Content', 'Quiz_ChoiceItem_Body', question.choices[choiceIndex].body);
				tmpHtml = tmpHtml.replaceTag('Content', 'Quiz_ChoiceItem_Id', choiceIndex);
				tmpHtml = tmpHtml.replaceTag('Content', 'gameIndex', wc.interface.game.gameIndex);
				choiceHtml += tmpHtml;
			}
			if (isDefined(document.getElementById('Question_Number')))
				document.getElementById('Question_Number').innerHTML = wc.interface.game.questionCounter;
			templateHtml = templateHtml.replaceTag('Content', 'Quiz_Body', question.body);
			templateHtml = templateHtml.replaceTag('Content', 'Quiz_Choices', choiceHtml);
			templateHtml = templateHtml.replaceTag('Content', 'ContinueResource', wc.interface.getResource('continue'));

			var layerElementContainer = document.getElementById('Quiz_GameContent');
			var layerElementContainerForFading = document.getElementById('Quiz_GameContent'); //document.getElementById('LayerElementContainer')

			//if (document.all)	// IE
			//{
			//	if (!isDefined(wc.data.values.IsiPadFrame))
			//		LayerElementContainer.style.filter = 'alpha(opacity=100)';
			//}

			if (false && wc.interface.currentElement.elementType == wc.interface.elementTypes.game) {
				//We want to be gracefull between the questions, within the same game.
				templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
				layerElementContainer.innerHTML = templateHtml;
			} else {
			}
			
			if (document.all)	// IE
			{
				
				//debugController.debug('setting opacity for IE');
				// IMPORTANT FOR IE
				wc.setOpacity('LayerElementContainer', 0);
			}


			// call onBefore_LoadQuestion event
			wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onBefore_LoadQuestion, { elementType: wc.interface.currentElement.elementType, data: null });
			if (wc.interface.handlers.games.hasEvent(wc.interface.handlers.games.insteadOf_LoadQuestion)) {
				
				wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.insteadOf_LoadQuestion, { elementType: wc.interface.currentElement.elementType, template: templateHtml, question: question, data: data });
			} else {
				var currentElementopacityTween = new OpacityTween((wc.interface.currentElement.elementType == wc.interface.elementTypes.game ? layerElementContainerForFading : document.getElementById('CurrentElementContainer')), Tween.regularEaseOut, 100, 0, 0.2);
				
				currentElementopacityTween.onMotionFinished = function () {
					
					layerElementContainer.innerHTML = templateHtml;
					
					if (typeof(question.illustration) != 'undefined')
						wc.interface.elements.illustration.inject('Quiz_Illustration_Content', question.illustration, true);
					else
						document.getElementById('Quiz_Illustration_Content').innerHTML = '';

					document.getElementById('CurrentElementContainer').style.display = 'none';
					document.getElementById('LayerElementContainer').style.display = '';
					wc.setOpacity('LayerElementContainer', 100);
					var layerElementopacityTween = new OpacityTween(layerElementContainerForFading, Tween.regularEaseOut, 0, 100, 1.2);
					layerElementopacityTween.onMotionFinished = function () {
						if (document.all) {
							wc.removeOpacity(layerElementContainerForFading);
						}
						
						wc.interface.applyScroll('#finalQuizContainer');
					};					
					layerElementopacityTween.start();

					wc.interface.actionHandler.scrollToTop();					
					//wc.interface.elements.quiz.resizeFont(true);
				};				
				currentElementopacityTween.start();
			}
			if (wc.interface.currentElement.elementType != wc.interface.elementTypes.game) {
			}
		}
		if (wc.interface.game.chapterQuestionsCompleted && typeof(wc.data.jsonData.finalQuizQuestion) != 'undefined' && wc.data.jsonData.finalQuizQuestion != '') {
			wc.interface.currentElement.elementType = wc.interface.elementTypes.finalQuizQuestion;
		} else if (wc.interface.game.chapterQuestionsCompleted) {
			// has no final quiz
			wc.interface.currentElement.elementType = wc.interface.elementTypes.finalQuizQuestion;
			wc.interface.navigateToElementAfterLastChapter();

		} else {
			wc.interface.currentElement.elementType = wc.interface.elementTypes.game;
		}
		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_LoadQuestion, { elementType: wc.interface.currentElement.elementType, data: null });
	}
	else if (elementType == wc.interface.elementTypes.gameIntro) {
		if (wc.interface.currentElement.elementType != wc.interface.elementTypes.game) {
			wc.interface.game.init(data);
		}

		var game = wc.data.jsonData.quiz.games[wc.interface.game.gameIndex];
		if (wc.interface.currentElement.elementType != wc.interface.elementTypes.game) {
			wc.interface.loadGameTemplates(wc.interface.game.variety);
		}

		var layerElementContainer = document.getElementById('LayerElementContainer');

		var templateHtml = wc.data.templateElements.game_quiz_Intro;

		var skipIntro = false;
		//console.log(game);
		if (isDefined(templateHtml) && templateHtml != '') {
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_LoadingText', wc.interface.getResource('LoadingGame'));
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_WelcomeText', game.introduction || '');
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_Name', game.name || '');
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_StartQuizText', wc.interface.getResource('StartQuiz'));
			templateHtml = templateHtml.replaceTag('Content', 'gameIndex', wc.interface.game.gameIndex);
			if (!isDefined(game.introduction) || game.introduction == '') {
				skipIntro = true;
			}
		} else {
			skipIntro = true;
		}

		templateHtml = wc.data.templateElements.game_quiz_Wrapper.replaceTag('Content', 'quizContent', templateHtml);
		templateHtml = wc.data.templateElements.layerWrapper.replaceTag('Content', 'LayerContent', templateHtml);
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
		//templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		if (skipIntro) {
			layerElementContainer.innerHTML = templateHtml;

			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';

			wc.interface.currentElement.elementType = wc.interface.elementTypes.game;
			return wc.interface.actionHandler.displayGame(wc.interface.game.gameIndex);
		}

		if (document.all)	// IE
		{
			LayerElementContainer.style.filter = 'alpha(opacity=100)';
		}
		var onAfterDisplayIntroLayerEventFired = false;
		if (wc.interface.options.games.gameIntroDisplayAnimation == wc.interface.animationOptions.fadeOutIn) {
			var currentElementopacityTween = new OpacityTween((wc.interface.currentElement.displayType == 1 ? document.getElementById('CurrentElementContainer') : document.getElementById('LayerElementContainer')), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				layerElementContainer.innerHTML = templateHtml;
				wc.interface.currentElement.elementType = wc.interface.elementTypes.gameIntro;
				document.getElementById('CurrentElementContainer').style.display = 'none';
				document.getElementById('LayerElementContainer').style.display = '';
				wc.interface.actionHandler.scrollToTop();
				var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();

				//console.log('fire event');
				wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_DisplayIntroLayer, { elementType: wc.interface.currentElement.elementType, data: null });
			};

			onAfterDisplayIntroLayerEventFired = true;
			currentElementopacityTween.start();
		}
		else {
			layerElementContainer.innerHTML = templateHtml;
			wc.interface.actionHandler.scrollToTop();
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			wc.setOpacity('LayerElementContainer', 100);
			if (skipIntro)
				wc.interface.actionHandler.displayGame(wc.interface.game.gameIndex);
			else
				wc.interface.currentElement.elementType = wc.interface.elementTypes.gameIntro;
		}
		//wc.lms.updateBookmark(-1)
		if (!onAfterDisplayIntroLayerEventFired) {
			wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_DisplayIntroLayer, { elementType: wc.interface.currentElement.elementType, data: null });
		}

	}
	else if (elementType == wc.interface.elementTypes.gameChoice) {
		wc.mediaPlayer.stopCurrentActiveMedia();
		var templateHtml = wc.data.templateElements.game_Choice;
		var itemHtml = wc.data.templateElements.game_ChoiceItem;

		var gameItemsHtml = '';
		for (var gameIndex in wc.data.jsonData.quiz.games) {
			var game = wc.data.jsonData.quiz.games[gameIndex];
			var gameItemHtml = itemHtml.replaceTag('Content', 'GameItem_Title', game.name);
			gameItemHtml = gameItemHtml.replaceTag('Content', 'GameItem_Body', game.description);
			gameItemHtml = gameItemHtml.replaceTag('Content', 'GameItem_Id', gameIndex);
			gameItemsHtml += gameItemHtml;
		}

		templateHtml = templateHtml.replaceTag('Content', 'Game_ChoiceItem', gameItemsHtml);
		if (templateHtml.indexOf("gameChoiceBoxBackground") >= 0) {
			var intro = wc.data.jsonData.quiz.introduction;
			intro = intro.replace('style="margin-top:48px;"', "style='margin-bottom: 0px;margin-top: 5px;'");
			templateHtml = templateHtml.replaceTag('Content', 'Game_Introduction', intro);
		}
		else {
			templateHtml = templateHtml.replaceTag('Content', 'Game_Introduction', wc.data.jsonData.quiz.introduction);
		}

		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		if (document.all)	// IE
		{
			LayerElementContainer.style.filter = 'alpha(opacity=99)';
		}

		if (wc.interface.options.games.gameChoiceDisplayAnimation == wc.interface.animationOptions.fadeOutIn) {
			var currentElementopacityTween = new OpacityTween((wc.interface.currentElement.displayType == 1 ? document.getElementById('CurrentElementContainer') : document.getElementById('LayerElementContainer')), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				layerElementContainer.innerHTML = templateHtml;
				document.getElementById('CurrentElementContainer').style.display = 'none';
				document.getElementById('LayerElementContainer').style.display = '';
				wc.interface.actionHandler.scrollToTop();
				var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();
			};
			currentElementopacityTween.start();
		}
		else {
			layerElementContainer.innerHTML = templateHtml;
			wc.interface.actionHandler.scrollToTop();
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			wc.setOpacity('LayerElementContainer', 100);
		}

		if (document.all)	// IE
		{
			LayerElementContainer.style.filter = 'alpha(opacity=99)';
			LayerElementContainer.style.filter = 'alpha(opacity=100)';
		}
		wc.lms.updateBookmark(-1);
		//wc.interface.elements.gamechoice.resizeFont(true);
		wc.interface.currentElement.elementType = wc.interface.elementTypes.gameChoice;
	}
	else if (elementType == wc.interface.elementTypes.certificate) {
		wc.mediaPlayer.stopCurrentActiveMedia();
		var templateHtml = "";
		var layerElementContainer;
		if (isDefined(wc.data.jsonData.certificate)) {
			templateHtml = wc.data.templateElements.certificate_UserDefined;
			templateHtml = templateHtml.replaceTag('Content', 'Certificate_Footer', wc.data.jsonData.certificate.footer);
			templateHtml = templateHtml.replaceTag('Values', 'FirstName', wc.lms.getFirstName());
			templateHtml = templateHtml.replaceTag('Values', 'LastName', wc.lms.getLastName());
			templateHtml = templateHtml.replaceTag('Values', 'CurDate', wc.lms.getDate());
			templateHtml = templateHtml.replaceTag('Values', 'ProgramName', wc.data.jsonData.name);

			layerElementContainer = document.getElementById('LayerElementContainer');
			templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
			layerElementContainer.innerHTML = templateHtml;
			//illustration has to be done after element is in DOM
			if (typeof (wc.data.jsonData.certificate.illustration) != 'undefined')
				wc.interface.elements.illustration.inject('Certificate_UserDefined_Illustration_Content', wc.data.jsonData.certificate.illustration, true);
			else //no illustration found
			{
				document.getElementById('Certificate_UserDefined_Illustration_Content').innerHTML = '';
				document.getElementById('Certificate_UserDefined_Illustration_Content').style.display = 'none';
			}
		}
		else {
			templateHtml = wc.data.templateElements.certificate;

			templateHtml = templateHtml.replaceTag('Content', 'Certificate_ProgramName', wc.data.jsonData.name);
			templateHtml = templateHtml.replaceTag('Content', 'SurveyUrl', wc.interface.elements.survey.surveyUrl());
			//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

			layerElementContainer = document.getElementById('LayerElementContainer');
			templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
			templateHtml = templateHtml.replace('{$Value:CompanyAddress}', '').replace('{$Value:CompanyCity}', '');
			layerElementContainer.innerHTML = templateHtml;

			if (wc.interface.elements.survey.hasAnsweredQuestions)
				document.getElementById('SurveyAnswers').style.display = '';
			else
				document.getElementById('SurveyAnswers').style.display = 'none';

			document.getElementById('FirstName').innerHTML = wc.lms.getFirstName();
			document.getElementById('LastName').innerHTML = wc.lms.getLastName();
			document.getElementById('CurDate').innerHTML = wc.lms.getDate();
		}
		var currentElementopacityTween = new OpacityTween((wc.interface.currentElement.displayType == wc.interface.displayTypes.Container ? document.getElementById('CurrentElementContainer') : document.getElementById('LayerElementContainer')), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			wc.interface.actionHandler.scrollToTop();
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		wc.interface.currentElement.elementType = wc.interface.elementTypes.certificate;
	}
	else if (elementType == wc.interface.elementTypes.bookmark) {
		var templateHtml = wc.data.templateElements.bookmark;

		if (wc.lms.bookmark == "GC" || wc.lms.bookmark == "-1" || wc.lms.bookmark == "-2") {
			if (wc.lms.objInfo.bookmark == "-2") {
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Question', wc.interface.getResource('PodcastDownloaded')); //usedInJS" select="true()
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer1', wc.interface.getResource('PodcastReviewed'));
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer2', wc.interface.getResource('PodcastRestartCourse'));
			} else {
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Question', wc.interface.getResource('PreviouslyCompleted')); //usedInJS" select="true()
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer1', wc.interface.getResource('Proceedtogame'));
				templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer2', wc.interface.getResource('BeginWithLesson'));
			}
		} else {
			templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Question', wc.interface.getResource('PreviouslyBegun')); //usedInJS" select="true()
			templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer1', wc.interface.getResource('Continuewith') + wc.lms.bookmark);
			templateHtml = templateHtml.replaceTag('Content', 'Bookmark_Answer2', wc.interface.getResource('BeginWithLesson'));
		}
		var layerElementContainer = document.getElementById('LayerElementContainer');

		if (document.all)	// IE
		{
			layerElementContainer.style.left = '0px';
		}
		else {
			layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
		}

		document.getElementById('CurrentElementContainer').innerHTML = '';
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);
		layerElementContainer.innerHTML = templateHtml;

		//if (!isDefined(document.getElementById('bookmarkSelectionLayout'))) {
		//	layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
		//}

		if (!$(layerElementContainer).hasClass('dontReposition')) {
			layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
		}

		// check to see if we have to disable the functionality for the continue button
		var $continueButton = $('#BookmarkBeginButton');
		if ($continueButton.hasClass('disabled')) {
			wc.interface.actionHandler.helpers.disableDefaultFunctionality($continueButton);
		}

		if (isDefined(document.LMSForm)) {
			if (isDefined(document.LMSForm.bookmark)) {
				document.LMSForm.bookmark[0].value = wc.lms.bookmark;
				document.LMSForm.bookmark[0].checked = true;
			}
		}

		if (typeof (document.getElementById('CurrentElementContainer')) != 'undefined') {
			currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('CurrentElementContainer').style.display = 'none';
				document.getElementById('LayerElementContainer').style.display = '';
				wc.interface.actionHandler.scrollToTop();
				layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();
			};
			currentElementopacityTween.start();
		} else {
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
			wc.interface.actionHandler.scrollToTop();
		}
		wc.interface.currentElement.elementType = wc.interface.elementTypes.bookmark;
	}
	else if (elementType == wc.interface.elementTypes.acknowledgment) {
		if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
			wc.interface.actionHandler.pauseAudio(false);
		else
			wc.mediaPlayer.stopCurrentActiveMedia();

		var templateHtml = wc.data.templateElements.acknowledgment;

		templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Heading', wc.data.jsonData.acknowledgment.heading);
		templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			wc.interface.actionHandler.scrollToTop();
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		//wc.interface.elements.acknowledgment.resizeFont(true);
		wc.interface.currentElement.elementType = wc.interface.elementTypes.acknowledgment;
		//Acknowledgment_Refusal, Acknowledgment_Agree, Acknowledgment_Previous, Acknowledgment_Confirm
		//, Acknowledgment_Body, Acknowledgment_Refusal, 
	}
	else if (elementType == wc.interface.elementTypes.matchGame) {
		wc.mediaPlayer.stopCurrentActiveMedia();

		var templateHtml = wc.data.templateElements.matchGame;
		var itemHtml = wc.data.templateElements.matchGameItem;
		var matchGameHtml = templateHtml;
		matchGameHtml = matchGameHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		matchGameHtml = matchGameHtml.replaceTag('Content', 'MatchGame_Heading', data.heading);
		matchGameHtml = matchGameHtml.replaceTag('Content', 'MatchGame_Introduction', data.introduction);
		// add the outro container
		matchGameHtml = matchGameHtml.replaceTag('Content', 'MatchGame_Outro_Heading', data.closing);
		// create an array with all the possible indexes from 0 to the lenght of the data.problem array
		var problemIndexes = [];
		var i = 0;
		for (var problemIndex in data.problems) {
			i = i + 1;
			// limit mobile to 6 match game items
			if (wc.data.values.templatePlatform != 'mobile' || i < 7) {
				problemIndexes.push(problemIndex);
			}
		}
		// randomize the array indexes
		wc.tools.shuffle(problemIndexes);
		// copy the randomized indexes to the problemBodies array
		var problemBodies = [];
		for (problemIndex in problemIndexes)
			problemBodies.push(problemIndexes[problemIndex]);

		// shuffle the indexes again until none of the new indexes match the old ones
		var matchesFound = true;
		while (matchesFound) {
			matchesFound = false;
			wc.tools.shuffle(problemIndexes);

			for (problemIndex in problemIndexes)
				if (problemBodies[problemIndex] == problemIndexes[problemIndex]) {
					matchesFound = true;
				}
		}
		var problemSections = [];
		for (problemIndex in problemIndexes)
			problemSections.push(problemIndexes[problemIndex]);

		var problemHtml = '';
		i = 0;
		for (var problemIndex in data.problems) {

			i = i + 1;
			// limit mobile to 6 match game items
			if (wc.data.values.templatePlatform != 'mobile' || i < 7) {
				var tmpHtml = itemHtml;
				tmpHtml = tmpHtml.replaceTag('Content', 'MatchGameItem_Body', data.problems[problemBodies[problemIndex]].body);
				if (wc.data.values.templatePlatform == 'mobile' && data.problems[problemSections[problemIndex]].section.length > 23) {
				tmpHtml = tmpHtml.replaceTag('Content', 'MatchGameItem_Section', data.problems[problemSections[problemIndex]].section.substr(0,23));
				} else {
				tmpHtml = tmpHtml.replaceTag('Content', 'MatchGameItem_Section', data.problems[problemSections[problemIndex]].section);
				}
				tmpHtml = tmpHtml.replaceTag('Content', 'containerIndex', problemIndex);
				tmpHtml = tmpHtml.replaceTag('Content', 'bodyIndex', problemBodies[problemIndex]);
				tmpHtml = tmpHtml.replaceTag('Content', 'sectionIndex', problemSections[problemIndex]);
				problemHtml += tmpHtml;
			}
		}


		matchGameHtml = matchGameHtml.replaceTag('Content', 'MatchGame_GameContent', problemHtml);
		matchGameHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(matchGameHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = matchGameHtml;

		// register the draggable/droppable events
		$('[data-draggable="true"]').draggable({
			appendTo: 'body',
			helper: 'clone',
			start: function (event, ui) {
				$(ui.helper.context).addClass('drag-source');
			},
			stop: function (event, ui) {
				$(ui.helper.context).removeClass("drag-source");
			}
		});

		$('[data-droppable="true"]').droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept: ":not(.ui-sortable-helper)",
			drop: function (event, element) {
				// save a reference to the droppable element
				var dropppable = $(this);
				// get the game item element where we are going to drop this. This should be the wrapper for a question/answer group
				var toGameItemElement = $(dropppable).closest('[id^="MatchGameItem_Element_"]');
				var toQuestion = $('[id^="MatchGameItem_Body_"]', toGameItemElement);

				// get the old question (the one we dragged)
				var fromGameItemElement = element.draggable.closest('[id^="MatchGameItem_Element_"]');
				var fromQuestion = $('[id^="MatchGameItem_Body_"]', fromGameItemElement);

				// swap the 2 questions
				wc.tools.swapNodes(fromQuestion[0], toQuestion[0]);
				var i = 0;
				var matches = 0;
				for (var problemIndex in data.problems) {

					i = i + 1;
					// limit mobile to 6 match game items
					if (wc.data.values.templatePlatform != 'mobile' || i < 7) {

						var gameItemElement = $('#MatchGameItem_Element_' + problemIndex);

						//var questionId = $(gameItemElement.children()[0]).attr('id').substring('MatchGameItem_Section_'.length);
						//var answerId = $($(gameItemElement.children()[1]).children()[0]).attr('id').substring('MatchGameItem_Body_'.length);
						var questionId = $('[id^="MatchGameItem_Section_"]', gameItemElement).attr('id').substring('MatchGameItem_Section_'.length);
						var answerId = $('[id^="MatchGameItem_Body_"]', gameItemElement).attr('id').substring('MatchGameItem_Body_'.length);

						//console.log('GameElement{index: ' + problemIndex + '; questionId: ' + questionId + '; answerId: ' + answerId + '}');
						if (questionId == answerId) {
							gameItemElement.addClass('solved');
							//$(gameItemElement.children()[0]).css('color', '#128006');
							//console.log($($(gameItemElement.children()[1]).children()[0]));
							// make the element undraggable

							var draggableElement = $('[data-draggable="true"]', gameItemElement);
							if (draggableElement.is('.ui-draggable')) {
								//console.log('draggable!');							
								//setTimeout("$($($('#MatchGameItem_Element_" + problemIndex + "').children()[1]).children()[0]).draggable('destroy')", 300);
								setTimeout("$('[data-draggable=\"true\"]', $('#MatchGameItem_Element_" + problemIndex + "')).draggable('destroy')", 200);
							}

							// make the containder undroppable						
							var droppableElement = $('[data-droppable="true"]', gameItemElement);
							if (droppableElement.is('.ui-droppable')) {
								//console.log('droppable!');
								setTimeout("$('[data-droppable=\"true\"]', $('#MatchGameItem_Element_" + problemIndex + "')).droppable('destroy')", 200);
							}
							matches++;
						}
					}
				}

				if (matches == data.problems.length || (matches == 6 && wc.data.values.templatePlatform == 'mobile')) {
					//console.log('DONE');

					setTimeout(function () {
						var MatchGame_GameContainer = document.getElementById('MatchGame_GameContainer');
						MatchGame_GameContainer.style.display = 'none';

						var MatchGame_OutroContainer = document.getElementById('MatchGame_OutroContainer');
						MatchGame_OutroContainer.style.display = '';

						var MatchGame_Heading_Outro = document.getElementById('MatchGame_Heading_Outro');
						if (isDefined(MatchGame_Heading_Outro)) {
							matchGame_MainHeaderBar = document.getElementById('matchGame_MainHeaderBar');
							if (isDefined(matchGame_MainHeaderBar)) {
								matchGame_MainHeaderBar.style.display = 'none';
							}
						}
					}, 350);

					//re-enable scroll
					//layerElementContainer.removeEventListener('touchmove', wc.interface.matchGameScrollEventHandler);
					if (!document.all) {
						document.body.removeEventListener('touchmove', matchGameDisableScroll);
					}
					//document.body.removeEventListener('touchstart', matchGameDisableScroll);
				}
				// Debug
				//  alert('item ' + itemName + ' (id: ' + itemIdMoved + ') dropped into ' + destinationId);
			}
		});

		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);

			layerElementopacityTween.onMotionFinished = function () {
				wc.interface.applyScroll('#LayerElementContainer', true);

				//if there is an inline intro, disable the touchmove. Normally this is done on the continue button from the matchgame intro, 
				// but if there is an inline intro we have to do it manually
				if ($('.matchGameElementIntro').hasClass('isInlineMatchGameIntro')) {
					if (!document.all) {
						document.body.addEventListener('touchmove', matchGameDisableScroll);
					}
				}
			};
			layerElementopacityTween.start();

		};
		currentElementopacityTween.start();

		wc.interface.currentElement.elementType = elementType;
	}
	else if (elementType == wc.interface.elementTypes.popQuestion || elementType == wc.interface.elementTypes.finalQuizQuestion) {
		if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
			wc.interface.actionHandler.pauseAudio(false);
		else
			wc.mediaPlayer.stopCurrentActiveMedia();

		var templateHtml = wc.data.templateElements.quizQuestion;
		var choiceTemplateHtml = '';
		var continueButtonTemplate = wc.data.templateElements.quizQuestion_ContinueButton;

		if (data.variety == 'MultipleChoiceOneAnswer')
			choiceTemplateHtml = wc.data.templateElements.quizQuestion_MultipleChoiceOneAnswer;

		var choiceHtml = '';
		for (var choiceIndex in data.choices) {
			var tmpHtml = choiceTemplateHtml;
			tmpHtml = tmpHtml.replaceTag('Content', 'QuizQuestion_MultipleChoiceOneAnswer_Body', data.choices[choiceIndex].body);
			tmpHtml = tmpHtml.replaceTag('Content', 'QuizQuestion_MultipleChoiceOneAnswer_Name', 'quizQuestion_Choices');
			tmpHtml = tmpHtml.replaceTag('Content', 'QuizQuestion_MultipleChoiceOneAnswer_Id', choiceIndex);
			tmpHtml = tmpHtml.replaceTag('Content', 'elementType', elementType);

			choiceHtml += tmpHtml;
		}
		templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Body', data.body);
		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Buttons', continueButtonTemplate);
		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Choices', choiceHtml);
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		//Needs to be done after elemnt is in DOM
		if (typeof (data.illustration) != 'undefined') {
			wc.interface.elements.illustration.inject('QuizQuestion_Illustration_Content', data.illustration, true);
			var QuizQuestion_Feedback_Illustration_Content = document.getElementById('QuizQuestion_Feedback_Illustration_Content');
			if (isDefined(QuizQuestion_Feedback_Illustration_Content)) {
				wc.interface.elements.illustration.inject('QuizQuestion_Feedback_Illustration_Content', data.illustration, true);
			}
		} else
			document.getElementById('QuizQuestion_Illustration_Content').innerHTML = '';


		if (!$(layerElementContainer).hasClass('dontReposition')) {
			if (document.all)	// IE
			{
				layerElementContainer.style.left = '0px';
			} else {
				layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
			}
			layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
		}

		var continueButton = document.getElementById('QuizQuestion_ContinueButton');
		if (typeof (continueButton) != 'undefined' && continueButton != null) {
			continueButton.style.visibility = 'hidden';
			continueButton.onclick = function () {
				wc.interface.navigateToElement(wc.interface.directions.next);
				//wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);
				//wc.mediaPlayer.logs.push("Calling audio.play from displayLayer for elementType == wc.interface.elementTypes.popQuestion || elementType == wc.interface.elementTypes.finalQuizQuestion");
			};
			continueButton.onKeyPress = function () {
				wc.interface.navigateToElement(wc.interface.directions.next);
				//wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);
			};
		}

		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.onMotionFinished = function () {
				$('#LayerElementContainer').find(">:first-child").addClass('popupAnimation');
			};
			layerElementopacityTween.start();
		};

		currentElementopacityTween.start();
		wc.interface.actionHandler.scrollToTop();
		//wc.interface.elements.quiz.resizeFont(true);
		wc.interface.currentElement.elementType = elementType;

	}
	else if (elementType == wc.interface.elementTypes.term) {
		if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
			wc.interface.actionHandler.pauseAudio(false);
		else
			wc.mediaPlayer.stopCurrentActiveMedia(true);

		var templateHtml = wc.data.templateElements.term;
		if (typeof (data.definition) == 'undefined')
			data.definition = '';
		if (typeof (data.name) == 'undefined')
			data.name = '';

		templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		templateHtml = templateHtml.replaceTag('Content', 'Term_Definition', data.definition);
		templateHtml = templateHtml.replaceTag('Content', 'Term_Name', data.name);
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		if (!$(layerElementContainer).hasClass('dontReposition')) {
			if (document.all)	// IE
			{
				layerElementContainer.style.left = '0px';
			} else {
				layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
			}
			layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
		}

		var closeButton = document.getElementById('Button_Close');
		if (typeof (closeButton) != 'undefined' && closeButton != null) {
			closeButton.onclick = function () {
				currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
				currentElementopacityTween.onMotionFinished = function () {
					document.getElementById('LayerElementContainer').style.display = 'none';
					document.getElementById('CurrentElementContainer').style.display = '';
					layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
					layerElementopacityTween.start();
					//wc.interface.layerData.initialize();
					if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
						wc.interface.actionHandler.playAudio(true);
					else
						wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

					wc.interface.navigation.updateButtons(buttonsCurrentState.buttonsToEnable, buttonsCurrentState.buttonsToDisable, buttonsCurrentState.buttonsToHide, buttonsCurrentState.buttonsToActivate);
				};
				currentElementopacityTween.start();
				wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
				wc.interface.currentElement.elementType = wc.interface.elementTypes.chapter;
			};

			closeButton.onKeyPress = function () {
				if (wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_CloseDisplayLayer, { elementType: wc.interface.currentElement.elementType, data: null })) {
					currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
					currentElementopacityTween.onMotionFinished = function () {
						document.getElementById('LayerElementContainer').style.display = 'none';
						document.getElementById('CurrentElementContainer').style.display = '';
						layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
						layerElementopacityTween.start();
						//wc.interface.layerData.initialize();
						if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
							wc.interface.actionHandler.playAudio(true);
						else
							wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

						wc.interface.navigation.updateButtons(buttonsCurrentState.buttonsToEnable, buttonsCurrentState.buttonsToDisable, buttonsCurrentState.buttonsToHide, buttonsCurrentState.buttonsToActivate);
					};
					currentElementopacityTween.start();
					wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
					wc.interface.currentElement.elementType = wc.interface.elementTypes.chapter;
				}
				wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_CloseDisplayLayer, { elementType: wc.interface.currentElement.elementType, data: null });
			};
		}
		wc.interface.actionHandler.scrollToTop();
		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.1);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.1);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		//wc.interface.elements.term.resizeFont(true);
		wc.interface.currentElement.elementType = wc.interface.elementTypes.term;

	}
	else if (elementType == wc.interface.elementTypes.linkBulletin || elementType == wc.interface.elementTypes.popBulletin) {
		if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
			wc.interface.actionHandler.pauseAudio(false);
		else
			wc.mediaPlayer.stopCurrentActiveMedia(true);

		var templateHtml = wc.data.templateElements.linkBulletin;
		if (typeof (data.body) == 'undefined')
			data.body = '';
		if (typeof (data.name) == 'undefined')
			data.name = '';

		var linkBulletinTypeName = "";
		linkBulletinTypeName = wc.data.resources[wc.interface.linkBulletinTypes[data.variety].resourceName.toLowerCase()];

		templateHtml = templateHtml.replaceTag('Content', 'Image_Header', data.variety || '');
		templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Body', data.body || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Subhead', data.subhead || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Headline', data.headline || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Name', data.name || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_TypeName', linkBulletinTypeName || '');


		//AdiA - hack for IpdaFrame for do's and dont's - MS needed to add this back in because of ipadframe styles
		if (wc.interface.linkBulletinTypes.News.varietyCode != data.variety) {
			if (templateHtml.indexOf("dosAndDontsHeader_Container") >= 0) {
				templateHtml = templateHtml.replace('class = "newsLayout"', 'class = "newsLayout hideDiv"');
				templateHtml = templateHtml.replace('class="dosAndDontsHeader_Container hideDiv"', 'class="dosAndDontsHeader_Container"');
			}
		}

		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		// if link bulletin we need to show the link bulleting header
		if (elementType == wc.interface.elementTypes.linkBulletin) {
			var linkBulletinHeader = document.getElementById("LinkBulletin_Header");
			var popupBulletinHeader = document.getElementById("PopupBuletin_Header");
			if (isDefined(linkBulletinHeader) && isDefined(popupBulletinHeader)) {
				$(popupBulletinHeader).addClass('hiddenElement');
				$(linkBulletinHeader).removeClass('hiddenElement');
			}
		}

		if (isDefined(data.video)) {
			wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
			wc.mediaPlayer.video.videoParams.fileSrc = data.video.src;
			wc.mediaPlayer.video.videoParams.width = data.video.width;
			wc.mediaPlayer.video.videoParams.height = data.video.height;
			wc.mediaPlayer.video.videoParams.containerElementId = 'LinkBulletin_Video_Container';
			wc.mediaPlayer.video.play(wc.mediaPlayer.video.videoParams);
		}

		var illustrationElement = document.getElementById('LinkBulletin_Illustration_Content');
		if (typeof (data.illustration) != 'undefined') {
			if (isDefined(illustrationElement)) {
				wc.interface.elements.illustration.inject('LinkBulletin_Illustration_Content', data.illustration, true);
			} else {
				illustrationElement = $('.backgroundIllustrationContainer');
				if (illustrationElement.length > 0) {
					illustrationElement.css('background-image', 'url("' + wc.interface.dataFilePath + data.illustration.src + '")');
				}
			}
		} else {
			if (isDefined(illustrationElement)) {
				document.getElementById('LinkBulletin_Illustration_Content').innerHTML = '';
			}
		}

		var newsLayout = document.getElementById('newsLayout');
		if (/*elementType == wc.interface.elementTypes.linkBulletin &&*/data.variety == "News" && isDefined(newsLayout)) {
			newsLayout.style.display = '';
			if (isDefined(document.getElementById('whiteboardLinkBulletin'))) {
				document.getElementById('whiteboardLinkBulletin').style.marginTop = '0px';
			}
		}
		else if (isDefined(newsLayout)) {
			newsLayout.style.display = 'none';
		}

		if (isDefined(document.getElementById('whiteboardLinkBulletin'))) {
			//document.getElementById('whiteboardLinkBulletin').style.height = "328px";
			document.getElementById('whiteboardLinkBulletin').scrollTop = 0;
		}
		//layerElementContainer.style.position = 'absolute';

		if (!$(layerElementContainer).hasClass('dontReposition')) {
			if (document.all)	// IE
			{
				layerElementContainer.style.left = '0px';
			} else {
				layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
			}
			//layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
			layerElementContainer.style.top = document.getElementById('CurrentElementContainer').style.top;
		}

		wc.interface.actionHandler.scrollToTop();
		var closeButton = document.getElementById('Button_Close');
		if (typeof (closeButton) != 'undefined' && closeButton != null) {
			closeButton.onclick = function () {
				wc.mediaPlayer.stopCurrentActiveMedia();
				if (wc.interface.currentElement.elementType == wc.interface.elementTypes.popBulletin) {
					wc.interface.navigateToElement(wc.interface.directions.next);
				}
				else {
					var currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
					currentElementopacityTween.onMotionFinished = function () {
						document.getElementById('LayerElementContainer').style.display = 'none';
						document.getElementById('CurrentElementContainer').style.display = '';
						var layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
						layerElementopacityTween.start();
						wc.interface.currentElement.elementType = wc.interface.elementTypes.chapter;

						if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
							wc.interface.actionHandler.playAudio(true);
						else
							wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

						wc.interface.navigation.updateButtons(buttonsCurrentState.buttonsToEnable, buttonsCurrentState.buttonsToDisable, buttonsCurrentState.buttonsToHide, buttonsCurrentState.buttonsToActivate);
					};
					currentElementopacityTween.start();
					wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
				}
			};

			closeButton.onKeyPress = function () {
				wc.mediaPlayer.stopCurrentActiveMedia();

				if (wc.interface.currentElement.elementType == wc.interface.elementTypes.popBulletin) {
					wc.interface.navigateToElement(wc.interface.directions.next);
				}
				else {
					var currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
					currentElementopacityTween.onMotionFinished = function () {
						document.getElementById('LayerElementContainer').style.display = 'none';
						document.getElementById('CurrentElementContainer').style.display = '';
						var layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
						layerElementopacityTween.start();
						wc.interface.currentElement.elementType = wc.interface.elementTypes.chapter;

						if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
							wc.interface.actionHandler.playAudio(true);
						else
							wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

						wc.interface.navigation.updateButtons(buttonsCurrentState.buttonsToEnable, buttonsCurrentState.buttonsToDisable, buttonsCurrentState.buttonsToHide, buttonsCurrentState.buttonsToActivate);
					};
					currentElementopacityTween.start();
					wc.interface.currentElement.displayType = wc.interface.displayTypes.Container;
				}
			};
		}

		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();

			if (wc.interface.options.displayLayer.linkBulletin.textDisplay == wc.interface.animationOptions.textWriter) {
				var linkBulletinBodyContent = document.getElementById('LinkBulletin_Body_Content');
				var bodyText = linkBulletinBodyContent.innerHTML;
				//bodyTextTween = new Tween(new Object(), bodyText, Tween.regularEaseOut, 0, bodyText.length, 10);
				var bodyTextTween = new TextTween(linkBulletinBodyContent, 'innerHTML', bodyText, Tween.strongEaseOut, 2);
				//bodyTextTween.onMotionChanged = function (event) {
				//	linkBulletinBodyContent.innerHTML = bodyText.substr(0, event.target._pos);
				//};
				bodyTextTween.start();
			}
		};
		currentElementopacityTween.start();
		wc.interface.elements.resizeFont.reset();
		wc.interface.currentElement.elementType = elementType;
	}
	else if (elementType == wc.interface.elementTypes.popQuiz) {
		if (isDefined(wc.data.values.IsiPadFrame) && (wc.data.values.IsiPadFrame == 'True'))
			wc.interface.actionHandler.pauseAudio(false);
		else
			wc.mediaPlayer.stopCurrentActiveMedia(true);

		var templateHtml = wc.data.templateElements.popQuiz;
		if (typeof (data.introduction) == 'undefined')
			data.introduction = ''; //Deal wuith it

		templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].heading || '');
		templateHtml = templateHtml.replaceTag('Content', 'PopQuiz_Introduction', data.introduction || '');
		//templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Headline', data.headline || '');
		templateHtml = templateHtml.replaceTag('Content', 'quizHasVideo', isDefined(data.video) || '');
		templateHtml = templateHtml.replaceTag('Content', 'PopQuiz_Illustration', data.illustration || '');
		templateHtml = templateHtml.replaceTag('Content', 'ContinueResource', wc.interface.getResource('Continue'));
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');

		if (isDefined(data.video)) {
			//wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
			//wc.mediaPlayer.video.videoParams.fileSrc = data.video.src;
			//wc.mediaPlayer.video.videoParams.width = data.video.width;
			//wc.mediaPlayer.video.videoParams.height = data.video.height;
			//wc.mediaPlayer.video.videoParams.containerElementId = 'PopQuiz_Video_Container';
			templateHtml = templateHtml.replaceTag('Content', 'PopQuiz_Video_Transcript', data.video.transcript || '');
			if (isDefined(data.video.alternateText) && (data.video.alternateText != '')) {
				// set the alternate text heading text
				templateHtml = templateHtml.replaceTag('Content', 'PopQuiz_AlternateHeading', data.video.alternateText);
			}
			// add the tempalte to the dom
			layerElementContainer.innerHTML = templateHtml;

			//wc.interface.elements.popquiz.resizeFont(true);
			if (data.introduction == '') {
				wc.interface.actionHandler.popQuiz_ContinueFromIntroduction(true);
			}
		}
		else if (data.introduction == '') { //No video and no introduction, go straight to the question
			layerElementContainer.innerHTML = templateHtml;
			//Hide intro layer if exists
			var popQuiz_IntroFrame = document.getElementById("popQuiz_IntroFrame");
			if (isDefined(popQuiz_IntroFrame))
				popQuiz_IntroFrame.style.display = 'none';
			wc.interface.actionHandler.popQuiz_nextQuestion(0);
			//Display page, bc it is not displayed
		}
		else {
			layerElementContainer.innerHTML = templateHtml;
		}

		if (!$(layerElementContainer).hasClass('dontReposition')) {
			if (document.all)	// IE
			{
				layerElementContainer.style.left = '0px';
			} else {
				layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
			}
			layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;
		}

		wc.interface.actionHandler.scrollToTop();

		if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
			//transition
			// show the modal window
			$("<div/>").addClass("modal-overlay").width($(document).width()).height($(document).height()).appendTo("body").fadeTo("600", 0.7, function () {
				// after overlay animation complete.
				// show layer container and add css classove
				$("#LayerElementContainer").delay(300).slideDown(600);
				$("#LayerElementContainer").addClass("LayerElementContainerCustomized");
			});
		}
		else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
			// show the modal window
			$("<div/>").addClass("modal-overlay").width($(document).width()).height($(document).height()).appendTo("body").fadeTo("600", 0.7, function () {
				// after overlay animation complete.
				// show layer container and add css class
				$("#LayerElementContainer").addClass("LayerElementContainerCustomized");
				$("#LayerElementContainer").show('slide', { direction: 'left' }, 600);
			});
		}
		else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
			// show the modal window
			$("<div/>").addClass("modal-overlay").width($(document).width()).height($(document).height()).appendTo("body").fadeTo("600", 0.7, function () {
				// after overlay animation complete.
				// show layer container and add css class
				$("#LayerElementContainer").addClass("LayerElementContainerCustomized");
				$("#LayerElementContainer").show(600).addClass("zoom-step2", 600).removeClass("zoom-step2", 500).addClass("zoom-step3", 500).removeClass("zoom-step3", 500);

			});
		}
		else {
			//Hide main layer
			currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('CurrentElementContainer').style.display = 'none';
				document.getElementById('LayerElementContainer').style.display = '';
				layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.onMotionFinished = function () {
					$('#LayerElementContainer').find(">:first-child").addClass('popupAnimation');
				};
				layerElementopacityTween.start();

			};
			currentElementopacityTween.start();
		}

		wc.interface.currentElement.elementType = elementType;
	}
	else if (elementType == wc.interface.elementTypes.gameRestart) {
		var templateHtml = wc.data.templateElements.gameRestart;

		var percent = Math.round((wc.interface.game.questionsCorrectOnFirstTry * 100) / wc.interface.game.questionCounter);
		templateHtml = templateHtml.replace('{Content:MinimumPassingScore}', wc.data.jsonData.minimumPassingScore);
		templateHtml = templateHtml.replace('{Content:Percent}', percent);
		templateHtml = wc.interface.customNavigation.replaceTagsWithJavaScript(templateHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			wc.interface.actionHandler.scrollToTop();
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		wc.interface.currentElement.elementType = wc.interface.elementTypes.gameRestart;
	}

	wc.interface.currentElement.displayType = wc.interface.displayTypes.Layer;

	wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);
	wc.interface.applyScroll('#LayerElementContainer', true);

	wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_DisplayLayer, { elementType: elementType, data: data });

	return elementType;
};

wc.interface.displaySecondLayer = function(elementType) {
	wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_DisplaySecondLayer, { elementType: elementType });

	wc.interface.navigation.saveButtonsCurrentState();

	var buttonsToDisable = wc.interface.navigation.buttonTypes.All;
	var buttonsToEnable = wc.interface.navigation.buttonTypes.None;
	var buttonsToHide = wc.interface.navigation.buttonTypes.Pause;

	

	var layerElementContainer = document.getElementById('LayerElementContainer');
	var currentElementContainer = document.getElementById('CurrentElementContainer');
	var secondLayerElementContainer = document.getElementById('SecondLayerElementContainer');

	var templateHtml = '';
	if (elementType == wc.interface.elementTypes.help) {
		// load the html for the help section. Apply all the customization				
		templateHtml = wc.data.templateElements.help;
		var helpStrings = wc.data.resources.helptextjsengine.split('<br/>');	
		if (helpStrings.length == 9) {
			templateHtml = templateHtml.replaceTag('Content', 'Help_Index', helpStrings[0].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_Resize', helpStrings[1].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_Policy', helpStrings[2]).replace(/\\"/g, '"');
			templateHtml = templateHtml.replaceTag('Content', 'Help_Previous', helpStrings[4].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_Next', helpStrings[5].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_Play', helpStrings[6].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_FullText', helpStrings[7].replace(/\\"/g, '"'));
			templateHtml = templateHtml.replaceTag('Content', 'Help_Bullets', helpStrings[8].replace(/\\"/g, '"'));
		}
		//console.log(templateHtml);
	}
	else if (elementType == wc.interface.elementTypes.tableOfContents) {
		templateHtml = wc.data.templateElements.tableOfContents;
		var allItemsTemplate = "";
		for (var i = 0; i < wc.data.jsonData.chapters.length; i++) {
			//for (var i = 0; i < 3; i++) {
			var tmpItemTemplate = wc.data.templateElements.tableOfContents_Item;
			tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'Item_Id', i);
			tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'TableOfContents_Item_Text', wc.data.jsonData.chapters[i].heading);
			var clickFunction = "";
			var itemColor = "";
			var itemContentClass = "";
			if (i <= wc.interface.currentElement.chapterIndex || i < wc.lms.highestPage || i < wc.lms.highestBookmark) {
				clickFunction = 'wc.interface.elements.tableOfContents.select(' + i + ');';
				itemContentClass = "completed ";
				itemColor = "black";
			}
			else {
				clickFunction = 'return false;';
				itemColor = "#C4C4C4";
			}
			tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'Click_Function', clickFunction);
			tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'Item_Color', itemColor);
			tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'Item_ContentClass', itemContentClass);
			allItemsTemplate += tmpItemTemplate;
		}
		templateHtml = templateHtml.replaceTag('Content', 'TableOfContents_Items', allItemsTemplate);
	}
	else if (elementType == wc.interface.elementTypes.note) {
		templateHtml = wc.data.templateElements.note;
		var notes = '';		
		if (isDefined(wc.interface.storage.loadfromStorage(wc.lms.objInfo.aicc_sid)))
			notes = wc.interface.storage.loadfromStorage(wc.lms.objInfo.aicc_sid);
		templateHtml = templateHtml.replaceTag('Content', 'NotesText', notes);
	}
	else if (elementType == wc.interface.elementTypes.policy) {
		var descriptionText = wc.data.jsonData.description;
		var splittedDescription = descriptionText.split("*");
		templateHtml = wc.data.templateElements.policy;
		templateHtml = templateHtml.replaceTag('Content', 'Policy_Text', splittedDescription[splittedDescription.length - 1]);		
	}
	
	/* ######################################## */
	// hide the content or layer and show the secondLayer
	if (!$(secondLayerElementContainer).hasClass('dontReposition')) {
		if (document.all)	// IE
		{
			secondLayerElementContainer.style.left = '0px'; //?? why do we need this one for?
		} else {
			secondLayerElementContainer.style.left = wc.GetObjectBoundaries(currentElementContainer).right;
		}
		secondLayerElementContainer.style.top = wc.GetObjectBoundaries(currentElementContainer).top;
	}
	wc.interface.actionHandler.scrollToTop();
	
	var elementToHide = wc.interface.currentElement.displayType == wc.interface.displayTypes.Container ? currentElementContainer : layerElementContainer;
	var elementToHideOpacityTween = new OpacityTween(elementToHide, Tween.regularEaseOut, 100, 0, 0.2);
	elementToHideOpacityTween.onMotionFinished = function () {
		elementToHide.style.display = 'none';
		secondLayerElementContainer.style.display = '';
		secondLayerElementContainer.innerHTML = templateHtml;
		// apply iScrolls
		wc.interface.applyScroll(secondLayerElementContainer);
		// TODO: reset font sizes		
		var secondLayerElementOpacityTween = new OpacityTween(secondLayerElementContainer, Tween.regularEaseOut, 0, 100, 0.2);
		secondLayerElementOpacityTween.start();
	};	
	elementToHideOpacityTween.start();
	/* ######################################## */

	wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);
	wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_DisplaySecondLayer, { elementType: elementType });	
};

wc.interface.closeSecondLayer = function (elementType) {
	wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_CloseSecondLayer, { elementType: elementType });

	var layerElementContainer = document.getElementById('LayerElementContainer');
	var currentElementContainer = document.getElementById('CurrentElementContainer');
	var secondLayerElementContainer = document.getElementById('SecondLayerElementContainer');
	
	//secondLayerElementContainer.style.top = wc.GetObjectBoundaries(currentElementContainer).top;
	wc.interface.actionHandler.scrollToTop();

	var elementToShow = wc.interface.currentElement.displayType == wc.interface.displayTypes.Container ? currentElementContainer : layerElementContainer;
	var secondLayerOpacityTween = new OpacityTween(secondLayerElementContainer, Tween.regularEaseOut, 100, 0, 0.2);
	secondLayerOpacityTween.onMotionFinished = function () {
		elementToShow.style.display = 'none';
		elementToShow.style.display = '';				
		// TODO: reset font sizes		
		var elementToShowOpacityTween = new OpacityTween(elementToShow, Tween.regularEaseOut, 0, 100, 0.2);
		elementToShowOpacityTween.start();
	};
	secondLayerOpacityTween.start();
	/* ######################################## */

	wc.interface.navigation.restoreButtonsToSavedState();
	wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_CloseSecondLayer, { elementType: elementType });
};

wc.interface.navigateToElement = function (direction) {

	//TODO: add to the following if statement the next element after the chapters
	wc.interface.stopChapterTiming();
	//TODO: stop active media

	if (typeof (direction) == 'undefined') {
		direction = directions.next;
	}

	var nextChapterIndex = wc.interface.currentElement.chapterIndex;
	var nextElementType = wc.interface.currentElement.elementType;

	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.intro && direction == wc.interface.directions.next) {
		//Nothing to do at the moment
	}
	else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.intro && direction == wc.interface.directions.previous) {
		nextElementType = wc.interface.elementTypes.none;
		return;
		//At the moment there is nothing before intro so you cannot go back
	}
	else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.popBulletin || wc.interface.currentElement.elementType == wc.interface.elementTypes.popQuiz || wc.interface.currentElement.elementType == wc.interface.elementTypes.popQuestion || wc.interface.currentElement.elementType == wc.interface.elementTypes.linkBulletin || wc.interface.currentElement.elementType == wc.interface.elementTypes.term || wc.interface.currentElement.elementType == wc.interface.elementTypes.matchGame) {
		if (wc.interface.currentElement.chapterIndex >= wc.data.jsonData.chapters.length - 1) {
			nextElementType = wc.interface.navigateToElementAfterLastChapter();
		} else {
			nextChapterIndex = wc.interface.currentElement.chapterIndex + 1;
			nextElementType = wc.interface.elementTypes.chapter;
		}
	} else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.chapter || wc.interface.currentElement.elementType == wc.interface.elementTypes.intro) {
		if (typeof (wc.interface.currentElement.chapterIndex) != 'undefined') {
			if (direction == wc.interface.directions.previous) {
				if (wc.interface.currentElement.chapterIndex <= 0) {
					nextElementType = wc.interface.elementTypes.intro;
					nextChapterIndex = 0;
				} else {
					nextChapterIndex = wc.interface.currentElement.chapterIndex - 1;
					nextElementType = wc.interface.elementTypes.chapter;
				}
			} else {
				if (wc.interface.type == wc.interface.types.html) {

					var popQuestion = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuestion;
					var popQuiz = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz;
					var popBulletin = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popBulletin
					var matchGame = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].matchGame;

					var minimumTimeInSeconds = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].chapterOptions.minimumTimeSec || 0;
					var elapsedTimeInSeconds = function () {
						try {
							return ((wc.interface.getMyTime(new Date()) - wc.interface.beginTime.getTime()) / 1000);
						} catch (e) {
							return 0;
						}
					};

					if ((elapsedTimeInSeconds < minimumTimeInSeconds || minimumTimeInSeconds == 0) && typeof (popQuestion) != 'undefined') {
						wc.interface.actionHandler.displayQuizQuestion(popQuestion, wc.interface.elementTypes.popQuestion);
						debugController.debug('navigateToElement:popQuestion{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');
						return true;
					} else if ((elapsedTimeInSeconds < minimumTimeInSeconds || minimumTimeInSeconds == 0) && typeof (popQuiz) != 'undefined') {
						wc.interface.actionHandler.displayQuizQuestion(popQuiz, wc.interface.elementTypes.popQuiz);
						debugController.debug('navigateToElement:popQuestion{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');
						return true;
					} else if ((elapsedTimeInSeconds < minimumTimeInSeconds || minimumTimeInSeconds == 0) && typeof (popBulletin) != 'undefined') {
						wc.interface.actionHandler.displayPopBulletin();
						debugController.debug('navigateToElement:popBulletin{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');
						return true;
					} else if (isDefined(matchGame)) {
						wc.interface.actionHandler.displayMatchGame(matchGame, wc.interface.elementTypes.matchGame);
						debugController.debug('navigateToElement:matchGame{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');
						return true;
					} else {

						if (wc.interface.currentElement.chapterIndex >= wc.data.jsonData.chapters.length - 1) {
							nextElementType = wc.interface.navigateToElementAfterLastChapter();
						} else {
							nextChapterIndex = wc.interface.currentElement.chapterIndex + 1;
							nextElementType = wc.interface.elementTypes.chapter;
						}
					}
				} else {
					nextChapterIndex = wc.interface.currentElement.chapterIndex + 1;
					nextElementType = wc.interface.elementTypes.chapter;
				}
			}
		} else {
			//this should never happen
			debugController.debug('navigateToElement - chapter undefined');
			return;
		}
	}

	//debugController.debug('navigateToElement:{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');

	// report to lms
	if (wc.lms.doBookmarkUpdate) {
		if (!wc.lms.updateBookmark(name))
			return; // failed, don't continue with current navigation....
	} else {
		wc.lms.doBookmarkUpdate = true;
	}

	// save page values
	wc.lms.currentPage = parseInt(name);
	if (wc.lms.currentPage > wc.lms.highestPage) {
		wc.lms.highestPage = wc.lms.currentPage; // set the highest page visited (this is same as bookmark and needed when no LMS)
	}

	if (wc.interface.allowFlashInterface && wc.interface.type == wc.interface.types.flash) {
		//loadFlashFile();
		return wc.flashInterface.load(nextChapterIndex);
	} else {
		if (nextElementType == wc.interface.elementTypes.chapter)
			wc.interface.replaceCurrentElement(nextElementType, nextChapterIndex);
	}
};

wc.interface.navigateToElementAfterLastChapter = function () {
	//returns element type
	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
		var minimumPassingScore = wc.data.jsonData.minimumPassingScore;
		if (isDefined(minimumPassingScore))
		{
			if(minimumPassingScore>0) 
			{
				var percent = (wc.interface.game.questionsCorrectOnFirstTry*100)/ wc.interface.game.questionCounter;
				if (percent<minimumPassingScore)
				{
					return wc.interface.actionHandler.displayGameRestart();					
				}
			}
		}
		return wc.interface.actionHandler.displayCertificate();
	}

	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.chapter || wc.interface.currentElement.elementType == wc.interface.elementTypes.popQuiz || wc.interface.currentElement.elementType == wc.interface.elementTypes.popBulletin) {
		if (typeof (wc.data.jsonData.acknowledgment) != 'undefined')
			return wc.interface.actionHandler.displayAcknowledgment(wc.data.jsonData.acknowledgment);
		else if (typeof (wc.data.jsonData.quiz) != 'undefined' && typeof (wc.data.jsonData.quiz.games) != 'undefined' && wc.data.jsonData.quiz.games.length > 0)
			return wc.interface.actionHandler.displayGameChoice();
	}

	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.acknowledgment) {
		if (typeof (wc.data.jsonData.quiz) != 'undefined' && typeof (wc.data.jsonData.quiz.games) != 'undefined' && wc.data.jsonData.quiz.games.length > 0)
			return wc.interface.actionHandler.displayGameChoice();
	}

	return wc.interface.actionHandler.displayCertificate();

	//if (typeof(wc.data.jsonData.finalQuizQuestion) != 'undefined')
	//	return wc.interface.actionHandler.displayQuizQuestion(wc.data.jsonData.finalQuizQuestion, wc.interface.elementTypes.finalQuizQuestion);
	//if (typeof(wc.data.jsonData.certificate) != 'undefined')

	//if (typeof(wc.data.jsonData.acknowledgment) != 'undefined')
	//	return wc.interface.actionHandler.displayAcknowledgment(wc.data.jsonData.acknowledgment);
};

wc.interface.resourceParser = function (html) {
	//TODO: strip out resource request tags and replace with values
	return html;
};

wc.interface.elements = {
	intro:
	{
		display: function () {
			var descriptions = wc.data.jsonData.description.split('*');
			if (wc.data.templateElements.intro_Animation != "" && wc.data.jsonData.description != "" && descriptions.length > 1) {
				var currentElementContainer = document.getElementById('CurrentElementContainer');
				var layerElementContainer = document.getElementById('LayerElementContainer');
				var firstList = "", secondList = "";
				for (i = 0; i < descriptions.length - 1; i++) {
					var tmpItemTemplate = wc.data.templateElements.intro_Animation_Element;
					tmpItemTemplate = tmpItemTemplate.replaceTag('Content', 'Chapter_Description', descriptions[i]);
					if (i % 2 == 0)
						firstList += tmpItemTemplate;
					else
						secondList += tmpItemTemplate;
				}
				var template = wc.data.templateElements.intro_Animation;
				template = template.replaceTag('Content', 'First_List', firstList);
				template = template.replaceTag('Content', 'Second_List', secondList);
				currentElementContainer.innerHTML = template;

				if (layerElementContainer.style.display != 'none') {
					currentElementopacityTween = new OpacityTween(layerElementContainer, Tween.regularEaseOut, 100, 0, 0.2);
					currentElementopacityTween.onMotionFinished = function () {
						layerElementContainer.style.display = 'none';
						currentElementContainer.style.display = '';
						layerElementopacityTween = new OpacityTween(currentElementContainer, Tween.regularEaseOut, 0, 100, 0.2);
						layerElementopacityTween.start();
					};
					currentElementopacityTween.start();
				}
				wc.interface.currentElement.elementType = wc.interface.elementTypes.intro;
				this.startCannvas('tagcanvas', 'taglist');
			}
		},
		startCannvas: function (canvasId, elementsId) {
			TagCanvas.textFont = 'Open Sans,  sans-serif, Trebuchet MS, Helvetica, Arial';
			TagCanvas.textColour = '#00f';
			TagCanvas.textHeight = 25;
			TagCanvas.outlineColour = '#ff9999';
			TagCanvas.maxSpeed = 0.03;
			TagCanvas.minBrightness = 0.2;
			TagCanvas.depth = 0.92;
			TagCanvas.pulsateTo = 0.6;
			TagCanvas.initial = [0.1, -0.1];
			TagCanvas.decel = 0.98;
			TagCanvas.reverse = true;
			TagCanvas.hideTags = false;
			TagCanvas.shadow = '#ccf';
			TagCanvas.shadowBlur = 3;
			TagCanvas.weight = false;
			TagCanvas.imageScale = null;
			try {
				TagCanvas.Start(canvasId, elementsId);
				//Start course after 10 seconds
				setTimeout(function () { wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, 0) }, 10000);
			} catch (e) {
				setTimeout(function () { wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, 0) }, 1);
			}
		}
	},
	policy:
	{
		buttonId: 'Button_Policy',
		display: function () {
			wc.interface.displaySecondLayer(wc.interface.elementTypes.policy);
		},
		close: function () {
			wc.interface.closeSecondLayer();
		}
	},
	help:
	{
		buttonId: 'Button_Help',
		display: function () {
			wc.interface.displaySecondLayer(wc.interface.elementTypes.help);
		},
		close: function () {
			wc.interface.closeSecondLayer();
		}
	},
	tableOfContents:
	{
		buttonId: 'Button_Index',
		selectedOption: -1,
		select: function (option) {
			this.selectedOption = option;
			wc.interface.generalDisplayMethods.selectListItem("mediaBullet_toc_", option);
			var gotoChapterButton = document.getElementById("tableOfContentsDone");
			var name = gotoChapterButton.className;
			if (name.indexOf("continueButton") > -1)
				gotoChapterButton.className = name.replace("disabled", "");
			else
				gotoChapterButton.style.backgroundImage = "url('/wc2/images/training/iPadFrame/buletin_blue_button.png')";
		},
		executeSelectedOption: function () {
			if (this.selectedOption != -1) {
				wc.interface.currentElement.chapterIndex = this.selectedOption;
				//wc.interface.generalDisplayMethods.hideLayerAndShowCurrentElement();
				this.close();
				wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, this.selectedOption);
			}
		},
		display: function () {
			wc.interface.displaySecondLayer(wc.interface.elementTypes.tableOfContents);
		},
		close: function () {
			wc.interface.closeSecondLayer();
		}
	},
	notes:
	{
		buttonId: 'Button_Note',
		display: function () {
			wc.interface.displaySecondLayer(wc.interface.elementTypes.note);
		},
		saveAndClose: function () {
			//Save note
			var textToSave = document.getElementById("notesTextArea").value;
			wc.interface.storage.saveToStorage(wc.lms.objInfo.aicc_sid, textToSave);
			wc.interface.closeSecondLayer();
		},
		sendMail: function () {
			window.open("mailto:?subject=" + wc.data.values.courseName + "Notes&body=" + document.getElementById("notesTextArea").value);
		}
	},
	resizeFont: {
		buttonId: 'Button_ResizeFont',
		fontSizeIncrement: 2,
		currentStep: 0,
		maxSteps: 4,
		resize: function () {
			wc.interface.elements.resizeFont.currentStep++;
			var increment = wc.interface.elements.resizeFont.fontSizeIncrement;
			if (wc.interface.elements.resizeFont.currentStep >= wc.interface.elements.resizeFont.maxSteps) {
				increment = (-1) * (wc.interface.elements.resizeFont.maxSteps - 1) * wc.interface.elements.resizeFont.fontSizeIncrement;
				wc.interface.elements.resizeFont.currentStep = 0;
			}

			var currentFontSize = parseInt($('body').css('font-size').replace('px', ''));
			currentFontSize += increment;
			$('body').css("font-size", currentFontSize + 'px');
			wc.interface.resizeScrolls();
			// FIXME: refresh all iScrolls			
		},

		reset: function () {

			var increment = wc.interface.elements.resizeFont.fontSizeIncrement;
			if (wc.interface.elements.resizeFont.currentStep >= wc.interface.elements.resizeFont.maxSteps) {
				increment = (-1) * (wc.interface.elements.resizeFont.maxSteps - 1) * wc.interface.elements.resizeFont.fontSizeIncrement;
				wc.interface.elements.resizeFont.currentStep = 0;
			}

			var currentFontSize = parseInt($('body').css('font-size').replace('px', ''));
			currentFontSize -= increment * wc.interface.elements.resizeFont.currentStep;
			$('body').css("font-size", currentFontSize + 'px');
			wc.interface.elements.resizeFont.currentStep = 0;
		}
	},
	quiz:
	{
		selectedChoiceIndex: -1,
		selectedElementType: -1,
		selectAnswer: function (choiceIndex, elementType) {
			wc.interface.generalDisplayMethods.selectListItem("mediaBullet_", choiceIndex);
			wc.interface.elements.quiz.selectedChoiceIndex = choiceIndex;
			wc.interface.elements.quiz.selectedElementType = elementType;
			var continueButton = document.getElementById("Button_Continue");
			if (!isDefined(continueButton)) {
				continueButton = document.getElementById('BookmarkBeginButton');
			}
			if (isDefined(continueButton)) {
				//$(Button_Continue).style.backgroundImage = "url('/wc2/images/training/iPadFrame/buletin_blue_button.png')";
				$(continueButton).removeClass('disabled');
				wc.interface.actionHandler.helpers.restoreDefaultFunctionality(continueButton);
			}
		},
		executeSelectedOption: function () {
			if (this.selectedOption != -1) {
				wc.interface.actionHandler.displayGameIntro(wc.interface.elements.quiz.selectedChoiceIndex);
				wc.interface.elements.quiz.clearSelection();
			}
		},
		clearSelection: function () {
			wc.interface.elements.quiz.selectedChoiceIndex = -1;
			wc.interface.elements.quiz.selectedElementType = -1;
		}
	},
	fullTextButton:
	{
		buttonId: 'Button_DisableBullets',
		isActive: false,
		activate: function () {
			var disableBulletsButton = document.getElementById('Button_DisableBullets');
			if (!isDefined(disableBulletsButton))
				return;

			$(disableBulletsButton).removeClass('disabled');

			wc.interface.actionHandler.helpers.restoreDefaultFunctionality(disableBulletsButton);
			this.isActive = true;
		}
	},
	audioSpeechButton:
	{
		isAudioOn: false,
		toggleAudioSpeech: function () {
			var buttonsToEnable = wc.interface.navigation.buttonTypes.None;
			var buttonsToDisable = wc.interface.navigation.buttonTypes.None;
			var buttonsToHide = wc.interface.navigation.buttonTypes.None;
			var buttonsToActivate = wc.interface.navigation.buttonTypes.None;

			if (wc.interface.elements.audioSpeechButton.isAudioOn) {
				wc.interface.actionHandler.pauseAudio();
				wc.interface.actionHandler.disableBullets();
				buttonsToEnable = wc.interface.navigation.buttonTypes.Audio;
				buttonsToDisable = wc.interface.navigation.buttonTypes.Play;
				wc.interface.elements.audioSpeechButton.isAudioOn = false;
			} else {
				wc.interface.actionHandler.enableBullets();
				wc.interface.elements.audioSpeechButton.isAudioOn = true;
				buttonsToActivate = wc.interface.navigation.buttonTypes.Audio;
				buttonsToEnable = wc.interface.navigation.buttonTypes.Play;
			}

			wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide, buttonsToActivate);
		}
	},
	bulletsButton:
	{
		buttonId: 'Button_EnableBullets',
		isActive: false,
		activate: function () {
			var enableBulletsButton = document.getElementById('Button_EnableBullets');
			if (!isDefined(enableBulletsButton))
				return;

			$(enableBulletsButton).removeClass('disabled');
			wc.interface.actionHandler.helpers.restoreDefaultFunctionality(enableBulletsButton);
			enableBulletsButton.disabled = false;
			this.isActive = true;
		}
	},
	playButton:
	{
		buttonId: 'Button_PlayAudio',
		isVisible: true
	},
	pauseButton:
	{
		buttonId: 'Button_PauseAudio',
		isVisible: true
	},
	illustration: {
		inject: function (id, illustration, emptyContainer) {
			var illustrationContainer = document.getElementById(id);
			if (!isDefined(illustrationContainer))
				return;
			if (!isDefined(illustration)) {
				illustrationContainer.innerHTML = '';
				return;
			}
			if (emptyContainer)
				illustrationContainer.innerHTML = '';

			if (illustration.variety == 'application/x-shockwave-flash') {
				var flashvars = {};
				var params = {};
				var attributes = {}; // e.g id
				swfobject.embedSWF(wc.interface.dataFilePath + illustration.src, id, illustration.width, illustration.height, '6', false, flashvars, params, attributes);
			}
			else {
			//	illustrationContainer.innerHTML = '<img src="' + wc.interface.dataFilePath + illustration.src + '" width="' + illustration.width + '" height="' + illustration.height + '" />';

				illustrationContainer.innerHTML = '<img src="' + wc.interface.dataFilePath + illustration.src + '" style="max-width:100%;max-height:100%;" />';			}
		}
	},
	nextButton: {
		buttonId: 'Button_Next'
	},
	previousButton: {
		buttonId: 'Button_Previous'
	},
	survey: {
		hasAnsweredQuestions: false,
		responses: {},
		setResponseValue: function (id, choice, response) {

			wc.interface.elements.survey.hasAnsweredQuestions = true;
			if (!isDefined(wc.interface.elements.survey.responses[id])) {
				wc.interface.elements.survey.responses[id] = {};
			}
			if (isDefined(choice))
				wc.interface.elements.survey.responses[id].choice = choice;
			if (isDefined(response))
				wc.interface.elements.survey.responses[id].response = response;
		},
		setResponse: function (id, choices, choiceIndex, responseValue) {
			//alert(id + "|" + choices + "|" + choiceIndex + "|" + responseValue + "|" + choices[choiceIndex]);
			wc.interface.elements.survey.hasAnsweredQuestions = true;
			if (!isDefined(wc.interface.elements.survey.responses[id])) {
				wc.interface.elements.survey.responses[id] = {};
			}

			if (!isDefined(responseValue) && isDefined(choices)) {
				if (wc.isArray(choiceIndex)) {
					responseValue = '';
					for (var arrayIndex in choiceIndex) {
						responseValue += choices[choiceIndex[arrayIndex]].body + '|';
					}
					responseValue = responseValue.substr(responseValue.length - 1, 1);

				} else {
					try {
						choiceIndex = parseInt(choiceIndex);
					} catch (ex) {
					}
					responseValue = choices[choiceIndex].body;
				}
			}

			if (isDefined(responseValue)) {

				try {
					responseValue = responseValue.replace(/<\/?[^>]+(>|$)/g, ""); // remove all tags	
				} catch (e) {
				}

				wc.interface.elements.survey.responses[id].response = responseValue;
			}
			if (isDefined(choiceIndex))
				wc.interface.elements.survey.responses[id].choice = choiceIndex;

		},
		surveyUrl: function () {
			if (wc.lms.objInfo != null) {
				var surveyurl = "";
				var aid = wc.lms.objInfo.student_id;
				var sid = wc.lms.objInfo.aicc_sid;
				var pid = wc.request.queryString("programid");
				var str = document.location.pathname;
				var n = str.lastIndexOf("/");
				if (n > 0) {
					n = str.lastIndexOf("/", n - 1);
					if (n > 0) {
						surveyurl = str.substring(0, n + 1) + "training/surveyanswers.aspx";
					}
				}

				if (surveyurl == "") {
					alert("Something is wrong getting the SurveyUrl");
				} else {
					surveyurl += "?sid=";
					surveyurl += sid;
					surveyurl += "&pid=";
					surveyurl += pid;
					surveyurl += "&aid=";
					surveyurl += aid;
				}

				//				alert(surveyurl);
				return surveyurl;
			}
		},
		adjustSurveyResponse: function (responseIn) {
			var i;
			var outStr = "";
			//make sure it is not an number but an int
			responseIn = responseIn.toString();

			// replace all less than signs
			var arrParams = responseIn.split("&lt;");

			for (i = 0; i < arrParams.length; i++) {
				outStr += arrParams[i];

				if (i < (arrParams.length - 1))
					outStr += "&amp;lt;";
			}

			// replace all greater than signs
			arrParams = outStr.split("&gt;");

			for (i = 0; i < arrParams.length; i++) {
				if (0 == i)
					outStr = "";

				outStr += arrParams[i];

				if (i < (arrParams.length - 1))
					outStr += "&amp;gt;";
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
	},
	mediaBullets: {

		mediaBulletIndex: 0, // this is used for the recursive function to generate consecutive numbers

		currentDisplayMode: wc.interface.mediaBulletinsDisplayTypes.none,

		hasBullets: function (pithyQuote) {
			var regex = new RegExp(/<Bullet (.*?)>(.*?)<\/Bullet>/g);
			var bulletMatches = regex.exec(pithyQuote);

			return bulletMatches != null && bulletMatches.length > 0;
		},

		getCuepointsForFlowPlayer: function (pithyQuote) {
			//console.log('getCuepointsForFlowPlayer');
			wc.mediaPlayer.logs.push('Attaching cuepoints for flow player');
			var cuepoints = [];
			var cuepointsElements = [];

			var mediaBullets = wc.interface.elements.mediaBullets.parse(pithyQuote);

			if (wc.interface.doBullets && isDefined(mediaBullets) && isDefined(mediaBullets.allBullets) && (mediaBullets.allBullets.length > 0)) {
				for (var i = 0; i < mediaBullets.allBullets.length; i++) {
					var cuePoint = {};
					cuePoint.time = parseFloat(mediaBullets.allBullets[i].time) * 1000;
					cuePoint.size = mediaBullets.allBullets[i].size;
					cuePoint.content = mediaBullets.allBullets[i].content;
					cuePoint.index = i;
					cuepointsElements.push(cuePoint);
				}
			}
			cuepoints.push(cuepointsElements);
			cuepoints.push(wc.interface.elements.mediaBullets.showCuepoint);

			//console.log(cuepoints);
			return cuepoints;
		},

		getCuepointsForHtml5Player: function (pithyQuote) {
			//console.log('getCuepointsForHtml5Player');
			var cuepoints = [];
			var cuepointsElements = [];

			var mediaBullets = wc.interface.elements.mediaBullets.parse(pithyQuote);

			if (wc.interface.doBullets && isDefined(mediaBullets) && isDefined(mediaBullets.allBullets) && (mediaBullets.allBullets.length > 0)) {
				for (var i = 0; i < mediaBullets.allBullets.length; i++) {
					var cuePoint = {};

					cuePoint.time = parseFloat(mediaBullets.allBullets[i].time);
					cuePoint.size = mediaBullets.allBullets[i].size;
					cuePoint.content = mediaBullets.allBullets[i].content;
					cuePoint.index = i;
					cuepointsElements.push(cuePoint);
				}
			}
			cuepoints.push(cuepointsElements);
			cuepoints.push(wc.interface.elements.mediaBullets.showCuepoint);

			return cuepoints;
		},
		parse: function (pithyQuote) {

			// assume that there is no content available
			var mediaBullets = null;

//deal with old-style bullets 
//alert("pithyquote " + pithyQuote);
			if (pithyQuote.indexOf("<\/li>") > 0 ) {
				// has list items, don't need to do anything
			} else {
//alert("replacing");
pithyQuote = pithyQuote.replace(/<Bullet /g, '<li><Bullet ');

pithyQuote = pithyQuote.replace(/<\/Bullet>/g, '<\/Bullet><\/li>');	

pithyQuote = pithyQuote.replace(/<BulletList /g, '<ul><BulletList ');

pithyQuote = pithyQuote.replace(/<\/BulletList>/g, '<\/BulletList><\/ul>');				
			}
//alert("done pithyquote " + pithyQuote);

			if (typeof (pithyQuote) != 'undefined' && pithyQuote.length > 0) {
			var xmlDoc = wc.tools.getStringAsXmlDoc(pithyQuote);
			}
//alert("check");
			if (typeof (xmlDoc) != 'undefined' && xmlDoc.childNodes.length > 0) {
				var bulletsNode = xmlDoc.childNodes[0];

				// parse the media bullets attributes	
				mediaBullets = {};
				mediaBullets.leftMargin = wc.tools.getXmlAttributeValue(bulletsNode, "leftMargin");
				mediaBullets.topMargin = wc.tools.getXmlAttributeValue(bulletsNode, "topMargin");
				mediaBullets.bulletToolVersion = wc.tools.getXmlAttributeValue(bulletsNode, "bulletToolVersion");


				mediaBullets.allBullets = [];

				// skip all the childnodes till we get toa bulletlist
				while (bulletsNode.childNodes.length > 0 && (bulletsNode.childNodes[0].nodeName.toLowerCase()) != 'bulletlist') {
					bulletsNode = bulletsNode.childNodes[0];
				}

				// parse the bullets list
				mediaBullets.bulletsList = wc.interface.elements.mediaBullets.parseBulletList(bulletsNode.childNodes[0], null, mediaBullets);
			}

			return mediaBullets;
		},

		parseBulletList: function (xmlNode, bulletinList, mediaBullets) {

			try {
			// make sure the bullet list has child nodes
			if (typeof (xmlNode) != 'undefined' && xmlNode.childNodes.length > 0) {
				// create a new list of bullets
				bulletinList = [];
				bulletinList.vertSpace = xmlNode.getAttribute('vertSpace');
				bulletinList.level = xmlNode.getAttribute('level');
				bulletinList.type = xmlNode.getAttribute('type');

				// parse all child nodes
				for (var nodeIndex = 0; nodeIndex < xmlNode.childNodes.length; nodeIndex++) {
					// make sure to skip all the nodes that are not either a bullet list or a bullet				
					var childNode = xmlNode.childNodes[nodeIndex];

					while (childNode.childNodes.length > 0 && !(childNode.nodeName.toLowerCase() == 'bulletlist' || childNode.nodeName.toLowerCase() == 'bullet')) {
						childNode = childNode.childNodes[0];
					}

					if (childNode.nodeName.toLowerCase() == 'bullet') {
						var bullet = {};
						bullet.size = childNode.getAttribute('size');
						bullet.time = childNode.getAttribute('time');
						bullet.color = childNode.getAttribute('color');

						try {
							var tmp = document.createElement("div");
							tmp.appendChild(childNode);
							bullet.content = tmp.innerHTML;
						}
						catch (ex) {
							bullet.content = childNode.text || childNode.firstChild.textContent || childNode.firstChild.innerText || childNode.firstChild.nodeValue || childNode.firstChild.text;
						}


						bulletinList.push(bullet);
						mediaBullets.allBullets.push(bullet);
					} else if (childNode.nodeName.toLowerCase() == 'bulletlist') {
						bulletinList.push(wc.interface.elements.mediaBullets.parseBulletList(childNode, bulletinList, mediaBullets));
					}
				}
			}
			} catch (ex) {
			}
			return bulletinList;
		},

		oldparse: function (pithyQuote) {

			// replace the terms
			pithyQuote = pithyQuote.replace(/<a href="term:([0-9]+)">/g, '<a href="javascript:;" id="Term_$1" onclick="wc.interface.actionHandler.displayTerm($1);">');
			pithyQuote = wc.interface.customNavigation.replaceTagsWithJavaScript(pithyQuote);

			// assume that there is no content available
			var mediaBullets = null;
			// make sure there are bullets	
			var regEx = new RegExp(/<Bullets (.*?)>(.*?)<\/Bullets>/g);
			//var bulletsMatches = pithyQuote.match(regEx);                        
			var bulletsMatches = regEx.exec(pithyQuote);

			if (bulletsMatches != null && bulletsMatches.length > 1) {
				// NOTE: the "exec" function returns an array where the first element is the actual string we searched in. 
				//       The groups start from possition 1, not from 0!

				// parse the media pullets attributes
				var mediaBulletinAttributes = bulletsMatches[1];
				mediaBullets = {};
				mediaBullets.leftMargin = wc.tools.getAttributeValue(mediaBulletinAttributes, 'leftMargin');
				mediaBullets.topMargin = wc.tools.getAttributeValue(mediaBulletinAttributes, 'topMargin');
				mediaBullets.bulletToolVersion = wc.tools.getAttributeValue(mediaBulletinAttributes, 'bulletToolVersion');

				// parse all the bullet lists
				var bulletListContent = bulletsMatches[2];

				mediaBullets.allBullets = [];
				mediaBullets.bulletsList = wc.interface.elements.mediaBullets.parseBulletList(bulletListContent, null, mediaBullets);
			}
			//console.log(mediaBullets);
			return mediaBullets;
		},

		oldparseBulletList: function (bulletListHtml, bulletinList, mediaBullets) {

			//console.log(bulletListHtml);

			// build the regex to extract the bullet list
			var regEx = new RegExp(/<BulletList (.*?)>(.*)<\/BulletList>/g);
			var bulletListMatches = regEx.exec(bulletListHtml);
			// console.log(bulletListMatches);

			if (bulletListMatches != null && bulletListMatches.length > 1) {
				// parse the bullet list attributes
				var bulletListAttributes = bulletListMatches[1];
				//console.log(bulletListAttributes);
				bulletinList = [];
				bulletinList.vertSpace = wc.tools.getAttributeValue(bulletListAttributes, 'vertSpace');
				bulletinList.level = wc.tools.getAttributeValue(bulletListAttributes, 'level');
				bulletinList.type = wc.tools.getAttributeValue(bulletListAttributes, 'type');

				// parse the bullets
				var bulletsHtml = bulletListMatches[2];
				// console.log(bulletsHtml);
				//regEx = new RegExp(/(<(BulletList|Bullet)(.*?)>(.*?)<\/\2>)/g);
				regEx = new RegExp(/(<(BulletList) (.*?)>(.*)<\/BulletList>|<(Bullet) (.*?)>(.*?)<\/Bullet>)/g);

				var bulletsMatches;
				while ((bulletsMatches = regEx.exec(bulletsHtml)) != null) {
					if (bulletsMatches.length > 1) {
						//console.log(bulletsMatches);
						if (bulletsMatches.length > 1) {
							// check what type of item is it? is it a simple bullet or is it a bullet list?
							//console.log(bulletsMatches[2]);
							//var bulletType = bulletsMatches[2];
							var bulletType = bulletsMatches[2] || bulletsMatches[5];
							if (bulletType == 'Bullet') {
								var bullet = {};
								var bulletAttributes = bulletsMatches[6];
								bullet.size = wc.tools.getAttributeValue(bulletAttributes, 'size');
								bullet.time = wc.tools.getAttributeValue(bulletAttributes, 'time');
								bullet.color = wc.tools.getAttributeValue(bulletAttributes, 'color');
								bullet.content = bulletsMatches[7];
								bulletinList.push(bullet);
								mediaBullets.allBullets.push(bullet);
							} else if (bulletType == 'BulletList') {
								bulletinList.push(wc.interface.elements.mediaBullets.parseBulletList(bulletsMatches[1], bulletinList, mediaBullets));
							}
						}
					}
				}
			}
			//console.log(bulletinList);
			return bulletinList;
		},

		render: function (pithyQuote) {
			var mediaBullets = wc.interface.elements.mediaBullets.parse(pithyQuote);
			// create the wrapper and apply the left and top margin
			var mediaBulletinsWrapperTemplate = wc.data.templateElements.mediaBulletinsWrapper;


			// add the left margin if needed
			if (mediaBullets.leftMargin == null) {
				mediaBullets.leftMargin = 0;
			}
			// add the top margin if needed
			if (mediaBullets.topMargin == null) {
				mediaBullets.topMargin = 0;
			}
			mediaBulletinsWrapperTemplate = mediaBulletinsWrapperTemplate.replaceTag('Content', 'MarginLeft', mediaBullets.leftMargin);
			mediaBulletinsWrapperTemplate = mediaBulletinsWrapperTemplate.replaceTag('Content', 'MarginTop', mediaBullets.topMargin);
			wc.interface.elements.mediaBullets.mediaBulletIndex = 0;
			mediaBulletinsWrapperTemplate = mediaBulletinsWrapperTemplate.replaceTag('Content', 'BulletListContent', wc.interface.elements.mediaBullets.renderBulletList(mediaBullets.bulletsList));
			return mediaBulletinsWrapperTemplate;
		},

		renderBulletList: function (bulletList) {

			// decide what type of wrapper we will have for the list (ordered / unordered)
			var bulletListElementTemplate = bulletList.type == 'ordered' ? wc.data.templateElements.mediaBulletinsOrderedList : wc.data.templateElements.mediaBulletinsUnorderedList;

			// add the needed styles
			if (bulletList.level == null) {
				bulletList.level = 0;
			}
			if (bulletList.vertSpace == null) {
				bulletList.vertSpace = 1;
			}
			// add the vertical space and level
			bulletListElementTemplate = bulletListElementTemplate.replaceTag('Content', 'Level', bulletList.level);
			bulletListElementTemplate = bulletListElementTemplate.replaceTag('Content', 'VertSpace', bulletList.vertSpace);

			var bulletListContent = '';
			for (var bulletIndex = 0; bulletIndex < bulletList.length; bulletIndex++) {
				var listItemElementTemplate = '';
				// check to see if it's just a bullet or another bullet list
				if (bulletList[bulletIndex] instanceof Array) {
					listItemElementTemplate = wc.data.templateElements.mediaBulletinsSublistWrapper;
					//listItemElementTemplate = listItemElementTemplate.replaceTag('', );
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'Level', bulletList[bulletIndex].level);
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'BulletListContent', wc.interface.elements.mediaBullets.renderBulletList(bulletList[bulletIndex], wc.interface.elements.mediaBullets.mediaBulletIndex));


				} else {
					// get the template
					listItemElementTemplate = wc.data.templateElements.mediaBulletinsListItem;
					// replace the values
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'BulletIndex', wc.interface.elements.mediaBullets.mediaBulletIndex);
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'VertSpace', bulletList.vertSpace);
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'Level', bulletList.level);
					listItemElementTemplate = listItemElementTemplate.replaceTag('Content', 'BulletContent', bulletList[bulletIndex].content);
					wc.interface.elements.mediaBullets.mediaBulletIndex++;
				}

				// add the item to the list
				bulletListContent += listItemElementTemplate;
			}

			bulletListElementTemplate = bulletListElementTemplate.replaceTag('Content', 'BulletListItems', bulletListContent);
			return bulletListElementTemplate;
		},

		showCuepoint: function (clip, cuepoint) {

			//console.log('showCuepoint');
			//console.log(cuepoint);

			// if there was a previous active bullet, remove its 'active' class
			if (cuepoint.index > 0) {
				var previousBullet = document.getElementById('mediaBullet' + (cuepoint.index - 1));
				previousBullet.className = previousBullet.className.replace(/(?:^|\s)active(?!\S)/, '');
				//	$('#mediaBullet' + (cuepoint.index - 1)).animate({ fontSize: '16px' }, 650);
			} else {
				//First bullet, make sure it is displayed
				if (wc.interface.doBullets && wc.interface.showBullets) {
					wc.interface.actionHandler.enableBullets();
					//wc.interface.elements.mediaBullets.toggleMainDiscussion(wc.interface.);
				}
			}
			// remove the 'hidden' class from the current element
			var mediaBullet = document.getElementById('mediaBullet' + cuepoint.index);
			mediaBullet.className = mediaBullet.className.replace(/(?:^|\s)hidden(?!\S)/, '');
			//$('#mediaBullet' + (cuepoint.index)).animate({ opacity: 1 }, 2000);
			//TODO: zoom in new one
		},

		resetActive: function () {
			// if there is any bullets list, remove the 'active' class from all the li's
			var listHtmlElement = document.getElementById('Chapter_Discussion_Content_MediaBulletsList');
			if (isDefined(listHtmlElement)) {
				for (var listIndex in listHtmlElement.childNodes) {
					try {
						listHtmlElement.childNodes[listIndex].className = listHtmlElement.childNodes[listIndex].className.replace(/(?:^|\s)active(?!\S)/, '');
					}
					catch (e) {

					}
				}
				//console.log(listHtmlElement.childNodes);
			}
			// reset active for new bulleting (probably don't need previous code, but will leave it for now)
			var bulletindex = 0;
			var listelement = document.getElementById('mediaBullet' + bulletindex);
			while (isDefined(listelement)) {
				listelement.className = listelement.className.replace(/(?:^|\s)active(?!\S)/, '');
				bulletindex = bulletindex + 1;
				listelement = document.getElementById('mediaBullet' + bulletindex);
			}
		},

		toggleMainDiscussionOff: function () {
			var discussionContent = document.getElementById('Chapter_Discussion_Content');
			var mediaBulletins = document.getElementById('Chapter_Discussion_MediaBulletins');
			if (isDefined(discussionContent) && isDefined(mediaBulletins) && wc.interface.elements.mediaBullets.currentDisplayMode == 1) {
				discussionContent.style.display = 'none';
				mediaBulletins.style.display = '';
			}
		},

		toggleMainDiscussionOn: function () {
			var discussionContent = document.getElementById('Chapter_Discussion_Content');
			var mediaBulletins = document.getElementById('Chapter_Discussion_MediaBulletins');
			if (isDefined(discussionContent) && isDefined(mediaBulletins)) {
				mediaBulletins.style.display = 'none';
				discussionContent.style.display = '';
				wc.interface.applyScroll("#Chapter_Element");
			}
		},

		toggleMainDiscussion: function (mediaBulletinsDisplayType) {
			var discussionContent = document.getElementById('Chapter_Discussion_Content');
			var mediaBulletins = document.getElementById('Chapter_Discussion_MediaBulletins');
			if (isDefined(discussionContent) && isDefined(mediaBulletins)) {

				if (wc.interface.elements.mediaBullets.currentDisplayMode != mediaBulletinsDisplayType) {

					switch (mediaBulletinsDisplayType) {
						case wc.interface.mediaBulletinsDisplayTypes.none:
							mediaBulletins.style.display = 'none';
							discussionContent.style.display = 'none';
							break;
						case wc.interface.mediaBulletinsDisplayTypes.bullets:
							mediaBulletins.style.display = '';
							if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].chapterOptions.variety != 'Wide')
								discussionContent.style.display = 'none';
							else {
								if (isDefined(document.getElementById('Chapter_Video_Container'))) {
									document.getElementById('Chapter_Video_Container').style.display = 'none';
								}
							}
							break;
						case wc.interface.mediaBulletinsDisplayTypes.text:
							mediaBulletins.style.display = 'none';
							discussionContent.style.display = '';
							if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].chapterOptions.variety == 'Wide') {
								if (isDefined(document.getElementById('Chapter_Video_Container'))) {
									document.getElementById('Chapter_Video_Container').style.display = '';
								}
							}
							break;
					}

					wc.interface.elements.mediaBullets.currentDisplayMode = mediaBulletinsDisplayType;
				}
			}
		}
	},
	general: {
		setClickEvent: function (element, functionNameStr, functionName, param) {
			if (typeof (element.getAttribute("onclick")) != "function") {
				element.setAttribute("onclick", functionNameStr);
			}
			else {
				if (isDefined(param))
					element.onclick = function () { functionName(param); };
				else
					element.onclick = function () { functionName(); };
			}
		},
		setCss: function (element, cssName) {
			if (typeof (element.getAttribute("onclick")) != "function") {
				element.setAttribute("class", cssName);
			}
			else {
				element.className = cssName;
			}
			//alert(element.id + " " + element.className + " - " + cssName + " -- " + element.getAttribute("onclick"));
		},
		getClassName: function (element) {
			if (typeof (element.getAttribute("onclick")) != "function") {
				return element.getAttribute("class");
			}
			else {
				return element.className;
			}
		},
		emptyFunction: function ()
		{ }
	}
};

wc.interface.actionHandler = {
	types: { nextButton: 1, previousButton: 2 },
	fire: function (args) {

	},
	scrollToTop: function () {

		didScroll = false;
		try {
			if (wc.interface.parentWindow)
				wc.interface.parentWindow.scrollTo(0, 1);
			window.scrollTo(0, 1);
		} catch (ex) {
			didScroll = false;
		}
		if (didScroll)
			return;

		var didScroll = false;
		try {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			window.scroll(0, 0);
			didScroll = true;
		}
		catch (ex) {
			didScroll = false;
		}
		if (!didScroll) {
			try {
				if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0)
					document.body.scrollTop = document.documentElement.scrollTop = 0;
			}
			catch (ex) {
			}
		}
	},
	hideAddressBar: function () {

		try {
			wc.interface.parentWindow.scrollTo(0, 1);
			window.scrollTo(0, 1);
		}
		catch (ex) {
			didScroll = false;
		}

		return;

		var didScroll = false;
		try {
			document.body.scrollTop = document.documentElement.scrollTop = 0;
			window.scroll(0, 0);
			didScroll = true;
		}
		catch (ex) {
			didScroll = false;
		}
		if (!didScroll) {
			try {
				if (document.body.scrollTop != 0 || document.documentElement.scrollTop != 0)
					document.body.scrollTop = document.documentElement.scrollTop = 0;
			}
			catch (ex) {
			}
		}
	},
	nextButton: function () {
		try {
			wc.mediaPlayer.video.stop();
			wc.mediaPlayer.audio.stop();
		}
		catch (e) { }

		//if there are any pending responses for this chapter send them
		if (isDefined(wc.interface.elements.survey.responses) && !isObjectEmpty(wc.interface.elements.survey.responses)) {
			wc.interface.actionHandler.submitSurveyAnswers(wc.interface.elements.survey.responses);
		}
		if (wc.interface.actionHandler.displayPopBulletin() != wc.interface.elementTypes.popBulletin) {
			wc.interface.navigateToElement(wc.interface.directions.next);
		}
	},
	previousButton: function () {

		try {
			wc.mediaPlayer.video.stop();
			wc.mediaPlayer.audio.stop();
		}
		catch (e) { }
		var Button_Previous = document.getElementById('Button_Previous');

		if (!isDefined(Button_Previous)) {
			return false;
		}
		if (Button_Previous.disabled != true) {
			wc.interface.navigateToElement(wc.interface.directions.previous);
		}
	},
	quizQuestion_closeFeedbackElement: function () {
		var Quiz_Body_Feedback_Container = document.getElementById('Quiz_Body_Feedback_Container');
		if (isDefined(Quiz_Body_Feedback_Container)) {
			if ($(Quiz_Body_Feedback_Container).hasClass('canHide')) {
				$(Quiz_Body_Feedback_Container).addClass('hiddenElement');
				var QuizQuestion_Body_Content = document.getElementById('QuizQuestion_Body_Content');
				if (isDefined(QuizQuestion_Body_Content) && $(QuizQuestion_Body_Content).hasClass('canHide'))
					$(QuizQuestion_Body_Content).removeClass('hiddenElement');
			} else {
				Quiz_Body_Feedback_Container.style.display = 'none';
			}

		}
		var popHeadingQuiz = document.getElementById("popHeadingQuiz");
		if (isDefined(popHeadingQuiz)) {
			document.getElementById("popHeadingQuiz_SecondText").style.display = "none";
			document.getElementById("popHeadingQuiz_Text").style.display = "";
		}
	},
	quizQuestion_MultipleChoiceOneAnswerSelected: function (choiceIndex, elementType) {
		var QuizQuestion_Choices_Content = document.getElementById('QuizQuestion_Choices_Content');
		if (QuizQuestion_Choices_Content.tagName == 'UL') {
			if (wc.interface.elements.quiz.selectedChoiceIndex >= 0) {
				choiceIndex = wc.interface.elements.quiz.selectedChoiceIndex;
				elementType = wc.interface.elements.quiz.selectedElementType;
			}
			else {
				return false;
			}

		}
		var Quiz_Body_Feedback_Container = document.getElementById('Quiz_Body_Feedback_Container');
		if (isDefined(Quiz_Body_Feedback_Container)) {
			if ($(Quiz_Body_Feedback_Container).hasClass('canHide')) {
				var QuizQuestion_Body_Content = document.getElementById('QuizQuestion_Body_Content');
				if (isDefined(QuizQuestion_Body_Content) && $(QuizQuestion_Body_Content).hasClass('canHide'))
					$('#QuizQuestion_Body_Content').addClass('hiddenElement');
				$(Quiz_Body_Feedback_Container).removeClass('hiddenElement');
			} else {
				Quiz_Body_Feedback_Container.style.display = '';
			}
		}
		var choice; var isCorrect = null;
		var QuizQuestion_ContinueButton = document.getElementById('QuizQuestion_ContinueButton');
		if (elementType == wc.interface.elementTypes.popQuestion) {
			choice = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuestion.choices[choiceIndex];
			//$(QuizQuestion_ContinueButton).attr('onclick', 'wc.interface.actionHandler.nextButton();');
			QuizQuestion_ContinueButton.onClick = 'wc.interface.actionHandler.nextButton();';
			//$(QuizQuestion_ContinueButton).click(function () {
			//	console.log('QuizQuestion_ContinueButton click');
			//	wc.interface.actionHandler.nextButton();
			//});
			//QuizQuestion_ContinueButton.onKeyPress = function () {
			//	wc.interface.actionHandler.nextButton();
			//};

			if (choice.isCorrect == "false") {
				isCorrect = false;
			}
			else {
				isCorrect = true;
			}
		}

		var QuizQuestion_Body_Feedback = document.getElementById('QuizQuestion_Body_Feedback');
		var QuizQuestion_Body_Feedback_AgreeText = document.getElementById('QuizQuestion_Body_Feedback_AgreeText');
		var tryAgainElement = document.getElementById('QuizQuestion_Body_Feedback_TryAgain');

		if (isCorrect == false) {

			QuizQuestion_Body_Feedback.innerHTML = choice.feedback;
			if (isDefined(QuizQuestion_Body_Feedback_AgreeText) && wc.data.jsonData.showQuizAnswerHeader == "1") {
				var popHeadingQuiz = document.getElementById("popHeadingQuiz");
				if (isDefined(popHeadingQuiz)) {
					document.getElementById("popHeadingQuiz_Text").style.display = "none";
					document.getElementById("popHeadingQuiz_SecondText").style.display = "";
					document.getElementById("popHeadingQuiz_SecondText").innerHTML = wc.interface.getResource('WeDisagree');
				}
				else {
					QuizQuestion_Body_Feedback_AgreeText.innerHTML = wc.interface.getResource('WeDisagree');
					QuizQuestion_Body_Feedback_AgreeText.className = "disagreeText";
				}
			}

			if (isDefined(tryAgainElement)) {
				tryAgainElement.innerHTML = wc.interface.getResource('Pleasetryagain');
				tryAgainElement.style.display = '';
			}

			var quizQuestionButtons = document.getElementById('quizQuestionButtons');
			if (isDefined(quizQuestionButtons)) {
				quizQuestionButtons.style.display = 'none';
			}

			var QuizQuestion_Body_Feedback_AgreeText = document.getElementById('QuizQuestion_Body_Feedback_AgreeText');
			if (isDefined(QuizQuestion_Body_Feedback_AgreeText)) {
				QuizQuestion_Body_Feedback_AgreeText.style.display = 'none';
			}

			if (isDefined(wc.data.values.elementsName) && wc.interface.currentElement.elementType == wc.interface.elementTypes.popQuestion && (wc.data.values.elementsName == 'iPadFrame' || wc.data.values.elementsName == 'WeComply2013' || wc.data.values.elementsName == 'iPadFrameAccenture2')) {
				if (isDefined(tryAgainElement)) {
					tryAgainElement.style.display = 'none';
					tryAgainElement.innerHTML = '';
				}
				QuizQuestion_ContinueButton.style.display = '';
				QuizQuestion_ContinueButton.disabled = false;
				QuizQuestion_ContinueButton.style.visibility = 'visible';
				if (isDefined(document.getElementById("quizQuestionButtons"))) {
					document.getElementById("quizQuestionButtons").style.display = '';
				}
			}
		}
		else if (isCorrect == true) {
			wc.interface.elements.quiz.clearSelection();
			if (isDefined(tryAgainElement)) {
				tryAgainElement.style.display = 'none';
				tryAgainElement.innerHTML = '';
			}
			QuizQuestion_ContinueButton.disabled = false;
			QuizQuestion_ContinueButton.style.visibility = 'visible';
			QuizQuestion_Body_Feedback.innerHTML = choice.feedback;
			if (isDefined(QuizQuestion_Body_Feedback_AgreeText) && wc.data.jsonData.showQuizAnswerHeader == "1") {

				var popHeadingQuiz = document.getElementById("popHeadingQuiz");
				if (isDefined(popHeadingQuiz)) {
					document.getElementById("popHeadingQuiz_Text").style.display = "none";
					document.getElementById("popHeadingQuiz_SecondText").style.display = "";
					document.getElementById("popHeadingQuiz_SecondText").innerHTML = wc.interface.getResource('WeAgree');
				}
				else {
					QuizQuestion_Body_Feedback_AgreeText.innerHTML = wc.interface.getResource('WeAgree');
					QuizQuestion_Body_Feedback_AgreeText.className = "agreeText";
				}
			}

			var quizQuestionButtons = document.getElementById('quizQuestionButtons');
			if (isDefined(quizQuestionButtons)) {
				quizQuestionButtons.style.display = '';
			}
			var QuizQuestion_Body_Feedback_AgreeText = document.getElementById('QuizQuestion_Body_Feedback_AgreeText');
			if (isDefined(QuizQuestion_Body_Feedback_AgreeText)) {
				QuizQuestion_Body_Feedback_AgreeText.style.display = 'none';
			}

		}
	},
	survey_CheckIfNextIsAllowed: function () {
		var survey = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey;
		var isTriggerCheckedOrSkipped = false;

		if (isDefined(survey.pivotQuestion)) {
			for (var choiceIndex in survey.pivotQuestion.choices) {
				var choice = survey.pivotQuestion.choices[choiceIndex];
				if (choice.isTrigger == "false") {
					isTriggerCheckedOrSkipped = false;
					if (document.getElementById('Survey_PivotQuestion_' + choiceIndex).checked) {
						wc.interface.elements.survey.setResponse(survey.id, survey.pivotQuestion.choices, wc.convert.toInt(choiceIndex), null);
						return true;
					}
				} else {
					if (document.getElementById('Survey_PivotQuestion_' + choiceIndex).checked) {
						isTriggerCheckedOrSkipped = true;
						wc.interface.elements.survey.setResponse(survey.id, survey.pivotQuestion.choices, wc.convert.toInt(choiceIndex), null);
						break;
					}
					isTriggerCheckedOrSkipped = true;
				}
			}
		} else {
			isTriggerCheckedOrSkipped = true; //skip bc no pivot question, so it must be there is a survery question rather than pivot question
		}

		if (isTriggerCheckedOrSkipped) {
			var moveNextAllowed = true;
			for (var questionIndex in survey.surveyQuestions) {
				switch (survey.surveyQuestions[questionIndex].variety) {
					case 'TextEssay':
						if (typeof (document.getElementById('Survey_TextEssay_' + questionIndex)) == 'undefined' || document.getElementById('Survey_TextEssay_' + questionIndex) == null) {
							moveNextAllowed = false;
							break;
						}
						if (document.getElementById('Survey_TextEssay_' + questionIndex).value == '')
							moveNextAllowed = false;

						wc.interface.elements.survey.setResponse(survey.surveyQuestions[questionIndex].id, null, null, document.getElementById('Survey_TextEssay_' + questionIndex).value);

						break;
					case 'MultipleChoiceOneAnswer':
						for (var choiceIndex in survey.surveyQuestions[questionIndex].choices) {
							var choice = survey.surveyQuestions[questionIndex].choices[choiceIndex];
							if (typeof (document.getElementById('Survey_MultipleChoiceOneAnswer_' + questionIndex + '_' + choiceIndex)) == 'undefined' || (document.getElementById('Survey_MultipleChoiceOneAnswer_' + questionIndex + '_' + choiceIndex)) == null) {
								moveNextAllowed = false;
								break;
							}

							if (document.getElementById('Survey_MultipleChoiceOneAnswer_' + questionIndex + '_' + choiceIndex).checked) {
								if (choice.isCorrect == "true" && choice.hasTextInput == "false") {
									wc.interface.elements.survey.setResponse(survey.surveyQuestions[questionIndex].id, null, choiceIndex.toInt() + 1, null);
								}
								else if (choice.hasTextInput == "true") {
									if (typeof (document.getElementById('Survey_TextInput_' + questionIndex + '_' + choiceIndex)) == 'undefined' || (document.getElementById('Survey_TextInput_' + questionIndex + '_' + choiceIndex)) == null) {
										moveNextAllowed = false;
										break;
									}

									if (document.getElementById('Survey_TextInput_' + questionIndex + '_' + choiceIndex).value == '')
										moveNextAllowed = false;

									wc.interface.elements.survey.setResponse(survey.surveyQuestions[questionIndex].id, choiceIndex.toInt() + 1, document.getElementById('Survey_TextInput_' + questionIndex + '_' + choiceIndex).value);
								}
								else if (choice.hasTextInput == "false") // means isCorrect == "false"
								{
									wc.interface.elements.survey.setResponse(survey.surveyQuestions[questionIndex].id, null, choiceIndex.toInt() + 1, choice.body);
									//moveNextAllowed = false;
									//because nothing to do in this case for now we will allow it to go through
								}
							}
						}
						break;
					case 'MultipleChoiceMultipleAnswers':
						var isAnyChecked = false;
						for (var choiceIndex in survey.surveyQuestions[questionIndex].choices) {
							var choice = survey.surveyQuestions[questionIndex].choices[choiceIndex];

							if (typeof (document.getElementById('Survey_MultipleChoiceMultipleAnswer_' + questionIndex + '_' + choiceIndex)) == 'undefined' || document.getElementById('Survey_MultipleChoiceMultipleAnswer_' + questionIndex + '_' + choiceIndex) == null) {
								moveNextAllowed = false;
								break;
							}

							if (document.getElementById('Survey_MultipleChoiceMultipleAnswer_' + questionIndex + '_' + choiceIndex).checked) {
								isAnyChecked = true;
							}
						}
						if (!isAnyChecked)
							moveNextAllowed = false;
						break;
					case 'Boolean':

						if (typeof (document.getElementById('Survey_Boolean_No_' + questionIndex)) == 'undefined' || document.getElementById('Survey_Boolean_No_' + questionIndex) == null) {
							moveNextAllowed = false;
							break;
						}

						if (!document.getElementById('Survey_Boolean_No_' + questionIndex).checked && !document.getElementById('Survey_Boolean_Yes_' + questionIndex).checked)
							moveNextAllowed = false;
						break;
				}
			}
			return moveNextAllowed;
		}
	},
	survey_TextEssayKeyUp: function (element, questionIndex) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");
	},
	survey_MultipleChoiceOneAnswerSelected: function (choiceIndex, questionIndex) {
		var question = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey.surveyQuestions[questionIndex];
		var choice = question.choices[choiceIndex];

		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");

		if (choice.isCorrect == "true") {
		}
		else {
			if (choice.hasTextInput == "true") {
				textInputTemplate = wc.data.templateElements.survey_TextInput;

				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Id', choiceIndex);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Name', choiceIndex);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Label', '');
				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_width', '200');


				textInputTemplate = textInputTemplate.replaceTag('Content', 'questionIndex', questionIndex);

				//console.log(textInputTemplate);
				document.getElementById('Survey_Body_Feedback_subQuestion' + questionIndex).innerHTML = textInputTemplate;
			}
			else {
				document.getElementById('Survey_Body_Feedback_subQuestion' + questionIndex).innerHTML = '';
			}
		}

	},
	survey_TextInputKeyUp: function (element) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");
		return true;
	},
	survey_BooleanSelected: function (value) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");
	},
	survey_MultipleChoiceMultipleAnswerSelected: function (choiceIndex, questionIndex) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");
	},
	survey_PivotQuestionSelected: function (choiceIndex) {
		choice = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey.pivotQuestion.choices[choiceIndex];

		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.navigation.enableButton("Button_Next");
		else
			wc.interface.navigation.disableButton("Button_Next");

		if (choice.isTrigger == "false") {
			var Survey_Body_Feedback = document.getElementById('Survey_Body_Feedback');
			Survey_Body_Feedback.innerHTML = '';
		}
		else {

			var survey = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey;

			if (typeof (survey.surveyQuestions) != 'undefined') {
				var Survey_Body_Feedback = document.getElementById('Survey_Body_Feedback');
				Survey_Body_Feedback.innerHTML = wc.interface.buildSurveyQuestionHtml(survey, choiceIndex);
			}
		}
	},
	popQuiz_answerSelected: function (answerIndex, questionIndex) {
		var question = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.questions[questionIndex];
		var choice = question.choices[answerIndex];
		var feedbackContainerElement = document.getElementById('popQuiz_Body_Feedback_Container');

		//if (isDefined(feedbackContainerElement))
		//	feedbackContainerElement.style.display = 'none';

		var feedbackElement = document.getElementById('popQuiz_Body_Feedback');
		var agreeElement = document.getElementById('popQuiz_Body_Feedback_AgreeText');
		var feedbackTextElement = document.getElementById('popQuiz_Body_Feedback_Text');
		var tryAgainElement = document.getElementById('popQuiz_Body_Feedback_TryAgain');
		var continueButton = document.getElementById('popQuiz_Body_Feedback_ContinueButton');
		if (isDefined(feedbackContainerElement)) {
			/*if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
			//transition
			$(feedbackContainerElement).slideDown(600);
			}
			else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
			$(feedbackContainerElement).show('slide', { direction: 'left' }, 600);
			}
			else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
			$(feedbackContainerElement).removeClass("zoom-step2").show(600);
			}
			else */
			feedbackContainerElement.style.display = '';
			if (wc.interface.options.games.scrollToTopOnFeedback)
				wc.interface.actionHandler.scrollToTop();
			wc.interface.resizeScrolls();
		}

		if (choice.isCorrect == "true") {
			feedbackTextElement.innerHTML = choice.feedback;
			if (wc.data.jsonData.showQuizAnswerHeader == "1") {
				agreeElement.innerHTML = wc.interface.getResource('WeAgree');
			}
			agreeElement.className = 'agreeText';
			continueButton.style.display = '';
			tryAgainElement.style.display = 'none';
			tryAgainElement.innerHTML = '';
			wc.interface.elements.quiz.clearSelection();
		}
		else {
			feedbackTextElement.innerHTML = choice.feedback;
			if (wc.data.jsonData.showQuizAnswerHeader == "1") {
				agreeElement.innerHTML = wc.interface.getResource('WeDisagree');
			}
			agreeElement.className = 'disagreeText';
			continueButton.style.display = 'none';
			tryAgainElement.style.display = '';
			tryAgainElement.innerHTML = wc.interface.getResource('Pleasetryagain');
			wc.interface.resizeScrolls();
		}

		if (isDefined(feedbackContainerElement)) {
			feedbackContainerElement.style.display = '';
			if (wc.interface.options.games.scrollToTopOnFeedback)
				wc.interface.actionHandler.scrollToTop();

			wc.interface.resizeScrolls();
			var Quiz_Body_Feedback_ContainerBoundraries = wc.GetObjectBoundaries(feedbackContainerElement);
			var Quiz_ElementBoundraries = wc.GetObjectBoundaries(document.getElementById('PopQuiz_Question_Container'));
		}

	},
	popQuiz_closeFeedbackElement: function () {
		var feedbackContainerElement = document.getElementById('popQuiz_Body_Feedback_Container');
		if (isDefined(feedbackContainerElement))
		/*if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
		//transition
		$(feedbackContainerElement).slideUp(600);
		}
		else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
		$(feedbackContainerElement).hide('slide', { direction: 'left' }, 600);
		}
		else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
		$(feedbackContainerElement).addClass("zoom-step2", 600).hide(600);
		}
		else */
			feedbackContainerElement.style.display = 'none';
	},
	popQuiz_nextQuestion: function (questionIndex) {
		wc.interface.elements.quiz.clearSelection();
		//if (wc.data.values.IsiPadFrame == 'True') {
		try { wc.mediaPlayer.video.stop(); } catch (ex) { }
		//}

		// if the popquiz has no questions, just navigate to the next element
		if (!isDefined(wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.questions)) {
			//hide popup and overlay
			var LayerElementContainer = document.getElementById('LayerElementContainer');
			if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
				//transition out
				$(LayerElementContainer).slideUp(600, function () {
					$("body div.modal-overlay").remove();
					$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
				});
			}
			else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
				$(LayerElementContainer).hide('slide', { direction: 'left' }, 600, function () {
					$("body div.modal-overlay").remove();
					$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
				});
			}
			else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
				$(LayerElementContainer).addClass("zoom-step2", 600).hide(600, function () {
					$("body div.modal-overlay").remove();
					$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
				});
			}
			//end hide
			setTimeout('wc.interface.navigateToElement(wc.interface.directions.next)', 610);
			return;
		}

		if (!isDefined(questionIndex))
			questionIndex = 0;

		// restore the popquiz header (if needed)
		var popQuiz_AlternateHeading = document.getElementById('popQuiz_AlternateHeading');
		var popQuiz_MainHeading = document.getElementById('popQuiz_Heading');
		if (isDefined(popQuiz_AlternateHeading) && popQuiz_MainHeading.style.display == 'none') {
			popQuiz_AlternateHeading.style.display = 'none';
			popQuiz_MainHeading.style.display = '';
		}

		var feedbackContainerElement = document.getElementById('popQuiz_Body_Feedback_Container');

		if (isDefined(feedbackContainerElement))
			feedbackContainerElement.style.display = 'none';
		var PopQuiz_Question_Container_Body_Questions = document.getElementById('PopQuiz_Question_Container_Body_Questions');
		var PopQuiz_Question_Container = document.getElementById('PopQuiz_Question_Container');
		var PopQuiz_Question_Body = document.getElementById('PopQuiz_Question_Body');
		var PopQuiz_Content_Container = document.getElementById('PopQuiz_Content_Container');
		var PopQuiz_Introduction = document.getElementById('PopQuiz_Introduction');
		PopQuiz_Question_Container.style.display = '';
		PopQuiz_Question_Body.style.display = '';
		if (isDefined(PopQuiz_Question_Container_Body_Questions)) {
			PopQuiz_Question_Container_Body_Questions.style.display = '';
		}
// move this out of if, messes up vingettes in tablet style
			PopQuiz_Content_Container.style.display = 'none';
		PopQuiz_Introduction.style.display = 'none';

		var Button_Continue = document.getElementById("Button_Continue");
		if (isDefined(Button_Continue))
			Button_Continue.className = Button_Continue.className + " disabled";

		var popQuiz_quizQuestionHeaderLayout = document.getElementById('popQuiz_quizQuestionHeaderLayout');
		if (isDefined(popQuiz_quizQuestionHeaderLayout)) {
			popQuiz_quizQuestionHeaderLayout.style.display = '';
		}

		var choiceTemplateHtml = wc.data.templateElements.popQuiz_Question;
		var question = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.questions[questionIndex];

		PopQuiz_Question_Body.innerHTML = question.body;

		var choiceHtml = '';
		for (var choiceIndex in question.choices) {
			var tmpHtml = choiceTemplateHtml;
			tmpHtml = tmpHtml.replaceTag('Content', 'popQuiz_questionBody', question.choices[choiceIndex].body);
			tmpHtml = tmpHtml.replaceTag('Content', 'answerIndex', choiceIndex);
			tmpHtml = tmpHtml.replaceTag('Content', 'questionIndex', questionIndex);
			choiceHtml += tmpHtml;
		}

		if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.questions.length > (questionIndex + 1)) {
			var popQuizContinueBtn = document.getElementById('popQuizContinueBtn');
			popQuizContinueBtn.onclick = function () { wc.interface.actionHandler.popQuiz_nextQuestion(questionIndex + 1); };
			popQuizContinueBtn.onKeyPress = function () { wc.interface.actionHandler.popQuiz_nextQuestion(questionIndex + 1); };
		} else { //no more questions, move to next chapter
			var popQuizContinueBtn = document.getElementById('popQuizContinueBtn');
			popQuizContinueBtn.onclick = function () {
				//hide popup and overlay
				var LayerElementContainer = document.getElementById('LayerElementContainer');
				if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
					//transition out
					$(LayerElementContainer).slideUp(600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
					$(LayerElementContainer).hide('slide', { direction: 'left' }, 600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
					$(LayerElementContainer).addClass("zoom-step2", 600).hide(600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				//end hide
				setTimeout('wc.interface.navigateToElement(wc.interface.directions.next)', 610);
			};

			popQuizContinueBtn.onKeyPress = function () {
				//hide popup and overlay
				var LayerElementContainer = document.getElementById('LayerElementContainer');
				if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
					//transition out
					$(LayerElementContainer).slideUp(600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
					$(LayerElementContainer).hide('slide', { direction: 'left' }, 600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
					$(LayerElementContainer).addClass("zoom-step2", 600).hide(600, function () {
						$("body div.modal-overlay").remove();
						$(LayerElementContainer).removeClass("LayerElementContainerCustomized");
					});
				}
				//end hide
				setTimeout('wc.interface.navigateToElement(wc.interface.directions.next)', 610);
			};
		}

		PopQuiz_Question_Container.innerHTML = choiceHtml;
		var PopQuiz_Answer_Button = document.getElementById('PopQuiz_Answer_Button');

		if (isDefined(PopQuiz_Answer_Button) && choiceHtml != '')
			PopQuiz_Answer_Button.style.display = '';

		// apply iScroll
		wc.interface.applyScroll('#PopQuiz_Question_Container_Body_Questions');
	},
	popQuiz_ContinueFromIntroduction: function (hasVideo) {
		try {
			var popQuiz_IntroFrame = document.getElementById("popQuiz_IntroFrame");
			if (isDefined(popQuiz_IntroFrame))
				if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
					//transition 
					$(popQuiz_IntroFrame).slideUp(600);
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
					$(popQuiz_IntroFrame).hide('slide', { direction: 'left' }, 600);
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
					$(popQuiz_IntroFrame).addClass("zoom-step2", 600).hide(600);
				}
				else popQuiz_IntroFrame.style.display = 'none';

			var popQuiz_quizQuestionHeaderLayout = document.getElementById("popQuiz_quizQuestionHeaderLayout");
			if (isDefined(popQuiz_quizQuestionHeaderLayout)) {
				popQuiz_quizQuestionHeaderLayout.style.display = 'none';
			}
			var PopQuiz_Introduction = document.getElementById('PopQuiz_Introduction');
			PopQuiz_Introduction.style.display = 'none';

			var PopQuiz_Content_Container = document.getElementById('PopQuiz_Content_Container');

			if (hasVideo) {
				var PopQuiz_Video_Container = document.getElementById('PopQuiz_Video_Container');

				if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideDownUp) {
					//hide video until the trasnition ends
					$(PopQuiz_Video_Container).css('visibility', 'hidden');
					//transition
					$(PopQuiz_Content_Container).delay(600).slideDown(600, function () {
						setTimeout(function () {
							var video = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.video;
							if (isDefined(video))
							{								
								wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
								wc.mediaPlayer.video.videoParams.fileSrc = video.src;
								wc.mediaPlayer.video.videoParams.width = video.width;
								wc.mediaPlayer.video.videoParams.height = video.height;
								wc.mediaPlayer.video.videoParams.containerElementId = 'PopQuiz_Video_Container';								

								wc.mediaPlayer.video.play(wc.mediaPlayer.video.videoParams);
							}

							//show video
							$(PopQuiz_Video_Container).css('visibility', 'visible');
						}, 200);					
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.slideLeft) {
					//hide video until the trasnition ends
					$(PopQuiz_Video_Container).css('visibility', 'hidden');
					$(PopQuiz_Content_Container).delay(600).show('slide', { direction: 'left' }, 600,
					function () {
						setTimeout(function () {
							var video = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.video;
							if (isDefined(video))
							{								
								wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
								wc.mediaPlayer.video.videoParams.fileSrc = video.src;
								wc.mediaPlayer.video.videoParams.width = video.width;
								wc.mediaPlayer.video.videoParams.height = video.height;
								wc.mediaPlayer.video.videoParams.containerElementId = 'PopQuiz_Video_Container';								

								wc.mediaPlayer.video.play(wc.mediaPlayer.video.videoParams);
							}

							//show video
							$(PopQuiz_Video_Container).css('visibility', 'visible');
						}, 200);
					});
				}
				else if (wc.interface.options.pageChange.popupReplacementMethod == wc.interface.transitionOptions.zoomInOut) {
					//hide video until the trasnition ends
					$(PopQuiz_Video_Container).css('visibility', 'hidden');
					$(PopQuiz_Content_Container).delay(600).show(600).addClass("zoom-step2", 600).removeClass("zoom-step2", 500).addClass("zoom-step3", 500).removeClass("zoom-step3", 500, function () {
						setTimeout(function () {
							var video = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.video;
							if (isDefined(video))
							{								
								wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
								wc.mediaPlayer.video.videoParams.fileSrc = video.src;
								wc.mediaPlayer.video.videoParams.width = video.width;
								wc.mediaPlayer.video.videoParams.height = video.height;
								wc.mediaPlayer.video.videoParams.containerElementId = 'PopQuiz_Video_Container';								

								wc.mediaPlayer.video.play(wc.mediaPlayer.video.videoParams);
							}

							//show video
							$(PopQuiz_Video_Container).css('visibility', 'visible');
						}, 200);
					});

				}
				else {
					
							var video = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuiz.video;
							if (isDefined(video))
							{								
								wc.mediaPlayer.video.videoParams.chapterIndex = wc.interface.currentElement.chapterIndex;
								wc.mediaPlayer.video.videoParams.fileSrc = video.src;
								wc.mediaPlayer.video.videoParams.width = video.width;
								wc.mediaPlayer.video.videoParams.height = video.height;
								wc.mediaPlayer.video.videoParams.containerElementId = 'PopQuiz_Video_Container';								

								wc.mediaPlayer.video.play(wc.mediaPlayer.video.videoParams);
							}

						//show video
						PopQuiz_Content_Container.style.display = '';
						$(PopQuiz_Video_Container).css('visibility', 'visible');

					
					
				}
				// swap the heading with the alternate heading
				var alternateHeading = document.getElementById('popQuiz_AlternateHeading');
				if (isDefined(alternateHeading)) {
					document.getElementById('popQuiz_Heading').style.display = 'none';
					alternateHeading.style.display = '';
				}				
			} else {
				wc.interface.actionHandler.popQuiz_nextQuestion(0);
			}
		}
		catch (exception) {
			//console.log(exception);
		}
		wc.interface.applyScroll('#PopQuiz_Content_Container');
		//
		//
		//popQuiz_ContinueFromIntroduction
	},
	matchGameContinue: function () {
		var MatchGame_Introduction = document.getElementById('MatchGame_IntroductionContainer');
		MatchGame_Introduction.style.display = 'none';

		var MatchGame_GameContainer = document.getElementById('MatchGame_GameContainer');
		MatchGame_GameContainer.style.display = '';

		// disable the scroll
		//var layerContainer = document.getElementById('LayerElementContainer');
		wc.interface.actionHandler.scrollToTop();
		if (!document.all) {
			//console.log('disabling touchmove');
			document.body.addEventListener('touchmove', matchGameDisableScroll);
		}
		//document.body.addEventListener('touchstart', matchGameDisableScroll);		
	},
	matchGameScrollEventHandler: function (e) {
		//console.log(e);	
		alert(e);
		e.preventDefault();
		return false;
	},
	displayLinkBulletin: function (linkBulletinType) {

		var linkBulletin = null;
		for (var linkBulletinIndex in wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins) {
			if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex].variety == linkBulletinType.varietyCode) {
				linkBulletin = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex];
				break;
			}
		}

		return wc.interface.displayLayer(wc.interface.elementTypes.linkBulletin, linkBulletin);
	},
	displayPopBulletin: function () {
		if (isDefined(wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popBulletin)) {
			return wc.interface.displayLayer(wc.interface.elementTypes.popBulletin, wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popBulletin);
		} else {
			return wc.interface.currentElement.elementType;
		}
	},
	displayTerm: function (termId) {
		var terms = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].terms[termId - 1];
		return wc.interface.displayLayer(wc.interface.elementTypes.term, terms);
	},
	displayQuizQuestion: function (quizQuestion, elementType) {
		//var popQuestion = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuestion;
		if (quizQuestion == null)
			return false;
		return wc.interface.displayLayer(elementType, quizQuestion);
	},
	displayGame: function (gameIndex) {
		if (!isDefined(gameIndex))
			gameIndex = wc.interface.game.gameIndex;

		//wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onBefore_CloseIntroLayer, { elementType: wc.interface.elementTypes.game, data: gameIndex });
		return wc.interface.displayLayer(wc.interface.elementTypes.game, gameIndex);
	},
	displayGameIntro: function (gameIndex) {
		return wc.interface.displayLayer(wc.interface.elementTypes.gameIntro, gameIndex);
	},
	displayGameChoice: function () {
		if (wc.data.jsonData.quiz.games.length == 1)
			return wc.interface.displayLayer(wc.interface.elementTypes.gameIntro, 0);
		else
			return wc.interface.displayLayer(wc.interface.elementTypes.gameChoice);
	},
	displayMatchGame: function (matchGame, elementType) {
		if (matchGame == null)
			return false;
		return wc.interface.displayLayer(elementType, matchGame);
	},
	game_closeFeedbackElement: function () {
		if (isDefined(document.getElementById('finalQuizContainer'))) {
			document.getElementById("popHeadingQuiz_Text").style.display = "";
			document.getElementById("popHeadingQuiz_SecondText").style.display = "none";
		}

		if (isDefined(document.getElementById('quizLeftPage'))) {
			document.getElementById('quizLeftPage').style.display = '';
		}

		var feedbackContainerElement = document.getElementById('Quiz_Body_Feedback_Container');
		if (isDefined(feedbackContainerElement)) {
			if ($(feedbackContainerElement).hasClass('canHide')) {
				$(feedbackContainerElement).addClass('hiddenElement');
			}
			else {
				feedbackContainerElement.style.display = 'none';
			}

		}

		wc.interface.resizeScrolls();
	},
	game_answerQuestion: function (choiceIndex) {
		if (isDefined(document.getElementById('finalQuizContainer'))) {
			if (wc.interface.elements.quiz.selectedChoiceIndex == -1)
				return;
			choiceIndex = wc.interface.elements.quiz.selectedChoiceIndex;
		}

		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onBefore_AnswerQuestion, choiceIndex);
		var feedbackElement = document.getElementById('Quiz_Body_Feedback');
		var feedbackContainerElement = document.getElementById('Quiz_Body_Feedback_Container');
		var agreeElement = document.getElementById('Quiz_Body_Feedback_AgreeText');
		var feedbackTextElement = document.getElementById('Quiz_Body_Feedback_Text');
		var tryAgainElement = document.getElementById('Quiz_Body_Feedback_TryAgain');
		var continueButton = document.getElementById('Quiz_Body_Feedback_ContinueButton');
		var isFirstAttempt = (wc.interface.game.correctAnswerOnFirstTry == null);
		var choice = wc.interface.game.answerQuestion(choiceIndex);
		if (isDefined(feedbackContainerElement)) {
			feedbackContainerElement.style.display = '';
			if (wc.interface.options.games.scrollToTopOnFeedback)
				wc.interface.actionHandler.scrollToTop();
		}

		if (choice.isCorrect == "true") {
			wc.interface.elements.quiz.clearSelection();
			feedbackTextElement.innerHTML = choice.feedback;
			agreeElement.innerHTML = wc.interface.getResource('WeAgree');
			agreeElement.className = 'agreeText';
			continueButton.style.display = '';
			tryAgainElement.style.display = 'none';
			tryAgainElement.innerHTML = '';
			if (isFirstAttempt && wc.interface.game.correctAnswerOnFirstTry == true) {
				if (isDefined(document.getElementById('Quiz_ChoiceItemLabel_' + choiceIndex)))
					document.getElementById('Quiz_ChoiceItemLabel_' + choiceIndex).className += ' firstSelectedAnswer';
				if (wc.interface.game.chapterQuestionsCompleted && wc.interface.currentElement.elementType == wc.interface.elementTypes.game) {
					//agreeElement.innerHTML = wc.interface.getResource('Congratulations');
					//feedbackTextElement.innerHTML = wc.interface.getResource('LastQuestion');
				}
			}
			if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
				agreeElement.className = 'finalAgreeText';
			}

			if (isDefined(document.getElementById('finalQuizContainer')) && wc.data.jsonData.showQuizAnswerHeader == "1") {
				document.getElementById("popHeadingQuiz_Text").style.display = "none";
				document.getElementById("popHeadingQuiz_SecondText").style.display = "";
				document.getElementById("popHeadingQuiz_SecondText").innerHTML = wc.interface.getResource('WeAgree');
			}
			if (isDefined(document.getElementById('quizLeftPage'))) {
				document.getElementById('quizLeftPage').style.display = 'none';
			}
		}
		else {
			feedbackTextElement.innerHTML = choice.feedback;
			agreeElement.innerHTML = wc.interface.getResource('WeDisagree');
			agreeElement.className = 'disagreeText';
			continueButton.style.display = 'none';
			tryAgainElement.style.display = '';
			if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
				feedbackTextElement.innerHTML = wc.interface.getResource('BetterAnswer');
				agreeElement.className = 'finalDisagreeText';
			}
			tryAgainElement.innerHTML = wc.interface.getResource('Pleasetryagain');

			if (isDefined(document.getElementById('finalQuizContainer')) && wc.data.jsonData.showQuizAnswerHeader == "1") {
				document.getElementById("popHeadingQuiz_Text").style.display = "none";
				document.getElementById("popHeadingQuiz_SecondText").style.display = "";
				document.getElementById("popHeadingQuiz_SecondText").innerHTML = wc.interface.getResource('WeDisagree');
			}

			if (isDefined(document.getElementById('quizLeftPage'))) {
				document.getElementById('quizLeftPage').style.display = 'none';
			}
		}

		if (isDefined(feedbackContainerElement)) {
			feedbackContainerElement.style.display = '';
			if (wc.interface.options.games.scrollToTopOnFeedback)
				wc.interface.actionHandler.scrollToTop();

			var Quiz_Body_Feedback_ContainerBoundraries = wc.GetObjectBoundaries(feedbackContainerElement);
			var Quiz_ElementBoundraries = wc.GetObjectBoundaries(document.getElementById('Quiz_Element'));

			if (Quiz_Body_Feedback_ContainerBoundraries.height > Quiz_ElementBoundraries.height) {
				if (document.getElementById('Quiz_Element').className != 'quizLayoutFinalQuiz')
					document.getElementById('Quiz_Element').style.height = (Quiz_Body_Feedback_ContainerBoundraries.height + 85) + 'px';
			}
		}

		wc.interface.resizeScrolls();
		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_AnswerQuestion, choice);
	},
	game_gotoNextQuestion: function () {
		//AdiA- hack for iPadFrame
		if (isDefined(document.getElementById('finalQuizContainer'))) {
			document.getElementById("popHeadingQuiz_Text").style.display = "";
			document.getElementById("popHeadingQuiz_SecondText").style.display = "none";
		}

		if (isDefined(document.getElementById('quizLeftPage'))) {
			document.getElementById('quizLeftPage').style.display = '';
		}

		if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
			wc.interface.navigateToElementAfterLastChapter();
		}
		else {
			return wc.interface.displayLayer(wc.interface.elementTypes.game, null);
		}
	},
	displayCertificate: function () {
		//Report finishing to LMS
		if (wc.lms.window != null && typeof (wc.lms.window) == "object") {
			if (false == wc.lms.window.bFinished) {
				if (!isDefined(wc.interface.game.gameIndex)) {
					// no game, tell lms we're 'finished' with game
					if (!wc.interface.game.reportScore(1, 1, false))
						alert('No Connectivity');
				} else {
					if (!wc.interface.game.reportScore(wc.interface.game.questionsCorrectOnFirstTry, wc.interface.game.questionCounter, true))
						alert('No Connectivity');
				}
			}

			// tell lms we're completely done with program
			if (typeof (wc.lms.window.end) == "function")
				wc.lms.window.end();
		}
		return wc.interface.displayLayer(wc.interface.elementTypes.certificate);
	},
	displayGameRestart: function () {
		return wc.interface.displayLayer(wc.interface.elementTypes.gameRestart);
	},
	displayAcknowledgment: function (acknowledgment) {
		if (acknowledgment == null)
			return false;
		return wc.interface.displayLayer(wc.interface.elementTypes.acknowledgment, acknowledgment);
	},
	acknowledgmentAgreeButton: function () {
		return wc.interface.navigateToElementAfterLastChapter();
	},
	acknowledgmentRefusalButton: function () {
		document.getElementById('Acknowledgment_Refusal_Content').style.display = '';
		document.getElementById('Acknowledgment_Refusal_Content').innerHTML = wc.data.jsonData.acknowledgment.refusal;
		document.getElementById('Acknowledgment_Previous').style.display = '';
		document.getElementById('Acknowledgment_Confirm').style.display = '';
		document.getElementById('Acknowledgment_Body_Content').style.display = 'none';
		document.getElementById('Acknowledgment_Agree').style.display = 'none';
		document.getElementById('Acknowledgment_Refusal').style.display = 'none';
	},
	acknowledgmentPreviousButton: function () {
		document.getElementById('Acknowledgment_Refusal_Content').style.display = 'none';
		document.getElementById('Acknowledgment_Previous').style.display = 'none';
		document.getElementById('Acknowledgment_Confirm').style.display = 'none';
		document.getElementById('Acknowledgment_Refusal_Content').innerHTML = '';
		document.getElementById('Acknowledgment_Body_Content').style.display = '';
		document.getElementById('Acknowledgment_Agree').style.display = '';
		document.getElementById('Acknowledgment_Refusal').style.display = '';

	},
	acknowledgmentConfirmButton: function () {
		// Report to the LMS
		wc.lms.reportNoAck(true);
		top.close();
		/*if (wc.lms.objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
		if (typeof (parent.lmswin.fail) == "function")
		parent.lmswin.fail(bExit);
		}
		}*/
	},
	bookmarkGoto: function (value) {
		//console.log('bookmarkGoto');
		wc.lms.highestBookmark = 0;
		if (typeof (value) == 'undefined' || value == null) {
			value = 0;
			if ((isDefined(document.LMSForm.bookmark) && document.LMSForm.bookmark[0].checked) || (isDefined(document.getElementById("BookmarkBeginButton")) && (wc.interface.elements.quiz.selectedChoiceIndex == 0 || wc.interface.elements.quiz.selectedChoiceIndex == -1))) {
				if (wc.lms.bookmark == "-1") {
					if (wc.interface.allowFlashInterface && wc.interface.type == wc.interface.types.flash)
						wc.flashInterface.loadGameChoice();
					else
						return wc.interface.actionHandler.displayGameChoice();
				} else {
					value = wc.lms.bookmark - 1;
				}
			}
			else {
				value = 0;
			}
		}
		if (wc.interface.allowFlashInterface && wc.interface.type == wc.interface.types.flash)
			wc.flashInterface.load(value);
		else {
			if (isDefined(wc.data.jsonData.introType) && wc.interface.introTypes.none != wc.data.jsonData.introType && value == 0)
				wc.interface.elements.intro.display();
			else
				wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, value);
		}
		//TODO: start game startGame(position);
	},
	playAudio: function (enableAutoPlay) {
		if (enableAutoPlay) {
			wc.interface.options.mediaPlayer.allowAudioAutoPlay = true;
		}
		wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

		if (wc.mediaPlayer.status.action == wc.mediaPlayer.actions.playing) {
			var buttonsToDisable = wc.interface.navigation.buttonTypes.Play;
			var buttonsToHide = wc.interface.navigation.buttonTypes.Play;
			var buttonsToEnable = wc.interface.navigation.buttonTypes.Pause;
			wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);
		}
		else {
			var buttonsToDisable = wc.interface.navigation.buttonTypes.Pause;
			var buttonsToHide = wc.interface.navigation.buttonTypes.Pause;
			var buttonsToEnable = wc.interface.navigation.buttonTypes.Play;
			wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);
		}

		//If bullets is active show the bullets text
		if (wc.interface.elements.bulletsButton.isActive) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOff();
		}

		//If full text is active show the full text
		if (wc.interface.elements.fullTextButton.isActive) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOn();
		}
	},
	pauseAudio: function (disableAutoPlay) {
		if (disableAutoPlay) {
			wc.interface.options.mediaPlayer.allowAudioAutoPlay = false;
		}

		wc.mediaPlayer.audio.pause();
		var buttonsToEnable = wc.interface.navigation.buttonTypes.Play;
		var buttonsToDisable = wc.interface.navigation.buttonTypes.Pause;
		var buttonsToHide = wc.interface.navigation.buttonTypes.Pause;
		wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);

		//If bullets is active show the bullets text
		if (wc.interface.elements.bulletsButton.isActive) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOff();
		}

		//If full text is active show the full text
		if (wc.interface.elements.fullTextButton.isActive) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOn();
		}
	},
	enableBullets: function () {
		var buttonsToEnable = wc.interface.navigation.buttonTypes.Text;
		var buttonsToDisable = wc.interface.navigation.buttonTypes.None;
		var buttonsToHide = wc.interface.navigation.buttonTypes.None;
		var buttonsToActivate = wc.interface.navigation.buttonTypes.Bullets;

		wc.interface.elements.mediaBullets.toggleMainDiscussion(wc.interface.mediaBulletinsDisplayTypes.bullets);
		wc.interface.applyScroll('#Chapter_Element');
		wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide, buttonsToActivate);
	},
	disableBullets: function (d) {
		var buttonsToEnable = wc.interface.navigation.buttonTypes.Bullets;
		var buttonsToDisable = wc.interface.navigation.buttonTypes.None;
		var buttonsToHide = wc.interface.navigation.buttonTypes.None;
		var buttonsToActivate = wc.interface.navigation.buttonTypes.Text;

		wc.interface.elements.mediaBullets.toggleMainDiscussion(wc.interface.mediaBulletinsDisplayTypes.text);
		wc.interface.applyScroll('#Chapter_Element');
		wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide, buttonsToActivate);


	},
	printCertificate: function () {
		var bHidden = false;
		var divPrint = document.getElementById("idPrintCertificate");
		var divInstruct = document.getElementById("idCloseInstruction");
		var divMail = document.getElementById("idOfflineForm");
		if (divPrint != null && typeof (divPrint) == "object" && divInstruct != null && typeof (divInstruct) == "object" && divMail != null && typeof (divMail) == "object") {
			divPrint.style.visibility = "hidden";
			divInstruct.style.visibility = "hidden";
			divMail.style.display = "none";
			bHidden = true;
		}

		var divcoursetitle = document.getElementById("courseTitle");
		if (divcoursetitle != null && typeof (divcoursetitle) == "object" ) {
			divcoursetitle.style.visibility = "hidden";
		}
		wc.interface.actionHandler.printWindow();

		if (bHidden) {
			divPrint.style.visibility = "visible";
			divInstruct.style.visibility = "visible";
		//	if (objInfo == null)
		//		divMail.style.display = "block";

		if (divcoursetitle != null && typeof (divcoursetitle) == "object" ) {
			divcoursetitle.style.visibility = "visible";
		}

		}
	},
	printWindow: function () {
		var bV = parseInt(navigator.appVersion);
		if (bV >= 4)
			window.print();
	},
	submitSurveyAnswers: function (responses) {
		//function SendChapterSurvey(strChapter, strSurveyQuestion, responses)
		if (wc.lms.window.bNoLMS == true)
			return true;

		var nLMSResult = 999; // general failure

		// Report score to the LMS
		if (wc.lms.objInfo != null && wc.lms.window != null) {
			if (typeof (wc.lms.window) == "object") {
				if (typeof (wc.lms.window.svprogress) == "function") {
					try {
						if (isDefined(wc.interface.elements.survey.responses) && !isObjectEmpty(wc.interface.elements.survey.responses)) {
							var choice, response, arrParams;
							for (var revisionId in responses) {
								// make sure responses are all strings
								//revId = responses[i++].toString();
								choice = responses[revisionId].choice;
								try {
									choice = choice.toString();
								} catch (e) {
								}
								//response = adjustSurveyResponse(wc.interface.elements.survey.responses[revisionId].response);
								if (isDefined(responses[revisionId].response))
									response = wc.interface.elements.survey.adjustSurveyResponse(responses[revisionId].response);
								debugController.debug('survey tracking: {chapterIndex:' + wc.interface.currentElement.chapterIndex + ', revisionId:R' + revisionId + ', choice:' + choice + ', response:' + response + '}');
								nLMSResult = parent.lmswin.svprogress(wc.interface.currentElement.chapterIndex + 1, 'R' + revisionId, choice, response);
								if (0 != nLMSResult) {
									break;
								}
							}
						} else {
							alert("error in SendChapterSurvey, not enough data");
							// just the pivot question, without a pivot selected - responses is just the selected choice
							// extract revision -  assumes SurveyQuestion-'revID'
							// make sure responses are all strings
							var revisionid = strSurveyQuestion.substring(15, strSurveyQuestion.indexOf('-', 15));
							nLMSResult = parent.lmswin.svprogress(wc.interface.currentElement.chapterIndex + 1, revisionid, responses.toString(), '');
						}
					} catch (e) {
					}
				}
			}
		}

		if (0 != nLMSResult)
			NoConnectivityAtSurvey(wc.interface.currentElement.chapterIndex + 1);
		else
			wc.interface.elements.survey.responses = {};
		return (0 == nLMSResult);
	},
	helpers: {
		disableDefaultFunctionality: function (button) {
			//console.log('disabling default functionality');
			//console.log($(button).data("disabled"));
			if ($(button).data("disabled") != true) {
				$(button).data("disabled", true);
				//console.log($(button).data('onclick'));
				if (typeof $(button).data('onclick') == "undefined") {
					//console.log('no onclick stored yet. Go ahead and store the onclick');
					$(button).data('onclick', $(button).attr('onclick'));
				}
				var str = '$(button)[0].onclick = function () { return false; }';
				//console.log(str);
				eval(str);
			}
		},

		restoreDefaultFunctionality: function (button) {
			if ($(button).data("disabled") == true) {
				//console.log('restoring default functionality');
				$(button).data("disabled", false);
				var str = '$(button)[0].onclick = function () { ' + $(button).data("onclick") + '; }';
				//console.log(str);
				eval(str);
			}
		}
	}
};

wc.interface.getMyTime = function (d) {
	var s = "";
	s += d.getHours();
	s += ":";
	s += d.getMinutes();
	s += ":";
	s += d.getSeconds();

	s = d.getTime();
	return s;
};

wc.interface.startChapterTiming = function () {
	var status = document.getElementById("TestWarningDiv");
	if (isDefined(status))
		status.innerHTML = status.innerHTML + "start ";

	wc.interface.timingValid = true;
	wc.interface.currentChapterTime = 0;
	wc.interface.endTime = null;
	wc.interface.beginTime = new Date();
};

wc.interface.evaluateChapterTiming = function (curChapter) {
	if (0 == g_arrMinChapterTimes[curChapter - 1])
		return false;
	else {
		//	alert("time spent on chapter is " + nCurChapterTime);
		if (wc.interface.beginTime != null && wc.interface.endTime != null) {
			var status = document.getElementById("StartTimeDiv");
			if (status != null && typeof (status) == "object") {
				var s = wc.interface.getMyTime(wc.interface.beginTime);
				status.innerHTML = s;
			}
			status = document.getElementById("EndTimeDiv");
			if (status != null && typeof (status) == "object") {
				var s = wc.interface.getMyTime(endTime);
				status.innerHTML = s;
			}
			status = document.getElementById("ElapsedDiv");
			if (status != null && typeof (status) == "object") {
				status.innerHTML = nCurChapterTime;
			}
		}

		var status = document.getElementById("TestWarningDiv");
		if (status != null && typeof (status) == "object")
			status.innerHTML = status.innerHTML + "eval ";

		return (wc.interface.currentChapterTime >= wc.interface.g_arrMinChapterTimes[curChapter - 1] * 1000);
	}
};

wc.interface.stopChapterTiming = function () {
	if (wc.interface.timingValid) {
		var status = document.getElementById("TestWarningDiv");
		if (status != null && typeof (status) == "object")
			status.innerHTML = status.innerHTML + "stop ";

		wc.interface.endTime = new Date();
		wc.interface.currentChapterTime += (wc.interface.endTime.getTime() - wc.interface.beginTime.getTime());
	}

	wc.interface.timingValid = false;
};

wc.interface.pauseChapterTiming = function () {
	if (wc.interface.timingValid) {
		var status = document.getElementById("TestWarningDiv");
		if (status != null && typeof (status) == "object")
			status.innerHTML = status.innerHTML + "pause ";

		wc.interface.endTime = new Date();
		wc.interface.currentChapterTime += (wc.interface.endTime.getTime() - wc.interface.beginTime.getTime());

		wc.interface.timingValid = false;
	}
};

wc.interface.continueChapterTiming = function () {
	if (!wc.interface.timingValid) {
		var status = document.getElementById("TestWarningDiv");
		if (status != null && typeof (status) == "object")
			status.innerHTML = status.innerHTML + "continue ";

		wc.interface.endTime = null;
		wc.interface.beginTime = new Date();

		wc.interface.timingValid = true;
	}
};

wc.interface.gotFocus = function () {
	wc.interface.continueChapterTiming();
};

wc.interface.lostFocus = function () {
	wc.interface.pauseChapterTiming();
};

wc.interface.applyScroll = function (parentElement) {
	// get the element for which we have to add the fancy scroll
	var scrollWrapper = $('.iScroll', $(parentElement));

	// if there is no element, then just give up
	if (scrollWrapper.length == 0) {
		//console.log('nothing to scroll');
		return;
	}

	// make sure iScroll library is included
	if (typeof iScroll == 'undefined') {
		return;
	}

	// attach the scroll enhancer to each element
	$.each(scrollWrapper, function (index, element) {
		wc.interface._applyScroll(element, true);
	});
};

wc.interface._applyScroll = function (element, manualRetry) {

	//console.log("_applyScroll");
	var jQueryElement = $(element);

	// store the number of attepts, so we don't try forever
	if (!isDefined(jQueryElement.data('scrollAttachAttempts')) || manualRetry) {
		jQueryElement.data('scrollAttachAttempts', 0);
	} else {
		jQueryElement.data('scrollAttachAttempts', jQueryElement.data('scrollAttachAttempts') + 1);
	}

	// do not try to apply the scroll forever. If we don't succed in 10 attemtps, just give up
	if (jQueryElement.data('scrollAttachAttempts') > 10) {
		return;
	}

	// FIXME: add logic to detect when the content of the scrollable area has loaded
	//if (!something) {
	//	wc.interface.applyScroll.attempts++;
	//	setTimeout(wc.interface.applyScroll, 200);
	//}	
	
	//console.log(jQueryElement.is(":visible"));
	if (!jQueryElement.is(":visible")) {
		// FIXME: do progressive timeout (ie; first 5 attempts every 50 ms, next 5 every 200ms, etc);		
		var nextTimeout = 50;
		if (jQueryElement.data('scrollAttachAttempts') > 5)
			nextTimeout = 200;
		setTimeout(function () { wc.interface._applyScroll(element); }, nextTimeout);
		return;
	}

	
	
	// make sure the scroll enhancer gets attached only once
	if (!jQueryElement.data('scrollAttach')) {
		//console.log('scroll attached!');
		var scroll = new iScroll(element, { scrollbarClass: 'iScroll' });
		jQueryElement.data('scrollAttach', true);
		jQueryElement.data('scroll', scroll);
	} else {
		var scroll = $(element).data('scroll');
		if (isDefined(scroll)) {
			scroll.refresh();
		}
	}
};

wc.interface.resizeScrolls = function() {
	var iScrollElements = $('.iScroll:visible');
	iScrollElements.each(function (index, element) {
		var scroll = $(element).data('scroll');
		if (isDefined(scroll)) {
			scroll.refresh();
		}
	});
};
function matchGameDisableScroll(e) {
	e.preventDefault();
}

wc.interface.storage = {
	saveToStorage: function (key, value) {

		if (typeof (localStorage) == 'undefined')
			this.setCookie(key, value, 100);
		else
			localStorage.setItem(key, value);

	},
	loadfromStorage: function (key) {
		if (typeof (localStorage) == 'undefined')
			return this.getCookie(key);
		else
			return localStorage[key];
	},
	setCookie: function (c_name, value, exdays) {
		var exdate = new Date();
		exdate.setDate(exdate.getDate() + exdays);
		var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = c_name + "=" + c_value;
	},
	getCookie: function (c_name) {
		var i, x, y, ARRcookies = document.cookie.split(";");
		for (i = 0; i < ARRcookies.length; i++) {
			x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
			x = x.replace(/^\s+|\s+$/g, "");
			if (x == c_name) {
				return unescape(y);
			}
		}
	}
};

wc.interface.generalDisplayMethods = {
	selectListItem: function (name, choiceIndex, doNotClearSelection) {
		var li = document.getElementById(name + choiceIndex.toString());
		if (!(isDefined(doNotClearSelection) && doNotClearSelection == true)) {
			var ul = li.parentNode;
			var elementLi = ul.firstChild;
			while (elementLi) {
				if (isDefined(elementLi.className)) {
					elementLi.className = elementLi.className.replace('hidden', '');
					elementLi.className += 'hidden';
					//remove 'selected' class from all li, first div child (=uncheck mediaBullet_select elements)
					if ($(elementLi).find('div').length > 0 && isDefined($(elementLi).find('div')[0].className))
						$(elementLi).find('div')[0].className = $(elementLi).find('div')[0].className.replace('selected', '');
				}
				elementLi = elementLi.nextSibling;
			}
		}
		li.className = li.className.replace('hidden', '');
		//add 'selected' class to current li,first div child (=check mediaBullet_select element)
		if ($(li).find('div').length > 0 && isDefined($(li).find('div')[0].className)) $(li).find('div')[0].className += 'selected';
	}
};
wc.interface.customNavigation = {
	moveForward: function (numberOfChapters) {
		wc.interface.currentElement.chapterIndex = wc.interface.currentElement.chapterIndex + numberOfChapters - 1;
		wc.interface.navigateToElement(wc.interface.directions.next);
	},
	moveBackwards: function (numberOfChapters) {
		wc.interface.currentElement.chapterIndex = wc.interface.currentElement.chapterIndex - numberOfChapters + 1;
		wc.interface.navigateToElement(wc.interface.directions.previous);
	},
	replaceTagsWithJavaScript: function (html) {
		var htmlToReplace = html;
		htmlToReplace = htmlToReplace.replace(/<a href="navigate:moveForward\(([0-9]+)\);">/gi, '<a href="javascript:void(0);" id="navigate_moveForward_$1" onclick="wc.interface.customNavigation.moveForward($1);">');
		htmlToReplace = htmlToReplace.replace(/<a href="navigate:moveBackward\(([0-9]+)\);">/gi, '<a href="javascript:void(0);" id="navigate_moveBackward_$1" onclick="wc.interface.customNavigation.moveBackwards($1);">');
		htmlToReplace = htmlToReplace.replace('<a href="navigate:exitChapters();">', '<a href="javascript:void(0);" id="navigate_exitChapters" onclick="wc.interface.navigateToElementAfterLastChapter();">');
		return htmlToReplace;
	}
};


// Used to keep track of the data shown in the hidden layer
// like linkbuletins, pop questions ...
// We need to know this when opening frames like Notes, FAO, Help, to restore the previous data at close
wc.interface.layerData = {
	elementType: -1,
	data: {},
	initialize: function () {
		this.elementType = -1;
		this.data = {};
	}
};
