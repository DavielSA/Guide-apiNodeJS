import bcryptjs from "bcryptjs";
import { Request, Response } from "express";
import jsonwebtoken, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import Logs from "./../libs/logs";
import AuthToken, { Token } from "./../bd/auth_token";

class Auth {
    public privateKey: string;
    constructor() {
        this.privateKey = process.env.PRIVATEKEY || "cHJpdmF0ZWtleQ==";
    }

    /**
     * This method generate salt and hash.
     * When detect error return true, error
     * When its true return false, salt,hash
     * @param password pass user
     * @param callback function or element callback to respond
     */
    public GetHash(password: string, callback: (e: boolean, r: AuthEntity | any) => void) {
        bcryptjs.genSalt(10, (err: any, salt: string) => {
            if (err) {
                Logs.Log(err);
                return callback(true, err);
            }
            bcryptjs.hash(password, salt, (er: any, result: string) => {
                if (er) {
                    Logs.Log(er);
                    return callback(true, er);
                }
                callback(false, { salt, hash: result });
            });
        });
    }

    /**
     * This method generate hash for password and salt.
     * When detect error return true, error
     * When its true return false, salt,hash
     * @param password pass user
     * @param callback function or element callback to respond
     */
    public VerifyHash(password: string, salt: string, callback: (e: boolean, r: string) => void) {
        bcryptjs.hash(password, salt, (err: any, result: string) => {
            if (err) {
                Logs.Log(err);
                return callback(true, undefined);
            }
            callback(false, result);
        });

    }

    /**
     * Make token with entity user using private key defined in .env PRIVATEKEY
     * @param mUser Entity of user
     */
    public MakeToken(mUser: any): Token {
        try {
            const timeToExpires: number = (86400 * 1825); // 86400 = 24hours | 1825 = 5 Years |  Expires in 5 Years
            const tokenRenewWal: string = jsonwebtoken.sign(mUser, this.privateKey, {
                expiresIn: timeToExpires * 2 // Expires in 10 Years
            });
            const tokenString: string = jsonwebtoken.sign(mUser, this.privateKey, {
                expiresIn: timeToExpires // expires in 24 hours
            });
            const dToken = AuthToken;
            const TokenexpiresIn = new Date();
            const TokenrenewalexpiresIn = TokenexpiresIn;
            TokenexpiresIn.setHours(24);
            TokenrenewalexpiresIn.setHours(48);
            const item: Token = {
                user: mUser._id,
                token: tokenString,
                token_expiresIn: TokenexpiresIn,
                tokenrenewal: tokenRenewWal,
                tokenrenewal_expiresIn: TokenrenewalexpiresIn,
                role: mUser.role,
                fcreated: (new Date())
            };
            dToken.Save(item);
            return item;
        } catch (e) {
            Logs.Log(e);
            return undefined;
        }
    }

    /**
     * Verify the headers contains autorization code and this value is a valid token
     * @param req Request express
     * @param res Respose express
     * @param next function to continue or not
     */
    public Verify(req: Request, res: Response, next: any) {
        const token: string = req.headers.authorization;
        const privateKey: string = process.env.PRIVATEKEY || "cHJpdmF0ZWtleQ==";
        if (!token) {
            return res.status(401).send({});
        }
        jsonwebtoken.verify(token, privateKey, (err: JsonWebTokenError, decoded: any) => {
            if (err) {
                Logs.Log(err);
                return res.status(401).send({});
            }
            req.body._user_ = decoded;
            next();
        });
    }

    /**
     * Method to validate token for WebSocket.
     * @param token {string}. String contains JsonWebToken
     */
    public VerifySocket(token: string) {
        const privateKey: string = process.env.PRIVATEKEY || "cHJpdmF0ZWtleQ==";
        jsonwebtoken.verify(token, privateKey, (err: JsonWebTokenError, decoded: any) => {
            if (err) {
                Logs.Log(err);
                return false;
            }
            return true;
        });
    }
}

export default new Auth();

export interface AuthEntity {
    salt: string;
    hash: string;
}
