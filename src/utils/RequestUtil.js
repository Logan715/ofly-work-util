import axios from "axios";
import { EventEmitter } from "events";

const emitter = new EventEmitter();

const codeMessage = {
    400: "发出的请求有错误，服务器没有进行新建或修改数据,的操作。",
    401: "用户没有权限（令牌、用户名、密码错误）。",
    403: "用户得到授权，但是访问是被禁止的。",
    404: "发出的请求针对的是不存在的记录，服务器没有进行操作",
    406: "请求的格式不可得。",
    410: "请求的资源被永久删除，且不会再得到的。",
    422: "当创建一个对象时，发生一个验证错误。",
    500: "服务器发生错误，请检查服务器",
    502: "网关错误",
    503: "服务不可用，服务器暂时过载或维护",
    504: "网关超时"
};

const defaultConfig = {
    timeout: 10000,
    withCredentials: false
};
export const post = (url, params, config = {}) => {
    return axios
        .post(url, params, { ...defaultConfig, ...config })
        .then(res => res.data)
        .catch(errorCatch);
};

export const get = (url, params, config = {}) => {
    return axios
        .get(url, params, { ...defaultConfig, ...config })
        .then(res => res.data)
        .catch(errorCatch);
};

const errorCatch = error => {
    const { response } = error;
    const { status, statusText } = response;
    httpStatusErrorEmitter(response);
    return {
        code: -1,
        note: Object.keys(codeMessage)
            .map(code => parseInt(code))
            .includes(status)
            ? codeMessage[status]
            : statusText
    };
};
export const httpStatusErrorListener = func => {
    emitter.addListener("httpError", func);
};

const httpStatusErrorEmitter = response => {
    emitter.emit("httpError", response);
};
export default {
    post,
    get,
    httpStatusErrorListener
};
