"use strict";
const common_vendor = require("../../common/vendor.js");
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
const balanceIcon = "/static/image/pay/balance.png";
const wechatIcon = "/static/image/pay/wechat.png";
const _sfc_main = {
  __name: "courseware",
  setup(__props) {
    const defaultCoverMap = {
      "pdf": "/static/image/file/pdf.png",
      "word": "/static/image/file/doc.png",
      "excel": "/static/image/file/xls.png",
      "ppt": "/static/image/file/ppt.png",
      "zip": "/static/image/file/zip.png",
      "txt": "/static/image/file/txt.png"
    };
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const coursewareId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
    const coursewareData = common_vendor.reactive({
      id: "",
      name: "",
      cover: "",
      view_count: 0,
      created_at: "",
      category: "",
      description: "",
      sales_mode: "1",
      price: 0,
      regionNames: "",
      lecturer_id: "[]",
      linked_coursewares: null,
      isFeatured: false
    });
    const lecturerData = common_vendor.reactive({
      id: "",
      name: "",
      photo_path: "",
      avatar: "",
      description: "",
      lecturer_id: ""
    });
    const linkedCourseWares = common_vendor.ref([]);
    const imageList = common_vendor.ref([]);
    const materialSrc = common_vendor.ref([]);
    const currentImageIndex = common_vendor.ref(0);
    const activeIndex = common_vendor.ref(0);
    const showThumbnails = common_vendor.ref(true);
    const isDescExpanded = common_vendor.ref(false);
    const isAuthorExpanded = common_vendor.ref(false);
    const isFavorited = common_vendor.ref(false);
    const isFollowing = common_vendor.ref(false);
    const isLecturerFollowed = common_vendor.ref(false);
    const needDescExpand = common_vendor.ref(false);
    const needAuthorExpand = common_vendor.ref(false);
    const shortDescription = common_vendor.ref("");
    const shortAuthorDesc = common_vendor.ref("");
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
    const imageBaseUrl = common_vendor.ref("");
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
    const buildImageUrl = (imagePath) => {
      if (!imagePath)
        return "";
      if (imagePath.startsWith("http"))
        return imagePath;
      let cleanPath = imagePath;
      if (cleanPath.startsWith("storage/"))
        cleanPath = cleanPath.substring(8);
      return `${imageBaseUrl.value}/storage/${cleanPath}`;
    };
    const getDefaultCover = (type) => {
      const key = (type || "").toLowerCase();
      return defaultCoverMap[key] || "/static/image/file/file.png";
    };
    const getPreviewTag = () => "预览";
    const getPriceText = (item) => {
      if (item.sales_mode == 1)
        return "免费";
      if (item.sales_mode == 2)
        return "会员免费";
      return `¥${item.price || 0}`;
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
    const checkAccess = () => {
      if (coursewareData.sales_mode === "1")
        return isLogin.value;
      if (coursewareData.sales_mode === "2")
        return isLogin.value && isVipMember.value;
      if (coursewareData.sales_mode === "3")
        return isLogin.value && hasPurchased.value;
      return true;
    };
    const showPurchaseOverlay = common_vendor.computed(() => {
      if (activeIndex.value === 0)
        return false;
      return !checkAccess();
    });
    const isVipMember = common_vendor.computed(() => memberStatus.value.is_valid_member === true);
    const overallPriceTagClass = common_vendor.computed(() => {
      if (coursewareData.sales_mode === "1")
        return "tag-free";
      if (coursewareData.sales_mode === "2")
        return "tag-vip";
      return "tag-paid";
    });
    const overallPriceTagText = common_vendor.computed(() => {
      if (coursewareData.sales_mode === "1")
        return "全部免费";
      if (coursewareData.sales_mode === "2")
        return "会员免费";
      return "付费查看";
    });
    const buttonClass = common_vendor.computed(() => {
      if (coursewareData.sales_mode === "1")
        return "btn-free";
      if (coursewareData.sales_mode === "2")
        return "btn-vip";
      return "btn-pay";
    });
    const buttonText = common_vendor.computed(() => {
      if (pageLoading.value)
        return "加载中...";
      if (hasPurchased.value)
        return "下载课件";
      if (coursewareData.sales_mode === "1")
        return isLogin.value ? "免费下载" : "登录后免费下载";
      if (coursewareData.sales_mode === "2") {
        if (!isLogin.value)
          return "登录后下载";
        if (!isVipMember.value)
          return "开通会员免费下载";
        return "会员免费下载";
      }
      if (!isLogin.value)
        return `登录后购买 ¥${coursewareData.price}`;
      return `立即购买 ¥${coursewareData.price}`;
    });
    const purchasePromptText = common_vendor.computed(() => {
      if (!isLogin.value)
        return "请登录后查看完整内容";
      if (coursewareData.sales_mode === "2")
        return "请开通会员查看完整内容";
      if (coursewareData.sales_mode === "3")
        return "请购买课件查看完整内容";
      return "";
    });
    const purchaseButtonText = common_vendor.computed(() => {
      if (!isLogin.value)
        return "立即登录";
      if (coursewareData.sales_mode === "2")
        return "开通会员";
      if (coursewareData.sales_mode === "3")
        return `立即购买 ¥${coursewareData.price}`;
      return "";
    });
    const finalAmount = common_vendor.computed(() => {
      const p = coursewareData.price || 0;
      const d = paymentState.selectedCoupon ? paymentState.selectedCoupon.coupon_detail.discount_amount : 0;
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
    const buildImageList = () => {
      const list = [];
      if (materialSrc.value.length > 0) {
        materialSrc.value.forEach((img, i) => {
          list.push({
            url: buildImageUrl(img),
            caption: `第${i + 1}页`,
            type: "image"
          });
        });
      }
      if (list.length === 0 && coursewareData.cover) {
        list.push({
          url: coursewareData.cover,
          caption: coursewareData.name,
          type: "image"
        });
      }
      imageList.value = list;
    };
    const previewImage = (index) => {
      const urls = imageList.value.map((item) => item.url);
      common_vendor.index.previewImage({
        current: index,
        urls,
        indicator: "number",
        loop: true
      });
    };
    const onSwiperChange = (e) => {
      currentImageIndex.value = e.detail.current;
    };
    const prevImage = () => {
      if (imageList.value.length <= 1)
        return;
      currentImageIndex.value = currentImageIndex.value === 0 ? imageList.value.length - 1 : currentImageIndex.value - 1;
    };
    const nextImage = () => {
      if (imageList.value.length <= 1)
        return;
      currentImageIndex.value = currentImageIndex.value === imageList.value.length - 1 ? 0 : currentImageIndex.value + 1;
    };
    const selectImage = (index) => {
      currentImageIndex.value = index;
    };
    const activeFileName = common_vendor.computed(() => {
      if (linkedCourseWares.value.length > 0 && activeIndex.value >= 0) {
        const item = linkedCourseWares.value[activeIndex.value];
        if (item) {
          return item.name || item.title || `文件${activeIndex.value + 1}`;
        }
      }
      return coursewareData.name;
    });
    const selectCoursewareItem = (index) => {
      activeIndex.value = index;
      const item = linkedCourseWares.value[index];
      if (!item)
        return;
      if (index > 0 && !checkAccess()) {
        common_vendor.index.showToast({
          title: purchasePromptText.value,
          icon: "none",
          duration: 2e3
        });
        return;
      }
      try {
        if (item.type === "application/x-zip-compressed") {
          const files = JSON.parse(item.viewPath);
          if (files && files.length > 0 && files[0].images) {
            materialSrc.value = files[0].images;
          } else {
            materialSrc.value = [];
          }
        } else {
          materialSrc.value = JSON.parse(item.viewPath);
        }
        currentImageIndex.value = 0;
        buildImageList();
      } catch (e) {
        materialSrc.value = [];
        imageList.value = [];
      }
    };
    const fetchLecturerData = async (lecturerid) => {
      try {
        const response = await api_index.fetchSpecificLecturerData(shopId.value, lecturerid);
        if (response.data)
          Object.assign(lecturerData, response.data);
      } catch (error) {
      }
    };
    const fetchCoursewareData = async () => {
      if (!shopId.value || !coursewareId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          coursewareid: coursewareId.value
        };
        const response = await api_index.getBasicCourseWareList(formData);
        if (!response.data) {
          common_vendor.index.showToast({
            title: "未找到课件数据",
            icon: "none"
          });
          return;
        }
        const data = response.data;
        rawCategory.value = data.category || "";
        Object.assign(coursewareData, {
          id: data.courseware_id || "",
          name: data.name || "",
          cover: data.cover || "",
          view_count: data.view_count || 0,
          created_at: data.created_at || "",
          category: data.categoryLabels ? data.categoryLabels.join("/") : "课件详情",
          description: data.description || "",
          sales_mode: data.sales_mode || "1",
          price: data.price || 0,
          regionNames: data.regionNames || "",
          lecturer_id: data.lecturer_id || "[]",
          linked_coursewares: data.linked_coursewares,
          isFeatured: data.is_featured || false
        });
        if (data.linked_coursewares) {
          try {
            linkedCourseWares.value = typeof data.linked_coursewares === "string" ? JSON.parse(data.linked_coursewares) : data.linked_coursewares;
          } catch (e) {
            linkedCourseWares.value = [];
          }
        }
        if (data.lecturer_id) {
          try {
            const ids = typeof data.lecturer_id === "string" ? JSON.parse(data.lecturer_id) : data.lecturer_id;
            if (ids && ids.length > 0 && ids[0].length > 0) {
              await fetchLecturerData(ids[0][0]);
            }
          } catch (e) {
          }
        }
        if (linkedCourseWares.value.length > 0) {
          selectCoursewareItem(0);
        }
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: coursewareId.value,
              type: "courseware"
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
          title: "获取课件数据失败",
          icon: "none"
        });
      }
    };
    const getBrowseCount = async () => {
      try {
        const response = await api_index.getBrowseRecord({
          UXMID: shopId.value,
          content_id: coursewareId.value,
          type: "courseware"
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
          content_id: coursewareId.value,
          type: "courseware"
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
          content_id: coursewareId.value,
          type: "courseware"
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
          content_id: coursewareId.value,
          type: "courseware"
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
        const response = await api_index.checkCourseWarePurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: coursewareId.value,
          product_type: "courseware"
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
      let categoryId = "";
      if (rawCategory.value) {
        try {
          const trimmed = rawCategory.value.trim();
          if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            const arr = JSON.parse(trimmed);
            if (arr.length > 0)
              categoryId = arr[arr.length - 1];
          }
        } catch (e) {
        }
      }
      if (!categoryId)
        return;
      try {
        const response = await api_index.getRelatedCourseWareRecommendations({
          UXMID: shopId.value,
          category: [categoryId]
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
            if (coupon.usage_limit > 0 && coursewareData.price < coupon.usage_limit)
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
      if (coupon.usage_limit > 0 && coursewareData.price < coupon.usage_limit)
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
          content_id: coursewareId.value,
          type: "courseware"
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
          content_id: coursewareId.value,
          type: "courseware"
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
    const handleGetCourseware = () => {
      if (!checkLoginStatus())
        return;
      if (coursewareData.sales_mode === "1" || coursewareData.sales_mode === "2" && isVipMember.value || hasPurchased.value) {
        handleDownload();
      } else if (coursewareData.sales_mode === "2") {
        handleUpgradeVip();
      } else {
        handleBuyNow();
      }
    };
    const handlePurchaseAction = () => {
      if (!checkLoginStatus())
        return;
      if (coursewareData.sales_mode === "2") {
        common_vendor.index.navigateTo({
          url: "/pages/benefits/benefits"
        });
      } else if (coursewareData.sales_mode === "3") {
        handleBuyNow();
      }
    };
    const handleDownload = async () => {
      try {
        common_vendor.index.showLoading({
          title: "正在准备下载..."
        });
        const response = await api_index.downloadBasicCourseware({
          UXMID: shopId.value,
          user_id: userId.value,
          courseware_id: coursewareId.value
        });
        common_vendor.index.hideLoading();
        if (response.status === "success" && response.data.zip_download_url) {
          try {
            await api_index.recordDownload({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: coursewareId.value,
              type: "courseware"
            });
            downloadCount.value += 1;
          } catch (e) {
          }
          common_vendor.index.downloadFile({
            url: response.data.zip_download_url,
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
        const orderResponse = await api_index.createOrder({
          UXMID: shopId.value,
          user_id: userId.value,
          order_type: "courseware",
          product_type: "courseware",
          product_id: coursewareId.value,
          product_name: coursewareData.name,
          unit_price: coursewareData.price,
          quantity: 1,
          expire_time: 24
        });
        if (orderResponse.status === "success") {
          orderId.value = orderResponse.data.order_id;
          openPaymentModal();
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
    const goToCourseware = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/courseware/courseware?id=${item.courseware_id || item.id}`,
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
    const truncateText = (text, maxLength) => {
      if (!text || text.length <= maxLength)
        return text;
      return text.substring(0, maxLength) + "...";
    };
    const checkTextOverflow = () => {
      const descMaxLength = 50;
      needDescExpand.value = (coursewareData.description || "").length > descMaxLength;
      shortDescription.value = truncateText(coursewareData.description, descMaxLength);
      const authorMaxLength = 50;
      needAuthorExpand.value = (lecturerData.description || "").length > authorMaxLength;
      shortAuthorDesc.value = truncateText(lecturerData.description, authorMaxLength);
    };
    common_vendor.onLoad(async (options) => {
      try {
        pageLoading.value = true;
        if (options.id) {
          coursewareId.value = options.id;
        } else {
          common_vendor.index.showToast({
            title: "缺少课件ID",
            icon: "none"
          });
          pageLoading.value = false;
          return;
        }
        const loggedIn = checkLoginStatus();
        await fetchCoursewareData();
        await getRecommendations();
        if (loggedIn) {
          await Promise.all([checkPurchaseStatus(), fetchUserBalance()]);
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "初始化失败",
          icon: "none"
        });
      } finally {
        pageLoading.value = false;
      }
    });
    common_vendor.onUnmounted(() => {
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.o(($event) => navigateTo("/pages/index/index"), "a5"),
        b: common_vendor.o(($event) => navigateTo("/pages/resource/resource"), "74"),
        c: common_vendor.p({
          separator: "/"
        }),
        d: showPurchaseOverlay.value
      }, showPurchaseOverlay.value ? {
        e: common_vendor.t(purchasePromptText.value),
        f: common_vendor.t(purchaseButtonText.value),
        g: common_vendor.o(handlePurchaseAction, "fb")
      } : {}, {
        h: common_vendor.f(imageList.value, (image, index, i0) => {
          return common_vendor.e({
            a: image.url,
            b: common_vendor.o(($event) => previewImage(index), index)
          }, activeFileName.value ? {
            c: common_vendor.t(activeFileName.value)
          } : {}, {
            d: index
          });
        }),
        i: activeFileName.value,
        j: currentImageIndex.value,
        k: common_vendor.o(onSwiperChange, "9b"),
        l: coursewareData.isFeatured
      }, coursewareData.isFeatured ? {} : {}, {
        m: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        n: common_vendor.t(currentImageIndex.value + 1),
        o: common_vendor.t(imageList.value.length)
      } : {}, {
        p: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        q: common_vendor.p({
          type: "left",
          size: "20",
          color: "#ffffff"
        }),
        r: common_vendor.o(prevImage, "e1"),
        s: common_vendor.p({
          type: "right",
          size: "20",
          color: "#ffffff"
        }),
        t: common_vendor.o(nextImage, "fc")
      } : {}, {
        v: imageList.value.length > 1 && showThumbnails.value
      }, imageList.value.length > 1 && showThumbnails.value ? {
        w: common_vendor.f(imageList.value, (image, index, i0) => {
          return {
            a: image.url,
            b: index,
            c: "thumbnail-" + index,
            d: currentImageIndex.value === index ? 1 : "",
            e: common_vendor.o(($event) => selectImage(index), index)
          };
        }),
        x: "thumbnail-" + currentImageIndex.value
      } : {}, {
        y: common_vendor.t(coursewareData.name),
        z: common_vendor.t(overallPriceTagText.value),
        A: common_vendor.n(overallPriceTagClass.value),
        B: common_vendor.p({
          type: "eye",
          size: "16",
          color: "#999999"
        }),
        C: common_vendor.t(formatNumber(browseCount.value)),
        D: common_vendor.p({
          type: "folder",
          size: "16",
          color: "#999999"
        }),
        E: common_vendor.t(linkedCourseWares.value.length),
        F: common_vendor.p({
          type: "download",
          size: "16",
          color: "#999999"
        }),
        G: common_vendor.t(formatNumber(downloadCount.value)),
        H: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999999"
        }),
        I: common_vendor.t(formatDate(coursewareData.created_at)),
        J: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666666"
        }),
        K: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        L: common_vendor.o(handleFavorite, "b4"),
        M: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666666"
        }),
        N: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        O: common_vendor.o(handleFollow, "b0"),
        P: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666666"
        }),
        Q: common_vendor.o(handleShare, "b6"),
        R: common_vendor.t(buttonText.value),
        S: common_vendor.n(buttonClass.value),
        T: common_vendor.o(handleGetCourseware, "be"),
        U: pageLoading.value,
        V: common_vendor.t(isDescExpanded.value ? coursewareData.description : shortDescription.value),
        W: isDescExpanded.value ? 1 : "",
        X: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        Y: common_vendor.o(toggleDescExpand, "8c")
      } : {}, {
        Z: isDescExpanded.value
      }, isDescExpanded.value ? {
        aa: common_vendor.o(toggleDescExpand, "b9")
      } : {}, {
        ab: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        ac: common_vendor.o(handleFollowLecturer, "e5"),
        ad: lecturerData.photo_path || lecturerData.avatar,
        ae: common_vendor.t(lecturerData.name),
        af: common_vendor.o(goToLecturerDetail, "20"),
        ag: common_vendor.t(isAuthorExpanded.value ? lecturerData.description : shortAuthorDesc.value),
        ah: isAuthorExpanded.value ? 1 : "",
        ai: !isAuthorExpanded.value && needAuthorExpand.value
      }, !isAuthorExpanded.value && needAuthorExpand.value ? {
        aj: common_vendor.o(toggleAuthorExpand, "f1")
      } : {}, {
        ak: isAuthorExpanded.value
      }, isAuthorExpanded.value ? {
        al: common_vendor.o(toggleAuthorExpand, "93")
      } : {}, {
        am: linkedCourseWares.value.length > 0
      }, linkedCourseWares.value.length > 0 ? {
        an: common_vendor.f(linkedCourseWares.value, (item, index, i0) => {
          return common_vendor.e({
            a: "ae21406f-13-" + i0,
            b: common_vendor.t(item.name || item.title || "课件文件"),
            c: getPreviewTag()
          }, {
            d: common_vendor.t(getPreviewTag())
          }, {
            e: index,
            f: activeIndex.value === index ? 1 : "",
            g: common_vendor.o(($event) => selectCoursewareItem(index), index)
          });
        }),
        ao: common_vendor.p({
          type: "images",
          size: "16",
          color: "#999999"
        })
      } : {}, {
        ap: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        aq: common_vendor.f(relatedData.value, (item, index, i0) => {
          return common_vendor.e({
            a: getDefaultCover(item.type),
            b: item.isFeatured || item.winnowstatus || item.is_featured
          }, item.isFeatured || item.winnowstatus || item.is_featured ? {} : {}, {
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.description || "暂无描述"),
            e: common_vendor.t(getPriceText(item)),
            f: "ae21406f-14-" + i0,
            g: common_vendor.t(formatNumber(item.view_count || item.download_count || 0)),
            h: index,
            i: common_vendor.o(($event) => goToCourseware(item), index)
          });
        }),
        ar: common_vendor.p({
          type: "download",
          size: "14",
          color: "#bbb"
        })
      } : {}, {
        as: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        at: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        av: common_vendor.o(closePaymentModal, "0e"),
        aw: common_vendor.t(coursewareData.name),
        ax: common_vendor.t(coursewareData.price),
        ay: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        az: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        aA: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aB: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        aC: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        aD: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aE: common_vendor.o(clearCoupon, "5b")
      } : {}, {
        aF: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        aG: common_vendor.o(toggleCouponList, "e9"),
        aH: common_vendor.f(paymentState.availableCoupons, (uc, k0, i0) => {
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
            g: "ae21406f-17-" + i0,
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
        aI: paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon
      }, paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon ? {} : {}, {
        aJ: paymentState.showCouponList,
        aK: balanceIcon,
        aL: common_vendor.t(isBalanceInsufficient.value ? "余额不足" : "可用: ¥" + userBalance.value.toFixed(2)),
        aM: common_vendor.s(isBalanceInsufficient.value ? "color:#ef4444" : ""),
        aN: paymentState.paymentMethod === "balance" ? 1 : "",
        aO: paymentState.paymentMethod === "balance" ? 1 : "",
        aP: isBalanceInsufficient.value ? 1 : "",
        aQ: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "f2"),
        aR: wechatIcon,
        aS: paymentState.paymentMethod === "wechat" ? 1 : "",
        aT: paymentState.paymentMethod === "wechat" ? 1 : "",
        aU: common_vendor.o(($event) => selectPaymentMethod("wechat"), "d2"),
        aV: common_vendor.t(coursewareData.price),
        aW: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aX: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        aY: common_vendor.t(finalAmount.value),
        aZ: common_vendor.t(payButtonText.value),
        ba: common_vendor.o(confirmPay, "ea"),
        bb: payDisabled.value,
        bc: paymentState.loading.submit,
        bd: common_vendor.o(() => {
        }, "3f"),
        be: common_vendor.o(handlePaymentMaskClick, "e4")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ae21406f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/courseware/courseware.js.map
