class Logs {

    public Log = (msg: any) => {
        const nowDate: Date = new Date();
        // tslint:disable-next-line:no-console
        console.log("[" + nowDate.toLocaleString() + "] => ", JSON.stringify(msg));
    }

}
export default new Logs();
