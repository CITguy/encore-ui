/*jshint node:true*/
var Page = require('astrolabe').Page;

/**
 * @namespace
 */
var rxApp = {
    cssCollapseButtonSelector: {
        /**
          Keep just the css string available for both the button element
          and the check made in `isCollapsible()`, which uses findAllBy.
        */
        get: function () { return '.collapsible-toggle'; }
    },

    btnCollapseToggle: {
        get: function () { return this.rootElement.$(this.cssCollapseButtonSelector); }
    },

    title: {
        get: function () { return this.rootElement.$('.site-title').getText(); }
    },

    sectionTitle: {
        get: function () { return this.rootElement.$('.nav-section-title').getText(); }
    },

    expand: {
        value: function () {
            var page = this;
            return this.isCollapsed().then(function (collapsed) {
                if (collapsed) {
                    page.btnCollapseToggle.click();
                }
            });
        }
    },

    collapse: {
        value: function () {
            var page = this;
            return this.isExpanded().then(function (expanded) {
                if (expanded) {
                    page.btnCollapseToggle.click();
                }
            });
        }
    },

    isCollapsed: {
        value: function () {
            var page = this;
            return this.isCollapsible().then(function (isCollapsible) {
                if (!isCollapsible) {
                    return page.title.then(function (siteTitle) {
                        page.NotCollapsibleException.thro(siteTitle);
                    });
                }

                return page.rootElement.$('.rx-app').getAttribute('class').then(function (classNames) {
                    return (classNames.indexOf('collapsed') >= 0);
                });
            });
        }
    },

    isExpanded: {
        value: function () {
            return this.isCollapsed().then(function (result) {
                return !result;
            });
        }
    },

    isCollapsible: {
        value: function () {
            return this.btnCollapseToggle.isPresent();
        }
    },

    userId: {
        get: function () {
            return this.rootElement.element(by.binding('userId')).getText();
        }
    },

    logout: {
        value: function () {
            this.rootElement.$('.site-logout').click();
        }
    },

    NotCollapsibleException: {
        get: function () {
            return this.exception('Navigation menu not collapsible');
        }
    }
};//rxApp

/**
 * @exports encore.rxApp
 * @description Page object for interacting with rxApp elements
 */
exports.rxApp = {
    initialize: function (rxAppElement) {
        rxApp.rootElement = {
            get: function () { return rxAppElement; }
        };
        return Page.create(rxApp);
    }
};
