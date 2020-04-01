<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

// Ensure That The User Is Logged In
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/authenticate.php");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Input Variables
$clientCode = $request->code;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Success Flags
$outputData->loginSuccess = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// Validations /////

// Code
$codeValidation = $validate->Empty($clientCode->data); // Run validation
if ($codeValidation->errorFlag) // If there was en error with the email.
{
  $outputData->errorFlag = true;

  $errorEntry = new StdClass();
  $errorEntry->field = $clientCode->field;
  $errorEntry->errorMessage = $codeValidation->errorMessage;

  $outputData->errorReport[] = $errorEntry;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (!$outputData->errorFlag)
{

  for ($i = 0; $i < 5; $i++)
  {

    // Generate Random Char ID
    $charID = $utility->RandomString(6);

    // SQL Query
    $selectPaste = $conn->prepare("SELECT `Paste_ID` FROM `paste` WHERE `Char_ID` = :charID");
    $selectPaste->bindParam(':charID', $charID);

    // Execute Query
    $selectPasteReturn = $selectPaste->execute();

    $result = $selectPaste->fetchAll(\PDO::FETCH_ASSOC);

    // Close Statement
    $selectPaste = null;

    if (count($result) === 0)
    {
      try
      {

        // SQL Query
        $insertPaste = $conn->prepare("INSERT INTO `paste` (`Char_ID`, `Code`, `User_ID`, `Public`, `Creation_Time`)
        VALUES (:charID, :code, :userID, :public, :creationTime)");
        $insertPaste->bindParam(':charID', $charID);
        $insertPaste->bindParam(':code', $clientCode->data);
        $insertPaste->bindParam(':userID', $_SESSION["userID"]);
        echo '$request->public->data: ' . $request->public->data;
        $insertPaste->bindParam(':public', $request->public->data ? true : false);
        $insertPaste->bindParam(':creationTime', $serverDateTime);

        // Execute Query
        $insertPasteReturn = $insertPaste->execute();

        $outputData->shareSuccess = true;
        $outputData->shareCharID = $charID;
        $i = 5;

      }
      catch(Exception $e)
      {
        $outputData->executionErrorFlag = true;
        $outputData->executionError = "Share failed. Please try again. ";
        echo "This was the exception: " . $e;
      }
    }
    else if ($i === 4)
    {
      $outputData->executionErrorFlag = true;
      $outputData->executionError = "Cannot generate ID for paste. ";
    }

  }

  // Close Statement
  $insertPaste = null;

} else {
  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Error flag is wrong. ";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;
