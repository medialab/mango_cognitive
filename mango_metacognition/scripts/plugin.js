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

// Levels for experiment
var aEasyLess		= new Array();
var aEasyMore		= new Array();
var aMiddleLess		= new Array();
var aMiddleMore		= new Array();
var aHardLess		= new Array();
var aHardMore		= new Array();
var aReferences		= new Array();
var aImages			= new Array();
var aRoundImages	= new Array();

// Context
var iNbRound 					= 3;
var iNbImagesByRound 			= 12;
var iNbImagesByLevelByRound 	= 2;
var iTimeout					= 0;
var sImagesPath					= 'mango/mango_metacognition/images/';
var sMessageStart				= "Attention c'est parti!";
var sMessageAnswer				= "moins ? plus";
var sContext					= 'experiment/';

function getRandomValues(iNumberOfValues, iMin, iMax, aForbiddenValues) {
	// Set empty array as default value
	aForbiddenValues	= aForbiddenValues || new Array();
	var iTmp			= -1;
	var aResult			= new Array();
	while(aResult.length < iNumberOfValues) {
		iTmp = Math.round((iMax - iMin) * Math.random() + iMin);
		if(($.inArray(iTmp, aResult) && $.inArray(iTmp, aForbiddenValues)) == -1) {
			aResult.push(iTmp);
		}
	}
	return aResult;
}

function onKeyPress(e) {
	if(aKeys.indexOf(e.which) != -1) {
		switch(e.which) {
			case 115:
				sAnswer = 'less';
				break;
			case 108:
				sAnswer = 'more';
				break;
		}
		if (typeof sAnswer != 'undefined') {
			setAnswer(sAnswer, e.data.step);
		}
	}
}

function setAnswer(sAnswer, step) {
	clearTimeout(iTimeout);
	iStopTimestamp = new Date().getTime();
	$(document).unbind('keypress');
	// Set as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00answer > input[type="text"]').val(sAnswer);
	// Go to next step
	step_10(step);
}

function exit() {
	$(document).unbind('keypress');
	$("#movenextbtn").click();
	$("#movesubmitbtn").click();
}

// Load all the images needed for this step into the browser cache then launch game
function preloadImages() {
	// Add blank image path
	aImages.push(sImagesPath + 'blank.bmp');
	// Add fixing cross image path
	aImages.push(sImagesPath + 'fixing_cross.bmp');
	// Build 3 references circles paths
	console.log($('.trainingReference').text());
	aReferences		= getRandomValues(3, 1, 12, new Array($('.trainingReference').text()));
	console.log(aReferences);
	aImages.push(sImagesPath + 'reference/stim_050_' + aReferences[0] + '.BMP');
	aImages.push(sImagesPath + 'reference/stim_050_' + aReferences[1] + '.BMP');
	aImages.push(sImagesPath + 'reference/stim_050_' + aReferences[2] + '.BMP');
	// Add 6 circles paths from easy level and less than 50 (ie. 040)
	aEasyLess		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess[5] + '.BMP');
	// Add 6 circles paths from easy level and more than 50 (ie. 060)
	aEasyMore		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore[5] + '.BMP');
	// Add 6 circles paths from middle level and less than 50 (ie. 044)
	aMiddleLess		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess[5] + '.BMP');
	// Add 6 circles paths from middle level and more than 50 (ie. 056)
	aMiddleMore		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore[5] + '.BMP');
	// Add 6 circles paths from hard level and less than 50 (ie. 048)
	aHardLess		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess[5] + '.BMP');
	// Add 6 circles paths from hard level and more than 50 (ie. 052)
	aHardMore		= getRandomValues(6, 1, 12);
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[0] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[1] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[2] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[3] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[4] + '.BMP');
	aImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore[5] + '.BMP');
	// Preload images into cache
	var length 		= aImages.length - 1;
	$.each(aImages, function(index) {
		(function(index) {
			$.ajax({
				url: aImages[index],
			}).done(function() {
				// If images loading finished, launch the game
				if(index == length) {
					$('.lightbox img').css('padding-top', '');
					// Start training process
					step_01(0);
				}
			});
		}(index));
	});
}

