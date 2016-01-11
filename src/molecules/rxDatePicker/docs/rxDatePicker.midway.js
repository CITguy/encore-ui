var moment = require('moment');

describe('rxDatePicker', function () {
    var picker;
    var today = moment(new Date());
    var isoFormat = 'YYYY-MM-DD';
    var formattedToday = today.format(isoFormat);

    before(function () {
        demoPage.go('#/molecules/rxDatePicker');
    });

    describe('simple example', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpSimple'));
        });

        it('should display "November 17, 2015" as selected date', function () {
            expect(picker.displayValue).to.eventually.eq('November 17, 2015');
        });

        it('should not be disabled', function () {
            expect(picker.isDisabled).to.eventually.eq(false);
        });

        it('should be valid', function () {
            expect(picker.isValid).to.eventually.eq(true);
        });

        it('should not display calendar', function () {
            expect(picker.isOpen()).to.eventually.eq(false);
        });

        describe('clicking control', function () {
            it('toggles visibility of calendar', function () {
                picker.eleControl.click();
                expect(picker.isOpen()).to.eventually.eq(true);

                picker.eleControl.click();
                expect(picker.isOpen()).to.eventually.eq(false);
            });
        });

        describe('with open calendar', function () {
            before(function () {
                picker.open();
            });

            after(function () {
                picker.close();
            });

            it('should have November 17 selected', function () {
                expect(picker.isDaySelected('2015-11-17')).to.eventually.eq(true);
            });

            describe('navigating', function () {
                describe('to December 2015', function () {
                    before(function () {
                        picker.navigateForward();
                    });

                    it('should display "December 2015" as current month', function () {
                        expect(picker.txtCurrentMonth).to.eventually.eq('December 2015');
                    });

                    it('should have November 29 as first date', function () {
                        expect(picker.eleFirstDay.getAttribute('data-date')).to.eventually.eq('2015-11-29');
                    });

                    it('should have January 2 as last date', function () {
                        expect(picker.eleLastDay.getAttribute('data-date')).to.eventually.eq('2016-01-02');
                    });
                });

                describe('to November 2015', function () {
                    before(function () {
                        picker.navigateBack();
                    });

                    it('should display "November 2015" as the current month', function () {
                        expect(picker.txtCurrentMonth).to.eventually.eq('November 2015');
                    });

                    it('should have November 1 as first date', function () {
                        expect(picker.eleFirstDay.getAttribute('data-date')).to.eventually.eq('2015-11-01');
                    });

                    it('should have December 5 as last date', function () {
                        expect(picker.eleLastDay.getAttribute('data-date')).to.eventually.eq('2015-12-05');
                    });
                });
            });//navigating

            describe('clicking December 3', function () {
                beforeEach(function () {
                    picker.selectDate('2015-12-03');
                });

                it('should not close calendar', function () {
                    expect(picker.isOpen()).to.eventually.eq(true);
                });

                it('should not change control display value', function () {
                    expect(picker.displayValue).to.eventually.eq('November 17, 2015');
                });

                it('should not change current picker month', function () {
                    expect(picker.txtCurrentMonth).to.eventually.eq('November 2015');
                });

                it('should not change selected day', function () {
                    expect(picker.isDaySelected('2015-11-17')).to.eventually.eq(true);
                });
            });

            describe('clicking November 5', function () {
                it('should close calendar', function () {
                    picker.selectDate('2015-11-05');
                    expect(picker.isOpen()).to.eventually.eq(false);
                });

                it('should change control display value', function () {
                    expect(picker.displayValue).to.eventually.eq('November 05, 2015');
                });

                it('should not change current picker month', function () {
                    picker.open();
                    expect(picker.txtCurrentMonth).to.eventually.eq('November 2015');
                });

                it('should change selected day', function () {
                    picker.open();
                    expect(picker.isDaySelected('2015-11-05')).to.eventually.eq(true);
                });
            });
        });
    });

    describe('empty model value', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpEmpty'));
        });

        describe('with open calendar', function () {
            before(function () {
                picker.open();
            });

            after(function () {
                picker.close();
            });

            it(formattedToday + ' should be "today"', function () {
                expect(picker.isDayToday(formattedToday)).to.eventually.eq(true);
            });
        });
    });//empty model value

    describe('undefined model value', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpUndefined'));
        });

        describe('with open calendar', function () {
            before(function () {
                picker.open();
            });

            after(function () {
                picker.close();
            });

            it(formattedToday + ' should be "today"', function () {
                expect(picker.isDayToday(formattedToday)).to.eventually.eq(true);
            });
        });
    });//undefined model value

    describe('enabled, valid', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpEnabledValid'));
        });

        it('should not be disabled', function () {
            expect(picker.isDisabled).to.eventually.eq(false);
        });

        it('should be valid', function () {
            expect(picker.isValid).to.eventually.eq(true);
        });
    });//enabled, valid

    describe('enabled, invalid', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpEnabledInvalid'));
        });

        it('should not be disabled', function () {
            expect(picker.isDisabled).to.eventually.eq(false);
        });

        it('should not be valid', function () {
            expect(picker.isValid).to.eventually.eq(false);
        });
    });//enabled, invalid

    describe('disabled, valid', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpDisabledValid'));
        });

        it('should be disabled', function () {
            expect(picker.isDisabled).to.eventually.eq(true);
        });

        it('should be valid', function () {
            expect(picker.isValid).to.eventually.eq(true);
        });
    });//disabled, valid

    describe('disabled, invalid', function () {
        before(function () {
            picker = encore.rxDatePicker.initialize($('#dpDisabledInvalid'));
        });

        it('should be disabled', function () {
            expect(picker.isDisabled).to.eventually.eq(true);
        });

        it('should not be valid', function () {
            expect(picker.isValid).to.eventually.eq(false);
        });
    });//disabled, invalid
});
