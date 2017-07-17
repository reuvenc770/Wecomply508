/////////////////////////////////////
///                               ///
///     hop Game Script	  ///
///   	- Version: 1.2       	  ///
///   	- Creator: John Forde     ///
///   	- Date: 09/01/01       	  ///
///   	- john@macrocube.com	  ///
///   	- www.macrocube.com    	  ///
///                               ///
/////////////////////////////////////


/////////////////////// set pointer variables in init ////////////////////////
self.focus()

var n = false;
var ie = false;
var ns7 = false;

function init()
{	
	if (document.all)
		ie = true;
	else if (document.layers)
		n = true;
	else
		ns7 = true;
	
	noshow = (n)? 'hide':'hidden';
	yeshow = (n)? 'show':'visible';
																																																	
	if (ie)
	{
		loading = loadingDIV.style;
		loading.visibility = noshow;

		document.body.insertAdjacentHTML('BeforeEnd','<div id="backdropDIV" style="position:absolute;"></div>');
		backdrop = backdropDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="inactiveDIV" style="position:absolute;"></div>');
		inactive = inactiveDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="controlsDIV" style="position:absolute;"></div>');
		controls = controlsDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="reactivateDIV" style="position:absolute;"></div>');
		reactivate = reactivateDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="pregameDIV" style="position:absolute;"></div>');
		pregame = pregameDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="lawyerDIV" style="position:absolute;"></div>');
		lawyer = lawyerDIV.style;
		document.body.insertAdjacentHTML('BeforeEnd','<div id="spriteDIV" style="position:absolute;"></div>');
		sprite = spriteDIV.style;
		
		document.body.insertAdjacentHTML('BeforeEnd','<div id="obstacle1DIV" style="position:absolute;"></div>');
		obstacle1 = obstacle1DIV.style;
		
		document.body.insertAdjacentHTML('BeforeEnd','<div id="ladder1DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="ladder2DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="ladder3DIV" style="position:absolute;"></div>');
		for (x=1; x<4; x++) eval("ladder"+x+" = ladder"+x+"DIV.style");
		
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark1DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark2DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark3DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark4DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark5DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark6DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark7DIV" style="position:absolute;"></div>');
		document.body.insertAdjacentHTML('BeforeEnd','<div id="qstmark8DIV" style="position:absolute;"></div>');
		for (x=1; x<9; x++) eval("qstmark"+x+" = qstmark"+x+"DIV.style");
	}
	if (ns7)
	{
		loading = document.getElementById("loadingDIV").style;
		loading.visibility = noshow;

		var str = document.getElementById("idBody").innerHTML;
		str += '<div id="backdropDIV" style="position:absolute;"></div>';
		str += '<div id="inactiveDIV" style="position:absolute;"></div>';
		str += '<div id="controlsDIV" style="position:absolute;"></div>';
		str += '<div id="reactivateDIV" style="position:absolute;"></div>';
		str += '<div id="pregameDIV" style="position:absolute;"></div>';
		str += '<div id="lawyerDIV" style="position:absolute;"></div>';
		str += '<div id="spriteDIV" style="position:absolute;"></div>';
		
		str += '<div id="obstacle1DIV" style="position:absolute;"></div>';
		
		str += '<div id="ladder1DIV" style="position:absolute;"></div>';
		str += '<div id="ladder2DIV" style="position:absolute;"></div>';
		str += '<div id="ladder3DIV" style="position:absolute;"></div>';
		
		str += '<div id="qstmark1DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark2DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark3DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark4DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark5DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark6DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark7DIV" style="position:absolute;"></div>';
		str += '<div id="qstmark8DIV" style="position:absolute;"></div>';
		document.getElementById("idBody").innerHTML = str;

		backdrop = document.getElementById("backdropDIV").style;
		inactive = document.getElementById("inactiveDIV").style;
		controls = document.getElementById("controlsDIV").style;
		reactivate = document.getElementById("reactivateDIV").style;
		pregame = document.getElementById("pregameDIV").style;
		lawyer = document.getElementById("lawyerDIV").style;
		sprite = document.getElementById("spriteDIV").style;
		obstacle1 = document.getElementById("obstacle1DIV").style;

		for (x=1; x<4; x++) eval("ladder"+x+" = document.getElementById('ladder"+x+"DIV').style");
		for (x=1; x<9; x++) eval("qstmark"+x+" = document.getElementById('qstmark"+x+"DIV').style");
	}
	else if (n)
	{
		loading = document.layers['loadingDIV'];
		loading.visibility = noshow;

		backdrop = document.layers['backdropDIV'] = new Layer(10);
		inactive = document.layers['inactiveDIV'] = new Layer(10);
		reactivate = document.layers['reactivateDIV'] = new Layer(10);
		pregame = document.layers['pregameDIV'] = new Layer(10);
		lawyer = document.layers['lawyerDIV'] = new Layer(10);
		controls = document.layers['controlsDIV'] = new Layer(10);
		sprite = document.layers['spriteDIV'] = new Layer(10);
		obstacle1 = document.layers['obstacle1DIV'] = new Layer(10);
		for (x=1; x<4; x++) eval("ladder"+x+" = document.layers['ladder"+x+"DIV'] = new Layer(10)");
		for (x=1; x<9; x++) eval("qstmark"+x+" = document.layers['qstmark"+x+"DIV'] = new Layer(10)");
	}
	
	gameSpeed = 3; // initial speed of game (1 fastest, 2 second fastest etc...)
	
	movetimer = null; // name of timeout on sprite movement
	moveDir = 0; // direction of sprite movement
	levelend = 0; // 
	jumping = 0; // whether the sprite is in a jump
	moving = 0; // whether the sprite is moving
	spriteInactive = 1; // whether the sprite is in a collision or inactive
	onLadder = 0; // whether the sprite is on a ladder
	thislevel = 1; // the present level of the sprite
	obstaclelevel = thislevel; // level of obstacle
	obstacleEnabled = 1; // whether the obstacle must stop, i.e. if sprite hit question
	finishedqst = 0; // indicates whether the questions on the top level have been answered
	for (x=1; x<4; x++) eval("ladder"+x+"visi=0"); // sets all ladders as not visible
	for (x=1; x<9; x++) eval("qst"+x+"=0"); // question marks retrieved
	speedTimer = (gameSpeed*10);
	fillLayer();
}

