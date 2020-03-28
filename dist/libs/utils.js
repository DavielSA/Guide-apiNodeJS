"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Utils {
    constructor() {
        /**
         * Concat two array
         * @param arA {any[]}. First array to concat.
         * @param arB {any[]}. Second array to concat.
         * @return {any[]}.
         */
        this.UnionArray = (arA, arB) => {
            return [...new Set([...arA, ...arB])];
        };
        /**
         * Validate object null, undefined or empty
         * @param obj {any}. Object to validate.
         * @return {boolean}. True when object is empty or null or undefined | False when object contains data.
         */
        this.isEmptyObject = (obj) => {
            return !obj || !Object.keys(obj).length;
        };
        /**
         * Validate valid email.
         * @param email {string}. Text to validate for email.
         * @return {boolean}. Return TRUE when is valid email
         */
        this.isEmail = (email) => {
            const expression = /\S+@\S+/;
            return expression.test(String(email).toLowerCase());
        };
    }
}
exports.default = new Utils();
//# sourceMappingURL=utils.js.map