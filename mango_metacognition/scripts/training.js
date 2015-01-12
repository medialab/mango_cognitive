;(function(undefined){
"use strict";

// Mouse clicks accepted as user interaction
// left click, right click
var aKeys				= [1, 3];

// Sleep duration between steps
var iWait01				= 3000;
var iWait02				= 250;
var iWait03				= 1000;
var iWait04				= 1000;
var iWait05				= 400;
var iWait06				= 100;
var iWait07				= 400;
var iWait08				= 3000;
var iWait09				= 400;
var iWait10				= 5000;

// Levels for training
var aEasy				= [40, 60];
var aMiddle				= [44, 56];
var aHard				= [48, 52];

// Context
var iImageIterator		= 0;
var iMaxIteration		= 3;
var iTimeout			= 0;
var iStartTimestamp		= 0;
var iStopTimestamp		= 0;
var sImage 				= '';
var sAnswer 			= '';
var sImagesPath			= 'mango/mango_metacognition/images/';
var sContext			= 'training/';
var sMessageReference	= 'Voici le cercle de référence.';
var sMessageStart		= 'Attention c\'est parti !';
var sMessageQuestion	= 'moins ? plus';
var sMessageKeys		= '<div class="key">Moins = Clic gauche</div><div class="key">Plus = Clic droit</div>';
var aImages				= [];


// Load all the images needed for this step into the browser cache then launch game
function preloadImages() {
	// Add the references image path
	var iReference = getRandomValues(1, 1, 12)[0];
	$('input.numeric').attr('value', iReference);
	aImages.push(sImagesPath + 'reference/stim_050_' + iReference + '.BMP');
	// Add blank image path
	aImages.push(sImagesPath + 'blank.bmp');
	// Add fixing cross image path
	aImages.push(sImagesPath + 'fixing_cross.bmp');
	// Add the easy image path
	aImages.push(sImagesPath + sContext + 'stim_0' + aEasy[Math.floor(Math.random() * aEasy.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP');
	// Add the middle image path
	aImages.push(sImagesPath + sContext + 'stim_0' + aMiddle[Math.floor(Math.random() * aMiddle.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP');
	// Add the hard image path
	aImages.push(sImagesPath + sContext + 'stim_0' + aHard[Math.floor(Math.random() * aHard.length)] + '_' + getRandomValues(1, 1, 4)[0] + '.BMP');
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
					step_01(0);
				}
			});
		}(index));
	});
}

function getRandomValues(iNumberOfValues, iMin, iMax) {
	var iTmp	= -1;
	var aResult	= [];
	while(aResult.length < iNumberOfValues) {
		iTmp = Math.round((iMax - iMin) * Math.random() + iMin);
		if($.inArray(iTmp, aResult) == -1) {
			aResult.push(iTmp);
		}
	}
	return aResult;
}

function onMouseClick(e) {
	if(aKeys.indexOf(e.which) != -1) {
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

function save() {
	$(document).unbind('click');
	$(document).unbind('contextmenu');
	$(document).bind('contextmenu', function (e) { e.preventDefault(); });
	$("#movenextbtn").click();
	$("#movesubmitbtn").click();
}

function setAnswer(sAnswer, step) {
	clearTimeout(iTimeout);
	iStopTimestamp			= new Date().getTime();
	$(document).unbind('click');
	$(document).unbind('contextmenu');
	$(document).bind('contextmenu', function (e) { e.preventDefault(); });
	// Set as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00answer > input[type="text"]').val(sAnswer);
	// Go to next step
	step_10(step);
}

function step_01(i) {
	// Display the reference disc
	$('.lightbox .text').html(sMessageReference);
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[0] + '" />');
	// Got to next step
	setTimeout(function() {step_02(i)}, iWait01);
}

function step_02(i) {
	// Display blank image
	$('.lightbox .text').html('');
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[1] + '" />');
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
	$('.lightbox .text').html(sMessageKeys);
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[1] + '" />');
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display lightbox
	$('.lightbox').show();
	// Got to next step
	if(iImageIterator == iMaxIteration) {
		save();
	} else {
		setTimeout(function() {step_05(i)}, iWait04);
	}
}

function step_05(i) {
	// Display the fixing cross
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[2] + '" />');
	// Got to next step
	setTimeout(function() {step_06(i)}, iWait05);
}

function step_06(i) {
	iImageIterator++;
	iStartTimestamp = new Date().getTime();
	// Display the image
	sImage = aImages[iImageIterator + 2];
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + sImage + '" />');
	// Set image name as answer
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + iImageIterator + ') > .answer_cell_00image > input[type="text"]').val(sImage);
	// Got to next step
	setTimeout(function() {step_07(i)}, iWait06);
}

function step_07(i) {
	// Display blank image
	$('.lightbox .image').remove();
	$('.lightbox').append('<img alt="" class="image screencentered" src="' + aImages[1] + '" />');
	// Start listening on user interactions
	$(document).bind('click', {step: i}, onMouseClick);
	$(document).bind('contextmenu', {step: i}, onMouseClick);
	// Got to next step
	iTimeout = setTimeout(function() {step_08(i)}, iWait07);
}

function step_08(i) {
	// Display help message to answer
	// $('.lightbox .question').html(sMessageQuestion);
	// Got to next step
	iTimeout = setTimeout(function() {step_09(i)}, iWait08);
}

function step_09(i) {
	// Unbind user interactions
	$(document).unbind('click');
	$(document).unbind('contextmenu');
	$(document).bind('contextmenu', function (e) { e.preventDefault(); });
	// $('.lightbox .question').html('');
	// Got to next step
	setTimeout(function() {setAnswer('no_answer', i)}, iWait09);
}

function step_10(i) {
	// Display nothing
	$('.lightbox .image').remove();
	// $('.lightbox .question').html('');
	$('.lightbox .text').html('');
	// Hide all questions
	$('div[id^="question"]').hide();
	// Display the right one
	$('div[id^="question"].numeric-multi:eq(' + i + ')').show();
	// Display the right slider
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider').css('z-index', '8');
	// Got to next step
	iTimeout = setTimeout(function() {step_04(i + 1)}, iWait10);
	// On click on the slider, go to next step
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider').click(
		function() {
			clearTimeout(iTimeout);
			step_04(i + 1);
		}
	);
	$('div[id^=question].numeric-multi:eq(' + i + ') .multinum-slider .ui-slider-handle').click(
		function() {
			clearTimeout(iTimeout);
			step_04(i + 1);
		}
	);
	
;}

$(document).ready(
	function() {
		// Move lightbox outside of the question
		$('.lightbox').appendTo('[id^="group-"]');
		// Display message for images loading
		$('.lightbox img').css('padding-top', '50px');
		$('.lightbox .text').html('<br/><br/>Chargement des images du jeu. Veuillez patienter.');
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
		// CSS for the sliders
		$('div[id^=question].numeric-multi .multinum-slider').css('color', 'white');
		$('div[id^=question].numeric-multi .slider-callout').css('color', 'white');
		$('div[id^=question].numeric-multi .multinum-slider').addClass('screencentered');
		// Disable context menu
		$(document).bind('contextmenu', function (e) { e.preventDefault(); });
		// Preload images and launch game
		preloadImages();
	}
);

})()