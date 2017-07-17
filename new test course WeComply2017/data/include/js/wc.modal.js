var wc = {loadComplete:false};
wc.isArray = function (obj) {
	if (obj == null)
		return false;
	return (obj instanceof Array);
};

DeviceDetection = function(ua) {
	/**	 * @type string the user agend string used (readonly)	 */
	this.ua;
	/**	 * @type object struct with common check results for performance	 */
	this.checks;
	/**	 * Constructor	 * @param string ua Optional the useragent string - if not given its retrieved from browser	 */
	this.construct = function(ua) {
		if (typeof ua == 'undefined') {
			var ua = navigator.userAgent.toUpperCase();
		}
		this.ua = ua;
		// parse data		
		this.checks = {
			iphone: Boolean(ua.match(/IPHONE/)),
			ipod: Boolean(ua.match(/IPOD/)),
			ipad: Boolean(ua.match(/IPAD/)),
			blackberry: Boolean(ua.match(/BLACKBERRY|; RIM/)),
			playbook: Boolean(ua.match(/PLAYBOOK/)),
			android: Boolean(ua.match(/ANDROID/)),
			macOS: Boolean(ua.match(/MAC OS X/)),
			win: Boolean(ua.match(/WINDOWS/)),
			mac: Boolean(ua.match(/MACINTOSH/)),
			wphone: Boolean(ua.match(/(WINDOWS PHONE OS|WINDOWS CE|WINDOWS MOBILE)/)),
			mobile: Boolean(ua.match(/MOBILE/)),
			/* http://mojosunite.com/tablet-user-agent-strings */
			androidTablet: Boolean(ua.match(/(GT-P1000|SGH-T849|SHW-M180S)/)),
			tabletPc: Boolean(ua.match(/TABLET PC/)),
			palmDevice: Boolean(ua.match(/(PALMOS|PALMSOURCE| PRE\/)/)),
			kindle: Boolean(ua.match(/(KINDLE)/)),
			webkit: Boolean(ua.match(/APPLEWEBKIT/)),
			otherMobileHints: Boolean(ua.match(/(OPERA MINI|IEMOBILE|SONYERICSSON|SMARTPHONE)/))
		};
	};
	this.isTouchDevice = function() {
		return this.checks.iphone || this.checks.ipod || this.checks.ipad;
	};
	this.isApple = function() {
		return this.checks.iphone || this.checks.ipod || this.checks.ipad || this.checks.macOS || this.checks.mac;
	};
	this.isBlackberry = function() { return this.checks.blackberry; }
	this.isAndroid = function() { return this.checks.android; }
//	this.isTablet = function() { return this.checks.ipad || this.checks.tabletPc || this.checks.playbook || this.checks.androidTablet || this.checks.kindle; }
// tabletpc useragent sent in some desktops
	this.isTablet = function() { return this.checks.ipad || this.checks.playbook || this.checks.androidTablet || this.checks.kindle; }
	this.isDesktop = function() { return !this.isTouchDevice() && !this.isSmartPhone() && !this.isTablet() }
	this.isSmartPhone = function() {
		return (this.checks.mobile || this.checks.blackberry || this.checks.palmDevice || this.checks.otherMobileHints) && !this.isTablet() && !this.checks.ipod;
	};
	this.isMobile = function() {
		return (this.checks.iphone || this.checks.mobile || this.checks.blackberry || this.checks.palmDevice || this.checks.otherMobileHints) && !this.isTablet() && !this.checks.ipod;
	};
	this.isWebkit = function() { return this.checks.webkit; }
	this.construct(ua);
};

String.prototype.trim = function (char) {
	if (typeof (char) != 'undefined' && char != '') {
		var regexString = '/(^' + char + '|' + char + '+$)/g';
		return this.replace(regexString, '');
	}
	else {
		return this.replace(/(^\s+|\s+$)/g, '');
	}
};

