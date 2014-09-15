// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys		= [115, 108];

// Sleep duration between steps
var iWait01		= 500;
var iWait02		= 1000;
var iWait03		= 250;
var iWait04		= 1750;
var iWait05		= 15000;
var iWait06		= 20000;

// Set path to fear images
var sPluginPath	= 'mango/mango_fear/';
var sImagesPath	= sPluginPath + 'images/';
var aImages		= new Array();
var iTimeout	= 0;
var iScore		= 0;
var iSteps		= 60;
var sToken		= -1;


function onKeyPress(e) {
	iStopTimestamp = new Date().getTime();
	if(aKeys.indexOf(e.which) != -1) {
		// Clear timeout and go to next step
		clearTimeout(iTimeout);
		$(document).unbind('keypress');
		// Save answer
		switch(e.which) {
			case 115:
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touch > input[type="text"]').val('s');
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touchnumber > input[type="text"]').val('1');
				// If the user token is odd
				if(sToken % 2) {
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answer > input[type="text"]').val('fear');
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answernumber > input[type="text"]').val('2');
				// If the user token is even
				} else {
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answer > input[type="text"]').val('anger');
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answernumber > input[type="text"]').val('1');
				}
				break;
			case 108:
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touch > input[type="text"]').val('l');
				$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00touchnumber > input[type="text"]').val('2');
				// If the user token is odd
				if(sToken % 2) {
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answer > input[type="text"]').val('anger');
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answernumber > input[type="text"]').val('1');
				// If the user token is even
				} else {
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answer > input[type="text"]').val('fear');
					$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00answernumber > input[type="text"]').val('2');
				}
				break;
		}
		$('.array-multi-flexi-text .question tr.questions-list:eq(' + e.data.step + ') > .answer_cell_00correct > input[type="text"]').val(isAnswerCorrect(e.data.step));
		saveAnswer(e.data.step);
	}
}

/* *
 * A response is correct if the choice of the participant matches with the image
 * */
function isAnswerCorrect(i) {
	iReturn = -1;
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
	return iReturn;
}

function saveAnswer(i) {
	iStopTimestamp			= new Date().getTime();
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
	if(i == (aImages.length - 1)) {
		// Display the score message
		displayScoreMessage(0);
		// Exit from this experimentation ie. go to the next survey question
		setTimeout(function() {exit()}, iWait05);
	} else {
		i++;
		if(i % iSteps == 0) {
			displayScoreMessage(1);
			setTimeout(function() {step02(i)}, iWait05);
		} else {
			step02(i);
		}
	}
}

function exit() {
	$(document).unbind('keypress');
	$('#movenextbtn').click();
	$('#movesubmitbtn').click();
}

function displayScoreMessage(middle) {
	// Hide image
	$('.fear img').attr('src', '');
	// Build sScoreMessage
	var sScoreMessage = 'Vous avez obtenu ' + iScore;
	if(iScore > 1) {
		sScoreMessage += ' réponses correctes ';
	} else {
		sScoreMessage += ' réponse correcte ';
	}
	sScoreMessage +=  'sur ' + iSteps + '.<br/><br/>';
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage += '<b>PEUR</b> = touche S<div class="space" /><b>COLERE</b> = touche L<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage += '<b>COLERE</b> = touche S<div class="space" /><b>PEUR</b> = touche L<br/><br/>';
	}
	if(middle) {
		sScoreMessage += 'Vous êtes au milieu de l\'expérience ! Pause de 15 secondes.';
	}
	// Display this sScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	// Reset score
	iScore = 0;
}

function step01() {
	// Display image
	$('.lightbox img').attr('src', '').show();
	// Get current user token
	sToken = ($('#token').length > 0) ? $('#token').val() : '0';
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage = '<b>PEUR</b> = touche S<div class="space" /><b>COLERE</b> = touche L';
	// If the user token is even
	} else {
		sScoreMessage = '<b>COLERE</b> = touche S<div class="space" /><b>PEUR</b> = touche L';
	}
	// Display the ScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	// Start game
	setTimeout(function() { step02(0); }, iWait06);
}

function step02(i) {
	$(document).unbind('keypress');
	// Hide the ScoreMessage
	$('.fear .message').html('').hide();
	// Generate a random value between 500 and 750
	var iWait = Math.floor(Math.random() * 250 + iWait01);
	// Got to next step
	setTimeout(function() {step03(i)}, iWait);
}

function step03(i) {
	// Display the fixing cross
	$('.lightbox img').attr('src', sImagesPath + 'mask_fixingcross.png');
	// Vertical center images
	if($('.lightbox img').css('margin-top') == '0px') {
		var tmp = ($('.lightbox').height() - $('.lightbox .message').height() - $('.lightbox .message').css('margin-top').replace('px', '') - 406) / 2;
		$('.lightbox img').css('margin-top', tmp + 'px');
	}
	// Generate a random value between 1000 and 1250
	var iWait = Math.floor(Math.random() * 250 + iWait02);
	// Got to next step
	setTimeout(function() {step04(i)}, iWait);
}

function step04(i) {
	// Display the fear image
	$('.lightbox img').attr('src', sImagesPath + aImages[i]);
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00filename > input[type="text"]').val(aImages[i]);
	// Got to next step
	iTimeout = setTimeout(function() {step05(i)}, iWait03);
	iStartTimestamp = new Date().getTime();
	// Start listening on user interactions
	$(document).bind('keypress', {step : i}, onKeyPress);
}

function step05(i) {
	// Display the white mask
	$('.lightbox img').attr('src', sImagesPath + 'mask.png');
	iTimeout = setTimeout(function() {saveAnswer(i)}, iWait04);
}

$(document).ready(function() {
	// Display the spinner
	$('.lightbox img').attr('src', sImagesPath + 'spinner.gif');
	// Display this sScoreMessage
	sScoreMessage = 'Chargement des images du jeu. Veuillez patienter.<br/><br/>';
	$('.fear .message').html(sScoreMessage).show();
	// Set default values
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touch > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touch > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touchnumber > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00touchnumber > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answer > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answernumber > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00answernumber > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00filename > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00filename > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').removeClass('empty');
	// Preload all the images into cache
	$.ajax({
		type: 'POST',
		url: rooturl + sPluginPath + 'load_fear_images.php',
		data: { token: sToken },
		success: function(data) {
			var oResult = JSON.parse(data);
			// Set user group for all input
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').val(oResult.user_group);
			// Preload all the images into cache before launching the game
			aImages			= oResult.images;
			var imageObj	= new Image();
			var length 		= aImages.length - 1;
			var tmp 		= 0;
			$.each(aImages, function(index) {
				(function(index) {
					$.ajax({
						url: sImagesPath + aImages[index],
					}).done(function() {
						// If images loading finished, launch the game
						if(index == length) {
							step01();
						}
					});
				}(index));
			});
		}
	});
});