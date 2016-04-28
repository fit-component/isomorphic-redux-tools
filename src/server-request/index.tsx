export default class ServerRequestHelper {
    private actions:any = []
    private service:any

    constructor(service:any) {
        this.service = service
    }

    // 只在后端执行
    public Request = (option, type) => {
        console.log(this.service.get(option.url).value)
        let action = {
            type: type,
            promise: this.service.get(option.url).value
        }
        this.actions.push(action)
    }

    public getActions():any {
        return this.actions
    }
}