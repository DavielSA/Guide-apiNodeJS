"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dHome_1 = __importDefault(require("./dHome"));
class Home {
    constructor() {
        this.router = express_1.Router();
        this.router.get("/", this.Home);
        this.router.get("/:message", this.HomeMessage);
        this.router.post("/home", this.Post);
        this.router.put("/home", this.Put);
    }
    /**
     * Method to save element.
     * @param req Request
     * @param res Response
     */
    Post(req, res) {
        let entity;
        entity = req.body;
        if (!entity.message) {
            const response = dHome_1.default.GetResponseEmpty();
            response.error.push("Invalid Arguments message");
            return res.status(200).send(response);
        }
        dHome_1.default.Create(entity, (r) => {
            return res.status(200).send(r);
        });
    }
    /**
     * Method to update element.
     * @param req Request
     * @param res Response
     */
    Put(req, res) {
        let entity;
        entity = req.body;
        if (!entity.message || !entity._id) {
            const response = dHome_1.default.GetResponseEmpty();
            response.error.push("Invalid Arguments message");
            return res.status(200).send(response);
        }
        dHome_1.default.Update(entity, (r) => {
            return res.status(200).send(r);
        });
    }
    /**
     * Method to get first page or request ajax.
     * @param req Request
     * @param res Response
     */
    Home(req, res) {
        dHome_1.default.Get(undefined, (r) => {
            return res.status(200).send(r);
        });
    }
    /**
     * Method to get first page with pretty url
     * @param req Request
     * @param res Response
     */
    HomeMessage(req, res) {
        const message = req.params.message;
        const data = dHome_1.default.DefaultEntity();
        data.message = message;
        if (!message) {
            const r = dHome_1.default.GetResponseEmpty();
            r.error.push("Invalid argument");
            return res.status(200).send(r);
        }
        dHome_1.default.GetOne(data, (r) => {
            return res.status(200).send(r);
        });
    }
}
exports.default = new Home();
//# sourceMappingURL=ctrl.home.js.map