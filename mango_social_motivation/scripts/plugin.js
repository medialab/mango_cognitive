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
var iNumberOfIteration  = 35;
var iNumberOfSession    = 2;
var i                   = 0;
var j                   = 1;

// Set path to fear images
var sPluginPath         = 'mango/mango_social_motivation/';
var sImagesPath         = sPluginPath + 'images/';

// List of image
var CIRCLE_IMAGE        = 'circle.bmp';
var SHORT_LINE_IMAGE    = 'short.bmp';
var LONG_LINE_IMAGE     = 'long.bmp';
var aImages             = new Array(CIRCLE_IMAGE, SHORT_LINE_IMAGE, LONG_LINE_IMAGE);
var aVideos             = new Array(
    'AFN3_approval.mp4', 
    'AFN17_approval.mp4', 
    'AFN21_approval.mp4', 
    'AFN31_approval.mp4', 
    'AFN35_approval.mp4', 
    'AFN76_approval.mp4', 
    'AFN98_approval.mp4', 
    'AFW2_approval.mp4', 
    'AFW5_approval.mp4', 
    'AFW6_approval.mp4', 
    'AFW7_approval.mp4', 
    'AFW8_approval.mp4', 
    'AFW12_approval.mp4', 
    'AFW13_approval.mp4', 
    'AFW14_approval.mp4', 
    'AFW16_approval.mp4', 
    'AFW19_approval.mp4', 
    'AFW20_approval.mp4', 
    'AFW25_approval.mp4', 
    'AFW26_approval.mp4', 
    'AFW28_approval.mp4', 
    'AFW29_approval.mp4', 
    'AFW30_approval.mp4', 
    'AFW32_approval.mp4', 
    'AFW34_approval.mp4', 
    'AFW60_approval.mp4', 
    'AFW62_approval.mp4', 
    'AMN1_approval.mp4', 
    'AMN9_approval.mp4', 
    'AMN11_approval.mp4', 
    'AMN15_approval.mp4', 
    'AMN95_approval.mp4', 
    'AMN96_approval.mp4', 
    'AMN97_approval.mp4', 
    'AMW10_approval.mp4', 
    'AMW22_approval.mp4', 
    'AMW23_approval.mp4', 
    'AMW24_approval.mp4', 
    'AMW27_approval.mp4', 
    'AMW36_approval.mp4', 
    'AMW42_approval.mp4', 
    'AMW59_approval.mp4', 
    'AMW61_approval.mp4', 
    'AMW1014_approval.mp4'
);
var aMedias             = aImages.concat(aVideos);

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

function displayVideo(i) {
    sVideoName = aVideos.pop();
    $('.lightbox video').show();
    $('.lightbox video source').attr('src', sImagesPath + sVideoName);
    $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00videodisplayed > input[type="text"]').val(sVideoName);
    document.getElementById('video').load();
    document.getElementById('video').play();
}

function preloadMedias(aMedias) {
    var length = aMedias.length - 1;
    $.each(aMedias, function(index) {
        (function(index) {
            $.ajax({
                url: sImagesPath + aMedias[index],
            }).done(function() {
                // If media loading finished, launch the game
                if(index == length) {
                    // step_01(0);
                }
            });
        }(index));
    });
}

/* *
 * Randomly select short or long image and display it
 * @return Integer 0 means short line, 1 means long line
 * */
function displayRandomLine(i) {
    var iChosenImage = Math.floor(Math.random() * 2);
    switch(iChosenImage) {
        case 0 :
            sImageName = SHORT_LINE_IMAGE;
            break;
        case 1 :
            sImageName = LONG_LINE_IMAGE;
            break;
    }
    $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00displayedline > input[type="text"]').val(iChosenImage);
    displayImage(sImageName);
    return iChosenImage;
}

