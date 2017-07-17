self.focus()

var n = false;
var ie = false;
var ns7 = false;

function init(handle)
{
	if (top.bShowWelcome)
	{
		document.getElementById("linkID").href = handle.getStylesheetPath();
		document.getElementById("customlinkID").href = handle.getCustomStylesheetPath();
	}

	eye_delay = 10000
	tail_delay = 10000
	
	if (document.all)
		ie = true;
	else if (document.layers)
		n = true;
	else
		ns7 = true;
	
	noshow = (n)? 'hide':'hidden'
	yeshow = (n)? 'show':'visible'
																																																	
	if (n) {
		splashmaze = document.splashmazeDIV
		splashmouse = document.splashmouseDIV
		splashcheese = document.splashcheeseDIV
		splasheyes = document.splasheyesDIV
		splashtail = document.splashtailDIV
		splashtailani = document.splashtailaniDIV
	}
	else if (ie) {
		splashmaze = splashmazeDIV.style
		splashmouse = splashmouseDIV.style
		splashcheese = splashcheeseDIV.style
		splasheyes = splasheyesDIV.style
		splashtail = splashtailDIV.style
		splashtailani = splashtailaniDIV.style
	}
	else	// ns7
	{
		splashmaze = document.getElementById("splashmazeDIV").style
		splashmouse = document.getElementById("splashmouseDIV").style
		splashcheese = document.getElementById("splashcheeseDIV").style
		splasheyes = document.getElementById("splasheyesDIV").style
		splashtail = document.getElementById("splashtailDIV").style
		splashtailani = document.getElementById("splashtailaniDIV").style
	}
	start()
	setTimeout('eyes()',eye_delay/2)
	setTimeout('tail()',tail_delay)
}

function start() {
	if (parseInt(splashmaze.top)>1) splashmaze.top = parseInt(splashmaze.top) - 10
	if (parseInt(splashmouse.left)<45) {splashmouse.left = parseInt(splashmouse.left) + 10;splashtail.left = parseInt(splashtail.left) + 10}
	if (parseInt(splashcheese.left)>240) splashcheese.left = parseInt(splashcheese.left) - 10
	setTimeout('start()',10)
}

function eyes() {
	splasheyes.visibility = yeshow
	setTimeout('splasheyes.visibility=noshow',1000)
	setTimeout('eyes()',eye_delay)
}
function tail() {
	splashtail.visibility = noshow
	splashtailani.visibility = yeshow
	setTimeout('splashtail.visibility=yeshow',1000)
	setTimeout('splashtailani.visibility=noshow',1000)
	setTimeout('tail()',tail_delay)
}
