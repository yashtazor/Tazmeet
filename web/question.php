<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
  if (empty($_POST["name"])&&empty($_POST["msg"])) {
    echo "empty";
  }
  else {
    $name = $_POST["name"];
    $msg = $_POST["msg"];
    $data = askQuestion($name,$msg);
  }
}

function askQuestion($name,$msg){
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_URL => "<Your Firebase URL>/questions.json",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS =>"{\r\n\t\"name\":\"$name\",\r\n\t\"message\":\"$msg\"\r\n}",
    CURLOPT_HTTPHEADER => array(
      "Content-Type: text/plain"
    ),
  ));

  $response = curl_exec($curl);

  curl_close($curl);
  echo $response;
}

?>