//////////////////////////////////////////////////////////////////////////////

////////////////////////////////// HTML creation ////////////////////////////////

function layerWrite(id,text) {
 	if (ie) document.all[id].innerHTML = text;
	else if (ns7)
	{
		document.getElementById(id).innerHTML = text;
	}
	else if (n) {
		document.layers[id].document.write(text);
		document.layers[id].document.close();
 	}
}

function fillLayer() {
	////////////////////////////////////
	backdrop.visibility = noshow;
	backdrop.zIndex = 1;
	layerWrite('backdropDIV','<img src="hopImages/background.gif" border="0">');
	////////////////////////////////////
	inactive.visibility = noshow;
	inactive.zIndex = 5;
	layerWrite('inactiveDIV','<img src="hopImages/game_inactive.gif" border="0">');
	////////////////////////////////////
	controls.visibility = noshow;
	controls.zIndex = 4;
	layerWrite('controlsDIV','<img src="hopImages/controls.gif" border="0">');
	////////////////////////////////////
	reactivate.visibility = noshow;
	reactivate.zIndex = 6;
	layerWrite('reactivateDIV','<img src="hopImages/reactivate.gif" border="0">');
	////////////////////////////////////
	pregame.visibility = noshow;
	pregame.zIndex = 16;
	layerWrite('pregameDIV',top.master.GetHopInstructions());

	////////////////////////////////////
	lawyer.visibility = noshow;
	lawyer.zIndex = 6;
	// nkt change verbiage, change height, line break
	layerWrite('lawyerDIV',top.master.GetHopApprehededText());
	////////////////////////////////////
	sprite.visibility = noshow;
	sprite.zIndex = 3;
	layerWrite('spriteDIV','<img src="hopImages/sprite_r.gif" id="thesprite" name="thesprite">');
	if (ie) spriteimg = document.images["thesprite"];
	else if (ns7) spriteimg = document.getElementById("thesprite");
	else if (n) spriteimg = sprite.document.images["thesprite"];
	////////////////////////////////////
	obstacle1.visibility = noshow;
	obstacle1.zIndex = 2;
	layerWrite('obstacle1DIV','<img src="hopImages/obstacle_l.gif" id="theobstacle" name="theobstacle">');
	if (ie) obstacleimg = document.images["theobstacle"];
	else if (ns7) obstacleimg = document.getElementById("theobstacle");
	else if (n) obstacleimg = obstacle1.document.images["theobstacle"];
	////////////////////////////////////
	for (x=1; x<4; x++) eval('ladder'+x+'.visibility = noshow');
	for (x=1; x<4; x++) eval('ladder'+x+'.zIndex = "2"');
	layerWrite('ladder1DIV','<img src="hopImages/ladder_hide.gif" id="theladder1" name="theladder1">');
	layerWrite('ladder2DIV','<img src="hopImages/ladder_hide.gif" id="theladder2" name="theladder2">');
	layerWrite('ladder3DIV','<img src="hopImages/ladder_hide.gif" id="theladder3" name="theladder3">');
	if (ie) for (x=1; x<4; x++) eval('ladderimg'+x+' = document.images["theladder'+x+'"]');
	else if (ns7) for (x=1; x<4; x++) eval('ladderimg'+x+' = document.getElementById("theladder'+x+'")');
	else if (n) for (x=1; x<4; x++) eval('ladderimg'+x+' = ladder'+x+'.document.images["theladder'+x+'"]');
	////////////////////////////////////
	for (x=1; x<9; x++) eval('qstmark'+x+'.visibility = noshow');
	for (x=1; x<9; x++) eval('qstmark'+x+'.zIndex = "2"');
	layerWrite('qstmark1DIV','<img src="hopImages/qmark.gif" id="questionmark1" name="questionmark1">');
	layerWrite('qstmark2DIV','<img src="hopImages/qmark.gif" id="questionmark2" name="questionmark2">');
	layerWrite('qstmark3DIV','<img src="hopImages/qmark.gif" id="questionmark3" name="questionmark3">');
	layerWrite('qstmark4DIV','<img src="hopImages/qmark.gif" id="questionmark4" name="questionmark4">');
	layerWrite('qstmark5DIV','<img src="hopImages/qmark.gif" id="questionmark5" name="questionmark5">');
	layerWrite('qstmark6DIV','<img src="hopImages/qmark.gif" id="questionmark6" name="questionmark6">');
	layerWrite('qstmark7DIV','<img src="hopImages/qmark.gif" id="questionmark7" name="questionmark7">');
	layerWrite('qstmark8DIV','<img src="hopImages/qmark.gif" id="questionmark8" name="questionmark8">');
	if (ie) for (x=1; x<9; x++) eval('questionimg'+x+' = document.images["questionmark'+x+'"]');
	else if (ns7) for (x=1; x<9; x++) eval('questionimg'+x+' = document.getElementById("questionmark'+x+'")');
	else if (n) for (x=1; x<9; x++) eval('questionimg'+x+' = qstmark'+x+'.document.images["questionmark'+x+'"]');
	////////////////////////////////////
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
	
	setFirstPos();
}