function step_01(i) {
	// Add 2 circles paths from easy level and less than 50 (ie. 040)
	aRoundImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_040_' + aEasyLess.pop() + '.BMP');
	// Add 2 circles paths from easy level and more than 50 (ie. 060)
	aRoundImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_060_' + aEasyMore.pop() + '.BMP');
	// Add 2 circles paths from middle level and less than 50 (ie. 044)
	aRoundImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_044_' + aMiddleLess.pop() + '.BMP');
	// Add 2 circles paths from middle level and more than 50 (ie. 056)
	aRoundImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_056_' + aMiddleMore.pop() + '.BMP');
	// Add 2 circles paths from hard level and less than 50 (ie. 048)
	aRoundImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_048_' + aHardLess.pop() + '.BMP');
	// Add 2 circles paths from hard level and more than 50 (ie. 052)
	aRoundImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore.pop() + '.BMP');
	aRoundImages.push(sImagesPath + sContext + 'stim_052_' + aHardMore.pop() + '.BMP');
	// Randomnly sort aRoundImages array
	aRoundImages.sort(function randOrd(){return (Math.round(Math.random()) - 0.5); });
	// Display the reference disc
	$('.lightbox .text').html('Voici le cercle de référence.');
	$('.lightbox .image').attr('src', sImagesPath + 'reference/stim_050_' + aReferences[(i / iNbImagesByRound)] + '.BMP');
	// Got to next step
	setTimeout(function() {step_02(i)}, iWait01);
}

function step_02(i) {
	// Display nothing
	$('.lightbox .image').attr('src', aImages[0]);
	// Got to next step
	setTimeout(function() {step_03(i)}, iWait02);
}

function step_03(i) {
	// Display start message
	$('.lightbox .text').html(sMessageStart);
	// Got to next step
	setTimeout(function() {step_04(i)}, iWait03);
}

function step_04(i) {
	// Empty lightbox
	$('.lightbox .text').html('');
	$('.lightbox .image').attr('src', aImages[0]);
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display lightbox
	$('.lightbox').show();
	// Got to next step
	setTimeout(function() {step_05(i)}, iWait04);
}

function step_05(i) {
	// Display the fixing cross
	$('.lightbox .image').attr('src', aImages[1]);
	// Got to next step
	setTimeout(function() {step_06(i)}, iWait05);
}

function step_06(i) {
	// Display the image
	iStartTimestamp = new Date().getTime();
	sImage = aRoundImages.pop();
	$('.lightbox .image').attr('src', sImage);
	// Set image name as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00image > input[type="text"]').val(sImage);
	// Got to next step
	setTimeout(function() {step_07(i)}, iWait06);
}

function step_07(i) {
	// Display nothing
	$('.lightbox .image').attr('src', aImages[0]);
	// Start listening on user interactions
	$(document).bind('keypress', {step: i}, onKeyPress);
	// Got to next step
	iTimeout = setTimeout(function() {step_08(i)}, iWait07);
}

function step_08(i) {
	// Display help message to answer
	$('.lightbox .text').html(sMessageAnswer);
	// Got to next step
	iTimeout = setTimeout(function() {step_09(i)}, iWait08);
}

function step_09(i) {
	// Display nothing
	$('.lightbox .text').html('');
	setAnswer('no_answer', i);
	// Got to next step
	setTimeout(function() {step_10(i)}, iWait09);
}

function step_10(i) {
	// Hide text and image
	$('.lightbox .text').html('');
	$('.lightbox img').attr('src', '');
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display the right one
	$('div[id^="question"].numeric-multi:eq(' + i + ')').show();
	// Display the right slider
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider').css('z-index', '8');
	// Got to next step
	if((i + 1) == (iNbRound * iNbImagesByRound)) {
		exit();
		setTimeout('exit()', iWait10);
	} else if((i + 1) % iNbImagesByRound == 0) {
		setTimeout(function() {step_01(i + 1)}, iWait10);
	} else {
		setTimeout(function() {step_04(i + 1)}, iWait10);
	}
}

$(document).ready(
	function() {
		// Move lightbox outside of the question
		$('.lightbox').appendTo('[id^="group-"]');
		// Display spinner for images loading
		$('.lightbox .text').html('<br/><br/>Chargement des images du jeu. Veuillez patienter.');
		$('.lightbox img').css('padding-top', '50px');
		$('.lightbox img').attr('src', sImagesPath + 'spinner.gif');
		// Set default values into the array
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
		// CSS for the sliders
		$('div[id^=question].numeric-multi').css('margin-left', '50%');
		$('div[id^=question].numeric-multi > span').css('margin-left', '-50%');
		$('div[id^=question].numeric-multi .multinum-slider').css('color', 'white');
		$('div[id^=question].numeric-multi .slider-callout').css('color', 'white');
		// Preload images and launch game
		preloadImages();
	}
);