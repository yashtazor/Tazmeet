jQuery.noConflict();

const options = {
  maxRatio: 3/2,             // The narrowest ratio that will be used (default 2x3)
  minRatio: 9/16,            // The widest ratio that will be used (default 16x9)
  fixedRatio: false,         // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
  alignItems: 'center',      // Can be 'start', 'center' or 'end'. Determines where to place items when on a row or column that is not full
  bigClass: "OT_big",        // The class to add to elements that should be sized bigger
  bigPercentage: 0.8,         // The maximum percentage of space the big ones should take up
  bigFixedRatio: false,      // fixedRatio for the big ones
  bigAlignItems: 'center',   // How to align the big items
  smallAlignItems: 'center', // How to align the small row or column of items if there is a big one
  smallMaxWidth: Infinity,   // The maximum width of the small elements 
  smallMaxHeight: Infinity,  // The maximum height of the small elements
  bigMaxWidth: Infinity,     // The maximum width of the big elements
  bigMaxHeight: Infinity,    // The maximum height of the big elements
  bigMaxRatio: 3/2,          // The narrowest ratio to use for the big elements (default 2x3)
  bigMinRatio: 9/16,         // The widest ratio to use for the big elements (default 16x9)
  bigFirst: true,            // Whether to place the big one in the top left (true) or bottom right
  animate: true,              // Whether you want to animate the transitions
  window: window,            // Lets you pass in your own window object which should be the same window that the element is in
  ignoreClass: 'OT_ignore',  // Elements with this class will be ignored and not positioned. This lets you do things like picture-in-picture
};

var layoutContainer = document.getElementById("layoutContainer");
var publisherContainer = document.getElementById("publisherContainer");
var layout = initLayoutContainer(layoutContainer, options).layout;

var session;
var publisher;
var subscriber;
var enableVideo=true;
var enablevideoicon=true;
var subVideo=false;
var subAudio=true;
var boxvisible="none";

var apians = JSON.parse(condata);
var pubans = JSON.parse(pubdata);

var meetingId = String(apians.MeetingID);
var apiKey = String(apians.APIKey);
var sessionId = String(apians.SessionID);
var token = String(apians.Token);

var pubname = String(pubans.Name);
//var pubid = String(pubans.ID);

const PROMOTE=1;
const DEMOTE=2;

console.log(meetingId);
console.log(apiKey);
console.log(sessionId);
console.log(token);

var firebaseConfig = {
  // Your firebase configuration information.
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

function getData()
{
  firebase.database().ref("Rooms/"+meetingId+"/Moderator").set({
    "APIKey": apiKey,
    "SessionID": sessionId,
    "Token": token,
  });
}


  var ref = firebase.database().ref('Rooms/'+meetingId+'/Panelists');
  ref.on("value", function(snapshot) {

    var msgdetails = snapshot.val();
    console.log("Printing msgdetails");
    console.log(msgdetails);

    var termList = "" ;
    $.each( msgdetails, function( key, value ) {
      if(value.isConnected){
      var visiblilty;
      if(value.handRaised){
        visiblilty="visible";
    
      }
      else{
        visiblilty="hidden"; 
      }
      termList += '<li id="'+value.id+
      '" style="padding: 10px 10px;background: #f6f6f6;margin: 15px;border-radius: 5px;"><b>'+value.Name+
      '<br></b><button class="btn btn-danger" onclick="removePanelists(\''+value.id+'\')">Kick</button> <button class="btn btn-danger" onclick="muteVideo(\''+value.id+'\','+value.muteVideo+')"> <i class="fa fa-video-camera" aria-hidden="true"></i> </button> <button class="btn btn-danger" onclick="muteAudio(\''+value.id+'\','+value.muteAudio+')"> <i class="fa fa-volume-off" aria-hidden="true"></i> </button>'+
      ' <button class="btn btn-danger" onclick="demoteUser(\''+value.id+'\',\''+value.Name+'\')"> Demote </button>'
      +' <img src="media/RaiseHand.png" alt="hand image" style="width:20px;height:20px;visibility:'+visiblilty+';"> </li>';
    }});
    // console.log(count);
    $('#panelist-list').html(termList);
  }, function (error) {
    console.log("Error: " + error.code);
  });

  var audienceRef = firebase.database().ref("Rooms/"+meetingId+"/Audience"); 
  audienceRef.on("value", function(snapshot) {
    var msgdetails = snapshot.val();
    var termList = "" ;
    $.each( msgdetails, function( key, value ) {
      if(value.isConnected){
      var visiblilty;
      if(value.handRaised){  // id check to be done.
        visiblilty="visible";
      }
      else{
        visiblilty="hidden";
      }
      termList += '<li id="'+value.id+

      '" style="padding: 10px 10px;background: #f6f6f6;margin: 15px;border-radius: 5px;"><b>'+value.Name+'<br> </b> <button class="btn btn-danger" onclick="removeAudience(\''+value.id+'\')">Kick</button>'+

      ' <button class="btn btn-danger" onclick="promoteUser(\''+value.id+'\',\''+value.Name+'\')">Promote</button><img src="media/RaiseHand.png" alt="hand image" style="width:20px;height:20px;visibility:'+visiblilty+';"> </li>';
    }});
    // console.log(count);
    $('#audience-list').html(termList);
  }, function (error) {
    console.log("Error: " + error.code);
  });


function removePanelists(id){
  console.log(id);
  firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+id).once('value', function(snapshot){

    console.log("Reached in remove panelist.");
    var conId=snapshot.val().connectionId;
    console.log(conId);
    firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+id+"/isConnected").set(false);

      if (sessionId && conId) {
         $.ajax({
             url: '../web/removeUser.php',
             type: 'POST',
             data: 'sessionId=' + sessionId + '&connectionId=' + conId,
         });
        }
     

  });
}

