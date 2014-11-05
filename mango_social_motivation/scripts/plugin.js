/*** VARIABLES ***/

// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, l
var aKeys               = [115, 108];

// Sleep duration between steps
var iWait01             = 500;
var iWait02             = 500;
var iWait03             = 100;
var iWait04             = 3000;
var iWait05             = 1750;

// Experiment configuration
var iNumberOfIteration  = 70;
var iNumberOfSession    = 3;
var i                   = 0;
var j                   = 1;
var sBreakMessage       = "Vous avez terminé la partie XX. Pour passer à la suite, appuyez sur la touche ESPACE.<br/><u>Rappel :</u> Appuyez sur la touche S pour les lignes courtes et sur L pour les lignes longues.";

// Set path to fear images
var sPluginPath         = 'mango/mango_social_motivation/';
var sImagesPath         = sPluginPath + 'images/';

// Initialize variables
var sToken             = '';
var iRank              = -1;
var sScreenResolution  = '';
var sWindowResolution  = '';
var sRewardedLine      = '';
var sDisplayedLine     = '';
var sUserAnswer        = '';
var iRewardedScore     = -1;
var bIsRewarded        = 0;
var sVideoDisplayed    = '';
var bIsCorrect         = 0;
var iDelayAnswer       = -1;
var aAnswers           = [];

// List of image
var CIRCLE_IMAGE        = 'circle.bmp';
var SHORT_LINE_IMAGE    = 'short.bmp';
var LONG_LINE_IMAGE     = 'long.bmp';
var aImages             = new Array(CIRCLE_IMAGE, SHORT_LINE_IMAGE, LONG_LINE_IMAGE);
var aVideos             = new Array(
    'AFN3_approval', 
    'AFN17_approval', 
    'AFN21_approval', 
    'AFN31_approval', 
    'AFN35_approval', 
    'AFN76_approval', 
    'AFN98_approval', 
    'AFW2_approval', 
    'AFW5_approval', 
    'AFW6_approval', 
    'AFW7_approval', 
    'AFW8_approval', 
    'AFW12_approval', 
    'AFW13_approval', 
    'AFW14_approval', 
    'AFW16_approval', 
    'AFW19_approval', 
    'AFW20_approval', 
    'AFW25_approval', 
    'AFW26_approval', 
    'AFW28_approval', 
    'AFW29_approval', 
    'AFW30_approval', 
    'AFW32_approval', 
    'AFW34_approval', 
    'AFW60_approval', 
    'AFW62_approval', 
    'AMN1_approval', 
    'AMN9_approval', 
    'AMN11_approval', 
    'AMN15_approval', 
    'AMN95_approval', 
    'AMN96_approval', 
    'AMN97_approval', 
    'AMW10_approval', 
    'AMW22_approval', 
    'AMW23_approval', 
    'AMW24_approval', 
    'AMW27_approval', 
    'AMW36_approval', 
    'AMW42_approval', 
    'AMW59_approval', 
    'AMW61_approval', 
    'AMW1014_approval'
);


/*** FUNCTIONS ***/

function hideImage() {
    $('.lightbox img').attr('src', '');
}

function hideVideo() {
    $('.lightbox video').hide();
    $('.lightbox video source').attr('src', '');
}

function displayImage(sImageName) {
    $('.lightbox img').attr('src', sImagesPath + sImageName);
}

function displayVideo() {
    sVideoDisplayed = aVideosTmp.pop();
    $('.lightbox video').show();
    $('.lightbox video source:eq(0)').attr('src', sImagesPath + sVideoDisplayed + '.mp4');
    $('.lightbox video source:eq(1)').attr('src', sImagesPath + sVideoDisplayed + '.ogv');
    document.getElementById('video').load();
    document.getElementById('video').play();
}

function displayBreakMessage(index) {
    $('.break').html(sBreakMessage.replace('XX', index));
    $('.break').show();
}

function preloadImages(aImages, callback) {
    var iImagesLength   = aImages.length;
    var iCounter        = 0;
    $.each(aImages, function(index) {
        $.ajax(sImagesPath + aImages[index]).done(function() {
            iCounter++;
            if(iCounter == iImagesLength) {
                callback();
            }
        });
    });
}

function preloadVideos(aVideos, callback) {
    var iVideosLength   = aVideos.length * 2;
    var iCounter        = 0;
    $.each(aVideos, function(index) {
        $.ajax(sImagesPath + aVideos[index] + '.mp4').done(function() {
            iCounter++;
            if(iCounter == iVideosLength) {
                callback();
            }
        });
        $.ajax(sImagesPath + aVideos[index] + '.ogv').done(function() {
            iCounter++;
            if(iCounter == iVideosLength) {
                callback();
            }
        });
    });
}

function onKeyPress(event) {
    if(aKeys.indexOf(event.which) != -1) {
        sUserAnswer = event.which;
        $(document).unbind('keypress');
        // Clear timeout and go to next step
        clearTimeout(event.data.iTimeout);
        event.data.callback(null);
    }
}

