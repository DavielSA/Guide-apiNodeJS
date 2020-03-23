"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// used to parse the form data that you pass in the request
const bodyParser = __importStar(require("body-parser"));
// cors is using to resolve CORS
const cors_1 = __importDefault(require("cors"));
// Import file routers
const router_1 = __importDefault(require("./hmvc/router"));
class App {
    /**
     * Constructor of class
     */
    constructor() {
        // run the express instance and store in app.
        this.app = express_1.default();
        this.config();
    }
    /**
     * Method for make configs the http server
     */
    config() {
        // enable cors by addings cors moddleware
        this.app.use(cors_1.default());
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(this.JsonMalFormed);
        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
        let i = 0;
        // add routes
        for (i = 0; i < router_1.default.length; i++) {
            this.app.use("/", router_1.default[i]);
        }
    }
    JsonMalFormed(error, req, res, next) {
        // Catch json error. Cuando envían un json mal formado.
        if (error instanceof SyntaxError) {
            res.status(400).send("JSON malformed");
            return;
        }
        next();
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map