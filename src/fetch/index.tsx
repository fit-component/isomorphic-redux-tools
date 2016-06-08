/// <reference path="../../../../../typings-module/process.d.ts" />

import * as process from 'process'
import * as axios from 'axios'
import * as _ from 'lodash'

export interface Option {
    type: string
    url?: string
    method: string
    data?: any
    params?: any
    service?: string
}

let basename: string = ''
let serverRender: Function = null

export const setBasename = (name: string)=> {
    basename = name
}

export const setServerRender = (render: any)=> {
    serverRender = render
}

export default (option: Option)=> {
    // 如果不设置 url 参数,默认使用 action 作为 url 地址
    if (!option.url) {
        option.url = option.type
    }

    let promise: any = null
    if (process.browser) {
        promise = axios({
            url: basename + option.url,
            method: option.method,
            params: option.params,
            data: option.data
        })
    } else {
        if (serverRender) {
            // 服务端接收参数是 params 和 data 的聚合
            promise = serverRender({
                url: option.url,
                data: _.assign(option.params || {}, option.data || {})
            }, option.type)
        }
    }
    return {
        type: option.type,
        promise: promise
    }
}