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
  __name: "exchange",
  setup(__props) {
    const userPoints = common_vendor.ref(0);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const uxfid = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const hasInitialized = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const totalCount = common_vendor.ref(0);
    const showConfirmModal = common_vendor.ref(false);
    const showSuccessModal = common_vendor.ref(false);
    const selectedItem = common_vendor.ref(null);
    const exchanging = common_vendor.ref(false);
    const signInPoints = common_vendor.ref(5);
    const hasSignedInToday = common_vendor.ref(false);
    const signInLoading = common_vendor.ref(false);
    const currentCategory = common_vendor.ref("all");
    const categoryTabs = common_vendor.ref([
      {
        id: "all",
        name: "全部"
      },
      {
        id: "cash",
        name: "现金"
      },
      {
        id: "membership",
        name: "会员"
      }
    ]);
    const allExchangeList = common_vendor.ref([]);
    const exchangeRulesMap = common_vendor.ref({
      all: [],
      cash: [],
      membership: []
    });
    const currentExchangeList = common_vendor.computed(() => {
      return exchangeRulesMap.value[currentCategory.value] || [];
    });
    const checkLoginStatus = () => {
      const fid = common_vendor.index.getStorageSync("UXFID");
      const fkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      if (!fid || !fkey || !shopid) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }, 100);
        return false;
      }
      uxfid.value = fid;
      userId.value = fkey;
      shopId.value = shopid;
      return true;
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatDate = (dateString) => {
      if (!dateString)
        return "";
      const date = parseDate(dateString);
      if (isNaN(date.getTime()))
        return dateString;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const isItemExchangeable = (item) => {
      if (!item)
        return false;
      if (item.availability_status !== "active")
        return false;
      if (userPoints.value < item.points)
        return false;
      if (item.remaining_quantity !== null && item.remaining_quantity <= 0)
        return false;
      return true;
    };
    const getExchangeBtnText = (item) => {
      if (!item)
        return "兑换";
      if (item.availability_status === "expired")
        return "已过期";
      if (item.availability_status === "sold_out")
        return "已兑完";
      if (userPoints.value < item.points)
        return "积分不足";
      return "立即兑换";
    };
    const updateExchangeMap = () => {
      exchangeRulesMap.value = {
        all: [...allExchangeList.value],
        cash: allExchangeList.value.filter((item) => item.exchange_type === "cash"),
        membership: allExchangeList.value.filter((item) => item.exchange_type === "membership")
      };
    };
    const fetchUserPoints = async () => {
      if (!shopId.value || !userId.value || !uxfid.value)
        return;
      try {
        const res = await api_index.getMemberData({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (res.status === "success" && res.data) {
          userPoints.value = res.data.points || 0;
        }
      } catch (error) {
      }
    };
    const fetchSignInData = async () => {
      if (!shopId.value || !uxfid.value)
        return;
      try {
        const [ruleRes, recordRes] = await Promise.all([
          api_index.getSignInRules({
            UXMID: shopId.value
          }),
          api_index.getSignInDayRecord({
            UXMID: shopId.value,
            user_id: userId.value
          })
        ]);
        if (ruleRes.status === "success" && ruleRes.data) {
          signInPoints.value = ruleRes.data.daily_points || 5;
        }
        if (recordRes.status === "success" && recordRes.data) {
          hasSignedInToday.value = recordRes.data.has_signed_in_today || false;
        }
      } catch (error) {
      }
    };
    const fetchExchangeRules = async (isLoadMore = false) => {
      if (loading.value || !shopId.value || !uxfid.value)
        return;
      loading.value = true;
      try {
        const params = {
          UXMID: shopId.value,
          page: currentPage.value,
          pageSize: pageSize.value
        };
        const res = await api_index.getExchangeRules(params);
        if (res.status === "success") {
          const list = (res.data.list || []).filter((item) => item.status);
          totalCount.value = res.data.total || 0;
          if (isLoadMore) {
            allExchangeList.value = [...allExchangeList.value, ...list];
          } else {
            allExchangeList.value = list;
          }
          noMore.value = allExchangeList.value.length >= totalCount.value;
          updateExchangeMap();
        } else {
          noMore.value = true;
        }
      } catch (error) {
        noMore.value = true;
      } finally {
        loading.value = false;
        hasInitialized.value = true;
      }
    };
    const handleLoadMore = () => {
      if (loading.value || noMore.value)
        return;
      currentPage.value++;
      fetchExchangeRules(true);
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
          userPoints.value = res.data.current_points || userPoints.value;
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
    const goToExchangeRecord = () => {
      common_vendor.index.navigateTo({
        url: "/pages/exchange/exchangelist",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const switchCategory = (categoryId) => {
      currentCategory.value = categoryId;
    };
    const handleExchange = (item) => {
      if (!isItemExchangeable(item)) {
        if (item.availability_status === "expired") {
          common_vendor.index.showToast({
            title: "此兑换项目已过期",
            icon: "none"
          });
        } else if (item.availability_status === "sold_out") {
          common_vendor.index.showToast({
            title: "此兑换项目已兑完",
            icon: "none"
          });
        } else if (userPoints.value < item.points) {
          common_vendor.index.showToast({
            title: "积分不足",
            icon: "none"
          });
        }
        return;
      }
      selectedItem.value = item;
      showConfirmModal.value = true;
    };
    const closeConfirmModal = () => {
      showConfirmModal.value = false;
      selectedItem.value = null;
    };
    const confirmExchange = async () => {
      if (!selectedItem.value || exchanging.value)
        return;
      if (!checkLoginStatus())
        return;
      exchanging.value = true;
      common_vendor.index.showLoading({
        title: "兑换中...",
        mask: true
      });
      try {
        const res = await api_index.executeExchange({
          id: selectedItem.value.id,
          rule_id: selectedItem.value.rule_id,
          user_id: userId.value,
          UXMID: shopId.value
        });
        if (res.status === "success") {
          closeConfirmModal();
          showSuccessModal.value = true;
          await fetchUserPoints();
          currentPage.value = 1;
          allExchangeList.value = [];
          noMore.value = false;
          await fetchExchangeRules();
        } else {
          common_vendor.index.showToast({
            title: res.message || "兑换失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
      } finally {
        exchanging.value = false;
        common_vendor.index.hideLoading();
      }
    };
    const closeSuccessModal = () => {
      showSuccessModal.value = false;
    };
    common_vendor.onMounted(() => {
      const fid = common_vendor.index.getStorageSync("UXFID");
      const fkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      uxfid.value = fid || "";
      userId.value = fkey || "";
      shopId.value = shopid || "";
      if (!fid || !fkey || !shopid) {
        checkLoginStatus();
        return;
      }
      fetchUserPoints();
      fetchSignInData();
      fetchExchangeRules();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(userPoints.value),
        b: common_vendor.o(goToExchangeRecord, "a7"),
        c: common_vendor.t(signInPoints.value),
        d: common_vendor.t(hasSignedInToday.value ? "已签到" : "签到"),
        e: hasSignedInToday.value ? 1 : "",
        f: common_vendor.o(handleSignIn, "f3"),
        g: common_vendor.f(categoryTabs.value, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.name),
            b: currentCategory.value === tab.id
          }, currentCategory.value === tab.id ? {} : {}, {
            c: tab.id,
            d: currentCategory.value === tab.id ? 1 : "",
            e: common_vendor.o(($event) => switchCategory(tab.id), tab.id)
          });
        }),
        h: common_vendor.f(currentExchangeList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.points),
            c: common_vendor.t(item.exchange_type === "cash" ? "兑换现金" : "兑换会员"),
            d: common_vendor.n(item.exchange_type === "cash" ? "tag-cash" : "tag-member"),
            e: item.exchange_type === "cash"
          }, item.exchange_type === "cash" ? {
            f: common_vendor.t(item.value)
          } : {
            g: common_vendor.t(item.membership_name || "会员权益")
          }, {
            h: common_vendor.t(item.description || ""),
            i: common_vendor.t(item.remaining_quantity),
            j: common_vendor.t(item.quantity),
            k: item.end_time
          }, item.end_time ? {
            l: common_vendor.t(formatDate(item.end_time))
          } : {}, {
            m: common_vendor.t(getExchangeBtnText(item)),
            n: !isItemExchangeable(item) ? 1 : "",
            o: common_vendor.o(($event) => handleExchange(item), item.id),
            p: item.id,
            q: !isItemExchangeable(item) ? 1 : ""
          });
        }),
        i: !loading.value && currentExchangeList.value.length === 0 && hasInitialized.value
      }, !loading.value && currentExchangeList.value.length === 0 && hasInitialized.value ? {
        j: common_assets._imports_0$1
      } : {}, {
        k: loading.value && currentExchangeList.value.length === 0
      }, loading.value && currentExchangeList.value.length === 0 ? {} : {}, {
        l: currentExchangeList.value.length > 0
      }, currentExchangeList.value.length > 0 ? common_vendor.e({
        m: !loading.value && !noMore.value
      }, !loading.value && !noMore.value ? {} : {}, {
        n: loading.value
      }, loading.value ? {} : {}, {
        o: noMore.value
      }, noMore.value ? {} : {}) : {}, {
        p: common_vendor.o(handleLoadMore, "eb"),
        q: showConfirmModal.value
      }, showConfirmModal.value ? common_vendor.e({
        r: common_vendor.o(closeConfirmModal, "c8"),
        s: selectedItem.value
      }, selectedItem.value ? {
        t: common_vendor.t(selectedItem.value.name),
        v: common_vendor.t(selectedItem.value.points),
        w: common_vendor.t(userPoints.value),
        x: common_vendor.t(userPoints.value - selectedItem.value.points)
      } : {}, {
        y: common_vendor.o(closeConfirmModal, "b3"),
        z: common_vendor.o(confirmExchange, "0c"),
        A: common_vendor.o(() => {
        }, "0d"),
        B: common_vendor.o(closeConfirmModal, "e5")
      }) : {}, {
        C: showSuccessModal.value
      }, showSuccessModal.value ? {
        D: common_vendor.p({
          type: "checkmarkempty",
          size: "40",
          color: "#ffffff"
        }),
        E: common_vendor.o(closeSuccessModal, "12"),
        F: common_vendor.o(() => {
        }, "f6"),
        G: common_vendor.o(closeSuccessModal, "1d")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ea8424b3"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/exchange/exchange.js.map
