var image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11;
image1= new Image(102,121); image1.src="images/d1.gif";
image2= new Image(102,121); image2.src="images/d2.gif";
image3= new Image(102,121); image3.src="images/d3.gif";
image4= new Image(102,121); image4.src="images/d4.gif";
image5= new Image(102,121); image5.src="images/d5.gif";
image6= new Image(102,121); image6.src="images/d6.gif";
image7= new Image(102,121); image7.src="images/d7.gif";
image8= new Image(102,121); image8.src="images/d8.gif";
image9= new Image(102,121); image9.src="images/d9.gif";
var bStarted = false;
var curTurn;

function initDice(obj)
{
	document.title = obj["GameName"];
	if (document.all)	// IE
	{
		answer.Category1.innerHTML = obj["Categories"][0];
		answer.Category2.innerHTML = obj["Categories"][1];
		answer.Category3.innerHTML = obj["Categories"][2];
		answer.Category4.innerHTML = obj["Categories"][3];
		answer.Category5.innerHTML = obj["Categories"][4];
		answer.Category6.innerHTML = obj["Categories"][5];
		answer.Category7.innerHTML = obj["Categories"][6];
		answer.Category8.innerHTML = obj["Categories"][7];
		bottom.GameName.innerHTML = obj["GameName"];
		bottom.CourseName.innerHTML = obj["CourseName"];
	}
	else	// NS 7
	{
		answer.document.getElementById("Category1").innerHTML = obj["Categories"][0];
		answer.document.getElementById("Category2").innerHTML = obj["Categories"][1];
		answer.document.getElementById("Category3").innerHTML = obj["Categories"][2];
		answer.document.getElementById("Category4").innerHTML = obj["Categories"][3];
		answer.document.getElementById("Category5").innerHTML = obj["Categories"][4];
		answer.document.getElementById("Category6").innerHTML = obj["Categories"][5];
		answer.document.getElementById("Category7").innerHTML = obj["Categories"][6];
		answer.document.getElementById("Category8").innerHTML = obj["Categories"][7];
		bottom.document.getElementById("GameName").innerHTML = obj["GameName"];
		bottom.document.getElementById("CourseName").innerHTML = obj["CourseName"];
	}
}

function clickDice(nRoll, nTurn)
{
	if (!bStarted)
	{
		if (document.all)	// IE
		{
			answer.startGame.style.display = "none";
			answer.dice.style.display = "block";
			answer.continueBtn.onclick = master.pauseNext;
		}
		else	// NS 7
		{
			answer.document.getElementById("startGame").style.display = "none";
			answer.document.getElementById("dice").style.display = "block";
			answer.document.getElementById("continueBtn").onclick = master.pauseNext;
		}
	}
	else
	{
		if (document.all)	// IE
		{
			answer.answerDiv.style.display = "none";
			answer.riskyDiv.style.display = "block";
		}
		else	// NS 7
		{
			answer.document.getElementById("answerDiv").style.display = "none";
			answer.document.getElementById("riskyDiv").style.display = "block";
		}
	}
	
	if (bStarted)
	{
//		top.master.bResume = false;	// don't increment question yet, just show spinny guy or try again
//		top.master.goNext();
	}

	Roll(nRoll, nTurn);

	bStarted = true;
}

