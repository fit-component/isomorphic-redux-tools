import * as process from 'process'

const getRest:any = (action:any) => {
    let rest:any = {}
    let restKeys:any = Object.keys(action).filter((key:string) => {
        return key !== 'promise' && key !== 'type'
    })
    restKeys.forEach((key:string) => {
        rest[key] = action[key]
    })
    return rest
}

const extendRest:any = (rest:any, extend:any) => {
    let all:any = rest
    Object.keys(extend).forEach((extendkey:string) => {
        all[extendkey] = extend[extendkey]
    })
    return all
}

export default (store:any) => (next:any) => (action:any) => {
    const {promise, type} = action
    const rest:any = getRest(action)

    if (!promise) return next(action)

    const REQUEST = type + '_REQUEST'
    const SUCCESS = type + '_SUCCESS'
    const FAILURE = type + '_FAILURE'

    next(extendRest(rest, {
        type: REQUEST
    }))

    return promise.then((req:any) => {
        let data = {}
        if (process.browser) {
            data = req.data
        } else {
            data = req
        }
        next(extendRest(rest, {
            data: data, type: SUCCESS
        }))
        return true
    }).catch((error:any) => {
        next(extendRest(rest, {
            error, type: FAILURE
        }))
        console.log('PromiseMiddleware error:', error)
        return false
    })
}