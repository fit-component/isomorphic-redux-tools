'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var getRest = function getRest(action) {
    var rest = {};
    var restKeys = Object.keys(action).filter(function (key) {
        return key !== 'promise' && key !== 'type';
    });
    restKeys.forEach(function (key) {
        rest[key] = action[key];
    });
    return rest;
};
var extendRest = function extendRest(rest, extend) {
    var all = rest;
    Object.keys(extend).forEach(function (extendkey) {
        all[extendkey] = extend[extendkey];
    });
    return all;
};

exports.default = function (store) {
    return function (next) {
        return function (action) {
            var promise = action.promise;
            var type = action.type;

            var rest = getRest(action);
            if (!promise) return next(action);
            var REQUEST = type + '_REQUEST';
            var SUCCESS = type + '_SUCCESS';
            var FAILURE = type + '_FAILURE';
            next(extendRest(rest, {
                type: REQUEST
            }));
            return promise.then(function (req) {
                next(extendRest(rest, {
                    req: req, type: SUCCESS
                }));
                return true;
            }).catch(function (error) {
                next(extendRest(rest, {
                    error: error, type: FAILURE
                }));
                console.log('PromiseMiddleware error:', error);
                return false;
            });
        };
    };
};