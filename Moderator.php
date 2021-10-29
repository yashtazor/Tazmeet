<!DOCTYPE html>
<html>
    <head>
        <title>
            Video Chat Integration
        </title>

        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-app.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-analytics.js"></script>
        <script src="https://www.gstatic.com/firebasejs/7.8.1/firebase-database.js"></script>

        <script>

            function DisplayPub()
            {
                document.getElementById("pubdetails").style.display = "block";                
            }

            function redtoPub()
            {
                var meetingid = Math.floor((Math.random() * 100000) + 1);

                var firebaseConfig = 
                {
                    // Your firebase configuration information.
                };

                firebase.initializeApp(firebaseConfig);
                firebase.analytics();

                firebase.database().ref("Rooms").set(
                    {
                        "MeetingID" : meetingid,
                    }
                );
                
                alert("The Meeting ID is "+meetingid);
                var pubname = document.getElementById("pubname").value;
            }

        </script>
    </head>

    <h1>
        CashRich Video Chat Integration
    </h1>

    <body>
        <table>
            <tr>
                <td> <button onclick="DisplayPub();"> Create Session! </button> </td>
            </tr>

            <tr>
                <td id="pubdetails" style="display: none;"> 
                    <br/>
                    <form method="GET" action="web/Server.php">
                        Meeting Name
                        <br/>
                        <input id="meetname" name="phpmeetname" type="text"/>
                        <br/> <br/>
                        Moderator Name
                        <br/>
                        <input id="pubname" name="phppubname" type="text"/>
                        <br/> <br/>
                        <button onclick="redtoPub();"> Generate Meeting ID </button>
                    </form>                    
                </td>

            </tr>
        </table>
    </body>
</html>