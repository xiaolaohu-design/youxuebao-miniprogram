"use strict";
const common_vendor = require("../common/vendor.js");
const config_index = require("../config/index.js");
class Request {
  request(options) {
    options.url = config_index.APP_CONFIG.API_BASE_URL + options.url;
    const UXFID = common_vendor.index.getStorageSync("UXFID");
    if (UXFID) {
      options.header = {
        ...options.header,
        "Authorization": `Bearer ${UXFID}`,
        "Content-Type": "application/json"
      };
    }
    return new Promise((resolve, reject) => {
      common_vendor.index.request({
        ...options,
        timeout: config_index.APP_CONFIG.REQUEST_TIMEOUT,
        success: (res) => {
          this.handleResponse(res, resolve, reject);
        },
        fail: (err) => {
          this.handleError(err, reject);
        }
      });
    });
  }
  // 处理响应
  handleResponse(res, resolve, reject) {
    const {
      statusCode,
      data
    } = res;
    if (statusCode >= 200 && statusCode < 300) {
      if (data.status === "success" || data.code === 200 || data.code === 0) {
        resolve(data);
      } else {
        this.showError(data.message || "操作失败");
        reject(data);
      }
    } else if (statusCode === 401) {
      common_vendor.index.removeStorageSync("UXFID");
      common_vendor.index.removeStorageSync("UXFKEY");
      this.showError("登录已失效，请重新登录");
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }, 1500);
      reject(res);
    } else {
      this.handleHttpError(statusCode, data);
      reject(res);
    }
  }
  // 处理 HTTP 错误
  handleHttpError(statusCode, data) {
    const errorMessages = {
      400: "请求参数错误",
      403: "没有操作权限",
      404: "请求的资源不存在",
      422: "数据验证失败",
      500: "服务器内部错误",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时"
    };
    const message = (data == null ? void 0 : data.message) || errorMessages[statusCode] || `请求失败(${statusCode})`;
    this.showError(message);
  }
  // 处理网络错误
  handleError(err, reject) {
    this.showError("网络连接失败，请检查网络");
    reject(err);
  }
  // 显示错误提示
  showError(message) {
    common_vendor.index.showToast({
      title: message,
      icon: "none",
      duration: 2e3
    });
  }
  get(url, data, config = {}) {
    return this.request({
      url,
      method: "GET",
      data,
      ...config
    });
  }
  post(url, data, config = {}) {
    return this.request({
      url,
      method: "POST",
      data,
      ...config
    });
  }
}
const request = new Request();
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
