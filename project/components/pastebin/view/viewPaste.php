<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Input Variables
$clientCharID = $request->charID;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Success Flags
$outputData->fetchSuccess = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

try
{

  // SQL Query
  $selectPaste = $conn->prepare("SELECT `Code` FROM `paste` WHERE `Char_ID` = :charID");
  $selectPaste->bindParam(':charID', $clientCharID);

  // Execute Query
  $selectPasteReturn = $selectPaste->execute();

  $result = $selectPaste->fetchAll(\PDO::FETCH_ASSOC);

  // Close Statement
  $selectUser = null;

  if (count($result) === 1)
  {
    $outputData->data->code = $result[0]["Code"];
    $outputData->fetchSuccess = true;
  }
  else {
    $outputData->executionErrorFlag = true;
    $outputData->executionError = "Sharing link is invalid. ";
  }

}
catch(PDOException $e)
{
  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Failed to fetch code. Please try again. ";
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;
