/////////////////////////////////////
///                               ///
///     Maze Game Script	   	  ///
///   	- Version: 1.4       	  ///
///   	- Creator: John Forde     ///
///   	- Date: 13/12/00       	  ///
///   	- john@macrocube.com	  ///
///   	- www.macrocube.com    	  ///
///                               ///
/////////////////////////////////////

/////////////////////// set pointer variables in init ////////////////////////
self.focus()

var n = false;
var ie = false;
var ns7 = false;
var presentQst;

function init() {	
	setupRules();

	if (document.all)
		ie = true;
	else if (document.layers)
		n = true;
	else
		ns7 = true;
	
	noshow = (n)? 'hide':'hidden'
	yeshow = (n)? 'show':'visible'
																																																	
	if (ie) {
		document.body.insertAdjacentHTML('BeforeEnd','<div id="mazeDIV" style="position:absolute;"></div>')
		maze = mazeDIV.style
		document.body.insertAdjacentHTML('BeforeEnd','<div id="maze_IADIV" style="position:absolute;"></div>')
		maze_IA = maze_IADIV.style
		document.body.insertAdjacentHTML('BeforeEnd','<div id="controlsDIV" style="position:absolute;"></div>')
		controls = controlsDIV.style
		document.body.insertAdjacentHTML('BeforeEnd','<div id="spriteDIV" style="position:absolute;"></div>')
		sprite = spriteDIV.style
		
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark1DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark2DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark3DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark4DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark5DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark6DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark7DIV" style="position:absolute;"></div>')
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark8DIV" style="position:absolute;"></div>')
		for (x=1; x<9; x++) eval("qstmark"+x+" = qstmark"+x+"DIV.style")
	}
	else if (ns7)
	{
		var str = "";
		str += '<div id="mazeDIV" style="position:absolute;"></div>';
		str += '<div id="maze_IADIV" style="position:absolute;"></div>';
		str += '<div id="controlsDIV" style="position:absolute;"></div>';
		str += '<div id="spriteDIV" style="position:absolute;"></div>';

		str += '<div id="qstmark1DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark2DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark3DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark4DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark5DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark6DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark7DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark8DIV" style="position:absolute;"></div>';
		document.getElementById("idBody").innerHTML = str;

		maze = document.getElementById("mazeDIV").style
		maze_IA = document.getElementById("maze_IADIV").style
		controls = document.getElementById("controlsDIV").style
		sprite = document.getElementById("spriteDIV").style
		
		for (x=1; x<9; x++) eval("qstmark"+x+" = document.getElementById('qstmark"+x+"DIV').style");
	}
	else if (n) {
		maze = document.layers['mazeDIV'] = new Layer(10)
		maze_IA = document.layers['maze_IADIV'] = new Layer(10)
		controls = document.layers['controlsDIV'] = new Layer(10)
		sprite = document.layers['spriteDIV'] = new Layer(10)
		stopwatch = document.layers['stopwatchDIV'] = new Layer(10)
		finlyr = document.layers['finlyrDIV'] = new Layer(10)
		for (x=1; x<9; x++) eval("qstmark"+x+" = document.layers['qstmark"+x+"DIV'] = new Layer(10)")
	}
	
	gameSpeed = 3 // initial speed of game (1 fastest, 2 second fastest etc...)
	
	timer = null
	sp = 2	// increment/speed
	bz = 5	// buffer zone
	cw = 30	// channel width
	
	horiz = null
	vert = null
	qstlyr_index = 1
	moving = 0
	presentQst = null
	dir = 0
	drag = 0
	
	layeruse = 0
	for (x=1; x<9; x++) eval("qst"+x+"='unused'")
	
	speedTimer = (gameSpeed*10)
	fillLayer()
}

//////////////////////////////////////////////////////////////////////////////

////////////////////////////////// HTML creation ////////////////////////////////

function layerWrite(id,text) {
 	if (ie) document.all[id].innerHTML = text;
 	else if (ns7)
 		document.getElementById(id).innerHTML = text;
	else if (n) {
		document.layers[id].document.write(text);
		document.layers[id].document.close();
 	}
}

