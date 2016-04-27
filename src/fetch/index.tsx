import * as process from 'process'
import * as axios from 'axios'

export interface Option {
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
    if (process.browser) {
        return axios.post(basename + option.url, {
            method: option.method,
            data: option.data
        })
    } else {

    }
}