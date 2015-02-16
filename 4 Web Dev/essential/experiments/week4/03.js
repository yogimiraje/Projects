var app = angular.module("BasicApp", []);

app.controller("BasicAppController",
function ($scope) {

    var product = {
        pname: "nexus",
        price: "$200"
    };

    $scope.product = product;

    var products = [
        { pname: "iphone", price: "$500" },
        { pname: "ipad", price: "$700" },
        { pname: "macbook pro", price: "$1000" },
        { pname: "macbook pro retina ", price: "$1300" },
        { pname: "iMac", price: "$2100" },


    ];

    $scope.products = products;

  

});