String.prototype.toInt = function () {
	if (typeof (this) == 'undefined' || this == '') {
		return 0;
	}
	else {
		try {
			return parseInt(this);
		} catch (ex) {
			return 0;
		}
	}
};
wc.convert = {
	toInt: function (value) {
		if (typeof(value) == 'undefined' || value == '') {
			return 0;
		} else {
			try {
				return parseInt(value);
			} catch(ex) {
				return 0;
			}
		}
	}
};

isObjectEmpty = function (object) {
	for (var prop in object) {
		if (object.hasOwnProperty(prop)) return false;
	}
	return object;
};
String.prototype.contains = function (value) {
	return (this.indexOf(value) > -1);
};
isDefined = function (object) {
	try {		
		if ((typeof(object) == 'undefined') || (object == null))
			return false;
		else
			return true;
	} catch(e) {
		return false;
	}
};

userAgent = navigator.userAgent.toLowerCase();
wc.browserInfo = {
	IsIE: /*@cc_on!@*/false,
	IsLessThanIE6: /*@cc_on!@*/false && (parseInt(userAgent.match(/msie (\d+)/)[1], 10) < 6),
	IsLessThanIE8: /*@cc_on!@*/false && (parseInt(this.userAgent.match(/msie (\d+)/)[1], 10) < 8),
	IsIE6: /*@cc_on!@*/false && (parseInt(userAgent.match(/msie (\d+)/)[1], 10) >= 6),
	IsIE7: /*@cc_on!@*/false && (parseInt(userAgent.match(/msie (\d+)/)[1], 10) >= 7),
	IsIE8: /*@cc_on!@*/false && (parseInt(userAgent.match(/msie (\d+)/)[1], 10) >= 8),
	IsGecko: userAgent.contains('gecko/'),
	IsSafari: userAgent.contains(' applewebkit/'),
	IsOpera: !!window.opera,
	IsMac: userAgent.contains('macintosh'),
	IsFirefox: userAgent.contains("firefox/"),
	IsAIR: userAgent.contains(' adobeair/'),
	IsChrome: userAgent.contains(' chrome/'),
	Is: /*@cc_on!@*/0 && parseInt(userAgent.match(/msie (\d+)/)[1], 10),
	UserAgent: userAgent
};

(function (browserInfo) {
	browserInfo.IsGecko = (navigator.product == 'Gecko') && !browserInfo.IsSafari && !browserInfo.IsOpera;
	browserInfo.IsGeckoLike = (browserInfo.IsGecko || browserInfo.IsSafari || browserInfo.IsOpera);


	if (browserInfo.IsGecko) {
		var geckoMatch = this.userAgent.match(/rv:(\d+\.\d+)/);
		var geckoVersion = geckoMatch && parseFloat(geckoMatch[1]);

		// Actually "10" refers to Gecko versions before Firefox 1.5, when
		// Gecko 1.8 (build 20051111) has been released.

		// Some browser (like Mozilla 1.7.13) may have a Gecko build greater
		// than 20051111, so we must also check for the revision number not to
		// be 1.7 (we are assuming that rv < 1.7 will not have build > 20051111).

		if (geckoVersion) {
			browserInfo.IsGecko10 = (geckoVersion < 1.8);
			browserInfo.IsGecko19 = (geckoVersion > 1.8);
		}
	}
})(wc.browserInfo);
wc.browserInfo.IsStrictMode = function (document) {
	return ('CSS1Compat' == (document.compatMode || (this.IsSafari ? 'CSS1Compat' : null)));
};

