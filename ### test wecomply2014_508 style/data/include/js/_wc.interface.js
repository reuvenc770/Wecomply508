if (typeof (wc) == 'undefined')
	wc = {};


wc.interface = {
	contentDirection: 'ltr',
	directions: {
		next: 1,
		previous: 2
	},
	types: {
		flash: 1, html: 2
	},
	type: 2, /*set type to html, cannot do types.html since it is not initialized yet*/
	elementTypes: {
		none: 0, intro: 1, chapter: 2, term: 3, linkBulletin: 4, popQuestion: 5, finalQuizQuestion : 6, acknowledgment: 7, survey : 8, certificate : 9, bookmark : 10, gameChoice : 11, game: 12, gameIntro : 13, popBulletin : 14
	},
	linkBulletinTypes: { Code: 1, News: 2, Law : 3 },
	displayTypes: {Container:1, Layer:2},
	currentElement: {
		elementType: 1, /*set type to elementType, cannot do elementTypes.intro since it is not initialized yet*/
		chapterIndex: 0,
		displayType: 1
	},
	animationOptions: { none: 0, slideLeft: 1, textWriter: 2, slideLeftAndFade : 3, slideTop : 4 },
	options: {
		pageChange: {
			replacementMethod: 0
		},
		displayLayer: {
			linkBulletin: {
				textDisplay: 0
			}
		}, 
		mediaPlayer: {
			showVideoControls : false,
			videoSizePercentage : null,
			enableAutoPlay : true
		},
		games: {
			randomizeChoices : false
		}
	}
};

wc.init = function (data) {

	if (typeof (data) != 'undefined') {
		wc.data = data;
	}
	if (typeof (wc.data) == 'undefined' || typeof (wc.data.jsonData) == 'undefined')
		return false; //TODO: show error to user or at least log it
	else if (typeof (wc.data.jsonData.chapters) == 'undefined')
		return false; //TODO: show error to user or at least log it
	//TODO: check for flash versioning and flash course

	wc.lms.window = parent.lmswin;
	if (!wc.WindowLoaded || typeof (wc.lms.window) != "object" || wc.lms.window.bReady != true) {
		// LMS window not loaded yet; wait 100ms and try again
		setTimeout("wc.init()", 100);
	} else {
		if (wc.lms.delayStart) {
			wc.lms.delayStart = false;
			setTimeout("wc.init()", 1500);
		} else {
			//			if (document.all)	// IE
			//				document.body.style.overflow = "auto";

			// Call the LMS Launch function to initialize communication and get info
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
						//updateBookmarkDiv();
						return wc.interface.displayLayer(wc.interface.elementTypes.bookmark, bm);

					}
				}
			} else {
				wc.lms.window.bNoLMS = true;
				wc.lms.window.bHasConnectitivity = false;
				wc.lms.startTime = new Date();
				//TODO: enable tracking
				var flagEnableTracking = wc.request.queryString("OFFTRK");
				//if (flagEnableTracking == null || typeof(flagEnableTracking) == "undefined" || 1 == flagEnableTracking)
				//TODO: alert for offline 
				//document.getElementById("idOfflineForm").style.display = "block";
			}

			wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, 0);
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

String.prototype.replaceTag = function(elementType, key, replacementValue) {
	return this.replace((new RegExp('\\{\\$' + elementType + ':' + key + '\\}', 'gi')), replacementValue);
};

wc.interface.loadGameTemplates = function (variety) {
	wc.ajax.get('/Wc2/training/GameData.aspx?templatePlatform=' + wc.data.values.templatePlatform + '&gameVariety=' + variety, function (data) {
		for (var itemKey in data.responseJson) {
			//if (typeof (wc.data.templateElements[itemKey]) == 'undefined' || wc.data.templateElements[itemKey] == null)
			wc.data.templateElements[itemKey] = data.responseJson[itemKey];
		}
	}, null, false);
};

