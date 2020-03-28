import { Router, Request, Response } from "express";

import Data from './dUser';
import Model from './mUser';

import { HttpCode } from './../../libs/HttpCode';
import { ResponseString } from './../../libs/ResponseString';
import Auth from './../../libs/Auth';
import { ResponseG } from "./../../bd/configFields";


class User {
    public router: Router;
    constructor() {
        this.router = Router();
        this.router.post("/register", this.Register);
        this.router.post("/login", this.Login);
        this.router.get("/logout", this.Logout);
    }

    /**
     * Method to create a new user.
     * @param req Request
     * @param res Response
     */
    private Register(req: Request, res: Response) {
        // validate data to create a new users
        Data.IsValidInsert(req.body, (response: ResponseG) => {
            if (response.error.length > 0)
                return res.status(HttpCode.INVALID_DATA).send(response);
            const entity: Model = response.item;
            // Check email not exist in db. If Exist is duplicate users
            Data.GetOne({ email: entity.email } as Model, (exist: ResponseG) => {
                if (exist.error.length > 0 || exist.item) {
                    response.error.push(ResponseString.DUPLICATE_USER);
                    delete response.item.hash;
                    delete response.item.salt;
                    return res.status(HttpCode.OK).send(response);
                }
                // Insert a user
                Data.Create(entity, response, (r: ResponseG) => {
                    response.error = r.error;
                    response.warning = r.warning;
                    response.info = r.info;
                    delete response.item.hash;
                    delete response.item.salt;

                    return res.status(HttpCode.OK).send(response);
                });
            });
        });
    }

    /**
     * Method to authenticate user.
     * @param req Request
     * @param res Response
     */
    private Login(req: Request, res: Response) {
        // validate basic data to login user.
        const response: ResponseG = Data.IsValidlogin(req.body);
        if (response.error.length > 0)
            return res.status(HttpCode.INVALID_DATA).send(response);

        Data.GetLogin(response, response.item.email, response.item.password, (r: ResponseG) => {
            if (r.error.length > 0) {
                delete r.item.hash;
                delete r.item.salt;
                return res.status(HttpCode.OK).send(r);
            }
            r.item = Auth.MakeToken(response.item);
            return res.status(HttpCode.OK).send(response);
        });
    }

    /**
     * Method to disconnect user.
     * @param req Request
     * @param res Response
     */
    private Logout(req: Request, res: Response) {
        return res.status(200).send({});
    }

}
export default new User();
