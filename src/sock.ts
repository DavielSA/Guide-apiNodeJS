import { IncomingMessage } from "http";
import * as ws from "ws";
import logs from "./libs/logs";

export class Socket {

    public sock: ws.Server;
    private port: number;
    private clients: ws[];

    /**
     * Constructor of class
     * @param ports . Port for listen and start service
     */
    constructor(ports: number) {
        this.port = ports;
        this.sock = new ws.Server({ port: ports }, () => {
            logs.Log(`WebSocketServer start in: ws://localhost:${context.port}/`);
        });
        this.clients = [];
        const context = this;

        this.sock.on("connection",
            (sock: ws, req: IncomingMessage) => context.OnConnect(context, sock, req)
        );
    }

    /**
     * Method for user connect to websocket.
     * @param {Socket} context Context of class
     * @param {ws} socket Socket for manage event client
     * @param {IncomingMessage} req .
     */
    private OnConnect(context: Socket, socket: ws, req: IncomingMessage):void {
        socket.on("welcome", (message: any) => {
            logs.Log("User connected");
            logs.Log(message);
        });
        socket.on("close", () => {
            context.sock.emit("User disconnected");
            const iFind = context.clients.findIndex((x) => x === socket);
            if (iFind > 0) { delete context.clients[iFind]; }
        });
    }

}
