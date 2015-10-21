<?php

/**
 * @author Anne L'Hôte <anne.lhote@gmail.com>
 * 
 * Called by scripts/experiments.js
 **/

$oDBConnection	= json_decode(file_get_contents('../../config.json'));

// DB connection
$mysqli 		= mysqli_connect($oDBConnection->sDbHost, $oDBConnection->sDbUser, $oDBConnection->sDbPassword, $oDBConnection->sDbDatabase) or die("Error " . mysqli_error($link));

// 1. Export final results into CSV file
$sFileContent	= "id,token,action,timestamp,iscorrect" . PHP_EOL;
$sQuery			= "SELECT id,token,action,timestamp,iscorrect FROM mango_subtraction";
$oResult		= $mysqli->query($sQuery);
while($aRow = $oResult->fetch_array()) {
	$sFileContent .= $aRow['id'] . ',' . $aRow['token'] . ',' . $aRow['action'] . ',' . $aRow['timestamp'] . ',' . $aRow['iscorrect'] . PHP_EOL;
}
$sFilePath = '../downloads/export_subtraction.csv';
if(is_writable($sFilePath)) {
	if(!$fFile = fopen($sFilePath, 'wb')) {
		$aReturn['status']	= 'error';
		$aReturn['message']	= "Cannot open file ($sFilePath)";
	} else {
		if(fwrite($fFile, $sFileContent) === FALSE) {
			$aReturn['status']	= 'error';
			$aReturn['message']	= "Cannot write to file ($sFilePath)";
		} else {
			$aReturn['status']	= 'success';
			$aReturn['message']	= 'Please download the file export_subtraction.csv';
		}
		fclose($fFile);
	}
} else {
	$aReturn['status']	= 'error';
	$aReturn['message']	= "File is not writable ($sFilePath)";
}
echo json_encode($aReturn);

exit;

?>
