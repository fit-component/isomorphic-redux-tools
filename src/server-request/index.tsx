export default class ServerRequestHelper {
    private actions = []

    public Request = (option, type) => {
        // option.originUrl
        let action = {
            type: type,
            promise: null
        }
        this.actions.push(action)
    }

    public getActions():any {
        return this.actions
    }
}