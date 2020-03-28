"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logs_1 = __importDefault(require("./../libs/logs"));
const db_1 = __importDefault(require("./db"));
class AuthToken extends db_1.default {
    constructor() {
        super();
        this.dbName = "bd";
        this.tblName = "auth_token";
        this.Connect();
    }
    Save(token) {
        this.table.insertOne(token, (err, result) => {
            if (err) {
                logs_1.default.Log(err);
            }
        });
    }
    GetTokens(token, callback) {
        const fecha = new Date();
        this.table.findOne({ token, token_expiresIn: { $gte: fecha } }, (err, result) => {
            callback(err ? true : false, err ? err : result);
        });
    }
}
exports.default = new AuthToken();
//# sourceMappingURL=auth_token.js.map