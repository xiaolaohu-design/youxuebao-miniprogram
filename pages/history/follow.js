"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  __name: "follow",
  setup(__props) {
    const tabs = [
      {
        id: "lecturer",
        label: "讲师"
      },
      {
        id: "course",
        label: "课程"
      },
      {
        id: "courseware",
        label: "课件"
      },
      {
        id: "exampaper",
        label: "试卷"
      }
    ];
    const dataList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(10);
    const totalCount = common_vendor.ref(0);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const token = common_vendor.ref("");
    const activeTab = common_vendor.ref("lecturer");
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
      winnowcourse: "专题课程",
      courseware: "综合课件",
      winnowcourseware: "专题课件",
      exampaper: "综合试卷",
      winnowexampaper: "专题试卷"
    };
    const emptyText = common_vendor.computed(() => {
      const tabMap = {
        lecturer: "暂无关注的讲师",
        course: "暂无关注的课程",
        courseware: "暂无关注的课件",
        exampaper: "暂无关注的试卷"
      };
      return tabMap[activeTab.value] || "暂无记录";
    });
    const emptyDesc = common_vendor.computed(() => {
      const tabMap = {
        lecturer: "快去关注一些优秀的讲师吧~",
        course: "快去关注一些感兴趣的课程吧~",
        courseware: "快去关注一些有用的课件吧~",
        exampaper: "快去关注一些需要的试卷吧~"
      };
      return tabMap[activeTab.value] || "";
    });
    const filteredData = common_vendor.computed(() => {
      if (activeTab.value === "lecturer")
        return dataList.value;
      return dataList.value.filter((item) => VALID_TYPES.includes(item.content_type));
    });
    const isCourseType = (type) => ["videocourse", "audiocourse", "imagecourse", "winnowcourse"].includes(type);
    const getContentTypeName = (type) => {
      return contentTypesNameMap[type] || "";
    };
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
        "word": "/static/image/file/doc.png",
        "pdf": "/static/image/file/pdf.png",
        "ppt": "/static/image/file/ppt.png",
        "pptx": "/static/image/file/ppt.png",
        "xls": "/static/image/file/xls.png",
        "xlsx": "/static/image/file/xls.png",
        "excel": "/static/image/file/xls.png",
        "txt": "/static/image/file/txt.png",
        "text": "/static/image/file/txt.png",
        "zip": "/static/image/file/zip.png",
        "rar": "/static/image/file/zip.png",
        "7z": "/static/image/file/zip.png",
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
    const getResourceTitle = (item) => {
      var _a;
      const title = ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.name) || "未命名资源";
      return title.replace(/<\/?[^>]+(>|$)/g, "");
    };
    const getResourceCover = (item) => {
      var _a;
      return ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.cover) || "/static/image/default-cover.png";
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatFollowTime = (item) => {
      const timeStr = item.follow_time || item.create_time || "";
      if (!timeStr)
        return "";
      const d = parseDate(timeStr);
      if (isNaN(d.getTime()))
        return timeStr;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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
    const fetchData = async (isLoadMore = false) => {
      if (loading.value)
        return;
      if (!shopId.value || !userId.value || !token.value)
        return;
      if (!isLoadMore) {
        currentPage.value = 1;
        dataList.value = [];
        hasMore.value = true;
      }
      loading.value = true;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          page: currentPage.value,
          pageSize: pageSize.value,
          type: activeTab.value,
          contentType: "",
          isLastThreeMonths: false
        };
        const res = await api_index.getUserFollowHistory(formData);
        if (res.status === "success" && res.data) {
          const list = res.data.list || [];
          const total = res.data.total || 0;
          totalCount.value = total;
          if (isLoadMore) {
            dataList.value = [...dataList.value, ...list];
          } else {
            dataList.value = list;
          }
          hasMore.value = dataList.value.length < totalCount.value;
        } else {
          if (!isLoadMore) {
            dataList.value = [];
          }
          hasMore.value = false;
        }
      } catch (error) {
        if (!isLoadMore) {
          dataList.value = [];
        }
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      currentPage.value++;
      fetchData(true);
    };
    const switchTab = (tabId) => {
      activeTab.value = tabId;
      currentPage.value = 1;
      dataList.value = [];
      hasMore.value = true;
      fetchData();
    };
    const handleLecturerClick = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/lecturer/lecturer?id=${item.content_id}`,
        fail: () => common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "none"
        })
      });
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
    const unfollowItem = async (item, type) => {
      const res = await new Promise((resolve) => {
        common_vendor.index.showModal({
          title: "提示",
          content: "确定要取消关注吗？",
          success: (modalRes) => {
            resolve(modalRes.confirm);
          }
        });
      });
      if (!res)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: item.content_id,
          content_type: type
        };
        const response = await api_index.deleteFollowHistory(formData);
        if (response.status === "success") {
          common_vendor.index.showToast({
            title: "取消关注成功",
            icon: "success"
          });
          dataList.value = dataList.value.filter((i) => i.content_id !== item.content_id);
          totalCount.value = Math.max(0, totalCount.value - 1);
        } else {
          common_vendor.index.showToast({
            title: response.message || "取消关注失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "取消关注失败",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      if (!uxfid || !uxfkey || !shopid) {
        checkLoginStatus();
        return;
      }
      fetchData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: activeTab.value === tab.id
          }, activeTab.value === tab.id ? {} : {}, {
            c: tab.id,
            d: activeTab.value === tab.id ? 1 : "",
            e: common_vendor.o(($event) => switchTab(tab.id), tab.id)
          });
        }),
        b: loading.value && dataList.value.length === 0
      }, loading.value && dataList.value.length === 0 ? {} : !loading.value && dataList.value.length === 0 ? {
        d: common_assets._imports_0$1,
        e: common_vendor.t(emptyText.value),
        f: common_vendor.t(emptyDesc.value)
      } : activeTab.value === "lecturer" ? {
        h: common_vendor.f(dataList.value, (item, k0, i0) => {
          var _a, _b, _c, _d, _e;
          return {
            a: ((_a = item.content_info) == null ? void 0 : _a.cover) || "/static/image/my/avatar.png",
            b: common_vendor.t(((_b = item.content_info) == null ? void 0 : _b.name) || "讲师"),
            c: common_vendor.t(((_c = item.content_info) == null ? void 0 : _c.description) || "暂无简介"),
            d: common_vendor.t(((_d = item.content_info) == null ? void 0 : _d.follower_count) || 0),
            e: common_vendor.t(((_e = item.content_info) == null ? void 0 : _e.course_count) || 0),
            f: common_vendor.o(($event) => unfollowItem(item, "lecturer"), item.content_id),
            g: item.content_id,
            h: common_vendor.o(($event) => handleLecturerClick(item), item.content_id)
          };
        })
      } : {
        i: common_vendor.f(filteredData.value, (item, k0, i0) => {
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
            j: common_vendor.t(formatFollowTime(item)),
            k: common_vendor.o(($event) => clickView(item), item.content_id),
            l: common_vendor.o(($event) => unfollowItem(item, activeTab.value), item.content_id)
          }) : common_vendor.e({
            m: getFileIconPath(item),
            n: (_d = item.content_info) == null ? void 0 : _d.winnowstatus
          }, ((_e = item.content_info) == null ? void 0 : _e.winnowstatus) ? {} : {}, {
            o: common_vendor.t(getResourceTitle(item)),
            p: common_vendor.t(((_f = item.content_info) == null ? void 0 : _f.description) || ""),
            q: common_vendor.t(formatFollowTime(item)),
            r: common_vendor.o(($event) => clickView(item), item.content_id),
            s: common_vendor.o(($event) => unfollowItem(item, activeTab.value), item.content_id)
          }), {
            t: item.content_id,
            v: common_vendor.o(($event) => clickView(item), item.content_id)
          });
        })
      }, {
        c: !loading.value && dataList.value.length === 0,
        g: activeTab.value === "lecturer",
        j: loading.value && dataList.value.length > 0
      }, loading.value && dataList.value.length > 0 ? {} : {}, {
        k: !hasMore.value && dataList.value.length > 0
      }, !hasMore.value && dataList.value.length > 0 ? {} : {}, {
        l: common_vendor.o(loadMore, "a8")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8abb3ef4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/history/follow.js.map
