if (typeof (wc) == 'undefined')
	wc = {};
if (typeof (wc.interface) == 'undefined')
	wc.interface = {};

wc.interface.handlers = {
	mediaPlayer: {
		onAudioComplete: 'onAudioComplete',
		onAudioTimeUpdate: 'onAudioTimeUpdate',
		onAudioPaused: 'onAudioPaused',
		onAudioResumed: 'onAudioResumed',
		fireEvent: function (event, data) {
			if (isDefined(wc.interface.handlers.events.mediaPlayer[event])) {
				wc.interface.handlers.events.mediaPlayer[event](data);
			}
			return null;
		}
	},
	games: {
		onBefore_AnswerQuestion: 'onBefore_AnswerQuestion',
		onAfter_AnswerQuestion: 'onAfter_AnswerQuestion',
		onBefore_LoadQuestion: 'onBefore_LoadQuestion',
		insteadOf_LoadQuestion: 'insteadOf_LoadQuestion',
		onAfter_LoadQuestion: 'onAfter_LoadQuestion',
		onAfter_DisplayIntroLayer: 'onAfter_DisplayIntroLayer',
		onBefore_CloseIntroLayer: 'onBefore_CloseIntroLayer',		
		fireEvent: function (event, data) {
			var variety = wc.interface.game.variety;			
			if (isDefined(wc.interface.handlers.events.games[variety.toLowerCase()])) {
				if (isDefined(wc.interface.handlers.events.games[variety.toLowerCase()][event])) {
					wc.interface.handlers.events.games[variety.toLowerCase()][event](data);
				}
			}
			return null;
		},
		
		hasEvent: function (event) {
			var variety = wc.interface.game.variety;

			return isDefined(wc.interface.handlers.events.games[variety.toLowerCase()]) && isDefined(wc.interface.handlers.events.games[variety.toLowerCase()][event]);			
		}
	},
	onBefore_DisplayLayer: 'onBefore_DisplayLayer',
	onAfter_DisplayLayer: 'onAfter_DisplayLayer',
	onBefore_CloseDisplayLayer: 'onBefore_CloseDisplayLayer',
	onAfter_CloseDisplayLayer: 'onAfter_CloseDisplayLayer',
	onBefore_ReplaceCurrentElement: 'onBefore_ReplaceCurrentElement',
	fireEvent: function (event, data) {
		if (isDefined(wc.interface.handlers.events[event])) {
			return wc.interface.handlers.events[event](data);
		}
		return true;
	}
};
wc.interface.handlers.events = {};
wc.interface.handlers.events.mediaPlayer = {
	onAudioComplete: function () {
		if (isDefined(wc.data.jsonData.waitForAudio) && wc.data.jsonData.waitForAudio == '1') {
			//wc.interface.elements.nextButton.enable();
			var buttonsToEnable = wc.interface.navigation.buttonTypes.NextChapter;
			var buttonsToDisable = wc.interface.navigation.buttonTypes.Pause;
			var buttonsToHide = wc.interface.navigation.buttonTypes.None;

			wc.interface.navigation.updateButtons(buttonsToEnable, buttonsToDisable, buttonsToHide);
		}
		// TODO: only do this if we have media bulletins
		wc.interface.elements.mediaBullets.resetActive();
	},
	onAudioPaused: function () {
		var pithyQuote = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].pithyQuote;
		if (wc.interface.doBullets && isDefined(pithyQuote) && wc.interface.elements.mediaBullets.hasBullets(pithyQuote)) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOn();
		}
	},
	onAudioResumed: function () {
		var pithyQuote = wc.data.jsonData.chapters[wc.interface.currentElement.chapterIndex].pithyQuote;
		if (wc.interface.doBullets && isDefined(pithyQuote) && wc.interface.elements.mediaBullets.hasBullets(pithyQuote)) {
			wc.interface.elements.mediaBullets.toggleMainDiscussionOff();
			//wc.mediaPlayer.audio.activeElement.getClip().onCuepoint = wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(pithyQuote);
			if (typeof wc.mediaPlayer.audio.activeElement.getClip == "function")
				wc.mediaPlayer.audio.activeElement.getClip().cuepoints = wc.interface.elements.mediaBullets.getCuepointsForFlowPlayer(pithyQuote);

		}
	}
};
wc.interface.handlers.events.games = { };
wc.interface.handlers.events.games.ceo = {
	onBefore_AnswerQuestion: function (choiceIndex) {

	},
	//currentCeoChapterIndex
	manDivAnimation: function () {
		var manDiv = document.getElementById('manDIV');
		manDivBoundaries = wc.GetObjectBoundaries(manDiv);
		var manParentDiv = manDiv.parentNode;
		manParentDivBoundaries = wc.GetObjectBoundaries(manParentDiv);
		var stepsSet = (manDivBoundaries.left - manParentDivBoundaries.left) / 2;
		var stepCount = (manParentDivBoundaries.width / manDivBoundaries.width) - stepsSet;

		var newLeftPosition = ((stepsSet + 1) * 2);

		manDiv.style.left = newLeftPosition + 'px';
		var ceoSplashMan = document.getElementById('ceoSplashMan');
		if (ceoSplashMan.src.contains('/wc2/static/training/ceoImages/splash_man2.gif'))
			ceoSplashMan.src = '/wc2/static/training/ceoImages/splash_man.gif';
		//else
			//ceoSplashMan.src = '/wc2/static/training/ceoImages/splash_man2.gif';
		//alert(newLeftPosition + '-' + (wc.convert.toInt(manParentDivBoundaries.width));
		if (newLeftPosition >= manParentDivBoundaries.width) {
			var ceoGameOffice = document.getElementById('ceoGameOffice');
			ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo_f01.gif';

			manDiv.style.display = 'none';
			return;
		} else {
			setTimeout(function () {
				 wc.interface.handlers.events.games.ceo.manDivAnimation();
			}, 10);
		}
	},
	onAfter_DisplayIntroLayer: function () {
		setTimeout(function () { wc.interface.handlers.events.games.ceo.manDivAnimation(); }, 900);
	},
	onBefore_CloseIntroLayer: function (event) {
	},
	currentQuestionChapterIndex: -1,
	onBefore_LoadQuestion: function () {

	},
	onAfter_LoadQuestion: function () {

		//var questionsCount = wc.interface.game.questionChapters.lenght;

		//if ((wc.interface.game.currentQuestionChapterIndex + 1) == wc.interface.game.questionsCorrectOnFirstTry)

		//alert(wc.interface.game.currentQuestionChapterIndex);
		//alert(wc.interface.game.questionsCorrectOnFirstTry);

		var ceoGameOffice = document.getElementById('ceoGameOffice');
		if (wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex != -2 && wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
//			ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo9.gif';
			var preloadImg = document.getElementById('preloadCeo9');
			
			if (isDefined(preloadImg)) {
				ceoGameOffice.style.width = '';
				ceoGameOffice.style.height = '';
				ceoGameOffice.width = preloadImg.width;
				ceoGameOffice.height = preloadImg.height;

				ceoGameOffice.src = preloadImg.src;
			}
			wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex = -2;
		} else if (wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex != -2 && wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex != wc.interface.game.currentQuestionChapterIndex) {
//			ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo' + (wc.interface.game.currentQuestionChapterIndex + 1) + '.gif';
			var preloadImg = document.getElementById('preloadCeo' + (wc.interface.game.currentQuestionChapterIndex + 1));
			if (isDefined(preloadImg)) {
				ceoGameOffice.style.width = '';
				ceoGameOffice.style.height = '';
				ceoGameOffice.width = $(preloadImg).attr('width');
				ceoGameOffice.height = $(preloadImg).attr('height');

				ceoGameOffice.src = preloadImg.src;
			}
			wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex = wc.interface.game.currentQuestionChapterIndex;
		}

	},
	onAfter_AnswerQuestion: function (choice) {
		//if (choice.isCorrect == "true") {
		//alert('next step');
		//var questionsCount = wc.interface.game.questionChapters.lenght;
		//alert(questionsCount);

		//if ((wc.interface.game.currentQuestionChapterIndex + 1) == wc.interface.game.questionsCorrectOnFirstTry)

		//alert(wc.interface.game.currentQuestionChapterIndex);
		//alert(wc.interface.game.questionsCorrectOnFirstTry);

		//var ceoGameOffice = document.getElementId('ceoGameOffice');
		//ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo' + (wc.interface.game.currentQuestionChapterIndex + 1) + '.gif';
		//}
	}
};

