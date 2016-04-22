//import * as yog from 'yog2-kernel'
import * as _ from 'lodash'

// export default async(settings:any) => {
//     var defaults = {
//         headers: {
//             'x_bd_product': yog.log.req.headers.x_bd_product,
//             'x_bd_subsys': yog.log.req.headers.x_bd_subsys,
//             'x_bd_logid': yog.log.req.headers.x_bd_logid,
//             'x_bd_userip': yog.log.req.headers.x_bd_userip,
//             'x_bd_routerip': yog.log.req.headers.x_bd_routerip,
//             'x-forwarded-for': yog.log.req['headers.x-forwarded-for'],
//             'x_bd_idc': yog.log.req.headers.x_bd_idc,
//             'x_bd_dna': yog.log.req.headers.x_bd_dna,
//             'user-agent': yog.log.req.headers['user-agent'],
//             'bfe-atk': yog.log.req.headers['bfe-atk'],
//             'bfe_logid': yog.log.req.headers.bfe_logid,
//             'bfeip': yog.log.req.headers.bfeip
//         }
//     }
//     return await yog.ralP('service', _.defaultsDeep(settings, defaults))
// }
export default (settings:any) => {
    return {}
}