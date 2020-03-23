import { ObjectID } from "mongodb";

interface mHome {
    _id: ObjectID;
    message: string;
    fcreated: Date;
}
export default mHome;
