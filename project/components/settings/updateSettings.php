<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

// Ensure That The User Is Logged In
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/authenticate.php");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Input Variables
$clientPassword = $request->password;
$clientPasswordRepeat = $request->passwordRepeat;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Success Flags
$outputData->updateSuccess = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///// Validations /////

// Password
$passwordValidation = $validate->Password($clientPassword->data, $clientPasswordRepeat->data); // Run validation
if ($passwordValidation->errorFlag) // If there was en error with the password.
{
  $outputData->errorFlag = true;

  $errorEntry = new StdClass();
  $errorEntry->field = $clientPassword->field;
  $errorEntry->errorMessage = $passwordValidation->errorMessage;

  $outputData->errorReport[] = $errorEntry;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (!$outputData->errorFlag)
{

  try
  {
    // Generate Hash
    $clientPasswordHash = password_hash($clientPassword->data, PASSWORD_BCRYPT);

    // SQL Query
    $updateUser = $conn->prepare("UPDATE `user`
    SET `Password_Hash` = :passwordHash
    WHERE `Email` = :email");
    $updateUser->bindParam(':passwordHash', $clientPasswordHash);
    $updateUser->bindParam(':email', $_SESSION["email"]);

    // Execute Query
    $updateReturn = $updateUser->execute();

    $outputData->updateSuccess = true;

    // Close Statement
    $updateUser = null;
  }
  catch(PDOException $e)
  {
    $outputData->executionErrorFlag = true;
    $outputData->executionError = "Update failed. Please try again. ";
  }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Output
echo json_encode($outputData);

// Close Connection
$conn = null;