function fillLayer() {
	////////////////////////////////////
	maze.visibility = noshow
	maze.zIndex = 1
	layerWrite('mazeDIV','<img src='+maze_image+'>')
	////////////////////////////////////
	maze_IA.visibility = noshow
	maze_IA.zIndex = 5
	layerWrite('maze_IADIV','<img src='+maze_image_inactive+'>')
	////////////////////////////////////
	controls.visibility = noshow
	controls.zIndex = 3
	layerWrite('controlsDIV','<MAP NAME="Map0">'+
								'<AREA SHAPE="POLYGON" COORDS="16, 16, 16, 44, 2, 60, 2, 6" HREF="javascript:void(0)" onmouseover="preMove(3)" onmouseout="preStop()">'+
								'<AREA SHAPE="POLYGON" COORDS="44, 46, 59, 61, 4, 61, 16, 44" HREF="javascript:void(0)" onmouseover="preMove(2)" onmouseout="preStop()">'+
								'<AREA SHAPE="POLYGON" COORDS="46, 13, 46, 43, 59, 56, 59, 9" HREF="javascript:void(0)" onmouseover="preMove(4)" onmouseout="preStop()">'+
								'<AREA SHAPE="POLYGON" COORDS="14, 16, 46, 16, 54, 1, 2, 1" HREF="javascript:void(0)" onmouseover="preMove(1)" onmouseout="preStop()">'+
								'</MAP>'+
								'<img src="mazeImages/controls.gif" border="0" width="61" height="62" id="controller" name="controller" usemap="#Map0">')
	if (ie) controlsimg = document.images["controller"];
	else if (ns7) controlsimg = document.getElementById("controller");
	else if (n) controlsimg = controls.document.images["controller"];
	////////////////////////////////////
	sprite.visibility = noshow
	sprite.zIndex = 3
	layerWrite('spriteDIV','<img src='+sprite_image+' id="thesprite" name="thesprite">')
	if (ie) spriteimg = document.images["thesprite"];
	else if (ns7) spriteimg = document.getElementById("thesprite");
	else if (n) spriteimg = sprite.document.images["thesprite"];
	////////////////////////////////////
	for (x=1; x<9; x++) eval('qstmark'+x+'.visibility = yeshow')
	for (x=1; x<9; x++) eval('qstmark'+x+'.zIndex = 2')
	layerWrite('qstmark1DIV','<img src="mazeImages/q_hidden.gif" id="questionmark1" name="questionmark1">')
	layerWrite('qstmark2DIV','<img src="mazeImages/q_hidden.gif" id="questionmark2" name="questionmark2">')
	layerWrite('qstmark3DIV','<img src="mazeImages/q_hidden.gif" id="questionmark3" name="questionmark3">')
	layerWrite('qstmark4DIV','<img src="mazeImages/q_hidden.gif" id="questionmark4" name="questionmark4">')
	layerWrite('qstmark5DIV','<img src="mazeImages/q_hidden.gif" id="questionmark5" name="questionmark5">')
	layerWrite('qstmark6DIV','<img src="mazeImages/q_hidden.gif" id="questionmark6" name="questionmark6">')
	layerWrite('qstmark7DIV','<img src="mazeImages/q_hidden.gif" id="questionmark7" name="questionmark7">')
	layerWrite('qstmark8DIV','<img src="mazeImages/q_hidden.gif" id="questionmark8" name="questionmark8">')
	if (ie) for (x=1; x<9; x++) eval('questionimg'+x+' = document.images["questionmark'+x+'"]');
	if (ns7) for (x=1; x<9; x++) eval('questionimg'+x+' = document.getElementById("questionmark'+x+'")');
	else if (n) for (x=1; x<9; x++) eval('questionimg'+x+' = qstmark'+x+'.document.images["questionmark'+x+'"]');
	////////////////////////////////////
	
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
		if (n)
			document.captureEvents(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
	}
	
	setFirstPos()
}

