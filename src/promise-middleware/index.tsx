/// <reference path="../../../../../typings-module/process.d.ts" />

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

    // 没有 promise 字段不处理
    if (!promise) return next(action)

    const REQUEST = type + '_REQUEST'
    const SUCCESS = type + '_SUCCESS'
    const FAILURE = type + '_FAILURE'

    if (process.browser) {
        next(extendRest(rest, {
            type: REQUEST
        }))

        return promise.then((req:any) => {
            next(extendRest(rest, {
                data: req.data, type: SUCCESS
            }))
            return true
        }).catch((error:any) => {
            next(extendRest(rest, {
                error, type: FAILURE
            }))
            console.log('FrontEnd PromiseMiddleware Error:', error)
            return false
        })
    } else {
        const result = promise(action.data, action.req)
        if (typeof result.then === 'function') {
            return result.then((data:any) => {
                next(extendRest(rest, {
                    data: data, type: SUCCESS
                }))
                return true
            }).catch((error:any) => {
                next(extendRest(rest, {
                    error, type: FAILURE
                }))
                console.log('ServerEnd PromiseMiddleware Error:', error)
                return false
            })
        } else {
            return next(extendRest(rest, {
                type: SUCCESS,
                data: result
            }))
        }
    }
}