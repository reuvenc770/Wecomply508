if (typeof (wc) == 'undefined')
	wc = {};

/*
events.addEventListener = function (element, eventName, eventHandler, scope) {
	var scopedEventHandler = scope ? function (e) { eventHandler.apply(scope, [e]); } : eventHandler;
	if (document.addEventListener)
		element.addEventListener(eventName, scopedEventHandler, false);
	else if (document.attachEvent)
		element.attachEvent("on" + eventName, scopedEventHandler);
}*/

var events = function(callerObj) {
	this.CallerObj = callerObj;
	this.Listeners = { };
};
wc.events = function(sourceObject) {
	/* source-object is not currently used, but can be informational */
	this.SourceObject = sourceObject;
	this.Listeners = { };
};
wc.events.BlockEvents = function(event) {
	event = window.event || event;
	/* enable blocking of specific keystrokes
	var ctrlKey = (event.ctrlKey || event.metaKey), shiftKey = (event.shiftKey), altKey = (event.altKey);
	var keyCode = event.keyCode || event.which;
	*/
	if (event.stopPropagation)
		event.stopPropagation();
	if (event.preventDefault)
		return event.preventDefault();
	event.returnValue = false;
	event.cancelBubble = true;
	return false;
};
wc.events.prototype.AddEventListener = function(eventName, callback, thisObj, paramsArray, removeAfterFirstUse) {
	eventName = eventName.toLowerCase();
	if (typeof(this.Listeners[eventName]) == "undefined")
		this.Listeners[eventName] = [];

	this.Listeners[eventName].push({ callback: callback, thisObj: thisObj, params: paramsArray, removeAfterFirstUse: removeAfterFirstUse || false });
};
wc.events.prototype.FireEvent = function(eventName, event) {
	eventName = eventName.toLowerCase();
	var listeners;
	if (typeof(listeners = this.Listeners[eventName]) == "undefined")
		return;

	var result;
	for (var i = 0; i < listeners.length; i++) {
		result = this.DispatchEvent(listeners[i].callback, listeners[i].thisObj || this.SourceObject, listeners[i].params, event);
		if (typeof(result) == "object" && result['break'] === true)
			break;
	}
	//must go in reverse, otherwise it may remove the wrong ones...
	for (var i = listeners.length - 1; i >= 0; i--) {
		if (listeners[i].removeAfterFirstUse)
			this.Listeners[eventName].splice(i, 1);
	}
};
wc.events.prototype.RemoveEventListener = function(eventName, callback, thisObj) {
	eventName = eventName.toLowerCase();
	if (typeof(this.Listeners[eventName]) == "undefined")
		return;

	for (var i = 0; i < this.Listeners.length; i++) {
		if (this.Listeners[eventName][i].callback == callback && this.Listeners[eventName][i].thisObj == thisObj)
			this.Listeners[eventName].splice(i, 1);
	}
};
wc.events.prototype.HasListener = function(eventName) {
	eventName = eventName.toLowerCase();
	return (typeof(this.Listeners[eventName]) != "undefined");
};
wc.events.prototype.DispatchEvent = function(callback, thisObj, paramsArray, event) {
	//try 
	//{
	if (paramsArray)
		callback.apply(thisObj, [event].concat(paramsArray));
	else
		callback.apply(thisObj, [event]);
	//} 
	//catch (e){}
};
wc.events.GlobalEvents = new wc.events();

