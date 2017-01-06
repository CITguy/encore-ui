// TODO: refactor tests
describe('utilities: rxStatus', function () {
    var status, scope, rootScope;

    beforeEach(function () {
        module('encore.ui.utilities');

        inject(function ($rootScope, rxStatus) {
            scope = $rootScope.$new();
            status = rxStatus;
            rootScope = $rootScope;

            status.setScope(scope);

            sinon.spy(status, 'setStatus');
        });
    });

    afterEach(function () {
        status.setStatus.restore();
    });

    it('rxStatus: setLoading returns a loading message', function () {
        status.setLoading('Loading');
        expect(status.setStatus).to.be.calledWithMatch('Loading');
        expect(status.setStatus.args[0][1]).to.include.keys('loaded', 'loading');
        expect(status.setStatus.args[0][1]).to.include({ repeat: true, timeout: -1 });
    });

    it('rxStatus: setSuccess returns a success message', function () {
        status.setSuccess('Yup');
        expect(status.setStatus).to.be.calledWithMatch('Yup');
        expect(status.setStatus.args[0][1]).to.include.keys('success', 'type');
        expect(status.setStatus.args[0][1]).to.include({ repeat: false, timeout: 5 });
    });

    it('rxStatus: setSuccessNext returns a success message upon next route change', function () {
        status.setSuccessNext('Yup later');
        expect(status.setStatus).to.be.calledWithMatch('later');
        expect(status.setStatus.args[0][1]).to.include({ show: 'next', repeat: false, timeout: 5 });
    });

    it('rxStatus: setError returns an error message', function () {
        status.setError('Err');
        expect(status.setStatus).to.be.calledWithMatch('Err');
        expect(status.setStatus.args[0][1]).to.include.keys('success', 'type');
        expect(status.setStatus.args[0][1]).to.include({ repeat: false, timeout: -1 });
    });

    it('rxStatus: setWarning returns a warning message', function () {
        status.setWarning('Warn');
        expect(status.setStatus).to.be.calledWithMatch('Warn');
        expect(status.setStatus.args[0][1]).to.include.keys('success', 'type');
        expect(status.setStatus.args[0][1]).to.include({ repeat: true, timeout: -1 });
    });

    it('rxStatus: setInfo returns an info message', function () {
        status.setInfo('Info');
        expect(status.setStatus).to.be.calledWithMatch('Info');
        expect(status.setStatus.args[0][1]).to.include.keys('success', 'type');
        expect(status.setStatus.args[0][1]).to.include({ repeat: true, timeout: -1 });
    });

    it('rxStatus: setSuccess should be able to override a timeout attribute', function () {
        status.setSuccess('YupOverride', { timeout: 2 });
        expect(status.setStatus.args[0][1]).to.include({ timeout: 2 });
    });

    it('rxStatus: setSuccess should be able to override a repeat attribute', function () {
        status.setSuccess('YupOverride2', { repeat: true });
        expect(status.setStatus.args[0][1]).to.include({ repeat: true });
    });

    it('rxStatus: clear returns no message', function () {
        status.clear();
        expect(status.setStatus).to.not.have.been.called;
    });

    it('rxStatus: complete results in an immediate success', function () {
        status.complete();
        expect(scope.status.show).to.equal('immediate');
    });

    it('rxStatus: dismiss results in removal of an existing message', function () {
        var info = status.setInfo('Info');
        status.dismiss(info);
        expect(scope.status.loading).to.be.false;
    });

    it('rxStatus: should reset stack to "page" upon beginning of route reload', function () {
        inject(function (rxStatus) {
            var spy = sinon.spy(rxStatus, 'setStack');
            rootScope.$broadcast('$routeChangeStart');
            expect(rxStatus.setStack.args[0][0]).to.equal('page');
            spy.restore();
        });
    });
});
