import RequestUtil from "../utils/RequestUtil";
export const testSuccessService = payload => {
    return RequestUtil.post("/api/test/success", payload);
    // return axios.post("/api/test/success", payload).then(res => res.data)
};

export const testFailService = payload => {
    return RequestUtil.get("/api/test/fail", payload);
    // return axios.get("/api/test/fail").then(res => res.data)
};
export const testFail404Service = payload => {
    return RequestUtil.get("/api/test/fail404", payload);
    // return axios.get("/api/test/fail").then(res => res.data)
};
export const testFail403Service = payload => {
    return RequestUtil.get("/api/test/fail403", payload);
    // return axios.get("/api/test/fail").then(res => res.data)
};

export const testFail500Service = payload => {
    return RequestUtil.get("/api/test/fail500", payload);
    // return axios.get("/api/test/fail").then(res => res.data)
};
