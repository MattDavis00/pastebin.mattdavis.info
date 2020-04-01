<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

$token = $_GET["token"];

$json = file_get_contents("https://auth.mattdavis.info/api/check-token?token=" . $token);

$data = json_decode($json);

if ($data->loggedIn) {
  $outputData->loginSuccess = true;

  $outputData->data->loggedIn = $_SESSION["loggedIn"] = true;
  $outputData->data->userID = $_SESSION["userID"] = $data->userID;

  echo ("<script> window.location.href='" . $data->redirectURL ."'; </script>");
  die();

} else {
  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Login failed. Please try again.";
}

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;