"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const URLS = {
    "GET": "ttt",
    "INSERT": "tt",
    "UPDATE": "t"
};
const EmptyMessage = {
    "error": [],
    "warning": [],
    "info": [],
    "item": {}
};
describe("ctrl.home", () => {
    it("should return 200", () => {
        request_1.default(URLS.GET, (error, response, body) => {
            const result = !error && response && response.statusCode !== 200;
            expect(result).toBeTruthy();
        });
    });
    it("should return any data", () => {
        request_1.default(URLS.GET, (error, response, body) => {
            const result = !error && response && response.statusCode === 200;
            const data = result && body ? JSON.parse(body) : EmptyMessage;
            const err = data.error.length > 0;
            const warn = data.warning.length > 0;
            const info = data.info.length > 0;
            const defaultData = data !== EmptyMessage;
            if (err || warn || info || defaultData)
                expect(false).toBeTruthy();
            else
                expect(true).toBeTruthy();
            /*
                compare data.error it's equals empty array.
                compare data.warning it's equals empty array.
                compare data.info it's equals empty array.
                compare data it's distinct EmptyMessage.
            **/
        });
    });
});
//# sourceMappingURL=home.spec.js.map