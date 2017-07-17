var timeout = null;
var planeObj = null;
var firstRun = true;
var imageSrc = null;
var backgroundSrc = null;
var lastTime = null;
var myRectangle;
var animProp;

var relativePath = '';
var companyId = 0;
var companyName = '';

var xPosition;
var yPosition;
var imageHeight;
var imageWidth;
var animationType;
var stopAt = 0;

window.requestAnimFrame = (function (callback) {
	return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
						window.mozRequestAnimationFrame ||
							window.oRequestAnimationFrame ||
								window.msRequestAnimationFrame ||
									function (callback) {
										timeout = window.setTimeout(callback, 1000 / 60);
									};
})();

function addEventHandler(el, evnt, func) {
	if (el.addEventListener) {
		el.addEventListener(evnt, func, true);
	} else if (el.attachEvent) {
		el.attachEvent('on' + evnt, func);
	}
}

function isCanvasSupported() {
	var canvas = document.getElementById("canvas");
	return !!(canvas.getContext && canvas.getContext('2d'));
}


function drawRect(myRectangle) {
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
	if (firstRun) {
		firstRun = false;
		planeObj = new Image();		
		planeObj.src = imageSrc; //  "svg/images/wc_logo.png/Plane/23453/Rafael.svg";
		planeObj.onload = function () {
			context.drawImage(planeObj, myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);
		};
	} else {
		try {
			context.drawImage(planeObj, myRectangle.x, myRectangle.y, myRectangle.width, myRectangle.height);	
		} catch(e) {

		} 
		
	}
}

function animateVerticalShrinkTopDown(lastTime, myRectangle, animProp) {
	if (animProp.animate) {

		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = 100;
		// pixels / second
		var linearDistEachFrame = 3; //  linearSpeed * timeDiff / 1000;
		//log(linearDistEachFrame);

		var currentY = myRectangle.y;
		var currentX = myRectangle.x;
		var currendWidth = myRectangle.width;
		var currendHeight = myRectangle.height;

		var shrinkStep = 1;

		if (currentY > 0 && currentY < (canvas.height / 2) - imageHeight) {
			var newY = currentY + linearDistEachFrame;

			myRectangle.y = newY;
			myRectangle.x = currentX + (shrinkStep / 2);

			myRectangle.width = currendWidth - shrinkStep;
			myRectangle.height = currendHeight - shrinkStep;
			lastTime = time;

			// clear
			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw
			drawRect(myRectangle);

			// request new frame
			requestAnimFrame(function () {
				animateVerticalShrinkTopDown(lastTime, myRectangle, animProp);
			});

		} else {
			context.clearRect(0, 0, canvas.width, canvas.height);

		}

	}
}

function animateVerticalShrinkBottomUp(lastTime, myRectangle, animProp) {
	if (animProp.animate) {

		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = 100;
		// pixels / second
		var linearDistEachFrame = 7; //  linearSpeed * timeDiff / 1000;
		//log(linearDistEachFrame);

		var currentY = myRectangle.y;
		var currentX = myRectangle.x;
		var currendWidth = myRectangle.width;
		var currendHeight = myRectangle.height;
		var shrinkStep = 1;

		if (currendWidth > 0 && currentY < (canvas.height + myRectangle.height) - myRectangle.height - myRectangle.borderHeight / 2) {
			var newY = currentY - linearDistEachFrame;
			myRectangle.y = newY;
			myRectangle.x = currentX + (shrinkStep / 2);
			myRectangle.width = currendWidth - shrinkStep;
			myRectangle.height = currendHeight - shrinkStep;
			lastTime = time;

			// clear
			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw
			drawRect(myRectangle);

			// request new frame
			requestAnimFrame(function () {
				animateVerticalShrinkBottomUp(lastTime, myRectangle, animProp);
			});

		}

	}
}

