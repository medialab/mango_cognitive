// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys		= [115, 108];

// Images
var aImages	= [
	['1_-1.bmp', '1_1.bmp'],
	['1_-1.bmp', '-1_-1.bmp'],
	['1_-1.bmp', '-1_1.bmp'],
	['1_1.bmp', '-1_-1.bmp'],
	['1_1.bmp', '-1_1.bmp'],
	['-1_-1.bmp', '-1_1.bmp']
];

// Sleep duration between steps
var iWait01		= 1000;
var iWait02		= 1000;
var iWait03		= 2000;

// Set path to fear images
var sPluginPath	= 'mango/mango_preferences/';
var sImagesPath	= sPluginPath + 'images/';

function preloadImages(aImages, i) {
	// Load left image
	var oImageLeft		= new Image();
	oImageLeft.src		= sImagesPath + aImages[i][0];
	oImageLeft.onload	= function() {
		// Load right image
		var oImageRight		= new Image();
		oImageRight.src		= sImagesPath + aImages[i][1];
		oImageRight.onload	= function() {
			if(i == (aImages.length - 1)) {
				step01(0);
			} else {
				preloadImages(aImages, ++i);
			}
		}
	}
}

function onKeyPress(e) {
	if(aKeys.indexOf(e.which) != -1) {
		// Clear timeout and go to next step
		clearTimeout(iTimeout);
		$(document).unbind('keypress');
		// Save answer
		saveAnswer(e.data.step);
	}
}

function saveAnswer(i) {
	if(i == (aImages.length - 1)) {
		// Exit from this experimentation ie. go to the next survey question
		exit();
	} else {
		// Loop over the next iteration
		step01(++i);
	}
}

function exit() {
	$(document).unbind('keypress');
	// Hide title, cross and images
	$('.preferences .title').css('visibility', 'hidden');
	$('.preferences .column').css('visibility', 'hidden');
	$('.preferences .column img').attr('src', '');
	$('#movenextbtn').click();
	$('#movesubmitbtn').click();
}

function step01(i) {
	$(document).unbind('keypress');
	// Hide title, cross and images
	$('.preferences .title').css('visibility', 'hidden');
	$('.preferences .column').css('visibility', 'hidden');
	$('.preferences .column img').attr('src', '');
	setTimeout(function() {step02(i)}, iWait01);
}

function step02(i) {
	// Display the fixing cross
	$('.preferences .cross').css('visibility', 'visible');
	// Got to next step
	setTimeout(function() {step03(i)}, iWait02);
}

function step03(i) {
	// Hide cross
	$('.preferences .cross').css('visibility', 'hidden');
	// Display title
	$('.preferences .title').css('visibility', 'visible');
	// Set and display images
	$('.preferences .column.left img').attr('src', sImagesPath + aImages[i][0]);
	$('.preferences .column.right img').attr('src', sImagesPath + aImages[i][1]);
	$('.preferences .column.left').css('visibility', 'visible');
	$('.preferences .column.right').css('visibility', 'visible');
	// Start listening on user interactions
	$(document).bind('keypress', {step : i}, onKeyPress);
	// Got to next step
	iTimeout = setTimeout(function() {saveAnswer(i)}, iWait03);
}

$(document).ready(function() {
	// Preload all the images into cache
	preloadImages(aImages, 0);
});