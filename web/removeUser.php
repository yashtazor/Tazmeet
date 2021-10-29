<?php

require '../vendor/autoload.php';

use OpenTok\OpenTok;
use OpenTok\Session;
use OpenTok\Role;

$apiKey = '<Your OpenTok API Key>';
$apiSecret = '<Your OpenTok API Secret>';

$opentok = new OpenTok($apiKey, $apiSecret);

$sessionId=$_POST['sessionId'];
$connectionId=$_POST['connectionId'];

echo($connectionId);
 
$opentok->forceDisconnect($sessionId,$connectionId);

?>