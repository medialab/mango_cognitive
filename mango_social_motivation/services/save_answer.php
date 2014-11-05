<?php

/**
 * @author Anne L'Hôte <anne.lhote@gmail.com>
 * 
 **/

/********** VARIABLES **********/
// Session variables
$aResponses 			= json_decode($_POST['data']);

$oDBConnection	= json_decode(file_get_contents('../../config.json'));

/********** PROGRAM **********/

// DB connection
$mysqli 			= mysqli_connect($oDBConnection->sDbHost, $oDBConnection->sDbUser, $oDBConnection->sDbPassword, $oDBConnection->sDbDatabase) or die("Error " . mysqli_error($link));

// Add this token into earning table
$sQuery 		= "INSERT INTO mango_social_motivation (";
$sQuery			.= "token, rank, screen_resolution, window_resolution, rewarded_line, displayed_line, user_answer, rewarded_score, is_rewarded, video_displayed, is_correct, delay_answer";
$sQuery			.= ") VALUES ";

foreach($aResponses as $sKey => $oResponse) {
	$sQuery			.= ($sKey == 0) ? '' : ', ';
	$sQuery			.= "('" . $oResponse->token . "', " . $oResponse->rank . ", '" . $oResponse->screenresolution . "', '" . $oResponse->windowresolution . "', '" . $oResponse->rewardedline . "', '" . $oResponse->displayedline . "', '" . $oResponse->useranswer . "', " . $oResponse->rewardedscore . ", " . $oResponse->isrewarded . ", '" . $oResponse->videodisplayed . "', " . $oResponse->iscorrect . ", " . $oResponse->delayanswer . ")";
}

if($stmt = $mysqli->prepare($sQuery)) {
	$stmt->execute();
 	$stmt->close();
}

// Close DB connection
$mysqli->close();

?>