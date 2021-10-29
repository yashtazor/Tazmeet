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

var publisher;
var subscriber;
var enablevideoicon = true;
var enableVideo=true;
var isHandRaised;
var boxvisible="none";

var subans = JSON.parse(subdata);
console.log(subans);
var session;

var subid = String(subans.ID);
var subname = String(subans.Name);
var meetid = String(subans.MeetingID);
var userRole=String(subans.UserRole);
var Key;
var sessionId;
var token;

const PROMOTE=1;
const DEMOTE=2;

$("#nameSection").hide()
$("#msgSection").show();

var config = {
  // Your firebase configuration information.
};
firebase.initializeApp(config);


var database = firebase.database();

var ref = database.ref('Rooms/'+meetid+'/'+userRole+'/'+subid);

ref.once('value').then(getdata,handleError);


function getdata(data)
{

  Key = data.val().APIKey; 
   sessionId = data.val().SessionID;
   token = data.val().Token;
  
  initializeSession(Key,sessionId,token);

  if(userRole=='Audience'){
    hidePublisherContainer();
  }

}
function handleError(error) {
  if (error) {
    alert(error.message);
  }
 
}
var ref = firebase.database().ref('Rooms/'+meetid+'/Panelists');
  ref.on("value", function(snapshot) {
    var msgdetails = snapshot.val();
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
      '</b><img src="media/RaiseHand.png" alt="hand image" style="width:20px;height:20px;visibility:'+visiblilty+';"> </li>';
    }});
    // console.log(count);
    $('#panelist-list').html(termList);
  }, function (error) {
    console.log("Error: " + error.code);
  });

  var audienceRef = firebase.database().ref('Rooms/'+meetid+'/Audience');
  audienceRef.on("value", function(snapshot) {
    var msgdetails = snapshot.val();
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
      '</b><img src="media/RaiseHand.png" alt="hand image" style="width:20px;height:20px;visibility:'+visiblilty+';"> </li>';
    }});
    // console.log(count);
    $('#audience-list').html(termList);
  }, function (error) {
    console.log("Error: " + error.code);
  });

 


  function initializeSession(Key,sessionId,token) {
    session = OT.initSession(Key, sessionId);
  
    session.on('streamCreated', function(event) {

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
      pushToFireBase(session.connection.connectionId);

      publisherContainer.addEventListener('click', function () {
        if (publisherContainer.classList.contains('OT_big')) {
          publisherContainer.classList.remove('OT_big');
        } else {
          publisherContainer.classList.add('OT_big');
        }
        layout();
      });

      layout();
      toggleUserStreams();
      
    });

   
  
    

    //console.log(publisher);

    session.connect(token, function(error) {
      if (error) {
        handleError(error);
      } else {
        if(userRole==='Panelists'){
          console.log('userrole'+userRole);
          createPublisher();
        session.publish(publisher, handleError);
        layout();
        }
        
        
      }
    });

    session.on('connectionDestroyed', function sessionDisconnected(event) {
      alert("Moderator ended the session!");
      console.log('DCed', event.reason);
      layout();
      session.disconnect();
      window.location.href = "../web/End.php";
    });
    session.on('streamDestroyed', function sessionDisconnected(event) {
      //document.getElementById("screen-preview").style.display = "none";
      document.getElementById("screen-preview").style.zIndex = -1;
      console.log('DCed', event.reason);
      layout();
    });

    session.on("signal", function(event) {
      console.log("Signal sent from connection " + event.data.operation);
      if(event.data.id==subid){
        console.log('user match');
        if(event.data.operation==PROMOTE){
          if(publisher){
          publisher.destroy();
          }
          createPublisher();
         session.publish(publisher, handleError);
         showPublisherContainer();
         layout();
         userRole='Panelists';
         toggleUserStreams();
        }
        else if (event.data.operation==DEMOTE){
          
               session.disconnect();
              subscriber.destroy();
                hidePublisherContainer();
                //layout();
                userRole='Audience';
          
                 session.connect(token, function(error) {
                  if (error) {
                    handleError(error);
                    layout();
                  } else {
                    if(userRole==='Panelists'){
                      console.log('userrole'+userRole);
                      createPublisher();
                    session.publish(publisher, handleError);
                    layout();
                    }
                    
                    
                  }
                });            
            
        }
         
      }else if(event.data.operation==0||event.data.operation==1){
        layout();
      }
      console.log('user does not match');
    });

   // toggleUserCamera();

  }

function createPublisher() {
  publisher = OT.initPublisher('publisherContainer', {
    //testNetwork:true,
    name: subname,
    style: { nameDisplayMode: "auto" },
    insertMode: 'append',
    width: '100%',
    height: '100%',
    accessAllowed:true
  }, handleError);
}

function pushToFireBase(id)
{
  firebase.database().ref("Rooms/"+meetid+"/"+userRole+"/"+subid).set({
    "APIKey": Key,
    "SessionID": sessionId,
    "Token": token,
    "Name":subname,
    'id':subid,
    'connectionId':id,
    'isConnected':true,
    'handRaised':false,
    'muteVideo':false
  })
  
}



function errorpop()
{
  alert("Error!");
}

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

function raiseHand(){
  if(isHandRaised){
    isHandRaised=false;   
  }
  else{   
     isHandRaised=true;
  }

  database.ref("Rooms/"+meetid+"/"+userRole+"/"+subid+"/handRaised").set(isHandRaised);  
}

function postQuestion(){
  
  var name = subname;
  var msg = $("#msg").val();
  
  $("#msg").val("");
  if(msg == "" || msg == " " || msg == null){
    $("#msg").css({"border": "solid 1px red"});
  }else{
    msg.replace('\\n','\n');
    $("#msg").css({"border": "solid 1px #ced4da"});
    jQuery.ajax({
      url :'question.php',
      method :'POST',
      data: {name: name,msg:msg},
      datatype:'json',
      success : function(data){
        // console.log(data);
        $("#msg").val(" ");

        // $("#postBtn").hide();
        // setTimeout(function(){
        //   $("#postBtn").show();
        // }, 8000);
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

function endCall(){
  database.ref("Rooms/"+meetid+"/"+userRole+"/"+subid+"/isConnected").set(false);
  session.disconnect();
  window.location.href = "../web/End.php";
}


function toggleUserStreams(){
  doToggle=false;

// Second try to enable/disable the panelist's video.
  firebase.database().ref().child('Rooms').child(meetid).child(userRole).child(subid).on('value', function(snapshot) { 
    var childData = snapshot.val(); 
    //console.log(childData);
    console.log("Reached here!");

    if(doToggle){

      publisher.publishVideo(childData.muteVideo);
      publisher.publishAudio(childData.muteAudio);
    }
  
    }), function (error) {
    console.log("Error: " + error.code);
  };
  doToggle=true;

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
        mirror: false,
        fitMode: "contain",
        maxResolution: { width: 1920, height: 750 },
      }

      var screenPublisherElement = document.createElement('div');

      publisher = OT.initPublisher(screenPublisherElement, scoptions,
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
function hidePublisherContainer() {
  $('#publisherContainer').hide();
}
function showPublisherContainer() {
  $('#publisherContainer').show();
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