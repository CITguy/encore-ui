var Page = require('astrolabe').Page;

/**
 * @namespace
 */
var rxDatePicker = {
    /**
     * @function
     * @description fetch current month (as seen in picker element)
     * @return {String}
     */
    txtCurrentMonth: {
        get: function () {
            return this.rootElement.$('.currentMonth').getText();
        }
    },

    displayValue: {
        get: function () {
            return this.rootElement.$('.displayValue').getAttribute('value').then(function (val) {
                return val;
            });
        }
    },

    /**
     * @function
     * @description fetch fake control element
     * @return {ElementFinder}
     */
    eleControl: {
        get: function () {
            return this.rootElement.$('.control');
        }
    },

    /**
     * @function
     * @description fetch popup picker element
     * @return {ElementFinder}
     */
    elePopup: {
        get: function () {
            return this.rootElement.$('.popup');
        }
    },

    /**
     * @function
     * @description fetch left nav arrow in picker
     * @return {ElementFinder}
     */
    elePrevArrow: {
        get: function () {
            return this.rootElement.$('.arrow.prev');
        }
    },

    /**
     * @function
     * @description fetch right nav arrow in picker
     * @return {ElementFinder}
     */
    eleNextArrow: {
        get: function () {
            return this.rootElement.$('.arrow.next');
        }
    },

    /**
     * @function
     * @description fetch first day of calendar
     *
     * @return {ElementFinder}
     */
    eleFirstDay: {
        get: function () {
            return this.rootElement.$$('.day').first();
        }
    },

    /**
     * @function
     * @description fetch last day of calendar
     *
     * @return {ElementFinder}
     */
    eleLastDay: {
        get: function () {
            return this.rootElement.$$('.day').last();
        }
    },

    /**
     * @function
     * @description true if day has 'selected' class
     *
     * @param {String} date YYYY-MM-DD date string
     * @return {Boolean}
     */
    isDaySelected: {
        value: function (date) {
            return this.eleDayByDate(date).getAttribute('class').then(function (classes) {
                return _.contains(classes, 'selected');
            });
        }
    },

    /** NOTE: useless unless time can be frozen
     * @function
     * @description true if day has 'today' class
     *
     * @param {String} date YYYY-MM-DD date string
     * @return {Boolean}
     */
    isDayToday: {
        value: function (date) {
            return this.eleDayByDate(date).getAttribute('class').then(function (classes) {
                return _.contains(classes, 'today');
            });
        }
    },

    /**
     * @description true if root element has 'disabled' attribute
     * @return {Boolean}
     */
    isDisabled: {
        get: function () {
            return this.rootElement.getAttribute('disabled').then(function (disabled) {
                return (disabled ? true : false);
            });
        }
    },

    /**
     * @description true if root element has 'disabled' attribute
     * @return {Boolean}
     */
    isValid: {
        get: function () {
            return this.rootElement.getAttribute('class').then(function (classes) {
                return !_.contains(classes, 'ng-invalid');
            });
        }
    },

    /**
     * @function
     * @description fetch by `data-date` value
     *
     * @param {String} date YYYY-MM-DD date string of day to fetch
     * @return {ElementFinder}
     */
    eleDayByDate: {
        value: function (date) {
            return this.rootElement.$('[data-date="' + date + '"]');
        }
    },

    /**
     * @function
     * @description Used to select visible day in selector
     *
     * @param {String} dateString YYYY-MM-DD date string of date to select
     */
    selectDate: {
        value: function (dateString) {
            this.eleDayByDate(dateString).$('span').click();
        }
    },

    /**
     * @description whether or not the popup is visible
     * @return {Boolean}
     */
    isOpen: {
        value: function () {
            return this.elePopup.isPresent();
        }
    },

    /**
     * @function
     * @description Ensure picker is open
     */
    open: {
        value: function () {
            var self = this;
            this.isOpen().then(function (isOpen) {
                if (!isOpen) {
                    self.eleControl.click();
                }
            });
        }
    },

    /**
     * @function
     * @description Ensure picker is closed
     */
    close: {
        value: function () {
            var self = this;
            return this.isOpen().then(function (isOpen) {
                if (isOpen) {
                    self.eleControl.click();
                }
            });
        }
    },

    /**
     * @function
     * @description navigate to previous month in picker
     */
    navigateBack: {
        value: function () {
            this.elePrevArrow.click();
        }
    },

    /**
     * @function
     * @description navigate to next month in picker
     */
    navigateForward: {
        value: function () {
            this.eleNextArrow.click();
        }
    }
};

/**
 * @exports encore.rxDatePicker
 */
exports.rxDatePicker = {
    /**
     * @function
     * @param {WebElement} rxDatePickerElement - WebElement to be transformed into an rxDatePicker page object.
     * @returns {rxDatePicker} Page object representing the rxDatepicker element.
     */
    initialize: function (rxDatePickerElement) {
        rxDatePicker.rootElement = {
            get: function () { return rxDatePickerElement; }
        };
        return Page.create(rxDatePicker);
    }
};