function animateVerticalBottomUp(lastTime, myRectangle, animProp) {
	if (animProp.animate) {

		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = 100;
		// pixels / second
		var linearDistEachFrame = linearSpeed * timeDiff / 1000;
		//log(linearDistEachFrame);
		var currentY = myRectangle.y;

		if (currentY < (canvas.height + myRectangle.height) - myRectangle.height - myRectangle.borderHeight / 2) {
			var newY = currentY - linearDistEachFrame;
			myRectangle.y = newY;

			lastTime = time;

			// clear
			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw
			drawRect(myRectangle);

			// request new frame
			requestAnimFrame(function () {
				animateVerticalBottomUp(lastTime, myRectangle, animProp);
			});

		}

	}
}

function animateVertical(lastTime, myRectangle, animProp) {
	if (animProp.animate) {

		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = 100;
		// pixels / second
		var linearDistEachFrame = linearSpeed * timeDiff / 1000;
		//log(linearDistEachFrame);
		var currentY = myRectangle.y;

		if (currentY < (canvas.height + myRectangle.height) - myRectangle.height - myRectangle.borderHeight / 2) {
			var newY = currentY - linearDistEachFrame;
			myRectangle.y = newY;

			lastTime = time;

			// clear
			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw
			drawRect(myRectangle);

			// request new frame
			requestAnimFrame(function () {
				animateVerticalBottomUp(lastTime, myRectangle, animProp);
			});

		}

	}
}

function animate(lastTime, myRectangle, animProp) {
	if (animProp.animate) {

		var canvas = document.getElementById("canvas");
		var context = canvas.getContext("2d");

		// update
		var date = new Date();
		var time = date.getTime();
		var timeDiff = time - lastTime;
		var linearSpeed = 100;
		// pixels / second
		var linearDistEachFrame = linearSpeed * timeDiff / 1000;
		//log(linearDistEachFrame);
		var currentX = myRectangle.x;

		if ((currentX < (canvas.width + myRectangle.width) - myRectangle.width - myRectangle.borderWidth / 2) && ((stopAt == 0) || (stopAt > 0 && currentX < stopAt))) {
			var newX = currentX + linearDistEachFrame;
			myRectangle.x = newX;

			lastTime = time;

			// clear
			context.clearRect(0, 0, canvas.width, canvas.height);

			// draw
			drawRect(myRectangle);

			// request new frame
			requestAnimFrame(function () {
				animate(lastTime, myRectangle, animProp);
			});

		}
	}
}

function reset() {

	clearTimeout(timeout);
	timeout = null;
	animProp.animate = false;
	var canvas = document.getElementById("canvas");

	var context = canvas.getContext("2d");
	context.clearRect(0, 0, canvas.width, canvas.height);

	myRectangle.x = xPosition;
	myRectangle.y = yPosition;
	myRectangle.width = imageWidth;
	myRectangle.height = imageHeight;

	drawRect(myRectangle);
	animProp.animate = true;
	switch (animationType) {
		case 1:
			animate(new Date().getTime(), myRectangle, animProp);
			break;
		case 2:
			animateVerticalBottomUp(new Date().getTime(), myRectangle, animProp);
			break;
		case 3:
			animateVerticalShrinkBottomUp(new Date().getTime(), myRectangle, animProp);
			break;
		case 4:
			animateVerticalShrinkTopDown(new Date().getTime(), myRectangle, animProp);
			break;
		default:
	}
}

