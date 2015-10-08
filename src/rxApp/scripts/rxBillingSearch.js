angular.module('encore.ui.rxApp')
/**
 * @ngdoc directive
 * @name rxApp.directive:rxBillingSearch
 * @restrict E
 * @description [TBD]
 */
.directive('rxBillingSearch', function ($location, $window, encoreRoutes) {
    return {
        templateUrl: 'templates/rxBillingSearch.html',
        restrict: 'E',
        link: function (scope) {
            scope.searchType = 'bsl';
            scope.$watch('searchType', function () {
                scope.placeholder = scope.searchType === 'bsl' ? 'Transaction or Auth ID' : 'Account or Contact Info';
            });
            scope.fetchAccounts = function (searchValue) {
                if (!_.isEmpty(searchValue)) {
                    // Assuming we are already in /billing, we should use $location to prevent a page refresh
                    encoreRoutes.isActiveByKey('billing').then(function (isBilling) {
                        if (isBilling) {
                            $location.url('/search?q=' + searchValue + '&type=' + scope.searchType);
                        } else {
                            $window.location = '/billing/search?q=' + searchValue + '&type=' + scope.searchType;
                        }
                    });
                }
            };
        }
    };
});
