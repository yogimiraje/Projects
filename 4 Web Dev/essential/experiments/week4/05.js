var app = angular.module("BuyingListApp", []);

app.controller("BuyingListAppController",

    function ($scope) {

        $scope.toBuyList = [{ toBuyText: 'Milk', done: false}, 
                            { toBuyText: 'Bread', done: false }];

        console.log("in control");

        $scope.addToBuy = function ()
        {

            console.log($scope.toBuyInput);

            $scope.toBuyList.push({

                toBuyText: $scope.toBuyInput, done: false
            });

            toBuyInput = "";

        };

        console.log("out of control");

        $scope.removeFromList = function () {
            console.log("in remove");

            var oldList = $scope.toBuyList;
            $scope.toBuyList = [];
            angular.forEach(oldList, function (x) {
                if (!x.done) $scope.toBuyList.push(x);
            });
        };


      

    });





