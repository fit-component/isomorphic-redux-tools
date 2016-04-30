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

    // 不符合约定 promise 规范
    if (!promise) return next(action)

    const REQUEST = type + '_REQUEST'
    const SUCCESS = type + '_SUCCESS'
    const FAILURE = type + '_FAILURE'

    if (typeof promise.then !== 'function') {
        // 符合规范,但不是 promise
        // action:请求成功
        return next(extendRest(rest, {
            type: SUCCESS
        }))
    } else {
        // action:准备发送请求
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
            // action:请求成功
            next(extendRest(rest, {
                data: data, type: SUCCESS
            }))
            return true
        }).catch((error:any) => {
            // action:请求失败
            next(extendRest(rest, {
                error, type: FAILURE
            }))
            console.log('PromiseMiddleware error:', error)
            return false
        })
    }
}