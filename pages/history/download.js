"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const maxPageSize = 100;
const _sfc_main = {
  __name: "download",
  setup(__props) {
    const dataList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPageSize = common_vendor.ref(10);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const VALID_TYPES = [
      "videocourse",
      "audiocourse",
      "imagecourse",
      "winnowcourse",
      "courseware",
      "winnowcourseware",
      "exampaper",
      "winnowexampaper"
    ];
    const contentTypesNameMap = {
      videocourse: "视频课程",
      audiocourse: "音频课程",
      imagecourse: "图文课程",
      winnowcourse: "精选课程",
      courseware: "综合课件",
      winnowcourseware: "专题课件",
      exampaper: "综合试卷",
      winnowexampaper: "专题试卷"
    };
    const filteredData = common_vendor.computed(() => dataList.value.filter((item) => VALID_TYPES.includes(item.content_type)));
    const isCourseType = (type) => ["videocourse", "audiocourse", "imagecourse", "winnowcourse"].includes(type);
    const getContentTypeName = (type) => contentTypesNameMap[type] || "";
    const getTypeBadgeClass = (type) => {
      if (["videocourse", "audiocourse", "imagecourse", "winnowcourse"].includes(type))
        return "badge-course";
      if (["courseware", "winnowcourseware"].includes(type))
        return "badge-courseware";
      if (["exampaper", "winnowexampaper"].includes(type))
        return "badge-exam";
      return "badge-default";
    };
    const getFileIconPath = (item) => {
      var _a;
      const fileExt = (((_a = item.content_info) == null ? void 0 : _a.type) || item.content_type || "").toLowerCase();
      const iconMap = {
        "doc": "/static/image/file/doc.png",
        "docx": "/static/image/file/doc.png",
        "pdf": "/static/image/file/pdf.png",
        "ppt": "/static/image/file/ppt.png",
        "pptx": "/static/image/file/ppt.png",
        "xls": "/static/image/file/xls.png",
        "xlsx": "/static/image/file/xls.png",
        "txt": "/static/image/file/txt.png",
        "zip": "/static/image/file/zip.png",
        "rar": "/static/image/file/zip.png",
        "courseware": "/static/image/file/file.png",
        "winnowcourseware": "/static/image/file/file.png",
        "exampaper": "/static/image/file/file.png",
        "winnowexampaper": "/static/image/file/file.png"
      };
      return iconMap[fileExt] || "/static/image/file/file.png";
    };
    const getTags = (item) => {
      var _a, _b;
      const tags = ((_a = item.content_info) == null ? void 0 : _a.tags) || ((_b = item.content_info) == null ? void 0 : _b.labels) || [];
      return Array.isArray(tags) ? tags : [];
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatBrowseTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = parseDate(timeStr);
      if (isNaN(date.getTime()))
        return timeStr;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    const formatNumber = (n) => {
      if (!n)
        return "0";
      return n >= 1e4 ? (n / 1e4).toFixed(1) + "w" : n + "";
    };
    const getResourceTitle = (item) => {
      var _a;
      return ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.name) || "未命名资源";
    };
    const getResourceCover = (item) => {
      var _a;
      return ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.cover) || "/static/image/default-cover.png";
    };
    const checkLoginStatus = () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      if (!uxfid || !uxfkey || !shopid) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }, 100);
        return false;
      }
      return true;
    };
    const loadData = async (isLoadMore = false) => {
      if (loading.value || !hasMore.value && isLoadMore)
        return;
      if (!isLoadMore) {
        currentPageSize.value = 10;
        dataList.value = [];
        hasMore.value = true;
      }
      loading.value = true;
      try {
        const res = await api_index.getUserDownloadHistory({
          UXMID: shopId.value,
          user_id: userId.value,
          page: 1,
          pageSize: currentPageSize.value,
          isLastThreeMonths: true
        });
        if (res.status === "success") {
          const newData = res.data.list || [];
          const totalCount = res.data.total || 0;
          dataList.value = newData;
          if (newData.length < currentPageSize.value || currentPageSize.value >= maxPageSize || currentPageSize.value >= totalCount) {
            hasMore.value = false;
          } else {
            hasMore.value = true;
          }
        } else {
          hasMore.value = false;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      if (currentPageSize.value < maxPageSize) {
        currentPageSize.value += 10;
        loadData(true);
      } else {
        hasMore.value = false;
      }
    };
    const clickView = (item) => {
      const type = item.content_type;
      const id = item.content_id;
      const courseRouteMap = {
        "videocourse": "/pages/course/videocourse",
        "audiocourse": "/pages/course/audiocourse",
        "imagecourse": "/pages/course/imagecourse",
        "winnowcourse": "/pages/course/specialcourse"
      };
      const coursewareRouteMap = {
        "courseware": "/pages/courseware/courseware",
        "winnowcourseware": "/pages/courseware/specialcourseware"
      };
      const exampaperRouteMap = {
        "exampaper": "/pages/exampaper/exampaper",
        "winnowexampaper": "/pages/exampaper/specialexampaper"
      };
      let url = "";
      if (courseRouteMap[type])
        url = `${courseRouteMap[type]}?id=${id}`;
      else if (coursewareRouteMap[type])
        url = `${coursewareRouteMap[type]}?id=${id}`;
      else if (exampaperRouteMap[type])
        url = `${exampaperRouteMap[type]}?id=${id}`;
      if (url) {
        common_vendor.index.navigateTo({
          url,
          fail: () => common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          })
        });
      } else {
        common_vendor.index.showToast({
          title: "查看详情",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      shopId.value = shopid || "";
      userId.value = uxfkey || "";
      if (!uxfid || !uxfkey || !shopid) {
        checkLoginStatus();
        return;
      }
      loadData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value && filteredData.value.length === 0
      }, loading.value && filteredData.value.length === 0 ? {} : !loading.value && filteredData.value.length === 0 ? {
        c: common_assets._imports_0$1
      } : {
        d: common_vendor.f(filteredData.value, (item, k0, i0) => {
          var _a, _b, _c, _d, _e, _f;
          return common_vendor.e({
            a: isCourseType(item.content_type)
          }, isCourseType(item.content_type) ? common_vendor.e({
            b: getResourceCover(item),
            c: common_vendor.t(getContentTypeName(item.content_type)),
            d: common_vendor.n(getTypeBadgeClass(item.content_type)),
            e: (_a = item.content_info) == null ? void 0 : _a.winnowstatus
          }, ((_b = item.content_info) == null ? void 0 : _b.winnowstatus) ? {} : {}, {
            f: common_vendor.t(getResourceTitle(item)),
            g: common_vendor.t(((_c = item.content_info) == null ? void 0 : _c.description) || ""),
            h: getTags(item).length > 0
          }, getTags(item).length > 0 ? {
            i: common_vendor.f(getTags(item).slice(0, 2), (tag, i, i1) => {
              return {
                a: common_vendor.t(tag),
                b: i
              };
            })
          } : {}, {
            j: common_vendor.t(formatBrowseTime(item.download_time))
          }) : common_vendor.e({
            k: getFileIconPath(item),
            l: (_d = item.content_info) == null ? void 0 : _d.winnowstatus
          }, ((_e = item.content_info) == null ? void 0 : _e.winnowstatus) ? {} : {}, {
            m: common_vendor.t(getResourceTitle(item)),
            n: common_vendor.t(((_f = item.content_info) == null ? void 0 : _f.description) || ""),
            o: common_vendor.t(formatBrowseTime(item.download_time)),
            p: "4eb22564-0-" + i0,
            q: common_vendor.p({
              type: "download",
              size: "12",
              color: "#bbb"
            }),
            r: common_vendor.t(formatNumber(item.downloadCount || 0))
          }), {
            s: item.id,
            t: common_vendor.o(($event) => clickView(item), item.id)
          });
        })
      }, {
        b: !loading.value && filteredData.value.length === 0,
        e: loading.value && filteredData.value.length > 0
      }, loading.value && filteredData.value.length > 0 ? {} : {}, {
        f: !hasMore.value && filteredData.value.length > 0
      }, !hasMore.value && filteredData.value.length > 0 ? {} : {}, {
        g: common_vendor.o(loadMore, "a8")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4eb22564"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/download.js.map
