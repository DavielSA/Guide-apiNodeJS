"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const db_1 = __importDefault(require("../../bd/db"));
const logs_1 = __importDefault(require("./../../libs/logs"));
const utils_1 = __importDefault(require("./../../libs/utils"));
const Auth_1 = __importDefault(require("./../../libs/Auth"));
const ResponseString_1 = require("./../../libs/ResponseString");
class dUser extends db_1.default {
    constructor() {
        super();
        this.dbName = "bd";
        this.tblName = "users";
        this.Connect();
    }
    /**
     * Method to validate data receibed for verbs
     * @param data {any} Data to validate.
     * @param callback {function} this is function to response. return object type ResponseG
     */
    IsValidInsert(data, callback) {
        const r = this.GetResponseEmpty();
        if (utils_1.default.isEmptyObject(data)) {
            r.error.push(ResponseString_1.ResponseString.NOT_ARGUMENT);
            callback(r);
            return false;
        }
        if (!data.email || !utils_1.default.isEmail(data.email)) {
            r.error.push(ResponseString_1.ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString_1.ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }
        if (!data.name) {
            r.warning.push(ResponseString_1.ResponseString.OPTIONAL_FIELD.replace("{0}", "name"));
            data.name = "";
        }
        if (!data.role) {
            r.info.push(ResponseString_1.ResponseString.OPTIONAL_FIELD.replace("{0}", "role"));
            data.role = 0;
        }
        if (!data.surname) {
            r.warning.push(ResponseString_1.ResponseString.OPTIONAL_FIELD.replace("{0}", "surname"));
            data.surname = "";
        }
        data.status = 0;
        data.fcreated = new Date();
        data.fupdate = new Date();
        r.item = data;
        if (r.error.length > 0) {
            delete r.item.password;
            callback(r);
            return false;
        }
        Auth_1.default.GetHash(data.password, (e, rAuth) => {
            if (e) {
                r.error.push(ResponseString_1.ResponseString.PASSWORD_HASH_ERROR);
            }
            else {
                r.item.hash = rAuth.hash;
                r.item.salt = rAuth.salt;
            }
            delete r.item.password;
            callback(r);
        });
        return true;
    }
    /**
     * this method validate basic data to login user.
     * @param data
     * @param callback {function} this is function to response. return object type ResponseG
     */
    IsValidlogin(data) {
        const r = this.GetResponseEmpty();
        if (utils_1.default.isEmptyObject(data)) {
            r.error.push(ResponseString_1.ResponseString.NOT_ARGUMENT);
            return r;
        }
        if (!data.email || !utils_1.default.isEmail(data.email)) {
            r.error.push(ResponseString_1.ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString_1.ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }
        r.item = data;
        return r;
    }
    /**
     * This metod return all ocurrence for <where> argument.
     * @param where {mUser} criteria to filter
     * @param callback {function} this is function to response. Return object type ResponseG
     */
    Get(where, callback) {
        this.table.find(where).next((e, r) => this.CallSelect(callback, e, r));
    }
    /**
     * This method return first ocurrence for <where> argument.
     * @param where {mUser} criteria to filter
     * @param callback {function} this is function to response. Return object type ResponseG
     */
    GetOne(where, callback) {
        this.table.find(where).limit(1).next((e, r) => this.CallSelect(callback, e, r));
    }
    /**
     *
     * @param Respuesta {ResponseG}. Manage response generic
     * @param sEmail {string}. Email a user to search in db.
     * @param password {string}. Password to user for compare.
     * @param callback {void}. Function to response.
     */
    GetLogin(Respuesta, sEmail, password, callback) {
        this.table.find({ email: sEmail }).limit(1).next((e, r) => {
            if (e || !r) {
                logs_1.default.Log(e);
                Respuesta.error.push(ResponseString_1.ResponseString.USER_NOT_FOUND);
                callback(Respuesta);
            }
            else {
                const item = r;
                Auth_1.default.VerifyHash(password, item.salt, (error, hash) => {
                    if (error) {
                        Respuesta.error.push(ResponseString_1.ResponseString.PASSWORD_HASH_ERROR);
                    }
                    else {
                        if (item.hash !== hash)
                            Respuesta.error.push(ResponseString_1.ResponseString.PASWORD_INVALID);
                        Respuesta.item = r;
                        callback(Respuesta);
                    }
                });
            }
        });
    }
    /**
     * This method open the schema and add argument <data>
     * @param data {mUser} Data to insert in schema
     * @param callback {function}  this is function to response. Return object type ResponseG
     */
    Create(data, Respuesta, callback) {
        try {
            this.table.insertOne(data, (e, r) => this.CallBackInsert(callback, e, r));
        }
        catch (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
            callback(Respuesta);
        }
    }
    /**
     * This method open /find the schema with a objectId and update this
     * @param data {mUser}. Data to update in schema
     * @param callback {function}. This is function to response. Return object type ResponseG
     */
    Update(data, callback) {
        const Respuesta = this.GetResponseEmpty();
        try {
            const Id = new mongodb_1.ObjectId(data._id);
            delete data._id;
            this.table.findOne({ _id: Id }, (err, result) => {
                if (err) {
                    throw new Error(ResponseString_1.ResponseString.NOT_FOUND);
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
    /**
     * Return entity mUser empty.
     */
    DefaultEntity() {
        return {
            _id: undefined,
            email: undefined,
            hash: undefined,
            salt: undefined,
            role: 0,
            name: undefined,
            status: undefined,
            surname: undefined,
            fupdate: new Date(),
            fcreated: new Date(),
        };
    }
}
exports.default = new dUser();
//# sourceMappingURL=dUser.js.map