// this will load app which contains our main structure and logic
import { isNumber } from "util";
import App from "./app";
import Logs from "./libs/logs";
import {Socket} from "./sock";

// const app = new App();

// use this line to get port from environment variable
const PORT: string | number = process.env.PORT && isNumber(process.env.PORT)
    ? Number(process.env.PORT)
    : 9999;
const PORTSOCK: number = process.env.SOCK_PORT && isNumber(process.env.SOCK_PORT)
    ? Number(process.env.SOCK_PORT)
    : 3001;

const socket: Socket = new Socket( PORTSOCK  );

App.app.listen(PORT, () => {
    Logs.Log(`server started at http://localhost:${PORT}`);
});
