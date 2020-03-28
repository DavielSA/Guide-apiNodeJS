import { Collection, MongoError, ObjectId, UpdateWriteOpResult, WriteOpResult } from "mongodb";
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import mUser from './mUser';
import logs from "./../../libs/logs";
import Utils from "./../../libs/utils";
import Auth, { AuthEntity } from './../../libs/Auth';
import { ResponseString } from './../../libs/ResponseString';

class dUser extends db {

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
    public IsValidInsert(data: any, callback: (result: ResponseG) => any): boolean {
        const r: ResponseG = this.GetResponseEmpty();

        if (Utils.isEmptyObject(data)) {
            r.error.push(ResponseString.NOT_ARGUMENT)
            callback(r);
            return false;
        }

        if (!data.email || !Utils.isEmail(data.email)) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }

        if (!data.name) {
            r.warning.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "name"));
            data.name = "";
        }
        if (!data.role) {
            r.info.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "role"));
            data.role = 0;
        }

        if (!data.surname) {
            r.warning.push(ResponseString.OPTIONAL_FIELD.replace("{0}", "surname"));
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

        Auth.GetHash(data.password, (e: boolean, rAuth: AuthEntity | any) => {
            if (e) {
                r.error.push(ResponseString.PASSWORD_HASH_ERROR);
            } else {
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
    public IsValidlogin(data: any): ResponseG {
        const r: ResponseG = this.GetResponseEmpty();

        if (Utils.isEmptyObject(data)) {
            r.error.push(ResponseString.NOT_ARGUMENT)
            return r;
        }
        if (!data.email || !Utils.isEmail(data.email)) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "email"));
        }
        if (!data.password) {
            r.error.push(ResponseString.INVALID_FIELD.replace("{0}", "password"));
        }
        r.item = data;
        return r;
    }

    /**
     * This metod return all ocurrence for <where> argument.
     * @param where {mUser} criteria to filter
     * @param callback {function} this is function to response. Return object type ResponseG
     */
    public Get(where: mUser, callback: (result: ResponseG) => any): void {
        this.table.find(where).next(
            (e: MongoError, r: Collection) => this.CallSelect(callback, e, r)
        );
    }

    /**
     * This method return first ocurrence for <where> argument.
     * @param where {mUser} criteria to filter
     * @param callback {function} this is function to response. Return object type ResponseG
     */
    public GetOne(where: mUser, callback: (result: ResponseG) => any) {
        this.table.find(where).limit(1).next((e: MongoError, r: Collection) => this.CallSelect(callback, e, r));
    }

    /**
     *
     * @param Respuesta {ResponseG}. Manage response generic
     * @param sEmail {string}. Email a user to search in db.
     * @param password {string}. Password to user for compare.
     * @param callback {void}. Function to response.
     */
    public GetLogin(Respuesta: ResponseG, sEmail: string, password: string, callback: (result: ResponseG) => any) {
        this.table.find({ email: sEmail }).limit(1).next((e: MongoError, r: Collection) => {
            if (e || !r) {
                logs.Log(e);
                Respuesta.error.push(ResponseString.USER_NOT_FOUND);
                callback(Respuesta);
            } else {
                const item: any = r;
                Auth.VerifyHash(password, item.salt, (error: boolean, hash: string) => {
                    if (error) {
                        Respuesta.error.push(ResponseString.PASSWORD_HASH_ERROR);
                    } else {
                        if (item.hash !== hash)
                            Respuesta.error.push(ResponseString.PASWORD_INVALID);
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
    public Create(data: mUser, Respuesta: ResponseG, callback: (result: ResponseG) => any): void {
        try {
            this.table.insertOne(
                data,
                (e: MongoError, r: WriteOpResult) => this.CallBackInsert(callback, e, r)
            );
        } catch (e) {
            logs.Log(e);
            Respuesta.error.push(e);
            callback(Respuesta);
        }
    }

    /**
     * This method open /find the schema with a objectId and update this
     * @param data {mUser}. Data to update in schema
     * @param callback {function}. This is function to response. Return object type ResponseG
     */
    public Update(data: mUser, callback: (result: ResponseG) => any): void {
        const Respuesta: ResponseG = this.GetResponseEmpty();

        try {
            const Id: ObjectId = new ObjectId(data._id);
            delete data._id;
            this.table.findOne({ _id: Id }, (err: MongoError, result: any) => {
                if (err) {
                    throw new Error(ResponseString.NOT_FOUND);
                }
                this.table.update(
                    { _id: Id }, data,
                    (e: MongoError, r: WriteOpResult) => this.CallUpdate(callback, e, r));
            });

        } catch (e) {
            logs.Log(e);
            Respuesta.error.push(e);
            callback(Respuesta);
        }
    }

    /**
     * Return entity mUser empty.
     */
    public DefaultEntity(): mUser {
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
export default new dUser();
