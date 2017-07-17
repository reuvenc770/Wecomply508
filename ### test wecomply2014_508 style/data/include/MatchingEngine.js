/////////////////////////////////////
///                               ///
///     Matching Script			  ///
///   	- Version: 1.4			  ///
///		- associated files:		  ///
///			'matching_config.js'  ///
///   	- Creator: John Forde     ///
///   	- Date: 21/05/2002     	  ///
///                               ///
/////////////////////////////////////   

/////////////////////////////////////////
var ie, ns7, ns4;
var thisProb;
var storedX, storedY, storedSection, storedProb;
var noshow, yeshow;
var winWidth, winHeight;

///////// initMatchingEngine() function /////////
function initMatchingEngine()
{
	
/////////////////////////////////////////

///////////////////////////////// set browser compatible references ///////////////////////////////	
	ns4 = (document.layers) ? 1 : 0;
	if (document.all)
	{
		ie = true;
		ns7 = false;
	}
	else
	{
		ie = false;
		ns7 = true;
	}
	
	noshow = (ns4) ? 'hide' : 'hidden';
	yeshow = (ns4) ? 'show' : 'visible';
///////////////////////////////// create layers ///////////////////////////////	
	if (ie)
	{
		for(x=1;x<=problemNum;x++)
			eval("document.body.insertAdjacentHTML('BeforeEnd','<div id=problem"+x+"DIV style=position:absolute;></div>')");
		for(x=1;x<=problemNum;x++)
			eval("problem"+x+" = problem"+x+"DIV.style");
		for(x=1;x<=problemNum;x++)
			eval("document.body.insertAdjacentHTML('BeforeEnd','<div id=section"+x+"DIV style=position:absolute;></div>')");
		for(x=1;x<=problemNum;x++)
			eval("section"+x+" = section"+x+"DIV.style");
		
		for(x=1;x<=problemNum;x++)
			eval("document.body.insertAdjacentHTML('BeforeEnd','<div id=sectionTrans"+x+"DIV style=position:absolute;></div>')");
		for(x=1;x<=problemNum;x++)
			eval("sectionTrans"+x+" = sectionTrans"+x+"DIV.style");
		
		document.body.insertAdjacentHTML('BeforeEnd','<div id="introLayerDIV" style="position:absolute;"></div>');
		introLayer = introLayerDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="gameCompleteDIV" style="position:absolute;"></div>');
		gameComplete = gameCompleteDIV.style;
	}
	else if (ns7)
	{
		var str = "";
		for(x=1;x<=problemNum;x++)
			str += '<div id=problem'+x+'DIV style=position:absolute;></div>';
		for(x=1;x<=problemNum;x++)
			str += '<div id=section'+x+'DIV style=position:absolute;></div>';
		for(x=1;x<=problemNum;x++)
			str += '<div id=sectionTrans'+x+'DIV style=position:absolute;></div>';
		str += '<div id="introLayerDIV" style="position:absolute;"></div>';
		str += '<div id="gameCompleteDIV" style="position:absolute;"></div>';
		document.getElementById("idBody").innerHTML = str;

		for(x=1;x<=problemNum;x++)
			eval("problem"+x+" = document.getElementById('problem"+x+"DIV').style");
		for(x=1;x<=problemNum;x++)
			eval("section"+x+" = document.getElementById('section"+x+"DIV').style");
		for(x=1;x<=problemNum;x++)
			eval("sectionTrans"+x+" = document.getElementById('sectionTrans"+x+"DIV').style");
		introLayer = document.getElementById('introLayerDIV').style;
		gameComplete = document.getElementById('gameCompleteDIV').style;
	}
	else if (ns4)
	{
		for(x=1;x<=problemNum;x++)
			eval("problem"+x+" = document.layers['problem"+x+"DIV'] = new Layer(100)");
		for(x=1;x<=problemNum;x++)
			eval("section"+x+" = document.layers['section"+x+"DIV'] = new Layer(110)");
		for(x=1;x<=problemNum;x++)
			eval("sectionTrans"+x+" = document.layers['sectionTrans"+x+"DIV'] = new Layer(10)");
		
		introLayer = document.layers['introLayerDIV'] = new Layer(100);
		gameComplete = document.layers['gameCompleteDIV'] = new Layer(100);

	}
	
/////////////////////////////////////////////////////////////////////////////////////////////////////
	
//////////////////////////////////////////// HTML generation ///////////////////////////////////////////////////	
			
	for(x=1; x<=problemNum;x++)
		eval("problem"+x+".visibility = noshow");
	for(x=1; x<=problemNum;x++)
		eval("problem"+x+".zIndex = '2'");
	for(x=1; x<=problemNum;x++)
		eval("problem"+x+".corsection = problemsection"+x);
	for(x=1; x<=problemNum;x++)
		eval("layerWrite('problem"+x+"DIV','<table cellpadding=2px><tr><tr><td valign=middle align=center width=100 height=100 bgcolor='+problembgcolour+'><font face=arial size=1 color='+problemtextcolour+'>'+problemtext"+x+"+'</b></font></td></tr></table>')");

	for(x=1; x<=problemNum;x++)
		eval("section"+x+".visibility = noshow");
	for(x=1; x<=problemNum;x++)
		eval("section"+x+".zIndex = '1'");
	for(x=1; x<=problemNum;x++)
		eval("layerWrite('section"+x+"DIV','<table border=1 cellpadding=2><tr><tr><td width=105 height=110>&nbsp;</td></tr><tr><td valign=middle align=center><font face=arial size=1 color='+sectiontextcolor+'><b>'+sectiontext"+x+"+'</b></font></td></tr></table>')");
	
	for(x=1; x<=problemNum;x++)
		 eval("sectionTrans"+x+".visibility = noshow");
	for(x=1; x<=problemNum;x++)
		eval("sectionTrans"+x+".zIndex = '3'");
	for(x=1; x<=problemNum;x++)
		eval("layerWrite('sectionTrans"+x+"DIV','<img src=trans.gif width=115px height=115px>')");
	
	introLayer.visibility = noshow;
	introLayer.zIndex = 5;
	layerWrite('introLayerDIV','<center><table border="0" cellpadding="10px" width="350px">'+
								'<tr><td valign="middle" align="center" bgcolor="#eeeeee">'+
								'<font face="arial" size="2" color="#000000"><b>'+introText+'</b></font>'+
								'</td></tr></table></center>');
	gameComplete.visibility = noshow;
	gameComplete.zIndex = 5;
	layerWrite('gameCompleteDIV','<center><table border=1 cellpadding=2 width=150>'+
								'<tr><td width=150 height=150 valign=middle align=center bgcolor=#cccccc>'+
								'<font face=arial size=2 color=navy><b>'+completeMessage+'</b></font><br><br>'+
								'<font face=arial size=2 color=ffffff><a href="#" onClick="'+completeURL+'">'+closeText+'</a></font><br><br>'+
								'</td></tr></table></center>');

//////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////// declare variables /////////////

	for(x=1;x<=problemNum;x++)
		eval("sectionLock"+x+" = 0"); // initialises indicator of whether section is locked
	for(x=1;x<=problemNum;x++)
		eval("problem"+x+".lock = "+x); //initialises indicator of which section each problem is locking
	for(x=1;x<=problemNum;x++)
		eval("section"+x+".prob = "+x); //initialises indicator of which problem each section contains
	drag = 0;
	gameOver = 0;
	
///////////////////////////////////////////////

////////////////////////////// set event handlers /////////////////////////////////

	if (ns7)
	{
		document.addEventListener("mousedown", mouseDown, true);
		document.addEventListener("mousemove", mouseMove, true);
		document.addEventListener("mouseup", mouseUp, true);
	}
	else
	{
		document.onmousedown = mouseDown;
		document.onmousemove = mouseMove;
		document.onmouseup = mouseUp;
		if (ns4)
			document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
	}

	if (ns4)
		winWidth = window.innerWidth;
	else if (ns7)
		winWidth = window.innerWidth;
	else if (ie)
		winWidth = document.body.offsetWidth;
		
	if (ns4)
		winHeight = window.innerHeight;
	else if (ns7)
		winHeight = window.innerHeight;
	else if (ie)
		winHeight = document.body.offsetHeight;

	setOrigPos();
}
//////////////////////////////// end initMatchingEngine() function ///////////////////////////////	
////////////////////////////////////////////////////////////////////////////////////
			
