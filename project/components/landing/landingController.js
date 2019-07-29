angular.module("project-app").controller("landingCtrl", ["$scope", "$http", "sharedFunctions", "$filter", "localVariables", function($scope, $http, sharedFunctions, $filter, localVariables) {

  $scope.loginData = {};
  $scope.registerData = {};
  $scope.Modal = {};
  $scope.results = "";

  $scope.currentDate = new Date();

  $scope.Login = function() {

    //////////////Login Request//////////////

    var request = $http({
      method: "post",
      url: "project/components/landing/login.php",
      data: {
        email: {
          data: $scope.loginData.email,
          field: "#login-email"
        },
        password: {
          data: $scope.loginData.password,
          field: "#login-password"
        }
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    request.then(function(response) {
      var serverResponse = angular.fromJson(response.data);

      if (serverResponse.errorFlag) // There were errors found
      {

        var fields = ["#login-email", "#login-password"];
        $scope.loginData.password = "";
        for (var i = 0; i < fields.length; i++) {
          $(fields[i]).addClass("error-border");
        }
        sharedFunctions.Prompt("error", "Email or password is incorrect.");

      } else if (serverResponse.executionErrorFlag) { // Server could not insert
        sharedFunctions.Prompt("error", serverResponse.executionError);
      } else if (serverResponse.loginSuccess) {
        $('#loginModal').modal('hide');

        // Set Local Session Variables //
        sessionStorage.userID = serverResponse.data.userID;
        sessionStorage.email = serverResponse.data.email;
        sessionStorage.firstName = serverResponse.data.firstName;
        sessionStorage.lastName = serverResponse.data.lastName;
        sessionStorage.loggedIn = serverResponse.data.loggedIn;

        sharedFunctions.Prompt("success", "Login successful!");
        $('#loginModal').on('hidden.bs.modal', function(e) {
          window.location.href = '#!dashboard';
        })
      } else {
        sharedFunctions.Prompt("warning", "Unexpected response.");
      }

    });

  }

  $scope.RegisterUser = function() {

    //////////////Validation Checks//////////////

    var errorWithInput = false;

    if (sharedFunctions.Validation.Email("#register-email", $scope.registerData.email)) {
      errorWithInput = true;
    }
    if (sharedFunctions.Validation.Name("#register-firstName", $scope.registerData.firstName)) {
      errorWithInput = true;
    }
    if (sharedFunctions.Validation.Name("#register-lastName", $scope.registerData.lastName)) {
      errorWithInput = true;
    }
    if (sharedFunctions.Validation.Password("#register-password", "#register-passwordRepeat", $scope.registerData.password, $scope.registerData.passwordRepeat)) {
      errorWithInput = true;
    }

    //////////////Register Request//////////////

    if (!errorWithInput) {

      var request = $http({
        method: "post",
        url: "project/components/landing/register.php",
        data: {
          email: {
            data: $scope.registerData.email,
            field: "#register-email"
          },
          firstName: {
            data: $scope.registerData.firstName,
            field: "#register-email"
          },
          lastName: {
            data: $scope.registerData.lastName,
            field: "#register-lastName"
          },
          password: {
            data: $scope.registerData.password,
            field: "#register-password"
          },
          passwordRepeat: {
            data: $scope.registerData.passwordRepeat,
            field: "#register-passwordRepeat"
          }
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      request.then(function(response) {
        var serverResponse = angular.fromJson(response.data);

        if (serverResponse.errorFlag) // There were errors found
        {
          var fields = ["#register-email", "#register-firstName", "#register-lastName", "#register-password", "#register-passwordRepeat"];
          for (var i = 0; i < fields.length; i++) {
            sharedFunctions.Validation.RemoveErrorTooltip(fields[i]);
          }

          for (var i = 0; i < serverResponse.errorReport.length; i++) {
            sharedFunctions.Validation.ErrorTooltip(serverResponse.errorReport[i].field, serverResponse.errorReport[i].errorMessage);

            if (serverResponse.errorReport[i].field === "#register-password") {
              $("#register-passwordRepeat").addClass("error-border");
            }
          }
        } else if (serverResponse.executionErrorFlag) { // Server could not insert
          sharedFunctions.Prompt("error", serverResponse.executionError);
        } else {
          $scope.Modal.SwitchLoginRegister();
          sharedFunctions.Prompt("success", "You registered successfully!");
        }

      });

    }

  }

  particlesJS.load('background-animation', '/landing/particles.json');

  $scope.Modal.SwitchLoginRegister = function() {
    $('#loginModal').modal('toggle');
    $('#registerModal').modal('toggle');
  }

  $('#loginModal').on('hidden.bs.modal', function(e) {
    $scope.loginData = {};
    sharedFunctions.Validation.RemoveErrorTooltip('#login-email');
    sharedFunctions.Validation.RemoveErrorTooltip('#login-password');
  })

  $('#registerModal').on('hidden.bs.modal', function(e) {
    $scope.registerData = {};
    sharedFunctions.Validation.RemoveErrorTooltip('#register-email');
    sharedFunctions.Validation.RemoveErrorTooltip('#register-firstName');
    sharedFunctions.Validation.RemoveErrorTooltip('#register-lastName');
    sharedFunctions.Validation.RemoveErrorTooltip('#register-password');
    sharedFunctions.Validation.RemoveErrorTooltip('#register-passwordRepeat');
  })

  $scope.ClearForms = function() {
    $scope.loginData = {};
    $scope.registerData = {};
    sharedFunctions.Validation.RemoveErrorTooltip();
  }

}]);