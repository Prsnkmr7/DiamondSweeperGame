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

quintBuild.controller('infoController', ['$scope', '$state', '$rootScope', function ($scope, $state, $rootScope) {
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

quintBuild.controller('homeController', ['$scope', '$rootScope', 'quintAPIservice', function ($scope, $rootScope, quint) {
    $scope.listItems = [];
    $scope.user = {};
    var clickedData;

    // Initial Functional called on load
    $scope.init = function () {
        if (!sessionStorage.user) {
            quint.listAllItems().success(function (response) {
                $scope.listItems = response.diamondDetails;
                sessionStorage.userName = JSON.stringify($rootScope.userName);
                $scope.userName = $rootScope.userName;
                defaultValue();
                storageToSession();
            });
        } else {
            retreiveSessionData();
        }
    };

    // Retrieve Data from Session Storage
    var retreiveSessionData = function () {
        $scope.listItems = JSON.parse(sessionStorage.user);
        $scope.numberOfDiamondFound = JSON.parse(sessionStorage.noOfDiamond);
        $scope.totalPoints = JSON.parse(sessionStorage.totalPoints);
        $scope.userName = JSON.parse(sessionStorage.userName);
    };

    // Store Data from Session Storage
    var storageToSession = function () {
        sessionStorage.user = JSON.stringify($scope.listItems);
        sessionStorage.noOfDiamond = JSON.stringify($scope.numberOfDiamondFound);
        sessionStorage.totalPoints = JSON.stringify($scope.totalPoints);
    };

    // Finding whether the element has diamond or not
    var checkForDiamond = function () {
        $scope.numberOfDiamondFound++;
        if ($scope.numberOfDiamondFound === 8) {
            $scope.showPoints = true;
        }
    };

    // Functionality for box click
    $scope.boxIsClicked = function (val) {
        val.isClicked = true;
        $scope.totalPoints = $scope.totalPoints - 1;
        if (val.isDiamond) {
            checkForDiamond();
        }
        clickedData = val;
        storageToSession();
    };

    //Check for hint
    $scope.findHint = function () {
        if (clickedData) {
            var allDiamonds = findAllDiamonds();
            var rowIndex = Math.ceil((parseInt(clickedData.index) + 1) / 8);
            for (i = 0; i < allDiamonds.length; i++) {
                var currentIndex = Math.ceil((parseInt(allDiamonds[i].index) + 1) / 8);
                if (currentIndex === rowIndex) {
                    if ((allDiamonds[i].index - clickedData.index) > 0) {
                        $scope.message = 'Move to Right';
                    } else {
                        $scope.message = 'Move to Left';
                    }
                    break;
                } else {
                    if (currentIndex > rowIndex) {
                        $scope.message = 'Move down';
                    } else {
                        $scope.message = 'Move Up';
                    }
                    break;
                }
            }
        } else {
            $scope.message = 'Hint will be respect to previous selected column';
        }
    };

    //Find all diamonds
    var findAllDiamonds = function () {
        var returnData = [];
        for (i = 0; i < $scope.listItems.length; i++) {
            for (j = 0; j < $scope.listItems[i].columns.length; j++) {
                if ($scope.listItems[i].columns[j].isDiamond && !$scope.listItems[i].columns[j].isClicked) {
                    returnData.push($scope.listItems[i].columns[j]);
                }
            }
        }
        return returnData;
    }

    // Default value that needs to be set
    var defaultValue = function () {
        $scope.numberOfDiamondFound = 0;
        $scope.showPoints = false;
        $scope.totalPoints = 64;
    };

    // Resetting the value to play again
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