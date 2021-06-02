"use strict";
/**
 * @author Luke Brandon Farrell
 * @description Event dispatcher for comunication between components.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = exports.listen = void 0;
/**
 * @description events
 * @private
 */
var _events = {};
/**
 * @description add listener
 * @public
 * @param {string} name name listener
 * @param {function} func function for call
 * @returns {function} unsubscribe function
 */
function listen(name, func) {
    if (!_events[name])
        _events[name] = { count: 0, funcs: {} };
    var key = _events[name].count++;
    _events[name].funcs[key] = func;
    return function () {
        delete _events[name].funcs[key];
    };
}
exports.listen = listen;
/**
 * @description dispatch to listener
 * @public
 * @param {string} name name listener
 * @param {any} arg argument for send to listen(...)
 * @returns {void}
 */
function dispatch(name, arg) {
    if (_events[name])
        for (var func in _events[name].funcs)
            _events[name].funcs[func] && _events[name].funcs[func](arg);
}
exports.dispatch = dispatch;
