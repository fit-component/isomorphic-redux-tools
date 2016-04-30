export default class ServerRequestHelper {
    private actions:any = []
    private service:any
    private req:any

    constructor(service:any, req:any) {
        this.service = service
        this.req = req
    }

    // 只在后端执行
    public Request = (option:any, type:string) => {
        let action = {
            type: type,
            data: option.data,
            req: this.req,
            promise: this.service.get(option.url).value
        }
        this.actions.push(action)
    }

    public getActions():any {
        return this.actions
    }
}