"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const iconConfig = {
      system: "/static/image/message/notice.png",
      transaction: "/static/image/message/transaction.png",
      marketing: "/static/image/message/message.png",
      reminder: "/static/image/message/reminder.png",
      other: "/static/image/message/other.png"
    };
    const categoryConfigDefault = [
      {
        key: "system",
        label: "系统通知",
        icon: iconConfig.system
      },
      {
        key: "transaction",
        label: "交易通知",
        icon: iconConfig.transaction
      },
      {
        key: "marketing",
        label: "营销通知",
        icon: iconConfig.marketing
      },
      {
        key: "reminder",
        label: "提醒通知",
        icon: iconConfig.reminder
      },
      {
        key: "other",
        label: "其他通知",
        icon: iconConfig.other
      }
    ];
    const isLogin = common_vendor.ref(false);
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const loadingMore = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(50);
    const expandedCategory = common_vendor.ref("");
    const showModal = common_vendor.ref(false);
    const currentMessage = common_vendor.ref({});
    const messagesMap = common_vendor.reactive({
      system: [],
      transaction: [],
      social: [],
      marketing: [],
      reminder: [],
      other: []
    });
    const categoryConfig = common_vendor.computed(() => {
      return categoryConfigDefault.map((config) => {
        var _a, _b;
        const messages = messagesMap[config.key] || [];
        const unreadMessages = messages.filter((msg) => !msg.has_read);
        return {
          ...config,
          messages,
          count: messages.length,
          hasUnread: unreadMessages.length > 0,
          latestTime: ((_a = messages[0]) == null ? void 0 : _a.time) || "",
          latestTitle: ((_b = messages[0]) == null ? void 0 : _b.title) || ""
        };
      });
    });
    const categoryTypeMap = {
      system: "系统通知",
      transaction: "交易通知",
      marketing: "营销通知",
      reminder: "提醒通知",
      other: "其他通知"
    };
    const checkLoginStatus = () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      isLogin.value = !!(uxfid && uxfkey && shopid);
    };
    const fetchNotifications = async (isLoadMore = false) => {
      var _a;
      if (!token.value || !userId.value || !shopId.value)
        return;
      if (loading.value || isLoadMore && loadingMore.value)
        return;
      if (isLoadMore) {
        loadingMore.value = true;
      } else {
        loading.value = true;
        currentPage.value = 1;
      }
      try {
        const params = {
          UXMID: shopId.value,
          user_id: userId.value,
          currentPage: currentPage.value,
          pageSize: pageSize.value
        };
        const response = await api_index.getUserNotifications(params);
        if (response.status === "success") {
          const allNotifications = response.data.notifications || [];
          const pagination = response.data.pagination || {};
          hasMore.value = pagination.current_page < pagination.total_pages;
          const processedNotifications = allNotifications.map((msg) => ({
            ...msg,
            category: categoryTypeMap[msg.type] || "其他通知",
            time: formatTime(msg.created_at),
            fullTime: formatFullTime(msg.created_at)
          }));
          const categorized = categorizeNotifications(processedNotifications);
          if (isLoadMore) {
            Object.keys(categorized).forEach((key) => {
              messagesMap[key] = [...messagesMap[key], ...categorized[key]];
            });
          } else {
            Object.keys(messagesMap).forEach((key) => {
              messagesMap[key] = categorized[key] || [];
            });
          }
        } else {
          common_vendor.index.showToast({
            title: response.message || "获取通知失败",
            icon: "none"
          });
        }
      } catch (error) {
        const errorMsg = (error == null ? void 0 : error.message) || ((_a = error == null ? void 0 : error.data) == null ? void 0 : _a.message) || "获取通知失败";
        common_vendor.index.showToast({
          title: errorMsg,
          icon: "none"
        });
      } finally {
        loading.value = false;
        loadingMore.value = false;
      }
    };
    const categorizeNotifications = (notifications) => {
      const result = {
        system: [],
        transaction: [],
        social: [],
        marketing: [],
        reminder: [],
        other: []
      };
      notifications.forEach((msg) => {
        const type = msg.type || "other";
        if (result[type]) {
          result[type].push(msg);
        } else {
          result["other"].push(msg);
        }
      });
      return result;
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
        return "";
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      if (diff < 6e4)
        return "刚刚";
      if (diff < 36e5)
        return Math.floor(diff / 6e4) + "分钟前";
      if (diff < 864e5)
        return Math.floor(diff / 36e5) + "小时前";
      if (diff < 1728e5)
        return "昨天";
      if (diff < 6048e5)
        return Math.floor(diff / 864e5) + "天前";
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    };
    const formatFullTime = (timeStr) => {
      if (!timeStr)
        return "";
      const date = parseDate(timeStr);
      if (isNaN(date.getTime()))
        return timeStr;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };
    const handleLoadMore = () => {
      if (hasMore.value && !loadingMore.value) {
        currentPage.value++;
        fetchNotifications(true);
      }
    };
    const toggleCategory = (category) => {
      if (expandedCategory.value === category) {
        expandedCategory.value = "";
      } else {
        expandedCategory.value = category;
      }
    };
    const showMessageDetail = async (msg) => {
      currentMessage.value = msg;
      showModal.value = true;
      if (!msg.has_read) {
        try {
          const params = {
            UXMID: shopId.value,
            user_id: userId.value,
            notification_id: msg.notification_id
          };
          await api_index.markNotificationAsRead(params);
          msg.has_read = true;
        } catch (error) {
        }
      }
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const handleLogin = () => {
      setTimeout(() => {
        common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }, 100);
    };
    const handleRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register"
      });
    };
    common_vendor.onMounted(() => {
      checkLoginStatus();
      if (isLogin.value) {
        fetchNotifications();
      }
    });
    common_vendor.onShow(() => {
      checkLoginStatus();
      if (isLogin.value) {
        fetchNotifications();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !isLogin.value
      }, !isLogin.value ? {
        b: common_vendor.o(handleLogin, "82"),
        c: common_vendor.o(handleRegister, "9e")
      } : common_vendor.e({
        d: loading.value
      }, loading.value ? {} : common_vendor.e({
        e: common_vendor.f(categoryConfig.value, (category, k0, i0) => {
          return common_vendor.e({
            a: category.icon,
            b: common_vendor.n(category.key),
            c: common_vendor.t(category.label),
            d: category.hasUnread
          }, category.hasUnread ? {} : {}, {
            e: category.count > 0
          }, category.count > 0 ? {
            f: common_vendor.t(category.latestTime)
          } : {}, {
            g: common_vendor.t(category.latestTitle || "暂无通知"),
            h: category.hasUnread ? 1 : "",
            i: common_vendor.o(($event) => toggleCategory(category.key), category.key),
            j: category.messages.length > 0
          }, category.messages.length > 0 ? {
            k: common_vendor.f(category.messages, (msg, k1, i1) => {
              return common_vendor.e({
                a: !msg.has_read
              }, !msg.has_read ? {} : {}, {
                b: common_vendor.t(msg.title),
                c: !msg.has_read ? 1 : "",
                d: common_vendor.t(msg.time),
                e: msg.notification_id,
                f: common_vendor.o(($event) => showMessageDetail(msg), msg.notification_id)
              });
            })
          } : {
            l: common_vendor.t(category.label)
          }, {
            m: expandedCategory.value === category.key,
            n: category.key
          });
        }),
        f: hasMore.value && !loadingMore.value
      }, hasMore.value && !loadingMore.value ? {
        g: common_vendor.o(handleLoadMore, "b6")
      } : loadingMore.value ? {} : {}, {
        h: loadingMore.value
      })), {
        i: showModal.value
      }, showModal.value ? {
        j: common_vendor.t(currentMessage.value.category),
        k: common_vendor.o(closeModal, "ce"),
        l: currentMessage.value.metadata || "",
        m: common_vendor.o(closeModal, "95"),
        n: common_vendor.o(() => {
        }, "92"),
        o: common_vendor.o(closeModal, "15")
      } : {}, {
        p: common_vendor.o(handleLoadMore, "44")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/message.js.map
