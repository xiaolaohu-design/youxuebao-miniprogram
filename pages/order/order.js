"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons)();
}
const pageSize = 20;
const _sfc_main = {
  __name: "order",
  setup(__props, { expose: __expose }) {
    const allOrderList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const hasInitialized = common_vendor.ref(false);
    const currentPage = common_vendor.ref(1);
    const totalCount = common_vendor.ref(0);
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const showDetail = common_vendor.ref(false);
    const currentDetail = common_vendor.ref(null);
    const searchKeyword = common_vendor.ref("");
    const searchText = common_vendor.ref("");
    const orderTabs = common_vendor.ref([
      {
        label: "全部",
        value: "all",
        count: 0
      },
      {
        label: "待支付",
        value: "pending",
        count: 0
      },
      {
        label: "已支付",
        value: "paid",
        count: 0
      },
      {
        label: "已完成",
        value: "completed",
        count: 0
      },
      {
        label: "已取消",
        value: "cancelled",
        count: 0
      }
    ]);
    const currentTab = common_vendor.ref("all");
    const filteredOrderList = common_vendor.computed(() => {
      let list = allOrderList.value;
      if (currentTab.value !== "all") {
        list = list.filter((item) => item.order_status === currentTab.value);
      }
      if (searchText.value.trim()) {
        const keyword = searchText.value.trim().toLowerCase();
        list = list.filter((item) => {
          const name = getProductName(item).toLowerCase();
          const orderId = item.order_id.toLowerCase();
          return name.includes(keyword) || orderId.includes(keyword);
        });
      }
      return list;
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
      shopId.value = shopid;
      userId.value = uxfkey;
      return true;
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const getStatusText = (status) => {
      const map = {
        pending: "待支付",
        paid: "已支付",
        completed: "已完成",
        cancelled: "已取消",
        refunded: "已退款"
      };
      return map[status] || "未知";
    };
    const getStatusClass = (status) => {
      const map = {
        pending: "status-pending",
        paid: "status-paid",
        completed: "status-completed",
        cancelled: "status-cancelled",
        refunded: "status-cancelled"
      };
      return map[status] || "";
    };
    const getOrderTypeText = (type) => {
      const map = {
        course: "课程",
        courseware: "课件",
        exam_paper: "试卷",
        paper_assembly: "组卷",
        practice: "刷题",
        membership: "会员权益",
        other: "其他"
      };
      return map[type] || "其他";
    };
    const getProductImage = (order) => {
      var _a;
      const productType = order.order_type || ((_a = order.product_info) == null ? void 0 : _a.product_type);
      const imageMap = {
        "course": "/static/image/file/course.png",
        "courseware": "/static/image/file/docx.png",
        "exam_paper": "/static/image/file/docx.png",
        "paper_assembly": "/static/image/file/docx.png",
        "practice": "/static/image/file/practice.png",
        "membership": "/static/image/file/membership.png",
        "other": "/static/image/file/other.png"
      };
      return imageMap[productType] || "/static/image/default-cover.png";
    };
    const getProductName = (order) => {
      var _a;
      const type = order.product_type || order.order_type;
      if (type === "paper_assembly")
        return "刷题功能";
      if (type === "practice")
        return "全科目刷题包";
      return ((_a = order.product_info) == null ? void 0 : _a.product_name) || "未知商品";
    };
    const formatTime = (timeStr) => {
      if (!timeStr)
        return "";
      if (timeStr.includes(" ") && !timeStr.includes("T")) {
        return timeStr.substring(0, 16);
      }
      const date = parseDate(timeStr);
      if (isNaN(date.getTime()))
        return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hour}:${minute}`;
    };
    const updateTabCounts = () => {
      const counts = {
        all: totalCount.value,
        pending: allOrderList.value.filter((item) => item.order_status === "pending").length,
        paid: allOrderList.value.filter((item) => item.order_status === "paid").length,
        completed: allOrderList.value.filter((item) => item.order_status === "completed").length,
        cancelled: allOrderList.value.filter((item) => item.order_status === "cancelled").length
      };
      orderTabs.value.forEach((tab) => {
        tab.count = counts[tab.value] || 0;
      });
    };
    const loadData = async (isLoadMore = false) => {
      if (loading.value || !shopId.value || !userId.value)
        return;
      loading.value = true;
      try {
        const params = {
          UXMID: shopId.value,
          user_id: userId.value,
          page: currentPage.value,
          pageSize,
          order_status: void 0,
          show_deleted: false
        };
        const res = await api_index.getUserOrders(params);
        if (res.status === "success") {
          const newData = res.data.list || [];
          totalCount.value = res.data.total || 0;
          if (isLoadMore) {
            allOrderList.value = [...allOrderList.value, ...newData];
          } else {
            allOrderList.value = newData;
          }
          hasMore.value = allOrderList.value.length < totalCount.value;
          updateTabCounts();
        } else {
          hasMore.value = false;
          common_vendor.index.showToast({
            title: res.message || "获取订单失败",
            icon: "none"
          });
        }
      } catch (error) {
        hasMore.value = false;
        common_vendor.index.showToast({
          title: "网络请求失败，请稍后重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
        hasInitialized.value = true;
      }
    };
    const loadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      currentPage.value++;
      loadData(true);
    };
    const deleteOrder = async (order) => {
      if (!shopId.value || !userId.value || !order.order_id)
        return;
      try {
        const res = await common_vendor.index.showModal({
          title: "提示",
          content: "确定要删除该订单吗？删除后不可恢复。",
          confirmColor: "#ff6b3d"
        });
        if (!res.confirm)
          return;
        const response = await api_index.deleteUserOrder({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: order.order_id
        });
        if (response.status === "success") {
          common_vendor.index.showToast({
            title: "订单删除成功",
            icon: "success"
          });
          currentPage.value = 1;
          allOrderList.value = [];
          hasMore.value = true;
          await loadData();
        } else {
          common_vendor.index.showToast({
            title: response.message || "删除失败",
            icon: "none"
          });
        }
      } catch (error) {
        if (error !== "cancel") {
          common_vendor.index.showToast({
            title: "删除失败，请稍后重试",
            icon: "none"
          });
        }
      }
    };
    const switchTab = (value) => {
      currentTab.value = value;
    };
    const handleOrderClick = (item) => {
      currentDetail.value = item;
      showDetail.value = true;
    };
    const closeDetail = () => {
      showDetail.value = false;
      currentDetail.value = null;
    };
    const handleAction = (action, order) => {
      switch (action.action) {
        case "detail":
          currentDetail.value = order;
          showDetail.value = true;
          break;
        case "delete":
          deleteOrder(order);
          break;
      }
    };
    const goShopping = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index",
        fail: () => common_vendor.index.showToast({
          title: "页面跳转失败",
          icon: "none"
        })
      });
    };
    const handleSearch = () => {
      searchText.value = searchKeyword.value;
    };
    const handleSearchInput = (e) => {
      searchText.value = e.value || searchKeyword.value;
    };
    const handleClearSearch = () => {
      searchKeyword.value = "";
      searchText.value = "";
    };
    const blur = () => {
    };
    const focus = () => {
    };
    const onPageScroll = (e) => {
    };
    const onPullDownRefresh = async () => {
      currentPage.value = 1;
      searchKeyword.value = "";
      searchText.value = "";
      currentTab.value = "all";
      allOrderList.value = [];
      hasMore.value = true;
      await loadData();
      common_vendor.index.stopPullDownRefresh();
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
    __expose({
      onPullDownRefresh
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
      return common_vendor.e({
        a: common_vendor.o(handleSearch, "51"),
        b: common_vendor.o(blur, "3e"),
        c: common_vendor.o(focus, "d4"),
        d: common_vendor.o(handleSearchInput, "98"),
        e: common_vendor.o(handleClearSearch, "8a"),
        f: common_vendor.o(($event) => searchKeyword.value = $event, "53"),
        g: common_vendor.p({
          focus: false,
          placeholder: "请输入商品名称搜索",
          radius: 50,
          clearButton: "auto",
          cancelButton: "none",
          modelValue: searchKeyword.value
        }),
        h: common_vendor.f(orderTabs.value, (tab, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(tab.label),
            b: tab.count > 0
          }, tab.count > 0 ? {
            c: common_vendor.t(tab.count)
          } : {}, {
            d: tab.value,
            e: currentTab.value === tab.value ? 1 : "",
            f: common_vendor.o(($event) => switchTab(tab.value), tab.value)
          });
        }),
        i: common_vendor.f(filteredOrderList.value, (item, k0, i0) => {
          var _a2, _b2, _c2, _d2, _e2;
          return common_vendor.e({
            a: common_vendor.t(item.order_id),
            b: common_vendor.t(item.status_text || getStatusText(item.order_status)),
            c: common_vendor.n(getStatusClass(item.order_status)),
            d: getProductImage(item),
            e: common_vendor.t(getProductName(item)),
            f: item.order_type
          }, item.order_type ? {
            g: common_vendor.t(getOrderTypeText(item.order_type))
          } : {}, {
            h: common_vendor.t((_a2 = item.amount_info) == null ? void 0 : _a2.actual_amount),
            i: common_vendor.t(((_b2 = item.product_info) == null ? void 0 : _b2.quantity) || 1),
            j: "93207a4f-1-" + i0,
            k: common_vendor.t(formatTime((_c2 = item.time_info) == null ? void 0 : _c2.created_at)),
            l: common_vendor.t(((_d2 = item.product_info) == null ? void 0 : _d2.quantity) || 1),
            m: common_vendor.t((_e2 = item.amount_info) == null ? void 0 : _e2.total_amount),
            n: common_vendor.o(($event) => handleAction({
              action: "delete"
            }, item), item.order_id),
            o: common_vendor.o(($event) => handleAction({
              action: "detail"
            }, item), item.order_id),
            p: item.order_id,
            q: common_vendor.o(($event) => handleOrderClick(item), item.order_id)
          });
        }),
        j: common_vendor.p({
          type: "clock",
          size: "12",
          color: "#bbb"
        }),
        k: loading.value && filteredOrderList.value.length > 0
      }, loading.value && filteredOrderList.value.length > 0 ? {} : {}, {
        l: !hasMore.value && filteredOrderList.value.length > 0 && allOrderList.value.length > 0
      }, !hasMore.value && filteredOrderList.value.length > 0 && allOrderList.value.length > 0 ? {} : {}, {
        m: !loading.value && filteredOrderList.value.length === 0 && allOrderList.value.length > 0 && hasInitialized.value
      }, !loading.value && filteredOrderList.value.length === 0 && allOrderList.value.length > 0 && hasInitialized.value ? {
        n: common_assets._imports_0$1,
        o: common_vendor.t(currentTab.value === "all" ? "" : getStatusText(currentTab.value))
      } : {}, {
        p: !loading.value && allOrderList.value.length === 0 && hasInitialized.value
      }, !loading.value && allOrderList.value.length === 0 && hasInitialized.value ? {
        q: common_assets._imports_0$1,
        r: common_vendor.o(goShopping, "b7")
      } : {}, {
        s: loading.value && allOrderList.value.length === 0
      }, loading.value && allOrderList.value.length === 0 ? {} : {}, {
        t: common_vendor.o(loadMore, "2f"),
        v: common_vendor.o(onPageScroll, "6a"),
        w: showDetail.value
      }, showDetail.value ? {
        x: common_vendor.o(closeDetail, "4e")
      } : {}, {
        y: common_vendor.o(closeDetail, "eb"),
        z: currentDetail.value
      }, currentDetail.value ? common_vendor.e({
        A: common_vendor.t(currentDetail.value.order_id),
        B: common_vendor.t(currentDetail.value.status_text || getStatusText(currentDetail.value.order_status)),
        C: common_vendor.n(getStatusClass(currentDetail.value.order_status)),
        D: common_vendor.t(getProductName(currentDetail.value)),
        E: common_vendor.t(getOrderTypeText(currentDetail.value.order_type)),
        F: common_vendor.t(((_a = currentDetail.value.product_info) == null ? void 0 : _a.quantity) || 1),
        G: common_vendor.t((_b = currentDetail.value.product_info) == null ? void 0 : _b.unit_price),
        H: common_vendor.t((_c = currentDetail.value.amount_info) == null ? void 0 : _c.total_amount),
        I: common_vendor.t((_d = currentDetail.value.amount_info) == null ? void 0 : _d.discount_amount),
        J: common_vendor.t((_e = currentDetail.value.amount_info) == null ? void 0 : _e.actual_amount),
        K: common_vendor.t(formatTime((_f = currentDetail.value.time_info) == null ? void 0 : _f.created_at)),
        L: (_g = currentDetail.value.notes_info) == null ? void 0 : _g.cancelled_reason
      }, ((_h = currentDetail.value.notes_info) == null ? void 0 : _h.cancelled_reason) ? {
        M: common_vendor.t(currentDetail.value.notes_info.cancelled_reason)
      } : {}, {
        N: ((_i = currentDetail.value.payment_info) == null ? void 0 : _i.payment_method_text) && currentDetail.value.payment_info.payment_method_text !== "未知"
      }, ((_j = currentDetail.value.payment_info) == null ? void 0 : _j.payment_method_text) && currentDetail.value.payment_info.payment_method_text !== "未知" ? {
        O: common_vendor.t(currentDetail.value.payment_info.payment_method_text)
      } : {}, {
        P: (_k = currentDetail.value.payment_info) == null ? void 0 : _k.payment_time
      }, ((_l = currentDetail.value.payment_info) == null ? void 0 : _l.payment_time) ? {
        Q: common_vendor.t(currentDetail.value.payment_info.payment_time)
      } : {}) : {}, {
        R: showDetail.value ? 1 : ""
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-93207a4f"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/order.js.map
