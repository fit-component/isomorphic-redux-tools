// @babel ignore
// 映射 map 表
const services = new Map()
export default services

export const routerDecorator = (url:string, method:string) =>(target:any, key:string, descriptor:any)=> {
    services.set(url, {
        value: descriptor.value,
        method: method
    })
    return descriptor
}

export const initService = (router:any)=> {
    for (let key of services.keys()) {
        const target = services.get(key)
        router[target.method](key, async(req:any, res:any)=> {
            let params:any = {}
            if (target.method === 'get') {
                params = req.query
            } else {
                params = req.body
            }
            const result = await target.value(params, req)
            res.json(result)
        })
    }
}