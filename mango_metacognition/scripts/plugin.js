;(function(undefined){
"use strict";

// Mouse clicks accepted as user interaction
// left click, right click
var aKeys						= [1, 3];

// TODO : change image source
// TODO : add async

// Sleep duration between steps
var iWait01						= 3000;
var iWait02						= 250;
var iWait03						= 1000;
var iWait04						= 1000;
var iWait05						= 400;
var iWait06						= 100;
var iWait07						= 400;
var iWait08						= 3000;
var iWait09						= 400;
var iWait10						= 5000;

// Levels for experiment
var aEasyLess					= [];
var aEasyMore					= [];
var aMiddleLess					= [];
var aMiddleMore					= [];
var aHardLess					= [];
var aHardMore					= [];
var aReferences					= [];
var aImages						= [];
var aRoundImages				= [];

// Context
var iNbRound 					= 3;
var iNbImagesByRound 			= 12;
var iNbImagesByLevelByRound 	= 2;
var iTimeout7					= 0;
var iTimeout8					= 0;
var iTimeout9					= 0;
var iTimeout10					= 0;
var iSlider						= 0;
var iStartTimestamp				= 0;
var iStopTimestamp				= 0;
var sNumberOfPointsDispayed 	= 0;
var sImage 						= '';
var sAnswer 					= '';
var sImageAnswer				= '';
var sIsCorrect					= '';
var sImagesPath					= 'mango/mango_metacognition/images/';
var sContext					= 'experiment/';
var sMessageReference			= 'Voici le cercle de référence.';
var sMessageStart				= 'Attention c\'est parti !';
var sMessageQuestion			= 'moins ? plus';


function getRandomValues(iNumberOfValues, iMin, iMax, aForbiddenValues) {
	// Set empty array as default value
	aForbiddenValues	= aForbiddenValues || [];
	var iTmp			= -1;
	var aResult			= [];
	while(aResult.length < iNumberOfValues) {
		iTmp = Math.round((iMax - iMin) * Math.random() + iMin);
		if(($.inArray(iTmp, aResult) && $.inArray(iTmp, aForbiddenValues)) == -1) {
			aResult.push(iTmp);
		}
	}
	return aResult;
}

function onMouseClick(e) {
	if(aKeys.indexOf(e.which) != -1) {
		// Unbind user interactions
		$(document).unbind('click');
		$(document).unbind('contextmenu');
		$(document).bind('contextmenu', function (e) { e.preventDefault(); });
		switch(e.which) {
			case 1:
				sAnswer = 'less';
				break;
			case 3:
				sAnswer = 'more';
				break;
		}
		if (typeof sAnswer != 'undefined') {
			setAnswer(sAnswer, e.data.step);
		}
	}
	return false;
}

function setAnswer(sAnswer, step) {
	clearTimeout(iTimeout7);
	clearTimeout(iTimeout8);
	clearTimeout(iTimeout9);
	iStopTimestamp = new Date().getTime();
	// Check if user answer is correct
	sNumberOfPointsDispayed = parseInt(sImage.split('_')[2]);
	sImageAnswer = (sNumberOfPointsDispayed < 50) ? 'less' : 'more';
	sIsCorrect = (sImageAnswer == sAnswer) ? '1' : '0';
	// Set as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00answer > input[type="text"]').val(sAnswer);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00correct > input[type="text"]').val(sAnswer);
	// Go to next step
	step_10(step);
}

// Got to next step
function next_round(i) {
	clearTimeout(iTimeout10);
	saveSlider(i);
	if((i + 1) == (iNbRound * iNbImagesByRound)) {
		exit();
	} else if((i + 1) % iNbImagesByRound == 0) {
		step_01(i + 1);
	} else {
		step_04(i + 1);
	}
}

function saveSlider(step) {
	iSlider = $('.numeric-multi:visible .slider-callout').text();
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + step + ') > .answer_cell_00selftrust > input[type="text"]').val(iSlider);
}

function exit() {
	$('#movesubmitbtn').click();
}

// Load all the images needed for this step into the browser cache then launch game
function preloadImages(callback) {
	// Add blank image path
	aImages.push(sImagesPath + 'blank.bmp');
	// Add fixing cross image path
	aImages.push(sImagesPath + 'fixing_cross.bmp');
	// Build 3 references circles paths
	aReferences		= getRandomValues(3, 1, 12, new Array($('.trainingReference').text()));
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
	var iImagesLength 	= aImages.length;
	var iCounter 		= 0;
	$.each(aImages, function(index) {
		$.ajax(aImages[index]).done(function() {
			iCounter++;
			// If images loading finished, launch the game
			if(iCounter == iImagesLength) {
				$('.lightbox img').css('padding-top', '');
                callback();
            }
		});
	});
}

function step_01(i) {
	// Hide all questions
	$('div[id^="question"]').hide();
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
	aRoundImages.sort(function() {return Math.round(Math.random() * 2) - 1});
	// Display the reference disc
	$('.lightbox .text').html(sMessageReference);
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + sImagesPath + 'reference/stim_050_' + aReferences[(i / iNbImagesByRound)] + '.BMP' + '" />');
	// Got to next step
	setTimeout(function() {step_02(i)}, iWait01);
}

