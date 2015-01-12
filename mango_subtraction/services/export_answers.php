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
	$sFileContent .= $aRow['id'] . ',' . $aRow['earning'] . ',' . $aRow['action'] . ',' . $aRow['timestamp'] . ',' . $aRow['isCorrect'] . PHP_EOL;
}
$fFile = fopen('../downloads/export_subtraction.csv', 'w');
fwrite($fFile, $sFileContent);
fclose($fFile);
$aReturn['status']	= 'success';
$aReturn['message']	= 'Please download the file export_subtraction.csv';
echo json_encode($aReturn);

exit;

?>