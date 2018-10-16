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

quintBuild.controller('infoController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope ) {
    $scope.user = {};
    $scope.submitForm = function (val) {
        if (val) {
        $rootScope.listId = $scope.user.name;
        sessionStorage.clear();
        $state.go('home');
        }
    }

}]);


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
        storageToSession();
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