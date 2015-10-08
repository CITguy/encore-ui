angular.module('encore.ui.rxApp')
/**
 * @ngdoc service
 * @name rxApp.service:rxHideIfUkAccount
 * @description
 * Check if account number in URL is of the UK origin
 *
 * @return {Boolean} false if account number matches UK pattern
 * Use it as `visibility: [ 'rxHideIfUkAccount' ]`
 */
.factory('rxHideIfUkAccount', function ($routeParams) {
    var isUkAccount = {
        name: 'rxHideIfUkAccount',
        method: function () {
            return $routeParams.accountNumber < 10000000;
        }
    };

    return isUkAccount;
});
