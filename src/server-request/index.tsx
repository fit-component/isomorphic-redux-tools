export default class ServerRequestHelper {
    private actions:any = []
    private service:any

    constructor(service:any) {
        this.service = service
    }

    // 只在后端执行
    public Request = (option, type) => {
        console.log(option.url, this.service.get(option.url))
        let action = {
            type: type,
            promise: this.service.get(option.url)
        }
        this.actions.push(action)
    }

    public getActions():any {
        return this.actions
    }
}