"use strict";
require("../common/vendor.js");
const utils_request = require("../utils/request.js");
const fetchLoginaccount = (formData) => utils_request.request.post("/api/front/getloginaccount", formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const sendSmsAuthCode = (formData) => utils_request.request.post(`/api/front/sendsmsauthcode`, formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const loginWithSmsCaptcha = (formData) => utils_request.request.post(`/api/front/loginwithsmscaptcha`, formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const registerAccount = (formData) => utils_request.request.post("/api/front/register", formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const loginByWechat = (formData) => utils_request.request.post(`/api/front/wechatlogin`, formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const resetPassword = (formData) => utils_request.request.post("/api/front/resetpassword", formData, {
  headers: {
    "Content-Type": "application/json"
  }
});
const getPublishedAgreements = (UXMID) => utils_request.request.post(`/api/front/agreement/list`, {
  UXMID
}, {
  headers: {
    "Content-Type": "application/json"
  }
});
exports.fetchLoginaccount = fetchLoginaccount;
exports.getPublishedAgreements = getPublishedAgreements;
exports.loginByWechat = loginByWechat;
exports.loginWithSmsCaptcha = loginWithSmsCaptcha;
exports.registerAccount = registerAccount;
exports.resetPassword = resetPassword;
exports.sendSmsAuthCode = sendSmsAuthCode;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/login.js.map
