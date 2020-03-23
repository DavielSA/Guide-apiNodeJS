import { Router } from "express";
import { Request, Response } from "express";

import dHome from './dHome';
import mHome from './mHome';
import { ResponseG } from "./../../bd/configFields";

class Home {
    public router: Router;
    constructor() {
        this.router = Router();
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
    private Post(req: Request, res: Response) {
        let entity: mHome;
        entity = req.body;
        if (!entity.message) {
            const response: ResponseG = dHome.GetResponseEmpty();
            response.error.push("Invalid Arguments message");
            return res.status(200).send(response);
        }
        dHome.Create(entity, (r: ResponseG) => {
            return res.status(200).send(r);
        });

    }

    /**
     * Method to update element.
     * @param req Request
     * @param res Response
     */
    private Put(req: Request, res: Response) {
        let entity: mHome;
        entity = req.body;
        if (!entity.message || !entity._id) {
            const response: ResponseG = dHome.GetResponseEmpty();
            response.error.push("Invalid Arguments message");
            return res.status(200).send(response);
        }
        dHome.Update(entity, (r: ResponseG) => {
            return res.status(200).send(r);
        });
    }


    /**
     * Method to get first page or request ajax.
     * @param req Request
     * @param res Response
     */
    private Home(req: Request, res: Response) {
        dHome.Get(undefined, (r: any) => {
            return res.status(200).send(r);
        });
    }

    /**
     * Method to get first page with pretty url
     * @param req Request
     * @param res Response
     */
    private HomeMessage(req: Request, res: Response) {
        const message: string = req.params.message;
        const data: mHome = dHome.DefaultEntity();
        data.message = message;

        if (!message) {
            const r = dHome.GetResponseEmpty();
            r.error.push("Invalid argument");
            return res.status(200).send(r);
        }

        dHome.GetOne(data, (r: any) => {
            return res.status(200).send(r);
        });
    }

}
export default new Home();
