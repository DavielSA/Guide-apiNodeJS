"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ctrl_home_1 = __importDefault(require("./home/ctrl.home"));
const ctrl_user_1 = __importDefault(require("./users/ctrl.user"));
const controllers = [
    ctrl_home_1.default.router,
    ctrl_user_1.default.router
];
exports.default = controllers;
//# sourceMappingURL=router.js.map