;(function(undefined){
"use strict";
 
var iMin			= -8;
var iMax			= 8;
var time 			= 60 * 1000;
var messageTime		= time - 10 * 1000;
var sImagesPath		= 'mango/mango_subtraction/images/';
var iStartTimestamp	= 0;
var iDigit01		= 0;
var iDigit02		= 0;
var iAnswer			= 0;


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
			$('.subtraction .endmessage').css('margin-top', '0');
			$('.subtraction > .container').css('visibility', 'visible');
			generateSubstraction();
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
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit1 > input[type="text"]').val(iDigit01);
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit2 > input[type="text"]').val(iDigit02);
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').val(sUserAnswer);
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val(iDelay);
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val(bIsCorrect);
			// If user answer is incorrect
			if(!bIsCorrect) {
				$('.subtraction .incorrectmessage').css('visibility', 'visible');
				iNextDelay = 1 * 1000;
				// Disable radio button
				$('input:radio[name="subtraction"]').prop('disabled', true);
				// Disable radio button label
				$('.subtraction .row:eq(2) > label').addClass('disabled');
			}
			setTimeout(generateSubstraction, iNextDelay);
		}
	);
}

$(document).ready(
	function() {
		// Hide the subtractions
		$('.subtraction > .container').css('visibility', 'hidden');
		// Hide the incorrect message
		$('.subtraction .incorrectmessage').css('visibility', 'hidden');
		// Hide end message
		$('.subtraction .endmessage').css('visibility', 'hidden');
		// Hide answers array
		$('.question').hide();
		// Set default values into the array
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit1 > input[type="text"]').val('');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit1 > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit2 > input[type="text"]').val('');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00subdigit2 > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').val('');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val('');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').removeClass('empty');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val('');
		$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').removeClass('empty');
		setTimeout(displayEndMessage, messageTime);
		setTimeout(goout, time);
		// Create all the user interactions for this game
		initInteractions();
	}
);
 
})()