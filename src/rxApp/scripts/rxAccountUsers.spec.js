describe('rxAccountUsers', function () {
    var rootScope, scope, compile, q, userSelect, users, encoreRoutesMock;
    var validTemplate = '<rx-account-users></rx-account-users>';
    var unregisterCheckCloud = sinon.spy();
    var rootScopeStub = null;

    beforeEach(function () {

        angular.module('testDirective', function () {})
            .factory('Encore', function () {
                return {
                    getAccountUsers: function () {
                        return {
                            users: [
                                { username: 'testaccountuser' },
                                { username: 'hub_cap' }
                            ]
                        };
                    }
                };
            })
            .factory('encoreRoutes', function ($q) {
                var mockReturn = true;
                return {
                    isActiveByKey: function () {
                        var deferred = $q.defer();
                        deferred.resolve(mockReturn);
                        return deferred.promise;
                    },

                    setMock: function (mockValue) {
                        mockReturn = mockValue;
                    }
                };
            });

        module('encore.ui.rxApp', 'testDirective');
        module('templates/rxAccountUsers.html');

        inject(function ($rootScope, $compile, $templateCache, $location, $route, $q, encoreRoutes) {
            rootScope = $rootScope;
            compile = $compile;
            scope = $rootScope.$new();
            rootScopeStub = sinon.stub(rootScope, '$on').returns(unregisterCheckCloud);
            q = $q;
            encoreRoutesMock = encoreRoutes;

            $location.url('http://server/cloud/');
            $route.current = {};
            $route.current.originalPath = $location.url();
            $route.current.params = {
                accountNumber: 323676,
                user: 'hub_cap'
            };

            scope.currentUser = 'hub_cap';
            scope.users = [
                { username: 'testaccountuser', admin: true },
                { username: 'hub_cap', admin: false }
            ];

            var accountUsersHtml = $templateCache.get('templates/rxAccountUsers.html');
            $templateCache.put('/templates/rxAccountUsers.html', accountUsersHtml);
        });

        userSelect = helpers.createDirective(angular.element(validTemplate), compile, scope);
        users = userSelect.find('option');
    });

    it('should only make external call on good account number', inject(function ($route, Encore) {
        sinon.spy(Encore, 'getAccountUsers');

        $route.current = { params: { accountNumber: 12345 }};
        helpers.createDirective(angular.element(validTemplate), compile, scope);
        expect(Encore.getAccountUsers.called).to.eq(true);

        Encore.getAccountUsers.reset();

        $route.current = { params: { accountNumber: 'nope' }};
        helpers.createDirective(angular.element(validTemplate), compile, scope);
        expect(Encore.getAccountUsers.called).to.eq(false);

        Encore.getAccountUsers.restore();
    }));

    it('should have two account users', function () {
        expect(users).to.have.length(2);
        expect(users[0].text).to.equal('testaccountuser');
        expect(users[1].text).to.equal('hub_cap');
    });

    it('should select current user', function () {
        expect(users[1]).to.be.selected;
    });

    it('should not render when encoreRoutes.isActiveByKey() returns false', function () {
        encoreRoutesMock.setMock(false);
        userSelect = helpers.createDirective(angular.element(validTemplate), compile, scope);
        expect(userSelect.find('select')).to.have.length(0);
    });

    it('should unregister the watcher when the element is removed from the DOM', function () {
        userSelect = helpers.createDirective(angular.element(validTemplate), compile, scope);
        userSelect.remove();
        expect(unregisterCheckCloud.called).to.eq(true);
    });

    afterEach(function () {
        rootScopeStub.restore();
    });
});
