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
const _sfc_main = {
  __name: "coupon",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
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
      token.value = uxfid;
      userId.value = uxfkey;
      shopId.value = shopid;
      isLogin.value = true;
      return true;
    };
    const currentTab = common_vendor.ref("available");
    const loading = common_vendor.ref(false);
    const showSuccessModal = common_vendor.ref(false);
    const isClaiming = common_vendor.ref(false);
    const activeTag = common_vendor.ref("全部");
    const couponData = common_vendor.ref([]);
    const userCoupons = common_vendor.ref([]);
    const couponTabs = common_vendor.ref([{
      id: "available",
      name: "可领取"
    }, {
      id: "my",
      name: "我的优惠券"
    }, {
      id: "expired",
      name: "已失效"
    }]);
    const parseTags = (tagsString) => {
      if (!tagsString)
        return [];
      try {
        return JSON.parse(tagsString);
      } catch {
        return [];
      }
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "未知日期";
      const date = parseDate(dateString);
      if (isNaN(date.getTime()))
        return "未知日期";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}.${month}.${day}`;
    };
    const getCouponAmount = (coupon) => {
      var _a;
      return coupon.discount_amount || ((_a = coupon.coupon_detail) == null ? void 0 : _a.discount_amount) || 0;
    };
    const getCouponName = (coupon) => {
      var _a;
      return coupon.name || ((_a = coupon.coupon_detail) == null ? void 0 : _a.name) || "优惠券";
    };
    const getConditionText = (coupon) => {
      var _a;
      const usageLimit = coupon.usage_limit || ((_a = coupon.coupon_detail) == null ? void 0 : _a.usage_limit) || 0;
      return usageLimit === 0 ? "无门槛" : `满${usageLimit}元可用`;
    };
    const isExpired = (coupon) => {
      const endTime = parseDate(coupon.end_time);
      if (isNaN(endTime.getTime()))
        return true;
      return endTime < /* @__PURE__ */ new Date();
    };
    const getEmptyTip = () => {
      if (currentTab.value === "available")
        return "暂无可用优惠券";
      if (currentTab.value === "my")
        return "你还没有可用的优惠券";
      return "暂无失效优惠券";
    };
    const couponTags = common_vendor.computed(() => {
      const tags = /* @__PURE__ */ new Set();
      tags.add("全部");
      let hasEmptyTags = false;
      const data = couponData.value;
      const len = data.length;
      for (let i = 0; i < len; i++) {
        const coupon = data[i];
        if (coupon.tags) {
          const parsedTags = parseTags(coupon.tags);
          if (parsedTags.length > 0) {
            for (let j = 0; j < parsedTags.length; j++) {
              tags.add(parsedTags[j].name);
            }
          } else {
            hasEmptyTags = true;
          }
        } else {
          hasEmptyTags = true;
        }
      }
      if (hasEmptyTags) {
        tags.add("无标签");
      }
      return Array.from(tags);
    });
    const countByTag = (tag) => {
      if (tag === "全部")
        return couponData.value.length;
      const data = couponData.value;
      const len = data.length;
      let count = 0;
      if (tag === "无标签") {
        for (let i = 0; i < len; i++) {
          const coupon = data[i];
          if (!coupon.tags || parseTags(coupon.tags).length === 0) {
            count++;
          }
        }
        return count;
      }
      for (let i = 0; i < len; i++) {
        const coupon = data[i];
        if (!coupon.tags)
          continue;
        const parsedTags = parseTags(coupon.tags);
        const tagLen = parsedTags.length;
        for (let j = 0; j < tagLen; j++) {
          if (parsedTags[j].name === tag) {
            count++;
            break;
          }
        }
      }
      return count;
    };
    const filteredCoupons = common_vendor.computed(() => {
      if (activeTag.value === "全部")
        return couponData.value;
      const result = [];
      const data = couponData.value;
      const len = data.length;
      for (let i = 0; i < len; i++) {
        const coupon = data[i];
        if (activeTag.value === "无标签") {
          if (!coupon.tags || parseTags(coupon.tags).length === 0) {
            result.push(coupon);
          }
          continue;
        }
        if (!coupon.tags)
          continue;
        const parsedTags = parseTags(coupon.tags);
        const tagLen = parsedTags.length;
        let matched = false;
        for (let j = 0; j < tagLen; j++) {
          if (parsedTags[j].name === activeTag.value) {
            matched = true;
            break;
          }
        }
        if (matched)
          result.push(coupon);
      }
      return result;
    });
    const myCouponsList = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      return userCoupons.value.filter((coupon) => {
        const endTime = parseDate(coupon.end_time);
        const isNotExpired = !isNaN(endTime.getTime()) && endTime >= now;
        const isAvailable = coupon.status === "unused";
        return isNotExpired && isAvailable;
      });
    });
    const expiredCouponsList = common_vendor.computed(() => {
      const now = /* @__PURE__ */ new Date();
      return userCoupons.value.filter((coupon) => {
        const endTime = parseDate(coupon.end_time);
        const isExpired2 = isNaN(endTime.getTime()) || endTime < now;
        const isUnavailable = coupon.status !== "unused";
        return isExpired2 || isUnavailable;
      });
    });
    const currentList = common_vendor.computed(() => {
      if (currentTab.value === "available")
        return filteredCoupons.value;
      if (currentTab.value === "my")
        return myCouponsList.value;
      return expiredCouponsList.value;
    });
    const isCouponClaimed = (coupon) => {
      var _a;
      const couponId = coupon.coupon_id;
      const ucList = userCoupons.value;
      const len = ucList.length;
      for (let i = 0; i < len; i++) {
        const uc = ucList[i];
        const ucCouponId = ((_a = uc.coupon_detail) == null ? void 0 : _a.coupon_id) || uc.coupon_id;
        if (ucCouponId === couponId) {
          return true;
        }
      }
      return false;
    };
    const canClaimCoupon = (coupon) => {
      var _a;
      if (coupon.remaining <= 0)
        return false;
      if (coupon.status === false || coupon.status === 0)
        return false;
      const couponId = coupon.coupon_id;
      const ucList = userCoupons.value;
      const len = ucList.length;
      let claimCount = 0;
      for (let i = 0; i < len; i++) {
        const uc = ucList[i];
        const ucCouponId = ((_a = uc.coupon_detail) == null ? void 0 : _a.coupon_id) || uc.coupon_id;
        if (ucCouponId === couponId) {
          claimCount++;
        }
      }
      if (coupon.per_user_limit > 0 && claimCount >= coupon.per_user_limit) {
        return false;
      }
      return true;
    };
    const getActionBtnClass = (coupon) => {
      if (isCouponClaimed(coupon))
        return "btn-claimed";
      if (!canClaimCoupon(coupon))
        return "btn-disabled";
      return "btn-primary";
    };
    const getActionBtnText = (coupon) => {
      if (isCouponClaimed(coupon))
        return "已领取";
      if (!canClaimCoupon(coupon))
        return "已抢光";
      return "立即领取";
    };
    const switchTab = (tabId) => {
      if ((tabId === "my" || tabId === "expired") && !checkLoginStatus()) {
        return;
      }
      currentTab.value = tabId;
      activeTag.value = "全部";
    };
    const filterByTag = (tag) => {
      activeTag.value = tag;
    };
    const handleCouponAction = (coupon) => {
      if (!checkLoginStatus()) {
        return;
      }
      if (canClaimCoupon(coupon)) {
        claimCoupon(coupon);
      }
    };
    const claimCoupon = async (coupon) => {
      if (!checkLoginStatus()) {
        return;
      }
      if (isClaiming.value)
        return;
      isClaiming.value = true;
      common_vendor.index.showLoading({
        title: "领取中..."
      });
      try {
        const formData = {
          UXMID: shopId.value,
          couponId: coupon.coupon_id,
          user_id: userId.value
        };
        const response = await api_index.claimUserCoupon(formData);
        if (response && response.status === "success") {
          const index = couponData.value.findIndex((c) => c.coupon_id === coupon.coupon_id);
          if (index !== -1) {
            couponData.value[index].remaining -= 1;
          }
          await getUserCouponData();
          common_vendor.index.hideLoading();
          showSuccessModal.value = true;
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: (response == null ? void 0 : response.message) || "领取失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "领取失败，请稍后重试",
          icon: "none"
        });
      } finally {
        isClaiming.value = false;
      }
    };
    const useCoupon = (coupon) => {
      if (!checkLoginStatus()) {
        return;
      }
      common_vendor.index.switchTab({
        url: "/pages/resource/resource",
        success: () => {
          common_vendor.index.$emit("useCoupon", coupon);
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "跳转失败",
            icon: "none"
          });
        }
      });
    };
    const closeSuccessModal = () => {
      showSuccessModal.value = false;
    };
    const fetchCouponsList = async () => {
      if (!shopId.value)
        return;
      loading.value = true;
      try {
        const formData = {
          UXMID: shopId.value
        };
        const response = await api_index.getCouponsList(formData);
        if (response && response.status === "success" && response.data) {
          const data = response.data;
          const len = data.length;
          const result = new Array(len);
          for (let i = 0; i < len; i++) {
            const coupon = data[i];
            result[i] = {
              ...coupon,
              description: coupon.description || "暂无使用说明",
              usage_limit: coupon.usage_limit || 0,
              remaining: coupon.remaining || 0,
              per_user_limit: coupon.per_user_limit || 1
            };
          }
          couponData.value = result;
        } else {
          couponData.value = [];
        }
      } catch (error) {
        couponData.value = [];
      } finally {
        loading.value = false;
      }
    };
    const getUserCouponData = async () => {
      if (!shopId.value || !userId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value
        };
        const response = await api_index.getUserCoupons(formData);
        common_vendor.index.__f__("log", "at pages/coupon/coupon.vue:632", response);
        if (response && response.status === "success") {
          userCoupons.value = response.data || [];
        }
      } catch (error) {
      }
    };
    common_vendor.onMounted(async () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      isLogin.value = !!(uxfid && uxfkey && shopid);
      if (!isLogin.value) {
        checkLoginStatus();
        return;
      }
      await Promise.all([fetchCouponsList(), getUserCouponData()]);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(couponTabs.value, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.name),
            b: currentTab.value === tab.id
          }, currentTab.value === tab.id ? {} : {}, {
            c: tab.id,
            d: currentTab.value === tab.id ? 1 : "",
            e: common_vendor.o(($event) => switchTab(tab.id), tab.id)
          });
        }),
        b: currentTab.value === "available" && couponTags.value.length > 1
      }, currentTab.value === "available" && couponTags.value.length > 1 ? {
        c: common_vendor.f(couponTags.value, (tag, k0, i0) => {
          return {
            a: common_vendor.t(tag === "无标签" ? "其他" : tag),
            b: common_vendor.t(countByTag(tag)),
            c: tag,
            d: activeTag.value === tag ? 1 : "",
            e: common_vendor.o(($event) => filterByTag(tag), tag)
          };
        })
      } : {}, {
        d: isLogin.value
      }, isLogin.value ? common_vendor.e({
        e: currentTab.value === "available"
      }, currentTab.value === "available" ? {
        f: common_vendor.f(filteredCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(coupon.discount_amount),
            b: common_vendor.t(coupon.usage_limit === 0 ? "无门槛" : "满" + coupon.usage_limit + "元可用"),
            c: common_vendor.t(coupon.name),
            d: common_vendor.t(coupon.description || "暂无使用说明"),
            e: common_vendor.t(formatDate(coupon.end_time)),
            f: common_vendor.t(getActionBtnText(coupon)),
            g: common_vendor.n(getActionBtnClass(coupon)),
            h: common_vendor.o(($event) => handleCouponAction(coupon), coupon.coupon_id),
            i: canClaimCoupon(coupon)
          }, canClaimCoupon(coupon) ? {
            j: common_vendor.t(coupon.remaining)
          } : {}, {
            k: isCouponClaimed(coupon) || !canClaimCoupon(coupon) && !isCouponClaimed(coupon)
          }, isCouponClaimed(coupon) || !canClaimCoupon(coupon) && !isCouponClaimed(coupon) ? {
            l: common_vendor.t(isCouponClaimed(coupon) ? "已领取" : "已抢光")
          } : {}, {
            m: coupon.coupon_id,
            n: isCouponClaimed(coupon) ? 1 : "",
            o: !canClaimCoupon(coupon) && !isCouponClaimed(coupon) ? 1 : ""
          });
        })
      } : {}, {
        g: currentTab.value === "my"
      }, currentTab.value === "my" ? {
        h: common_vendor.f(myCouponsList.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getCouponAmount(coupon)),
            b: common_vendor.t(getConditionText(coupon)),
            c: common_vendor.t(getCouponName(coupon)),
            d: common_vendor.t(formatDate(coupon.end_time)),
            e: common_vendor.t(isExpired(coupon) ? "已过期" : "去使用"),
            f: common_vendor.n(isExpired(coupon) ? "btn-disabled" : "btn-outline"),
            g: common_vendor.o(($event) => useCoupon(coupon), coupon.id || coupon.coupon_id),
            h: isExpired(coupon)
          }, isExpired(coupon) ? {} : {}, {
            i: coupon.id || coupon.coupon_id,
            j: isExpired(coupon) ? 1 : ""
          });
        })
      } : {}, {
        i: currentTab.value === "expired"
      }, currentTab.value === "expired" ? {
        j: common_vendor.f(expiredCouponsList.value, (coupon, k0, i0) => {
          return {
            a: common_vendor.t(getCouponAmount(coupon)),
            b: common_vendor.t(getConditionText(coupon)),
            c: common_vendor.t(getCouponName(coupon)),
            d: common_vendor.t(formatDate(coupon.end_time)),
            e: coupon.id || coupon.coupon_id
          };
        })
      } : {}, {
        k: currentList.value.length === 0 && !loading.value
      }, currentList.value.length === 0 && !loading.value ? {
        l: common_assets._imports_0$5,
        m: common_vendor.t(getEmptyTip())
      } : {}) : {}, {
        n: showSuccessModal.value
      }, showSuccessModal.value ? {
        o: common_vendor.p({
          type: "checkmarkempty",
          size: "40",
          color: "#ffffff"
        }),
        p: common_vendor.o(closeSuccessModal, "92"),
        q: common_vendor.o(() => {
        }, "1d"),
        r: common_vendor.o(closeSuccessModal, "1c")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-96ba783d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupon/coupon.js.map
