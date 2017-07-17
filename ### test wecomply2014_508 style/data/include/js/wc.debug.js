if (typeof (wc) == 'undefined')
	wc = {};

var debugController = { mode: 0, active: false };
debugController.modes = { none: 0, alert: 1, server: 2, popupWindow: 3 };
debugController.debug = function (content, forcedMode) { //forcedMode is an optional param, needs to be before any non optional params
	if (debugController.active) {
		var debugMode = debugController.mode;

		if (typeof (forcedMode) != 'undefined')
			debugMode = forcedMode;

		debugController.log.push(content);
		//alert(forcedMode + 'acitve' + debugMode + '=' + debugController.modes.alert);
		if (debugMode == debugController.modes.none || debugMode == debugController.modes.alert) {
			alert(content);
		} else if (debugController.mode == debugController.modes.server) {
			var result = debugController.ajax.request(content);
			if (result != '1')
				alert(result);
		} else if (debugController.mode == debugController.modes.popupWindow) {
			result = debugController.popupWindow.log(content);
			if (!result) {
				alert("Could not write debug data. Make sure your popup blocker is not blocking the debugging window");
			}
		}
	}
};
debugController.log = [];
debugController.setMode = function (mode) {
	debugController.mode = mode;
};
debugController.debugData = null;
debugController.getDebugData = function () {
	if (typeof (debugController.debugData) == 'undefined' || debugController.debugData == null) {
		var data = '';
		data += 'resolution=' + screen.width + 'x' + screen.height;
		try {
			data += '&userAgent=' + navigator.userAgent;
			data += '&cookiesEnabled=' + navigator.cookieEnabled;
			data += '&appVersion=' + navigator.appVersion;
		} catch (e) { }
		try {
			data += '&domain=' + window.parent.document.location.host;
			data += '&path=' + window.parent.document.location.pathname;
			data += '&queryString=' + escape(window.parent.document.location.search);
		} catch (e) { }

		debugController.debugData = data;
		return data;
	}
	else {
		return debugController.debugData;
	}
};

debugController.ajax = { requestUrl: '/wc2/runtime/debug.aspx' };
debugController.ajax.request = function (data) {
	requestData = 'data=' + data + '&' + debugController.getDebugData();
	var req = new XMLHttpRequest();
	req.open("POST", debugController.ajax.requestUrl, false);
	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//alert(requestData);
	req.send(requestData);
	return req.responseText;
};

function debug(content, forcedMode) {//forcedMode is an optional param, needs to be before any non optional params
	debugController.debug(content, forcedMode);
};

debugController.popupWindow = { windowHandler: null, windowName: "Debugger", blankPage: "blank.html", width: "450", height: "300" };
debugController.popupWindow.log = function (data) {
	if (typeof (debugController) != 'undefined' && debugController != null) {
		if (debugController.popupWindow.windowHandler == null || typeof (debugController.popupWindow.windowHandler) == 'undefined') {
			debugController.popupWindow.windowHandler = window.open("", debugController.popupWindow.windowName, 'width=' + debugController.popupWindow.width + ',height=' + debugController.popupWindow.height + ',menubar=0,toolbar=0,scrollbars=1,location=0');
		}

		if (debugController.popupWindow.windowHandler != null && typeof (debugController.popupWindow.windowHandler) != 'undefined') {
			try {
				debugController.popupWindow.windowHandler.document.writeln(data + '<br/>');
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	}
}

wc.debug = debugController;