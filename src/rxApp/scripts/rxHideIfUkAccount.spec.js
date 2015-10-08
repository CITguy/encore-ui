describe('rxHideIfUkAccount', function () {
    var $location, $route, $rootScope, $routeParams, rxHideIfUkAccount;

    beforeEach(function () {
        // Necessary so `$routeProvider` is available
        module('ngRoute');
        module('encore.ui.rxApp');
        module(function ($routeProvider) {
            $routeProvider.when('/accounts/:accountNumber', {});
        });

        inject(function ($injector) {
            $location = $injector.get('$location');
            $route = $injector.get('$route');
            $rootScope = $injector.get('$rootScope');
            $routeParams = $injector.get('$routeParams');
            rxHideIfUkAccount = $injector.get('rxHideIfUkAccount');
        });
    });

    it('should return false if UK account', function () {
        $location.path('/accounts/10000001');
        $rootScope.$digest();
        expect($routeParams).to.deep.equal({ accountNumber: '10000001' });
        var method = rxHideIfUkAccount.method;
        expect(method(), 'UK Account should return false').to.be.false;
    });

    it('should return true if not UK account', function () {
        $location.path('/accounts/9999999');
        $rootScope.$digest();
        expect($routeParams).to.deep.equal({ accountNumber: '9999999' });
        var method = rxHideIfUkAccount.method;
        expect(method(), 'Non-UK Account should return true').to.be.true;
    });
});
