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

export const setBasename = (name)=> {
    basename = name
}

export const setServerRender = (render)=> {
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
            // promise = Fetch.ServerRender({
            //     url: basename + option.url,
            //     data: option.data,
            //     service: option.service
            // }, action)
        }
    }
    return {
        type: option.type,
        promise: promise
    }
}