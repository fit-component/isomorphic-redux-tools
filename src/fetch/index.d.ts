import * as axios from 'axios';
export interface Option {
    url: string;
    method: string;
    data?: any;
    service?: string;
}
declare var _default: (basename: string) => (option: Option) => axios.Promise;
export default _default;
