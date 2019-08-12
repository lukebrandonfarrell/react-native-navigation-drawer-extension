/**
 * @author Luke Brandon Farrell
 * @description Event dispatcher for comunication between components.
 */
/**
 * @description add listener
 * @public
 * @param {string} name name listener
 * @param {function} func function for call
 * @returns {function} unsubscribe function
 */
export declare function listen(name: string, func: any): () => void;
/**
 * @description dispatch to listener
 * @public
 * @param {string} name name listener
 * @param {any} arg argument for send to listen(...)
 * @returns {void}
 */
export declare function dispatch(name: string, arg?: any): void;