wc.interface.replaceCurrentElement = function (nextElementType, nextChapterIndex) {
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

			currentElementContainer.innerHTML = templateHtml;

		} else {
			templateHtml = wc.data.templateElements.chapter;

			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Header', nextChapter.heading);
			templateHtml = templateHtml.replaceTag('Content', 'Chapter_Discussion', nextChapter.discussion);

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
							return wc.interface.getResource('InTheNewsFAQs');
							break;
						case "policy":
							return wc.interface.getResource('Policy');
							break;
						case "do's & don'ts":
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
		templateHtml = templateHtml.replace(/<a href="term:([0-9]+)">/g, '<a href="javascript:;" id="Term_$1" onclick="wc.interface.actionHandler.displayTerm($1);">');
		currentElementContainer.innerHTML = templateHtml;

		if (isDefined(document.getElementById('Button_Next'))) {
			if (isDefined(nextChapter.survey)) {
				document.getElementById('Button_Next').style.visibility = 'hidden';
				document.getElementById('Button_Next').enabled = false;
			}
		}
		//Pagination, has to be done after the pagination is part of the DOM
		document.getElementById('Chapter_PageInfo_Content').innerHTML = document.getElementById('Chapter_PageInfo_Content').innerHTML.replace('$1', nextChapterIndex + 1).replace('$2', wc.data.jsonData.chapters.length)

		//illustration has to be done after element is in DOM
		if (typeof (nextChapter.illustration) != 'undefined')
			wc.interface.elements.illustration.inject('Chapter_Illustration_Content', nextChapter.illustration, true);
		else //no illustration found
			document.getElementById('Chapter_Illustration_Content').innerHTML = '';


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
				/*currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('LayerElementContainer').style.display = 'none';
				document.getElementById('CurrentElementContainer').style.display = '';
				layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();
				}*/
				currentElementopacityTween.start();
			} else {
				//TODO: implement better way to put opacity back
				currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 100, 0);
				currentElementopacityTween.start();
			}

			t1 = new Tween(document.getElementById('CurrentElementContainer').style, 'left', Tween.regularEaseOut, 0 - wc.GetWindowWidth(), 0, 0.3, 'px');
			t1.start();

			wc.interface.actionHandler.scrollToTop();

		} else { //if (wc.interface.options.pageChange == wc.interface.animationOptions.slideLeft) {
			//TODO: implement better way to put opacity back
			currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 100, 0);
			currentElementopacityTween.start();
			currentElementContainer.innerHTML = templateHtml;
			wc.interface.actionHandler.scrollToTop();
		}


		//Video/Audio player has to be done after the elements are part of the DOM
		if (typeof (wc.data.jsonData.chapters[nextChapterIndex].video) != 'undefined' && wc.data.jsonData.chapters[nextChapterIndex].video != null) {
			if (wc.data.jsonData.chapters[nextChapterIndex].chapterOptions.autoplay == 'true')
				wc.mediaPlayer.video.play(nextChapterIndex);
		}

		if (typeof (wc.data.jsonData.chapters[nextChapterIndex].audio) != 'undefined' && wc.data.jsonData.chapters[nextChapterIndex].audio != null) {

			document.getElementById('Button_PlayAudio').style.display = 'none';
			document.getElementById('Button_PauseAudio').style.display = '';

			if (wc.interface.options.mediaPlayer.allowAudioAutoPlay && wc.data.jsonData.chapters[nextChapterIndex].chapterOptions.autoplay == 'true')
				wc.mediaPlayer.audio.play(nextChapterIndex);
		} else {
			document.getElementById('Button_PlayAudio').style.display = 'none';
			document.getElementById('Button_PauseAudio').style.display = 'none';
		}

	}

	var paginationContainer = document.getElementById('Pagination_Container');

	//TODO: startChapterTiming();
	wc.lms.updateBookmark(nextChapterIndex + 1);
	wc.interface.currentElement.chapterIndex = nextChapterIndex;
	wc.interface.currentElement.elementType = nextElementType;
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
		wc.interface.game.currentQuestions = null;
		wc.interface.game.currentQuestion = null;
		wc.interface.game.chapterQuestionsCompleted = false;
		wc.interface.game.variety = wc.data.jsonData.quiz.games[gameIndex].variety.replace('Both', ''); ;
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
		if (choice.isCorrect == "false") {
			if (wc.interface.game.correctAnswerOnFirstTry == null)
				wc.interface.game.correctAnswerOnFirstTry = false;
		} else {
			if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
				wc.interface.game.gameComplete = true;
			} else {
				if (wc.interface.game.correctAnswerOnFirstTry == null) {
					wc.interface.game.correctAnswerOnFirstTry = true;

					wc.interface.game.questionsCorrectOnFirstTry++;
					if (wc.interface.game.questionsCorrectOnFirstTry < wc.interface.game.questionChapters.length) {
						wc.interface.game.currentQuestionChapterIndex++;

						if (wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex] == -1)
							wc.interface.game.currentQuestions = wc.data.jsonData.quizQuestions;
						else
							wc.interface.game.currentQuestions = wc.data.jsonData.chapters[wc.interface.game.questionChapters[wc.interface.game.currentQuestionChapterIndex]].quizQuestions;

						wc.interface.game.currentQuestions = wc.tools.shuffle(wc.interface.game.currentQuestions);
					} else {
						wc.interface.game.currentQuestions = null;
						wc.interface.game.chapterQuestionsCompleted = true;
					}
				}
			}
		}
		return choice;
	},
	loadQuestion: function () {
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

		//if (wc.interface.game.currentChapter == null)

	}
	//wc.data.jsonData.chapters[0].quizQuestions[0]
};