////////////////////////////// miscellaneous functions/////////////////////////////////

function layerWrite(id,text)
{
 	if (ie)
 		document.all[id].innerHTML = text;
 	else if (ns7)
 	{
		document.getElementById(id).innerHTML = text;
	}
	else if (ns4)
	{
		document.layers[id].document.write(text);
		document.layers[id].document.close();
 	}
}

//////////////////////////////////////////////////////////////////////////////////////

//////////////// fix for netscape resize bug ////////////////
if (document.layers)
{
	origWidth = innerWidth;
	origHeight = innerHeight;
}

function reDo()
{
	if (innerWidth != origWidth || innerHeight != origHeight) 
 		location.reload();
 }

if (document.layers)
	onresize = reDo;
////////////////////////////////////////////////////////////

////////////////////////////////////// drag n drop functons //////////////////////////////////////////////

function mouseDown(e)
{
	if ((gameOver==0) && (((ns4 || ns7) && e.which == 1) || ie) )
	{
		if (ns4 || ns7)
		{
			var x=e.pageX;
			var y=e.pageY;
		} 
		else if (ie)
		{
			var x=event.x;
			var y=event.y;
		}

		// determine which problem square to move	
		for(q=1;q<=problemNum;q++)
		{
			eval("tempSection = problem"+q+".lock"); // obtain the section the chosen problem is in
			eval("if ( (sectionLock"+tempSection+"==0) && x >= parseInt(problem"+q+".left) && x <= parseInt(problem"+q+".left)+100 && y >= parseInt(problem"+q+".top) && y <= parseInt(problem"+q+".top)+100) {thisProb = problem"+q+";cursordiffx = (x - parseInt(thisProb.left));cursordiffy = (y - parseInt(thisProb.top));drag = 1;setProbZindex("+q+")}");
		}// the above line checks if cursor is in range of a square and check the seciton isnt locked by a correct answer

		if (ns7)
		{
			e.stopPropagation();		
			e.preventDefault();
		}
	}
}
	