function removeAudience(id){ 
  firebase.database().ref("Rooms/"+meetingId+"/Audience/"+id).once('value').then(function(snapshot){
    var conId=snapshot.val().connectionId;
    firebase.database().ref("Rooms/"+meetingId+"/Audience/"+id+"/isConnected").set(false);
   // eslint-disable-line no-unused-vars
      if (sessionId && conId) {
         $.ajax({
             url: 'removeUser.php',
             type: 'POST',
             data: 'sessionId=' + sessionId + '&connectionId=' + conId,
         });
        }
     

  });
}

function muteVideo(id, isVideoMuted)
{  
    console.log("Reached inside muteVideo!");
    firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+id+"/muteVideo").set(!isVideoMuted);  
}

function promoteUser(userId, name){ 
  session.signal(
    {
      data:{id:userId,
      operation:PROMOTE
      } ,
          
    },
    function(error) {
      if (error) {
        console.log("signal error ("
                     + error.name
                     + "): " + error.message);
      } else {
        console.log("signal sent.");
        firebase.database().ref("Rooms/"+meetingId+"/Audience/"+userId+'/isConnected').set(false);
        firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+userId).set({
          "APIKey": apiKey,
          "SessionID": sessionId,
          "Token": token,
          "Name":name,
          'id':userId,
          'connectionID':session.connection.connectionId,
          'isConnected':true,
          'handRaised':false,
          'muteVideo':true
        });
        
      }
    }
  );
}

function demoteUser(userId, name){ 
  session.signal(
    {
      data:{id:userId,
      operation:DEMOTE
      } ,
          
    },
    function(error) {
      if (error) {
        console.log("signal error ("
                     + error.name
                     + "): " + error.message);
      } else {
        console.log("signal sent.");
        firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+userId+'/isConnected').set(false);
  
        layout();
      }
    }
  );
}

function muteAudio(id, isAudioMuted)
{
  console.log("Reached inside mueAudio!");
  firebase.database().ref("Rooms/"+meetingId+"/Panelists/"+id+"/muteAudio").set(!isAudioMuted);     
}

