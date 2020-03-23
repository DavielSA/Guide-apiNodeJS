"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// this will load app which contains our main structure and logic
const util_1 = require("util");
const app_1 = __importDefault(require("./app"));
const logs_1 = __importDefault(require("./libs/logs"));
const sock_1 = require("./sock");
// const app = new App();
// use this line to get port from environment variable
const PORT = process.env.PORT && util_1.isNumber(process.env.PORT)
    ? Number(process.env.PORT)
    : 9999;
const PORTSOCK = process.env.SOCK_PORT && util_1.isNumber(process.env.SOCK_PORT)
    ? Number(process.env.SOCK_PORT)
    : 3001;
const socket = new sock_1.Socket(PORTSOCK);
app_1.default.app.listen(PORT, () => {
    logs_1.default.Log(`server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map