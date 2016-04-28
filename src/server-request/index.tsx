export default class ServerRequestHelper {
    private actions:any = []
    private service:any

    constructor(service) {
        this.service = service
    }

    // 只在后端执行
    public Request = (option, type) => {
        let action = {
            type: type,
            promise: this.service.getService(option.url)
        }
        this.actions.push(action)
    }

    public getActions():any {
        return this.actions
    }
}