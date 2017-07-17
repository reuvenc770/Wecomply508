if (typeof (wc) == 'undefined')
	wc = {};

if (typeof (wc.interface) == 'undefined') {
	wc.interface = {};
}

wc.interface.navigation = {

	resetAllButtonStates: function () {
		wc.interface.navigation.buttonsToEnable = wc.interface.navigation.buttonTypes.None;
		wc.interface.navigation.buttonsToDisable = wc.interface.navigation.buttonTypes.None;
		wc.interface.navigation.buttonsToHide = wc.interface.navigation.buttonTypes.None;
		wc.interface.navigation.buttonsToActivate = wc.interface.navigation.buttonTypes.None;

		wc.interface.navigation.buttonsToHighlight = wc.interface.navigation.buttonTypes.None;
		wc.interface.navigation.buttonsToUnHighlight = wc.interface.navigation.buttonTypes.None;
	},

	toEnable: function (buttonType) {
		wc.interface.navigation.buttonsToEnable |= buttonType;
	},

	toDisable: function (buttonType) {
		wc.interface.navigation.buttonsToDisable |= buttonType;
	},

	toHide: function (buttonType) {
		wc.interface.navigation.buttonsToHide |= buttonType;
	},

	toActivate: function (buttonType) {
		wc.interface.navigation.buttonsToActivate |= buttonType;
	},
	toHighlight: function (buttonType) {
		wc.interface.navigation.buttonsToHighlight |= buttonType;
	},

	toUnHighlight: function (buttonType) {
		wc.interface.navigation.buttonsToUnHighlight |= buttonType;
	},

	enableButton: function (buttonId) {
		var buttonToEnable = document.getElementById(buttonId);
		if (!isDefined(buttonToEnable))
			return;

		// restore the default functionality
		wc.interface.actionHandler.helpers.restoreDefaultFunctionality(buttonToEnable);

		// remove the disabled class
		$(buttonToEnable).removeClass('disabled');

		// make sure the button is enabled (if it's an input button)
		buttonToEnable.disabled = false;

		// remove the active class
		$(buttonToEnable).removeClass('active');

		// make sure the button is visible
		// remove the hiddenElement class
		$(buttonToEnable).removeClass('hiddenElement');

		// this is for backward compatibility 
		//buttonToEnable.style.display = '';		
	},

	disableButton: function (buttonId, hide) {
		var buttonToDisable = document.getElementById(buttonId);
		if (!isDefined(buttonToDisable))
			return;

		// add the disabled class
		$(buttonToDisable).addClass('disabled');

		buttonToDisable.disabled = true;

		// disable default functionality
		wc.interface.actionHandler.helpers.disableDefaultFunctionality(buttonToDisable);

		// remove the active class
		$(buttonToDisable).removeClass('active');

		if (hide) {
			$(buttonToDisable).addClass('hiddenElement');
		}
	},

	activateButton: function (buttonId) {
		var buttonToActivate = document.getElementById(buttonId);
		if (!isDefined(buttonToActivate))
			return;

		// restore the default functionality
		//wc.interface.actionHandler.helpers.disableDefaultFunctionality(buttonToActivate);
		wc.interface.actionHandler.helpers.restoreDefaultFunctionality(buttonToActivate);

		// remove the disabled class
		$(buttonToActivate).removeClass('disabled');

		// make sure the button is enabled (if it's an input button)
		buttonToActivate.disabled = false;

		// make sure the button is visible
		// remove the hiddenElement class
		$(buttonToActivate).removeClass('hiddenElement');

		// add the active class
		$(buttonToActivate).addClass('active');
	},
	HighlightButton: function (buttonId) {
		var buttonToHighlight = document.getElementById(buttonId);
		if (!isDefined(buttonToHighlight))
			return;

		// remove the disabled class
		$(buttonToHighlight).addClass('highlight');
	},
	UnHighlightButton: function (buttonId) {
		var buttonToUnHighlight = document.getElementById(buttonId);
		if (!isDefined(buttonToUnHighlight))
			return;

		// remove the disabled class
		$(buttonToUnHighlight).removeClass('highlight');
	},
	updateButtons: function (buttonsToEnable, buttonsToDisable, buttonsToHide, buttonsToActivate,buttonsToHighlight,buttonsToUnHighlight) {
		var self = wc.interface.navigation;


		// make sure that if play and pause are marked as "oneMustBeVisible" at least one is going to be visible
		var playButton = $('#' + self.getButtonByType(wc.interface.navigation.buttonTypes.Play).elementId);
		var pauseButton = $('#' + self.getButtonByType(wc.interface.navigation.buttonTypes.Pause).elementId);
		
		if ((playButton.length > 0) && (pauseButton.length > 0) && (playButton.hasClass('oneMustBeVisible')) && (pauseButton.hasClass('oneMustBeVisible'))) {
			if (((buttonsToHide & wc.interface.navigation.buttonTypes.Pause) == wc.interface.navigation.buttonTypes.Pause) && ((buttonsToEnable & wc.interface.navigation.buttonTypes.Play) != wc.interface.navigation.buttonTypes.Play)) {
				buttonsToEnable |= wc.interface.navigation.buttonTypes.Play;
			}				
		}

		for (var buttonIndex in self.buttons) {

			if (isDefined(buttonsToEnable) && ((buttonsToEnable & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type)) {
				self.enableButton(self.buttons[buttonIndex].elementId);
			}

			if (isDefined(buttonsToActivate) && ((buttonsToActivate & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type)) {
				self.activateButton(self.buttons[buttonIndex].elementId);
			}

			if (isDefined(buttonsToDisable) && ((buttonsToDisable & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type)) {
				self.disableButton(self.buttons[buttonIndex].elementId, isDefined(buttonsToHide) && (buttonsToHide & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type);
			}
			if (isDefined(buttonsToHighlight) && ((buttonsToHighlight & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type)) {
				self.HighlightButton(self.buttons[buttonIndex].elementId);
			}
			if (isDefined(buttonsToUnHighlight) && ((buttonsToUnHighlight & self.buttons[buttonIndex].type) == self.buttons[buttonIndex].type)) {
				self.UnHighlightButton(self.buttons[buttonIndex].elementId);
			}
		}
	},

	getButtonsCurrentState: function () {
		var self = wc.interface.navigation;

		var buttonsToEnable = wc.interface.navigation.buttonTypes.None;
		var buttonsToDisable = wc.interface.navigation.buttonTypes.None;
		var buttonsToHide = wc.interface.navigation.buttonTypes.None;
		var buttonsToActivate = wc.interface.navigation.buttonTypes.None;

		for (var buttonIndex in self.buttons) {
			var button = document.getElementById(self.buttons[buttonIndex].elementId);
			if (!isDefined(button))
				continue;

			if ($(button).hasClass('diabled') || (button.disabled)) {
				buttonsToDisable |= self.buttons[buttonIndex].type;

				if ($(button).hasClass('hiddenElement')) {
					buttonsToHide |= self.buttons[buttonIndex].type;
				}
			} else {
				buttonsToEnable |= self.buttons[buttonIndex].type;
			}

			if ($(button).hasClass('active')) {
				buttonsToActivate |= self.buttons[buttonIndex].type;
			}
		}
		return { buttonsToEnable: buttonsToEnable, buttonsToDisable: buttonsToDisable, buttonsToHide: buttonsToHide, buttonsToActivate: buttonsToActivate };
	},
	
	getButtonByType: function (buttonType) {
		var buttons = $.grep(wc.interface.navigation.buttons, function(button) {
			return button.type == buttonType;
		});
		
		if (buttons.length > 0) {
			return buttons[0];
		} else {
			return null;
		}
	},
	
	saveButtonsCurrentState: function () {
		wc.interface.navigation.saveState = wc.interface.navigation.getButtonsCurrentState();
	},
	
	restoreButtonsToSavedState: function () {
		wc.interface.navigation.updateButtons(wc.interface.navigation.saveState.buttonsToEnable, wc.interface.navigation.saveState.buttonsToDisable, wc.interface.navigation.saveState.buttonsToHide, wc.interface.navigation.saveState.buttonsToActivate);
		wc.interface.navigation.saveState = null;
	},
	
	saveState: null
};
// all the possible button types
wc.interface.navigation.buttonTypes = { None: 0, Index: 1, ResizeFont: 2, Notes: 4, PreviousChapter: 8, NextChapter: 16, Play: 32, Pause: 64, Audio: 128, Bullets: 256, Text: 512, Policy: 1024, Help: 2048 };

wc.interface.navigation.buttonTypes.All =
	wc.interface.navigation.buttonTypes.Index
		| wc.interface.navigation.buttonTypes.ResizeFont
		| wc.interface.navigation.buttonTypes.Notes
		| wc.interface.navigation.buttonTypes.PreviousChapter
		| wc.interface.navigation.buttonTypes.NextChapter
		| wc.interface.navigation.buttonTypes.Play
		| wc.interface.navigation.buttonTypes.Pause
		| wc.interface.navigation.buttonTypes.Audio
		| wc.interface.navigation.buttonTypes.Bullets
		| wc.interface.navigation.buttonTypes.Text
		| wc.interface.navigation.buttonTypes.Policy
		| wc.interface.navigation.buttonTypes.Help;

wc.interface.navigation.buttons = [
	{ elementName: 'tableOfContents', elementId: 'Button_Index', type: wc.interface.navigation.buttonTypes.Index },
	{ elementName: 'resizeFont', elementId: 'Button_ResizeFont', type: wc.interface.navigation.buttonTypes.ResizeFont },
	{ elementName: 'notes', elementId: 'Button_Note', type: wc.interface.navigation.buttonTypes.Notes },
	{ elementName: 'previousButton', elementId: 'Button_Previous', type: wc.interface.navigation.buttonTypes.PreviousChapter },
	{ elementName: 'nextButton', elementId: 'Button_Next', type: wc.interface.navigation.buttonTypes.NextChapter },
	{ elementName: 'playButton', elementId: 'Button_PlayAudio', type: wc.interface.navigation.buttonTypes.Play },
	{ elementName: 'pauseButton', elementId: 'Button_PauseAudio', type: wc.interface.navigation.buttonTypes.Pause },
	{ elementName: 'audioSpeechButton', elementId: 'Button_AudioSpeech', type: wc.interface.navigation.buttonTypes.Audio },
	{ elementName: 'bulletsButton', elementId: 'Button_EnableBullets', type: wc.interface.navigation.buttonTypes.Bullets },
	{ elementName: 'fullTextButton', elementId: 'Button_DisableBullets', type: wc.interface.navigation.buttonTypes.Text },
	{ elementName: 'policy', elementId: 'Button_Policy', type: wc.interface.navigation.buttonTypes.Policy },
	{ elementName: 'help', elementId: 'Button_Help', type: wc.interface.navigation.buttonTypes.Help }
];

wc.interface.navigation.buttonsToEnable = wc.interface.navigation.buttonTypes.None;
wc.interface.navigation.buttonsToDisable = wc.interface.navigation.buttonTypes.None;
wc.interface.navigation.buttonsToHide = wc.interface.navigation.buttonTypes.None;
wc.interface.navigation.buttonsToActivate = wc.interface.navigation.buttonTypes.None;
wc.interface.navigation.buttonsToHighlight = wc.interface.navigation.buttonTypes.None;
wc.interface.navigation.buttonsToUnHighlight = wc.interface.navigation.buttonTypes.None;