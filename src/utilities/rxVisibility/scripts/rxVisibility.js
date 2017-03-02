angular.module('encore.ui.utilities')
/**
 * @deprecated This item will be removed in EncoreUI 4.0.0
 * @ngdoc service
 * @name utilities.service:rxVisibility
 * @deprecated
 * This service is deprecated and will be removed in EncoreUI 4.0.0
 * @description
 * Provides an interface for adding new `visibility` methods for nav menus.  Methods added via `addMethod` should
 * have a `function (scope, args)` interface.
 *
 * When you do:
 * <pre>
 * visibility: [ "someMethodName", { foo: 1, bar: 2} ]
 * </pre>
 * in a nav menu definition, the (optional) object will be passed to your method as the
 * second argument `args`, i.e.:
 * <pre>
 * function (scope, args) {}
 * </pre>
 */
.factory('rxVisibility', function () {
    console.warn(
        'DEPRECATED: rxVisibility will be removed in EncoreUI 4.0.0'
    );

    var methods = {};

    var addMethod = function (methodName, method) {
        methods[methodName] = method;
    };

    var getMethod = function (methodName) {
        return methods[methodName];
    };

    var hasMethod = function (methodName) {
        return _.has(methods, methodName);
    };

    /* This is a convenience wrapper around `addMethod`, for
     * objects that define both `name` and `method` properties
     */
    var addVisibilityObj = function (obj) {
        addMethod(obj.name, obj.method);
    };

    return {
        addMethod: addMethod,
        getMethod: getMethod,
        hasMethod: hasMethod,
        addVisibilityObj: addVisibilityObj

    };
});
