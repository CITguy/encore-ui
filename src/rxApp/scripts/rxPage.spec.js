describe('rxPage', function () {
    var scope, compile, rootScope, el, pageTitle;
    var template = '<rx-page title="myCustomTitle"></rx-page>';

    beforeEach(function () {
        // load module
        module('encore.ui.rxApp');
        module('encore.ui.rxPageTitle');

        // load templates
        module('templates/rxPage.html');

        // Inject in angular constructs
        inject(function ($rootScope, $compile) {
            rootScope = $rootScope;
            scope = $rootScope.$new();
            compile = $compile;
        });

        inject(function (rxPageTitle) {
            pageTitle = rxPageTitle;
        });

        scope.myCustomTitle = 'foobar';
        el = helpers.createDirective(template, compile, scope);
    });

    it('should exist', function () {
        expect(el).to.have.length.of.at.least(1);
        expect(el.children()).to.have.length.of.at.least(1);
    });

    it('should have foobar as a title', function () {
        expect(pageTitle.getTitle()).to.equal('foobar');
    });

    it('should update page title if title changes', function () {
        scope.myCustomTitle = 'abc';
        scope.$digest();
        expect(pageTitle.getTitle()).to.equal('abc');
    });
});
