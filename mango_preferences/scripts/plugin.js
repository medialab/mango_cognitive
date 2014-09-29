// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys		= [115, 108];

// Images
var aImagesOdd	= [
	['-2_-2.bmp', '-2_0.bmp'],
	['-2_-2.bmp', '-2_2.bmp'],
	['0_-2.bmp', '-2_-2.bmp'],
	['-2_-2.bmp', '0_0.bmp'],
	['0_2.bmp', '-2_-2.bmp'],
	['2_-2.bmp', '-2_-2.bmp'],
	['2_0.bmp', '-2_-2.bmp'],
	['2_2.bmp', '-2_-2.bmp'],
	['-2_0.bmp', '-2_2.bmp'],
	['-2_0.bmp', '0_-2.bmp'],
	['0_0.bmp', '-2_0.bmp'],
	['-2_0.bmp', '0_2.bmp'],
	['-2_0.bmp', '2_-2.bmp'],
	['2_0.bmp', '-2_0.bmp'],
	['-2_0.bmp', '2_2.bmp'],
	['0_-2.bmp', '-2_2.bmp'],
	['0_0.bmp', '-2_2.bmp'],
	['-2_2.bmp', '0_2.bmp'],
	['-2_2.bmp', '2_-2.bmp'],
	['-2_2.bmp', '2_0.bmp'],
	['2_2.bmp', '-2_2.bmp'],
	['0_0.bmp', '0_-2.bmp'],
	['0_-2.bmp', '0_2.bmp'],
	['0_-2.bmp', '2_-2.bmp'],
	['0_-2.bmp', '2_0.bmp'],
	['0_-2.bmp', '2_2.bmp'],
	['0_0.bmp', '0_2.bmp'],
	['2_-2.bmp', '0_0.bmp'],
	['2_0.bmp', '0_0.bmp'],
	['2_2.bmp', '0_0.bmp'],
	['0_2.bmp', '2_-2.bmp'],
	['2_0.bmp', '0_2.bmp'],
	['2_2.bmp', '0_2.bmp'],
	['2_0.bmp', '2_-2.bmp'],
	['2_2.bmp', '2_-2.bmp'],
	['2_0.bmp', '2_2.bmp']
];
var aImagesEven	= [
	['-2_0.bmp', '-2_-2.bmp'], 
	['-2_2.bmp', '-2_-2.bmp'], 
	['-2_-2.bmp', '0_-2.bmp'], 
	['0_0.bmp', '-2_-2.bmp'], 
	['-2_-2.bmp', '0_2.bmp'], 
	['-2_-2.bmp', '2_-2.bmp'], 
	['-2_-2.bmp', '2_0.bmp'], 
	['-2_-2.bmp', '2_2.bmp'], 
	['-2_2.bmp', '-2_0.bmp'], 
	['0_-2.bmp', '-2_0.bmp'], 
	['-2_0.bmp', '0_0.bmp'], 
	['0_2.bmp', '-2_0.bmp'], 
	['2_-2.bmp', '-2_0.bmp'], 
	['-2_0.bmp', '2_0.bmp'], 
	['2_2.bmp', '-2_0.bmp'], 
	['-2_2.bmp', '0_-2.bmp'], 
	['-2_2.bmp', '0_0.bmp'], 
	['0_2.bmp', '-2_2.bmp'], 
	['2_-2.bmp', '-2_2.bmp'], 
	['2_0.bmp', '-2_2.bmp'], 
	['-2_2.bmp', '2_2.bmp'], 
	['0_-2.bmp', '0_0.bmp'], 
	['0_2.bmp', '0_-2.bmp'], 
	['2_-2.bmp', '0_-2.bmp'], 
	['2_0.bmp', '0_-2.bmp'], 
	['2_2.bmp', '0_-2.bmp'], 
	['0_2.bmp', '0_0.bmp'], 
	['0_0.bmp', '2_-2.bmp'], 
	['0_0.bmp', '2_0.bmp'], 
	['0_0.bmp', '2_2.bmp'], 
	['2_-2.bmp', '0_2.bmp'], 
	['0_2.bmp', '2_0.bmp'], 
	['0_2.bmp', '2_2.bmp'], 
	['2_-2.bmp', '2_0.bmp'], 
	['2_-2.bmp', '2_2.bmp'], 
	['2_2.bmp', '2_0.bmp']
];

// Sleep duration between steps
var iWait01		= 1000;
var iWait02		= 1000;
var iWait03		= 2000;

// Set path to fear images
var sPluginPath	= 'mango/mango_preferences/';
var sImagesPath	= sPluginPath + 'images/';
var aImages		= new Array();
var iTimeout	= -1;
var sToken		= -1;

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
		switch(e.which) {
			case 115:
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touch > input[type="text"]').val('s');
				break;
			case 108:
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touch > input[type="text"]').val('l');
				break;
		}
		$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00correct > input[type="text"]').val(isAnswerCorrect(e.data.step));
		saveAnswer(e.data.step);
	}
}

function saveAnswer(i) {
	iStopTimestamp = new Date().getTime();
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	if(i == (aImagesEven.length - 1)) {
		// Exit from this experimentation ie. go to the next survey question
		exit();
	} else {
		// Loop over the next iteration
		step01(++i);
	}
}

/* *
 * A response is correct if the choice of the participant matches with the image
 * */
function isAnswerCorrect(i) {
	iReturn = -1;
	/*
	var answer = $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00answer > input[type="text"]').val();
	if(aImages[i].indexOf('_A') != -1) {
		if(answer == 'anger') {
			iReturn = 1;
			iScore++;
		} else {
			iReturn = 0;
		}
	} else if(aImages[i].indexOf('_F') != -1) {
		if(answer == 'fear') {
			iReturn = 1;
			iScore++;
		} else {
			iReturn = 0;
		}
	}
	*/
	return iReturn;
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
	iStartTimestamp = new Date().getTime();
	// Hide cross
	$('.preferences .cross').css('visibility', 'hidden');
	// Display title
	$('.preferences .title').css('visibility', 'visible');
	// If the user token is odd
	if(sToken % 2) {
		$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00usergroup > input[type="text"]').val('1');
	// If the user token is even
	} else {
		$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00usergroup > input[type="text"]').val('2');
	}
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00leftimage > input[type="text"]').val(aImages[i][0]);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00rightimage > input[type="text"]').val(aImages[i][1]);
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
	// Set default values
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touch > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touch > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00leftimage > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00leftimage > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rightimage > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rightimage > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').removeClass('empty');
	// Get current user token
	sToken = ($('#token').length > 0) ? $('#token').val() : '0';
	// If the user token is odd
	if(sToken % 2) {
		aImages 	= aImagesOdd;
	// If the user token is even
	} else {
		aImages 	= aImagesEven;
	}
	// Preload all the images into cache
	preloadImages(aImages, 0);
});