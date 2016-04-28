import * as process from 'process'
import * as axios from 'axios'

export interface Option {
    type:string
    url:string
    method:string
    data?:any
    service?:string
}

let basename:string = ''
let serverRender:Function = null

export const setBasename = (name:string)=> {
    basename = name
}

export const setServerRender = (render:any)=> {
    serverRender = render
}

export default (option:Option)=> {
    let promise:any = null
    if (process.browser) {
        promise = axios({
            url: basename + option.url,
            method: option.method,
            data: option.data
        })
    } else {
        if (serverRender) {
            promise = serverRender({
                url: option.url,
                data: option.data
            }, option.type)
        }
    }
    return {
        type: option.type,
        promise: promise
    }
}