app = angular.module("project-app", ["ngRoute"]);


///////////////////////// Route Provider /////////////////////////
app.config(function($routeProvider) {
  $routeProvider

    // Routes 
    .when("/", {
      templateUrl: "project/components/landing/landingView.html",
      controller: "landingCtrl"
    })
    .when("/settings", {
      templateUrl: "project/components/settings/settingsView.html",
      controller: "settingsCtrl"
    })
    .when("/privacy-policy", {
      templateUrl: "project/components/privacy/privacyPolicyView.html",
      controller: "settingsCtrl"
    })
    .when("/broken-link", {
      templateUrl: "project/components/broken-link/brokenLinkView.html",
      controller: "brokenLinkCtrl"
    })
    .when("/pastebin", {
      templateUrl: "project/components/pastebin/share/pastebinView.html",
      controller: "pastebinCtrl"
    })
    .when('/p/:sharingURI*', {
      templateUrl: "project/components/pastebin/view/viewPasteView.html",
      controller: 'viewPasteCtrl'
    })


    // Otherwise show the broken link page, and then redirect to the landing page.
    .otherwise({
      redirectTo: "/broken-link"
    });

});


/////////////////////// Shared Client-Side Functions /////////////////////////////
app.service('sharedFunctions', ['$http', "$location", function($http, $location) {

  $('#alert-prompt').collapse({
    toggle: false
  })

  /**
   * Handles alert prompts that appear at the bottom of the screen.
   *
   * @param {string} type The desired type of prompt. This affects the colour of the alert. Includes "success" (green), "error" (red), "warning" (yellow), "info" (blue) and defaults to blue.
   * @param {string} value The string to be displayed in the alert box. E.g "Wrong password!".
   */
  this.Prompt = function(type, value) {

    var alertClass = "";

    // Check alert type/colour and convert it to its appropriate bootstrap class name.
    if (type === "success") {
      alertClass = "alert-success";
    } else if (type === "error") {
      alertClass = "alert-danger";
    } else if (type === "warning") {
      alertClass = "alert-warning";
    } else if (type === "info") {
      alertClass = "alert-primary";
    } else {
      alertClass = "alert-primary";
    }

    // Add the class and text to the alert prompt, then show it.
    $("#alert-prompt-data").addClass(alertClass);
    $("#alert-prompt-data").text(value);
    $('#alert-prompt').collapse('show');

    // After 5 seconds hide the prompt, remove the text and class as well.
    setTimeout(function() {
      $('#alert-prompt').collapse('hide');
      $("#alert-prompt-data").text("");
      $("#alert-prompt-data").removeClass(alertClass);
    }, 5000);

  }

  // Check if user is logged in, if not show error and redirect.
  this.AuthenticateUser = function() {

    if (sessionStorage.loggedIn !== "true") {

      window.location.href = "https://auth.mattdavis.info/api/auth?redirectURL=" + encodeURI(window.location.href) + "&tokenURL=" + encodeURI("https://pastebin.mattdavis.info/project/shared/token.php");

      // Show not logged in error
      self.Prompt("error", "You are not logged in! Returning to landing page in 5 seconds...");

      // After 5 seconds, redirect
      setTimeout(function() {
        window.location.href = '#!';
      }, 5000);
    }

  }

  // Send logout request to the server. If successful, show a success message and redirect to the index.
  this.LogOut = function() {

    // Log Out Request
    var request = $http({
      method: "post",
      url: "project/shared/logOut.php",
      data: {},
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    // Response
    request.then(function(response) {
      var serverResponse = angular.fromJson(response.data);

      if (serverResponse.logOutSuccess) { // Logout was successful

        // Set Local Session Variables //
        sessionStorage.userID = serverResponse.data.userID;
        sessionStorage.email = serverResponse.data.email;
        sessionStorage.firstName = serverResponse.data.firstName;
        sessionStorage.lastName = serverResponse.data.lastName;
        sessionStorage.loggedIn = serverResponse.data.loggedIn;

        self.Prompt("success", "Log out successful!");
        window.location.href = '#!';

      } else { // Logout failed
        self.Prompt("warning", "Log out unsuccessful!");
      }

    });

  }

  // Send logout request to the server. If successful, show a success message and redirect to the index.
  this.CheckForSSO = function(response) {
    var serverResponse = angular.fromJson(response.data);
    if (serverResponse.executionErrorFlag && serverResponse.executionError === "You are not logged in. ") {
      window.location.href = "https://auth.mattdavis.info/api/auth?redirectURL=" + encodeURI(window.location.href) + "&tokenURL=" + encodeURI("https://pastebin.mattdavis.info/project/shared/token.php");
    }
  }

  this.Validation = {}; // Validation class

  // Email validation function.
  // Cannot be blank, cannot be over 100 chars, and must match the email regex.
  // Returns true if errors were found.
  this.Validation.Email = function(element, email) {
    var returnData = {};
    returnData.errorFlag = false;
    returnData.errors = "";

    self.Validation.RemoveErrorTooltip(element);

    if (!(email)) {
      returnData.errorFlag = true;
      returnData.errors += "Please enter your email. ";
    } else {
      if (!(email.length > 0)) {
        returnData.errorFlag = true;
        returnData.errors += "Please enter your email. ";
      }

      if (email.length > 100) {
        returnData.errorFlag = true;
        returnData.errors += "Email exceeds 100 characters. ";
      }

      if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(email))) {
        returnData.errorFlag = true;
        returnData.errors += "Email is not valid. ";
      }
    }

    if (returnData.errorFlag) { // If an error occured, display an error message to the user.
      self.Validation.ErrorTooltip(element, returnData.errors);
    }

    return returnData.errorFlag;

  }

  // Name validation.
  // Cannot be blank, must be 50 chars or less.
  // Returns true if errors were found.
  this.Validation.Name = function(element, name) {
    var returnData = {};
    returnData.errorFlag = false;
    returnData.errors = "";

    self.Validation.RemoveErrorTooltip(element);

    if (!(name)) {
      returnData.errorFlag = true;
      returnData.errors += "Please enter your name. ";
    } else {
      if (!(name.length > 0)) {
        returnData.errorFlag = true;
        returnData.errors += "Please enter your name. ";
      }

      if (name.length > 50) {
        returnData.errorFlag = true;
        returnData.errors += "Name exceeds 50 characters. ";
      }
    }

    if (returnData.errorFlag) { // If an error occured, display an error message to the user.
      self.Validation.ErrorTooltip(element, returnData.errors);
    }

    return returnData.errorFlag;

  }

  // Password validation.
  // Must be 8 or more characters, the password and repeat must match.
  // Returns true if errors were found.
  this.Validation.Password = function(element, element2, password, passwordRepeat) {
    var returnData = {};
    returnData.errorFlag = false;
    returnData.errors = "";

    self.Validation.RemoveErrorTooltip(element);
    self.Validation.RemoveErrorTooltip(element2);

    if (!(password)) {
      returnData.errorFlag = true;
      returnData.errors += "Please enter a password. ";
    } else {
      if (!(password.length >= 8)) {
        returnData.errorFlag = true;
        returnData.errors += "Your password must be atleast 8 characters long. ";
      }

      if (password !== passwordRepeat) {
        returnData.errorFlag = true;
        returnData.errors += "Passwords do not match. ";
      }
    }

    if (returnData.errorFlag) { // If an error occured, display an error message to the user.
      self.Validation.ErrorTooltip(element, returnData.errors);
      $(element2).addClass("error-border");
    }

    return returnData.errorFlag;

  }

  // Emptiness validation.
  // Must exist and must be greater than 0 in length (this includes integers as their length can be implicitly calculated as a string).
  // Returns true if errors were found.
  this.Validation.Empty = function(element, value) {
    var returnData = {};
    returnData.errorFlag = false;
    returnData.errors = "";

    self.Validation.RemoveErrorTooltip(element);

    if (!(value)) {
      returnData.errorFlag = true;
      returnData.errors += "Please fill in this field. ";
    } else {
      if (!(value.length > 0)) {
        returnData.errorFlag = true;
        returnData.errors += "Please fill in this field. ";
      }
    }

    if (returnData.errorFlag) {
      self.Validation.ErrorTooltip(element, returnData.errors);
    }

    return returnData.errorFlag;

  }

  // Create a form validation tooltip.
  // Take in the html element ID and the errors.
  // Outlines the field in red whilst displaying a bootstrap tooltip beside it.
  this.Validation.ErrorTooltip = function(element, errors) {
    $(element).removeClass("error-border");
    $(element).tooltip('dispose');
    $(element).tooltip({
      placement: 'top',
      title: errors
    });
    $(element).tooltip('show');
    $(element).addClass("error-border");
  }

  // Removes any validation tooltip from an element and its red outline.
  this.Validation.RemoveErrorTooltip = function(element) {
    $(element).removeClass("error-border");
    $(element).tooltip('dispose');
  }

  var self = this;

}]);