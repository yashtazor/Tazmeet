var layoutContainer = document.getElementById("layoutContainer");
var layout = initLayoutContainer(layoutContainer).layout;

var publisher;
var boxvisible="none";

var audans = JSON.parse(auddata);
var audid = String(audans.ID);
var audname = String(audans.Name);
var meetid = String(audans.MeetingID);

var isHandRaised;

const AUDIENCE = "Audience";
const CLIENTS="Clients";
var userLevel=AUDIENCE;

var config = {
  // Your firebase configuration information.
};


firebase.initializeApp(config);
var database = firebase.database();
var ref = database.ref('Rooms/'+meetid+'/Audience/'+audid);
ref.once('value').then( getdata,handleError);

function getdata(data)
{

  var Key = data.val().APIKey; 
  var sessionId = data.val().SessionID;
  var token = data.val().Token;

  initializeSession(Key,sessionId,token);
  hidePublisherContainer();
}


var ref = firebase.database().ref("Rooms/"+meetid+"/Panelists");
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

var audienceRef = firebase.database().ref("Rooms/"+meetid+"/Audience");
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

  
function hidePublisherContainer() {
  $('#publisherContainer').hide();
}
function showPublisherContainer() {
  $('#publisherContainer').show();
}


  function initializeSession(Key,sessionId,token) {
    var session = OT.initSession(Key, sessionId);

    session.on('streamCreated', function(event) {
      pushToFireBase(session.connection.connectionId);

      var suboptions = {
        testNetwork: true,
        insertMode: 'append',
        width: '100%',
        height: '100%',
      }

      var parentElementId;
      
      if(event.stream.videoType === 'screen')
      {
        parentElementId = 'screen-preview';
        document.getElementById("screen-preview").style.zIndex = 11000;
      }
      else
      {
        parentElementId = 'layoutContainer';
      }

      //subscriber = session.subscribe(event.stream, parentElementId, suboptions, handleError);

      session.subscribe(event.stream, parentElementId, suboptions, handleError);
      layout();
    });


    publisher = OT.initPublisher('publisherContainer', {

      name: audname,
      style: { nameDisplayMode: "auto" },
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  
    session.connect(token, function(error) {
      if (error) {
        handleError(error);
      } else {

      }
    });
    session.on('connectionDestroyed', function sessionDisconnected(event) {
      console.log('DCEd', event.reason);
      layout();
    });
  
    session.on("signal", function(event) {
      console.log("Signal sent from connection " + event.data);
      if(event.data==audid){
        console.log('user match');
         session.publish(publisher, handleError);
         showPublisherContainer();
         layout();
         userLevel=CLIENTS;
         
      }else
      console.log('user does not match');
    });
  
  }

 

    // Process the event.data property, if there is any data.




function pushToFireBase(id){

  database.ref("Rooms/"+meetid+"/Audience/"+audid+"/connectionId").set(id);
  database.ref("Rooms/"+meetid+"/Audience/"+audid+"/handRaised").set(false);
  database.ref("Rooms/"+meetid+"/Audience/"+audid+"/isConnected").set(true);

}

function errorpop()
{
  alert("Error!");
}

 function handleError(error) {
  if (error) {
    alert(error.message);
  }
}
function postQuestion(){
  
  var name = audname;
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

  database.ref("Rooms/"+meetid+"/Audience/"+audid+"/handRaised").set(isHandRaised);
  
}

function endCall(){
  database.ref("Rooms/"+meetid+"/Audience/"+audid+"/isConnected").set(false);
  session.disconnect();
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