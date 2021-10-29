<!DOCTYPE html>
<html>

    <head>

        <title>
            Video Chat Integration
        </title>

        <script>

            function DisplaySub()
            {
                document.getElementById("subdetails").style.display = "block";                
            }

            function DisplayAud()
            {
                document.getElementById("auddetails").style.display = "block";
            }

        </script>

    </head>

    <h1>
        CashRich Video Chat Integration
    </h1>

    <body>

        <table>

            <tr>
                <td> <button onclick="DisplaySub();"> Join As Panelist! </button> </td>
                <td> <button onclick="DisplayAud();"> Join As Audience! </button> </td>
            </tr>

            <tr>

                <td id="subdetails" style="display: none;"> 
                    <br/>
                    <form method="GET" action="web/Client.php">
                        Panelist Name 
                        <br/>
                        <input id="subname" name="phpsubname" type="text"/>
                        <br/> <br/>
                        Meeting ID
                        <br/>
                        <input id="submeetid" name="phpsubmeetid" type="text"/>
                        <br/> <br/>
                        <input type="submit" value="Submit">
                    </form>
                </td>

                <td id="auddetails" style="display: none;"> 
                    <br/>
                    <form method="GET" action="web/Audience.php">
                        Audience Name 
                        <br/>
                        <input id="audname" name="phpaudname" type="text"/>
                        <br/> <br/>
                        Meeting ID
                        <br/>
                        <input id="audmeetid" name="phpaudmeetid" type="text"/>
                        <br/> <br/>
                        <input type="submit" value="Submit">
                    </form>
                </td>
                
            </tr>

        </table>

    </body>

</html>