function setFirstPos() {
	backdrop.top = cornerTop = 0; backdrop.left = cornerLeft = 0;
	inactive.top = cornerTop; inactive.left = cornerLeft;
	reactivate.top = cornerTop + 45; reactivate.left = cornerLeft + 531;
	pregame.top = cornerTop; pregame.left = cornerLeft + 70;
	controls.top = cornerTop; controls.left = cornerLeft + 530;

	sprite.top = cornerTop + 135; sprite.left = cornerLeft + 5;
	lawyer.top = cornerTop + 30; lawyer.left = cornerLeft + 120;
	obstacle1.top = cornerTop + 138; obstacle1.left = cornerLeft + 545;

	ladder1.top = cornerTop + 112; ladder1.left = cornerLeft + 510;
	ladder2.top = cornerTop + 72; ladder2.left = cornerLeft + 10;
	ladder3.top = cornerTop + 32; ladder3.left = cornerLeft + 510;
	
	qstmark1.top = cornerTop + 121; qstmark1.left = cornerLeft + 100;
	qstmark2.top = cornerTop + 121; qstmark2.left = cornerLeft + 300;
	qstmark3.top = cornerTop + 81; qstmark3.left = cornerLeft + 400;
	qstmark4.top = cornerTop + 81; qstmark4.left = cornerLeft + 200;
	qstmark5.top = cornerTop + 41; qstmark5.left = cornerLeft + 100;
	qstmark6.top = cornerTop + 41; qstmark6.left = cornerLeft + 300;
	qstmark7.top = cornerTop + 1; qstmark7.left = cornerLeft + 400;
	// nkt changed from 200 to below value to move left closer to finish
	qstmark8.top = cornerTop + 1; qstmark8.left = cornerLeft + 50;

	backdrop.visibility = yeshow;
	inactive.visibility = yeshow;
	reactivate.visibility = noshow;
	pregame.visibility = yeshow;
	lawyer.visibility = noshow;
	controls.visibility = yeshow;
	sprite.visibility = yeshow;
	obstacle1.visibility = yeshow;
	for (x=1; x<4; x++) eval("ladder"+x+".visibility = yeshow");
	for (x=1; x<9; x++) eval("qstmark"+x+".visibility = yeshow");
}