wc.interface.displayLayer = function (elementType, data) {
	wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_DisplayLayer, { elementType: elementType, data: data });

	if (elementType == wc.interface.elementTypes.game) {
		wc.mediaPlayer.stopCurrentActiveMedia();

		var game = wc.data.jsonData.quiz.games[wc.interface.game.gameIndex];

		var question = wc.interface.game.loadQuestion();

		var templateHtml = wc.data.templateElements.game_quiz;
		var itemHtml = wc.data.templateElements.game_quiz_ChoiceItem;
		//wc.interface.game.questionChapters[wc.interface.game.questionChapters.length];

		var choiceHtml = '';
		for (var choiceIndex in (!wc.interface.game.chapterQuestionsCompleted && wc.interface.options.games.randomizeChoices ? wc.tools.shuffle(question.choices) : question.choices)) {
			var tmpHtml = itemHtml;
			tmpHtml = tmpHtml.replaceTag('Content', 'Quiz_ChoiceItem_Body', question.choices[choiceIndex].body);
			tmpHtml = tmpHtml.replaceTag('Content', 'Quiz_ChoiceItem_Id', choiceIndex);
			tmpHtml = tmpHtml.replaceTag('Content', 'gameIndex', wc.interface.game.gameIndex);

			choiceHtml += tmpHtml;
		}

		templateHtml = templateHtml.replaceTag('Content', 'Quiz_Body', question.body);
		templateHtml = templateHtml.replaceTag('Content', 'Quiz_Choices', choiceHtml);
		templateHtml = templateHtml.replaceTag('Content', 'ContinueResource', wc.interface.getResource('continue'));


		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		var layerElementContainer = document.getElementById('Quiz_GameContent');
		layerElementContainer.innerHTML = templateHtml;

		if (typeof (question.illustration) != 'undefined')
			wc.interface.elements.illustration.inject('Quiz_Illustration_Content', question.illustration, true);
		else
			document.getElementById('Quiz_Illustration_Content').innerHTML = '';

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();

		if (wc.interface.game.chapterQuestionsCompleted)
			wc.interface.currentElement.elementType = wc.interface.elementTypes.finalQuizQuestion;
		else
			wc.interface.currentElement.elementType = wc.interface.elementTypes.game;

		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_LoadQuestion, { elementType: wc.interface.currentElement.elementType, data: null });

	} else if (elementType == wc.interface.elementTypes.gameIntro) {

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
		if (isDefined(templateHtml) || templateHtml != '') {
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_LoadingText', wc.interface.getResource('LoadingGame'));
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_WelcomeText', game.introduction || '');
			templateHtml = templateHtml.replaceTag('Content', 'Game_Intro_StartQuizText', wc.interface.getResource('StartQuiz'));
			templateHtml = templateHtml.replaceTag('Content', 'gameIndex', wc.interface.game.gameIndex);
		} else {
			skipIntro = true;
		}

		templateHtml = wc.data.templateElements.game_quiz_Wrapper.replaceTag('Content', 'quizContent', templateHtml);
		templateHtml = wc.data.templateElements.layerWrapper.replaceTag('Content', 'LayerContent', templateHtml);

		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		layerElementContainer.innerHTML = templateHtml;

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		//wc.lms.updateBookmark(-1);
	
		if (skipIntro)
			wc.interface.actionHandler.displayGame(wc.interface.game.gameIndex);
		else
			wc.interface.currentElement.elementType = wc.interface.elementTypes.gameIntro;

		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_DisplayIntroLayer, { elementType: wc.interface.currentElement.elementType, data: null });

	} else if (elementType == wc.interface.elementTypes.gameChoice) {
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
		templateHtml = templateHtml.replaceTag('Content', 'Game_Introduction', wc.data.jsonData.quiz.introduction);

		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();
		wc.lms.updateBookmark(-1);
		wc.interface.currentElement.elementType = wc.interface.elementTypes.gameChoice;
	} else if (elementType == wc.interface.elementTypes.certificate) {
		wc.mediaPlayer.stopCurrentActiveMedia();
		var templateHtml = wc.data.templateElements.certificate;

		templateHtml = templateHtml.replaceTag('Content', 'Certificate_ProgramName', wc.data.jsonData.name);
		templateHtml = templateHtml.replaceTag('Content', 'SurveyUrl', wc.interface.elements.survey.surveyUrl());
		//templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		if (wc.interface.elements.survey.hasAnsweredQuestions)
			document.getElementById('SurveyAnswers').style.display = '';
		else
			document.getElementById('SurveyAnswers').style.display = 'none';

		document.getElementById('FirstName').innerHTML = wc.lms.getFirstName();
		document.getElementById('LastName').innerHTML = wc.lms.getLastName();
		document.getElementById('CurDate').innerHTML = wc.lms.getDate();


		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();

		wc.interface.currentElement.elementType = wc.interface.elementTypes.certificate;

	} else if (elementType == wc.interface.elementTypes.bookmark) {
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

		layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
		layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;

		layerElementContainer.innerHTML = templateHtml;

		document.LMSForm.bookmark[0].value = wc.lms.bookmark;
		document.LMSForm.bookmark[0].checked = true;

		if (typeof (document.getElementById('CurrentElementContainer')) != 'undefined') {
			currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
			currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('CurrentElementContainer').style.display = 'none';
				document.getElementById('LayerElementContainer').style.display = '';
				layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start();
			};
			currentElementopacityTween.start();
		} else {
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		}

		wc.interface.currentElement.elementType = wc.interface.elementTypes.bookmark;
	} else if (elementType == wc.interface.elementTypes.acknowledgment) {
		wc.mediaPlayer.stopCurrentActiveMedia();
		var templateHtml = wc.data.templateElements.acknowledgment;

		templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Heading', wc.data.jsonData.acknowledgment.heading);
		templateHtml = templateHtml.replaceTag('Content', 'Acknowledgment_Body', wc.data.jsonData.acknowledgment.body);

		var layerElementContainer = document.getElementById('LayerElementContainer');
		layerElementContainer.innerHTML = templateHtml;

		var currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			var layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();

		wc.interface.currentElement.elementType = wc.interface.elementTypes.acknowledgment;
		//Acknowledgment_Refusal, Acknowledgment_Agree, Acknowledgment_Previous, Acknowledgment_Confirm
		//, Acknowledgment_Body, Acknowledgment_Refusal, 
	}
	if (elementType == wc.interface.elementTypes.popQuestion || elementType == wc.interface.elementTypes.finalQuizQuestion) {
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

		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Body', data.body);
		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Buttons', continueButtonTemplate);
		templateHtml = templateHtml.replaceTag('Content', 'QuizQuestion_Choices', choiceHtml);

		var layerElementContainer = document.getElementById('LayerElementContainer');

		layerElementContainer.innerHTML = templateHtml;

		//Needs to be done after elemnt is in DOM
		if (typeof (data.illustration) != 'undefined')
			wc.interface.elements.illustration.inject('QuizQuestion_Illustration_Content', data.illustration, true);
		else
			document.getElementById('QuizQuestion_Illustration_Content').innerHTML = '';

		//layerElementContainer.style.position = 'absolute';
		layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
		layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;

		var continueButton = document.getElementById('QuizQuestion_ContinueButton');

		if (typeof (continueButton) != 'undefined' && continueButton != null) {
			continueButton.style.visibility = 'hidden';
			continueButton.onclick = function () {
				wc.interface.navigateToElement(wc.interface.directions.next);
				wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);
				/*currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
				currentElementopacityTween.onMotionFinished = function () {
				document.getElementById('LayerElementContainer').style.display = 'none';
				document.getElementById('CurrentElementContainer').style.display = '';
				layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
				layerElementopacityTween.start()
				}
				currentElementopacityTween.start()*/
			};
		}

		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();

		wc.interface.currentElement.elementType = elementType;

	} else if (elementType == wc.interface.elementTypes.term) {
		wc.mediaPlayer.stopCurrentActiveMedia(true);
		var templateHtml = wc.data.templateElements.term;
		if (typeof (data.definition) == 'undefined')
			data.definition = '';
		if (typeof (data.name) == 'undefined')
			data.name = '';

		templateHtml = templateHtml.replaceTag('Content', 'Term_Definition', data.definition);
		templateHtml = templateHtml.replaceTag('Content', 'Term_Name', data.name);

		var layerElementContainer = document.getElementById('LayerElementContainer');

		layerElementContainer.innerHTML = templateHtml;
		//layerElementContainer.style.position = 'absolute';
		layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
		layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;


		var closeButton = document.getElementById('Button_Close');

		if (typeof (closeButton) != 'undefined' && closeButton != null) {
			closeButton.onclick = function () {
				if (wc.interface.handlers.fireEvent(wc.interface.handlers.onBefore_CloseDisplayLayer, { elementType: wc.interface.currentElement.elementType, data: null })) {
					currentElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 100, 0, 0.2);
					currentElementopacityTween.onMotionFinished = function () {
						document.getElementById('LayerElementContainer').style.display = 'none';
						document.getElementById('CurrentElementContainer').style.display = '';
						layerElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 0, 100, 0.2);
						layerElementopacityTween.start();

						wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);

					};
					currentElementopacityTween.start();
					wc.interface.currentElement.elementType = wc.interface.elementTypes.chapter;

				}
				wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_CloseDisplayLayer, { elementType: wc.interface.currentElement.elementType, data: null });
			};
		}

		//Hide main layer
		currentElementopacityTween = new OpacityTween(document.getElementById('CurrentElementContainer'), Tween.regularEaseOut, 100, 0, 0.1);
		currentElementopacityTween.onMotionFinished = function () {
			document.getElementById('CurrentElementContainer').style.display = 'none';
			document.getElementById('LayerElementContainer').style.display = '';
			layerElementopacityTween = new OpacityTween(document.getElementById('LayerElementContainer'), Tween.regularEaseOut, 0, 100, 0.1);
			layerElementopacityTween.start();
		};
		currentElementopacityTween.start();

		wc.interface.currentElement.elementType = wc.interface.elementTypes.term;

	} else if (elementType == wc.interface.elementTypes.linkBulletin || elementType == wc.interface.elementTypes.popBulletin) {
		wc.mediaPlayer.stopCurrentActiveMedia(true);
		var templateHtml = wc.data.templateElements.linkBulletin;
		if (typeof (data.body) == 'undefined')
			data.body = '';
		if (typeof (data.name) == 'undefined')
			data.name = '';

		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Body', data.body || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Subhead', data.subhead || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Headline', data.headline || '');
		templateHtml = templateHtml.replaceTag('Content', 'LinkBulletin_Name', data.name || '');

		var layerElementContainer = document.getElementById('LayerElementContainer');

		layerElementContainer.innerHTML = templateHtml;

		if (typeof (data.illustration) != 'undefined')
			wc.interface.elements.illustration.inject('LinkBulletin_Illustration_Content', data.illustration, true);
		else
			document.getElementById('LinkBulletin_Illustration_Content').innerHTML = '';

		var newsLayout = document.getElementById('newsLayout');
		if (/*elementType == wc.interface.elementTypes.linkBulletin &&*/data.variety == "News" && isDefined(newsLayout))
			newsLayout.style.display = '';
		else if (isDefined(newsLayout))
			newsLayout.style.display = 'none';

		//layerElementContainer.style.position = 'absolute';
		layerElementContainer.style.left = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).right;
		layerElementContainer.style.top = wc.GetObjectBoundaries(document.getElementById('CurrentElementContainer')).top;

		var closeButton = document.getElementById('Button_Close');

		if (typeof (closeButton) != 'undefined' && closeButton != null) {
			closeButton.onclick = function () {
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

						wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);
					};
					currentElementopacityTween.start();
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

		wc.interface.currentElement.elementType = elementType;
	}
	//return true;
	wc.interface.currentElement.displayType = wc.interface.displayTypes.Layer;

	wc.interface.handlers.fireEvent(wc.interface.handlers.onAfter_DisplayLayer, { elementType: elementType, data: data });

	return elementType;
};

