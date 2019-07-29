<?php

$validate = new Validation;
$utility = new Utility;

class Validation
{

  function Email($email)
  {
    $returnData = new StdClass();
    $returnData->errorFlag = false;
    $returnData->errorMessage = "";

    if ($this->Empty($email)->errorFlag)
    {
      $returnData->errorFlag = true;
      $returnData->errorMessage .= "Please enter your email. ";
    }
    else {
      if (strlen($email) > 100)
      {
        $returnData->errorFlag = true;
        $returnData->errorMessage .= "Email exceeds 100 characters. ";
      }
      if (!preg_match('/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/', $email))
      {
        $returnData->errorFlag = true;
        $returnData->errorMessage .= "Email is not valid. ";
      }
    }

    return $returnData;
  }

  function Name($name)
  {
    $returnData = new StdClass();
    $returnData->errorFlag = false;
    $returnData->errorMessage = "";

    if ($this->Empty($name)->errorFlag)
    {
      $returnData->errorFlag = true;
      $returnData->errorMessage .= "Please enter your name. ";
    }
    else
    {
      if (strlen($name) > 50)
      {
        $returnData->errorFlag = true;
        $returnData->errorMessage .= "Name exceeds 50 characters. ";
      }
    }

    return $returnData;
  }

  function Password($password, $passwordRepeat)
  {
    $returnData = new StdClass();
    $returnData->errorFlag = false;
    $returnData->errorMessage = "";

    if ($this->Empty($password)->errorFlag)
    {
      $returnData->errorFlag = true;
      $returnData->errorMessage .= "Please enter a password. ";
    }
    else
    {
      if (strlen($password) < 8)
      {
        $returnData->errorFlag = true;
        $returnData->errorMessage .= "Your password must be atleast 8 characters long. ";
      }
      if ($password !== $passwordRepeat)
      {
        $returnData->errorFlag = true;
        $returnData->errorMessage .= "Passwords do not match. ";
      }
    }

    return $returnData;
  }

  function Empty($value)
  {
    $returnData = new StdClass();
    $returnData->errorFlag = false;
    $returnData->errorMessage = "";

    if (empty($value))
    {
      $returnData->errorFlag = true;
      $returnData->errorMessage .= "Please fill in this field. ";
    }

    return $returnData;
  }

}

class Utility
{

  function RandomString ($length)
  {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++)
    {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

}
