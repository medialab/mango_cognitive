// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, S, l, L
var aKeys           = [115, 83, 108, 76];

// Sleep duration between steps
var iWait01			= 500;
var iWait02			= 1000;
var iWait03			= 250;
var iWait04			= 1750;

// Set path to fear images
var sPluginPath		= 'mango/mango_fear/';
var sImagesPath		= sPluginPath + 'images/';

// Initialize variables
// var aImages			= ['M20_R_A3.png', 'M20_R_F5.png', 'F19_D_A7.png', 'F19_D_F5.png', 'M20_D_A5.png', 'F19_D_A3.png', 'M20_D_F7.png', 'M20_D_A1.png', 'F19_L_A5.png', 'M20_L_F1.png', 'M20_D_F3.png', 'M20_L_A7.png', 'F19_R_A1.png', 'F19_D_F1.png', 'F19_L_F3.png', 'F19_R_F7.png'];
var aImages			= ['M20_R_A3.png', 'F19_L_F3.png',  'M20_D_F5.png', 'F19_R_A5.png', 'M20_D_A7.png', 'F19_D_F5.png', 'M20_L_F3.png', 'F19_D_A7.png'];
var iTimeout		= 0;
var iCounter		= 0;
var iScore			= 0;
var iSteps			= 4;
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


function onKeyPress(e) {
	if(aKeys.indexOf(e.which) != -1) {
		// Clear timeout and go to next step
		clearTimeout(iTimeout);
		$(document).unbind('keypress');
		// Save answer
		switch(e.which) {
			case 115:
			case 83:
				oResponse.touch	= 's';
				// If the user token is odd
				if(oResponse.token % 2) {
					oResponse.answer = 'fear';
				// If the user token is even
				} else {
					oResponse.answer = 'anger';
				}
				break;
			case 108:
			case 76:
				oResponse.touch	= 'l';
				// If the user token is odd
				if(oResponse.token % 2) {
					oResponse.answer = 'anger';
				// If the user token is even
				} else {
					oResponse.answer = 'fear';
				}
				break;
		}
		isAnswerCorrect();
		saveAnswer();
	}
}

/* *
 * A response is correct if the choice of the participant matches with the image
 * */
function isAnswerCorrect() {
	iReturn = -1;
	if((oResponse.filename.indexOf('_A') != -1) && (oResponse.answer == 'anger')) {
		iScore++;
	} else if((oResponse.filename.indexOf('_F') != -1) && (oResponse.answer == 'fear')) {
		iScore++;
	}
}

function displayScoreMessage() {
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
	if(oResponse.token % 2) {
		sScoreMessage += '<b>' + sText_05[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_06[sLang] + '</b> = ' + sText_08[sLang] + '<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage += '<b>' + sText_06[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_05[sLang] + '</b> = ' + sText_08[sLang];
	}
	sScoreMessage += '<span class="next"><br/><br/>' + sText_09[sLang] + '</span>';
	// Display this sScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	// Reset score
	iScore = 0;
}

function saveAnswer() {
	if(aImages.length == 0) {
		displayScoreMessage();
		$(document).keypress(
			function(event) {
				// Detect space keypress
				if(event.which == 32) {
					// Exit of the experiment
					exit();
				}
			}
		);
	} else {
		if(iCounter % iSteps == 0) {
			displayScoreMessage();
			$(document).keypress(
				function(event) {
					// Detect space keypress
					if(event.which == 32) {
						step_02();
					}
				}
			);
		} else {
			step_02();
		}
	}
}

function exit() {
	$(document).unbind('keypress');
	$('#movenextbtn').click();
	$('#movesubmitbtn').click();
}

function step_01() {
	// Get current user token
	sToken = ($('#token').length > 0) ? $('#token').val() : '0';
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage = '<b>' + sText_05[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_06[sLang] + '</b> = ' + sText_08[sLang] + '<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage = '<b>' + sText_06[sLang] + '</b> = ' + sText_07[sLang] + '<div class="space" /><b>' + sText_05[sLang] + '</b> = ' + sText_08[sLang];
	}
	sScoreMessage += '<span class="next"><br/><br/>' + sText_09[sLang] + '</span>';
	// Remove image
	$('.lightbox img').remove();
	// Display this sScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	$(document).keypress(
		function(event) {
			// Detect space keypress
			if(event.which == 32) {
				// Start training
				step_02();
			}
		}
	);
}

function step_02() {
	iCounter++;
	$(document).unbind('keypress');
	$('.fear .message .next').html('').hide();
	oResponse			= new Object();
	oResponse.token		= sToken;
	// Generate a random value between 500 and 750
	var iWait = Math.floor(Math.random() * 250 + iWait01);
	// Got to next step
	setTimeout(function() {step_03()}, iWait);
}

function step_03() {
	// Display the fixing cross
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'mask_fixingcross.png" />');
	// Generate a random value between 1000 and 1250
	var iWait = Math.floor(Math.random() * 250 + iWait02);
	// Got to next step
	setTimeout(function() {step_04()}, iWait);
}

function step_04() {
	// Get random element from an array
	aImage = aImages.splice(parseInt(Math.random() * aImages.length), 1);
	oResponse.filename = aImage[0];
	// Display the fear image
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + aImage[0] + '" />');
	// Got to next step
	iTimeout = setTimeout(function() {step_05()}, iWait03);
	// Start listening on user interactions
	$(document).bind('keypress', onKeyPress);
}

function step_05() {
	// Display the white mask
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'mask.png" />');
	iTimeout = setTimeout(function() {saveAnswer()}, iWait04);
}

$(document).ready(function() {
	// Get the survey language
	sLang = $('html').attr('lang');
	// Display the spinner
	$('.lightbox img').remove();
	$('.lightbox').append('<img alt="" class="screencentered" src="' + sImagesPath + 'spinner.gif" />');
	// Display Loading message
	$('.fear .message').html(sText_10[sLang]).show();
	// Preload all the images into cache
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
});