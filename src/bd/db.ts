import * as mongodb from "mongodb";
import logs from "./../libs/logs";

import { ResponseG } from './configFields';
import { WriteOpResult } from "mongodb";

export default class DB {

    protected con: mongodb.Db;
    protected dbName: string;
    protected tblName: string;
    protected table: mongodb.Collection;
    private url: string;
    private pool: mongodb.MongoClient;

    /**
     * Instanciamos la clase. Aquí obtenemos de .env
     * en la variable DB_URL la url de conexión a la BD,
     * si no existe usamos por default "mongodb://localhost:27017"
     */
    constructor() {
        this.url = process.env.DB_URL || "mongodb://localhost:27017";
    }

    /**
     * In this method close the connection
     */
    public Close() {
        this.pool.close();
    }


    /**
     * In this method connect to database and defin the pool conextion, the conection to schema
     * and the access to table.
     */
    protected Connect() {
        this.pool = new mongodb.MongoClient(this.url, {});

        this.pool.connect().then((client: mongodb.MongoClient) => {
            if (this.pool.isConnected()) {
                logs.Log(`Connect to database : ${this.url}`);
            }
            this.con = this.pool.db(this.dbName);
            this.table = this.con.collection(this.tblName);
        });

    }


    /**
     * This generic method execute when whee need get one or more items of entity
     * @param callback Function to execute when finished
     * @param e When exist error this var is declared
     * @param r When the sellect is sussefully this contains data
     */
    protected CallSelect(callback: (Respuesta: any) => any,
        e: mongodb.MongoError, r: mongodb.Collection) {
        const Respuesta: ResponseG = this.GetResponseEmpty();
        if (e) {
            logs.Log(e);
            Respuesta.error.push(e);
        } else {
            Respuesta.item = r;
        }
        callback(Respuesta);
    }


    /**
     * This generic method execute when whee need insert one or more items
     * @param callback Function to execute when finished
     * @param e When exist error this var is declared
     * @param r When the insert is sussefully this contains
     */
    protected CallBackInsert(callback: (Respuesta: ResponseG) => ResponseG,
        e: mongodb.MongoError, r: WriteOpResult) {
        const Respuesta: ResponseG = this.GetResponseEmpty();

        if (e) {
            logs.Log(e);
            Respuesta.error.push(e);
        } else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }


    /**
     * This generic method execute when whee need update one or more items
     * @param callback Function to execute when finished
     * @param e When exist error this var is declared
     * @param r When the insert is sussefully this contains
     */
    protected CallUpdate(callback: (Respuesta: ResponseG) => ResponseG,
        e: mongodb.MongoError, r: WriteOpResult) {
        const Respuesta: ResponseG = this.GetResponseEmpty();

        if (e) {
            logs.Log(e);
            Respuesta.error.push(e);
        } else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }


    /**
     * Create empty ResponseG default
     */
    public GetResponseEmpty(): ResponseG {
        return {
            error: [],
            warning: [],
            info: [],
            item: {}
        };
    }

}