function Roll(nRoll, nTurn)
{
	switch (nRoll)
	{
/*
		case 6:
			image10= new Image(102,121); image10.src="images/d10.gif";	//roll 6
			image11= new Image(102,121); image11.src="images/d11.gif";
			break;
*/
		case 7:	//6 & 1
			image10= new Image(102,121); image10.src="images/d10a.gif";	//roll 7
			image11= new Image(102,121); image11.src="images/d11a.gif";
			break;

		case 5: //4
			image10= new Image(102,121); image10.src="images/d10b.gif";	//roll 5
			image11= new Image(102,121); image11.src="images/d11b.gif";
			break;

		case 6:	//8 & 5 & 2
			image10= new Image(102,121); image10.src="images/d10c.gif";	//roll 6
			image11= new Image(102,121); image11.src="images/d11c.gif";
			break;

		case 9:	//3
			image10= new Image(102,121); image10.src="images/d10d.gif";	//roll 9
			image11= new Image(102,121); image11.src="images/d11d.gif";
			break;

		case 12: //7
			image10= new Image(102,121); image10.src="images/d10e.gif";	//roll 12
			image11= new Image(102,121); image11.src="images/d11e.gif";
			break;

		default:
			image10= new Image(102,121); image10.src="images/d10f.gif";	//blank
			image11= new Image(102,121); image11.src="images/d11f.gif";
			alert("illegal dice roll " + nRoll);
			break;
	}

	var elemDice;
	if (document.all)	// IE
	{
		setTimeout('eval("answer.dice.src=image1.src")',10);
		setTimeout('eval("answer.dice.src=image2.src")',100);
		setTimeout('eval("answer.dice.src=image3.src")',200);
		setTimeout('eval("answer.dice.src=image4.src")',300);
		setTimeout('eval("answer.dice.src=image5.src")',400);
		setTimeout('eval("answer.dice.src=image6.src")',500);
		setTimeout('eval("answer.dice.src=image7.src")',600);
		setTimeout('eval("answer.dice.src=image8.src")',700);
		setTimeout('eval("answer.dice.src=image9.src")',800);
		setTimeout('eval("answer.dice.src=image10.src")',900);
		setTimeout('eval("answer.dice.src=image11.src")',1000);
	}
	else	// NS 7
	{
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image1.src")',10);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image2.src")',100);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image3.src")',200);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image4.src")',300);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image5.src")',400);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image6.src")',500);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image7.src")',600);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image8.src")',700);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image9.src")',800);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image10.src")',900);
		setTimeout('eval("answer.document.getElementById(\'dice\').src=image11.src")',1000);
	}

	top.master.bPause = false;	// increment question now...

	curTurn = nTurn;	// save in global
	setTimeout('eval("Move("+curTurn+")")',1000);
//	Move(nTurn);
}

