
class Utils {

    /**
     * Concat two array
     * @param arA {any[]}. First array to concat.
     * @param arB {any[]}. Second array to concat.
     * @return {any[]}.
     */
    public UnionArray = (arA: any[], arB: any[]) => {
        return [...new Set([...arA, ...arB])]
    }

    /**
     * Validate object null, undefined or empty
     * @param obj {any}. Object to validate.
     * @return {boolean}. True when object is empty or null or undefined | False when object contains data.
     */
    public isEmptyObject = (obj: any) => {
        return !obj || !Object.keys(obj).length;
    }

    /**
     * Validate valid email.
     * @param email {string}. Text to validate for email.
     * @return {boolean}. Return TRUE when is valid email
     */
    public isEmail =(email:string) => {
        const expression = /\S+@\S+/
        return expression.test(String(email).toLowerCase())
    }


}

export default new Utils();