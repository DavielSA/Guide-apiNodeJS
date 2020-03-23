"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logs {
    constructor() {
        this.Log = (msg) => {
            const nowDate = new Date();
            // tslint:disable-next-line:no-console
            console.log("[" + nowDate.toLocaleString() + "] => ", JSON.stringify(msg));
        };
    }
}
exports.default = new Logs();
//# sourceMappingURL=logs.js.map