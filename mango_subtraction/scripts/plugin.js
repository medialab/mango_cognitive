;(function(undefined){
"use strict";

var iMin			= -8;
var iMax			= 8;
var time 			= 4 * 60 * 1000;
var messageTime		= time - 10 * 1000;
var iTransitionTime	= 10 * 1000;
var sImagesPath		= 'mango/mango_subtraction/images/';
var i 				= 0;
var iStartTimestamp	= 0;
var iDigit01 		= 0;
var iDigit02		= 0;
var iAnswer 		= 0;
var sToken			= '';
var nbAnswers           = 0;
var nbCorrectAnswers    = 0;

/* *
 * @param iNumberOfValues int Number of values to be randomly generated
 * @param iMin int Minimum value of the generated values
 * @param iMax int Maximum value of the generated values
 * @param aForbiddenValues Array List of forbidden values, not mandatory
 * @return Array of iNumberOfValues randomly generated values all different
 * */
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

function generateSubstraction() {
	iStartTimestamp = new Date().getTime();
	// Uncheck radio button
	$('input:radio[name="subtraction"]').prop('checked', false);
	// Hide incorrect message
	$('.subtraction .incorrectmessage').css('visibility', 'hidden');
	// Enable radio button
	$('input:radio[name="subtraction"]').prop('disabled', false);
	// Enable radio button label
	$('.subtraction .row:eq(2) > label').removeClass('disabled');
	// Set first subtraction digit
	iDigit01 = Math.floor(Math.random() * 8) + 1;
	$('.subtraction .row:eq(0)').text(iDigit01);
	// Set second subtraction digit
	iDigit02 = Math.floor(Math.random() * 8) + 1;
	$('.subtraction .row:eq(1) > span:eq(1)').text(iDigit02);
	// Calculate the correct answer
	iAnswer = iDigit01 - iDigit02;
	// Generate randomly the others answers
	var aAnswers = getRandomValues(3, iMin, iMax, [iAnswer]);
	aAnswers.push(iAnswer);
	// Randomly sort the answers array
	aAnswers.sort(function randOrd(){return (Math.round(Math.random()) - 0.5); });
	// Set first answer
	$('.subtraction .row:eq(2) > input:eq(0)').val(aAnswers[0]);
	$('.subtraction .row:eq(2) > label:eq(0)').text(aAnswers[0]);
	// Set second answer
	$('.subtraction .row:eq(2) > input:eq(1)').val(aAnswers[1]);
	$('.subtraction .row:eq(2) > label:eq(1)').text(aAnswers[1]);
	// Set third answer
	$('.subtraction .row:eq(2) > input:eq(2)').val(aAnswers[2]);
	$('.subtraction .row:eq(2) > label:eq(2)').text(aAnswers[2]);
	// Set fourth answer
	$('.subtraction .row:eq(2) > input:eq(3)').val(aAnswers[3]);
	$('.subtraction .row:eq(2) > label:eq(3)').text(aAnswers[3]);
}

function displayEndMessage() {
	$('.subtraction .endmessage').css('visibility', 'visible');
}

function displayVideosSelector() {
	$('.subtraction > .container').css('visibility', 'hidden');
	$('.subtraction select').show();
}

function initInteractions() {
	// Click on radio button label will click on the radio button
	$('.subtraction .row:eq(2) > label').click(
		function() {
			$(this).prev().click();
		}
	);
	// Launch the subtractions generation on clicking on the right button
	$('.button-subtraction').click(
		function() {
			saveAction('subtractions', 0);
			$('video')[0].pause();
			$('.subtraction video').hide();
			$('.subtraction .tetris').hide();
			$('.subtraction select').hide();
			$('.subtraction .endmessage').css('margin-top', '0');
			$('.subtraction > .container').css('visibility', 'visible');
			generateSubstraction();
		}
	);
	// Display the list of available videos
	$('.subtraction .button-video').click(
		function() {
			saveAction('videos', 0);
			displayVideosSelector();
		}
	);
	$('.subtraction select').change(
		function(e) {
			// Display the chosen video
			var video = $('.subtraction select > option:selected').attr('value');
			if(video == 'tetris') {
				// Pause video
				$('video')[0].pause();
				// Hide video
				$('.subtraction video').hide();
				// Display Tetris
				$('.subtraction .tetris').show();
			} else {
				// Hide Tetris
				$('.subtraction .tetris').hide();
				$('.subtraction video').attr('src', sImagesPath + video + '.mp4');
				$('.subtraction .endmessage').css('margin-top', '100px');
				$('.subtraction video').show();
				$('video')[0].load();
			}
		}
	);
	// Add the interactions on selecting an answer
	$('input:radio[name="subtraction"]').change(
		function() {
			var iNextDelay = 0;
			// Save response data
			var sUserAnswer = $(this).val();
			var iDelay = new Date().getTime() - iStartTimestamp;
			var bIsCorrect = (sUserAnswer == iAnswer) ? 1 : 0;

			nbAnswers++;
			if (bIsCorrect)
				nbCorrectAnswers++;
			// If user answer is incorrect
			if(!bIsCorrect) {
				$('.subtraction .incorrectmessage').css('visibility', 'visible');
				iNextDelay = 1 * 1000;
				// Disable radio button
				$('input:radio[name="subtraction"]').prop('disabled', true);
				// Disable radio button label
				$('.subtraction .row:eq(2) > label').addClass('disabled');
			}
			i++;
			saveAction('response', bIsCorrect);
			setTimeout(generateSubstraction, iNextDelay);
		}
	);
}

function hideAll() {
	// Hide the subtractions
	$('.subtraction > .container').css('visibility', 'hidden');
	// Hide the incorrect message
	$('.subtraction .incorrectmessage').css('visibility', 'hidden');
	// Hide end message
	$('.subtraction .endmessage').css('visibility', 'hidden');
	// Hide transition message
	$('.subtraction .transitionmessage').hide();
	// Hide the video
	$('.subtraction video').hide();
	// Hide the videos selector
	$('.subtraction select').hide();
	// Hide tetris
	$('.subtraction .tetris').hide();
	// Hide subtractions button
	$('.subtraction .button-subtraction').hide();
	// Hide video button
	$('.subtraction .button-video').hide();
	// Hide answers array
	$('.question').hide();
}

function displayTransitionMessage() {
	// Pause video
	$('video')[0].pause();
	saveAction('end', 0);

	// Before going out, we display a kind message if needed
	if (!nbAnswers) {
		return goout();
	}

	$('.endmessage')
		.text('Bravo! Tu as fait ' + nbAnswers + ' opérations et tu en as réussi ' + nbCorrectAnswers + '.')
		.css('color', 'green');

	setTimeout(function() {
		goout();
	}, 2000);
}

function cycle() {
	hideAll();
	// Show subtractions button
	$('.subtraction .button-subtraction').show();
	// Show video button
	$('.subtraction .button-video').show();
	setTimeout(displayEndMessage, messageTime);
	setTimeout(displayTransitionMessage, time);
}

function saveAction(sAction, bIsCorrect) {
	var sTimestamp = new Date().getTime();
	$.ajax({
		type: 'POST',
		url: 'mango/mango_subtraction/services/save_action.php',
		data: {token: sToken, action: sAction, timestamp: sTimestamp, isCorrect: bIsCorrect}
	});
}

$(document).ready(
	function() {
		sToken = $('.token').text();
		saveAction('start', 0);
		// $('video').css('margin-top', '180px');
		cycle();
		// Create all the user interactions for this game
		initInteractions();
	}
);

})()
