"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dUser_1 = __importDefault(require("./dUser"));
const HttpCode_1 = require("./../../libs/HttpCode");
const ResponseString_1 = require("./../../libs/ResponseString");
const Auth_1 = __importDefault(require("./../../libs/Auth"));
class User {
    constructor() {
        this.router = express_1.Router();
        this.router.post("/register", this.Register);
        this.router.post("/login", this.Login);
        this.router.get("/logout", this.Logout);
    }
    /**
     * Method to create a new user.
     * @param req Request
     * @param res Response
     */
    Register(req, res) {
        // validate data to create a new users
        dUser_1.default.IsValidInsert(req.body, (response) => {
            if (response.error.length > 0)
                return res.status(HttpCode_1.HttpCode.INVALID_DATA).send(response);
            const entity = response.item;
            // Check email not exist in db. If Exist is duplicate users
            dUser_1.default.GetOne({ email: entity.email }, (exist) => {
                if (exist.error.length > 0 || exist.item) {
                    response.error.push(ResponseString_1.ResponseString.DUPLICATE_USER);
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode_1.HttpCode.OK).send(response);
                }
                // Insert a user
                dUser_1.default.Create(entity, response, (r) => {
                    response.error = r.error;
                    response.warning = r.warning;
                    response.info = r.info;
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode_1.HttpCode.OK).send(response);
                });
            });
        });
    }
    /**
     * Method to authenticate user.
     * @param req Request
     * @param res Response
     */
    Login(req, res) {
        // validate basic data to login user.
        const response = dUser_1.default.IsValidlogin(req.body);
        if (response.error.length > 0)
            return res.status(HttpCode_1.HttpCode.INVALID_DATA).send(response);
        dUser_1.default.GetLogin(response, response.item.email, response.item.password, (r) => {
            if (r.error.length > 0) {
                delete r.item.hash;
                delete r.item.salt;
                return res.status(HttpCode_1.HttpCode.OK).send(r);
            }
            r.item = Auth_1.default.MakeToken(response.item);
            return res.status(HttpCode_1.HttpCode.OK).send(response);
        });
    }
    /**
     * Method to disconnect user.
     * @param req Request
     * @param res Response
     */
    Logout(req, res) {
        return res.status(200).send({});
    }
}
exports.default = new User();
//# sourceMappingURL=ctrl.user.js.map