'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _redux = require('redux');

var _reactRedux = require('react-redux');

exports.default = function (state, actions) {
    var func = function func() {
        return (0, _reactRedux.connect)(state, function (dispatch) {
            return (0, _redux.bindActionCreators)(actions, dispatch);
        });
    };
    return func();
};