//////////////////////////////////////////////////////////////////////////////////

//////////////// fix for netscape resize bug ////////////////
if (document.layers) {
	origWidth = innerWidth;
	origHeight = innerHeight;
}

function reDo() {
	if (innerWidth != origWidth || innerHeight != origHeight) 
 		location.reload();
 }

if (document.layers) onresize = reDo;
/////////////////////////////////////////////////////////////

/////////////////////// controls control ///////////////////////

function mouseDown(e) {
	if (n || ns7) {var x=e.pageX; var y=e.pageY} ;
	if (ie) {var x=event.x; var y=event.y};
	
	if (spriteInactive==0) {
		if ((x>=531)&&(x<=599)&&(y>=46)&&(y<=69)) preMove(1);
		if ((x>=531)&&(x<=564)&&(y>=71)&&(y<=99)) preMove(2);
		if ((x>=566)&&(x<=599)&&(y>=71)&&(y<=99)) preMove(3);
	}
}
	
function mouseMove(e) {
	if (n || ns7) {var x=e.pageX; var y=e.pageY};
	if (ie) {var x=event.x; var y=event.y};
	
	if ( (moveDir==2) && ((x<=531)||(x>=564)||(y<=71)||(y>=99)) ) moveStop();
	if ( (moveDir==3) && ((x<=566)||(x>=599)||(y<=71)||(y>=99)) ) moveStop();
}

function mouseUp(e) {
	if (n || ns7) {var x=e.pageX; var y=e.pageY};
	if (ie) {var x=event.x; var y=event.y}; 
	
	moveStop();
}

/////////////////////////////////////////////////////////////
			
//////////////////// sprite movement ////////////////////

function preMove(num) {
	moveDir = num;
	if (num==1) {
		if (onLadder==1) moveUp();
		else if (jumping==0) {jumpstart = parseInt(sprite.top);moveJumpUp();}
	}
	if ((num==2)&&(moving==0)) moveLeft();
	if ((num==3)&&(moving==0)) moveRight();
}

function moveRight() {
	spriteimg.src = 'hopImages/sprite_r.gif';
	if (parseInt(sprite.left) <= 505) {
		moving = 1;
		sprite.left = (parseInt(sprite.left)) + 5;
		testPos();
		movetimer = setTimeout('moveRight()', speedTimer);
	}
}

function moveLeft() {
	spriteimg.src = 'hopImages/sprite_l.gif';
	if (parseInt(sprite.left) >= 15) {
		moving = 1;
		sprite.left = (parseInt(sprite.left)) - 5;
		testPos();
		movetimer = setTimeout('moveLeft()', speedTimer);
	}
}