function Move(turn)
{
	var nQDelay;
	switch (turn)
	{
		case 1:
		{
			if (document.all) {
			setTimeout('eval("parent.bottom.document.all.myToken.style.top = 39;")',1005);
			setTimeout('eval("parent.bottom.document.all.myToken.style.top = 8;")',1500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 196;")',2000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 164;")',2500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 132;")',3000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 100;")',3500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 68;")',4000);
			} else if (document.layers) {
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.top = 39;")',1005);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.top = 8;")',1500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 196;")',2000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 164;")',2500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 132;")',3000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 100;")',3500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 68;")',4000);
			} else {
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.top = 39;")',1005);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.top = 8;")',1500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 196;")',2000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 164;")',2500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 132;")',3000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 100;")',3500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 68;")',4000);
			}
			nQDelay = 4000;
			break;
		}
			
		case 2:
		{
			if (document.all) {
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 36;")',1500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 4;")',2000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 1004;")',2500);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 289;")',2502);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 258;")',3000);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 226;")',3500);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 194;")',4000);
			} else if (document.layers) {
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 36;")',1500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 4;")',2000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 1004;")',2500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 289;")',2500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 258;")',3000);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 226;")',3500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 194;")',4000);
			} else {
				setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 36;")',1500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 4;")',2000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 1004;")',2500);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 289;")',2502);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 258;")',3000);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 226;")',3500);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 194;")',4000);
			}
			nQDelay = 4000;
			break;
		}
		
		case 3:
		{
			if (document.all) {
			setTimeout('eval("parent.left.document.all.myToken.style.top = 162;")',1500);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 130;")',2000);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 98;")',2500);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 66;")',3000);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 34;")',3500);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 2;")',4000);
			setTimeout('eval("parent.left.document.all.myToken.style.top = 536;")',4500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 4;")',4502);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 36;")',5000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 68;")',5500);
			} else if (document.layers) {
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 162;")',1500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 130;")',2000);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 98;")',2500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 66;")',3000);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 34;")',3500);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 2;")',4000);
			setTimeout('eval("parent.left.document.layers.lyr.document.layers.tok.top = 536;")',4500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 4;")',4500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 36;")',5000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 68;")',5500);
			} else {
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 162;")',1500);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 130;")',2000);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 98;")',2500);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 66;")',3000);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 34;")',3500);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 2;")',4000);
			setTimeout('eval("parent.left.document.getElementById(\'myToken\').style.top = 536;")',4500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 4;")',4502);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 36;")',5000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 68;")',5500);
			}
			nQDelay = 5500;
			break;
		}
		
		case 4:
		{
			if (document.all) {
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 100;")',1500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 132;")',2000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 164;")',2500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 196;")',3000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 228;")',3500);
			} else if (document.layers) {
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 100;")',1500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 132;")',2000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 164;")',2500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 196;")',3000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 228;")',3500);
			} else {
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 100;")',1500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 132;")',2000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 164;")',2500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 196;")',3000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 228;")',3500);
			}
			nQDelay = 3500;
			break;
		}
			
		case 5:
		{
			if (document.all) {
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 260;")',1005);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 292;")',1500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 324;")',2000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 356;")',2500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 388;")',3000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 420;")',3500);
			} else if (document.layers) {
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 260;")',1005);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 292;")',1500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 324;")',2000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 356;")',2500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 388;")',3000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 420;")',3500);
			} else {
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 260;")',1005);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 292;")',1500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 324;")',2000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 356;")',2500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 388;")',3000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 420;")',3500);
			}
			nQDelay = 3500;
			break;
		}
			
		case 6:
		{
			if (document.all) {
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 452;")',1005);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 484;")',1500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 516;")',2000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 548;")',2500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 580;")',3000);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 612;")',3500);
			setTimeout('eval("parent.top_row.document.all.myToken.style.left = 804;")',4000);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 2;")',4000);
			} else if (document.layers) {
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 452;")',1005);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 484;")',1500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 516;")',2000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 548;")',2500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 580;")',3000);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 612;")',3500);
			setTimeout('eval("parent.top_row.document.layers.lyr.document.layers.tok.left = 804;")',4000);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 2;")',4000);
			} else {
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 452;")',1005);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 484;")',1500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 516;")',2000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 548;")',2500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 580;")',3000);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 612;")',3500);
			setTimeout('eval("parent.top_row.document.getElementById(\'myToken\').style.left = 804;")',4000);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 2;")',4000);
			}
			nQDelay = 4000;
			break;
		}
			
		case 7:
		{
			if (document.all) {
			setTimeout('eval("parent.right.document.all.myToken.style.top = 34;")',1005);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 66;")',1500);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 98;")',2000);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 130;")',2500);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 162;")',3000);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 194;")',3500);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 226;")',4000);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 258;")',4500);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 289;")',5000);
			setTimeout('eval("parent.right.document.all.myToken.style.top = 424;")',5500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 612;")',5500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 580;")',6000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 548;")',6500);
			} else if (document.layers) {
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 34;")',1005);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 66;")',1500);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 98;")',2000);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 130;")',2500);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 162;")',3000);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 194;")',3500);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 226;")',4000);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 258;")',4500);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 289;")',5000);
			setTimeout('eval("parent.right.document.layers.lyr.document.layers.tok.top = 424;")',5500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 612;")',5500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 580;")',6000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 548;")',6500);
			} else {
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 34;")',1005);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 66;")',1500);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 98;")',2000);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 130;")',2500);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 162;")',3000);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 194;")',3500);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 226;")',4000);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 258;")',4500);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 289;")',5000);
			setTimeout('eval("parent.right.document.getElementById(\'myToken\').style.top = 424;")',5500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 612;")',5500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 580;")',6000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 548;")',6500);
			}
			nQDelay = 6500;
			break;
		}
			
		case 8:
		{
			if (document.all) {
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 516;")',1005);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 484;")',1500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 452;")',2000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 420;")',2500);
			setTimeout('eval("parent.bottom.document.all.myToken.style.left = 388;")',3000);
			setTimeout('eval("parent.bottom.document.all.myToken.style.top = 40;")',3500);
			} else if (document.layers) {
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 516;")',1005);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 484;")',1500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 452;")',2000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 420;")',2500);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.left = 388;")',3000);
			setTimeout('eval("parent.bottom.document.layers.lyr.document.layers.tok.top = 40;")',3500);
			} else {
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 516;")',1005);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 484;")',1500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 452;")',2000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 420;")',2500);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.left = 388;")',3000);
			setTimeout('eval("parent.bottom.document.getElementById(\'myToken\').style.top = 40;")',3500);
			}
			nQDelay = 3500;
			break;
		}	
	}

	// wait til after all moves, then go next...
	setTimeout('top.master.goNext()',nQDelay+200);
}

function setTile(index)
{
	if (document.layers)
	{
		eval('parent.bottom.document.layers.lyr.document.layers.w'+index+'.visibility="visible"');
	}
	else if (document.all)
	{
		eval('parent.bottom.document.all.wedge'+index+'.style.visibility="visible"');
	}
	else
	{
		eval('parent.bottom.document.getElementById("wedge'+index+'").style.visibility="visible"');
	}
}