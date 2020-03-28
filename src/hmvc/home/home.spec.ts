import request from 'request';

const URLS: any = {
    "GET": "http://localhost:9999/",
};
const EmptyMessage:any = {
    "error": [],
    "warning": [],
    "info": [],
    "item": {}
};

describe("ctrl.home", () => {

    const RequestAction = async (url: string, config: any) => {
        return await (new Promise((resolve) => {
            request(url, config, (error: any, response: request.Response, body: any) => resolve({ error: error, response: response, body: body }));
        }));
    }

    it("should return 200", () => {
        return RequestAction(URLS.GET, {}).then((data:any) => {
            const result:boolean =!data.error && data.response && data.response.statusCode !== 200;
            expect(result).toBeFalsy();
        });
    });

    it("show return 200 with not errors", () => {
        return RequestAction(URLS.GET,{}).then((data:any)=> {
            const result:boolean = !data.error && data.response && data.response.statusCode === 200;
            const oData:any = result && data.body ? JSON.parse(data.body) : EmptyMessage;
            const err:boolean = data.error && data.error.length > 0;
            const warn:boolean = data.warning && data.warning.length > 0;
            const info:boolean = data.info && data.info.length > 0;
            const defaultData:boolean = oData === EmptyMessage;
            
            expect(err || warn || info || defaultData).toBeFalsy();
            
        });
    });

    
});

