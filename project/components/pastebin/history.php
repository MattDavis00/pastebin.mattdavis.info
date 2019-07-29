<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

// Ensure That The User Is Logged In
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/authenticate.php");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Success Flags
$outputData->fetchSuccess = false;

// Output Variables
$outputData->data->history = array();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

try
{

  // SQL Query
  $selectPaste = $conn->prepare("SELECT `Char_ID`, `Creation_Time` FROM `paste` WHERE `User_ID` = :userID");
  $selectPaste->bindParam(':userID', $_SESSION["userID"]);

  // Execute Query
  $selectPasteReturn = $selectPaste->execute();

  $result = $selectPaste->fetchAll(\PDO::FETCH_ASSOC);

  // Close Statement
  $selectUser = null;

  if (count($result) >= 1)
  {

    for ($i = 0; $i < count($result); $i++)
    {
      $paste = new StdClass();
      $paste->charID = $result[$i]["Char_ID"];
      $paste->creationTime = $result[$i]["Creation_Time"];
      array_push($outputData->data->history, $paste);
    }

    $outputData->fetchSuccess = true;

  }
  else {
    $outputData->executionErrorFlag = true;
    $outputData->executionError = "No paste history found. ";
  }

}
catch(PDOException $e)
{
  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Failed to fetch paste history. Please try again. ";
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;
