function GetGlobal(id)
{
	
	var str;
	
	switch (id)
	{
		case "FirstName":
			return wc.lms.getFirstName();
//			if (typeof(objInfo) == "object" &amp;&amp; objInfo != null &amp;&amp; objInfo.firstName)
//				str = objInfo.firstName;
//			else
//				str = strFirstName;
//			break;

		case "LastName":
			return wc.lms.getLastName();
			break;

		case "CurDate":
			str = getCurDate();
			break;

		case "CopyrightYears":
			str = getCopyrightYears();
			break;

		default:
			return null;
			break;
	}
	
	return str;
}

function getCurDate() {
	var today = new Date();
	return today.toLocaleDateString();
}


function getCopyrightYears() {
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

function runtimeSub(mainHTML) {
	//get all span elements
	var newText;
	var spans = null;
	if (document.all)	// IE
		spans = mainHTML.document.all.tags("SPAN");
	else	// NS 7
		spans = mainHTML.document.getElementsByTagName("SPAN");

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