function postQuestion(){
  
  var name = pubname;
  var msg = $("#msg").val();
  $("#msg").val("");
  if(msg == "" || msg == " " || msg == null){
    $("#msg").css({"border": "solid 1px red"});
  }else{
    $("#msg").css({"border": "solid 1px #ced4da"});
    jQuery.ajax({
      url :'question.php',
      method :'POST',
      data: {name: name,msg:msg},
      datatype:'json',
      success : function(data){
        // console.log(data);
        $("#msg").val(" ");

        $("#postBtn").hide();
        setTimeout(function(){
          $("#postBtn").show();
        }, 8000);
      }
    });
  }

}
$( document ).ready(function() {  $('#msg').keypress(function (e) {
  if (e.which == 13) {
    console.log('enter pressed');
    postQuestion();
    return false;    //<---- Add this line
  }
}); });
$( document ).ready(function() {
 // firebase.initializeApp(config);
  var ref = firebase.database().ref('questions');
  var lifeList = "";
  var schemeName = "";

  ref.on("value", function(snapshot) {
    var msgdetails = snapshot.val();
    var termList = "" ;
    $.each( msgdetails, function( key, value ) {
      termList += '<li style="padding: 10px 10px;background: #f6f6f6;margin: 15px;border-radius: 5px;"><b>'+value.name+'</b> says: '+value.message+'</li>';
    });
    // console.log(count);
    $('#msgList').html(termList);
    $('#msgList').animate({scrollTop: $('#msgList').prop("scrollHeight")}, 500);
  }, function (error) {
    console.log("Error: " + error.code);
  });
});

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  session.on('streamCreated', function streamCreated(event) {

    var suboptions = {
      //testNetwork: true,
      insertMode: 'append',
      width: '100%',
      height: '100%',
    }
    
    var parentElementId;
      
    if(event.stream.videoType === 'screen')
    {
      parentElementId = 'screen-preview';
      document.getElementById("screen-preview").style.display = "block";
      document.getElementById("screen-preview").style.zIndex = 11000;
    }
    else
    {
      parentElementId = 'layoutContainer';
    }

    subscriber = session.subscribe(event.stream, parentElementId, suboptions, handleError);
    subscriber.subscribeToAudio(true);
    //pushToFireBase(session.connection.connectionId);

    /*var subscriberOptions = {
      testNetwork: true,
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    subscriber = session.subscribe(event.stream, 'layoutContainer', subscriberOptions, handleError);*/
    
    /*layoutContainer.addEventListener('click', function () {
      if (layoutContainer.classList.contains('OT_big')) {
        layoutContainer.classList.remove('OT_big');
      } else {
        layoutContainer.classList.add('OT_big');
      }
      layout();
    });
    layoutEl.appendChild(layoutContainer);

    layout();*/    

    publisherContainer.addEventListener('click', function () {
       if (publisherContainer.classList.contains('OT_big')) {
         publisherContainer.classList.remove('OT_big');
       } else {
         publisherContainer.classList.add('OT_big');
       }
       layout();
     });

    layout();
  });

  session.on('connectionDestroyed', function sessionDisconnected(event) {
    console.log('DCed', event.reason);
    layout();
  });
  session.on('streamDestroyed', function sessionDisconnected(event) {
    //document.getElementById("screen-preview").style.display = "none";
    document.getElementById("screen-preview").style.zIndex = -1;
    layout();
    console.log('DCed', event.reason);

  
  });

  var publisherOptions = {
    //testNetwork: true,
    insertMode: 'append',
    width: '100%',
    height: '100%',
    name: pubname,
   // style: { nameDisplayMode: "auto"}
  };
  publisher = OT.initPublisher('publisherContainer', publisherOptions, handleError);

  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
      layout();
    }
  });
}

getData();
initializeSession();
function toggle()
{
  if(enablevideoicon)
  {
    $(document).ready(function()
    {
      $("#videobtn").on('click',function()
      {
        $(this).css('background-image', 'url(media/Video.png)');
      });
    });
    enablevideoicon = false;
  }
  else
  {
    $(document).ready(function()
    {
      $("#videobtn").on('click',function()
      {
        $(this).css('background-image', 'url(media/NoVideo.png)');
      });
    });
    enablevideoicon = true;
  }

}


var getQuoteButton = document.getElementById('videobtn');
getQuoteButton.addEventListener('click', buttoncall);

function buttoncall(){


  if(enableVideo)
  {
    publisher.publishVideo(false); 
    enableVideo=false;
  } 
  else
  {
    publisher.publishVideo(true);
    enableVideo=true;
  }
}

function ScreenShare()
{
  OT.checkScreenSharingCapability(function(response) {
    if(!response.supported || response.extensionRegistered === false) {
      alert("This browser does not support screensharing!");
    } else if (response.extensionInstalled === false) {
      alert("You will need to install extension for screensharing!");
    } else {

      var scoptions = {
        videoSource: 'screen',
        maxResolution: { width: 1920, height: 1920 },
      }

      var screenPublisherElement = document.createElement('div');

      var publisher = OT.initPublisher(screenPublisherElement, scoptions,
        function(error) {
          if (error) {
            alert("Screen sharing cancelled!");
          } else {
            session.publish(publisher, function(error) {
              if (error) {
                alert("Publishing error!");
              }
            });
          }
        }
      );

      publisher.on('mediaStopped', function(event) {
        alert("Stopped screen sharing!");
        preventDefault();
      });
    }
  });
}

function ShowBox()
{
  if(boxvisible == "none")
  {
    document.getElementById("ChatOverlay").style.display = "block";
    document.getElementById("BoxCont").style.display = "block";
    boxvisible = "block";
  }
  else
  {
    document.getElementById("ChatOverlay").style.display = "none";
    document.getElementById("BoxCont").style.display = "none";
    boxvisible = "none";
  }
}

function terminate()
{
  session.disconnect();
  window.location.href = "../web/End.php";
}