function executeAnimation() {
	if (!isCanvasSupported()) {
		alert('HTML5 canvas is not supported');
		return;
	}

	myRectangle = {
		x: xPosition,
		y: yPosition,
		width: imageWidth,
		height: imageHeight,
		borderWidth: 0,
		borderHeight: 0
	};

	animProp = {
		animate: false,
		type: animationType
	};

	// add click listener to canvas
	var canvas = document.getElementById("canvas");
	if (canvas) {
		try {
			canvas.style.backgroundImage = 'url("' + backgroundSrc + '")';
		} catch (exception) {

		}

//		addEventHandler(canvas, "click", function () {
//			if (animProp.animate) {
//				animProp.animate = false;
//			} else {
//				animProp.animate = true;
//				animProp.type = animationType;
//				var date = new Date();
//				var time = date.getTime();

//				switch (animationType) {
//					case 1:
//						animate(new Date().getTime(), myRectangle, animProp);
//						break;
//					case 2:
//						animateVerticalBottomUp(new Date().getTime(), myRectangle, animProp);
//						break;
//					case 3:
//						animateVerticalShrinkBottomUp(new Date().getTime(), myRectangle, animProp);
//						break;
//					case 4:
//						animateVerticalShrinkTopDown(new Date().getTime(), myRectangle, animProp);
//						break;
//					default:
//				}

//			}
//		});
	}

	drawRect(myRectangle);
	animProp.animate = true;
	switch (animationType) {
		case 1:
			animate(new Date().getTime(), myRectangle, animProp);
			break;
		case 2:
			animateVerticalBottomUp(new Date().getTime(), myRectangle, animProp);
			break;
		case 3:
			animateVerticalShrinkBottomUp(new Date().getTime(), myRectangle, animProp);
			break;
		case 4:
			animateVerticalShrinkTopDown(new Date().getTime(), myRectangle, animProp);
			break;
		default:
			break;
	}

}

function setupAnimation(gameStep) {

	var random = Math.random();
	firstRun = true;
	var imgPath = "datafiles/logo-" + companyId + ".gif";
	companyName = companyName == '' ? '_' : companyName;
	companyName = companyName.replace(',', '').replace('.', '').replace(' ', '');
	
	var svgFile = companyName;//  + ".svg";
	
	
	switch (gameStep) {
		case 0:
			imageSrc =  "/wc2/noextsvg/" + imgPath + "/airplane-side/"+companyId+"/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_1.png";
			xPosition = -80;
			yPosition = 267;

			imageHeight = 30;
			imageWidth = 73;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 1;
			stopAt = 10;
			break;
		case 1:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-top/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_2.png";
			xPosition = 0;
			yPosition = 257;

			imageHeight = 50;
			imageWidth = 83;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 3;
			stopAt = 0;
			break;
		case 2:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-side/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_3.png";
			xPosition = -80;
			yPosition = 127;

			imageHeight = 40;
			imageWidth = 103;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 1;
			stopAt = 0;
			break;
		case 3:
			imageSrc = "/wc2/noextsvg/" + imgPath + "g/airplane-bottom/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_4.png";
			xPosition = 0;
			yPosition = 4;

			imageHeight = 40;
			imageWidth = 103;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 4;
			stopAt = 0;
			break;
		case 4:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-top/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_5.png";
			xPosition = 0;
			yPosition = 257;

			imageHeight = 50;
			imageWidth = 83;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 3;
			stopAt = 0;
			break;
		case 5:
			imageSrc = "/wc2/noextsvg/" + imgPath + "g/airplane-bottom/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_6.png";
			xPosition = -5;
			yPosition = 4;

			imageHeight = 40;
			imageWidth = 103;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 4;
			stopAt = 0;
			break;
		case 6:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-side/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_7.png";
			xPosition = -80;
			yPosition = 127;

			imageHeight = 40;
			imageWidth = 103;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 1;
			stopAt = 0;
			break;
		case 7:
			imageSrc = "/wc2/noextsvg/" + imgPath + "g/airplane-bottom/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_8.png";
			xPosition = -5;
			yPosition = 4;

			imageHeight = 40;
			imageWidth = 103;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 4;
			stopAt = 0;
			break;
		case 8:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-side/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_9.png";
			xPosition = -80;
			yPosition = 37;

			imageHeight = 30;
			imageWidth = 73;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 1;
			stopAt = 0;
			break;
		case 9:
			imageSrc = "/wc2/noextsvg/" + imgPath + "/airplane-side/" + companyId + "/" + svgFile;
			backgroundSrc = relativePath + "airplaneImages/smallBackgrounds/BG_10.png";
			xPosition = -80;
			yPosition = 267;

			imageHeight = 30;
			imageWidth = 73;

			finalImageHeight = 50;
			finalImageWidth = 41;

			animationType = 1;
			stopAt = 10;
			break;
	}
	imageSrc = imageSrc + "?r=" + random;	
	executeAnimation();
}





