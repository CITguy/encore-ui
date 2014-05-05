angular.module('encore.ui.rxSession', ['encore.ui.rxLocalStorage'])
/**
    *
    * @ngdoc service
    * @name encore.ui.rxSession:Session
    * @description
    * Service for managing user session in encore-ui.
    *
    * @requires encore.ui.rxLocalStorage:LocalStorage
    *
    * @example
    * <pre>
    * Session.getToken(); //Returns the stored token
    * Session.storeToken(token); //Stores token
    * Session.logoff(); //Logs user off
    * Session.isCurrent(); //Returns true/false if the token has expired.
    * Session.isAuthenticated(); //Returns true/false if the user token is valid.
    * </pre>
    */
    .factory('Session', function (LocalStorage) {
        var TOKEN_ID = 'encoreSessionToken';
        var session = {};

        session.getByKey = function (key) {
            var keys,
                value,
                token = session.getToken();

            if (_.isEmpty(token)) {
                return;
            }

            keys = key ? key.split('.') : undefined;
            value = _.reduce(keys, function (val, key) {
                return val[key] ? val[key] : undefined;
            }, token);

            return value;
        };

        session.getToken = function () {
            return LocalStorage.getObject(TOKEN_ID);
        };

        session.getTokenId = function () {
            return session.getByKey('access.token.id');
        };

        session.getUserId = function () {
            return session.getByKey('access.user.id');
        };

        session.getUserName = function () {
            return session.getByKey('access.user.name');
        };

        session.storeToken = function (token) {
            LocalStorage.setObject(TOKEN_ID, token);
        };

        session.logout = function () {
            LocalStorage.removeItem(TOKEN_ID);
        };

        session.isCurrent = function () {
            var expireDate = session.getByKey('access.token.expires');

            if (expireDate) {
                return new Date(expireDate) > _.now();
            }

            return false;
        };

        session.isAuthenticated = function () {
            var token = session.getToken();
            return _.isEmpty(token) ? false : session.isCurrent();
        };

        return session;
    });