function setFirstPos() {
	maze.top = cornerTop = 0
	maze.left = cornerLeft = 0
	maze_IA.top = cornerTop
	maze_IA.left = cornerLeft
	controls.top = cornerTop + 89
	controls.left = cornerLeft + 270
	sprite.top = cornerTop + 5 + (4*cw)
	sprite.left = cornerLeft + 5
	
	qstmark1.top = cornerTop + ((qmark1_ypos-1)*cw)
	qstmark1.left = cornerLeft + ((qmark1_xpos-1)*cw) 
	qstmark2.top = cornerTop + ((qmark2_ypos-1)*cw)
	qstmark2.left = cornerLeft + ((qmark2_xpos-1)*cw)
	qstmark3.top = cornerTop + ((qmark3_ypos-1)*cw)
	qstmark3.left = cornerLeft + ((qmark3_xpos-1)*cw)
	qstmark4.top = cornerTop + ((qmark4_ypos-1)*cw)
	qstmark4.left = cornerLeft + ((qmark4_xpos-1)*cw)
	qstmark5.top = cornerTop + ((qmark5_ypos-1)*cw)
	qstmark5.left = cornerLeft + ((qmark5_xpos-1)*cw)
	qstmark6.top = cornerTop + ((qmark6_ypos-1)*cw)
	qstmark6.left = cornerLeft + ((qmark6_xpos-1)*cw)
	qstmark7.top = cornerTop + ((qmark7_ypos-1)*cw)
	qstmark7.left = cornerLeft + ((qmark7_xpos-1)*cw)
	qstmark8.top = cornerTop + ((qmark8_ypos-1)*cw)
	qstmark8.left = cornerLeft + ((qmark8_xpos-1)*cw)

	maze.visibility = yeshow	
	controls.visibility = yeshow
	sprite.visibility = yeshow	
	for (x=1; x<9; x++) eval("qstmark"+x+".visibility = yeshow")
	
	moveIt()
}

//////////////// fix for netscape resize bug ////////////////
if (document.layers) {
	origWidth = innerWidth;
	origHeight = innerHeight;
}

function reDo() {
	if (innerWidth != origWidth || innerHeight != origHeight) 
 		location.reload();
 }

if (document.layers) onresize = reDo
/////////////////////////////////////////////////////////////

/////////////////////// handling mousedown errors ///////////////////////

function mouseDown(e) {
	if (((n || ns7) && e.which == 1) || ie) 	{
		if (n || ns7) {var x=e.pageX; var y=e.pageY} 
		if (ie) {var x=event.x; var y=event.y}

		if (ns7)
		{
			e.stopPropagation();		
			e.preventDefault();
		}
	}
}
	
function mouseMove(e) {
	if (n || ns7) {var x=e.pageX; var y=e.pageY} 
	if (ie) {var x=event.x; var y=event.y}

	if (ns7)
		e.stopPropagation();		
}

function mouseUp(e) {
	if (n || ns7) {var x=e.pageX; var y=e.pageY} 
	if (ie) {var x=event.x; var y=event.y}

	if (ns7)
		e.stopPropagation();		
}

/////////////////////// sprite motion ///////////////////////					  
					  
function preMove(num) {
	dir=num
	moveIt()
}

function preStop() {
	controlsimg.src = 'mazeImages/controls.gif'
	dir=0
	stopIt()
}

function moveIt() { 
	if (moving==0) {
		if (dir==1) {controlsimg.src = 'mazeImages/controls_up.gif'; spriteimg.src = 'mazeImages/sprite_u.gif'; moveUp()}
		if (dir==2) {controlsimg.src = 'mazeImages/controls_down.gif'; spriteimg.src = 'mazeImages/sprite_d.gif'; moveDown()}
		if (dir==3) {controlsimg.src = 'mazeImages/controls_left.gif'; spriteimg.src = 'mazeImages/sprite_l.gif'; moveLeft()}
		if (dir==4) {controlsimg.src = 'mazeImages/controls_right.gif'; spriteimg.src = 'mazeImages/sprite_r.gif'; moveRight()}
	}
}

function moveUp() {
	if (u==1 && layeruse==0) {
		moving = 1;	horiz = 0; vert = 1 
		sprite.top = parseInt(sprite.top) - sp
		u=1;d=1;l=0;r=0
		if (!testPos())
			timer = setTimeout('moveUp()', speedTimer)
	}
}
	
function moveDown() {
	if (d==1 && layeruse==0) {
		moving = 1;	horiz = 0; vert = 1
		sprite.top = parseInt(sprite.top) + sp
		u=1;d=1;l=0;r=0
		if (!testPos())
			timer = setTimeout('moveDown()', speedTimer)
	}
}
	
