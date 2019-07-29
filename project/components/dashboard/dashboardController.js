angular.module("project-app").controller("dashboardCtrl", ["$scope", "$http", "sharedFunctions", "$filter", "localVariables", function($scope, $http, sharedFunctions, $filter, localVariables) {

  $scope.results = "";

  $scope.sharedFunctions = sharedFunctions;

  $scope.UpdateSettings = function() {

    //////////////Update Request//////////////

    var request = $http({
      method: "post",
      url: "project/components/dashboard/updateSettings.php",
      data: {
        password: {
          data: $scope.settingsData.password,
          field: "#settings-password"
        },
        passwordRepeat: {
          data: $scope.settingsData.passwordRepeat,
          field: "#settings-password-repeat"
        }
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    request.then(function(response) {
      var serverResponse = angular.fromJson(response.data);

      var fields = ["#settings-password", "#settings-password-repeat"];
      for (var i = 0; i < fields.length; i++) {
        sharedFunctions.Validation.RemoveErrorTooltip(fields[i]);
      }

      if (serverResponse.executionErrorFlag) { // Server could not insert
        sharedFunctions.Prompt("error", serverResponse.executionError);
      } else if (serverResponse.updateSuccess) {
        sharedFunctions.Prompt("success", "Settings updated successfully.");

        $scope.settingsData.password = $scope.settingsData.passwordRepeat = "";
      } else if (serverResponse.errorFlag) {

        for (var i = 0; i < serverResponse.errorReport.length; i++) {
          sharedFunctions.Validation.ErrorTooltip(serverResponse.errorReport[i].field, serverResponse.errorReport[i].errorMessage);

          if (serverResponse.errorReport[i].field === "#settings-password") {
            $("#settings-password-repeat").addClass("error-border");
          }
        }
      } else {
        sharedFunctions.Prompt("warning", "Unexpected response.");
      }

    });



  }

}]);