"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const balanceIcon = "/static/image/pay/balance.png";
const wechatIcon = "/static/image/pay/wechat.png";
const defaultAvatar = "/static/image/my/avatar.png";
const _sfc_main = {
  __name: "benefits",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const userInfo = common_vendor.ref({
      nickname: "",
      username: "",
      real_name: "",
      avatar: "",
      membership_level: null,
      member_end_time: null,
      balance: 0
    });
    const userBalance = common_vendor.ref(0);
    const orderId = common_vendor.ref("");
    const paymentInfo = common_vendor.reactive({
      productName: "",
      productPrice: 0
    });
    const memberLevelsRaw = common_vendor.ref([]);
    const selectedLevelId = common_vendor.ref(null);
    const showSuccessModal = common_vendor.ref(false);
    const purchasedLevelName = common_vendor.ref("");
    const expireDate = common_vendor.ref("");
    const showPaymentModal = common_vendor.ref(false);
    const comparisonExpanded = common_vendor.ref(false);
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
    const displayUserName = common_vendor.computed(() => {
      return userInfo.value.nickname || userInfo.value.username || userInfo.value.real_name || "用户";
    });
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
    const getPeriodText = (period, count) => {
      const periodMap = {
        month: "月",
        quarter: "季度",
        year: "年",
        permanent: "永久"
      };
      return period === "permanent" ? "永久" : `${count}${periodMap[period]}`;
    };
    const parseBenefits = (benefits) => {
      if (!benefits)
        return [];
      if (typeof benefits === "string") {
        try {
          return JSON.parse(benefits);
        } catch (e) {
          return [];
        }
      }
      return benefits;
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
    const userMembershipLevel = common_vendor.computed(() => userInfo.value.membership_level || null);
    const currentMembershipName = common_vendor.computed(() => {
      if (!userMembershipLevel.value || !memberLevelsRaw.value.length)
        return "";
      const current = memberLevelsRaw.value.find((l) => l.id.toString() === userMembershipLevel.value.toString());
      return current ? current.name : "";
    });
    const userMembershipEndTime = common_vendor.computed(() => {
      const endTime = userInfo.value.member_end_time;
      if (!endTime)
        return "";
      return formatDate(endTime);
    });
    const memberLevels = common_vendor.computed(() => {
      return memberLevelsRaw.value.map((level) => {
        const benefits = parseBenefits(level.benefits);
        const isCurrentLevel = userMembershipLevel.value && level.id.toString() === userMembershipLevel.value.toString();
        return {
          ...level,
          benefits: benefits.map((b) => ({
            id: b.id,
            name: b.name,
            description: b.description
          })),
          periodText: getPeriodText(level.period, level.period_count),
          originalPrice: level.original_price,
          isCurrentLevel
        };
      });
    });
    const dynamicBenefits = common_vendor.computed(() => {
      const benefitSet = /* @__PURE__ */ new Set();
      memberLevels.value.forEach((level) => {
        level.benefits.forEach((b) => benefitSet.add(b.name));
      });
      return Array.from(benefitSet).map((name) => ({
        name
      }));
    });
    const totalDynamicRows = common_vendor.computed(() => dynamicBenefits.value.length);
    const hasBenefit = (level, benefitName) => level.benefits.some((b) => b.name === benefitName);
    const selectedLevelPrice = common_vendor.computed(() => {
      const level = memberLevels.value.find((l) => l.id === selectedLevelId.value);
      return level ? level.price : "0";
    });
    const finalAmount = common_vendor.computed(() => {
      const price = parseFloat(selectedLevelPrice.value) || 0;
      const discount = paymentState.selectedCoupon ? paymentState.selectedCoupon.coupon_detail.discount_amount : 0;
      return Math.max(0, price - discount).toFixed(2);
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
    const fetchMemberLevels = async () => {
      if (!shopId.value)
        return;
      try {
        const response = await api_index.getMemberLevels(shopId.value);
        memberLevelsRaw.value = response.data || [];
        if (memberLevelsRaw.value.length && !selectedLevelId.value) {
          selectedLevelId.value = memberLevelsRaw.value[0].id;
        }
      } catch (error) {
      }
    };
    const fetchMemberData = async () => {
      var _a;
      if (!isLogin.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value
        };
        const response = await api_index.getMemberData(formData);
        userInfo.value = response.data || {};
        userBalance.value = Number((_a = response.data) == null ? void 0 : _a.balance) || 0;
      } catch (error) {
        userBalance.value = 0;
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
            if (coupon.usage_limit > 0 && parseFloat(selectedLevelPrice.value) < coupon.usage_limit)
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
    const selectLevel = (levelId) => {
      selectedLevelId.value = levelId;
    };
    const toggleComparisonExpand = () => {
      comparisonExpanded.value = !comparisonExpanded.value;
    };
    const canPurchaseMembership = (membership) => {
      if (!userMembershipLevel.value)
        return {
          canPurchase: true,
          message: ""
        };
      const userLevel = userMembershipLevel.value.toString();
      const targetLevel = membership.id.toString();
      const currentLevelData = memberLevelsRaw.value.find((l) => l.id.toString() === userLevel);
      if ((currentLevelData == null ? void 0 : currentLevelData.price) === "0.00" && membership.price !== "0.00")
        return {
          canPurchase: true,
          message: ""
        };
      if (userLevel === targetLevel)
        return {
          canPurchase: true,
          message: ""
        };
      return {
        canPurchase: false,
        message: `您已开通${currentMembershipName.value}会员，有效期至${userMembershipEndTime.value}。请等待到期后再购买其他会员。`
      };
    };
    const handlePurchase = async () => {
      if (!checkLoginStatus())
        return;
      const level = memberLevels.value.find((l) => l.id === selectedLevelId.value);
      if (!level) {
        common_vendor.index.showToast({
          title: "请选择会员等级",
          icon: "none"
        });
        return;
      }
      const permissionCheck = canPurchaseMembership(level);
      if (!permissionCheck.canPurchase) {
        common_vendor.index.showToast({
          title: permissionCheck.message,
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (level.price === "0.00") {
        await handleFreeClaim(level);
        return;
      }
      await handleCreateOrder(level);
    };
    const handleFreeClaim = async (level) => {
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          membership_level_id: level.id
        };
        const response = await api_index.claimFreeMembership(formData);
        if (response.status === "success") {
          purchasedLevelName.value = level.name;
          expireDate.value = "永久有效";
          showSuccessModal.value = true;
        } else {
          common_vendor.index.showToast({
            title: response.message || "领取失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "领取失败，请重试",
          icon: "none"
        });
      }
    };
    const handleCreateOrder = async (membership) => {
      try {
        const orderFormData = {
          UXMID: shopId.value,
          user_id: userId.value,
          order_type: "membership",
          product_type: "membership",
          product_id: String(membership.id),
          product_name: `${membership.name}会员`,
          unit_price: membership.price,
          quantity: 1,
          expire_time: 24
        };
        const orderResponse = await api_index.createOrder(orderFormData);
        if (orderResponse.status === "success") {
          orderId.value = orderResponse.data.order_id;
          paymentInfo.productName = `${membership.name}会员`;
          paymentInfo.productPrice = membership.price;
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
      }
    };
    const resetPaymentState = () => {
      paymentState.paymentMethod = "wechat";
      paymentState.showCouponList = false;
      paymentState.selectedCoupon = null;
      paymentState.availableCoupons = [];
      paymentState.loading = {
        coupon: false,
        submit: false
      };
    };
    const openPaymentModal = async () => {
      if (!checkLoginStatus())
        return;
      resetPaymentState();
      showPaymentModal.value = true;
      await Promise.all([fetchMemberData(), getUserCouponData()]);
    };
    const closePaymentModal = () => {
      resetPaymentState();
      showPaymentModal.value = false;
      orderId.value = "";
    };
    const handlePaymentMaskClick = () => closePaymentModal();
    const selectPaymentMethod = (method) => {
      paymentState.paymentMethod = method;
    };
    const isCouponAvailable = (userCoupon) => {
      const coupon = userCoupon.coupon_detail;
      if (userCoupon.status !== "unused")
        return false;
      if (!coupon.status)
        return false;
      if (coupon.end_time && parseDate(coupon.end_time) <= /* @__PURE__ */ new Date())
        return false;
      if (coupon.usage_limit > 0 && paymentInfo.productPrice < coupon.usage_limit)
        return false;
      return true;
    };
    const toggleCouponList = () => {
      paymentState.showCouponList = !paymentState.showCouponList;
    };
    const selectCoupon = (userCoupon) => {
      if (!isCouponAvailable(userCoupon)) {
        common_vendor.index.showToast({
          title: "该优惠券不可使用",
          icon: "none"
        });
        return;
      }
      paymentState.selectedCoupon = userCoupon;
      paymentState.showCouponList = false;
    };
    const clearCoupon = () => {
      paymentState.selectedCoupon = null;
      paymentState.showCouponList = false;
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
        if (paymentState.paymentMethod === "balance")
          await handleBalancePay();
        else if (paymentState.paymentMethod === "wechat")
          await handleWechatPay();
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
      const response = await api_index.processPayment({
        UXMID: shopId.value,
        user_id: userId.value,
        order_id: orderId.value,
        payment_method: "balance",
        user_coupon_id: ((_a = paymentState.selectedCoupon) == null ? void 0 : _a.user_coupon_id) || null,
        amount: finalAmount.value
      });
      if (response.status === "success")
        handlePaymentSuccess();
      else
        common_vendor.index.showToast({
          title: response.message || "余额支付失败",
          icon: "none"
        });
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
            success: () => handlePaymentSuccess(),
            fail: (err) => {
              const msg = err.errMsg.includes("cancel") ? "支付已取消" : "支付失败";
              common_vendor.index.showToast({
                title: msg,
                icon: "none"
              });
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
      purchasedLevelName.value = paymentInfo.productName;
      const level = memberLevels.value.find((l) => l.id === selectedLevelId.value);
      if (level) {
        const date = /* @__PURE__ */ new Date();
        if (level.period === "permanent")
          expireDate.value = "永久有效";
        else if (level.period === "year") {
          date.setFullYear(date.getFullYear() + (level.period_count || 1));
          expireDate.value = formatDate(date);
        } else {
          date.setMonth(date.getMonth() + (level.period_count || 1));
          expireDate.value = formatDate(date);
        }
      }
      showSuccessModal.value = true;
      closePaymentModal();
      fetchMemberData();
    };
    const closeSuccessModal = () => {
      showSuccessModal.value = false;
    };
    common_vendor.onLoad(() => {
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
      fetchMemberLevels();
      fetchMemberData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: defaultAvatar
      }, {
        b: defaultAvatar
      }, {
        d: common_vendor.t(displayUserName.value),
        e: common_vendor.t(currentMembershipName.value || "普通用户"),
        f: !currentMembershipName.value
      }, !currentMembershipName.value ? {} : {
        g: common_vendor.t(userMembershipEndTime.value)
      }, {
        h: common_vendor.f(memberLevels.value, (level, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(level.name),
            b: common_vendor.t(level.periodText),
            c: common_vendor.t(level.price),
            d: level.originalPrice
          }, level.originalPrice ? {
            e: common_vendor.t(level.originalPrice)
          } : {}, {
            f: selectedLevelId.value === level.id
          }, selectedLevelId.value === level.id ? {} : {}, {
            g: level.id,
            h: selectedLevelId.value === level.id ? 1 : "",
            i: common_vendor.o(($event) => selectLevel(level.id), level.id)
          });
        }),
        i: memberLevels.value.length > 0 && dynamicBenefits.value.length > 0
      }, memberLevels.value.length > 0 && dynamicBenefits.value.length > 0 ? common_vendor.e({
        j: common_vendor.f(memberLevels.value, (level, k0, i0) => {
          return {
            a: common_vendor.t(level.name),
            b: level.id
          };
        }),
        k: common_vendor.f(dynamicBenefits.value, (benefit, bIndex, i0) => {
          return {
            a: common_vendor.t(benefit.name),
            b: common_vendor.f(memberLevels.value, (level, k1, i1) => {
              return common_vendor.e({
                a: hasBenefit(level, benefit.name)
              }, hasBenefit(level, benefit.name) ? {} : {}, {
                b: level.id + "-" + bIndex
              });
            }),
            c: bIndex < 4 || comparisonExpanded.value,
            d: "b-" + bIndex
          };
        }),
        l: totalDynamicRows.value > 4
      }, totalDynamicRows.value > 4 ? {
        m: common_vendor.t(comparisonExpanded.value ? "收起" : "查看全部权益"),
        n: common_vendor.t(comparisonExpanded.value ? "∧" : "∨"),
        o: common_vendor.o(toggleComparisonExpand, "fa")
      } : {}) : {}, {
        p: common_vendor.t(selectedLevelPrice.value),
        q: common_vendor.t(selectedLevelPrice.value === "0.00" ? "免费领取" : "立即开通"),
        r: common_vendor.o(handlePurchase, "73"),
        s: showSuccessModal.value
      }, showSuccessModal.value ? {
        t: common_vendor.p({
          type: "checkmarkempty",
          size: "48",
          color: "#ffffff"
        }),
        v: common_vendor.t(purchasedLevelName.value),
        w: common_vendor.t(expireDate.value),
        x: common_vendor.o(closeSuccessModal, "6a"),
        y: common_vendor.o(() => {
        }, "1d"),
        z: common_vendor.o(closeSuccessModal, "1b")
      } : {}, {
        A: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        B: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        C: common_vendor.o(closePaymentModal, "87"),
        D: common_vendor.t(paymentInfo.productName),
        E: common_vendor.t(paymentInfo.productPrice),
        F: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        G: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        H: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        I: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        J: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        K: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        L: common_vendor.o(clearCoupon, "0e")
      } : {}, {
        M: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        N: common_vendor.o(toggleCouponList, "a0"),
        O: common_vendor.f(paymentState.availableCoupons, (userCoupon, k0, i0) => {
          var _a, _b, _c;
          return common_vendor.e({
            a: common_vendor.t(userCoupon.coupon_detail.discount_amount),
            b: common_vendor.t(userCoupon.coupon_detail.name),
            c: userCoupon.coupon_detail.usage_limit > 0
          }, userCoupon.coupon_detail.usage_limit > 0 ? {
            d: common_vendor.t(userCoupon.coupon_detail.usage_limit)
          } : {}, {
            e: common_vendor.t(formatDate(userCoupon.coupon_detail.end_time)),
            f: ((_a = paymentState.selectedCoupon) == null ? void 0 : _a.user_coupon_id) === userCoupon.user_coupon_id
          }, ((_b = paymentState.selectedCoupon) == null ? void 0 : _b.user_coupon_id) === userCoupon.user_coupon_id ? {
            g: "249b5fed-4-" + i0,
            h: common_vendor.p({
              type: "checkmarkempty",
              size: "16",
              color: "#ffffff"
            })
          } : {}, {
            i: userCoupon.user_coupon_id,
            j: ((_c = paymentState.selectedCoupon) == null ? void 0 : _c.user_coupon_id) === userCoupon.user_coupon_id ? 1 : "",
            k: !isCouponAvailable(userCoupon) ? 1 : "",
            l: common_vendor.o(($event) => selectCoupon(userCoupon), userCoupon.user_coupon_id)
          });
        }),
        P: paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon
      }, paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon ? {} : {}, {
        Q: paymentState.showCouponList,
        R: balanceIcon,
        S: isBalanceInsufficient.value
      }, isBalanceInsufficient.value ? {} : {
        T: common_vendor.t(userBalance.value.toFixed(2))
      }, {
        U: paymentState.paymentMethod === "balance" ? 1 : "",
        V: paymentState.paymentMethod === "balance" ? 1 : "",
        W: isBalanceInsufficient.value ? 1 : "",
        X: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "82"),
        Y: wechatIcon,
        Z: paymentState.paymentMethod === "wechat" ? 1 : "",
        aa: paymentState.paymentMethod === "wechat" ? 1 : "",
        ab: common_vendor.o(($event) => selectPaymentMethod("wechat"), "3a"),
        ac: common_vendor.t(paymentInfo.productPrice),
        ad: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        ae: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        af: common_vendor.t(finalAmount.value),
        ag: common_vendor.t(payButtonText.value),
        ah: common_vendor.o(confirmPay, "ff"),
        ai: payDisabled.value,
        aj: paymentState.loading.submit,
        ak: common_vendor.o(() => {
        }, "11"),
        al: common_vendor.o(handlePaymentMaskClick, "31")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-249b5fed"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/benefits/benefits.js.map