function moveLeft() {
	if (l==1 && layeruse==0) {
		moving = 1;	horiz = 1; vert = 0
		sprite.left = parseInt(sprite.left) - sp
		u=0;d=0;l=1;r=1
		if (!testPos())
			timer = setTimeout('moveLeft()', speedTimer)
	}
}
	
function moveRight()
{
	if (r==1 && layeruse==0)
	{
		moving = 1;
		horiz = 1;
		vert = 0;
		sprite.left = parseInt(sprite.left) + sp;
		u=0;d=0;l=1;r=1
		if (!testPos())
			timer = setTimeout('moveRight()', speedTimer)
	}
}
	
function stopIt() {
	if (horiz==1) {
		if ( (parseInt(sprite.left)-cornerLeft-bz)/cw != parseInt((parseInt(sprite.left)-cornerLeft-bz)/cw) ) setTimeout('stopIt()',1)
		else {clearTimeout(timer); moving=0;}
	}
	if (vert==1) {
		if ( (parseInt(sprite.top)-cornerTop-bz)/cw != parseInt((parseInt(sprite.top)-cornerTop-bz)/cw) ) setTimeout('stopIt()',1)
		else {clearTimeout(timer); moving=0;}
	}
	moveIt()
}

function qstmarkShow(num) {
	 if (eval("qst"+num+"!='used'")) eval(" questionimg"+num+".src='mazeImages/q_show.gif';")
}

function qstShow(num)
{
	if ((num < 9 && eval("qst"+num+"!='used'")) || num == 9)
	{
		if (num < 9)
		{
			eval(" questionimg"+num+".src='mazeImages/q_hide.gif' ");
			presentQst = num;
		}

		dir = 0;
		clearTimeout(timer);
		maze_IA.visibility = yeshow;

		doSwitch();

		//wait for frames to load...
		startAnswer();
		
		return true;
	}
	
	return false;
}

function doSwitch() {
	top.lower.document.write('<frameset cols="300,*" frameborder="no" border="0" framespacing="0">');

	top.lower.document.write('<frame src="Question.htm" name="question" frameborder="no" border="no" scrolling="auto">');
	top.lower.document.write('<frame src="Answer.htm" name="answer" frameborder="no" border="no" scrolling="auto">');
	top.lower.document.write('</frameset>');
}

function startQuestion()
{
	if (typeof(top.lower.question.loaded) != "undefined" && top.lower.question.loaded && (typeof(top.lower.question.start) == "object" || typeof(top.lower.question.start) == "function"))
	{
		if (top.bShowWelcome)
		{
			top.master.bNeedIntro = true;
			top.bShowWelcome = false;
		}
		top.lower.question.start(top.master);
	}
	else
		setTimeout("startQuestion()", 50);
}

function startAnswer()
{
	if (typeof(top.lower.answer.loaded) != "undefined" && top.lower.answer.loaded && (typeof(top.lower.answer.start) == "object" || typeof(top.lower.answer.start) == "function"))
	{
		top.lower.answer.start(top.master);
		startQuestion();
	}
	else
		setTimeout("startAnswer()", 50);
}

function reactivateGame()
{
	eval("qst"+presentQst+"='used'")
	maze_IA.visibility = noshow
	layeruse = 0;
	moveIt()
	top.lower.loaded = false;
//	top.lower.document.write('<frame src="MazeSplash.htm" name="lower" frameborder="no" border="no" scrolling="no">');
    top.lower.location = "MazeSplash.htm";//"../cc/maze_splash.htm"
    restartLower();
}

function restartLower()
{
	if (typeof(top.lower.loaded) != "undefined" && top.lower.loaded && (typeof(top.lower.init) == "object" || typeof(top.lower.init) == "function"))
	{
		top.lower.init(top.master);
	}
	else
		setTimeout("restartLower()", 50);
}

	
function finished() {
	qstShow(9);
}

////////////////////////////////////////////////////////

////////////////// maze rule functions /////////////////

function horLevel(level) {
	if ( parseInt(sprite.top)==cornerTop+bz+(cw*(level-1)) ) return true;
	else return false
}

function verLevel(level) {
	if ( parseInt(sprite.left)==cornerLeft+bz+(cw*(level-1)) ) return true;
	else return false
}

////////////////////////////////////////////////////////
	