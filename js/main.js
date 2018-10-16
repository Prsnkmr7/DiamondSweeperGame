quintBuild = angular.module('quintDiamond-app', ['ui.router']);

// Route Provider Starts

quintBuild.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider

    .state('Info', {
        url: '/',
        templateUrl: 'Templates/info.html'
    })
    .state('home', {
        url: '/home',
        templateUrl: 'Templates/home.html'
    })
        
});

// Info Controller Logic

quintBuild.controller('infoController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope ) {
    $scope.user = {};
    $scope.submitForm = function (val) {
        if (val) {
            $rootScope.userName = $scope.user.name;
            sessionStorage.clear();
            $state.go('home');
        }
    }
}]);


// Home Controller logic

quintBuild.controller('homeController', ['$scope','$rootScope', 'quintAPIservice', function ($scope,$rootScope, quint) {
    $scope.listItems = [];
    $scope.user = {};
    $scope.init = function () {
        if (!sessionStorage.user) {
            quint.listAllItems().success(function (response) {
                $scope.listItems = response.diamondDetails;
                sessionStorage.userName = JSON.stringify($rootScope.userName);
                $scope.userName = $rootScope.userName;
                defaultValue();
                storageToSession();
            });
        }
        else{
            retreiveSessionData();
        }
    };

    var retreiveSessionData = function () {
        $scope.listItems = JSON.parse(sessionStorage.user);
        $scope.numberOfDiamondFound = JSON.parse(sessionStorage.noOfDiamond);
        $scope.totalPoints = JSON.parse(sessionStorage.totalPoints);
        $scope.userName = JSON.parse(sessionStorage.userName);
    };

    var storageToSession = function () {
        sessionStorage.user = JSON.stringify($scope.listItems);
        sessionStorage.noOfDiamond = JSON.stringify($scope.numberOfDiamondFound);
        sessionStorage.totalPoints = JSON.stringify($scope.totalPoints);
    };

    var checkForDiamond = function () {
        $scope.numberOfDiamondFound++;
        if ($scope.numberOfDiamondFound === 8) {
            $scope.showPoints = true;
        }
    };

    $scope.boxIsClicked = function (val) {
        val.isClicked = true;
        $scope.totalPoints = $scope.totalPoints - 1;
        if(val.isDiamond) {
            checkForDiamond();
        }
        storageToSession();
    };
    var defaultValue = function () {
        $scope.numberOfDiamondFound = 0;
        $scope.showPoints = false;
        $scope.totalPoints = 64;
    };
    $scope.resetValue = function () {
        defaultValue();
        sessionStorage.clear();
        $scope.init();
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