function mouseMove(e)
{
	if (drag)
	{
		if (ns4 || ns7)
		{
			var x=e.pageX;
			var y=e.pageY;
		}
		else if (ie)
		{
			var x=event.x;
			var y=event.y;
		}  

//alert("x=" + x + " y=" + y + " winWidth=" + winWidth + " winHeight=" + winHeight);
		if (((x>=1)&&(x<=winWidth-1)&&(y>=1)&&(y<=winHeight-1)))
		{
			thisProb.left = x - cursordiffx;
			thisProb.top = y - cursordiffy;
			return false;
		}
	
		if (ns7)
			e.stopPropagation();		
	}
}

function mouseUp(e)
{
	if (ns4 || ns7)
	{
		var x=e.pageX;
		var y=e.pageY;
	} 
	else if (ie)
	{
		var x=event.x;
		var y=event.y;
	}
	
	if ((drag==1)&&(gameOver==0))
		setProbPos(); // if game isnt over set the squares new positions
		
	drag = 0; // dragging is now over
	for (x=1;x<=problemNum;x++)
		eval("problem"+x+".zIndex=2"); // all problem squares zindex set to 2

	if (ns7)
		e.stopPropagation();		
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////// position-setting functions ////////////////////////////////

function setProbZindex(num)
{
	// when problem square is mousedowned
	for (x=1;x<=problemNum;x++)
		eval("problem"+x+".zIndex=2"); // all problem squares zindex set to 2
	thisProb.zIndex = 4; // selected problem square zindex set to 4
	storedX = parseInt(thisProb.left); 
	storedY = parseInt(thisProb.top); // store the value of problem square before it is moved
	storedSection = thisProb.lock;
	storedProb = num;						// store more values
	//status = 'x:'+storedX+' y:'+storedY+' section'+storedSection+' prob'+storedProb
}

function setProbPos()
{
	// determine if problem square is in range of section square (amd unlocked by existing problem) and if so position it, also locks the section when the problem is placed their and applies this section to the lock value in the problem object 

	// this bit dynamically builds text string based on how many squares there are which then build the statement
	tempStatement = "if ( (sectionLock1==0)&&( parseInt(thisProb.left)+50>=parseInt(section1.left) )&&"; // if section isnt already locked by correct answer
	tempStatement += "( parseInt(thisProb.left)+50<=parseInt(section1.left)+105 )&&";
	tempStatement += "( parseInt(thisProb.top)+50>=parseInt(section1.top) )&&";
	tempStatement += "( parseInt(thisProb.top)+50<=parseInt(section1.top)+105 ) ) "; // ...and if square is in range of section
	tempStatement += "{thisProb.left = parseInt(section1.left) + 5;thisProb.top = parseInt(section1.top) + 5;"; // put chosen square in section
	tempStatement += "problem"+section1.prob+".left=storedX; problem"+section1.prob+".top=storedY;"; // put square being replaced in section that the chosen square just came from
	tempStatement += "problem"+section1.prob+".lock=storedSection; section"+storedSection+".prob=section1.prob;"; // reassign values to chosen and replaced problem squares and sections
	tempStatement += "section1.prob=storedProb; thisProb.lock=1; testResult(1,section"+storedSection+".prob);}"; // call testResult to...er...test the result

	for (x=2;x<=problemNum;x++)
	{
		eval("thissectionprob = section"+x+".prob;");
		tempStatement += "else if ( (sectionLock"+x+"==0)&&";
		tempStatement += "( parseInt(thisProb.left)+50>=parseInt(section"+x+".left) )&&";
		tempStatement += "( parseInt(thisProb.left)+50<=parseInt(section"+x+".left)+105 )&&";
		tempStatement += "( parseInt(thisProb.top)+50>=parseInt(section"+x+".top) )&&";
		tempStatement += "( parseInt(thisProb.top)+50<=parseInt(section"+x+".top)+105 ) )";
		tempStatement += "{thisProb.left = parseInt(section"+x+".left) + 5;thisProb.top = parseInt(section"+x+".top) + 5;";
		tempStatement += "problem"+thissectionprob+".left=storedX; problem"+thissectionprob+".top=storedY;";
		tempStatement += "problem"+thissectionprob+".lock=storedSection; section"+storedSection+".prob=section"+x+".prob;";
		tempStatement += "section"+x+".prob=storedProb; thisProb.lock="+x+"; testResult("+x+",section"+storedSection+".prob)}";
	}

	eval(tempStatement + " else setFailedProbPos()"); // if square not in ANY range send square back to original section
/////
}

// updated positioning functions to take into account the dynamic varibale number of problem squares
function setFailedProbPos()
{
	thisProb.left = storedX;
	thisProb.top = storedY;	// if problem square not in range of any sections set it back to where it started
}

function setOrigPos() 
{
	// set orignal position for problem squares
	if (problemNum>0)
		for(x=1;x<=problemNum;x++)
			eval("problem"+x+".left = 30+(("+x+"-1)*140); problem"+x+".top = 5 + (150*0) + problemsStartPos");
	if (problemNum>rowNum)
		for(x=(rowNum+1);x<=problemNum;x++)
			eval("problem"+x+".left = 30+(("+x+"-(rowNum+1))*140); problem"+x+".top = 5 + (150*1) + problemsStartPos");
	if (problemNum>(rowNum*2))
		for(x=((rowNum*2)+1);x<=problemNum;x++)
			eval("problem"+x+".left = 30+(("+x+"-((rowNum*2)+1))*140); problem"+x+".top = 5 + (150*2) + problemsStartPos");
	if (problemNum>(rowNum*3))
		for(x=((rowNum*3)+1);x<=problemNum;x++)
			eval("problem"+x+".left = 30+(("+x+"-((rowNum*3)+1))*140); problem"+x+".top = 5 + (150*3) + problemsStartPos");
	for(x=1;x<=problemNum;x++)
		eval("problem"+x+".visibility = yeshow");
	
	//set original position for section areas
	if (problemNum>0)
		for(x=1;x<=problemNum;x++)
			eval("section"+x+".left = 25+(("+x+"-1)*140); section"+x+".top = (150*0) + problemsStartPos");
	if (problemNum>rowNum)
		for(x=(rowNum+1);x<=problemNum;x++)
			eval("section"+x+".left = 25+(("+x+"-(rowNum+1))*140); section"+x+".top = (150*1) + problemsStartPos");
	if (problemNum>(rowNum*2))
		for(x=((rowNum*2)+1);x<=problemNum;x++)
			eval("section"+x+".left = 25+(("+x+"-((rowNum*2)+1))*140); section"+x+".top = (150*2) + problemsStartPos");
	if (problemNum>(rowNum*3))
		for(x=((rowNum*3)+1);x<=problemNum;x++)
			eval("section"+x+".left = 25+(("+x+"-((rowNum*3)+1))*140); section"+x+".top = (150*3) + problemsStartPos");
	for(x=1;x<=problemNum;x++)
		eval("section"+x+".visibility = yeshow");
	
	//set original position for transparent squares
	if (problemNum>0)
		for(x=1;x<=problemNum;x++)
			eval("sectionTrans"+x+".left = 25+(("+x+"-1)*140); sectionTrans"+x+".top = (150*0) + problemsStartPos");
	if (problemNum>rowNum)
		for(x=(rowNum+1);x<=problemNum;x++)
			eval("sectionTrans"+x+".left = 25+(("+x+"-(rowNum+1))*140); sectionTrans"+x+".top = (150*1) + problemsStartPos");
	if (problemNum>(rowNum*2))
		for(x=((rowNum*2)+1);x<=problemNum;x++)
			eval("sectionTrans"+x+".left = 25+(("+x+"-((rowNum*2)+1))*140); sectionTrans"+x+".top = (150*2) + problemsStartPos");
	if (problemNum>(rowNum*3))
		for(x=((rowNum*3)+1);x<=problemNum;x++)
			eval("sectionTrans"+x+".left = 25+(("+x+"-((rowNum*3)+1))*140); sectionTrans"+x+".top = (150*3) + problemsStartPos");
	for(x=1;x<=problemNum;x++)
		eval("sectionTrans"+x+".visibility = yeshow");
	
	introLayer.left = (winWidth/2)-160;
	introLayer.top = introStartPos;
	introLayer.visibility = yeshow;
	
	gameComplete.left = (winWidth/2) - 75;
	gameComplete.top = (winHeight/2) - 75;
	gameComplete.visibility = noshow;
}
////////////////////////////////////////////////////////////////////////

//////////////////////// game testing functions ////////////////////////////////
function testResult(newSec,oldProb)
{
	// first line checks to see if the problem is in the correct section, if so change text green and lock section
	eval("if (thisProb.corsection==newSec) {layerWrite('section"+newSec+"DIV','<table border=1 cellpadding=2><tr><tr><td width=105 height=110 class=text>&nbsp;</td></tr><tr><td valign=middle align=center><font face=arial size=1 color='+correctsectioncolour+'><b><i>'+sectiontext"+newSec+"+'</i></b></font></td></tr></table>'); sectionLock"+newSec+" = 1}");
	eval("if (problem"+oldProb+".corsection==storedSection) {layerWrite('section"+storedSection+"DIV','<table border=1 cellpadding=2><tr><tr><td width=105 height=110 class=text>&nbsp;</td></tr><tr><td valign=middle align=center><font face=arial size=1 color='+correctsectioncolour+'><b><i>'+sectiontext"+storedSection+"+'</i></b></font></td></tr></table>'); sectionLock"+storedSection+" = 1}");
	
	// this section builds a dynamic conditional (based on how many squares it has to test) to test each section to see if the game is completed
	var tempConditional = "if ((problem1.corsection==problem1.lock)";
	for(x=2;x<=problemNum;x++)
		tempConditional += "&&(problem"+x+".corsection==problem"+x+".lock)";

	eval(tempConditional+"){gameOver = 1; matchComplete()}");
//////
}

function matchComplete()
{
	blinkResult(0);
	gameComplete.visibility = yeshow;
}

function blinkResult(num)
{
	if (num==0)
	{
		for(x=1;x<=problemNum;x++)
			eval("problem"+x+".visibility = noshow");
		timer = setTimeout('blinkResult(1)',500);
	}
	else
	{
		for(x=1;x<=problemNum;x++)
			eval("problem"+x+".visibility = yeshow");
		timer = setTimeout('blinkResult(0)',500);
	}
}
////////////////////////////////////////////////////////////////////////

