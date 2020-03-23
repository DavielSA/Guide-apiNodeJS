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
const ws = __importStar(require("ws"));
const logs_1 = __importDefault(require("./libs/logs"));
class Socket {
    /**
     * Constructor of class
     * @param ports . Port for listen and start service
     */
    constructor(ports) {
        this.port = ports;
        this.sock = new ws.Server({ port: ports }, () => {
            logs_1.default.Log(`WebSocketServer start in: ws://localhost:${context.port}/`);
        });
        this.clients = [];
        const context = this;
        this.sock.on("connection", (sock, req) => context.OnConnect(context, sock, req));
    }
    /**
     * Method for user connect to websocket.
     * @param {Socket} context Context of class
     * @param {ws} socket Socket for manage event client
     * @param {IncomingMessage} req .
     */
    OnConnect(context, socket, req) {
        socket.on("welcome", (message) => {
            logs_1.default.Log("User connected");
            logs_1.default.Log(message);
        });
        socket.on("close", () => {
            context.sock.emit("User disconnected");
            const iFind = context.clients.findIndex((x) => x === socket);
            if (iFind > 0) {
                delete context.clients[iFind];
            }
        });
    }
}
exports.Socket = Socket;
//# sourceMappingURL=sock.js.map