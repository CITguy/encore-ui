angular.module('encore.ui.rxApp')
/**
 * @ngdoc service
 * @name rxApp.service:encoreRoutes
 * @description
 * Creates a shared instance of AppRoutes that is used for the Encore App nav.
 * This allows apps to make updates to the nav via `encoreRoutes`.
 *
 * @return {Object} Instance of rxAppRoutes with `fetchRoutes` method added
 */
.factory('encoreRoutes', function (rxAppRoutes, routesCdnPath, rxNotify, $q, $http,
                                   rxVisibilityPathParams, rxVisibility, Environment,
                                   rxHideIfUkAccount, LocalStorage) {

    // We use rxVisibility in the nav menu at routesCdnPath, so ensure it's ready
    // before loading from the CDN
    rxVisibility.addVisibilityObj(rxVisibilityPathParams);
    rxVisibility.addVisibilityObj(rxHideIfUkAccount);

    var encoreRoutes = new rxAppRoutes();

    var setWarningMessage = function () {
        rxNotify.add('There was a problem loading the navigation, so a cached version has been loaded for display.', {
            type: 'warning'
        });
    };

    var setFailureMessage = function () {
        rxNotify.add('Error loading site navigation', {
            type: 'error'
        });
    };

    var url, suffix;
    switch (true) {
        case Environment.isUnifiedProd(): {
            url = routesCdnPath.production;
            suffix = 'prod';
            break;
        }
        case Environment.isPreProd(): {
            url = routesCdnPath.preprod;
            suffix = 'preprod';
            break;
        }
        case routesCdnPath.hasCustomURL: {
            url = routesCdnPath.staging;
            suffix = 'custom';
            break;
        }
        default: {
            url = routesCdnPath.staging;
            suffix = 'staging';
        }
    }

    encoreRoutes.fetchRoutes = function () {
        var routesKey = 'encoreRoutes-' + suffix;
        var cachedRoutes = LocalStorage.getObject(routesKey);

        $http.get(url)
            .success(function (routes) {
                encoreRoutes.setAll(routes);
                LocalStorage.setObject(routesKey, routes);
            })
            .error(function () {
                if (cachedRoutes) {
                    encoreRoutes.setAll(cachedRoutes);
                    setWarningMessage();
                } else {
                    setFailureMessage();
                }
            });

        return cachedRoutes || [];
    };

    return encoreRoutes;
});
