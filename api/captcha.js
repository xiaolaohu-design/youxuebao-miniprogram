"use strict";
const utils_request = require("../utils/request.js");
const fetchCaptchaData = () => utils_request.request.post("/api/captcha");
exports.fetchCaptchaData = fetchCaptchaData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/captcha.js.map
