// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys			= [115, 108];

// Sleep duration between steps
var iWait01			= 500;
var iWait02			= 1000;
var iWait03			= 250;
var iWait04			= 1750;

// Set path to fear images
var sPluginPath		= 'mango/mango_fear/';
var sImagesPath		= sPluginPath + 'images/';
var aImages			= ['M20_R_A3.png', 'M20_R_F5.png', 'F19_D_A7.png', 'F19_D_F5.png', 'M20_D_A5.png', 'F19_D_A3.png', 'M20_D_F7.png', 'M20_D_A1.png', 'F19_L_A5.png', 'M20_L_F1.png', 'M20_D_F3.png', 'M20_L_A7.png', 'F19_R_A1.png', 'F19_D_F1.png', 'F19_L_F3.png', 'F19_R_F7.png'];
var iTimeout		= 0;
var iCounter		= 0;
var iScore			= 0;
var iSteps			= 4;
var sToken			= -1;

function preloadImages(aImages) {
	var imageObj = new Image();
	$.each(aImages, function(index) {
		imageObj.src = sImagesPath + aImages[index];
	});
}

function onKeyPress(e) {
	if(aKeys.indexOf(e.which) != -1) {
		// Clear timeout and go to next step
		clearTimeout(iTimeout);
		$(document).unbind('keypress');
		// Save answer
		switch(e.which) {
			case 115:
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
	// Hide image
	$('.fear img').attr('src', '');
	// Build sScoreMessage
	var sScoreMessage = 'Vous avez obtenu ' + iScore;
	if(iScore > 1) {
		sScoreMessage += ' réponses correctes ';
	} else {
		sScoreMessage += ' réponse correcte ';
	}
	sScoreMessage +=  'sur ' + iSteps + '.<br/>';
	// If the user token is odd
	if(oResponse.token % 2) {
		sScoreMessage += '<b>PEUR</b> = touche S<div class="space" /><b>COLERE</b> = touche L<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage += '<b>COLERE</b> = touche S<div class="space" /><b>PEUR</b> = touche L<br/><br/>';
	}
	sScoreMessage += 'Appuyez sur espace pour continuer.';
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
						step01();
					}
				}
			);
		} else {
			step01();
		}
	}
}

function exit() {
	$(document).unbind('keypress');
	$('#movenextbtn').click();
	$('#movesubmitbtn').click();
}

function step01() {
	iCounter++;
	$(document).unbind('keypress');
	$('.fear .message').html('').hide();
	oResponse			= new Object();
	oResponse.token		= sToken;
	// Generate a random value between 500 and 750
	var iWait = Math.floor(Math.random() * 250 + iWait01);
	// Got to next step
	setTimeout(function() {step02()}, iWait);
}

function step02() {
	// Display the fixing cross
	$('.lightbox img').attr('src', sImagesPath + 'mask_fixingcross.png');
	// Generate a random value between 1000 and 1250
	var iWait = Math.floor(Math.random() * 250 + iWait02);
	// Got to next step
	setTimeout(function() {step03()}, iWait);
}

function step03() {
	// Get random element from an array
	aImage = aImages.splice(parseInt(Math.random() * aImages.length), 1);
	oResponse.filename = aImage[0];
	// Display the fear image
	$('.lightbox img').attr('src', sImagesPath + aImage[0]);
	// Got to next step
	iTimeout = setTimeout(function() {step04()}, iWait03);
	// Start listening on user interactions
	$(document).bind('keypress', onKeyPress);
}

function step04() {
	// Display the white mask
	$('.lightbox img').attr('src', sImagesPath + 'mask.png');
	iTimeout = setTimeout(function() {saveAnswer()}, iWait04);
}

$(document).ready(function() {
	// Preload all the images into cache
	preloadImages(aImages);
	// Get current user token
	sToken = ($('#token').length > 0) ? $('#token').val() : '0';
	// If the user token is odd
	if(sToken % 2) {
		sScoreMessage = '<b>PEUR</b> = touche S<div class="space" /><b>COLERE</b> = touche L<br/><br/>';
	// If the user token is even
	} else {
		sScoreMessage = '<b>COLERE</b> = touche S<div class="space" /><b>PEUR</b> = touche L<br/><br/>';
	}
	sScoreMessage += 'Appuyez sur espace pour continuer.';
	// Display this sScoreMessage
	$('.fear .message').html(sScoreMessage).show();
	$(document).keypress(
		function(event) {
			// Detect space keypress
			if(event.which == 32) {
				// Start training
				step01(0);
			}
		}
	);
});