function moveJumpUp()
{
	jumping = 1;
	sprite.top = (parseInt(sprite.top)) - 2;
	//if (levelend==0) {
	//	if ((thislevel==1)||(thislevel==3)) sprite.left = (parseInt(sprite.left)) + 2
	//	else sprite.left = (parseInt(sprite.left)) - 1
	//}
	if (parseInt(sprite.top) >= jumpstart-14)
		moveuptimer = setTimeout('moveJumpUp()', speedTimer);
	else
	{
		qmarkTest();
		if (levelend==0)
			moveJumpDown();
		else
			moveUp();
	}
}

function moveJumpDown()
{
	sprite.top = (parseInt(sprite.top)) + 2;
	//if (levelend!=1) {
	//	if ((thislevel==1)||(thislevel==3)) sprite.left = (parseInt(sprite.left)) + 2
	//	else sprite.left = (parseInt(sprite.left)) - 1
	//}

	if (parseInt(sprite.top) < jumpstart)
		moveuptimer = setTimeout('moveJumpDown()', speedTimer);
	else
		jumping = 0;
}

function moveUp() {
	onLadder = 1;
	sprite.top = (parseInt(sprite.top)) - 2;
	if (parseInt(sprite.top) > ((4-levelend)*40)-25) moveuptimer = setTimeout('moveUp()', speedTimer);
	else {
		thislevel=levelend+1;levelend=0;onLadder=0;jumping=0;
		if (thislevel==3) spriteimg.src = 'hopImages/sprite_r.gif';
		else spriteimg.src = 'hopImages/sprite_l.gif';
	}
}

function moveStop() {
	moving = 0;
	clearTimeout(movetimer);
}

////////////////////////////////////////////////////////
			
//////////////////// position test ////////////////////

function testPos() {self.top.status = parseInt(sprite.left);
	if ((thislevel==1)&&(parseInt(sprite.left)>500)&&(ladder1visi==1)) levelend = 1;
	if ((thislevel==2)&&(parseInt(sprite.left)<15)&&(ladder2visi==1)) levelend = 2;
	if ((thislevel==3)&&(parseInt(sprite.left)>500)&&(ladder3visi==1)) levelend = 3;
	if ((thislevel==4)&&(parseInt(sprite.left)<15)) if (finishedqst == 1) finished();
}

function finished()
{
	qstShow(9);
}

////////////////////////////////////////////////////////
			
//////////////////// question nodes ////////////////////

function qmarkTest() {
	if ((thislevel==1)&&(parseInt(sprite.left)>90)&&(parseInt(sprite.left)<110)&&(qst1==0)) qstShow(1);
	if ((thislevel==1)&&(parseInt(sprite.left)>290)&&(parseInt(sprite.left)<310)&&(qst2==0)) qstShow(2);
	if ((thislevel==2)&&(parseInt(sprite.left)>390)&&(parseInt(sprite.left)<410)&&(qst3==0)) qstShow(3);
	if ((thislevel==2)&&(parseInt(sprite.left)>190)&&(parseInt(sprite.left)<210)&&(qst4==0)) qstShow(4);
	if ((thislevel==3)&&(parseInt(sprite.left)>90)&&(parseInt(sprite.left)<110)&&(qst5==0)) qstShow(5);
	if ((thislevel==3)&&(parseInt(sprite.left)>290)&&(parseInt(sprite.left)<310)&&(qst6==0)) qstShow(6);
	if ((thislevel==4)&&(parseInt(sprite.left)>390)&&(parseInt(sprite.left)<410)&&(qst7==0)) qstShow(7);
	// nkt changed from >190 to > 40 and <210 to <60 since we moved the #8 questionmark closer to finish
	// nkt 4/12/01 check if all qst's == 1 before allowing to show #8
	if ((thislevel==4 && qst1==1 && qst2==1 && qst3==1 && qst4==1 && qst5==1 && qst6==1 && qst7==1)&&(parseInt(sprite.left)>40)&&(parseInt(sprite.left)<60)&&(qst8==0)) qstShow(8);
}

