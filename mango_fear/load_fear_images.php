<?php

// DB Connection
$oParams		= json_decode(file_get_contents('../config.json'));
$oDbConnection	= mysqli_connect($oParams->sDbHost, $oParams->sDbUser, $oParams->sDbPassword, $oParams->sDbDatabase) or die("Error " . mysqli_error($link));

// Get POST values
$sToken			= $_POST['token'];
$sSurveyId		= $_POST['survey'];

// Select the correct field from mango_constants table
$sIterator = ($sSurveyId == 352789) ? 'mturk_fear_iterator' : 'coop_fear_iterator';

// Get next pull of images to download
$sQuery			= "SELECT $sIterator AS iterator FROM mango_constants";
$oResult		= $oDbConnection->query($sQuery);
while($aRow = mysqli_fetch_array($oResult)) {
	$iIterator = $aRow['iterator'];
}

// Increment fear_iterator and loop if end (216) is reached
if($iIterator == 216) {
	$iNextIterator = 1;
} else {
	$iNextIterator = $iIterator + 1;
}
$sQuery			= "UPDATE mango_constants SET $sIterator = $iNextIterator";
$oResult		= $oDbConnection->query($sQuery);

// Select associated fear images
$aImages 		= array();
$sQuery			= "SELECT filename FROM mango_fear_images WHERE identifier = $iIterator";
$oResult		= $oDbConnection->query($sQuery);
while($aRow = mysqli_fetch_array($oResult)) {
	$aImages[] = $aRow['filename'];
}

// Build result object
$oResult = array(
	'user_group'	=> $iIterator,
	'images'		=> $aImages
);

echo json_encode($oResult);

?>