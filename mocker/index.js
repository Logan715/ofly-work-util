const user = require("./user");
const test = require("./test");
const delay = require("mocker-api/lib/delay");

// 是否禁用代理
const noProxy = process.env.NO_PROXY === "true";

const proxy = {
    // Priority processing.
    _proxy: {
        priority: "proxy",
        proxy: {
            "/oflywork/(.*)": "http://127.0.0.1:18080/",
            // "/oflywork/(.*)": "http://127.0.0.1:12345/",
        },
        pathRewrite: {
        },
        changeHost: true
    },
    ...user.default,
    ...test.default
};
module.exports = noProxy ? {} : delay(proxy, 100);
