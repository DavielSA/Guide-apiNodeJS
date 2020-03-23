import { Collection, MongoError, ObjectId, UpdateWriteOpResult, WriteOpResult } from "mongodb";
import db from "../../bd/db";
import { ResponseG } from './../../bd/configFields';
import  mHome from './mHome';
import logs from "./../../libs/logs";

class dHome extends db {

    constructor() {
        super();
        this.dbName = "bd";
        this.tblName = "home";
        this.Connect();
    }


    public Get(where: mHome, callback: (result: any) => any): void {
        this.table.find(where).next(
            (e: MongoError, r: Collection) => this.CallSelect(callback, e, r)
        );
    }

    public GetOne(where: mHome, callback: any) {
        this.table.find(where).limit(1).next((e: MongoError, r: Collection) => this.CallSelect(callback, e, r));
    }

    public Create(data: mHome, callback: (result: any) => any): void {
        const Respuesta: ResponseG = this.GetResponseEmpty();
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

    public Update(data:mHome, callback: (result: ResponseG) => any): void {
        const Respuesta: ResponseG = this.GetResponseEmpty();

        try {
            const Id: ObjectId = new ObjectId(data._id);
            delete data._id;
            this.table.findOne({ _id: Id }, (err: MongoError, result: any) => {
                if (err) {
                    throw new Error("Not FOUND");
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

    public DefaultEntity(): mHome {
        return {
            _id: undefined,
            message: undefined,
            fcreated: new Date(),
        };
    }
}
export default new dHome();
