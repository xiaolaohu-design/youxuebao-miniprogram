"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
const pageIncrement = 20;
const _sfc_main = {
  __name: "lecturer",
  setup(__props) {
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
    const tabDefinitions = [
      {
        key: "videocourse",
        label: "视频课程"
      },
      {
        key: "audiocourse",
        label: "音频课程"
      },
      {
        key: "imagecourse",
        label: "图文课程"
      },
      {
        key: "winnowcourse",
        label: "专题课程"
      },
      {
        key: "courseware",
        label: "综合课件"
      },
      {
        key: "winnowcourseware",
        label: "专题课件"
      },
      {
        key: "exampaper",
        label: "综合试卷"
      },
      {
        key: "winnowexampaper",
        label: "专题试卷"
      }
    ];
    const loading = common_vendor.ref(true);
    const contentLoading = common_vendor.ref(false);
    const isFollowing = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const lecturerInfo = common_vendor.ref({
      name: "",
      photo_path: "",
      description: "",
      follower_count: 0,
      major_labels: []
    });
    const contentCounts = common_vendor.ref({
      total: 0,
      videocourse: 0,
      audiocourse: 0,
      imagecourse: 0,
      winnowcourse: 0,
      courseware: 0,
      winnowcourseware: 0,
      exampaper: 0,
      winnowexampaper: 0
    });
    const contentList = common_vendor.ref([]);
    const activeTab = common_vendor.ref("videocourse");
    const currentPageSize = common_vendor.ref(20);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const token = common_vendor.ref("");
    const lecturerId = common_vendor.ref("");
    const isCourseType = (type) => {
      return ["videocourse", "audiocourse", "imagecourse", "winnowcourse"].includes(type);
    };
    const getContentTypeName = (type) => {
      return contentTypesNameMap[type] || type;
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
      const fileExt = (item.type || ((_a = item.content_info) == null ? void 0 : _a.type) || item.content_type || "").toLowerCase();
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
        "courseware": "/static/image/file/courseware.png",
        "winnowcourseware": "/static/image/file/courseware.png",
        "exampaper": "/static/image/file/exam.png",
        "winnowexampaper": "/static/image/file/exam.png"
      };
      return iconMap[fileExt] || "/static/image/file/file.png";
    };
    const getContentTitle = (item) => {
      var _a;
      const title = item.name || ((_a = item.content_info) == null ? void 0 : _a.name) || "未命名";
      return title.replace(/<\/?[^>]+(>|$)/g, "");
    };
    const getPriceText = (item) => {
      const salesMode = item.sales_mode;
      if (salesMode === "1" || salesMode == 1)
        return "免费";
      if (salesMode === "2" || salesMode == 2)
        return "会员免费";
      if (salesMode === "3" || salesMode == 3) {
        const price = item.price || 0;
        return price > 0 ? `¥${price}` : "免费";
      }
      return "免费";
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
    const fetchFollowStatus = async () => {
      var _a;
      if (!token.value || !userId.value || !shopId.value || !lecturerId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: lecturerId.value,
          type: "lecturer"
        };
        const response = await api_index.getFollowRecord(formData);
        if (response.status === "success") {
          isFollowing.value = ((_a = response.data) == null ? void 0 : _a.is_following) || false;
        }
      } catch (error) {
      }
    };
    const fetchInitialData = async () => {
      if (!shopId.value || !lecturerId.value)
        return;
      loading.value = true;
      try {
        const formData = {
          UXMID: shopId.value,
          lecturerid: lecturerId.value,
          content_type: activeTab.value,
          page: 1,
          page_size: currentPageSize.value
        };
        const response = await api_index.getLecturerDetail(formData);
        if (response.status === "success" && response.data) {
          const lecturer = response.data.lecturer || {};
          lecturerInfo.value = {
            name: lecturer.name || "",
            photo_path: lecturer.photo_path || "",
            description: lecturer.description || "",
            follower_count: lecturer.follower_count || 0,
            major_labels: lecturer.major_labels || []
          };
          const counts = response.data.content_counts || {};
          contentCounts.value = {
            total: counts.total || 0,
            videocourse: counts.videocourse || 0,
            audiocourse: counts.audiocourse || 0,
            imagecourse: counts.imagecourse || 0,
            winnowcourse: counts.winnowcourse || 0,
            courseware: counts.courseware || 0,
            winnowcourseware: counts.winnowcourseware || 0,
            exampaper: counts.exampaper || 0,
            winnowexampaper: counts.winnowexampaper || 0
          };
          const publishedContents = response.data.published_contents || {};
          const list = publishedContents.items || [];
          contentList.value = list;
          hasMore.value = list.length >= currentPageSize.value;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const fetchContentList = async () => {
      if (!shopId.value || !lecturerId.value)
        return;
      contentLoading.value = true;
      try {
        const formData = {
          UXMID: shopId.value,
          lecturerid: lecturerId.value,
          content_type: activeTab.value,
          page: 1,
          page_size: currentPageSize.value
        };
        const response = await api_index.getLecturerDetail(formData);
        if (response.status === "success" && response.data) {
          const publishedContents = response.data.published_contents || {};
          const list = publishedContents.items || [];
          contentList.value = list;
          hasMore.value = list.length >= currentPageSize.value;
        } else {
          contentList.value = [];
          hasMore.value = false;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
        hasMore.value = false;
      } finally {
        contentLoading.value = false;
      }
    };
    const loadMore = () => {
      if (contentLoading.value || !hasMore.value)
        return;
      currentPageSize.value += pageIncrement;
      fetchContentList();
    };
    const switchContentTab = (tabKey) => {
      if (activeTab.value === tabKey)
        return;
      activeTab.value = tabKey;
      currentPageSize.value = pageIncrement;
      contentList.value = [];
      hasMore.value = true;
      fetchContentList();
    };
    const toggleFollow = async () => {
      var _a;
      if (!checkLoginStatus())
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: lecturerId.value,
          type: "lecturer"
        };
        const response = await api_index.recordFollow(formData);
        if (response.status === "success") {
          isFollowing.value = ((_a = response.data) == null ? void 0 : _a.is_following) || !isFollowing.value;
          common_vendor.index.showToast({
            title: isFollowing.value ? "关注成功" : "已取消关注",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const viewContent = (item) => {
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
      }
    };
    common_vendor.onLoad((options) => {
      if (options.id)
        lecturerId.value = options.id;
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
      if (shopId.value && lecturerId.value) {
        fetchInitialData();
        fetchFollowStatus();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : common_vendor.e({
        b: lecturerInfo.value.photo_path || "/static/image/my/avatar.png",
        c: common_vendor.t(lecturerInfo.value.name || "讲师"),
        d: common_vendor.t(contentCounts.value.total || 0),
        e: common_vendor.t(lecturerInfo.value.follower_count || 0),
        f: common_vendor.t(isFollowing.value ? "已关注" : "关注"),
        g: isFollowing.value ? 1 : "",
        h: common_vendor.o(toggleFollow, "e1"),
        i: lecturerInfo.value.description
      }, lecturerInfo.value.description ? {
        j: common_vendor.t(lecturerInfo.value.description)
      } : {}, {
        k: lecturerInfo.value.major_labels && lecturerInfo.value.major_labels.length > 0
      }, lecturerInfo.value.major_labels && lecturerInfo.value.major_labels.length > 0 ? {
        l: common_vendor.f(lecturerInfo.value.major_labels, (label, index, i0) => {
          return {
            a: common_vendor.t(label),
            b: index
          };
        })
      } : {}, {
        m: common_vendor.f(tabDefinitions, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: contentCounts.value[tab.key] > 0
          }, contentCounts.value[tab.key] > 0 ? {
            c: common_vendor.t(contentCounts.value[tab.key])
          } : {}, {
            d: tab.key,
            e: activeTab.value === tab.key ? 1 : "",
            f: common_vendor.o(($event) => switchContentTab(tab.key), tab.key)
          });
        }),
        n: contentLoading.value && contentList.value.length === 0
      }, contentLoading.value && contentList.value.length === 0 ? {} : contentList.value.length > 0 ? {
        p: common_vendor.f(contentList.value, (item, k0, i0) => {
          var _a, _b, _c, _d, _e, _f, _g;
          return common_vendor.e({
            a: isCourseType(item.content_type)
          }, isCourseType(item.content_type) ? {
            b: item.cover || ((_a = item.content_info) == null ? void 0 : _a.cover) || "/static/image/default-cover.png",
            c: common_vendor.t(getContentTypeName(item.content_type)),
            d: common_vendor.n(getTypeBadgeClass(item.content_type))
          } : {
            e: getFileIconPath(item),
            f: common_vendor.t(getContentTypeName(item.content_type)),
            g: common_vendor.n(getTypeBadgeClass(item.content_type))
          }, {
            h: item.winnowstatus || ((_b = item.content_info) == null ? void 0 : _b.winnowstatus)
          }, item.winnowstatus || ((_c = item.content_info) == null ? void 0 : _c.winnowstatus) ? {} : {}, {
            i: common_vendor.t(getContentTitle(item)),
            j: common_vendor.t(item.description || ((_d = item.content_info) == null ? void 0 : _d.description) || "暂无描述"),
            k: item.view_count || ((_e = item.content_info) == null ? void 0 : _e.view_count)
          }, item.view_count || ((_f = item.content_info) == null ? void 0 : _f.view_count) ? {
            l: common_vendor.t(item.view_count || ((_g = item.content_info) == null ? void 0 : _g.view_count) || 0)
          } : {}, {
            m: common_vendor.t(getPriceText(item)),
            n: item.content_id,
            o: common_vendor.o(($event) => viewContent(item), item.content_id)
          });
        })
      } : !contentLoading.value ? {
        r: common_assets._imports_0$1,
        s: common_vendor.t(getContentTypeName(activeTab.value))
      } : {}, {
        o: contentList.value.length > 0,
        q: !contentLoading.value,
        t: contentLoading.value && contentList.value.length > 0
      }, contentLoading.value && contentList.value.length > 0 ? {} : {}, {
        v: !contentLoading.value && !hasMore.value && contentList.value.length > 0
      }, !contentLoading.value && !hasMore.value && contentList.value.length > 0 ? {} : {}), {
        w: common_vendor.o(loadMore, "a8")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-58bfb2e3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/lecturer/lecturer.js.map
