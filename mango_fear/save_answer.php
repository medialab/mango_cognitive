<?php

// DB Connection
$oParams = json_decode(file_get_contents('../config.json'));
$oDbConnection = mysqli_connect($oParams->sDbHost, $oParams->sDbUser, $oParams->sDbPassword, $oParams->sDbDatabase) or die("Error " . mysqli_error($link));

// Get POST values
$sToken			= $_POST['token'];
$sTouch			= $_POST['touch'];
$sAnswer		= $_POST['answer'];
$iDelayAnswer	= $_POST['delay_answer'];
$sFilename		= $_POST['filename'];
$bCorrect		= $_POST['correct'];

$iTouchNumber	= ($sTouch == 's') ? 1 : 2;
$iAnswerNumber	= ($sAnswer == 'anger') ? 1 : 2;

// Insert into DB
$sQuery = "INSERT INTO mango_fear_answers (token, touch, touch_number, answer, answer_number, delay_answer, filename, correct) VALUES ('$sToken', '$sTouch', $iTouchNumber, '$sAnswer', $iAnswerNumber, $iDelayAnswer, '$sFilename', $bCorrect)";
$oResult = $oDbConnection->query($sQuery);

?>