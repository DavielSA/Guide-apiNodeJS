import express from "express";
// used to parse the form data that you pass in the request
import * as bodyParser from "body-parser";
// cors is using to resolve CORS
import cors from "cors";

// Import file routers
import routes from "./hmvc/router";

class App {
    public app: express.Application;

    /**
     * Constructor of class
     */
    constructor() {
        // run the express instance and store in app.
        this.app = express();
        this.config();
    }

    /**
     * Method for make configs the http server
     */
    private config(): void {
        // enable cors by addings cors moddleware
        this.app.use(cors());
        // support application/json type post data
        this.app.use(bodyParser.json());
        this.app.use(this.JsonMalFormed);


        // support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}));

        let i: number = 0;
        // add routes
        for (i = 0; i < routes.length; i++) {
            this.app.use("/", routes[i]);
        }

    }

    private JsonMalFormed(error: any, req: any, res: any, next: any): void {
        // Catch json error. Cuando envían un json mal formado.
        if (error instanceof SyntaxError) {
            res.status(400).send("JSON malformed");
            return;
        }
        next();
    }

}

export default new App();