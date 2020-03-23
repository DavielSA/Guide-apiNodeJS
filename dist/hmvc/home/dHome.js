"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const db_1 = __importDefault(require("../../bd/db"));
const logs_1 = __importDefault(require("./../../libs/logs"));
class dHome extends db_1.default {
    constructor() {
        super();
        this.dbName = "bd";
        this.tblName = "home";
        this.Connect();
    }
    Get(where, callback) {
        this.table.find(where).next((e, r) => this.CallSelect(callback, e, r));
    }
    GetOne(where, callback) {
        this.table.find(where).limit(1).next((e, r) => this.CallSelect(callback, e, r));
    }
    Create(data, callback) {
        const Respuesta = this.GetResponseEmpty();
        try {
            this.table.insertOne(data, (e, r) => this.CallBackInsert(callback, e, r));
        }
        catch (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
            callback(Respuesta);
        }
    }
    Update(data, callback) {
        const Respuesta = this.GetResponseEmpty();
        try {
            const Id = new mongodb_1.ObjectId(data._id);
            delete data._id;
            this.table.findOne({ _id: Id }, (err, result) => {
                if (err) {
                    throw new Error("Not FOUND");
                }
                this.table.update({ _id: Id }, data, (e, r) => this.CallUpdate(callback, e, r));
            });
        }
        catch (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
            callback(Respuesta);
        }
    }
    DefaultEntity() {
        return {
            _id: undefined,
            message: undefined,
            fcreated: new Date(),
        };
    }
}
exports.default = new dHome();
//# sourceMappingURL=dHome.js.map