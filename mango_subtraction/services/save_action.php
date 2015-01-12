<?php

/**
 * @author Anne L'Hôte <anne.lhote@gmail.com>
 * 
 **/

/********** VARIABLES **********/
// Session variables
$sToken			= $_POST['token'];
$sAction 		= $_POST['action'];
$iTimestamp		= $_POST['timestamp'];
$bIsCorrect		= $_POST['isCorrect'];

$oDBConnection	= json_decode(file_get_contents('../../config.json'));

/********** PROGRAM **********/

// DB connection
$mysqli 		= mysqli_connect($oDBConnection->sDbHost, $oDBConnection->sDbUser, $oDBConnection->sDbPassword, $oDBConnection->sDbDatabase) or die("Error " . mysqli_error($link));

// Add this token into earning table
$sQuery 		= "INSERT INTO mango_subtraction (";
$sQuery			.= "token, action, timestamp, iscorrect";
$sQuery			.= ") VALUES ";
$sQuery			.= "('" . $sToken . "', '" . $sAction . "', '" . $iTimestamp . "', '" . $bIsCorrect . "')";

if($stmt = $mysqli->prepare($sQuery)) {
	$stmt->execute();
 	$stmt->close();
}

// Close DB connection
$mysqli->close();

?>