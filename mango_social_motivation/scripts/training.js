/*** VARIABLES ***/

// Key accepted as user interaction
// http://expandinghead.net/keycode.html
// s, S, l, L
var aKeys               = [115, 83, 108, 76];

// Sleep duration between steps
var iWait01             = 500;
var iWait02             = 500;
var iWait03             = 100;
var iWait04             = 3000;
var iWait05             = 1750;

// Experiment configuration
var iNumberOfIteration  = 6;
var i                   = 0;

// Set path to fear images
var sPluginPath         = 'mango/mango_social_motivation/';
var sImagesPath         = sPluginPath + 'images/';

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
    sVideoName = aVideos.pop();
    sText = ($('.text-short input').val() == '' ? '' : ',') + sVideoName;
    $('.text-short input').val($('.text-short input').val() + sText);
    $('.lightbox video').show();
    $('.lightbox video source:eq(0)').attr('src', sImagesPath + sVideoName + '.mp4');
    $('.lightbox video source:eq(1)').attr('src', sImagesPath + sVideoName + '.ogv');
    document.getElementById('video').load();
    document.getElementById('video').play();
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

/* *
 * Randomly select short or long image and display it
 * @return Integer 0 means short line, 1 means long line
 * */
function displayRandomLine() {
    var iChosenImage = Math.floor(Math.random() * 2);
    switch(iChosenImage) {
        case 0 :
            sImageName = SHORT_LINE_IMAGE;
            break;
        case 1 :
            sImageName = LONG_LINE_IMAGE;
            break;
    }
    displayImage(sImageName);
    return iChosenImage;
}

function onKeyPress(event) {
    if(aKeys.indexOf(event.which) != -1) {
        iUserResponse = event.which;
        $(document).unbind('keypress');
        // Clear timeout and go to next step
        clearTimeout(event.data.iTimeout);
        event.data.callback(null);
    }
}

function displayReward(iRewardedLine, iChosenImage, iUserResponse) {
    // Check if the user response is correct
    // Touche S = 115 or 83 = short line
    // Touche L = 108 or 76 = long line
    // If response is not correct display nothing
    // Else if response is correct
    if((((iUserResponse == 115) || (iUserResponse == 83)) && (iChosenImage == 0)) || (((iUserResponse == 108) || (iUserResponse == 76)) && (iChosenImage == 1))) {
        var tmp = Math.floor(Math.random() * 101);
        // If correct response is the rewarded line
        if(((iChosenImage == iRewardedLine) && (tmp <= 75)) || ((iChosenImage != iRewardedLine) && (tmp <= 25)))  {
            displayVideo();
        }
    }
}

function exit() {
    $('#movenextbtn').click();
    $('#movesubmitbtn').click();
}

function cycle() {
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
            iChosenImage = displayRandomLine();
            setTimeout(function() { callback(null); }, iWait03);
        },
        // Hide the chosen line and listen to user's interaction
        four: function(callback) {
            hideImage();
            iUserResponse = 0;
            iTimeout = setTimeout(function() { callback(null); }, iWait04);
            $(document).bind('keypress', {iTimeout : iTimeout, callback : callback}, onKeyPress);
        },
        // Don't listen to user interaction anymore and display the reward (if any)
        five: function(callback) {
            $(document).unbind('keypress');
            displayReward(iRewardedLine, iChosenImage, iUserResponse);
            i++;
            setTimeout(
                function() {
                    if(i < iNumberOfIteration) {
                        cycle();
                    } else {
                        callback(null);
                        exit();
                    }
                },
                iWait05
            );
        }
    });
}

$(document).ready(
    function() {
        // Display spinner for images loading
        displayImage('spinner.gif');
        // Rewarded line, 0 means short line, 1 means long line
        iRewardedLine = Math.floor(Math.random() * 2);
        // Randomly sort the array of videos
        aVideos.sort(function() {return Math.round(Math.random() * 2) - 1});
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