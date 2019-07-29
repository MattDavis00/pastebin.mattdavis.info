angular.module("project-app").controller("pastebinCtrl", ["$scope", "$http", "sharedFunctions", "$filter", "localVariables", function($scope, $http, sharedFunctions, $filter, localVariables) {

  $scope.Modal = {};
  $scope.pastebinData = {};
  $scope.results = "";

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

  $scope.SharePaste = function() {

    var errorWithInput = false;

    if (sharedFunctions.Validation.Empty("#pastebin-code", $scope.pastebinData.code)) {
      errorWithInput = true;
    }


    //////////////Share Request//////////////

    if (!errorWithInput) {

      var request = $http({
        method: "post",
        url: "project/components/pastebin/share/share.php",
        data: {
          code: {
            data: $scope.pastebinData.code,
            field: "#pastebin-code"
          }
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });

      request.then(function(response) {
        var serverResponse = angular.fromJson(response.data);

        if (serverResponse.executionErrorFlag) { // Server could not insert
          sharedFunctions.Prompt("error", serverResponse.executionError);
        } else if (serverResponse.shareSuccess) {
          sharedFunctions.Prompt("success", "Share successful! mattdavis.info/#!/p/" + serverResponse.shareCharID);
          window.location.href = '#!/p/' + serverResponse.shareCharID;
        } else {
          sharedFunctions.Prompt("warning", "Unexpected response.");
        }

      });

    }

  }

  $scope.sharedFunctions = sharedFunctions;

  $(function() {
    $("textarea").keydown(function(e) {
      if (e.keyCode === 9) {
        e.preventDefault();
        var t = "  ";
        if (document.selection) {
          this.focus();
          var n = document.selection.createRange();
          n.text = t,
            this.focus()
        } else if (this.selectionStart || this.selectionStart == "0") {
          var r = this.selectionStart,
            i = this.selectionEnd,
            s = this.scrollTop;
          this.value = this.value.substring(0, r) + t + this.value.substring(i, this.value.length),
            this.focus(),
            this.selectionStart = r + t.length,
            this.selectionEnd = r + t.length,
            this.scrollTop = s
        } else
          this.value += t,
          this.focus()
      }
    })
  })

  $scope.NewPaste = function() {
    $scope.pastebinData.code = "";
  }

  $scope.ShowPasteHistory = function() {
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

  }

  $scope.ViewPaste = function(charID) {
    $('#pasteHistoryModal').modal('hide');
    $('#pasteHistoryModal').on('hidden.bs.modal', function(e) {
      window.location.href = '#!/p/' + charID;
    })
  }

}]);