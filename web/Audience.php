<?php

require '../vendor/autoload.php';

use OpenTok\OpenTok;
use OpenTok\Session;
use OpenTok\Role;
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;
use Google\Cloud\Firestore\FirestoreClient;
use GuzzleHttp\Client;
use Psr\Http\Message\RequestInterface;

$apiKey = '<Your OpenTok API Key>';
$apiSecret = '<Your OpenTok API Secret>';

$audname = $_GET['phpaudname'];
$audmeetid = $_GET['phpaudmeetid'];

$acc = ServiceAccount::fromJsonFile(__DIR__.'/secret/<Name of Firebase secret JSON file inside secret folder>');
$firebase = (new Factory)->withServiceAccount($acc)->create();
$database = $firebase->getDatabase();
$reference = $database->getReference('/Rooms/'.$audmeetid.'/Moderator/SessionID');
$sessionId = $reference->getSnapshot()->getValue();

$opentok = new OpenTok($apiKey, $apiSecret);

$token = $opentok->generateToken($sessionId, array('role' => Role::PUBLISHER));

$loc = $database->getReference('/Rooms/'.$audmeetid.'/Audience/')->push();
$loc->set(array('APIKey' => $apiKey, 'SessionID' => $sessionId, 'Token' => $token,'Name'=>$audname, 'id'=>$loc->getKey()));
$audid = $loc->getKey();

//echo($audid);

$auddetails = json_encode(array('Name' => $audname, 'ID' => $audid, 'MeetingID' => $audmeetid,'UserRole'=>'Audience'));

?>

<!--<html> // Original Code. Do not touch.
    <head>
        <title> OpenTok Getting Started </title>

        <link href="css/ClientCSS.css" rel="stylesheet" type="text/css">

        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-database.js"></script>
        <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
        <script type="text/javascript" src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
        <script src="js/opentok-layout.min.js"></script>

        <style type="text/css" media="screen">
            #layoutContainer 
            {
                width: 1000px;
                height: 600px;
                background-color: #DDD;
                position:relative;
            }
        </style>

    </head>

    <body>

        <div id="panelists">
            <h2>Panelists</h2>
            <ul id="panelist-list"></ul>
        </div>

        <div id="audience">
            <h2>Audience</h2>
            <ul id="audience-list"></ul>
        </div>

        <div id="layoutContainer">
            <div id="publisherContainer"></div>
        </div>

        <script type="text/javascript"> 
            var auddata = <?php echo json_encode($auddetails); ?>; 
        </script>
        <script type="text/javascript" src="js/AudienceJS.js"></script>

    </body>

</html>-->

