describe('rxAppNavItem', function () {
    var scope, compile, rootScope, el, location, someProp, rxvisibility;
    var template = '<rx-app-nav-item item="item"></rx-app-nav-item>';

    var menuItem = {
        href: { tld: 'example', path: 'myPath' },
        linkText: '1st',
        directive: 'fake-directive',
        visibility: function () {
            return true;
        },
        childHeader: 'some value',
        children: [
            {
                href: '/1-1',
                linkText: '1st-1st',
                childVisibility: [ 'falseChildVisibilty' ],
                children: [
                    {
                        href: '/1-1-1',
                        linkText: '1st-1st-1st'
                    }
                ]
            }, {
                href: '/1-2',
                visibility: '2 + 2 == 4',
                linkText: '1st-2nd'
            }, {
                linkText: '1st-3rd',
                visibility: function () {
                    return someProp;
                },
                children: [
                    {
                        href: '/1-3-1',
                        linkText: '1st-3rd-1st'
                    }
                ]
            }, {
                linkText: '1st-4th',
                visibility: [ 'somePropMethod', { arg1: 'arg1', arg2: 'arg2' } ],
                children: [
                    {
                        href: '/1-4-1',
                        linkText: '1st-4th-1st'
                    }
                ]
            }, {
                linkText: 'visibilityAndRole',
                visibility: function () {
                    return true;
                },
                roles: { 'any': [ 'role1' ] }
            }, {
                linkText: 'noVisibilityButRolePresent',
                roles: { 'any': [ 'role1' ] }
            }, {
                linkText: 'visibilityOkButRoleFails',
                roles: { 'any': [ 'weDontHaveThisRole' ] }
            }, {
                linkText: 'multipleAllRolesPass',
                roles: { 'all': [ 'role1', 'role2', 'Test' ] }
            }, {
                linkText: 'multipleAllRolesFailure',
                roles: { 'all': [ 'role1', 'role2', 'ThisRoleDoesNotExist' ] }
            }, {
                linkText: 'failedVisibilityAndOKRoles',
                visibility: function () {
                    return false;
                },
                roles: { 'any': [ 'role1' ] }
            }
        ]
    };

    beforeEach(function () {
        // load module
        var mockToken = {
            access: {
                token:
                    {
                        id: 'someid',
                    },
                    user: {
                        id: 'joe.customer',
                        'roles': [{ 'id': '9','name': 'role1' },
                                  { 'id': '10','name': 'role2' },
                                  { 'id': '11','name': 'Test' }]
                    }
                }
            };

        var SessionMock = {
            getToken: function () {
                return mockToken;
            }
        };

        module('encore.ui.rxApp');
        module('encore.ui.rxCompile');

        // load templates
        module('templates/rxAppNav.html');
        module('templates/rxAppNavItem.html');

        module(function ($provide) {
            $provide.value('Session', SessionMock);
        });

        // Inject in angular constructs
        inject(function ($rootScope, $compile, $location, rxVisibility) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            compile = $compile;
            location = $location;
            rxvisibility = rxVisibility;
        });

        rxvisibility.addMethod(
            'somePropMethod',
            function (scope, locals) {
                /* should return false */
                return locals.arg1 === locals.arg2;
            }
        );

        rxvisibility.addMethod(
            'falseChildVisibilty',
            function () { return false; }
        );

        scope.item = _.clone(menuItem, true);

        el = helpers.createDirective(template, compile, scope);
    });

    afterEach(function () {
        el = null;
        scope = null;
    });

    it('should exist', function () {
        expect(el).to.have.length.of.at.least(1);
        expect(el.children()).to.have.length.of.at.least(2);
    });

    it('should hide if visibility property evaluates to false', function () {
        // check that first item is visible (since no 'visibility' property)
        expect(el.className).to.not.contain('ng-hide');

        // NOTE: this retreives *all* the child nav items, including the sub-child ones
        // This is why indexing is a little off
        var children = el[0].querySelectorAll('.item-children .rx-app-nav-item');

        // check that first level 2 item is visible (since 'visibility' function returns true)
        expect(children[0].className, 'first child, function').to.not.contain('ng-hide');

        // check that second level 2 item is visible (since 'visibility' expression == true)
        expect(children[2].className, 'middle child, expression').to.not.contain('ng-hide');

        // check that third level 2 item is not visible (since 'visibility' function currently returns false)
        expect(children[3].className, 'third child').to.contain('ng-hide');

        // check that third level 2 item is not visible (since 'somePropMethod' function currently returns false)
        expect(children[5].className, 'fourth child, linkText: 1st-4th').to.contain('ng-hide');

        // we need to set the property that the visibility function is checking to true
        someProp = true;
        scope.$digest();

        // now that visibility = true, el should not be hidden
        expect(children[3].className, 'last child, after someProp = true').to.not.contain('ng-hide');
    });

    it('should show/hide children based on childVisibility value', function () {
        // get children element
        var children = el[0].querySelectorAll('.item-children');

        expect(children[0].className, 'All Children').to.not.contain('ng-hide');
        expect(children[1].className, '1st Subnav Children').to.contain('ng-hide');
    });

    it('should build directive if available', function () {
        // get directive
        var directive = el[0].querySelector('.item-directive');

        expect(directive).to.exist;
        expect(directive.className).to.not.contain('.ng-hide');

        // sanity check that it correctly built directive HTML
        expect(directive.innerHTML).to.contain('<' + menuItem.directive);
        expect(directive.innerHTML).to.contain('</' + menuItem.directive + '>');
    });

    it('should increment the child nav level', function () {
        // get children element
        var children = el[0].querySelector('.item-children .rx-app-nav');
        children = angular.element(children);
        expect(children.hasClass('rx-app-nav-level-2')).to.be.true;
    });

    it('should show header for children if present', function () {
        // get child header element
        var childHeader = el[0].querySelector('.child-header');

        expect(childHeader.textContent).to.equal(menuItem.childHeader);
    });

    describe('Roles visibility', function () {
        it('should show when _all_ roles are present', function () {
            var item = el.find('a:contains("multipleAllRolesPass")').parent();
            expect(item.hasClass('ng-hide')).to.be.false;
        });

        it('should show if visibility and roles criteria are both true', function () {
            var item = el.find('a:contains("visibilityAndRole")').parent();
            expect(item.hasClass('ng-hide')).to.be.false;
        });

        it('should show if there is no visibility criteria but roles are present and true', function () {
            var item = el.find('a:contains("noVisibilityButRolePresent")').parent();
            expect(item.hasClass('ng-hide')).to.be.false;
        });

        it('should not show if visibility is true but role check fails', function () {
            var item = el.find('a:contains("visibilityOkButRoleFails")').parent();
            expect(item.hasClass('ng-hide')).to.be.true;
        });

        it('should not show if visibility check fails but role check passes', function () {
            var item = el.find('a:contains("failedVisibilityAndOKRoles")').parent();
            expect(item.hasClass('ng-hide')).to.be.true;
        });

        it('should not when when not all roles are present', function () {
            var item = el.find('a:contains("multipleAllRolesFailure")').parent();
            expect(item.hasClass('ng-hide')).to.be.true;
        });
    });
});
