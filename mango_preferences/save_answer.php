<?php

// DB Connection
$oParams = json_decode(file_get_contents('../config.json'));
$oDbConnection = mysqli_connect($oParams->sDbHost, $oParams->sDbUser, $oParams->sDbPassword, $oParams->sDbDatabase) or die("Error " . mysqli_error($link));

// Get POST values
$sToken			= $_POST['token'];
$iUserGroup		= $_POST['user_group'];
$sTouch			= $_POST['touch'];
$iDelayAnswer	= $_POST['delay_answer'];
$sLeftImage		= $_POST['left_image'];
$sRightImage	= $_POST['right_image'];

// Insert into DB
$sQuery = "INSERT INTO mango_preferences_answers (token, user_group, touch, delay_answer, left_image, right_image) VALUES ('$sToken', $iUserGroup, '$sTouch', $iDelayAnswer, '$sLeftImage', '$sRightImage')";
$oResult = $oDbConnection->query($sQuery);

?>