<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$outputData->logOutSuccess = false;
$outputData->logOutAlertMessage = "";

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

try
{

  $outputData->data->loggedIn = $_SESSION["loggedIn"] = false;
  $outputData->data->userID = $_SESSION["userID"] = null;
  $outputData->data->email = $_SESSION["email"] = null;
  $outputData->data->firstName = $_SESSION["firstName"] = null;
  $outputData->data->lastName = $_SESSION["lastName"] = null;
  $_SESSION["passwordHash"] = null;

  $outputData->logOutSuccess = true;

}
catch(PDOException $e)
{
  $outputData->logOutSuccess = false;

  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Logout failed. Please try again.";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;
