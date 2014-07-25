<?php

// DB Connection
$oParams		= json_decode(file_get_contents('../config.json'));
$oDbConnection	= mysqli_connect($oParams->sDbHost, $oParams->sDbUser, $oParams->sDbPassword, $oParams->sDbDatabase) or die("Error " . mysqli_error($link));

// Get POST values
$sToken			= $_GET['token'];

// Get next pull id of images to download
$sQuery			= "SELECT fear_iterator FROM lime_constants";
$oResult		= $oDbConnection->query($sQuery);
while($aRow = mysqli_fetch_array($oResult)) {
	$fear_iterator = $aRow['fear_iterator'];
}

// Increment fear_iterator and loop if end (239) is reached
if($fear_iterator == 239) {
	$next_fear_iterator = 1;
} else {
	$next_fear_iterator = $fear_iterator + 1;
}
$sQuery = "UPDATE lime_constants SET fear_iterator = $next_fear_iterator";
$oResult = $oDbConnection->query($sQuery);

// Select associated fear images
$aImages = array();
$sQuery = "SELECT filename FROM mango_fear_images WHERE identifier = $fear_iterator";
$oResult = $oDbConnection->query($sQuery);
while($aRow = mysqli_fetch_array($oResult)) {
	$aImages[] = $aRow['filename'];
}

echo json_encode(
	array(
		'user_group'	=> $fear_iterator,
		'images'		=> $aImages
	)
);

?>