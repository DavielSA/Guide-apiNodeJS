"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logs_1 = __importDefault(require("./../libs/logs"));
const auth_token_1 = __importDefault(require("./../bd/auth_token"));
class Auth {
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
    GetHash(password, callback) {
        bcryptjs_1.default.genSalt(10, (err, salt) => {
            if (err) {
                logs_1.default.Log(err);
                return callback(true, err);
            }
            bcryptjs_1.default.hash(password, salt, (er, result) => {
                if (er) {
                    logs_1.default.Log(er);
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
    VerifyHash(password, salt, callback) {
        bcryptjs_1.default.hash(password, salt, (err, result) => {
            if (err) {
                logs_1.default.Log(err);
                return callback(true, undefined);
            }
            callback(false, result);
        });
    }
    /**
     * Make token with entity user using private key defined in .env PRIVATEKEY
     * @param mUser Entity of user
     */
    MakeToken(mUser) {
        try {
            const timeToExpires = (86400 * 1825); // 86400 = 24hours | 1825 = 5 Years |  Expires in 5 Years
            const tokenRenewWal = jsonwebtoken_1.default.sign(mUser, this.privateKey, {
                expiresIn: timeToExpires * 2 // Expires in 10 Years
            });
            const tokenString = jsonwebtoken_1.default.sign(mUser, this.privateKey, {
                expiresIn: timeToExpires // expires in 24 hours
            });
            const dToken = auth_token_1.default;
            const TokenexpiresIn = new Date();
            const TokenrenewalexpiresIn = TokenexpiresIn;
            TokenexpiresIn.setHours(24);
            TokenrenewalexpiresIn.setHours(48);
            const item = {
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
        }
        catch (e) {
            logs_1.default.Log(e);
            return undefined;
        }
    }
    /**
     * Verify the headers contains autorization code and this value is a valid token
     * @param req Request express
     * @param res Respose express
     * @param next function to continue or not
     */
    Verify(req, res, next) {
        const token = req.headers.authorization;
        const privateKey = process.env.PRIVATEKEY || "cHJpdmF0ZWtleQ==";
        if (!token) {
            return res.status(401).send({});
        }
        jsonwebtoken_1.default.verify(token, privateKey, (err, decoded) => {
            if (err) {
                logs_1.default.Log(err);
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
    VerifySocket(token) {
        const privateKey = process.env.PRIVATEKEY || "cHJpdmF0ZWtleQ==";
        jsonwebtoken_1.default.verify(token, privateKey, (err, decoded) => {
            if (err) {
                logs_1.default.Log(err);
                return false;
            }
            return true;
        });
    }
}
exports.default = new Auth();
//# sourceMappingURL=Auth.js.map