wc.interface.navigateToElement = function(direction) {
	//TODO: add to the following if statement the next element after the chapters
	//TODO: add stopChapterTiming();
	//TODO: stop active media

	if (typeof(direction) == 'undefined') {
		direction = directions.next;
	}

	var nextChapterIndex = wc.interface.currentElement.chapterIndex;
	var nextElementType = wc.interface.currentElement.elementType;

	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.intro && direction == wc.interface.directions.next) {
		//Nothing to do at the moment
	} else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.intro && direction == wc.interface.directions.previous) {
		nextElementType = wc.interface.elementTypes.none;
		return;
		//At the moment there is nothing before intro so you cannot go back
	} else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.popBulletin || wc.interface.currentElement.elementType == wc.interface.elementTypes.popQuestion || wc.interface.currentElement.elementType == wc.interface.elementTypes.linkBulletin || wc.interface.currentElement.elementType == wc.interface.elementTypes.term) {
		if (wc.interface.currentElement.chapterIndex >= wc.data.jsonData.chapters.length - 1) {
			nextElementType = wc.interface.navigateToElementAfterLastChapter();
		} else {
			nextChapterIndex = wc.interface.currentElement.chapterIndex + 1;
			nextElementType = wc.interface.elementTypes.chapter;
		}
	} else if (wc.interface.currentElement.elementType == wc.interface.elementTypes.chapter) {
		if (typeof(wc.interface.currentElement.chapterIndex) != 'undefined') {
			if (direction == wc.interface.directions.previous) {
				if (wc.interface.currentElement.chapterIndex <= 0) {
					nextElementType = wc.interface.elementTypes.intro;
					nextChapterIndex = 0;
				} else {
					nextChapterIndex = wc.interface.currentElement.chapterIndex - 1;
					nextElementType = wc.interface.elementTypes.chapter;
				}
			} else {
				var popQuestion = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuestion;
				if (typeof(popQuestion) != 'undefined') {
					wc.interface.actionHandler.displayQuizQuestion(popQuestion, wc.interface.elementTypes.popQuestion);
					debugController.debug('navigateToElement:popQuestion{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');
					return true;
				} else {

					if (wc.interface.currentElement.chapterIndex >= wc.data.jsonData.chapters.length - 1) {
						nextElementType = wc.interface.navigateToElementAfterLastChapter();
					} else {
						nextChapterIndex = wc.interface.currentElement.chapterIndex + 1;
						nextElementType = wc.interface.elementTypes.chapter;
					}
				}
			}
		} else {
			//this should never happen
			debugController.debug('navigateToElement - chapter undefined');
			return;
		}
	}

	debugController.debug('navigateToElement:{direction:' + direction + ',nextElementType:' + nextElementType + ',nextChapterIndex:' + nextChapterIndex + '}');

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

	if (nextElementType == wc.interface.elementTypes.chapter)
		wc.interface.replaceCurrentElement(nextElementType, nextChapterIndex);

};
//intro
//chapters / can contain survey
//acknowlodgement
//games
//final certificate