wc.AddEventListener = function (sourceObject, eventName, listener, paramsArray, targetObject) {
	if (wc.browserInfo.IsIE) {
		var o = new Object();
		o.Source = targetObject || sourceObject;
		if (typeof (sourceObject) == "string")
			sourceObject = document.getElementById(sourceObject);
		o.Params = paramsArray || [];
		/*Memory leak if we have DOM objects here.*/
		if (eventName == "load" && sourceObject == window) {
			o.Listener = function (ev) {
				wc.WindowLoaded = true;
				return listener.apply(o.Source, [ev].concat(o.Params));
			};
		}
		else {
			o.Listener = function (ev) {
				return listener.apply(o.Source, [ev].concat(o.Params));
			};
		}
		sourceObject.attachEvent('on' + eventName, o.Listener);
		sourceObject = null;
		paramsArray = null;
	}
	else {
		if (eventName == "load" && sourceObject == window) {
			sourceObject.addEventListener(eventName, function (e) {
				wc.WindowLoaded = true;
				listener.apply(targetObject || sourceObject, [e].concat(paramsArray || []));
			}, false);
		}
		else {
			sourceObject.addEventListener(eventName, function (e) {
				listener.apply(targetObject || sourceObject, [e].concat(paramsArray || []));
			}, false);
		}
	};
};

wc.GetWindowScrollSize = function (win) {
	if (!win)
		win = window;
	var x = 0, y = 0;
	if (typeof (win.scrollMaxX) == 'number') {
		y = win.innerHeight + win.scrollMaxY;
		x = win.innerWidth + win.scrollMaxX;
	}
	else if (win.document.body && (win.document.body.scrollHeight || win.document.body.scrollWidth)) {
		y = win.document.body.scrollHeight;
		x = win.document.body.scrollWidth;
	}
	else if (win.document.documentElement && (win.document.documentElement.scrollHeight || win.document.documentElement.scrollWidth)) {
		y = win.document.documentElement.scrollHeight;
		x = win.document.documentElement.scrollWidth;
	}
	return { Height: y, Width: x };
};
wc.GetWindowScroll = function (win) {
	if (!win)
		win = window;
	var x = 0, y = 0;
	if (typeof (win.pageYOffset) == 'number') {
		y = win.pageYOffset;
		x = win.pageXOffset;
	}
	else if (win.document.body && (win.document.body.scrollLeft || win.document.body.scrollTop)) {
		y = win.document.body.scrollTop;
		x = win.document.body.scrollLeft;
	}
	else if (win.document.documentElement && (win.document.documentElement.scrollLeft || win.document.documentElement.scrollTop)) {
		y = win.document.documentElement.scrollTop;
		x = win.document.documentElement.scrollLeft;
	}
	return [x, y];
};
wc.GetWindowScrollX = function (win) {
	return this.GetWindowScroll(win)[0];
};
wc.GetWindowScrollY = function (win) {
	return this.GetWindowScroll(win)[1];
};
wc.GetViewPaneSize = function (win) {
	if (Co.BrowserInfo.IsIE) {
		var oSizeSource;

		var oDoc = win.document.documentElement;
		if (oDoc && oDoc.clientWidth)				// IE6 Strict Mode
		{
			oSizeSource = oDoc;
			if (win.document.body.clientWidth && win.document.body.clientWidth > oDoc.clientWidth)
				oSizeSource = win.document.body;
		}
		else
			oSizeSource = win.document.body; 	// Other IEs

		var returnValue = {};

		if (oSizeSource) {
			returnValue = { Width: oSizeSource.clientWidth, Height: oSizeSource.clientHeight };
			/*
			if (win.document.body.scrollWidth > oSizeSource.clientWidth)
			returnValue.Width = win.document.body.scrollWidth;
			
			if (win.document.body.scrollHeight > oSizeSource.clientHeight && win.document.body.scrollHeight < this.GetWindowHeight(window))
			returnValue.Height = win.document.body.scrollHeight;
			*/
		}
		else
			returnValue = { Width: 0, Height: 0 };
		return returnValue;
	}
	else {
		return { Width: win.innerWidth, Height: win.innerHeight };
	}
};
wc.GetWindowDimensions = function (win) {
	if (!win)
		win = window;
	var w = 0, h = 0;
	if (typeof (win.innerWidth) == 'number') {
		w = win.innerWidth;
		h = win.innerHeight;
	}
	else if (win.document.documentElement && (win.document.documentElement.clientWidth || win.document.documentElement.clientHeight)) {
		w = win.document.documentElement.clientWidth;
		h = win.document.documentElement.clientHeight;
	}
	else if (win.document.body && (win.document.body.clientWidth || win.document.body.clientHeight)) {
		w = win.document.body.clientWidth;
		h = win.document.body.clientHeight;
	}
	return [w, h];
};
wc.GetWindowWidth = function (win) {
	return this.GetWindowDimensions(win)[0];
};
wc.GetWindowHeight = function (win) {
	return this.GetWindowDimensions(win)[1];
};
wc.GetTopWindow = function (startWindow) {
	if (!startWindow)
		startWindow = window;
	var topWindow = startWindow.parent, lastTopWindow = topWindow;

	while (topWindow.parent && topWindow.parent != topWindow) {
		try {
			if (topWindow.parent.document.domain != document.domain)
				break;
			if (topWindow.parent.document.getElementsByTagName('frameset').length > 0) {
				topWindow = topWindow.parent;
				continue;
			}
		}
		catch (e) {
			break;
		}
		topWindow = topWindow.parent;
		lastTopWindow = topWindow;
	}
	if (lastTopWindow != topWindow)
		topWindow = lastTopWindow;

	return topWindow;
};
wc.GetObjectPosition = function (o) {
	var t = l = 0;
	if (!o.offsetParent)
		return [l, t];
	t = o.offsetTop;
	l = o.offsetLeft;
	while ((o = o.offsetParent)) {
		t += o.offsetTop;
		l += o.offsetLeft;
	};
	return [l, t];
};
wc.GetObjectPositionX = function (o) {
	return this.GetObjectPosition(o)[0];
};
wc.GetObjectPositionY = function (o) {
	return this.GetObjectPosition(o)[1];
};
wc.GetObjectBoundaries = function (obj) {
	var bcrect, od, odb, odde, dimensions = { "left": 0, "top": 0, "right": 0, "bottom": 0, "width": 0, "height": 0 };

	if (obj) {
		od = obj.ownerDocument;
		odb = od.body;
		odde = od.documentElement;
		bcrect = obj.getBoundingClientRect();
		dimensions.left = bcrect.left;
		dimensions.top = bcrect.top;
		dimensions.right = bcrect.right;
		dimensions.bottom = bcrect.bottom;

		if (bcrect.width) {
			dimensions.width = bcrect.width;
			dimensions.height = bcrect.height;
		}
		else {
			dimensions.width = dimensions.right - dimensions.left;
			dimensions.height = dimensions.bottom - dimensions.top;
		}

		if (odb.scrollTop) {
			dimensions.top += odb.scrollTop;
			dimensions.left += odb.scrollLeft;
		}
		else if (odde && odde.scrollTop) {
			dimensions.top += odde.scrollTop;
			dimensions.left += odde.scrollLeft;
		}
	}
	return dimensions;
};

