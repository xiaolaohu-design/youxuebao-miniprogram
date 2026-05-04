"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
const wechatIcon = "/static/image/pay/wechat.png";
const balanceIcon = "/static/image/pay/balance.png";
const _sfc_main = {
  __name: "practice",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const isNightMode = common_vendor.ref(false);
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
    const showPurchaseBanner = common_vendor.ref(true);
    const bannerLoading = common_vendor.ref(false);
    const practicePrice = common_vendor.ref(null);
    const subjectLoading = common_vendor.ref(false);
    const subjectList = common_vendor.ref([]);
    const selectedSubject = common_vendor.ref(null);
    const selectionLabel = common_vendor.ref("");
    const childCountWithSelf = common_vendor.ref(0);
    const totalQuestionCount = common_vendor.ref(0);
    const completionRate = common_vendor.ref(0);
    const subjectChildCount = common_vendor.ref({});
    const orderId = common_vendor.ref("");
    const showPaymentModal = common_vendor.ref(false);
    const paymentLoading = common_vendor.ref(false);
    const paymentMethod = common_vendor.ref("wechat");
    const userBalance = common_vendor.ref(0);
    const userCouponList = common_vendor.ref([]);
    const selectedCoupon = common_vendor.ref(null);
    const showCouponList = common_vendor.ref(false);
    const isBalanceInsufficient = common_vendor.computed(() => {
      return userBalance.value < parseFloat(finalAmountWithCoupon.value);
    });
    const finalAmountWithCoupon = common_vendor.computed(() => {
      var _a, _b;
      const price = practicePrice.value || 0;
      const discount = ((_b = (_a = selectedCoupon.value) == null ? void 0 : _a.coupon_detail) == null ? void 0 : _b.discount_amount) || 0;
      return Math.max(0, price - discount).toFixed(2);
    });
    const availableCouponsCount = common_vendor.computed(() => {
      return userCouponList.value.filter((c) => isCouponAvailable(c)).length;
    });
    const payButtonText = common_vendor.computed(() => {
      if (paymentLoading.value)
        return "支付中...";
      if (paymentMethod.value === "balance") {
        return isBalanceInsufficient.value ? "余额不足" : `余额支付 ¥${finalAmountWithCoupon.value}`;
      }
      return `微信支付 ¥${finalAmountWithCoupon.value}`;
    });
    const payDisabled = common_vendor.computed(() => {
      if (paymentMethod.value === "balance" && isBalanceInsufficient.value)
        return true;
      return paymentLoading.value;
    });
    const cascaderSelected = common_vendor.ref([]);
    const cascaderColumns = common_vendor.ref([
      [],
      [],
      []
    ]);
    const tempSelectedSubject = common_vendor.ref(null);
    const tempSelectedPath = common_vendor.ref("");
    const initCascaderColumns = () => {
      cascaderColumns.value[0] = subjectList.value;
      cascaderColumns.value[1] = [];
      cascaderColumns.value[2] = [];
      cascaderSelected.value = [];
    };
    const onCascaderClick = (item, columnIndex) => {
      const newSelected = [...cascaderSelected.value];
      newSelected[columnIndex] = item.value;
      newSelected.splice(columnIndex + 1);
      cascaderSelected.value = newSelected;
      if (item.children && item.children.length > 0) {
        cascaderColumns.value[columnIndex + 1] = item.children;
        for (let i = columnIndex + 2; i < cascaderColumns.value.length; i++) {
          cascaderColumns.value[i] = [];
        }
      } else {
        for (let i = columnIndex + 1; i < cascaderColumns.value.length; i++) {
          cascaderColumns.value[i] = [];
        }
      }
      const valuePath = cascaderSelected.value.filter((v) => v !== void 0 && v !== null);
      if (valuePath.length > 0) {
        const selectedId = valuePath[valuePath.length - 1];
        tempSelectedSubject.value = selectedId;
        const result = findSubjectPathAndCount(subjectList.value, selectedId);
        if (result)
          tempSelectedPath.value = result.path;
      }
    };
    const restoreCascaderSelection = (subjectId) => {
      if (!subjectId || !subjectList.value.length)
        return;
      const findPath = (nodes, targetId, parentPath = []) => {
        for (const node of nodes) {
          const currentPath = [...parentPath, node.value];
          if (node.value === targetId)
            return {
              path: currentPath,
              node
            };
          if (node.children && node.children.length) {
            const found = findPath(node.children, targetId, currentPath);
            if (found)
              return found;
          }
        }
        return null;
      };
      initCascaderColumns();
      const result = findPath(subjectList.value, subjectId);
      if (result) {
        const valuePath = result.path;
        cascaderSelected.value = valuePath;
        let currentNodes = subjectList.value;
        for (let i = 0; i < valuePath.length - 1; i++) {
          const found = currentNodes.find((n) => n.value === valuePath[i]);
          if (found && found.children) {
            cascaderColumns.value[i + 1] = found.children;
            currentNodes = found.children;
          }
        }
      }
    };
    const chapterCascaderSelected = common_vendor.ref([]);
    const chapterCascaderColumns = common_vendor.ref([
      [],
      []
    ]);
    const chapterTempSubject = common_vendor.ref(null);
    const chapterTempPath = common_vendor.ref("");
    const initChapterCascaderColumns = () => {
      chapterCascaderColumns.value[0] = chapterOptions.value;
      chapterCascaderColumns.value[1] = [];
      chapterCascaderSelected.value = [];
    };
    const onChapterCascaderClick = (item, columnIndex) => {
      const newSelected = [...chapterCascaderSelected.value];
      newSelected[columnIndex] = item.value;
      newSelected.splice(columnIndex + 1);
      chapterCascaderSelected.value = newSelected;
      if (item.children && item.children.length > 0) {
        chapterCascaderColumns.value[columnIndex + 1] = item.children;
        for (let i = columnIndex + 2; i < chapterCascaderColumns.value.length; i++) {
          chapterCascaderColumns.value[i] = [];
        }
      } else {
        for (let i = columnIndex + 1; i < chapterCascaderColumns.value.length; i++) {
          chapterCascaderColumns.value[i] = [];
        }
      }
      const valuePath = chapterCascaderSelected.value.filter((v) => v !== void 0 && v !== null);
      if (valuePath.length > 0) {
        const selectedId = valuePath[valuePath.length - 1];
        chapterTempSubject.value = selectedId;
        const result = findSubjectPathAndCount(subjectList.value, selectedId);
        if (result)
          chapterTempPath.value = result.path;
      }
    };
    const practiceStats = common_vendor.ref({
      errors: 0,
      notes: 0,
      collections: 0,
      reviews: 0
    });
    const practiceRecordsData = common_vendor.ref([]);
    const questionLoading = common_vendor.ref(false);
    const questionList = common_vendor.ref([]);
    const hasMore = common_vendor.ref(true);
    const subjectPopup = common_vendor.ref(null);
    const chapterPopup = common_vendor.ref(null);
    const categoryPopup = common_vendor.ref(null);
    const statsPopup = common_vendor.ref(null);
    const chapterLoading = common_vendor.ref(false);
    const chapterOptions = common_vendor.ref([]);
    const tempSelectedCategory = common_vendor.ref([]);
    const categoryOptions = common_vendor.ref([
      {
        label: "单选题",
        value: "single_choice",
        icon: "smallcircle",
        color: "#FF6B35"
      },
      {
        label: "多选题",
        value: "multiple_choice",
        icon: "circle-filled",
        color: "#2C62EF"
      },
      {
        label: "判断题",
        value: "judgment",
        icon: "help",
        color: "#52C41A"
      },
      {
        label: "填空题",
        value: "fill_in_the_blank",
        icon: "compose",
        color: "#FAAD14"
      },
      {
        label: "简答题",
        value: "short_answer",
        icon: "chat",
        color: "#7B2FBE"
      }
    ]);
    const weeklyTrend = common_vendor.ref([]);
    const dailyTaskInfo = common_vendor.computed(() => {
      const today = (/* @__PURE__ */ new Date()).getDay();
      return today === 0 || today === 6 ? "每日特训" : "今日20题";
    });
    const getBarColorByCount = (count) => {
      if (count >= 5)
        return "#52C41A";
      if (count >= 3)
        return "#FF6B35";
      if (count >= 1)
        return "#FAAD14";
      return "#E8E8E8";
    };
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatCouponDate = (dateString) => {
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
    const isCouponAvailable = (userCoupon) => {
      const coupon = userCoupon.coupon_detail;
      if (userCoupon.status !== "unused")
        return false;
      if (!coupon.status)
        return false;
      if (coupon.end_time && parseDate(coupon.end_time) <= /* @__PURE__ */ new Date())
        return false;
      const price = practicePrice.value || 0;
      if (coupon.usage_limit > 0 && price < coupon.usage_limit)
        return false;
      return true;
    };
    const findSubjectPathAndCount = (subjects, targetId, path = [], countMap = {}) => {
      var _a;
      const len = (subjects == null ? void 0 : subjects.length) || 0;
      for (let i = 0; i < len; i++) {
        const subject = subjects[i];
        const currentPath = [...path, subject];
        const currentId = subject.value;
        const countAllChildren = (nodes) => {
          if (!nodes)
            return 0;
          let count = 0;
          const nodeLen = nodes.length;
          for (let j = 0; j < nodeLen; j++) {
            count += 1 + (nodes[j].children ? countAllChildren(nodes[j].children) : 0);
          }
          return count;
        };
        countMap[currentId] = countAllChildren(subject.children || []);
        if (subject.value === targetId) {
          return {
            node: subject,
            path: currentPath.map((n) => n.label).join("/"),
            countMap: {
              ...countMap
            }
          };
        }
        if ((_a = subject.children) == null ? void 0 : _a.length) {
          const found = findSubjectPathAndCount(subject.children, targetId, currentPath, countMap);
          if (found)
            return found;
        }
      }
      return null;
    };
    const calculateChildCount = (id) => {
      const currentId = id ? String(id) : "";
      childCountWithSelf.value = subjectChildCount.value[currentId] !== void 0 ? subjectChildCount.value[currentId] + 1 : 0;
    };
    const selectCoupon = (userCoupon) => {
      if (!isCouponAvailable(userCoupon)) {
        common_vendor.index.showToast({
          title: "该优惠券不可使用",
          icon: "none"
        });
        return;
      }
      selectedCoupon.value = userCoupon;
      showCouponList.value = false;
    };
    const clearCoupon = () => {
      selectedCoupon.value = null;
      showCouponList.value = false;
    };
    const toggleCouponList = () => {
      showCouponList.value = !showCouponList.value;
    };
    const fetchUserBalance = async () => {
      if (!isLogin.value || !shopId.value)
        return;
      try {
        const response = await api_index.getMemberData({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (response.data) {
          let balance = 0;
          if (response.data.balance !== void 0 && response.data.balance !== null) {
            balance = Number(response.data.balance);
            if (isNaN(balance))
              balance = 0;
          }
          userBalance.value = balance;
        }
      } catch (error) {
        userBalance.value = 0;
      }
    };
    const getUserCouponData = async () => {
      if (!isLogin.value || !shopId.value)
        return;
      try {
        const response = await api_index.getUserCoupons({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (response.status === "success" && Array.isArray(response.data)) {
          const now = /* @__PURE__ */ new Date();
          userCouponList.value = response.data.filter((userCoupon) => {
            const coupon = userCoupon.coupon_detail;
            if (userCoupon.status !== "unused")
              return false;
            if (!coupon.status)
              return false;
            if (coupon.end_time && parseDate(coupon.end_time) <= now)
              return false;
            const price = practicePrice.value || 0;
            if (coupon.usage_limit > 0 && price < coupon.usage_limit)
              return false;
            return true;
          });
        }
      } catch (error) {
        userCouponList.value = [];
      }
    };
    const openPaymentModal = async () => {
      showPaymentModal.value = true;
      paymentMethod.value = "wechat";
      selectedCoupon.value = null;
      showCouponList.value = false;
      await Promise.all([fetchUserBalance(), getUserCouponData()]);
    };
    const closePaymentModal = () => {
      showPaymentModal.value = false;
      orderId.value = null;
      selectedCoupon.value = null;
      showCouponList.value = false;
    };
    const handlePaymentMaskClick = () => {
      closePaymentModal();
    };
    const handleWechatPay = async () => {
      var _a;
      paymentLoading.value = true;
      try {
        const response = await api_index.processPayment({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: orderId.value,
          payment_method: "wechat",
          user_coupon_id: ((_a = selectedCoupon.value) == null ? void 0 : _a.user_coupon_id) || null,
          amount: finalAmountWithCoupon.value
        });
        if (response.status === "success" && response.data) {
          const payParams = response.data.pay_params || response.data;
          const formattedParams = {
            provider: "wxpay",
            timeStamp: String(payParams.timeStamp || ""),
            nonceStr: String(payParams.nonceStr || ""),
            package: String(payParams.package || ""),
            signType: String(payParams.signType || "MD5"),
            paySign: String(payParams.paySign || "")
          };
          if (!formattedParams.timeStamp || !formattedParams.nonceStr || !formattedParams.package || !formattedParams.paySign) {
            common_vendor.index.showToast({
              title: "支付参数不完整",
              icon: "none",
              duration: 3e3
            });
            return;
          }
          if (!formattedParams.package.startsWith("prepay_id=")) {
            common_vendor.index.showToast({
              title: "支付参数格式错误",
              icon: "none",
              duration: 3e3
            });
            return;
          }
          common_vendor.index.requestPayment({
            ...formattedParams,
            success: () => {
              showPurchaseBanner.value = false;
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              closePaymentModal();
              getPracticeModulePrice();
            },
            fail: (err) => {
              if (err.errMsg.includes("cancel")) {
                common_vendor.index.showToast({
                  title: "支付已取消",
                  icon: "none"
                });
              } else if (err.errMsg.includes("fail_no permission")) {
                common_vendor.index.showToast({
                  title: "支付权限不足",
                  icon: "none",
                  duration: 3e3
                });
              } else {
                common_vendor.index.showToast({
                  title: "支付失败",
                  icon: "none",
                  duration: 3e3
                });
              }
            }
          });
        } else {
          common_vendor.index.showToast({
            title: response.message || "获取支付参数失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "支付请求失败",
          icon: "none"
        });
      } finally {
        paymentLoading.value = false;
      }
    };
    const handleBalancePay = async () => {
      var _a;
      if (isBalanceInsufficient.value) {
        common_vendor.index.showToast({
          title: "余额不足，请选择其他支付方式",
          icon: "none"
        });
        return;
      }
      paymentLoading.value = true;
      try {
        const response = await api_index.processPayment({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: orderId.value,
          payment_method: "balance",
          user_coupon_id: ((_a = selectedCoupon.value) == null ? void 0 : _a.user_coupon_id) || null,
          amount: finalAmountWithCoupon.value
        });
        if (response.status === "success") {
          showPurchaseBanner.value = false;
          common_vendor.index.showToast({
            title: "支付成功",
            icon: "success"
          });
          closePaymentModal();
          getPracticeModulePrice();
        } else {
          common_vendor.index.showToast({
            title: response.message || "余额支付失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "支付请求失败",
          icon: "none"
        });
      } finally {
        paymentLoading.value = false;
      }
    };
    const confirmPay = async () => {
      if (paymentMethod.value === "balance") {
        await handleBalancePay();
      } else {
        await handleWechatPay();
      }
    };
    const loadSubjectData = async () => {
      if (!checkLoginStatus())
        return;
      subjectLoading.value = true;
      try {
        const response = await api_index.getSubjectCategory(shopId.value);
        if (response.data) {
          subjectList.value = response.data;
          initCascaderColumns();
        }
      } catch (error) {
      } finally {
        subjectLoading.value = false;
      }
    };
    const loadSubjectSelection = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value
        };
        const response = await api_index.getSubjectSelection(formData);
        if (response.data && response.data.subjectData) {
          selectedSubject.value = Number(response.data.subjectData);
          subjectChildCount.value = {};
          const foundSubject = findSubjectPathAndCount(subjectList.value, selectedSubject.value);
          if (foundSubject) {
            selectionLabel.value = foundSubject.path;
            subjectChildCount.value = foundSubject.countMap;
            calculateChildCount(selectedSubject.value);
          }
          restoreCascaderSelection(selectedSubject.value);
        }
      } catch (error) {
      }
    };
    const loadPracticeRecordsFromApi = async () => {
      if (!checkLoginStatus() || !selectedSubject.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          category: selectedSubject.value
        };
        const response = await api_index.getPracticeRecords(formData);
        let errors = 0, collected = 0, notes = 0, totalQuestions = 0, correctAnswers = 0;
        if (response.data && response.data.length > 0) {
          practiceRecordsData.value = response.data;
          for (const item of response.data) {
            totalQuestions++;
            if (item.is_correct === 0)
              errors++;
            if (item.is_collected === 1)
              collected++;
            if (item.notes && item.notes.trim() !== "")
              notes++;
            if (item.is_correct === 1)
              correctAnswers++;
          }
        }
        practiceStats.value = {
          errors,
          notes,
          collections: collected,
          reviews: totalQuestions
        };
        completionRate.value = totalQuestions > 0 ? Math.round(correctAnswers / totalQuestions * 100) : 0;
      } catch (error) {
      }
    };
    const loadWeeklyTrend = () => {
      const today = /* @__PURE__ */ new Date();
      const days = [];
      const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        days.push({
          day: dayNames[date.getDay()],
          dateStr: date.toISOString().split("T")[0],
          count: 0
        });
      }
      if (!practiceRecordsData.value || practiceRecordsData.value.length === 0) {
        weeklyTrend.value = days.map((d) => ({
          day: d.day,
          count: 0,
          rate: 0
        }));
        return;
      }
      const countMap = {};
      practiceRecordsData.value.forEach((record) => {
        if (record.correct_time) {
          const dateStr = record.correct_time.split(" ")[0];
          countMap[dateStr] = (countMap[dateStr] || 0) + 1;
        }
      });
      const maxCount = Math.max(...days.map((d) => countMap[d.dateStr] || 0), 1);
      weeklyTrend.value = days.map((d) => ({
        day: d.day,
        count: countMap[d.dateStr] || 0,
        rate: Math.round((countMap[d.dateStr] || 0) / maxCount * 100)
      }));
    };
    const loadChapterData = async () => {
      chapterLoading.value = true;
      try {
        const findTargetNode = (nodes, subjectId) => {
          for (const node of nodes) {
            if (node.value === subjectId)
              return node;
            if (node.children) {
              const found = findTargetNode(node.children, subjectId);
              if (found)
                return found;
            }
          }
          return null;
        };
        const formatNodeStructure = (node) => {
          var _a;
          return {
            value: node.value,
            label: node.label,
            children: ((_a = node.children) == null ? void 0 : _a.map(formatNodeStructure)) || []
          };
        };
        const targetNode = findTargetNode(subjectList.value, selectedSubject.value);
        chapterOptions.value = targetNode ? [JSON.parse(JSON.stringify(formatNodeStructure(targetNode)))] : [];
      } finally {
        chapterLoading.value = false;
      }
    };
    const loadQuestionList = async (refresh = false) => {
      if (questionLoading.value)
        return;
      questionLoading.value = true;
      try {
        if (refresh)
          questionList.value = [];
        const params = {
          UXMID: shopId.value,
          user_id: userId.value,
          category: selectedSubject.value
        };
        const response = await api_index.fetchPracticeQuestionBankList(params);
        if (response.status === "success" && response.data) {
          totalQuestionCount.value = response.total || response.data.length || 0;
          const stripHtml = (html) => {
            if (!html)
              return "";
            return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&ldquo;/g, '"').replace(
              /&rdquo;/g,
              '"'
            ).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(
              /\s+/g,
              " "
            ).trim();
          };
          let formattedList = response.data.map((item) => ({
            id: item.question_id,
            name: stripHtml(item.title) || "无标题",
            description: item.description ? stripHtml(item.description).substring(0, 100) : stripHtml(item.title).substring(0, 100) || "暂无描述",
            viewCount: item.view_count || 0,
            favoriteCount: item.favorite_count || 0,
            questionType: item.question_type,
            difficulty: item.difficulty,
            categoryLabels: item.categoryLabels || [],
            createdAt: item.created_at || "",
            rawData: item
          }));
          formattedList.sort((a, b) => {
            const parseDate2 = (dateStr) => {
              if (!dateStr)
                return NaN;
              const normalized = String(dateStr).replace(/-/g, "/");
              return new Date(normalized).getTime();
            };
            const dateA = parseDate2(a.createdAt);
            const dateB = parseDate2(b.createdAt);
            if (isNaN(dateA) && isNaN(dateB))
              return 0;
            if (isNaN(dateA))
              return 1;
            if (isNaN(dateB))
              return -1;
            return dateB - dateA;
          });
          questionList.value = formattedList.slice(0, 20);
          hasMore.value = false;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        questionLoading.value = false;
      }
    };
    const loadMore = () => {
      if (questionLoading.value)
        return;
      if (!hasMore.value)
        return;
    };
    const refreshSubjectData = () => {
      common_vendor.index.showLoading({
        title: "刷新数据...",
        mask: true
      });
      Promise.all([loadPracticeRecordsFromApi(), loadQuestionList(true)]).then(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "数据已更新",
          icon: "success",
          duration: 1500
        });
      }).catch(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "刷新失败，请重试",
          icon: "none",
          duration: 1500
        });
      });
    };
    const getPracticeModulePrice = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          product_type: "practice"
        };
        const response = await api_index.checkPracticePurchaseStatus(formData);
        if (response.status === "success" && response.data) {
          if (response.data.has_purchased || response.data.can_access) {
            showPurchaseBanner.value = false;
            return;
          }
          if (response.data.price_info) {
            practicePrice.value = response.data.price_info.discounted_price || response.data.price_info.original_price;
          }
        }
      } catch (error) {
      }
    };
    const checkPracticeAccess = async (practiceType) => {
      var _a;
      if (!checkLoginStatus()) {
        return {
          hasAccess: false,
          reason: "",
          action: "login"
        };
      }
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          product_type: "practice"
        };
        const response = await api_index.checkPracticePurchaseStatus(formData);
        if (response.status === "success" && response.data) {
          if (response.data.has_purchased || response.data.can_access) {
            return {
              hasAccess: true,
              reason: "",
              action: "proceed"
            };
          }
          const price = ((_a = response.data.price_info) == null ? void 0 : _a.discounted_price) || 10;
          return {
            hasAccess: false,
            reason: `${getPracticeTitle(practiceType)}需要购买权限`,
            action: "payment",
            price,
            purchaseStatus: response.data
          };
        }
      } catch (error) {
      }
      return {
        hasAccess: false,
        reason: "权限检查失败",
        action: "showMessage"
      };
    };
    const getPracticeTitle = (practiceType) => {
      const titleMap = {
        errors: "我的错题",
        notes: "我的笔记",
        collections: "我的收藏",
        reviews: "习题回顾",
        days: "每日一练",
        order: "顺序练习",
        random: "随机练习",
        chapter: "章节练习",
        category: "题型练习",
        previous: "历年真题",
        exam: "模拟考试",
        mistakes: "易错练习"
      };
      return titleMap[practiceType] || "练习";
    };
    const handleBannerPurchase = async () => {
      if (!checkLoginStatus())
        return;
      bannerLoading.value = true;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          order_type: "practice",
          product_type: "practice",
          product_id: "all_subjects_package",
          product_name: "全科目刷题包",
          unit_price: practicePrice.value || 29.9,
          quantity: 1,
          expire_time: 24
        };
        const response = await api_index.createOrder(formData);
        if (response.status === "success") {
          orderId.value = response.data.order_id;
          openPaymentModal();
        } else {
          common_vendor.index.showToast({
            title: response.message || "创建订单失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "购买失败，请重试",
          icon: "none"
        });
      } finally {
        bannerLoading.value = false;
      }
    };
    const showSubjectDialog = () => {
      var _a;
      if (selectedSubject.value) {
        restoreCascaderSelection(selectedSubject.value);
        tempSelectedSubject.value = selectedSubject.value;
        tempSelectedPath.value = selectionLabel.value;
      } else {
        initCascaderColumns();
        tempSelectedSubject.value = null;
        tempSelectedPath.value = "";
      }
      (_a = subjectPopup.value) == null ? void 0 : _a.open();
    };
    const closeSubjectDialog = () => {
      var _a;
      (_a = subjectPopup.value) == null ? void 0 : _a.close();
    };
    const confirmSubject = async () => {
      if (!tempSelectedSubject.value) {
        common_vendor.index.showToast({
          title: "请选择科目",
          icon: "none"
        });
        return;
      }
      if (!checkLoginStatus())
        return;
      common_vendor.index.showLoading({
        title: "切换中..."
      });
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          subject_id: tempSelectedSubject.value
        };
        await api_index.saveSubjectSelection(formData);
        selectedSubject.value = Number(tempSelectedSubject.value);
        selectionLabel.value = tempSelectedPath.value;
        const result = findSubjectPathAndCount(subjectList.value, selectedSubject.value);
        if (result) {
          subjectChildCount.value = result.countMap;
          calculateChildCount(selectedSubject.value);
        }
        await loadPracticeRecordsFromApi();
        await loadQuestionList(true);
        closeSubjectDialog();
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "科目切换成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "切换失败，请重试",
          icon: "none"
        });
      }
    };
    const showChapterDialog = async () => {
      var _a;
      await loadChapterData();
      initChapterCascaderColumns();
      chapterTempSubject.value = null;
      chapterTempPath.value = "";
      (_a = chapterPopup.value) == null ? void 0 : _a.open();
    };
    const closeChapterDialog = () => {
      var _a;
      (_a = chapterPopup.value) == null ? void 0 : _a.close();
    };
    const confirmChapter = () => {
      if (!chapterTempSubject.value) {
        common_vendor.index.showToast({
          title: "请选择章节",
          icon: "none"
        });
        return;
      }
      closeChapterDialog();
      const params = `type=chapter&subjectId=${selectedSubject.value}&chapterId=${chapterTempSubject.value}`;
      common_vendor.index.navigateTo({
        url: `/pages/practice/practicedetail?${params}`
      });
    };
    const showCategoryDialog = () => {
      var _a;
      tempSelectedCategory.value = [];
      (_a = categoryPopup.value) == null ? void 0 : _a.open();
    };
    const closeCategoryDialog = () => {
      var _a;
      (_a = categoryPopup.value) == null ? void 0 : _a.close();
    };
    const toggleCategory = (value) => {
      const index = tempSelectedCategory.value.indexOf(value);
      if (index > -1)
        tempSelectedCategory.value.splice(index, 1);
      else
        tempSelectedCategory.value.push(value);
    };
    const confirmCategory = () => {
      if (tempSelectedCategory.value.length === 0) {
        common_vendor.index.showToast({
          title: "请至少选择一种题型",
          icon: "none"
        });
        return;
      }
      closeCategoryDialog();
      const params = `type=category&subjectId=${selectedSubject.value}&categories=${tempSelectedCategory.value.join(",")}`;
      common_vendor.index.navigateTo({
        url: `/pages/practice/practicedetail?${params}`
      });
    };
    const showStatsDialog = () => {
      var _a;
      loadWeeklyTrend();
      (_a = statsPopup.value) == null ? void 0 : _a.open();
    };
    const closeStatsDialog = () => {
      var _a;
      (_a = statsPopup.value) == null ? void 0 : _a.close();
    };
    const goToPractice = async (type) => {
      const needsCheck = [
        "errors",
        "notes",
        "collections",
        "reviews",
        "days",
        "order",
        "random",
        "chapter",
        "category",
        "previous",
        "exam",
        "mistakes"
      ];
      if (needsCheck.includes(type)) {
        const accessResult = await checkPracticeAccess(type);
        if (!accessResult.hasAccess) {
          if (accessResult.action === "login") {
            common_vendor.index.navigateTo({
              url: "/pages/login/login"
            });
            return;
          } else if (accessResult.action === "payment") {
            common_vendor.index.showModal({
              title: "提示",
              content: `${getPracticeTitle(type)}需要购买权限，是否立即购买？`,
              success: (res) => {
                if (res.confirm)
                  handleBannerPurchase();
              }
            });
            return;
          } else {
            common_vendor.index.showToast({
              title: accessResult.reason || "暂无访问权限",
              icon: "none"
            });
            return;
          }
        }
      }
      if (type === "chapter")
        showChapterDialog();
      else if (type === "category")
        showCategoryDialog();
      else {
        const params = `type=${type}&subjectId=${selectedSubject.value || ""}`;
        common_vendor.index.navigateTo({
          url: `/pages/practice/practicedetail?${params}`
        });
      }
    };
    const goToQuestion = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/practice/titledetail?questionid=${item.id}`
      });
    };
    common_vendor.onMounted(async () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      isLogin.value = !!(uxfid && uxfkey && shopid);
      const savedMode = common_vendor.index.getStorageSync("practice_night_mode");
      if (savedMode !== "")
        isNightMode.value = savedMode;
      if (!isLogin.value) {
        checkLoginStatus();
        return;
      }
      common_vendor.index.showLoading({
        title: "加载中..."
      });
      try {
        await loadSubjectData();
        await loadSubjectSelection();
        await loadPracticeRecordsFromApi();
        await getPracticeModulePrice();
        await loadQuestionList(true);
      } catch (error) {
        common_vendor.index.showToast({
          title: "加载失败，请下拉刷新",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    });
    common_vendor.onShow(() => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      isLogin.value = !!(uxfid && uxfkey && shopid);
      if (!isLogin.value)
        return;
      if (isLogin.value && selectedSubject.value)
        loadPracticeRecordsFromApi();
    });
    common_vendor.watch(selectedSubject, (newVal) => {
      if (newVal) {
        loadPracticeRecordsFromApi();
        loadQuestionList(true);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: showPurchaseBanner.value
      }, showPurchaseBanner.value ? common_vendor.e({
        b: practicePrice.value
      }, practicePrice.value ? {
        c: common_vendor.t(practicePrice.value)
      } : {}, {
        d: common_vendor.t(bannerLoading.value ? "加载中" : "立即开通"),
        e: !bannerLoading.value
      }, !bannerLoading.value ? {
        f: common_vendor.p({
          type: "right",
          size: "14",
          color: "#FF6B35"
        })
      } : {}, {
        g: bannerLoading.value,
        h: common_vendor.o(handleBannerPurchase, "d5"),
        i: common_vendor.p({
          type: "checkbox-filled",
          size: "14",
          color: "#fff"
        }),
        j: common_vendor.p({
          type: "checkbox-filled",
          size: "14",
          color: "#fff"
        }),
        k: common_vendor.p({
          type: "checkbox-filled",
          size: "14",
          color: "#fff"
        })
      }) : {}, {
        l: common_vendor.p({
          type: "vip-filled",
          size: "48",
          color: "#FF6B35"
        }),
        m: subjectLoading.value ? 1 : "",
        n: common_vendor.t(selectionLabel.value || "请选择科目"),
        o: common_vendor.p({
          type: "exchange",
          size: "14",
          color: "#FF6B35"
        }),
        p: common_vendor.o(showSubjectDialog, "2d"),
        q: common_vendor.t(subjectLoading.value ? "--" : childCountWithSelf.value),
        r: common_vendor.t(subjectLoading.value ? "--" : totalQuestionCount.value),
        s: common_vendor.t(subjectLoading.value ? "--" : completionRate.value),
        t: (subjectLoading.value ? 0 : completionRate.value) + "%",
        v: common_vendor.o(refreshSubjectData, "e2"),
        w: common_vendor.p({
          type: "person",
          size: "24",
          color: "#FF6B35"
        }),
        x: common_vendor.p({
          type: "clear",
          size: "32",
          color: "#FF4D4F"
        }),
        y: common_vendor.t(practiceStats.value.errors),
        z: common_vendor.o(($event) => goToPractice("errors"), "fc"),
        A: common_vendor.p({
          type: "compose",
          size: "32",
          color: "#FAAD14"
        }),
        B: common_vendor.t(practiceStats.value.notes),
        C: common_vendor.o(($event) => goToPractice("notes"), "4a"),
        D: common_vendor.p({
          type: "heart-filled",
          size: "32",
          color: "#EB2F96"
        }),
        E: common_vendor.t(practiceStats.value.collections),
        F: common_vendor.o(($event) => goToPractice("collections"), "11"),
        G: common_vendor.p({
          type: "map-filled",
          size: "32",
          color: "#1890FF"
        }),
        H: common_vendor.t(practiceStats.value.reviews),
        I: common_vendor.o(($event) => goToPractice("reviews"), "ea"),
        J: common_vendor.p({
          type: "chart-filled",
          size: "24",
          color: "#FF6B35"
        }),
        K: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999"
        }),
        L: common_vendor.o(showStatsDialog, "b8"),
        M: common_vendor.p({
          type: "flag-filled",
          size: "24",
          color: "#2C62EF"
        }),
        N: common_vendor.p({
          type: "calendar-filled",
          size: "32",
          color: "#fff"
        }),
        O: common_vendor.t(dailyTaskInfo.value),
        P: common_vendor.o(($event) => goToPractice("days"), "80"),
        Q: common_vendor.p({
          type: "list",
          size: "32",
          color: "#fff"
        }),
        R: common_vendor.o(($event) => goToPractice("order"), "c8"),
        S: common_vendor.p({
          type: "refresh-filled",
          size: "32",
          color: "#fff"
        }),
        T: common_vendor.o(($event) => goToPractice("random"), "57"),
        U: common_vendor.p({
          type: "tune-filled",
          size: "32",
          color: "#fff"
        }),
        V: common_vendor.o(($event) => goToPractice("chapter"), "f0"),
        W: common_vendor.p({
          type: "paperplane-filled",
          size: "32",
          color: "#fff"
        }),
        X: common_vendor.o(($event) => goToPractice("category"), "44"),
        Y: common_vendor.p({
          type: "star-filled",
          size: "32",
          color: "#fff"
        }),
        Z: common_vendor.o(($event) => goToPractice("previous"), "e4"),
        aa: common_vendor.p({
          type: "medal-filled",
          size: "32",
          color: "#fff"
        }),
        ab: common_vendor.o(($event) => goToPractice("exam"), "40"),
        ac: common_vendor.p({
          type: "help-filled",
          size: "32",
          color: "#fff"
        }),
        ad: common_vendor.o(($event) => goToPractice("mistakes"), "c4"),
        ae: questionList.value.length > 0
      }, questionList.value.length > 0 ? common_vendor.e({
        af: common_vendor.p({
          type: "gift-filled",
          size: "18",
          color: "#52C41A"
        }),
        ag: common_vendor.f(questionList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(index + 1),
            b: index < 3 ? 1 : "",
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.description),
            e: item.questionType
          }, item.questionType ? {
            f: common_vendor.t(item.questionType)
          } : {}, {
            g: item.difficulty
          }, item.difficulty ? {
            h: common_vendor.t(item.difficulty)
          } : {}, {
            i: "338bd53f-23-" + i0,
            j: item.id,
            k: common_vendor.o(($event) => goToQuestion(item), item.id)
          });
        }),
        ah: common_vendor.p({
          type: "right",
          size: "14",
          color: "#ccc"
        }),
        ai: questionLoading.value
      }, questionLoading.value ? {
        aj: common_vendor.p({
          type: "spinner-cycle",
          size: "16",
          color: "#999"
        })
      } : !hasMore.value && questionList.value.length > 0 ? {} : {}, {
        ak: !hasMore.value && questionList.value.length > 0
      }) : {}, {
        al: common_vendor.o(loadMore, "e7"),
        am: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        an: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        ao: common_vendor.o(closePaymentModal, "a3"),
        ap: common_vendor.t(practicePrice.value || 0),
        aq: common_vendor.t(availableCouponsCount.value),
        ar: selectedCoupon.value
      }, selectedCoupon.value ? {
        as: common_vendor.t(selectedCoupon.value.coupon_detail.name),
        at: common_vendor.t(selectedCoupon.value.coupon_detail.discount_amount)
      } : {}, {
        av: selectedCoupon.value
      }, selectedCoupon.value ? {
        aw: common_vendor.o(clearCoupon, "47")
      } : {}, {
        ax: common_vendor.p({
          type: showCouponList.value ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        ay: common_vendor.o(toggleCouponList, "3a"),
        az: common_vendor.f(userCouponList.value, (userCoupon, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: common_vendor.t(userCoupon.coupon_detail.discount_amount),
            b: common_vendor.t(userCoupon.coupon_detail.name),
            c: userCoupon.coupon_detail.usage_limit > 0
          }, userCoupon.coupon_detail.usage_limit > 0 ? {
            d: common_vendor.t(userCoupon.coupon_detail.usage_limit)
          } : {}, {
            e: common_vendor.t(formatCouponDate(userCoupon.coupon_detail.end_time)),
            f: ((_a = selectedCoupon.value) == null ? void 0 : _a.user_coupon_id) === userCoupon.user_coupon_id
          }, ((_b = selectedCoupon.value) == null ? void 0 : _b.user_coupon_id) === userCoupon.user_coupon_id ? {
            g: "338bd53f-27-" + i0,
            h: common_vendor.p({
              type: "checkmarkempty",
              size: "16",
              color: "#ffffff"
            })
          } : {}, {
            i: userCoupon.user_coupon_id,
            j: ((_c = selectedCoupon.value) == null ? void 0 : _c.user_coupon_id) === userCoupon.user_coupon_id ? 1 : "",
            k: !isCouponAvailable(userCoupon) ? 1 : "",
            l: common_vendor.o(($event) => selectCoupon(userCoupon), userCoupon.user_coupon_id)
          });
        }),
        aA: userCouponList.value.length === 0
      }, userCouponList.value.length === 0 ? {} : {}, {
        aB: showCouponList.value,
        aC: balanceIcon,
        aD: isBalanceInsufficient.value
      }, isBalanceInsufficient.value ? {} : {
        aE: common_vendor.t(userBalance.value.toFixed(2))
      }, {
        aF: paymentMethod.value === "balance" ? 1 : "",
        aG: paymentMethod.value === "balance" ? 1 : "",
        aH: isBalanceInsufficient.value ? 1 : "",
        aI: common_vendor.o(($event) => !isBalanceInsufficient.value && (paymentMethod.value = "balance"), "77"),
        aJ: wechatIcon,
        aK: paymentMethod.value === "wechat" ? 1 : "",
        aL: paymentMethod.value === "wechat" ? 1 : "",
        aM: common_vendor.o(($event) => paymentMethod.value = "wechat", "b3"),
        aN: common_vendor.t(practicePrice.value || 0),
        aO: selectedCoupon.value
      }, selectedCoupon.value ? {
        aP: common_vendor.t(selectedCoupon.value.coupon_detail.discount_amount)
      } : {}, {
        aQ: common_vendor.t(finalAmountWithCoupon.value),
        aR: common_vendor.t(payButtonText.value),
        aS: common_vendor.o(confirmPay, "dc"),
        aT: payDisabled.value,
        aU: paymentLoading.value,
        aV: common_vendor.o(() => {
        }, "f3"),
        aW: common_vendor.o(handlePaymentMaskClick, "ad")
      }) : {}, {
        aX: common_vendor.o(closeSubjectDialog, "5a"),
        aY: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        aZ: subjectList.value.length === 0
      }, subjectList.value.length === 0 ? {
        ba: common_assets._imports_0$4,
        bb: common_vendor.o(loadSubjectData, "ab")
      } : common_vendor.e({
        bc: common_vendor.f(subjectList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: cascaderSelected.value[0] === item.value ? 1 : "",
            d: common_vendor.o(($event) => onCascaderClick(item, 0), item.value)
          };
        }),
        bd: cascaderColumns.value[1] && cascaderColumns.value[1].length > 0
      }, cascaderColumns.value[1] && cascaderColumns.value[1].length > 0 ? {
        be: common_vendor.f(cascaderColumns.value[1], (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: cascaderSelected.value[1] === item.value ? 1 : "",
            d: common_vendor.o(($event) => onCascaderClick(item, 1), item.value)
          };
        })
      } : {}, {
        bf: cascaderColumns.value[2] && cascaderColumns.value[2].length > 0
      }, cascaderColumns.value[2] && cascaderColumns.value[2].length > 0 ? {
        bg: common_vendor.f(cascaderColumns.value[2], (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: cascaderSelected.value[2] === item.value ? 1 : "",
            d: common_vendor.o(($event) => onCascaderClick(item, 2), item.value)
          };
        })
      } : {}), {
        bh: common_vendor.t(tempSelectedPath.value || "暂未选择"),
        bi: common_vendor.o(closeSubjectDialog, "9f"),
        bj: common_vendor.o(confirmSubject, "32"),
        bk: !tempSelectedSubject.value,
        bl: common_vendor.sr(subjectPopup, "338bd53f-28", {
          "k": "subjectPopup"
        }),
        bm: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        bn: common_vendor.o(closeChapterDialog, "80"),
        bo: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        bp: chapterLoading.value
      }, chapterLoading.value ? {
        bq: common_vendor.p({
          type: "spinner-cycle",
          size: "20",
          color: "#FF6B35"
        })
      } : chapterOptions.value.length === 0 ? {
        bs: common_assets._imports_1$1
      } : common_vendor.e({
        bt: common_vendor.f(chapterOptions.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: chapterCascaderSelected.value[0] === item.value ? 1 : "",
            d: common_vendor.o(($event) => onChapterCascaderClick(item, 0), item.value)
          };
        }),
        bv: chapterCascaderColumns.value[1] && chapterCascaderColumns.value[1].length > 0
      }, chapterCascaderColumns.value[1] && chapterCascaderColumns.value[1].length > 0 ? {
        bw: common_vendor.f(chapterCascaderColumns.value[1], (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.value,
            c: chapterCascaderSelected.value[1] === item.value ? 1 : "",
            d: common_vendor.o(($event) => onChapterCascaderClick(item, 1), item.value)
          };
        })
      } : {}), {
        br: chapterOptions.value.length === 0,
        bx: common_vendor.t(chapterTempPath.value || "暂未选择"),
        by: common_vendor.o(closeChapterDialog, "09"),
        bz: common_vendor.o(confirmChapter, "f7"),
        bA: !chapterTempSubject.value,
        bB: common_vendor.sr(chapterPopup, "338bd53f-30", {
          "k": "chapterPopup"
        }),
        bC: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        bD: common_vendor.o(closeCategoryDialog, "95"),
        bE: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        bF: common_vendor.f(categoryOptions.value, (item, k0, i0) => {
          return {
            a: "338bd53f-35-" + i0 + ",338bd53f-33",
            b: common_vendor.p({
              type: item.icon,
              size: "18",
              color: "#fff"
            }),
            c: item.color,
            d: common_vendor.t(item.label),
            e: item.value,
            f: tempSelectedCategory.value.includes(item.value) ? 1 : "",
            g: common_vendor.o(($event) => toggleCategory(item.value), item.value)
          };
        }),
        bG: common_vendor.o(closeCategoryDialog, "8f"),
        bH: common_vendor.t(tempSelectedCategory.value.length),
        bI: common_vendor.o(confirmCategory, "7c"),
        bJ: tempSelectedCategory.value.length === 0,
        bK: common_vendor.sr(categoryPopup, "338bd53f-33", {
          "k": "categoryPopup"
        }),
        bL: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        bM: common_vendor.o(closeStatsDialog, "b5"),
        bN: common_vendor.p({
          type: "closeempty",
          size: "22",
          color: "#999"
        }),
        bO: common_vendor.f(weeklyTrend.value, (item, index, i0) => {
          return {
            a: item.count > 0 ? item.rate + "%" : "0%",
            b: getBarColorByCount(item.count),
            c: common_vendor.t(item.count),
            d: common_vendor.t(item.day),
            e: index
          };
        }),
        bP: common_vendor.o(closeStatsDialog, "e8"),
        bQ: common_vendor.sr(statsPopup, "338bd53f-36", {
          "k": "statsPopup"
        }),
        bR: common_vendor.p({
          type: "center",
          ["safe-area"]: false
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-338bd53f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/practice/practice.js.map
