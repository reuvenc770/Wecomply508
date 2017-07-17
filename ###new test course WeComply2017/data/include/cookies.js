// Javascript functions for getting and setting cookies
//
// Modified on 11/07/03 by Dave Rubin
//  - Prepend "_wc" to all cookies to avoid reading/writing other cookies

var _dtExp = new Date("December 31, 2023");
var _strExp = _dtExp.toGMTString();
var _dtOld = new Date("January 1, 1970");
var _strOld = _dtOld.toGMTString();

var _ckPrefix = "_wc";

function getCookie(strName)
{
	var myCookie = " " + document.cookie + ";";
	var searchName = " " + _ckPrefix + strName + "=";
	var startOfCookie = myCookie.indexOf(searchName)
	var endOfCookie;
	if (startOfCookie != -1)
	{
		startOfCookie += searchName.length;
		endOfCookie = myCookie.indexOf(";", startOfCookie);
		return unescape(myCookie.substring(startOfCookie, endOfCookie));
	}
	else
		return "";
}

function setCookie(strName, strValue)
{
	document.cookie = _ckPrefix + strName + "=" + escape(strValue) + ";expires=" + _strExp + ";path=/";
}

function getCookies()
{
	var myCookie = " " + document.cookie + ";";
	var objCookies = new Object();
	var startPos = 0;
	var searchPos, startCookie, endCookie, cookieName, cookieVal, key;
	do
	{
		searchPos = myCookie.indexOf("=", startPos);
		if (searchPos != -1)
		{
			startCookie = myCookie.lastIndexOf(" ", searchPos);
			if (startCookie != -1)
			{
				cookieName = myCookie.slice(startCookie + 1, searchPos);
				endCookie = myCookie.indexOf(";", searchPos + 1);
				if (cookieName.slice(0, _ckPrefix.length) == _ckPrefix)
				{
					key = cookieName.slice(_ckPrefix.length);
					if (!objCookies[key])
					{
						cookieVal = unescape(myCookie.slice(searchPos + 1, endCookie));
						objCookies[key] = cookieVal;
					}
				}
			}
			startPos = endCookie;
		}
	}
	while (searchPos != -1);
	return objCookies;
}

function setCookies(objCookies)
{
	var cookieName, key;
	for (key in objCookies)
	{
		cookieName = _ckPrefix + key;
		document.cookie = cookieName + "=" + escape(objCookies[key]) + ";expires=" + _strExp + ";path=/";
	}
}

function delCookie(strName)
{
	var cookieName = _ckPrefix + strName;
	document.cookie = cookieName + "=null;expires=" + _strOld + ";path=/";
}

function delCookies(objCookies)
{
	var cookieName, key;
	for (key in objCookies)
	{
		cookieName = _ckPrefix + key;
		document.cookie = cookieName + "=null;expires=" + _strOld + ";path=/";
	}
}
