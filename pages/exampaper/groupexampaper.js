"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_breadcrumb_item2 = common_vendor.resolveComponent("uni-breadcrumb-item");
  const _easycom_uni_breadcrumb2 = common_vendor.resolveComponent("uni-breadcrumb");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_breadcrumb_item2 + _easycom_uni_breadcrumb2 + _easycom_uni_icons2)();
}
const _easycom_uni_breadcrumb_item = () => "../../uni_modules/uni-breadcrumb/components/uni-breadcrumb-item/uni-breadcrumb-item.js";
const _easycom_uni_breadcrumb = () => "../../uni_modules/uni-breadcrumb/components/uni-breadcrumb/uni-breadcrumb.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_breadcrumb_item + _easycom_uni_breadcrumb + _easycom_uni_icons)();
}
const defaultAvatar = "/static/image/my/avatar.png";
const balanceIcon = "/static/image/pay/balance.png";
const wechatIcon = "/static/image/pay/wechat.png";
const defaultShowCount = 3;
const _sfc_main = {
  __name: "groupexampaper",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const exampaperId = common_vendor.ref("");
    const distributorId = common_vendor.ref(null);
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
    const imageBaseUrl = common_vendor.ref("");
    const uniteexampaperData = common_vendor.reactive({
      id: "",
      paper_title: "",
      papertitle: "",
      title: "",
      papersubtitle: "",
      time_score: "",
      attention: "",
      view_count: 0,
      created_at: "",
      category: "",
      description: "",
      sales_mode: "1",
      price: 0,
      regionNames: "",
      lecturer_id: "[]",
      question_ids: null
    });
    const lecturerData = common_vendor.reactive({
      id: "",
      name: "",
      photo_path: "",
      avatar: "",
      description: "",
      lecturer_id: ""
    });
    const questionBasket = common_vendor.reactive({
      single_choice: {
        title: "单选题",
        questions: []
      },
      multiple_choice: {
        title: "多选题",
        questions: []
      },
      judgment: {
        title: "判断题",
        questions: []
      },
      fill_in_the_blank: {
        title: "填空题",
        questions: []
      },
      short_answer: {
        title: "简答题",
        questions: []
      }
    });
    const isDescExpanded = common_vendor.ref(false);
    const isAuthorExpanded = common_vendor.ref(false);
    const isFavorited = common_vendor.ref(false);
    const isFollowing = common_vendor.ref(false);
    const isLecturerFollowed = common_vendor.ref(false);
    const needDescExpand = common_vendor.ref(false);
    const needAuthorExpand = common_vendor.ref(false);
    const shortDescription = common_vendor.ref("");
    const shortAuthorDesc = common_vendor.ref("");
    const activeQuestionId = common_vendor.ref(null);
    const isShowAllQuestions = common_vendor.ref(false);
    const favoriteData = common_vendor.ref({});
    const followData = common_vendor.ref({});
    const browseCount = common_vendor.ref(0);
    const downloadCount = common_vendor.ref(0);
    const hasPurchased = common_vendor.ref(false);
    const purchaseLoading = common_vendor.ref(false);
    const memberStatus = common_vendor.ref({
      is_member: false,
      membership_level: "0",
      is_valid_member: false,
      is_expired: true
    });
    const userBalance = common_vendor.ref(0);
    const showPaymentModal = common_vendor.ref(false);
    const paymentState = common_vendor.reactive({
      paymentMethod: "wechat",
      showCouponList: false,
      selectedCoupon: null,
      availableCoupons: [],
      loading: {
        coupon: false,
        submit: false
      }
    });
    const relatedData = common_vendor.ref([]);
    const rawCategory = common_vendor.ref("");
    const activeQuestionTypes = common_vendor.computed(() => {
      return Object.keys(questionBasket).filter((type) => questionBasket[type].questions.length > 0);
    });
    const totalQuestions = common_vendor.computed(() => {
      return activeQuestionTypes.value.reduce((sum, type) => sum + questionBasket[type].questions.length, 0);
    });
    const isVipMember = common_vendor.computed(() => memberStatus.value.is_valid_member === true);
    const overallPriceTagClass = common_vendor.computed(() => {
      if (uniteexampaperData.sales_mode === "1")
        return "tag-free";
      if (uniteexampaperData.sales_mode === "2")
        return "tag-vip";
      return "tag-paid";
    });
    const overallPriceTagText = common_vendor.computed(() => {
      if (uniteexampaperData.sales_mode === "1")
        return "全部免费";
      if (uniteexampaperData.sales_mode === "2")
        return "会员免费";
      return "付费下载";
    });
    const buttonClass = common_vendor.computed(() => {
      if (uniteexampaperData.sales_mode === "1")
        return "btn-free";
      if (uniteexampaperData.sales_mode === "2")
        return "btn-vip";
      return "btn-pay";
    });
    const buttonText = common_vendor.computed(() => {
      if (pageLoading.value)
        return "加载中...";
      if (hasPurchased.value)
        return "下载试卷";
      if (uniteexampaperData.sales_mode === "1")
        return isLogin.value ? "免费下载" : "登录后免费下载";
      if (uniteexampaperData.sales_mode === "2") {
        if (!isLogin.value)
          return "登录后下载";
        if (!isVipMember.value)
          return "开通会员免费下载";
        return "会员免费下载";
      }
      if (!isLogin.value)
        return `登录后购买 ¥${uniteexampaperData.price}`;
      return `立即购买 ¥${uniteexampaperData.price}`;
    });
    const finalAmount = common_vendor.computed(() => {
      const p = parseFloat(uniteexampaperData.price) || 0;
      const d = paymentState.selectedCoupon ? parseFloat(paymentState.selectedCoupon.coupon_detail.discount_amount) : 0;
      return Math.max(0, p - d).toFixed(2);
    });
    const isBalanceInsufficient = common_vendor.computed(() => userBalance.value < parseFloat(finalAmount.value));
    const availableCouponsCount = common_vendor.computed(() => paymentState.availableCoupons.filter((c) => isCouponAvailable(c)).length);
    const payDisabled = common_vendor.computed(() => {
      if (paymentState.paymentMethod === "balance" && isBalanceInsufficient.value)
        return true;
      return paymentState.loading.submit;
    });
    const payButtonText = common_vendor.computed(() => {
      if (paymentState.loading.submit)
        return "支付中...";
      if (paymentState.paymentMethod === "balance")
        return isBalanceInsufficient.value ? "余额不足" : `余额支付 ¥${finalAmount.value}`;
      return `微信支付 ¥${finalAmount.value}`;
    });
    const formatNumber = (num) => {
      if (!num)
        return "0";
      if (num >= 1e4)
        return (num / 1e4).toFixed(1) + "w";
      return num.toString();
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
    const getPriceText = (item) => {
      if (item.sales_mode == 1)
        return "免费";
      if (item.sales_mode == 2)
        return "会员免费";
      return `¥${item.price || 0}`;
    };
    const getChineseNumber = (num) => {
      const chineseNumbers = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      return num <= 10 && num > 0 ? chineseNumbers[num - 1] : num.toString();
    };
    const getQuestionNumber = (basket, currentType, qIndex) => {
      var _a, _b;
      const typeOrder = ["single_choice", "multiple_choice", "judgment", "fill_in_the_blank", "short_answer"];
      let number = 0;
      for (let type of typeOrder) {
        if (type === currentType) {
          number += qIndex + 1;
          break;
        }
        number += ((_b = (_a = basket[type]) == null ? void 0 : _a.questions) == null ? void 0 : _b.length) || 0;
      }
      return number;
    };
    const getVisibleQuestions = (questions, typeIndex) => {
      if (isShowAllQuestions.value)
        return questions;
      let displayedCount = 0;
      for (let i = 0; i < typeIndex; i++) {
        const type = activeQuestionTypes.value[i];
        displayedCount += Math.min(questionBasket[type].questions.length, defaultShowCount - displayedCount);
        if (displayedCount >= defaultShowCount)
          return [];
      }
      const remainingCount = defaultShowCount - displayedCount;
      if (remainingCount <= 0)
        return [];
      return questions.slice(0, Math.min(remainingCount, questions.length));
    };
    const toggleShowAllQuestions = () => {
      isShowAllQuestions.value = !isShowAllQuestions.value;
    };
    const formatAttention = (attention) => {
      if (!attention)
        return "";
      return attention.split("/").join("<br>");
    };
    const formatQuestionTitle = (title) => {
      if (!title)
        return "题目未找到";
      return title;
    };
    const formatOption = (option) => {
      if (!option)
        return "";
      return `<span style="font-weight:500;margin-right:6px;">${option.label}.</span>${option.content || ""}`;
    };
    const formatAnswers = (question) => {
      if (question.question_type === "single_choice" || question.question_type === "multiple_choice") {
        return question.correct_answers.map((index) => {
          var _a;
          return ((_a = question.options[index - 1]) == null ? void 0 : _a.label) || `选项${index}`;
        }).join("， ");
      } else if (question.question_type === "judgment") {
        return question.correct_answers[0] === 1 ? "正确" : "错误";
      } else if (question.question_type === "fill_in_the_blank" || question.question_type === "short_answer") {
        return question.correct_answers.map((a) => (a.label || "") + "：" + (a.content || "")).join("<br>");
      }
      return "无答案";
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
      token.value = uxfid;
      userId.value = uxfkey;
      shopId.value = shopid;
      isLogin.value = true;
      imageBaseUrl.value = common_vendor.index.getStorageSync("imageBaseUrl") || "";
      return true;
    };
    const toggleQuestionDetail = (questionId) => {
      activeQuestionId.value = activeQuestionId.value === questionId ? null : questionId;
    };
    const fetchLecturerData = async (lecturerid) => {
      try {
        const response = await api_index.fetchSpecificLecturerData(shopId.value, lecturerid);
        if (response.data)
          Object.assign(lecturerData, response.data);
      } catch (error) {
      }
    };
    const fetchUniteExampaperData = async () => {
      if (!shopId.value || !exampaperId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          paperid: exampaperId.value
        };
        const response = await api_index.getSpecialUniteExampaperData(formData);
        if (!response.data) {
          common_vendor.index.showToast({
            title: "未找到试卷数据",
            icon: "none"
          });
          return;
        }
        const data = response.data;
        rawCategory.value = data.category || "";
        Object.assign(uniteexampaperData, {
          id: data.paper_id || "",
          paper_title: data.paper_title || "",
          papertitle: data.papertitle || "",
          title: data.title || "",
          papersubtitle: data.papersubtitle || "",
          time_score: data.time_score || "",
          attention: data.attention || "",
          view_count: data.view_count || 0,
          created_at: data.created_at || "",
          category: data.categoryLabels ? data.categoryLabels.join("/") : "试卷详情",
          description: data.description || "",
          sales_mode: data.sales_mode || "1",
          price: data.price || 0,
          regionNames: data.regionNames || "",
          lecturer_id: data.lecturer_id || "[]",
          question_ids: data.question_ids
        });
        if (data.question_ids) {
          const questionIdsData = data.question_ids;
          Object.keys(questionIdsData).forEach((type) => {
            if (questionBasket[type]) {
              questionBasket[type].questions = (questionIdsData[type].questions || []).map(
                (question) => ({
                  ...question,
                  question_id: question.question_id,
                  title: question.title
                })
              );
              questionBasket[type].title = questionIdsData[type].title || questionBasket[type].title;
            }
          });
        }
        if (data.lecturer_id) {
          try {
            const ids = typeof data.lecturer_id === "string" ? JSON.parse(data.lecturer_id) : data.lecturer_id;
            if (ids && ids.length > 0 && ids[0].length > 0)
              await fetchLecturerData(ids[0][0]);
          } catch (e) {
          }
        }
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: exampaperId.value,
              type: "uniteexampaper"
            });
            await Promise.all([
              getBrowseCount(),
              getDownloadCount(),
              getFavorite(),
              getFollow(),
              getLecturerFollow()
            ]);
          } catch (e) {
          }
        }
        checkTextOverflow();
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取试卷数据失败",
          icon: "none"
        });
      }
    };
    const getBrowseCount = async () => {
      try {
        const response = await api_index.getBrowseRecord({
          UXMID: shopId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success")
          browseCount.value = response.data.browse_record_count || 0;
      } catch (error) {
      }
    };
    const getDownloadCount = async () => {
      try {
        const response = await api_index.getDownloadRecord({
          UXMID: shopId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success")
          downloadCount.value = response.data.download_record_count || 0;
      } catch (error) {
      }
    };
    const getFavorite = async () => {
      if (!isLogin.value)
        return;
      try {
        const response = await api_index.getFavoriteRecord({
          UXMID: shopId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success") {
          favoriteData.value = response.data;
          isFavorited.value = response.data.is_favorited;
        }
      } catch (error) {
      }
    };
    const getFollow = async () => {
      if (!isLogin.value)
        return;
      try {
        const response = await api_index.getFollowRecord({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success") {
          followData.value = response.data;
          isFollowing.value = response.data.is_following;
        }
      } catch (error) {
      }
    };
    const getLecturerFollow = async () => {
      if (!isLogin.value || !lecturerData.lecturer_id)
        return;
      try {
        const response = await api_index.getFollowRecord({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: lecturerData.lecturer_id,
          type: "lecturer"
        });
        if (response.status === "success")
          isLecturerFollowed.value = response.data.is_following;
      } catch (error) {
      }
    };
    const checkPurchaseStatus = async () => {
      if (!isLogin.value)
        return;
      try {
        const response = await api_index.checkGroupExampaperPurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: exampaperId.value,
          product_type: "uniteexampaper"
        });
        if (response.data) {
          hasPurchased.value = response.data.has_purchased;
          if (response.data.member_status)
            memberStatus.value = response.data.member_status;
        }
      } catch (error) {
        hasPurchased.value = false;
      }
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
    const getRecommendations = async () => {
      if (!shopId.value)
        return;
      let categoryData = [];
      try {
        if (rawCategory.value)
          categoryData = JSON.parse(rawCategory.value);
      } catch (e) {
        categoryData = [rawCategory.value];
      }
      if (categoryData.length === 0)
        return;
      try {
        const response = await api_index.getRelatedGroupExampaperRecommendations({
          UXMID: shopId.value,
          category: categoryData
        });
        relatedData.value = response.data || [];
      } catch (error) {
      }
    };
    const getUserCouponData = async () => {
      if (!isLogin.value || !shopId.value)
        return;
      paymentState.loading.coupon = true;
      try {
        const response = await api_index.getUserCoupons({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (response.status === "success" && Array.isArray(response.data)) {
          const now = /* @__PURE__ */ new Date();
          paymentState.availableCoupons = response.data.filter((userCoupon) => {
            const coupon = userCoupon.coupon_detail;
            if (userCoupon.status !== "unused")
              return false;
            if (!coupon.status)
              return false;
            if (coupon.end_time && parseDate(coupon.end_time) <= now)
              return false;
            if (coupon.usage_limit > 0 && parseFloat(uniteexampaperData.price) < parseFloat(coupon.usage_limit))
              return false;
            return true;
          });
        }
      } catch (error) {
        paymentState.availableCoupons = [];
      } finally {
        paymentState.loading.coupon = false;
      }
    };
    const isCouponAvailable = (userCoupon) => {
      const coupon = userCoupon.coupon_detail;
      if (userCoupon.status !== "unused")
        return false;
      if (!coupon.status)
        return false;
      if (coupon.end_time && parseDate(coupon.end_time) <= /* @__PURE__ */ new Date())
        return false;
      if (coupon.usage_limit > 0 && parseFloat(uniteexampaperData.price) < parseFloat(coupon.usage_limit))
        return false;
      return true;
    };
    const toggleCouponList = () => {
      paymentState.showCouponList = !paymentState.showCouponList;
    };
    const selectCoupon = (uc) => {
      if (!isCouponAvailable(uc)) {
        common_vendor.index.showToast({
          title: "该优惠券不可使用",
          icon: "none"
        });
        return;
      }
      paymentState.selectedCoupon = uc;
      paymentState.showCouponList = false;
    };
    const clearCoupon = () => {
      paymentState.selectedCoupon = null;
    };
    const openPaymentModal = async () => {
      if (!checkLoginStatus())
        return;
      paymentState.paymentMethod = "wechat";
      paymentState.showCouponList = false;
      paymentState.selectedCoupon = null;
      paymentState.availableCoupons = [];
      paymentState.loading = {
        coupon: false,
        submit: false
      };
      showPaymentModal.value = true;
      await Promise.all([fetchUserBalance(), getUserCouponData()]);
    };
    const closePaymentModal = () => {
      showPaymentModal.value = false;
      orderId.value = null;
    };
    const handlePaymentMaskClick = () => closePaymentModal();
    const selectPaymentMethod = (method) => {
      paymentState.paymentMethod = method;
    };
    const confirmPay = async () => {
      if (paymentState.loading.submit)
        return;
      if (!orderId.value) {
        common_vendor.index.showToast({
          title: "订单信息丢失，请重新下单",
          icon: "none"
        });
        return;
      }
      paymentState.loading.submit = true;
      try {
        if (paymentState.paymentMethod === "balance") {
          await handleBalancePay();
        } else if (paymentState.paymentMethod === "wechat") {
          await handleWechatPay();
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "支付请求失败",
          icon: "none"
        });
      } finally {
        paymentState.loading.submit = false;
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
      try {
        const response = await api_index.processPayment({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: orderId.value,
          payment_method: "balance",
          user_coupon_id: ((_a = paymentState.selectedCoupon) == null ? void 0 : _a.user_coupon_id) || null,
          amount: finalAmount.value
        });
        if (response.status === "success") {
          handlePaymentSuccess();
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
      }
    };
    const handleWechatPay = async () => {
      var _a;
      try {
        const response = await api_index.processPayment({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: orderId.value,
          payment_method: "wechat",
          user_coupon_id: ((_a = paymentState.selectedCoupon) == null ? void 0 : _a.user_coupon_id) || null,
          amount: finalAmount.value
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
              handlePaymentSuccess();
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
      }
    };
    const handlePaymentSuccess = () => {
      hasPurchased.value = true;
      common_vendor.index.showToast({
        title: "支付成功",
        icon: "success"
      });
      closePaymentModal();
    };
    const handleFavorite = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFavorite({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success") {
          isFavorited.value = response.is_favorited;
          if (favoriteData.value) {
            favoriteData.value.is_favorited = response.is_favorited;
            favoriteData.value.favorite_record_count = response.is_favorited ? (favoriteData.value.favorite_record_count || 0) + 1 : Math.max(0, (favoriteData.value.favorite_record_count || 0) - 1);
          }
          common_vendor.index.showToast({
            title: isFavorited.value ? "已收藏" : "已取消",
            icon: "none"
          });
        }
      } catch (error) {
      }
    };
    const handleFollow = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFollow({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: exampaperId.value,
          type: "uniteexampaper"
        });
        if (response.status === "success") {
          isFollowing.value = response.is_following;
          if (followData.value) {
            followData.value.is_following = response.is_following;
            followData.value.follow_record_count = response.is_following ? (followData.value.follow_record_count || 0) + 1 : Math.max(0, (followData.value.follow_record_count || 0) - 1);
          }
          common_vendor.index.showToast({
            title: isFollowing.value ? "已关注" : "已取消",
            icon: "none"
          });
        }
      } catch (error) {
      }
    };
    const handleFollowLecturer = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFollow({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: lecturerData.lecturer_id,
          type: "lecturer"
        });
        if (response.status === "success") {
          isLecturerFollowed.value = response.is_following;
          common_vendor.index.showToast({
            title: isLecturerFollowed.value ? "已关注讲师" : "已取消",
            icon: "none"
          });
        }
      } catch (error) {
      }
    };
    const handleShare = () => {
      common_vendor.index.showToast({
        title: "请点击右上角菜单分享",
        icon: "none",
        duration: 2e3
      });
    };
    const handleGetExampaper = () => {
      if (!checkLoginStatus())
        return;
      if (uniteexampaperData.sales_mode === "1" || uniteexampaperData.sales_mode === "2" && isVipMember.value || hasPurchased.value) {
        handleDownload();
      } else if (uniteexampaperData.sales_mode === "2") {
        handleUpgradeVip();
      } else {
        handleBuyNow();
      }
    };
    const handleDownload = async () => {
      try {
        common_vendor.index.showLoading({
          title: "正在准备下载..."
        });
        const response = await api_index.downloadGroupExampaperFiles({
          UXMID: shopId.value,
          user_id: userId.value,
          paper_id: exampaperId.value
        });
        common_vendor.index.hideLoading();
        if (response.status === "success" && response.data.download_url) {
          try {
            await api_index.recordDownload({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: exampaperId.value,
              type: "uniteexampaper"
            });
            downloadCount.value += 1;
          } catch (e) {
          }
          common_vendor.index.downloadFile({
            url: response.data.download_url,
            success: (res) => {
              common_vendor.index.openDocument({
                filePath: res.tempFilePath,
                success: () => common_vendor.index.showToast({
                  title: "下载成功",
                  icon: "success"
                })
              });
            },
            fail: () => common_vendor.index.showToast({
              title: "下载失败",
              icon: "none"
            })
          });
        } else {
          common_vendor.index.showToast({
            title: response.message || "下载失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: "下载失败",
          icon: "none"
        });
      }
    };
    const handleBuyNow = async () => {
      if (!checkLoginStatus())
        return;
      purchaseLoading.value = true;
      try {
        const orderFormData = {
          UXMID: shopId.value,
          user_id: userId.value,
          order_type: "exam_paper",
          product_type: "uniteexampaper",
          product_id: exampaperId.value,
          product_name: uniteexampaperData.paper_title,
          unit_price: uniteexampaperData.price,
          quantity: 1,
          expire_time: 24
        };
        if (distributorId.value)
          orderFormData.distributor_id = distributorId.value;
        const orderResponse = await api_index.createOrder(orderFormData);
        if (orderResponse.status === "success") {
          orderId.value = orderResponse.data.order_id;
          openPaymentModal();
        } else {
          common_vendor.index.showToast({
            title: orderResponse.message || "创建订单失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "创建订单失败",
          icon: "none"
        });
      } finally {
        purchaseLoading.value = false;
      }
    };
    const handleUpgradeVip = () => {
      common_vendor.index.navigateTo({
        url: "/pages/benefits/benefits"
      });
    };
    const toggleDescExpand = () => {
      isDescExpanded.value = !isDescExpanded.value;
    };
    const toggleAuthorExpand = () => {
      isAuthorExpanded.value = !isAuthorExpanded.value;
    };
    const truncateText = (text, maxLength) => {
      if (!text || text.length <= maxLength)
        return text;
      return text.substring(0, maxLength) + "...";
    };
    const checkTextOverflow = () => {
      const descMaxLength = 50;
      needDescExpand.value = (uniteexampaperData.description || "").length > descMaxLength;
      shortDescription.value = truncateText(uniteexampaperData.description, descMaxLength);
      const authorMaxLength = 50;
      needAuthorExpand.value = (lecturerData.description || "").length > authorMaxLength;
      shortAuthorDesc.value = truncateText(lecturerData.description, authorMaxLength);
    };
    const goToExampaper = (item) => {
      common_vendor.index.__f__("log", "at pages/exampaper/groupexampaper.vue:1391", item);
      common_vendor.index.navigateTo({
        url: `/pages/exampaper/groupexampaper?id=${item.paper_id || item.id}`,
        fail: () => common_vendor.index.showToast({
          title: "跳转失败",
          icon: "none"
        })
      });
    };
    const goToLecturerDetail = () => {
      if (!lecturerData.lecturer_id)
        return;
      common_vendor.index.navigateTo({
        url: `/pages/lecturer/lecturer?id=${lecturerData.lecturer_id}`,
        fail: () => common_vendor.index.showToast({
          title: "跳转失败",
          icon: "none"
        })
      });
    };
    const navigateTo = (url) => {
      const isTabBar = url.includes("index") || url.includes("resource");
      const method = isTabBar ? common_vendor.index.switchTab : common_vendor.index.navigateTo;
      method({
        url,
        fail: () => common_vendor.index.showToast({
          title: "跳转失败",
          icon: "none"
        })
      });
    };
    common_vendor.onLoad(async (options) => {
      try {
        pageLoading.value = true;
        if (options.id) {
          exampaperId.value = options.id;
        } else {
          common_vendor.index.showToast({
            title: "缺少试卷ID",
            icon: "none"
          });
          pageLoading.value = false;
          return;
        }
        if (options.distributorid)
          distributorId.value = options.distributorid;
        const loggedIn = checkLoginStatus();
        await fetchUniteExampaperData();
        await getRecommendations();
        if (loggedIn)
          await Promise.all([checkPurchaseStatus(), fetchUserBalance()]);
      } catch (error) {
        common_vendor.index.showToast({
          title: "初始化失败",
          icon: "none"
        });
      } finally {
        pageLoading.value = false;
      }
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.o(($event) => navigateTo("/pages/index/index"), "52"),
        b: common_vendor.o(($event) => navigateTo("/pages/resource/resource"), "04"),
        c: common_vendor.p({
          separator: "/"
        }),
        d: uniteexampaperData.papertitle || uniteexampaperData.title
      }, uniteexampaperData.papertitle || uniteexampaperData.title ? common_vendor.e({
        e: common_vendor.t(uniteexampaperData.papertitle || uniteexampaperData.title),
        f: uniteexampaperData.papersubtitle
      }, uniteexampaperData.papersubtitle ? {
        g: common_vendor.t(uniteexampaperData.papersubtitle)
      } : {}, {
        h: uniteexampaperData.time_score
      }, uniteexampaperData.time_score ? {
        i: common_vendor.t(uniteexampaperData.time_score)
      } : {}) : {}, {
        j: uniteexampaperData.attention
      }, uniteexampaperData.attention ? {
        k: formatAttention(uniteexampaperData.attention)
      } : {}, {
        l: activeQuestionTypes.value.length > 0
      }, activeQuestionTypes.value.length > 0 ? {
        m: common_vendor.f(activeQuestionTypes.value, (type, typeIndex, i0) => {
          return {
            a: common_vendor.t(getChineseNumber(typeIndex + 1)),
            b: common_vendor.t(questionBasket[type].title),
            c: common_vendor.f(getVisibleQuestions(questionBasket[type].questions, typeIndex), (question, qIndex, i1) => {
              return common_vendor.e({
                a: common_vendor.t(getQuestionNumber(questionBasket, type, qIndex)),
                b: formatQuestionTitle(question.title),
                c: question.options && question.options.length > 0
              }, question.options && question.options.length > 0 ? {
                d: common_vendor.f(question.options, (option, k2, i2) => {
                  return {
                    a: formatOption(option),
                    b: option.label
                  };
                })
              } : {}, {
                e: activeQuestionId.value === question.question_id
              }, activeQuestionId.value === question.question_id ? common_vendor.e({
                f: formatAnswers(question),
                g: question.analysis
              }, question.analysis ? {
                h: question.analysis
              } : {}) : {}, {
                i: common_vendor.o(($event) => toggleQuestionDetail(question.question_id), question.question_id),
                j: question.question_id
              });
            }),
            d: type
          };
        })
      } : {}, {
        n: totalQuestions.value > defaultShowCount
      }, totalQuestions.value > defaultShowCount ? common_vendor.e({
        o: !isShowAllQuestions.value
      }, !isShowAllQuestions.value ? {
        p: common_vendor.t(totalQuestions.value),
        q: common_vendor.p({
          type: "down",
          size: "16",
          color: "#2c62ef"
        }),
        r: common_vendor.o(toggleShowAllQuestions, "2d")
      } : {
        s: common_vendor.p({
          type: "up",
          size: "16",
          color: "#2c62ef"
        }),
        t: common_vendor.o(toggleShowAllQuestions, "48")
      }) : {}, {
        v: common_vendor.t(uniteexampaperData.paper_title),
        w: common_vendor.t(overallPriceTagText.value),
        x: common_vendor.n(overallPriceTagClass.value),
        y: common_vendor.p({
          type: "eye",
          size: "16",
          color: "#999999"
        }),
        z: common_vendor.t(formatNumber(browseCount.value)),
        A: common_vendor.p({
          type: "paperplane",
          size: "16",
          color: "#999999"
        }),
        B: common_vendor.t(totalQuestions.value),
        C: common_vendor.p({
          type: "download",
          size: "16",
          color: "#999999"
        }),
        D: common_vendor.t(formatNumber(downloadCount.value)),
        E: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999999"
        }),
        F: common_vendor.t(formatDate(uniteexampaperData.created_at)),
        G: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666666"
        }),
        H: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        I: common_vendor.o(handleFavorite, "80"),
        J: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666666"
        }),
        K: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        L: common_vendor.o(handleFollow, "cf"),
        M: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666666"
        }),
        N: common_vendor.o(handleShare, "8d"),
        O: common_vendor.t(buttonText.value),
        P: common_vendor.n(buttonClass.value),
        Q: common_vendor.o(handleGetExampaper, "b6"),
        R: pageLoading.value,
        S: uniteexampaperData.description
      }, uniteexampaperData.description ? common_vendor.e({
        T: common_vendor.t(isDescExpanded.value ? uniteexampaperData.description : shortDescription.value),
        U: isDescExpanded.value ? 1 : "",
        V: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        W: common_vendor.o(toggleDescExpand, "ef")
      } : {}, {
        X: isDescExpanded.value
      }, isDescExpanded.value ? {
        Y: common_vendor.o(toggleDescExpand, "ff")
      } : {}) : {}, {
        Z: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        aa: common_vendor.o(handleFollowLecturer, "a6"),
        ab: lecturerData.photo_path || lecturerData.avatar || defaultAvatar,
        ac: common_vendor.t(lecturerData.name),
        ad: common_vendor.o(goToLecturerDetail, "f4"),
        ae: common_vendor.t(isAuthorExpanded.value ? lecturerData.description : shortAuthorDesc.value),
        af: isAuthorExpanded.value ? 1 : "",
        ag: !isAuthorExpanded.value && needAuthorExpand.value
      }, !isAuthorExpanded.value && needAuthorExpand.value ? {
        ah: common_vendor.o(toggleAuthorExpand, "44")
      } : {}, {
        ai: isAuthorExpanded.value
      }, isAuthorExpanded.value ? {
        aj: common_vendor.o(toggleAuthorExpand, "2a")
      } : {}, {
        ak: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        al: common_vendor.f(relatedData.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.paper_title),
            b: common_vendor.t(item.description || "暂无描述"),
            c: common_vendor.t(getPriceText(item)),
            d: "33a926d7-13-" + i0,
            e: common_vendor.t(formatNumber(item.view_count || 0)),
            f: index,
            g: common_vendor.o(($event) => goToExampaper(item), index)
          };
        }),
        am: common_assets._imports_0$3,
        an: common_vendor.p({
          type: "eye",
          size: "14",
          color: "#bbb"
        })
      } : {}, {
        ao: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        ap: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        aq: common_vendor.o(closePaymentModal, "ce"),
        ar: common_vendor.t(uniteexampaperData.paper_title),
        as: common_vendor.t(uniteexampaperData.price),
        at: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        av: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        aw: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        ax: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        ay: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        az: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aA: common_vendor.o(clearCoupon, "c1")
      } : {}, {
        aB: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        aC: common_vendor.o(toggleCouponList, "3e"),
        aD: common_vendor.f(paymentState.availableCoupons, (uc, k0, i0) => {
          var _a2, _b2, _c;
          return common_vendor.e({
            a: common_vendor.t(uc.coupon_detail.discount_amount),
            b: common_vendor.t(uc.coupon_detail.name),
            c: uc.coupon_detail.usage_limit > 0
          }, uc.coupon_detail.usage_limit > 0 ? {
            d: common_vendor.t(uc.coupon_detail.usage_limit)
          } : {}, {
            e: common_vendor.t(formatDate(uc.coupon_detail.end_time)),
            f: ((_a2 = paymentState.selectedCoupon) == null ? void 0 : _a2.user_coupon_id) === uc.user_coupon_id
          }, ((_b2 = paymentState.selectedCoupon) == null ? void 0 : _b2.user_coupon_id) === uc.user_coupon_id ? {
            g: "33a926d7-16-" + i0,
            h: common_vendor.p({
              type: "checkmarkempty",
              size: "16",
              color: "#fff"
            })
          } : {}, {
            i: uc.user_coupon_id,
            j: ((_c = paymentState.selectedCoupon) == null ? void 0 : _c.user_coupon_id) === uc.user_coupon_id ? 1 : "",
            k: !isCouponAvailable(uc) ? 1 : "",
            l: common_vendor.o(($event) => selectCoupon(uc), uc.user_coupon_id)
          });
        }),
        aE: paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon
      }, paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon ? {} : {}, {
        aF: paymentState.showCouponList,
        aG: balanceIcon,
        aH: common_vendor.t(isBalanceInsufficient.value ? "余额不足" : "可用: ¥" + userBalance.value.toFixed(2)),
        aI: common_vendor.s(isBalanceInsufficient.value ? "color:#ef4444" : ""),
        aJ: paymentState.paymentMethod === "balance" ? 1 : "",
        aK: paymentState.paymentMethod === "balance" ? 1 : "",
        aL: isBalanceInsufficient.value ? 1 : "",
        aM: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "ed"),
        aN: wechatIcon,
        aO: paymentState.paymentMethod === "wechat" ? 1 : "",
        aP: paymentState.paymentMethod === "wechat" ? 1 : "",
        aQ: common_vendor.o(($event) => selectPaymentMethod("wechat"), "cd"),
        aR: common_vendor.t(uniteexampaperData.price),
        aS: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aT: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        aU: common_vendor.t(finalAmount.value),
        aV: common_vendor.t(payButtonText.value),
        aW: common_vendor.o(confirmPay, "27"),
        aX: payDisabled.value,
        aY: paymentState.loading.submit,
        aZ: common_vendor.o(() => {
        }, "78"),
        ba: common_vendor.o(handlePaymentMaskClick, "43")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-33a926d7"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/exampaper/groupexampaper.js.map
