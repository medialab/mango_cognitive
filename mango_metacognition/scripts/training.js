// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys			= [115, 108];

// Sleep duration between steps
var iWait01			= 3000;
var iWait02			= 250;
var iWait03			= 1000;
var iWait04			= 1000;
var iWait05			= 400;
var iWait06			= 100;
var iWait07			= 400;
var iWait08			= 3000;
var iWait09			= 400;
var iWait10			= 5000;

// Level for training
var aEasy			= Array(40, 60);
var aMiddle			= Array(44, 56);
var aHard			= Array(48, 52);

// Context
var sImagesPath		= 'mango/mango_metacognition/images/';
var iImageIterator	= 0;
var sMessageStart	= "Attention c'est parti!";
var sMessageAnswer	= "moins ? plus";
var iMaxIteration	= 3;
var sContext		= 'training';

function getRandomValues(iNumberOfValues, iMin, iMax) {
	var iTmp	= -1;
	var aResult	= new Array();
	while(aResult.length < iNumberOfValues) {
		iTmp = Math.round((iMax - iMin) * Math.random() + iMin);
		if($.inArray(iTmp, aResult) == -1) {
			aResult.push(iTmp);
		}
	}
	return aResult;
}

function onKeyPress(e) {
	if(aKeys.indexOf(e.which) != -1) {
		switch(e.which) {
			case 115:
				sAnwer = 'less';
				break;
			case 108:
				sAnwer = 'more';
				break;
		}
		setAnswer(sAnwer);
	}
}

function save() {
	$(document).unbind('keypress');
	$("#movenextbtn").click();
	$("#movesubmitbtn").click();
}

function setAnswer(sAnwer) {
	iStopTimestamp			= new Date().getTime();
	$(document).unbind('keypress');
	// Set as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00answer > input[type="text"]').val(sAnwer);
}

function step_01() {
	// Display the reference disc
	$('.lightbox .image').attr('src', sImagesPath + 'reference/stim_050_' + aReferences[0] + '.BMP');
	// Got to next step
	setTimeout(function() {step_02()}, iWait01);
}

function step_02() {
	// Display nothing
	$('.lightbox .image').attr('src', sImagesPath + 'blank.bmp');
	// Got to next step
	setTimeout(function() {step_03()}, iWait02);
}

function step_03() {
	// Display start message
	$('.lightbox .text').html(sMessageStart);
	// Got to next step
	setTimeout(function() {step_04()}, iWait03);
}

function step_04() {
	// Display nothing
	$('.lightbox .text').html('');
	$('.lightbox .image').attr('src', sImagesPath + 'blank.bmp');
	// Got to next step
	if(iImageIterator == iMaxIteration) {
		save();
	} else {
		setTimeout(function() {step_05()}, iWait04);
	}
}

function step_05() {
	// Display the fixing cross
	$('.lightbox .image').attr('src', sImagesPath + 'fixing_cross.bmp');
	// Got to next step
	setTimeout(function() {step_06()}, iWait05);
}

function step_06() {
	// Display the image
	iImageIterator++;
	iStartTimestamp = new Date().getTime();
	if(iImageIterator == 1) {
		sImage = 'stim_0' + aEasy[Math.floor(Math.random() * aEasy.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP';
	} else if(iImageIterator == 2) {
		sImage = 'stim_0' + aMiddle[Math.floor(Math.random() * aMiddle.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP';
	} else if(iImageIterator == 3) {
		sImage = 'stim_0' + aHard[Math.floor(Math.random() * aHard.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP';
	}
	$('.lightbox .image').attr('src', sImagesPath + sContext + '/' + sImage);
	// Set image name as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00image > input[type="text"]').val(sImage);
	// Got to next step
	setTimeout(function() {step_07()}, iWait06);
}

function step_07() {
	// Display nothing
	$('.lightbox .image').attr('src', sImagesPath + 'blank.bmp');
	// Got to next step
	setTimeout(function() {step_08()}, iWait07);
}

function step_08() {
	// Start listening on user interactions
	$('.lightbox .text').html(sMessageAnswer);
	$(document).bind('keypress', onKeyPress);
	// Got to next step
	setTimeout(function() {step_09()}, iWait08);
}

function step_09() {
	// Display nothing
	$('.lightbox .text').html('');
	setAnswer('no_answer');
	// Got to next step
	setTimeout(function() {step_10()}, iWait09);
}

function step_10() {
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display the right slider
	$('div[id^=question].numeric-multi:eq(' + i + ')').show();
	// Hide lightbox
	$('.lightbox').hide();
	// Got to next step
	setTimeout(function() {step_04(i + 1)}, iWait10);
;}

$(document).ready(
	function() {
		// Set default values
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00image > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00image > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00selftrust > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00selftrust > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayselftrust > input[type="text"]').val('-1');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayselftrust > input[type="text"]').removeClass('empty');
		// Move lightbox outside of the question
		$('.lightbox').appendTo('[id^="group-"]');
		// Build the references files
		aReferences		= getRandomValues(4, 1, 12);
		// Start training process
		step_01();
	}
);