wc.request = { 
	host: document.location.host,
	queryStringHolder: document.location.search.substr(1), 
	queryStringValues : null,
	queryStringItems : {}
};

wc.request.queryStringValues = wc.request.queryStringHolder.split('&');
var key = '', value = '';
for (var i = 0; i < wc.request.queryStringValues.length; i++) {
	value = wc.request.queryStringValues[i].split('=');
	if (value.length > 0)
	{
		key = value.splice(0, 1)[0];
		value = value.join('=');
	}
	else
		continue;
	
	wc.request.queryStringItems[key.toLowerCase()] = value;
}


wc.request.queryString = function(key){
	if (typeof(key) == "undefined" || key == null)
		return '';
	if (wc.request.queryStringItems[key.toLowerCase()])
		return wc.request.queryStringItems[key.toLowerCase()];
	return '';
};

wc.invoke = function(func, context) {
	if (arguments.length > 2) {
		var args = [];
		for (var i = 2; i < arguments.length; i++)
			args.push(arguments[i]);
		func.apply(context, args);
	} else {
		func.apply(context, [object]);
	}
};
wc.ajax = {xmlHttp : null};
wc.ajax.initialize = function() {
	
	if (wc.ajax.xmlHttp == null || typeof (wc.ajax.xmlHttp) == 'undefined') {
		if (window.XMLHttpRequest) { // IE7+, Firefox, Chrome, Opera, Safari
			wc.ajax.xmlHttp = new XMLHttpRequest();
		} else { //IE6, IE5
			wc.ajax.xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
	}
};
wc.ajax.options = { };
wc.ajax.options.async = true;
wc.ajax.options.randomize = true;
wc.ajax.post = function(url, callbackFunction, data, async) {
	wc.ajax.request("POST", url, callbackFunction, data, async);
};
wc.ajax.get = function(url, callbackFunction, data, async) {
	wc.ajax.request("GET", url, callbackFunction, data, async);
};
wc.ajax.request = function (method, url, callbackFunction, data, async) {
	if (typeof (async) =='undefined' || async == null )
		async = true;
	wc.ajax.initialize();
	wc.ajax.xmlHttp.onreadystatechange = function() {
		if (wc.ajax.xmlHttp.readyState == 4) {
			var response = { };
			response.status = wc.ajax.xmlHttp.status;
			response.statusText = wc.ajax.xmlHttp.statusText;
			response.responseText = wc.ajax.xmlHttp.responseText;
			response.responseXml = wc.ajax.xmlHttp.responseXml;

			var contentTypeHeader = wc.ajax.xmlHttp.getResponseHeader('Content-type');
			if (typeof (contentTypeHeader) != 'undefined' && contentTypeHeader  != null && contentTypeHeader.indexOf('json') != -1) {
				if (contentTypeHeader.indexOf(';') != -1)
					response.contentType = contentTypeHeader.substring(0, contentTypeHeader.indexOf(';'));
				else
					response.contentType = contentTypeHeader;
			}
			//if (response.contentType == 'text/x-json' || response.contentType == 'text/json') {
				//alert("response " + response.responseText);
				var myresponsetext = response.responseText;
				// in IE, the default JSON parser is not nice, and the one defined below doesn't quite work
				//var myresponse =  wc.json.parse(myresponsetext);
				//var myresponse = myieparse(myresponsetext);
				var myresponse = jQuery.parseJSON(myresponsetext);
				response.responseJson = myresponse;
			//}

			wc.invoke(callbackFunction, wc.ajax.xmlHttp, response);

		}
	};

	if (typeof (method) == 'undefined')
		method = 'GET';

	var dataString = '';

	if (typeof (data) != 'undefined') {
		for (var item in data) {
			if (method == 'GET')
				dataString += (url.indexOf('?') == -1 && dataString == '' ? '?' : '&') + item + '=' + data[item];
			else
				dataString += (dataString == '' ? '' : '&') + item + '=' + data[item];
		}
	}

	if (method == "GET")
		url += dataString;

	if (method == "GET" && wc.ajax.options.randomize)
		url = wc.ajax.randomizeUrl(url);

	wc.ajax.xmlHttp.open(method, url, (async == false || wc.ajax.options.async == false) ? false : true);

	if (method == "GET") {
		wc.ajax.xmlHttp.send();
	} else {
		wc.ajax.xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		wc.ajax.xmlHttp.send(dataString);
	}
};

wc.ajax.randomizeUrl = function (urlToRandomize) {
	if (urlToRandomize.indexOf('?') != -1)
		urlToRandomize += '&rnd=' + Math.random();
	else
		urlToRandomize += '?rnd=' + Math.random();
	return urlToRandomize;
};


wc.json = (typeof (JSON) == "undefined" ? {} : JSON);
(function () {
	function f(n) {
		return n < 10 ? "0" + n : n;
	}
	if (typeof Date.prototype.toJSON !== "function") {
		Date.prototype.toJSON = function (key) {
			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
		};
		String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function (key) {
			return this.valueOf();
		};
	}
	var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = { "\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, rep;
	function quote(string) {
		escapable.lastIndex = 0;
		return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
			var c = meta[a];
			return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
		}
		) + '"' : '"' + string + '"';
	}
	function str(key, holder) {
		var i, k, v, length, mind = gap, partial, value = holder[key];
		if (value && typeof value === "object" && typeof value.toJSON === "function") {
			value = value.toJSON(key);
		}
		if (typeof rep === "function") {
			value = rep.call(holder, key, value);
		}
		switch (typeof value) {
			case "string":
				return quote(value);
			case "number":
				return isFinite(value) ? String(value) : "null";
			case "boolean":
			case "null":
				return String(value);
			case "object":
				if (!value) {
					return "null";
				}
				gap += indent;
				partial = [];
				if (Object.prototype.toString.apply(value) === "[object Array]") {
					length = value.length;
					for (i = 0; i < length; i += 1) {
						partial[i] = str(i, value) || "null";
					}
					v = partial.length === 0 ? "[]" : gap ? "[\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "]" : "[" + partial.join(",") + "]";
					gap = mind;
					return v;
				}
				if (rep && typeof rep === "object") {
					length = rep.length;
					for (i = 0; i < length; i += 1) {
						k = rep[i];
						if (typeof k === "string") {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				}
				else {
					for (k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = str(k, value);
							if (v) {
								partial.push(quote(k) + (gap ? ": " : ":") + v);
							}
						}
					}
				}
				v = partial.length === 0 ? "{}" : gap ? "{\n" + gap + partial.join(",\n" + gap) + "\n" + mind + "}" : "{" + partial.join(",") + "}";
				gap = mind;
				return v;
		}
	}
	if (typeof wc.json.stringify !== "function") {
		wc.json.stringify = function (value, replacer, space) {
			var i;
			gap = "";
			indent = "";
			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " ";
				}
			}
			else {
				if (typeof space === "string") {
					indent = space;
				}
			}
			rep = replacer;
			if (replacer && typeof replacer !== "function" && (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("wc.json.stringify");
			}
			return str("", { "": value });
		};
	}

	if (typeof wc.json.parse !== "function") {
		wc.json.parse = function (text, reviver) {
			var j;
			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							}
							else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
				}
				);
			}
			if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
				j = eval("(" + text + ")");
				return typeof reviver === "function" ? walk({ "": j }, "") : j;
			}
			throw new SyntaxError("wc.json.parse");
		};
	}
});

