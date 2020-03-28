import { ObjectID } from "mongodb";

interface mUser {
    _id: ObjectID;
    email:string;
    hash:string;
    salt:string;
    name: string;
    role:number;
    surname:string;
    status:number;
    fcreated: Date;
    fupdate: Date;
}
export default mUser;
