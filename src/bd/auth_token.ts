import { Collection, MongoError, ObjectID } from "mongodb";
import logs from "./../libs/logs";
import bd from "./db";

export interface Token {
    user: ObjectID;
    token: string;
    token_expiresIn: Date;
    tokenrenewal: string;
    tokenrenewal_expiresIn: Date;
    role: number;
    fcreated: Date;
}
class AuthToken extends bd {
    constructor() {
        super();
        this.dbName = "bd";
        this.tblName = "auth_token";
        this.Connect();
    }

    public Save(token: Token) {
        this.table.insertOne(token, (err: MongoError, result: any) => {
            if (err) {
                logs.Log(err);
            }
        });
    }
    public GetTokens(token: string, callback: any) {
        const fecha: Date = new Date();
        this.table.findOne({ token, token_expiresIn: { $gte: fecha } }, (err: MongoError, result: Collection) => {
            callback(
                err ? true : false,
                err ? err : result
            );
        });
    }

}
export default new AuthToken();