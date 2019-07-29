angular.module("project-app").controller("viewPasteCtrl", ["$scope", "$http", "sharedFunctions", "$filter", "localVariables", "$location", function($scope, $http, sharedFunctions, $filter, localVariables, $location) {

  $scope.Modal = {};
  $scope.pastebinData = {};
  $scope.results = "";

  $scope.ViewPaste = function() {

    var sharingURI = $location.path().substring(3);

    //////////////View Request//////////////

    var request = $http({
      method: "post",
      url: "project/components/pastebin/view/viewPaste.php",
      data: {
        charID: sharingURI
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    request.then(function(response) {
      var serverResponse = angular.fromJson(response.data);

      if (serverResponse.executionErrorFlag) { // Server could not insert
        sharedFunctions.Prompt("error", serverResponse.executionError);
      } else if (serverResponse.fetchSuccess) {
        $scope.pastebinData.code = serverResponse.data.code;
        setTimeout(function() {
          $scope.formatCode();
        }, 1);
      } else {
        sharedFunctions.Prompt("warning", "Unexpected response.");
      }

    });



  }

  $scope.formatCode = function() {
    $("#pastebin-code-view").removeClass("prettyprinted");
    PR.prettyPrint();
  }

  $scope.sharedFunctions = sharedFunctions;

  $scope.ViewPaste();

  $scope.ShowPasteHistory = function() {

    if (sessionStorage.loggedIn === "true") {
      $('#pasteHistoryModal').modal('show');

      var request = $http({
        method: "post",
        url: "project/components/pastebin/history.php",
        data: {},
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      request.then(function(response) {
        var serverResponse = angular.fromJson(response.data);

        if (serverResponse.executionErrorFlag) { // Server could not insert
          sharedFunctions.Prompt("error", serverResponse.executionError);
        } else if (serverResponse.fetchSuccess) {

          $scope.temp = $filter('orderBy')(serverResponse.data.history, 'creationTime', true); // Filter by column.
          $scope.pastebinData.history = $scope.temp;

        } else {
          sharedFunctions.Prompt("warning", "Unexpected response.");
        }

      });
    } else {
      sharedFunctions.Prompt("error", "You are not logged in. Please log in to view paste history. ");
    }

  }

  $scope.ViewHistoricalPaste = function(charID) {
    $('#pasteHistoryModal').modal('hide');
    $('#pasteHistoryModal').on('hidden.bs.modal', function(e) {
      window.location.href = '#!/p/' + charID;
    })
  }

  $scope.NewPaste = function() {
    if (sessionStorage.loggedIn === "true") {
      window.location.href = '#!pastebin';
    } else {
      sharedFunctions.Prompt("error", "You are not logged in. Please log in to create a new paste. ");
    }
  }

}]);