wc.interface.handlers.events.games.rubegoldberg = {
	onBefore_AnswerQuestion: function (choiceIndex) {			
	},
	onAfter_DisplayIntroLayer: function (event) {		
		if (event.elementType == wc.interface.elementTypes.gameIntro) {
			var quizIllustration = document.getElementById('Quiz_Illustration');
			var quizGameContent = document.getElementById('Quiz_GameContent');

			if (!isDefined(quizIllustration) && !isDefined(quizGameContent))
				return;
			
			var rubeGoldberGameImage = document.getElementById('rgGame');
			//rubeGoldberGameImage.src = '';
			rubeGoldberGameImage.src = '/wc2/static/training/rubegoldberg/intro.gif';

			setTimeout(function () {					
				$(quizGameContent).addClass('gameIntro').removeClass('hiddenElement');				
				var gameIntroTextTween = new Tween(quizGameContent.style, 'left', Tween.regularEaseOut, 0 - 743, 0, 1.3, 'px');				
				gameIntroTextTween.start();
			}, 6500);
		}
		
	},
	onBefore_CloseIntroLayer: function (event) {		
		var quizIllustration = document.getElementById('Quiz_Illustration');
		var quizGameContent = document.getElementById('Quiz_GameContent');

		if (!isDefined(quizIllustration) && !isDefined(quizGameContent))
			return;

	
		var gameIntroTextTween = new Tween(quizGameContent.style, 'left', Tween.regularEaseOut, 0, 0 - 743, 1.3, 'px');
		//var gameIntroTextTweenMotionFinished = false;
		gameIntroTextTween.onMotionFinished = function() {
			$(quizGameContent).removeClass('gameIntro');
		};		
		gameIntroTextTween.start();
		
		//while(!gameIntroTextTweenMotionFinished) {
			
		//}
	},
	currentQuestionChapterIndex: -1,
	
	onBefore_LoadQuestion: function () {		
	},
	insteadOf_LoadQuestion: function (eventData) {
		if (!isDefined(eventData) || !isDefined(eventData.elementType) || !isDefined(eventData.template))
			return;
		
		
		var quizIllustration = document.getElementById('Quiz_Illustration');
		var quizGameContent = document.getElementById('Quiz_GameContent');

		if (!isDefined(quizIllustration) && !isDefined(quizGameContent))
			return;

		

			var gameIntroTextTween = new Tween(quizGameContent.style, 'left', Tween.regularEaseOut, 0, 0 - 763, 1.3, 'px');
			gameIntroTextTween.onMotionFinished = function() {
				// show the next image
				var rubeGoldberGameImage = document.getElementById('rgGame');

				if (wc.interface.handlers.events.games.rubegoldberg.currentQuestionChapterIndex != -2 && wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
					rubeGoldberGameImage.src = '/wc2/static/training/rubegoldberg/RG_8.gif';
					//ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo9.gif';
					//var preloadImg = document.getElementById('preloadCeo9');
					//console.log(preloadImg);

					//if (isDefined(preloadImg)) {
					//	ceoGameOffice.style.width = preloadImg.style.width;
					//}
					wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex = -2;
				} else if (wc.interface.handlers.events.games.rubegoldberg.currentQuestionChapterIndex != -2 && wc.interface.handlers.events.games.rubegoldberg.currentQuestionChapterIndex != wc.interface.game.currentQuestionChapterIndex) {
					if (wc.interface.game.currentQuestionChapterIndex != 0) {
						rubeGoldberGameImage.src = '/wc2/static/training/rubegoldberg/RG_' + (wc.interface.game.currentQuestionChapterIndex) + '.gif';
					}
					//var preloadImg = document.getElementById('preloadCeo' + (wc.interface.game.currentQuestionChapterIndex + 1));
					//console.log(preloadImg);
					//console.log(preloadImg.style);
					//if (isDefined(preloadImg)) {
					//	ceoGameOffice.style.width = preloadImg.style.width;
					//}
					wc.interface.handlers.events.games.rubegoldberg.currentQuestionChapterIndex = wc.interface.game.currentQuestionChapterIndex;
				}
				// set up the new question
				quizGameContent.innerHTML = eventData.template;
				if (typeof(eventData.question.illustration) != 'undefined')
					wc.interface.elements.illustration.inject('Quiz_Illustration_Content', eventData.question.illustration, true);
				else
					document.getElementById('Quiz_Illustration_Content').innerHTML = '';

				// bring the new question in
				var quizGameTextTweenIn = new Tween(quizGameContent.style, 'left', Tween.regularEaseOut, 0 - 763, 0, 1.3, 'px');
				if (eventData.elementType == wc.interface.elementTypes.gameIntro) {					
					quizGameTextTweenIn.start();
				}
				else
					setTimeout(function() { quizGameTextTweenIn.start(); }, 4000);
			};
			gameIntroTextTween.start();
		
	},
	onAfter_LoadQuestion: function () {		
	},
	onAfter_AnswerQuestion: function (choice) {		
	}
};

