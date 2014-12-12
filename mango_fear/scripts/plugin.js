// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, S, l, L
var aKeys           = [115, 83, 108, 76];

// Sleep duration between steps
var iWait01			= 500;
var iWait02			= 1000;
var iWait03			= 250;
var iWait04			= 1750;
var iWait05			= 15000;
var iWait06			= 5000;

// Set path to fear images
var sPluginPath 	= 'mango/mango_fear/';
var sImagesPath		= sPluginPath + 'images/';

// Initialize variables
var aImages			= new Array();
var iTimeout		= 0;
var iScore			= 0;
var iSteps			= 60;
var sToken			= -1;
var sLang			= '';

// Initialize texts
var sText_01		= {fr : 'Vous avez obtenu ', en : 'You have '};
var sText_02		= {fr : ' réponses correctes ', en : ' correct responses '};
var sText_03		= {fr : ' réponse correcte ', en : ' correct response '};
var sText_04		= {fr : 'sur ', en : 'on '};
var sText_05		= {fr : 'PEUR', en : 'FEAR'};
var sText_06		= {fr : 'COLERE', en : 'ANGER'};
var sText_07		= {fr : 'touche S', en : 'S key'};
var sText_08		= {fr : 'touche L', en : 'L key'};
var sText_09		= {fr : 'Appuyez sur espace pour continuer.', en : 'Press space key to continue.'};
var sText_10		= {fr : 'Chargement des images du jeu. Veuillez patienter.', en : 'Loading game images. Please wait.'};
var sText_11		= {fr : 'Vous êtes au milieu de l\'expérience ! Pause de 15 secondes.', en : 'You are in the middle of the experiment ! 15 seconds break.'};


function onKeyPress(e) {
	iStopTimestamp = new Date().getTime();
	if(aKeys.indexOf(e.which) != -1) {
		// Clear timeout and go to next step
		clearTimeout(iTimeout);
		$(document).unbind('keypress');
		// Save answer
		switch(e.which) {
			case 115:
			case 83:
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
			case 76:
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
			setTimeout(function() {step_02(i)}, iWait05);
		} else {
			step_02(i);
		}
	}
}

function exit() {
	$(document).unbind('keypress');
	$('#movenextbtn').click();
	$('#movesubmitbtn').click();
}

function displayScoreMessage(middle) {
	// Remove image
	$('.lightbox img').remove();
	// Build sScoreMessage
	var sScoreMessage = '<span class="next">' + sText_01[sLang] + iScore;
	if(iScore > 1) {
		sScoreMessage += sText_02[sLang];
	} else {
		sScoreMessage += sText_03[sLang];
	}
	sScoreMessage +=  sText_04[sLang] + iSteps + '.<br/></span>';
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage += '<b>' + sText_05[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_06[sLang] + '</b> = ' + sText_08[sLang] + '<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage += '<b>' + sText_06[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_05[sLang] + '</b> = ' + sText_08[sLang];
	}
	if(middle) {
		sScoreMessage += '<br/><br/>' + sText_11[sLang];
	}
	// Display this sScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	// Reset score
	iScore = 0;
}

function step_01() {
	// Remove image
	$('.lightbox img').remove();
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage = '<b>' + sText_05[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_06[sLang] + '</b> = ' + sText_08[sLang] + '<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage = '<b>' + sText_06[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_05[sLang] + '</b> = ' + sText_08[sLang];
	}
	// Display the ScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	// Start game
	setTimeout(function() { step_02(0); }, iWait06);
}

function step_02(i) {
	$(document).unbind('keypress');
	// Hide the ScoreMessage
	$('.fear .message').html('').hide();
	// Generate a random value between 500 and 750
	var iWait = Math.floor(Math.random() * 250 + iWait01);
	// Got to next step
	setTimeout(function() {step_03(i)}, iWait);
}

function step_03(i) {
	// Display the fixing cross
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'mask_fixingcross.png" />');
	// Generate a random value between 1000 and 1250
	var iWait = Math.floor(Math.random() * 250 + iWait02);
	// Got to next step
	setTimeout(function() {step_04(i)}, iWait);
}

function step_04(i) {
	// Display the fear image
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + aImages[i] + '" />');
	$('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00filename > input[type="text"]').val(aImages[i]);
	// Got to next step
	iTimeout = setTimeout(function() {step_05(i)}, iWait03);
	iStartTimestamp = new Date().getTime();
	// Start listening on user interactions
	$(document).bind('keypress', {step : i}, onKeyPress);
}

function step_05(i) {
	// Display the white mask
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'mask.png" />');
	iTimeout = setTimeout(function() {saveAnswer(i)}, iWait04);
}

$(document).ready(function() {
	// Hide the answers array
	$('.array-multi-flexi-text .question').hide();
	// Get the survey language
	sLang = $('html').attr('lang');
	// Get the survey ID
	sSurveyId = $('#sid').val();
	// Get current user token
	sToken = ($('#token').length > 0) ? $('#token').val() : '0';
	// Display the spinner
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'spinner.gif" />');
	// Display Loading message
	$('.fear .message').html(sText_10[sLang]).show();
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
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00screenresolution > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00screenresolution > input[type="text"]').removeClass('empty');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00windowdimensions > input[type="text"]').val('-1');
	$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00windowdimensions > input[type="text"]').removeClass('empty');
	// Preload all the images into cache
	$.ajax({
		type: 'POST',
		url: rooturl + sPluginPath + 'load_fear_images.php',
		data: { token: sToken, survey: sSurveyId },
		success: function(data) {
			var oResult = JSON.parse(data);
			// Set user group for all inputs
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00usergroup > input[type="text"]').val(oResult.user_group);
			// Set screen resolution for all inputs
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00screenresolution > input[type="text"]').val(screen.width + ' x ' + screen.height);
			// Set window dimension for all inputs
			$('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00windowdimensions > input[type="text"]').val(document.body.clientWidth + ' x ' + document.body.clientHeight);
			// Preload all the images into cache before launching the game
			aImages			= oResult.images;
			var length 		= aImages.length - 1;
			$.each(aImages, function(index) {
				(function(index) {
					$.ajax({
						url: sImagesPath + aImages[index],
					}).done(function() {
						// If images loading finished, launch the game
						if(index == length) {
							step_01();
						}
					});
				}(index));
			});
		}
	});
});