wc.domEvents =
	{
		EventNames: [],
		Handlers: { },
		ListenerObjects: [],

		//(/function ([^\(]*)\(/gi).exec(arguments.callee.toString())[1]

		AddListener: function(sourceObject, eventName, callback, paramsArray, targetObj, removeAfterFirstUse) {
			if (wc.isArray(sourceObject)) {
				for (var i = 0; i < sourceObject.length; i++)
					this.AddListener(sourceObject[i], eventName, callback, paramsArray, targetObj, removeAfterFirstUse);
				return;
			}

			if (typeof(sourceObject.Listeners) == "undefined") {
				sourceObject.Listeners = { };
				this.ListenerObjects.push(sourceObject);
			}

			var addListener = false;
			eventName = eventName.toLowerCase();
			if (typeof(sourceObject.Listeners[eventName]) == "undefined") {
				addListener = true;
				sourceObject.Listeners[eventName] = [];
			}

			var listener = { callback: callback, targetObj: targetObj, params: paramsArray, removeAfterFirstUse: removeAfterFirstUse || false };
			sourceObject.Listeners[eventName].push(listener);
			if (addListener) {
				if (eventName == "domload") {
					this.OnDomLoad();
				} else
					wc.AddEventListener(sourceObject, eventName, this.FireEvent, [sourceObject, eventName], this);
			}

			return listener;
		},

		RemoveListener: function(sourceObject, eventName, listener) {
			if (typeof(sourceObject.Listeners) == "undefined")
				return false;

			eventName = eventName.toLowerCase();
			if (typeof(sourceObject.Listeners[eventName]) == "undefined")
				return false;

			var listenerRef;
			for (var i = 0; i < sourceObject.Listeners[eventName].length; i++) {
				listenerRef = sourceObject.Listeners[eventName][i];
				if (listenerRef == listener) {
					sourceObject.Listeners[eventName].splice(i, 1);
					return true;
				}
			}
			return false;
		},

		RemoveListenerAt: function(sourceObject, eventName, listenerIndex) {
			if (typeof(sourceObject.Listeners) == "undefined")
				return false;

			eventName = eventName.toLowerCase();
			if (typeof(sourceObject.Listeners[eventName]) == "undefined")
				return false;

			sourceObject.Listeners[eventName].splice(listenerIndex, 1);
			return true;
		},

		RemoveAllListeners: function(sourceObject, eventName) {
			if (typeof(sourceObject.Listeners) == "undefined")
				return false;

			eventName = eventName.toLowerCase();
			if (typeof(sourceObject.Listeners[eventName]) == "undefined")
				return false;

			sourceObject.Listeners[eventName] = [];
		},

		FireEvent: function(domEvent, sourceObject, eventName) {
			if (typeof(sourceObject.Listeners) == "undefined")
				return false;

			eventName = eventName.toLowerCase();
			if (typeof(sourceObject.Listeners[eventName]) == "undefined")
				return false;

			var listener, listeners = sourceObject.Listeners[eventName];
			for (var i = 0; i < listeners.length; i++) {
				this.DispatchEvent(listeners[i].callback, listeners[i].targetObj || sourceObject, listeners[i].params, domEvent);
			}
			return true;
		},

		DispatchEvent: function(callback, thisObj, paramsArray, event) {
			//try 
			//{
			if (paramsArray)
				callback.apply(thisObj, [event].concat(paramsArray));
			else
				callback.apply(thisObj, [event]);
			//} 
			//catch (e){}
		},
		OnDomLoad: (function() {
			// create event function stack
			var load_events = [], safari_timer, done, exec, script;

			var init = function(ev) {
				done = true;

				// kill the timer
				clearInterval(safari_timer);

				// execute each function in the stack in the order they were added
				wc.domEvents.FireEvent(ev, window, "domLoad");

				if (script)
					script.onreadystatechange = '';
			};

			return function(func) {
				// if the init function was already ran, just run this function now and stop
				if (done)
					return init();

				if (!load_events[0]) {
					// for Mozilla/Opera9
					if (document.addEventListener)
						document.addEventListener("DOMContentLoaded", init, false);


					/*@cc_on@*/
					/*@if (@_win32)
				var proto = "src='javascript:void(0)'";
				if (location.protocol == "https:")
					proto = "src=//0";
				document.write("<scr" + "ipt id=__ie_onload defer " + proto + ">< \/scr" + "ipt>");
				var script = document.getElementById("__ie_onload");
				script.onreadystatechange = function () {
					if (this.readyState == "complete") {
						init()
					}
				};
				/*@end@*/

					if (/WebKit/i.test(navigator.userAgent)) { // sniff
						safari_timer = setInterval(function() {
							if (/loaded|complete/.test(document.readyState))
								init(); // call the onload handler
						}, 10);
					}

					this.AddListener(window, "load", function(ev) {
						init(ev || window.event);
					});
				}

				load_events.push(func);
			};
		})()
	};
wc.events = events;
