<?php

if ($_SESSION["loggedIn"] !== true) {

  $outputData->executionErrorFlag = true;
  $outputData->executionError = "You are not logged in. ";

  // Output
  echo json_encode($outputData);

  die(); // The user is not logged in, kill the script.
  
}
