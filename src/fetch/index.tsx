import * as process from 'process'
import * as axios from 'axios'

let basename:string = ''

export interface Option {
    url:string
    method:string
    data?:any
}

export const setBasename = (basename:string)=> {
    basename = basename
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