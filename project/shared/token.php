<?php

// Database Connection & Post data
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/connection.php");

// Include Validation Functions
include($_SERVER["DOCUMENT_ROOT"]."/project/shared/validations.php");

$token = $_GET["token"];

$json = file_get_contents("https://auth.mattdavis.info/api/check-token?token=" + token);

echo($json);

$data = json_decode($json);

try
{

  // SQL Query
  $selectUser = $conn->prepare("SELECT `User_ID`, `Email`, `First_Name`, `Last_Name`, `Password_Hash` FROM `user` WHERE `User_ID` = :userID");
  $selectUser->bindParam(':userID', $data->userID);

  // Execute Query
  $selectUserReturn = $selectUser->execute();

  $result = $selectUser->fetchAll(\PDO::FETCH_ASSOC);

  // Close Statement
  $selectUser = null;

  if (count($result) === 1)
  {

    try
    {
    // SQL Query
    $updateUser = $conn->prepare("UPDATE `user` SET `Last_Login_Time` = :loginTime WHERE `User_ID` = :userID");
    $updateUser->bindParam(':loginTime', $serverDateTime);
    $updateUser->bindParam(':userID', $result[0]["User_ID"]);

    // Execute Query
    $updateUserReturn = $updateUser->execute();

    // Close Statement
    $updateUser = null;

    $outputData->loginSuccess = true;

    $outputData->data->loggedIn = $_SESSION["loggedIn"] = true;
    $outputData->data->userID = $_SESSION["userID"] = $result[0]["User_ID"];
    $outputData->data->email = $_SESSION["email"] = $result[0]["Email"];
    $outputData->data->firstName = $_SESSION["firstName"] = $result[0]["First_Name"];
    $outputData->data->lastName = $_SESSION["lastName"] = $result[0]["Last_Name"];
    $_SESSION["passwordHash"] = $result[0]["Password_Hash"];
    }
    catch(Exception $e)
    {
    $outputData->loginSuccess = false;
    }

  }
  else {
    $outputData->errorFlag = true; // Email was incorrect
  }

}
catch(PDOException $e)
{
  $outputData->executionErrorFlag = true;
  $outputData->executionError = "Login failed. Please try again.";
}