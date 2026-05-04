"use strict";
const common_vendor = require("../common/vendor.js");
const config_index = require("../config/index.js");
class StorageManager {
  // 初始化应用设置
  static initAppSettings() {
    common_vendor.index.setStorageSync("shopId", config_index.APP_CONFIG.SHOP_ID);
    common_vendor.index.setStorageSync("appInitTime", Date.now());
  }
  // 获取 shopId
  static getShopId() {
    return common_vendor.index.getStorageSync("shopId") || config_index.APP_CONFIG.SHOP_ID;
  }
  // 检查是否已初始化
  static isInitialized() {
    return !!common_vendor.index.getStorageSync("appInitTime");
  }
}
exports.StorageManager = StorageManager;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/storage.js.map
