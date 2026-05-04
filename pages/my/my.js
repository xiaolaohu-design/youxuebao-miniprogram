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
const defaultAvatar = "/static/image/my/avatar.png";
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const token = common_vendor.ref("");
    const pointsData = common_vendor.ref(5);
    const hasSignedInToday = common_vendor.ref(false);
    const signInLoading = common_vendor.ref(false);
    const userCoupons = common_vendor.ref(0);
    const activeRecord = common_vendor.ref("browse");
    const browseData = common_vendor.ref([]);
    const browseLoading = common_vendor.ref(false);
    const favoriteData = common_vendor.ref([]);
    const favoriteLoading = common_vendor.ref(false);
    const downloadData = common_vendor.ref([]);
    const downloadLoading = common_vendor.ref(false);
    const showFeedback = common_vendor.ref(false);
    const feedbackForm = common_vendor.ref({
      feedback_type: "bug",
      title: "",
      content: "",
      contact_info: "",
      user_id: null
    });
    const functionList = common_vendor.ref([
      {
        id: 1,
        title: "我的订单",
        iconType: "cart",
        value: "",
        path: "/pages/order/order"
      },
      {
        id: 2,
        title: "我的卡券",
        iconType: "vip",
        value: "",
        path: "/pages/coupon/coupon"
      },
      {
        id: 3,
        title: "积分兑换",
        iconType: "gift",
        value: "",
        path: "/pages/exchange/exchange"
      },
      {
        id: 4,
        title: "浏览记录",
        iconType: "eye",
        value: "",
        path: "/pages/history/browse"
      },
      {
        id: 5,
        title: "收藏记录",
        iconType: "star",
        value: "",
        path: "/pages/history/favorite"
      },
      {
        id: 6,
        title: "关注记录",
        iconType: "heart",
        value: "",
        path: "/pages/history/follow"
      },
      {
        id: 7,
        title: "下载记录",
        iconType: "download",
        value: "",
        path: "/pages/history/download"
      },
      {
        id: 8,
        title: "设置修改",
        iconType: "gear",
        value: "",
        path: "/pages/setting/setting"
      },
      {
        id: 9,
        title: "意见反馈",
        iconType: "chat",
        value: "",
        path: ""
      },
      {
        id: 10,
        title: "关于我们",
        iconType: "info",
        value: "",
        path: "/pages/about/about"
      }
    ]);
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
    const filteredBrowseData = common_vendor.computed(() => browseData.value.filter((item) => VALID_TYPES.includes(item.content_type)));
    const filteredFavoriteData = common_vendor.computed(() => favoriteData.value.filter((item) => VALID_TYPES.includes(item.content_type)));
    const filteredDownloadData = common_vendor.computed(() => downloadData.value.filter((item) => VALID_TYPES.includes(item.content_type)));
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
    const getPriceText = (item) => {
      var _a, _b;
      const salesMode = (_a = item.content_info) == null ? void 0 : _a.sales_mode;
      if (salesMode === null || salesMode === void 0)
        return "";
      if (salesMode == 1)
        return "免费";
      if (salesMode == 2)
        return "会员免费";
      return `¥${((_b = item.content_info) == null ? void 0 : _b.price) || 0}`;
    };
    const formatNumber = (n) => {
      if (!n)
        return "0";
      return n >= 1e4 ? (n / 1e4).toFixed(1) + "w" : n + "";
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
    const initUserData = () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      if (!uxfid || !uxfkey || !shopid)
        return false;
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      return true;
    };
    const fetchUserData = async () => {
      var _a, _b;
      if (!token.value || !userId.value || !shopId.value)
        return;
      const baseFormData = {
        UXMID: shopId.value,
        user_id: userId.value
      };
      try {
        const [memberRes, couponRes, signRuleRes, signRecordRes] = await Promise.allSettled([
          api_index.getMemberData(baseFormData),
          api_index.getUserCoupons(baseFormData),
          api_index.getSignInRules({
            UXMID: shopId.value
          }),
          api_index.getSignInDayRecord(baseFormData)
        ]);
        if (memberRes.status === "fulfilled" && memberRes.value.status === "success")
          userInfo.value = memberRes.value.data || {};
        if (couponRes.status === "fulfilled" && couponRes.value.status === "success") {
          const now = /* @__PURE__ */ new Date();
          userCoupons.value = couponRes.value.data.filter((c) => {
            if (c.status !== "unused")
              return false;
            const endDate = parseDate(c.end_time);
            return isNaN(endDate.getTime()) || endDate > now;
          }).length;
        }
        if (signRuleRes.status === "fulfilled" && signRuleRes.value.status === "success")
          pointsData.value = ((_a = signRuleRes.value.data) == null ? void 0 : _a.daily_points) || 5;
        if (signRecordRes.status === "fulfilled" && signRecordRes.value.status === "success")
          hasSignedInToday.value = ((_b = signRecordRes.value.data) == null ? void 0 : _b.has_signed_in_today) || false;
      } catch (error) {
      }
    };
    const fetchBrowseData = async () => {
      if (!shopId.value || browseLoading.value)
        return;
      browseLoading.value = true;
      try {
        const res = await api_index.getUserBrowseHistory({
          UXMID: shopId.value,
          user_id: userId.value,
          page: 1,
          pageSize: 5,
          isLastThreeMonths: true
        });
        if (res.status === "success")
          browseData.value = res.data.list || [];
      } catch (error) {
      } finally {
        browseLoading.value = false;
      }
    };
    const fetchFavoriteData = async () => {
      if (!shopId.value || favoriteLoading.value)
        return;
      favoriteLoading.value = true;
      try {
        const res = await api_index.getUserFavoriteHistory({
          UXMID: shopId.value,
          user_id: userId.value,
          page: 1,
          pageSize: 5,
          isLastThreeMonths: true
        });
        if (res.status === "success")
          favoriteData.value = res.data.list || [];
      } catch (error) {
      } finally {
        favoriteLoading.value = false;
      }
    };
    const fetchDownloadData = async () => {
      if (!shopId.value || downloadLoading.value)
        return;
      downloadLoading.value = true;
      try {
        const res = await api_index.getUserDownloadHistory({
          UXMID: shopId.value,
          user_id: userId.value,
          page: 1,
          pageSize: 5,
          isLastThreeMonths: true
        });
        if (res.status === "success")
          downloadData.value = res.data.list || [];
      } catch (error) {
      } finally {
        downloadLoading.value = false;
      }
    };
    const switchRecord = (type) => {
      activeRecord.value = type;
      if (type === "browse" && browseData.value.length === 0)
        fetchBrowseData();
      else if (type === "favorite" && favoriteData.value.length === 0)
        fetchFavoriteData();
      else if (type === "download" && downloadData.value.length === 0)
        fetchDownloadData();
    };
    const handleSignIn = async () => {
      var _a;
      if (hasSignedInToday.value || signInLoading.value)
        return;
      signInLoading.value = true;
      try {
        const res = await api_index.memberSignIn({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (res.status === "success" && ((_a = res.data) == null ? void 0 : _a.sign_in_success)) {
          common_vendor.index.showToast({
            title: `签到成功，获得${res.data.points_earned || 0}积分`,
            icon: "success"
          });
          userInfo.value.points = res.data.current_points || userInfo.value.points;
          hasSignedInToday.value = true;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "签到失败",
          icon: "none"
        });
      } finally {
        signInLoading.value = false;
      }
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatDate = (s) => {
      if (!s)
        return "";
      const d = parseDate(s);
      if (isNaN(d.getTime()))
        return s;
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    const getResourceTitle = (item) => {
      var _a;
      return ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.name) || "未命名资源";
    };
    const getResourceCover = (item) => {
      var _a;
      return ((_a = item == null ? void 0 : item.content_info) == null ? void 0 : _a.cover) || "/static/image/default-cover.png";
    };
    const handleVipClick = () => {
      common_vendor.index.navigateTo({
        url: "/pages/benefits/benefits",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleViewProfile = () => common_vendor.index.navigateTo({
      url: "/pages/coupon/coupon",
      fail: () => {
        common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "none"
        });
      }
    });
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
          fail: () => {
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "查看详情",
          icon: "none"
        });
      }
    };
    const handleFunctionClick = (item) => {
      if (item.id === 9) {
        openFeedback();
      } else if (item.path) {
        common_vendor.index.navigateTo({
          url: item.path
        });
      } else {
        common_vendor.index.showToast({
          title: item.title,
          icon: "none"
        });
      }
    };
    const openFeedback = () => {
      feedbackForm.value.user_id = userId.value || null;
      feedbackForm.value.feedback_type = "bug";
      feedbackForm.value.title = "";
      feedbackForm.value.content = "";
      feedbackForm.value.contact_info = "";
      showFeedback.value = true;
    };
    const closeFeedback = () => {
      showFeedback.value = false;
      feedbackForm.value = {
        feedback_type: "bug",
        title: "",
        content: "",
        contact_info: "",
        user_id: null
      };
    };
    const submitFeedbackData = async () => {
      if (!feedbackForm.value.title.trim()) {
        common_vendor.index.showToast({
          title: "请输入反馈标题",
          icon: "none"
        });
        return;
      }
      if (!feedbackForm.value.content.trim()) {
        common_vendor.index.showToast({
          title: "请输入反馈内容",
          icon: "none"
        });
        return;
      }
      try {
        const formData = {
          feedback_type: feedbackForm.value.feedback_type,
          title: feedbackForm.value.title,
          content: feedbackForm.value.content,
          contact_info: feedbackForm.value.contact_info,
          shopid: shopId.value,
          user_id: feedbackForm.value.user_id
        };
        const response = await api_index.submitFeedback(formData);
        if (response.status === "success") {
          common_vendor.index.showToast({
            title: "反馈提交成功，我们会尽快处理！",
            icon: "success"
          });
          closeFeedback();
        } else {
          common_vendor.index.showToast({
            title: response.message || "提交失败，请稍后再试",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "提交失败，请稍后再试",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      if (!checkLoginStatus())
        return;
      initUserData();
      if (token.value && userId.value && shopId.value) {
        fetchUserData();
        fetchBrowseData();
      }
    });
    common_vendor.onShow(() => {
      if (!checkLoginStatus())
        return;
      initUserData();
      if (token.value && userId.value && shopId.value)
        fetchUserData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: defaultAvatar,
        b: common_vendor.t(userInfo.value.username || "用户名"),
        c: userInfo.value.is_member
      }, userInfo.value.is_member ? {
        d: userInfo.value.membership_level === 1 ? "/static/image/my/vip1.png" : "/static/image/my/vip0.png"
      } : {}, {
        e: common_vendor.t(userId.value),
        f: common_vendor.t(userInfo.value.balance || "0.00"),
        g: common_vendor.t(userInfo.value.points || 0),
        h: common_vendor.t(userCoupons.value),
        i: common_vendor.o(($event) => handleViewProfile(), "62"),
        j: common_vendor.t(pointsData.value || 5),
        k: common_vendor.t(hasSignedInToday.value ? "已签到" : "签到"),
        l: hasSignedInToday.value ? 1 : "",
        m: common_vendor.o(handleSignIn, "bc"),
        n: common_assets._imports_0$2,
        o: common_vendor.t(userInfo.value.is_member ? "到期时间：" + formatDate(userInfo.value.member_end_time) : "开通会员享专属特权"),
        p: common_vendor.t(userInfo.value.is_member ? "续费" : "立即开通"),
        q: common_vendor.p({
          type: "right",
          size: "16",
          color: "#ffffff"
        }),
        r: common_vendor.o(handleVipClick, "2a"),
        s: activeRecord.value === "browse" ? 1 : "",
        t: common_vendor.o(($event) => switchRecord("browse"), "9f"),
        v: activeRecord.value === "favorite" ? 1 : "",
        w: common_vendor.o(($event) => switchRecord("favorite"), "c0"),
        x: activeRecord.value === "download" ? 1 : "",
        y: common_vendor.o(($event) => switchRecord("download"), "ff"),
        z: browseLoading.value
      }, browseLoading.value ? {} : filteredBrowseData.value.length === 0 ? {} : {
        B: common_vendor.f(filteredBrowseData.value, (item, k0, i0) => {
          var _a, _b, _c, _d, _e, _f, _g;
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
            j: common_vendor.t(item.browse_time || "")
          }) : common_vendor.e({
            k: getFileIconPath(item),
            l: (_d = item.content_info) == null ? void 0 : _d.winnowstatus
          }, ((_e = item.content_info) == null ? void 0 : _e.winnowstatus) ? {} : {}, {
            m: common_vendor.t(getResourceTitle(item)),
            n: common_vendor.t(((_f = item.content_info) == null ? void 0 : _f.description) || ""),
            o: common_vendor.t(item.browse_time || ""),
            p: "2f1ef635-1-" + i0,
            q: common_vendor.p({
              type: "eye",
              size: "12",
              color: "#bbb"
            }),
            r: common_vendor.t(formatNumber(((_g = item.content_info) == null ? void 0 : _g.view_count) || 0))
          }), {
            s: item.content_id,
            t: common_vendor.o(($event) => clickView(item), item.content_id)
          });
        })
      }, {
        A: filteredBrowseData.value.length === 0,
        C: activeRecord.value === "browse",
        D: favoriteLoading.value
      }, favoriteLoading.value ? {} : filteredFavoriteData.value.length === 0 ? {} : {
        F: common_vendor.f(filteredFavoriteData.value, (item, k0, i0) => {
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
            j: getPriceText(item)
          }, getPriceText(item) ? {
            k: common_vendor.t(getPriceText(item))
          } : {
            l: common_vendor.t(item.collect_time || item.favorite_time || "")
          }) : common_vendor.e({
            m: getFileIconPath(item),
            n: (_d = item.content_info) == null ? void 0 : _d.winnowstatus
          }, ((_e = item.content_info) == null ? void 0 : _e.winnowstatus) ? {} : {}, {
            o: common_vendor.t(getResourceTitle(item)),
            p: common_vendor.t(((_f = item.content_info) == null ? void 0 : _f.description) || ""),
            q: getPriceText(item)
          }, getPriceText(item) ? {
            r: common_vendor.t(getPriceText(item))
          } : {
            s: common_vendor.t(item.collect_time || item.favorite_time || "")
          }), {
            t: item.content_id,
            v: common_vendor.o(($event) => clickView(item), item.content_id)
          });
        })
      }, {
        E: filteredFavoriteData.value.length === 0,
        G: activeRecord.value === "favorite",
        H: downloadLoading.value
      }, downloadLoading.value ? {} : filteredDownloadData.value.length === 0 ? {} : {
        J: common_vendor.f(filteredDownloadData.value, (item, k0, i0) => {
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
            j: getPriceText(item)
          }, getPriceText(item) ? {
            k: common_vendor.t(getPriceText(item))
          } : {
            l: common_vendor.t(item.download_time || "")
          }) : common_vendor.e({
            m: getFileIconPath(item),
            n: (_d = item.content_info) == null ? void 0 : _d.winnowstatus
          }, ((_e = item.content_info) == null ? void 0 : _e.winnowstatus) ? {} : {}, {
            o: common_vendor.t(getResourceTitle(item)),
            p: common_vendor.t(((_f = item.content_info) == null ? void 0 : _f.description) || ""),
            q: getPriceText(item)
          }, getPriceText(item) ? {
            r: common_vendor.t(getPriceText(item))
          } : {}, {
            s: "2f1ef635-2-" + i0,
            t: common_vendor.p({
              type: "download",
              size: "12",
              color: "#bbb"
            }),
            v: common_vendor.t(formatNumber(item.downloadCount || 0))
          }), {
            w: item.id,
            x: common_vendor.o(($event) => clickView(item), item.id)
          });
        })
      }, {
        I: filteredDownloadData.value.length === 0,
        K: activeRecord.value === "download",
        L: common_vendor.f(functionList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: "2f1ef635-3-" + i0,
            b: common_vendor.p({
              type: item.iconType,
              size: "24",
              color: "#666666"
            }),
            c: common_vendor.t(item.title),
            d: item.value
          }, item.value ? {
            e: common_vendor.t(item.value)
          } : {}, {
            f: "2f1ef635-4-" + i0,
            g: item.id,
            h: common_vendor.o(($event) => handleFunctionClick(item), item.id)
          });
        }),
        M: common_vendor.p({
          type: "right",
          size: "16",
          color: "#cccccc"
        }),
        N: showFeedback.value
      }, showFeedback.value ? {
        O: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        P: common_vendor.o(closeFeedback, "c7"),
        Q: feedbackForm.value.feedback_type === "bug" ? 1 : "",
        R: common_vendor.o(($event) => feedbackForm.value.feedback_type = "bug", "c8"),
        S: feedbackForm.value.feedback_type === "suggestion" ? 1 : "",
        T: common_vendor.o(($event) => feedbackForm.value.feedback_type = "suggestion", "9e"),
        U: feedbackForm.value.feedback_type === "question" ? 1 : "",
        V: common_vendor.o(($event) => feedbackForm.value.feedback_type = "question", "1c"),
        W: feedbackForm.value.feedback_type === "other" ? 1 : "",
        X: common_vendor.o(($event) => feedbackForm.value.feedback_type = "other", "82"),
        Y: feedbackForm.value.title,
        Z: common_vendor.o(($event) => feedbackForm.value.title = $event.detail.value, "b9"),
        aa: feedbackForm.value.content,
        ab: common_vendor.o(($event) => feedbackForm.value.content = $event.detail.value, "b6"),
        ac: common_vendor.t(feedbackForm.value.content.length),
        ad: feedbackForm.value.contact_info,
        ae: common_vendor.o(($event) => feedbackForm.value.contact_info = $event.detail.value, "a7"),
        af: common_vendor.o(closeFeedback, "e7"),
        ag: common_vendor.o(submitFeedbackData, "95"),
        ah: common_vendor.o(() => {
        }, "16"),
        ai: common_vendor.o(closeFeedback, "88")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2f1ef635"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/my/my.js.map