wc.interface.handlers.events.games.airline = {
	onBefore_AnswerQuestion: function (choiceIndex) {

	},
	//currentCeoChapterIndex
	manDivAnimation: function () {
		var manDiv = document.getElementById('manDIV');
		manDivBoundaries = wc.GetObjectBoundaries(manDiv);
		var manParentDiv = manDiv.parentNode;
		manParentDivBoundaries = wc.GetObjectBoundaries(manParentDiv);
		var stepsSet = (manDivBoundaries.left - manParentDivBoundaries.left) / 2;
		var stepCount = (manParentDivBoundaries.width / manDivBoundaries.width) - stepsSet;

		var newLeftPosition = ((stepsSet + 1) * 2);

		manDiv.style.left = newLeftPosition + 'px';
		var ceoSplashMan = document.getElementById('ceoSplashMan');
		if (ceoSplashMan.src.contains('/wc2/static/training/ceoImages/splash_man2.gif'))
			ceoSplashMan.src = '/wc2/static/training/ceoImages/splash_man.gif';
		//else
		//ceoSplashMan.src = '/wc2/static/training/ceoImages/splash_man2.gif';
		//alert(newLeftPosition + '-' + (wc.convert.toInt(manParentDivBoundaries.width));
		if (newLeftPosition >= manParentDivBoundaries.width) {

			companyId = wc.data.values.companyId;
			companyName = wc.data.values.companyName;
			relativePath = "/wc2/static/training/";
			setupAnimation(0);
			//			var airlineGameOffice = document.getElementById('airlineGameOffice');

			//			setupAnimation(0);
			//			airlineGameOffice.src = '/wc2/static/training/ceoImages/ceo_f01.gif';

			manDiv.style.display = 'none';
			return;
		} else {
			setTimeout(function () {
				wc.interface.handlers.events.games.airline.manDivAnimation();
			}, 10);
		}
	},
	onAfter_DisplayIntroLayer: function () {
		setTimeout(function () { wc.interface.handlers.events.games.airline.manDivAnimation(); }, 900);
	},
	onBefore_CloseIntroLayer: function (event) {
	},
	currentQuestionChapterIndex: -1,
	onBefore_LoadQuestion: function () {

	},
	onAfter_LoadQuestion: function () {

		//var questionsCount = wc.interface.game.questionChapters.lenght;

		//if ((wc.interface.game.currentQuestionChapterIndex + 1) == wc.interface.game.questionsCorrectOnFirstTry)

		//alert(wc.interface.game.currentQuestionChapterIndex);
		//alert(wc.interface.game.questionsCorrectOnFirstTry);

		// var airlineGameOffice = document.getElementById('airlineGameOffice');
		if (wc.interface.handlers.events.games.airline.currentQuestionChapterIndex != -2 && wc.interface.currentElement.elementType == wc.interface.elementTypes.finalQuizQuestion) {
			setupAnimation(9);
			wc.interface.handlers.events.games.airline.currentQuestionChapterIndex = -2;
		} else if (wc.interface.handlers.events.games.airline.currentQuestionChapterIndex != -2 && wc.interface.handlers.events.games.ceo.currentQuestionChapterIndex != wc.interface.game.currentQuestionChapterIndex) {
			setupAnimation(wc.interface.game.currentQuestionChapterIndex + 1);
			wc.interface.handlers.events.games.airline.currentQuestionChapterIndex = wc.interface.game.currentQuestionChapterIndex;
		}

	},
	onAfter_AnswerQuestion: function (choice) {
		//if (choice.isCorrect == "true") {
		//alert('next step');
		//var questionsCount = wc.interface.game.questionChapters.lenght;
		//alert(questionsCount);

		//if ((wc.interface.game.currentQuestionChapterIndex + 1) == wc.interface.game.questionsCorrectOnFirstTry)

		//alert(wc.interface.game.currentQuestionChapterIndex);
		//alert(wc.interface.game.questionsCorrectOnFirstTry);

		//var ceoGameOffice = document.getElementId('ceoGameOffice');
		//ceoGameOffice.src = '/wc2/static/training/ceoImages/ceo' + (wc.interface.game.currentQuestionChapterIndex + 1) + '.gif';
		//}
	}
};
