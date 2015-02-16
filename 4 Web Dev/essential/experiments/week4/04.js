var app = angular.module("LocationApp", []);

app.controller("LocationAppController",
function ($scope) {

$scope.LocationDetails = "New york !"
$scope.empire = function () {

    console.log("Empire");

    $scope.LocationDetails = "Empire State Building "
    
}

$scope.liberty = function () {

    console.log("Libery");

    $scope.LocationDetails = "Statue of Liberty "

}

$scope.rockfellar = function () {

    console.log("rockfellar");

    $scope.LocationDetails = "Rockfellar Center "

}

$scope.timesSquare = function () {

    console.log("Times SQ");

    $scope.LocationDetails = "Times Square"

}


});