function onKeyPress(event) {
    if(aKeys.indexOf(event.which) != -1) {
        iUserResponse = event.which;
        $('.array-multi-flexi-text .question tr.questions-list:eq(' + event.data.i + ') > .answer_cell_00useranswer > input[type="text"]').val(iUserResponse);
        $(document).unbind('keypress');
        // Clear timeout and go to next step
        clearTimeout(event.data.iTimeout);
        event.data.callback(null);
    }
}

function displayReward(iRewardedLine, iChosenImage, iUserResponse, i) {
    // Check if the user response is correct
    // Touche S = 115 = short line
    // Touche L = 108 = long line
    // If response is correct
    if(((iUserResponse == 115) && (iChosenImage == 0)) || ((iUserResponse == 108) && (iChosenImage == 1))) {
        $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00correct > input[type="text"]').val('1');
        var rewardedScore = Math.floor(Math.random() * 101);
        $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00rewardedscore > input[type="text"]').val(rewardedScore);
        // If correct response is the rewarded line
        if(((iChosenImage == iRewardedLine) && (rewardedScore <= 75)) || ((iChosenImage != iRewardedLine) && (rewardedScore <= 25)))  {
            $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00isrewarded > input[type="text"]').val(1);
            displayVideo(i);
        }
    // Else if response is not correct display nothing
    } else {
        $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00correct > input[type="text"]').val('0');
    }
}

function exit() {
    $('#movenextbtn').click();
    $('#movesubmitbtn').click();
}

function cycle() {
    // Unbind event on keypress
    $(document).unbind('keypress');
    async.series({
        // Hide image and display fixing cross
        one: function(callback) {
            hideImage();
            hideVideo();
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
            iChosenImage = displayRandomLine(i);
            iStartTimestamp = new Date().getTime();
            setTimeout(function() { callback(null); }, iWait03);
        },
        // Hide the chosen line and listen to user's interaction
        four: function(callback) {
            hideImage();
            iUserResponse = 0;
            iTimeout = setTimeout(function() { callback(null); }, iWait04);
            $(document).bind('keypress', {iTimeout : iTimeout, callback : callback, i: i}, onKeyPress);
        },
        // Don't listen to user interaction anymore and display the reward (if any)
        five: function(callback) {
            $(document).unbind('keypress');
            iStopTimestamp = new Date().getTime();
            $('.array-multi-flexi-text .question tr.questions-list:eq(' + i + ') > .answer_cell_00delayanswer > input[type="text"]').val(iStopTimestamp - iStartTimestamp);
            displayReward(iRewardedLine, iChosenImage, iUserResponse, i);
            i++;
            setTimeout(
                function() {
                    if(i < iNumberOfIteration) {
                        cycle();
                    } else {
                        if(j < iNumberOfSession) {
                            j++;
                            i = 0;
                            // Hide image and video
                            hideImage();
                            hideVideo();
                            // Display break message
                            $('.break').show();
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
        // Hide break message
        $('.break').hide();
        // Rewarded line, 0 means short line, 1 means long line
        iRewardedLine = Math.floor(Math.random() * 2);
        // Set rewarded_line answer
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rewardedline > input[type="text"]').val(iRewardedLine);
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rewardedline > input[type="text"]').removeClass('empty');
        // Set default answers
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00displayedline > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00displayedline > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00useranswer > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00useranswer > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rewardedscore > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00rewardedscore > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00isrewarded > input[type="text"]').val('0');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00isrewarded > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00videodisplayed > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00videodisplayed > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00correct > input[type="text"]').removeClass('empty');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').val('-1');
        $('.array-multi-flexi-text .question tr.questions-list > .answer_cell_00delayanswer > input[type="text"]').removeClass('empty');
        // Filter already displayed videos
        $('.diplayedvideos').text().split(',').forEach(
            function(key, index) {
                if(key != '') {
                    iVideoIndex = aVideos.indexOf(key);
                    aVideos.splice(iVideoIndex, 1);
                }
            }
        );
        async.series({
            // Preload all medias
            one: function(callback) {
                preloadMedias(aMedias);
                callback();
            },
            two: function(callback) {
                cycle();
            }
        }, 
        function(err, results){
            console.log(results);
        });
    }
);