"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_storage = require("./utils/storage.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/resource/resource.js";
  "./pages/message/message.js";
  "./pages/my/my.js";
  "./components/course.js";
  "./pages/course/videocourse.js";
  "./pages/course/audiocourse.js";
  "./pages/course/imagecourse.js";
  "./pages/course/specialcourse.js";
  "./components/courseware.js";
  "./pages/courseware/courseware.js";
  "./pages/courseware/specialcourseware.js";
  "./components/exampaper.js";
  "./pages/exampaper/exampaper.js";
  "./pages/exampaper/specialexampaper.js";
  "./pages/exampaper/groupexampaper.js";
  "./pages/practice/practice.js";
  "./pages/practice/practicedetail.js";
  "./pages/practice/titledetail.js";
  "./pages/order/order.js";
  "./pages/setting/setting.js";
  "./pages/news/news.js";
  "./pages/coupon/coupon.js";
  "./pages/exchange/exchange.js";
  "./pages/exchange/exchangelist.js";
  "./pages/history/browse.js";
  "./pages/history/favorite.js";
  "./pages/history/follow.js";
  "./pages/history/download.js";
  "./pages/lecturer/lecturer.js";
  "./pages/about/about.js";
  "./pages/benefits/benefits.js";
  "./pages/login/login.js";
  "./pages/login/register.js";
  "./pages/login/forget.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    utils_storage.StorageManager.initAppSettings();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
