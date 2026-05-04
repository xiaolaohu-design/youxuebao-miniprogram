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
  __name: "exchangelist",
  setup(__props) {
    const userPoints = common_vendor.ref(0);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPageSize = common_vendor.ref(20);
    const showDetailModal = common_vendor.ref(false);
    const selectedRecord = common_vendor.ref(null);
    const currentStatus = common_vendor.ref("all");
    const statusTabs = common_vendor.ref([
      {
        id: "all",
        name: "全部"
      },
      {
        id: "pending",
        name: "待处理"
      },
      {
        id: "completed",
        name: "已完成"
      },
      {
        id: "cancelled",
        name: "已取消"
      }
    ]);
    const allRecordList = common_vendor.ref([]);
    const filteredRecordList = common_vendor.computed(() => {
      if (currentStatus.value === "all")
        return allRecordList.value;
      return allRecordList.value.filter((item) => {
        if (currentStatus.value === "pending")
          return item.status === "pending" || item.status === "processing";
        return item.status === currentStatus.value;
      });
    });
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
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatTime = (timeStr) => {
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
    const getStatusText = (status) => {
      const map = {
        success: "已完成",
        pending: "待处理",
        processing: "处理中",
        failed: "兑换失败",
        cancelled: "已取消",
        completed: "已完成",
        expired: "已过期"
      };
      return map[status] || status || "未知";
    };
    const getStatusClass = (status) => {
      const map = {
        success: "status-completed",
        completed: "status-completed",
        pending: "status-pending",
        processing: "status-pending",
        failed: "status-cancelled",
        cancelled: "status-cancelled",
        expired: "status-cancelled"
      };
      return map[status] || "status-pending";
    };
    const getExchangeContent = (record) => {
      if (record.exchange_type === "cash")
        return `¥${record.value || 0}`;
      if (record.exchange_type === "membership")
        return record.membership_name || "会员权益";
      return record.exchange_content || "-";
    };
    const getRecordImage = (item) => {
      if (item.exchange_type === "cash")
        return "/static/image/exchange/cash.png";
      if (item.exchange_type === "membership")
        return "/static/image/exchange/card.png";
      return "/static/image/exchange/default.png";
    };
    const fetchUserPoints = async () => {
      if (!shopId.value || !userId.value)
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
    const loadData = async (isLoadMore = false) => {
      if (loading.value || !hasMore.value && isLoadMore)
        return;
      if (!isLoadMore) {
        currentPageSize.value = 20;
        allRecordList.value = [];
        hasMore.value = true;
      }
      loading.value = true;
      try {
        const res = await api_index.getExchangeRecords({
          UXMID: shopId.value,
          user_id: userId.value,
          page: 1,
          pageSize: currentPageSize.value
        });
        if (res.status === "success") {
          const newData = res.data.list || [];
          const totalCount = res.data.total || 0;
          allRecordList.value = newData;
          if (newData.length < currentPageSize.value || currentPageSize.value >= maxPageSize || currentPageSize.value >= totalCount) {
            hasMore.value = false;
          } else {
            hasMore.value = true;
          }
        } else {
          hasMore.value = false;
        }
      } catch (error) {
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    };
    const loadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      if (currentPageSize.value < maxPageSize) {
        currentPageSize.value += 20;
        loadData(true);
      } else {
        hasMore.value = false;
      }
    };
    const switchStatus = (statusId) => {
      currentStatus.value = statusId;
    };
    const viewRecordDetail = (record) => {
      selectedRecord.value = record;
      showDetailModal.value = true;
    };
    const closeDetailModal = () => {
      showDetailModal.value = false;
      selectedRecord.value = null;
    };
    const goToExchange = () => {
      common_vendor.index.navigateTo({
        url: "/pages/exchange/exchange",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
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
      fetchUserPoints();
      loadData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(userPoints.value),
        b: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ffffff"
        }),
        c: common_vendor.o(goToExchange, "de"),
        d: common_vendor.f(statusTabs.value, (tab, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.name),
            b: currentStatus.value === tab.id
          }, currentStatus.value === tab.id ? {} : {}, {
            c: tab.id,
            d: currentStatus.value === tab.id ? 1 : "",
            e: common_vendor.o(($event) => switchStatus(tab.id), tab.id)
          });
        }),
        e: loading.value && filteredRecordList.value.length === 0
      }, loading.value && filteredRecordList.value.length === 0 ? {} : !loading.value && filteredRecordList.value.length === 0 ? {
        g: common_assets._imports_0$1,
        h: common_vendor.o(goToExchange, "3a")
      } : {
        i: common_vendor.f(filteredRecordList.value, (item, k0, i0) => {
          return {
            a: getRecordImage(item),
            b: common_vendor.t(item.exchange_type_name || "兑换项目"),
            c: common_vendor.t(getStatusText(item.status)),
            d: common_vendor.n(getStatusClass(item.status)),
            e: common_vendor.t(formatTime(item.exchange_time)),
            f: common_vendor.t(item.points),
            g: item.id,
            h: common_vendor.o(($event) => viewRecordDetail(item), item.id)
          };
        })
      }, {
        f: !loading.value && filteredRecordList.value.length === 0,
        j: loading.value && filteredRecordList.value.length > 0
      }, loading.value && filteredRecordList.value.length > 0 ? {} : {}, {
        k: !hasMore.value && filteredRecordList.value.length > 0
      }, !hasMore.value && filteredRecordList.value.length > 0 ? {} : {}, {
        l: common_vendor.o(loadMore, "a8"),
        m: showDetailModal.value
      }, showDetailModal.value ? common_vendor.e({
        n: common_vendor.o(closeDetailModal, "97"),
        o: selectedRecord.value
      }, selectedRecord.value ? common_vendor.e({
        p: common_vendor.t(selectedRecord.value.exchange_type_name || "兑换项目"),
        q: common_vendor.t(formatTime(selectedRecord.value.exchange_time)),
        r: common_vendor.t(selectedRecord.value.points),
        s: common_vendor.t(getExchangeContent(selectedRecord.value)),
        t: common_vendor.t(getStatusText(selectedRecord.value.status)),
        v: common_vendor.n(getStatusClass(selectedRecord.value.status)),
        w: selectedRecord.value.remark
      }, selectedRecord.value.remark ? {
        x: common_vendor.t(selectedRecord.value.remark)
      } : {}) : {}, {
        y: common_vendor.o(closeDetailModal, "c5"),
        z: common_vendor.o(() => {
        }, "8a"),
        A: common_vendor.o(closeDetailModal, "a3")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-acffb328"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/exchange/exchangelist.js.map