wc.tools = {
	randomizeSort: function (a, b) {
		var temp = parseInt(Math.random() * 10);
		var isOddOrEven = temp % 2;
		var isPosOrNeg = temp > 5 ? 1 : -1;
		return (isOddOrEven * isPosOrNeg);
	},
	shuffle: function (o) {
		for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},
	
	getAttributeValue: function (markup, attribute) {
		var regex = new RegExp('(?:' + attribute + '=")(.*?)"');
		var match = regex.exec(markup);

		if ((match != null) && (match.length == 2)) {
			return match[1];
		}

		return null;
	},
	
	swapNodes: function (node1, node2) {	
		var parentNode1 = node1.parentNode;		
		var node1Sibling = node1.nextSibling === node2 ? node1 : node1.nextSibling;
		node2.parentNode.insertBefore(node1, node2);
		parentNode1.insertBefore(node2, node1Sibling);
	},
	
	getXmlAttributeValue: function (xmlNode, attributeName) {
		if (isDefined(xmlNode) && isDefined(xmlNode.attributes))
		{
		
			var attribute = xmlNode.attributes[attributeName];
			if (attribute != null) {
				return attribute.value;
			}
		}
		return null;
	},
	
	getStringAsXmlDoc: function(xmlText) {

		var xmlDoc = null;

		if (window.DOMParser) {
			var parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlText, "text/xml");
		}
		else {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(xmlText);
		}

		return xmlDoc;
	}	
};

