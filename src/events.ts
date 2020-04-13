/**
 * @author Luke Brandon Farrell
 * @description Event dispatcher for comunication between components.
 */

interface EvnetsInterface {
  [key: string]: any;
}

/**
 * @description events
 * @private
 */
var _events: EvnetsInterface = {};

/**
 * @description add listener
 * @public
 * @param {string} name name listener
 * @param {function} func function for call
 * @returns {function} unsubscribe function
 */
export function listen(name: string, func: any): () => void {
  if (!_events[name]) _events[name] = { count: 0, funcs: {} };

  const key = _events[name].count++;
  _events[name].funcs[key] = func;

  return function () {
    delete _events[name].funcs[key];
  };
}

/**
 * @description dispatch to listener
 * @public
 * @param {string} name name listener
 * @param {any} arg argument for send to listen(...)
 * @returns {void}
 */
export function dispatch(name: string, arg?: any): void {
  if (_events[name])
    for (var func in _events[name].funcs)
      _events[name].funcs[func] && _events[name].funcs[func](arg);
}