function initializeVariables() {
    iRank              = j * (i + 1);
    sDisplayedLine     = '';
    sUserAnswer        = '-1';
    iRewardedScore     = -1;
    bIsRewarded        = 0;
    sVideoDisplayed    = '';
    bIsCorrect         = 0;
    iDelayAnswer       = -1;
}

function displayReward(sRewardedLine, sDisplayedLine, sUserAnswer) {
    // Check if the user response is correct
    // Key S = 115 = short line
    // Key L = 108 = long line
    // If response is correct
    if(((sUserAnswer == 115) && (sDisplayedLine == SHORT_LINE_IMAGE)) || ((sUserAnswer == 108) && (sDisplayedLine == LONG_LINE_IMAGE))) {
        bIsCorrect = 1;
        iRewardedScore = Math.floor(Math.random() * 101);
        // If correct response is the rewarded line
        if(((sDisplayedLine == sRewardedLine) && (iRewardedScore <= 75)) || ((sDisplayedLine != sRewardedLine) && (iRewardedScore <= 25)))  {
            bIsRewarded = 1;
            displayVideo();
        }
    }
}

function exit() {
    $.ajax({
        url         : 'mango/mango_social_motivation/services/save_answer.php',
        data        : {'data' : JSON.stringify(aAnswers)},
        type        : 'POST'
    }).done(function(msg) {
        $('#movenextbtn').click();
        $('#movesubmitbtn').click();
    });
}

function cycle() {
    // Unbind event on keypress
    $(document).unbind('keypress');
    async.series({
        // Hide image and display fixing cross
        one: function(callback) {
            hideImage();
            hideVideo();
            initializeVariables();
            $('.socialmotivation .cross').css('visibility', 'visible');
            setTimeout(function() { callback(null); }, iWait01);
        },
        // Hide fixing cross and display empty circle
        two: function(callback) {
            $('.socialmotivation .cross').css('visibility', 'hidden');
            displayImage('circle.bmp');
            setTimeout(function() { callback(null); }, iWait02);
        },
        // Display the chosen line
        three: function(callback) {
            // Randomly select short or long image to be displayed
            sDisplayedLine = ((Math.floor(Math.random() * 2) ==  0) ? SHORT_LINE_IMAGE : LONG_LINE_IMAGE);
            displayImage(sDisplayedLine);
            iStartTimestamp = new Date().getTime();
            setTimeout(function() { callback(null); }, iWait03);
        },
        // Hide the chosen line and listen to user's interaction
        four: function(callback) {
            hideImage();
            iTimeout = setTimeout(function() { callback(null); }, iWait04);
            $(document).bind('keypress', {iTimeout : iTimeout, callback : callback, i: i}, onKeyPress);
        },
        // Don't listen to user interaction anymore and display the reward (if any)
        five: function(callback) {
            $(document).unbind('keypress');
            iDelayAnswer = new Date().getTime() - iStartTimestamp;
            displayReward(sRewardedLine, sDisplayedLine, sUserAnswer);
            i++;
            aAnswers.push({
                token               : sToken,
                rank                : iRank,
                screenresolution    : sScreenResolution,
                windowresolution    : sWindowResolution,
                rewardedline        : sRewardedLine,
                displayedline       : sDisplayedLine,
                useranswer          : sUserAnswer,
                rewardedscore       : iRewardedScore,
                isrewarded          : bIsRewarded,
                videodisplayed      : sVideoDisplayed,
                iscorrect           : bIsCorrect,
                delayanswer         : iDelayAnswer
            });
            setTimeout(
                function() {
                    if(i < iNumberOfIteration) {
                        cycle();
                    } else {
                        if(j < iNumberOfSession) {
                            // Hide image and video
                            hideImage();
                            hideVideo();
                            // Display break message
                            displayBreakMessage(j);
                            j++;
                            i = 0;
                            aVideosTmp = aVideos.slice(0);
                            $(document).bind('keypress', function(event) {
                                if(event.which == 32) {
                                    $('.break').hide();
                                    cycle();
                                }
                            });
                        } else {
                            callback(null);
                            exit();
                        }
                    }
                },
                iWait05
            );
        }
    });
}

$(document).ready(
    function() {
        // User token
        sToken             = ($('#token').length > 0) ? $('#token').val() : '0';
        // Screen resolution
        sScreenResolution  = screen.width + ' x ' + screen.height;
        // Window Size
        sWindowResolution  = document.body.clientWidth + ' x ' + document.body.clientHeight;
        // Randomnly choose the line to be rewarded
        sRewardedLine       = ((Math.floor(Math.random() * 2) ==  0) ? SHORT_LINE_IMAGE : LONG_LINE_IMAGE);
        // Filter already displayed videos
        $('.diplayedvideos').text().split(',').forEach(
            function(key, index) {
                if(key != '') {
                    iVideoIndex = aVideos.indexOf(key);
                    aVideos.splice(iVideoIndex, 1);
                }
            }
        );
        aVideosTmp = aVideos.slice(0);
        async.series({
            // Preload videos
            one: function(callback) {
                preloadVideos(aVideos, callback);
            },
            // Preload images
            two: function(callback) {
                preloadImages(aImages, callback);
            },
            three: function(callback) {
                cycle();
            }
        }, 
        function(err, results){
            console.log(results);
        });
    }
);