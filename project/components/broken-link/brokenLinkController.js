angular.module("project-app").controller("brokenLinkCtrl", ["$scope", "$http", "sharedFunctions", "$filter", "$interval", function($scope, $http, sharedFunctions, $filter, $interval) {

  $scope.results = "";

  $scope.sharedFunctions = sharedFunctions;

  $scope.countdown = 5; //Countdown for redirect starts at 5 seconds.

  // Reduce the timer by 1 second until it is at zero. When it is zero, redirect to the dashboard.
  $interval(function() {
    $scope.countdown--;
    if ($scope.countdown <= 0)
      window.location.href = "#!";
  }, 1000, 5);

}]);