<!DOCTYPE html>
<html lang="en">

    <head>

        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="Webinar | India FinTech Forum">
        <meta name="author" content="Ashwin">


        <title>BizTiz Meets.</title>


        <link rel="shortcut icon" href="#" />
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/magnific-popup.min.css">
        <link rel="stylesheet" href="css/bootstrap.min.css" >
        <link rel="stylesheet" href="css/NewStyles.css?version=51">
        <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css" rel="Stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Work+Sans:400,500,600" rel="stylesheet">        
        <!--<link href="css/ClientCSS.css" rel="stylesheet" type="text/css">-->


        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>    
        <script src="https://cdnjs.cloudflare.com/ajax/libs/magnific-popup.js/1.1.0/jquery.magnific-popup.min.js"></script>    
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.6.3/lottie.min.js"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
        <script type="text/javascript" src="https://code.jquery.com/jquery-1.7.1.min.js"></script>
        <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-database.js"></script>
        <script src="js/opentok-layout.min.js"></script>


        <style>

          
        </style>

    </head>

    <body>
        <div class="container-fluid full-height">
            <div class="row row-height">
            
                <div class="col-lg-12 rounded" id="screen-preview"></div>

                <div class="x col-lg-12 content-left rounded border border-danger">
                    <div class="content-left-wrapper">
                
                        <div class="row" style="justify-content: center;align-items: center;text-align: left;">
                            <div id="layoutContainer" class="videoWrapper">
                                <div id="publisherContainer"></div>                   
                            </div>                    
                        </div>

                        <script type="text/javascript"> 
                            var subdata = <?php echo json_encode($auddetails); ?>; 
                        </script>
                        <script type="text/javascript" src="js/ClientJS.js"></script>

                    </div>

                </div>

                <div id="footer">
                    <div id="ed">                
                        <button class="btn btn-danger btn-circle" style="background-image:url(media/RaiseHand.png); background-repeat: no-repeat; height:50px; width:50px;" onClick="javascript:raiseHand();"> <!--<img src="media/RaiseHand.png" height="40px" width="40px">--> </button>
                        <button class="btn btn-danger btn-circle" style="background-image:url(media/EndCall.png); background-repeat: no-repeat; height:50px; width:50px;" onClick="javascript:endCall();"> <!--<img src="media/EndCall.png" height="40px" width="40px">--> </button>
                        <button class="btn btn-danger btn-circle" id="showbox" style="background-image:url(media/ShowOptions.png); background-repeat: no-repeat; height:50px; width:50px;" onClick="javascript:ShowBox();"> </button>
                    </div>
                </div>

            <div class="col-lg-12" id="ChatOverlay">

                <div class="boxcontainer col-lg-3 rounded border border-danger float-right" id="BoxCont" style="background:#fff; padding:20px;">
                <span style="float:right;font-size:12px;margin-top:5px;"><i class="fa fa-circle" aria-hidden="true" style="color:#ff0000"></i> <b> LIVE </b> <span id="onlineCount"></span></span>
                <div id="exTab2">
                    <ul class="nav nav-tabs">
                    <li class="active">
                        <a style="color:blueviolet" href="#1" data-toggle="tab">Ask Questions</a>
                    </li>
                    <li><a style="color:blueviolet" href="#2" data-toggle="tab">Panelists</a>
                    </li>
                    <!-- <li><a href="#3" data-toggle="tab">Solution</a>
                    </li> -->
                </ul>

                <div class="tab-content ">
                    <div class="tab-pane active" id="1">
                    <div class="">
                        <ul class="msgList nav nav-tabs" id="msgList">
                        </ul>
                    </div>
                    <div class="">
                        <!-- <div id="nameSection" class="">
                        <input type="text" id="name" class="form-control" placeholder="Enter your name" /><br>
                        <span class="btn btn-primary" id="postBtn" onclick="addName();">Next</span>
                        </div> -->
                        <div id="msgSection" class="">
                        <textarea id="msg" class="form-control" placeholder="Type your question here..."  minlength="2" maxlength="200" rows="4"></textarea>
                        <span >Press 'Enter' to submit</span><span id="count" style="float:right;font-size:12px;"></span><br><br>
                        <span class="btn btn-danger" id="postBtn" onclick="postQuestion();">Post Question</span><br>
                        </div>
                    </div>
                    <!-- <h3>Standard tab panel created on bootstrap using nav-tabs</h3> -->
                    </div>
                    <div class="tab-pane" id="2">
                    Moderator
              <ul class="nav nav-tabs" id="moderator-list"></ul>
              Panelist
              <ul class="nav nav-tabs" id="panelist-list"></ul>
              Attendee
              <ul class="nav nav-tabs" id="audience-list"></ul>
                    </div>
                    <!-- <h3>Notice the gap between the content and tab after applying a background color</h3> -->
                    <div class="tab-pane" id="3">
                    <!-- <h3>add clearfix to tab-content (see the css)</h3> -->
                    </div>
                </div>
                </div>
            </div>

            <div class="d-md-none d-lg-none" style="background:#fff; padding:10px; margin-top:20px;">
                <p style="text-align:center;">
                <p>This webinar is supported by<br><br>
                    <a href="https://onfido.com/in/" target="_blank"><img src="Onfido_Logo.png" width="30%" /></a><br><br>
                    Identity verification at the speed of life <i class="fa fa-info-circle" style="color:#006db7" aria-hidden="true" data-toggle="collapse" data-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2"></i><br>

                    <div class="collapse multi-collapse" id="multiCollapseExample2">
                    <div class="card card-body">
                        Reach out to 'india@onfido.com' to experience seamless digital onboarding first hand.
                    </div>
                    </div>

                </p>
            </div>
            </div>
        </div>

        </div>
        <!-- /content-right-->
        </div>
        <!-- /row-->
        </div>
        <!-- /container-fluid -->

        <div class="cd-overlay-nav">
        <span></span>
        </div>
        <!-- /cd-overlay-nav -->

        <div class="cd-overlay-content">
        <span></span>
        </div>        

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
        <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>

    </body>

</html>