export default class ServerRequestHelper {
    private actions = []

    public Request = (option, type) => {
        // option.url
        console.log('request', option.url, type)
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