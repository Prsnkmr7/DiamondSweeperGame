quintBuild = angular.module('quintDiamond-app', ['ui.router']);

// Route Provider Starts

quintBuild.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

        .state('Home', {
            url: '/',
            templateUrl: 'Templates/home.html'
        })
        
});

// Home Controller logic

quintBuild.controller('homeController', ['$scope', 'quintAPIservice', function ($scope, quint) {
    $scope.listItems = [];
    var prev;
    $scope.user = {};
    $scope.init = function () {
        if (!sessionStorage.user) {
            quint.listAllItems().success(function (response) {
                $scope.listItems = response.diamondDetails;
                storageToSession();
            });
        }
        else{
            retreiveSessionData();
            
        }
    };

    var retreiveSessionData = function () {
        $scope.listItems = JSON.parse(sessionStorage.user);
    };

    var storageToSession = function () {
        sessionStorage.user = JSON.stringify($scope.listItems);
    };

    $scope.checkForDiamond = function (val) {
        val.isClicked = true;
    };

    $scope.init();

}]);

// Factories

quintBuild.factory('quintAPIservice', function ($http) {

    var quintAPI = {};

    quintAPI.listAllItems = function () {
        return $http({
            method: 'GET',
            url: '../json/diamond.json'
        });
    }

    return quintAPI;
});