//////////////////// sliding layers ////////////////////

var presentQst;
var myType;
function qstShow(num)
{
	clearTimeout(obstacletimer);
	obstacleEnabled = 0;
	spriteInactive = 1;
	inactive.visibility = yeshow;
	
	if (num < 9)
	{
		eval("qstmark"+num+".visibility=noshow");
		reactivate.visibility = yeshow;
		presentQst = num;
	}

	doSwitch();

	//wait for frames to load...
	startAnswer();
}

function doSwitch()
{
	parent.lower.document.write('<frameset cols="300,*" frameborder="no" border="0" framespacing="0">');
		parent.lower.document.write('<frame src="Question.htm" name="question" frameborder="no" border="no" scrolling="auto">');
		parent.lower.document.write('<frame src="Answer.htm" name="answer" frameborder="no" border="no" scrolling="auto">');
	parent.lower.document.write('</frameset>');
}

function startQuestion()
{
	if (typeof(top.lower) != "undefined" && typeof(top.lower.question) != "undefined" && typeof(top.lower.question.loaded) != "undefined" && top.lower.question.loaded && (typeof(top.lower.question.start) == "object" || typeof(top.lower.question.start) == "function"))
		top.lower.question.start(top.master);
	else
		setTimeout("startQuestion()", 10);
}

function startAnswer()
{
	if (typeof(top.lower) != "undefined" && typeof(top.lower.answer) != "undefined" && typeof(top.lower.answer.loaded) != "undefined" && top.lower.answer.loaded && (typeof(top.lower.answer.start) == "object" || typeof(top.lower.answer.start) == "function"))
	{
		top.lower.answer.start(top.master);
		startQuestion();
	}
	else
		setTimeout("startAnswer()", 10);
}


function reactivateGame() {
	eval(" qst"+presentQst+"=1");
	if ((qst1==1)&&(qst2==1)&&(ladder1visi==0)) {ladderimg1.src = 'hopImages/ladder1_show.gif';ladder1visi=1};
	if ((qst3==1)&&(qst4==1)&&(ladder2visi==0)) {ladderimg2.src = 'hopImages/ladder2_show.gif';ladder2visi=1};
	if ((qst5==1)&&(qst6==1)&&(ladder3visi==0)) {ladderimg3.src = 'hopImages/ladder3_show.gif';ladder3visi=1};
	if ((qst7==1)&&(qst8==1)) finishedqst = 1;
	inactive.visibility = noshow;
	reactivate.visibility = noshow;
    parent.lower.location = "HopSplash.htm";
    top.startLower();
	spriteInactive = 0;
	obstacleEnabled = 1;
	if ((obstaclelevel == 1) || (obstaclelevel == 3))
		startObstacle1();
	else
		startObstacle2();
}

////////////////////////////////////////////////////////
			
/////////////////////// obstacles //////////////////////