function step_02(i) {
	// Display blank image
	$('.lightbox .text').html('');
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[0] + '" />');
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
	// Display blank image
	$('.lightbox .text').html('');
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[0] + '" />');
	// Hide all questions
	$('div[id^="question"]').hide();
	// Got to next step
	setTimeout(function() {step_05(i)}, iWait04);
}

function step_05(i) {
	// Display the fixing cross
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[0] + '" />');
	// Got to next step
	setTimeout(function() {step_06(i)}, iWait05);
}

function step_06(i) {
	iStartTimestamp = new Date().getTime();
	// Display the image
	sImage = aRoundImages.pop();
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + sImage + '" />');
	// Set image name as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00image > input[type="text"]').val(sImage);
	// Got to next step
	setTimeout(function() {step_07(i)}, iWait06);
}

function step_07(i) {
	// Display blank image
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[0] + '" />');
	// Start listening on user interactions
	$(document).bind('click', {step: i}, onMouseClick);
	$(document).bind('contextmenu', {step: i}, onMouseClick);
	// Got to next step
	iTimeout7 = setTimeout(function() {step_08(i)}, iWait07);
}

function step_08(i) {
	// Display help message to answer
	$('.lightbox .question').html(sMessageQuestion);
	// Got to next step
	iTimeout8 = setTimeout(function() {step_09(i)}, iWait08);
}

function step_09(i) {
	// Unbind user interactions
	$(document).unbind('click');
	$(document).unbind('contextmenu');
	$(document).bind('contextmenu', function (e) { e.preventDefault(); });
	$('.lightbox .question').html('');
	// Got to next step
	iTimeout9 = setTimeout(function() {setAnswer('no_answer', i)}, iWait09);
}

function step_10(i) {
	// Display nothing
	$('.lightbox .image').remove();
	$('.lightbox .question').html('');
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display the right one
	$('div[id^="question"].numeric-multi:eq(' + i + ')').show();
	// Display the right slider
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider').css('z-index', '8');
	// Got to next step
	iTimeout10 = setTimeout(function() { next_round(i); }, iWait10);
	// On click on the slider, go to next step
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider').click(
		function() {
			next_round(i);
		}
	);
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider .ui-slider-handle').click(
		function() {
			next_round(i);
		}
	);	
}

$(document).ready(
	function() {
		async.series({
			// Init DOM
			one: function(callback) {
				// Move lightbox outside of the question
				$('.lightbox').appendTo('[id^="group-"]');
				// Display message for images loading
				$('.lightbox img').css('padding-top', '50px');
				$('.lightbox .text').html('<br/><br/>Chargement des images du jeu. Veuillez patienter.');
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
				$('div[id^=question].numeric-multi .multinum-slider').css('color', 'white');
				$('div[id^=question].numeric-multi .slider-callout').css('color', 'white');
				$('div[id^=question].numeric-multi .multinum-slider').addClass('screencentered');
				// Disable context menu
				$(document).bind('contextmenu', function (e) { e.preventDefault(); });
				callback();
			},
			// Preload images
			two: function(callback) {
				preloadImages(callback);
			},
			// Launch game
			three: function(callback) {
				step_01(0);
			}
		},
		function(err, results) {
			console.log(results);
		});
	}
);

})()