import * as process from 'process'
import * as axios from 'axios'

export interface Option {
    url:string
    method:string
    data?:any
}

export default (basename:string)=>(option:Option)=> {
    if (process.browser) {
        return axios({
            url: basename + option.url,
            method: option.method,
            data: option.data
        })
    } else {

    }
}