wc.setOpacity = function(eID, opacityLevel) {

	var eStyle;
	if (typeof(eID) == "string")
		eStyle = document.getElementById(eID).style;
	else
		eStyle = eID.style;

	eStyle.opacity = opacityLevel / 100;
	eStyle.filter = 'alpha(opacity=' + opacityLevel + ')';
};

wc.removeOpacity = function (elementId) {

	var eStyle;
	if (typeof (elementId) == "string")
		eStyle = document.getElementById(elementId).style;
	else
		eStyle = elementId.style;

	eStyle.opacity = '';
	eStyle.filter = '';
};

wc.deviceDetection = new DeviceDetection();

wc.languages = new Array(
    { name: "Arabic", id: 1, alphabet: "other" },
    { name: "Catalan", id: 3, alphabet: "latin" },
    { name: "Chinese (Simplified)", id: 4, alphabet: "other" },
    { name: "Czech", id: 5, alphabet: "latin" },
    { name: "Danish", id: 6, alphabet: "latin" },
    { name: "German", id: 7, alphabet: "latin" },
    { name: "Greek", id: 8, alphabet: "other" },
    { name: "Spanish", id: 10, alphabet: "latin" },
    { name: "Finnish", id: 11, alphabet: "latin" },
    { name: "French", id: 12, alphabet: "latin" },
    { name: "Hebrew", id: 13, alphabet: "other" },
    { name: "Hungarian", id: 14, alphabet: "latin" },
    { name: "Italian", id: 16, alphabet: "latin" },
    { name: "Japanese", id: 17, alphabet: "other" },
    { name: "Korean", id: 18, alphabet: "other" },
    { name: "Dutch", id: 19, alphabet: "latin" },
    { name: "Polish", id: 21, alphabet: "latin" },
    { name: "Portuguese", id: 22, alphabet: "latin" },
    { name: "Romanian", id: 24, alphabet: "latin" },
    { name: "Russian", id: 25, alphabet: "other" },
    { name: "Croatian", id: 26, alphabet: "latin" },
    { name: "Slovak", id: 27, alphabet: "latin" },
    { name: "Albanian", id: 28, alphabet: "latin" },
    { name: "Swedish", id: 29, alphabet: "latin" },
    { name: "Thai", id: 30, alphabet: "other" },
    { name: "Turkish", id: 31, alphabet: "latin" },
    { name: "Urdu", id: 32, alphabet: "other" },
    { name: "Ukrainian", id: 34, alphabet: "other" },
    { name: "Slovenian", id: 36, alphabet: "latin" },
    { name: "Vietnamese", id: 42, alphabet: "latin" },
    { name: "Afrikaans", id: 54, alphabet: "latin" },
    { name: "Hindi", id: 57, alphabet: "other" },
    { name: "Malay", id: 62, alphabet: "latin" },
    { name: "Swahili", id: 65, alphabet: "latin" },
    { name: "English", id: 1033, alphabet: "latin" },
    { name: "Norwegian (Bokm?l)", id: 1044, alphabet: "latin" },
    { name: "Portuguese (Brazil)", id: 1046, alphabet: "latin" },
    { name: "Tagalog", id: 1536, alphabet: "other" },
    { name: "German (Switzerland)", id: 2055, alphabet: "latin" },
    { name: "Spanish (Mexico)", id: 2058, alphabet: "latin" },
    { name: "Dutch (Belgium)", id: 2067, alphabet: "latin" },
    { name: "Spanish (Spain)", id: 3082, alphabet: "latin" },
    { name: "French (Canada)", id: 3084, alphabet: "latin" },
    { name: "Serbian (Cyrillic) (Serbia)", id: 3098, alphabet: "other" },
    { name: "English (Canada)", id: 4105, alphabet: "latin" },
    { name: "Chinese (Traditional)", id: 31748, alphabet: "other" }
);