function startObstacle1() {
	if (!obstacleEnabled)
	{
		clearTimeout(obstacletimer);
		return;
	}
	obstacleimg.src = 'hopImages/obstacle_l.gif';
	if ( (obstaclelevel==thislevel) && (onLadder!=1) && (parseInt(obstacle1.left)>=parseInt(sprite.left)+2) && (parseInt(obstacle1.left)<=parseInt(sprite.left)+8) && jumping!=1 ) collision();
	else {
		obstacle1.left = (parseInt(obstacle1.left)) - 2;
		if (parseInt(obstacle1.left) >= -15) obstacletimer = setTimeout('startObstacle1()', speedTimer);
		else {
			if (thislevel==1) {clearTimeout(obstacletimer); obstacle1.top = 138; obstacle1.left = 545; startObstacle1()}
			if (thislevel==2) {clearTimeout(obstacletimer); obstacle1.top = 98; obstacle1.left = -15; startObstacle2()}
			if (thislevel==3) {clearTimeout(obstacletimer); obstacle1.top = 58; obstacle1.left = 545; startObstacle1()}
			if (thislevel==4) {clearTimeout(obstacletimer); obstacle1.top = 18; obstacle1.left = -15; startObstacle2()}
			obstaclelevel = thislevel;
		}
	}
}
function startObstacle2() {
	if (!obstacleEnabled)
	{
		clearTimeout(obstacletimer);
		return;
	}
	obstacleimg.src = 'hopImages/obstacle_r.gif';
	if ( (obstaclelevel==thislevel) && (onLadder!=1) && (parseInt(obstacle1.left)>=parseInt(sprite.left)+2) && (parseInt(obstacle1.left)<=parseInt(sprite.left)+8) && jumping!=1 ) collision();
	else {
		obstacle1.left = (parseInt(obstacle1.left)) + 2;
		if (parseInt(obstacle1.left) <= 545) obstacletimer = setTimeout('startObstacle2()', speedTimer);
		else {
			if (thislevel==1) {clearTimeout(obstacletimer); obstacle1.top = 138; obstacle1.left = 545; startObstacle1()}
			if (thislevel==2) {clearTimeout(obstacletimer); obstacle1.top = 98; obstacle1.left = -15; startObstacle2()}
			if (thislevel==3) {clearTimeout(obstacletimer); obstacle1.top = 58; obstacle1.left = 545; startObstacle1()}
			if (thislevel==4) {clearTimeout(obstacletimer); obstacle1.top = 18; obstacle1.left = -15; startObstacle2()}
			obstaclelevel = thislevel;
		}
	}
}

function collision(){
	spriteInactive = 1;
	moveStop();
	lawyer.visibility = yeshow;
}	

function after_collision(){
	lawyer.visibility = noshow;
	// nkt don't set spriteimg here...
	//	spriteimg.src = 'hopImages/sprite_r.gif'
	// nkt reset top dependent upon level
	//sprite.top = cornerTop + 135; sprite.left = cornerLeft + 5
	moveDir = 0; // direction of sprite movement
	// nkt yes, leave levelend on 0
	levelend = 0; // 
	jumping = 0; // whether the sprite is in a jump
	moving = 0; // whether the sprite is moving
	onLadder = 0; // whether the sprite is on a ladder
	// nkt don't change level, keep on present level.......
	//thislevel = 1 // the present level of the sprite
	
	// nkt yes, set obstacle level to this level
	obstaclelevel = thislevel;


if (thislevel==1)
{
	spriteimg.src = 'hopImages/sprite_r.gif';
	sprite.top = cornerTop + 135; sprite.left = cornerLeft + 5;
	// don't set the lawyer object... it is not the little guy, but it the apprehension box!
//	lawyer.top = cornerTop + 30; lawyer.left = cornerLeft + 120
	clearTimeout(obstacletimer); obstacle1.top = 138; obstacle1.left = 545; startObstacle1();
}
else if (thislevel==2)
{
	spriteimg.src = 'hopImages/sprite_l.gif';
	sprite.top = cornerTop + 135 - 40; sprite.left = cornerLeft + 500;
	clearTimeout(obstacletimer); obstacle1.top = 98; obstacle1.left = -15; startObstacle2();
}
else if (thislevel==3)
{
	spriteimg.src = 'hopImages/sprite_r.gif';
	sprite.top = cornerTop + 135 - 80;	sprite.left = cornerLeft + 5;
	clearTimeout(obstacletimer); obstacle1.top = 58; obstacle1.left = 545; startObstacle1();
}
else if (thislevel==4)
{
	spriteimg.src = 'hopImages/sprite_l.gif';
	sprite.top = cornerTop + 135 - 120; sprite.left = cornerLeft + 500;
	clearTimeout(obstacletimer); obstacle1.top = 18; obstacle1.left = -15; startObstacle2();
}

//nkt put in level check above....
//	clearTimeout(obstacletimer); obstacle1.top = 138; obstacle1.left = 545; startObstacle1()
	spriteInactive = 0;
	
}	

////////////////////////////////////////////////////////

function startGame() {
	pregame.visibility = noshow;
	inactive.visibility = noshow;
	startObstacle1();
	spriteInactive = 0;
}
