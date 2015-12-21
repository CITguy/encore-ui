angular.module('demoApp')
.controller('rxBackdropSimpleCtrl', function ($scope) {
    $scope.showBackdrop = false;

    $scope.openBackdrop = function () {
        $scope.showBackdrop = true;
    };

    $scope.closeBackdrop = function () {
        $scope.showBackdrop = false;
    };
});
