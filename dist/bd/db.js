"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb = __importStar(require("mongodb"));
const logs_1 = __importDefault(require("./../libs/logs"));
class DB {
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
    Close() {
        this.pool.close();
    }
    /**
     * In this method connect to database and defin the pool conextion, the conection to schema
     * and the access to table.
     */
    Connect() {
        this.pool = new mongodb.MongoClient(this.url, {});
        this.pool.connect().then((client) => {
            if (this.pool.isConnected()) {
                logs_1.default.Log(`Connect to database : ${this.url}`);
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
    CallSelect(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
        }
        else {
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
    CallBackInsert(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
        }
        else {
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
    CallUpdate(callback, e, r) {
        const Respuesta = this.GetResponseEmpty();
        if (e) {
            logs_1.default.Log(e);
            Respuesta.error.push(e);
        }
        else {
            Respuesta.item = r.result;
        }
        callback(Respuesta);
    }
    /**
     * Create empty ResponseG default
     */
    GetResponseEmpty() {
        return {
            error: [],
            warning: [],
            info: [],
            item: {}
        };
    }
}
exports.default = DB;
//# sourceMappingURL=db.js.map