wc.interface.navigateToElementAfterLastChapter = function () { //returns element type
	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
		return wc.interface.actionHandler.displayCertificate();
	}

	if (wc.interface.currentElement.elementType == wc.interface.elementTypes.chapter) {
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

wc.interface.resourceParser = function(html){
	//TODO: strip out resource request tags and replace with values
	return html;
};
wc.interface.elements = {
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
				swfobject.embedSWF('/datafiles/' + illustration.src, id, illustration.width, illustration.height, '6', false, flashvars, params, attributes);
			}
			else {
				illustrationContainer.innerHTML = '<img src="/datafiles/' + illustration.src + '" width="' + illustration.width + '" height="' + illustration.height + '" />';
			}
		}
	},
	nextButton: {
		enable: function () {
			var Button_Next = document.getElementById('Button_Next');
			if (!isDefined(Button_Next))
				return false;

			Button_Next.disabled = false;
			Button_Next.style.visibility = 'visible';
		},
		disable: function (hide) {
			var Button_Next = document.getElementById('Button_Next');
			if (!isDefined(Button_Next))
				return false;

			Button_Next.disabled = true;
			if (hide)
				Button_Next.style.visibility = 'hidden';
		}
	},
	previousButton: {
		enable: function () {
			var Button_Previous = document.getElementById('Button_Previous');
			if (!isDefined(Button_Previous))
				return false;

			Button_Previous.disabled = false;
			Button_Previous.style.visibility = 'visible';
		},
		disable: function (hide) {
			var Button_Previous = document.getElementById('Button_Previous');
			if (!isDefined(Button_Previous))
				return false;

			Button_Previous.disabled = true;
			if (hide)
				Button_Previous.style.visibility = 'hidden';
		}
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

			if (isDefined(responseValue))
				wc.interface.elements.survey.responses[id].response = responseValue;
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
	}
};
wc.interface.actionHandler = {
	types: { nextButton: 1, previousButton: 2 },
	fire: function (args) {

	},
	scrollToTop: function () {

		/*var scrollElement = document.createElement("a");
		scrollElement.name = "scrollToTopElement";
		scrollElement.id = "scrollToTopElement";
		document.body.insertBefore(scrollElement, null);
		window.location.hash = 'scrollToTopElement';
		//scrollElement.parentNode.removeChild(scrollElement);
		
		
		*/
		//if (document.height < window.outerHeight) {
		//	document.body.style.height = (window.outerHeight + 50) + 'px';
		//}
		//setTimeout(function () {
		try {
			wc.interface.parentWindow.scrollTo(0, 0);
			window.scrollTo(0, 0);
		}
		catch (ex) {
			didScroll = false;
		}
		//}, 0000);

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
		//if there are any pending responses for this chapter send them
		if (isDefined(wc.interface.elements.survey.responses) && !isObjectEmpty(wc.interface.elements.survey.responses)) {
			wc.interface.actionHandler.submitSurveyAnswers(wc.interface.elements.survey.responses);
		}

		if (wc.interface.actionHandler.displayPopBulletin() != wc.interface.elementTypes.popBulletin)
			wc.interface.navigateToElement(wc.interface.directions.next);
	},
	previousButton: function () {
		wc.interface.navigateToElement(wc.interface.directions.previous);
	},
	quizQuestion_MultipleChoiceOneAnswerSelected: function (choiceIndex, elementType) {

		var choice; var isCorrect = null;
		var QuizQuestion_ContinueButton = document.getElementById('QuizQuestion_ContinueButton');
		if (elementType == wc.interface.elementTypes.popQuestion) {
			choice = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].popQuestion.choices[choiceIndex];
			QuizQuestion_ContinueButton.onclick = function () {
				wc.interface.actionHandler.nextButton();
			};

			if (choice.isCorrect == "false") {
				isCorrect = false;
			} else {
				isCorrect = true;
			}
		}


		var QuizQuestion_Body_Feedback = document.getElementById('QuizQuestion_Body_Feedback');
		var QuizQuestion_Body_Feedback_AgreeText = document.getElementById('QuizQuestion_Body_Feedback_AgreeText');
		var tryAgainElement = document.getElementById('QuizQuestion_Body_Feedback_TryAgain');

		if (isCorrect == false) {
			QuizQuestion_ContinueButton.disabled = true;
			QuizQuestion_ContinueButton.style.visibility = 'hidden';
			QuizQuestion_Body_Feedback.innerHTML = choice.feedback;

			if (isDefined(QuizQuestion_Body_Feedback_AgreeText)) {
				QuizQuestion_Body_Feedback_AgreeText.innerHTML = wc.interface.getResource('WeDisagree');
				QuizQuestion_Body_Feedback_AgreeText.className = "disagreeText";
			}

			if (isDefined(tryAgainElement)) {
				tryAgainElement.innerHTML = wc.interface.getResource('Pleasetryagain');
				tryAgainElement.style.display = '';
			}

		}
		else if (isCorrect == true) {
			if (isDefined(tryAgainElement)) {
				tryAgainElement.style.display = 'none';
				tryAgainElement.innerHTML = '';
			}
			QuizQuestion_ContinueButton.disabled = false;
			QuizQuestion_ContinueButton.style.visibility = 'visible';
			QuizQuestion_Body_Feedback.innerHTML = choice.feedback;
			if (isDefined(QuizQuestion_Body_Feedback_AgreeText)) {
				QuizQuestion_Body_Feedback_AgreeText.innerHTML = wc.interface.getResource('WeAgree');
				QuizQuestion_Body_Feedback_AgreeText.className = "agreeText";
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
						wc.interface.elements.survey.setResponse(survey.id, survey.pivotQuestion.choices, choiceIndex.toInt() + 1, null);
						return true;
					}
				} else {
					if (document.getElementById('Survey_PivotQuestion_' + choiceIndex).checked) {
						isTriggerCheckedOrSkipped = true;
						wc.interface.elements.survey.setResponse(survey.id, survey.pivotQuestion.choices, choiceIndex.toInt() + 1, null);
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
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);
	},
	survey_MultipleChoiceOneAnswerSelected: function (choiceIndex, questionIndex) {
		var question = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey.surveyQuestions[questionIndex];
		var choice = question.choices[choiceIndex];

		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);

		if (choice.isCorrect == "true") {

		}
		else {

			if (choice.hasTextInput == "true") {
				textInputTemplate = wc.data.templateElements.survey_TextInput;

				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Id', choiceIndex);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Name', choiceIndex);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'elementType', wc.interface.elementTypes.survey);
				textInputTemplate = textInputTemplate.replaceTag('Content', 'Survey_TextInput_Label', '');

				textInputTemplate = textInputTemplate.replaceTag('Content', 'questionIndex', questionIndex);

				document.getElementById('Survey_Body_Feedback_subQuestion' + questionIndex).innerHTML = textInputTemplate;
			}
			else {
				document.getElementById('Survey_Body_Feedback_subQuestion' + questionIndex).innerHTML = '';
			}
		}


	},
	survey_TextInputKeyUp: function (element) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);
	},
	survey_BooleanSelected: function (value) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);
	},
	survey_MultipleChoiceMultipleAnswerSelected: function (choiceIndex, questionIndex) {
		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);
	},
	survey_PivotQuestionSelected: function (choiceIndex) {
		choice = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].survey.pivotQuestion.choices[choiceIndex];

		if (wc.interface.actionHandler.survey_CheckIfNextIsAllowed())
			wc.interface.elements.nextButton.enable();
		else
			wc.interface.elements.nextButton.disable(true);

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
	displayLinkBulletin: function (linkBulletinType) {
		if (linkBulletinType == wc.interface.linkBulletinTypes.Code) {
			var linkBulletin = null;
			for (var linkBulletinIndex in wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins) {
				if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex].variety == 'Code') {
					linkBulletin = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex];
					break;
				}
			}

			return wc.interface.displayLayer(wc.interface.elementTypes.linkBulletin, linkBulletin);
		}
		else if (linkBulletinType == wc.interface.linkBulletinTypes.News) {
			var linkBulletin = null;
			for (var linkBulletinIndex in wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins) {
				if (wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex].variety == 'News') {
					linkBulletin = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].linkBulletins[linkBulletinIndex];
					break;
				}
			}

			return wc.interface.displayLayer(wc.interface.elementTypes.linkBulletin, linkBulletin);
		}
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

		return wc.interface.displayLayer(wc.interface.elementTypes.game, gameIndex);
	},
	displayGameIntro: function (gameIndex) {
		return wc.interface.displayLayer(wc.interface.elementTypes.gameIntro, gameIndex);
	},
	displayGameChoice: function () {
		return wc.interface.displayLayer(wc.interface.elementTypes.gameChoice);
	},
	game_answerQuestion: function (choiceIndex) {
		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onBefore_AnswerQuestion, choiceIndex);
		var feedbackElement = document.getElementById('Quiz_Body_Feedback');
		var agreeElement = document.getElementById('Quiz_Body_Feedback_AgreeText');
		var feedbackTextElement = document.getElementById('Quiz_Body_Feedback_Text');
		var tryAgainElement = document.getElementById('Quiz_Body_Feedback_TryAgain');
		var continueButton = document.getElementById('Quiz_Body_Feedback_ContinueButton');
		var isFirstAttempt = (wc.interface.game.correctAnswerOnFirstTry == null);
		var choice = wc.interface.game.answerQuestion(choiceIndex);

		if (choice.isCorrect == "true") {
			feedbackTextElement.innerHTML = choice.feedback;
			agreeElement.innerHTML = wc.interface.getResource('WeAgree');
			agreeElement.className = 'agreeText';
			continueButton.style.display = '';
			tryAgainElement.style.display = 'none';
			tryAgainElement.innerHTML = '';
			if (isFirstAttempt && wc.interface.game.correctAnswerOnFirstTry == true) {
				document.getElementById('Quiz_ChoiceItemLabel_' + choiceIndex).className += ' firstSelectedAnswer';
				if (wc.interface.game.chapterQuestionsCompleted && wc.interface.currentElement.elementType == wc.interface.elementTypes.game) {
					//agreeElement.innerHTML = wc.interface.getResource('Congratulations');
					//feedbackTextElement.innerHTML = wc.interface.getResource('LastQuestion');
				}
			}
			if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
				agreeElement.className = 'finalAgreeText';
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

		}
		wc.interface.handlers.games.fireEvent(wc.interface.handlers.games.onAfter_AnswerQuestion, choice);
	},
	game_gotoNextQuestion: function () {
		if (wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion)
			wc.interface.navigateToElementAfterLastChapter();
		else
			return wc.interface.displayLayer(wc.interface.elementTypes.game, null);
	},
	displayCertificate: function () {
		return wc.interface.displayLayer(wc.interface.elementTypes.certificate);
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
	}, acknowledgmentPreviousButton: function () {
		document.getElementById('Acknowledgment_Refusal_Content').style.display = 'none';
		document.getElementById('Acknowledgment_Previous').style.display = 'none';
		document.getElementById('Acknowledgment_Confirm').style.display = 'none';
		document.getElementById('Acknowledgment_Refusal_Content').innerHTML = '';
		document.getElementById('Acknowledgment_Body_Content').style.display = '';
		document.getElementById('Acknowledgment_Agree').style.display = '';
		document.getElementById('Acknowledgment_Refusal').style.display = '';

	}, acknowledgmentConfirmButton: function () {
		// Report to the LMS
		wc.lms.reportNoAck(true);
		top.close();
		/*if (wc.lms.objInfo != null && parent.lmswin != null) {
		if (typeof (parent.lmswin) == "object") {
		if (typeof (parent.lmswin.fail) == "function")
		parent.lmswin.fail(bExit);
		}
		}*/
	}, bookmarkGoto: function (value) {
		wc.lms.highestBookmark = 0;
		if (typeof (value) == 'undefined' || value == null) {
			value = 0;
			if (document.LMSForm.bookmark[0].checked) {
				if (wc.lms.bookmark == "-1")
					return wc.interface.actionHandler.displayGameChoice();
				else
					value = wc.lms.bookmark - 1;
			} else {
				value = 0;
			}
		}
		wc.interface.replaceCurrentElement(wc.interface.elementTypes.chapter, value);
		//TODO: start game startGame(position);
	},
	playAudio: function (enableAutoPlay) {
		if (enableAutoPlay)
			wc.interface.options.mediaPlayer.allowAudioAutoPlay = true; 
		wc.mediaPlayer.audio.play(wc.interface.currentElement.chapterIndex);
		if (wc.mediaPlayer.status.action == wc.mediaPlayer.actions.playing) {
			document.getElementById('Button_PlayAudio').style.display = 'none';
			document.getElementById('Button_PauseAudio').style.display = '';
		}
		else {
			document.getElementById('Button_PlayAudio').style.display = '';
			document.getElementById('Button_PauseAudio').style.display = 'none';
		}
	},
	pauseAudio: function (disableAutoPlay) {
		if (disableAutoPlay) {
			wc.interface.options.mediaPlayer.allowAudioAutoPlay = false;
		}
		wc.mediaPlayer.audio.pause();
		document.getElementById('Button_PlayAudio').style.display = '';
		document.getElementById('Button_PauseAudio').style.display = 'none';
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

		wc.interface.actionHandler.printWindow();

		if (bHidden) {
			divPrint.style.visibility = "visible";
			divInstruct.style.visibility = "visible";
			if (objInfo == null)
				divMail.style.display = "block";
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
								response = wc.interface.elements.survey.adjustSurveyResponse(responses[revisionId].response);

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
							var revisionid = strSurveyQuestion.substring