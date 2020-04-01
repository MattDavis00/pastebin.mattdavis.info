<?php

// Create session
session_save_path($_SERVER["DOCUMENT_ROOT"]."/../sessions");
session_start();

// Database Credentials
// In the form of:
// $servername = database address
// $username = database username
// $password = user password
// $dbname = database name
include($_SERVER["DOCUMENT_ROOT"]."/../credentials/databaseCredentials.php");

// Database Connection
try
{
  $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
  // set the PDO error mode to exception
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch(PDOException $e)
{
  echo "Connection failed: " . $e->getMessage();
  die();
}

// Post data
$postData = file_get_contents("php://input");
$request = json_decode($postData);

// Output Array
$outputData = new StdClass();
$outputData->data = new StdClass();
$outputData->errorFlag = false;
$outputData->errorReport = array();
$outputData->executionErrorFlag = false;
$outputData->executionError = "";


// Datetime
date_default_timezone_set('Europe/London');
$serverDateTime = date("Y-m-d H:i:s");
