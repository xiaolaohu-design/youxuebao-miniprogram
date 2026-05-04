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
const defaultAvatar = "/static/image/my/avatar.png";
const balanceIcon = "/static/image/pay/balance.png";
const wechatIcon = "/static/image/pay/wechat.png";
const COMMENTS_PER_PAGE = 10;
const _sfc_main = {
  __name: "imagecourse",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const courseId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
    const imageList = common_vendor.ref([]);
    const currentSwiperIndex = common_vendor.ref(0);
    const showThumbnails = common_vendor.ref(true);
    const courseData = common_vendor.reactive({
      id: "",
      name: "",
      cover: "",
      view_count: 0,
      created_at: "",
      category: "",
      description: "",
      content: "",
      sales_mode: "1",
      price: 0,
      regionNames: "",
      lecturer_id: "[]",
      linked_courses: null,
      linked_coursewares: null,
      linked_exams: null,
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
    const flattenedChapters = common_vendor.ref([]);
    const linkedCourses = common_vendor.ref([]);
    common_vendor.ref([]);
    common_vendor.ref([]);
    const isDescExpanded = common_vendor.ref(false);
    const isLecturerExpanded = common_vendor.ref(false);
    const isFavorited = common_vendor.ref(false);
    const isFollowing = common_vendor.ref(false);
    const isLecturerFollowed = common_vendor.ref(false);
    const currentTab = common_vendor.ref(0);
    const commentText = common_vendor.ref("");
    const needDescExpand = common_vendor.ref(false);
    const needLecturerExpand = common_vendor.ref(false);
    const favoriteData = common_vendor.ref({
      favorite_record_count: 0,
      is_favorited: false
    });
    const followData = common_vendor.ref({
      follow_record_count: 0,
      is_following: false
    });
    common_vendor.ref(null);
    common_vendor.ref(null);
    const commentsData = common_vendor.ref([]);
    const displayedComments = common_vendor.ref([]);
    const commentsPage = common_vendor.ref(1);
    const hasMoreComments = common_vendor.ref(false);
    const commentsLoading = common_vendor.ref(false);
    const isSubmitting = common_vendor.ref(false);
    const hasPurchased = common_vendor.ref(false);
    const purchaseLoading = common_vendor.ref(false);
    const memberStatus = common_vendor.ref({
      is_member: false,
      membership_level: "0",
      is_valid_member: false,
      is_expired: true,
      member_start_time: null,
      member_end_time: null
    });
    const couponData = common_vendor.ref([]);
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
    const formatCommentTime = (timeString) => {
      if (!timeString)
        return "";
      const now = /* @__PURE__ */ new Date();
      const commentTime = parseDate(timeString);
      if (isNaN(commentTime.getTime()))
        return timeString;
      const diff = Math.floor((now - commentTime) / 1e3);
      if (diff < 60)
        return "刚刚";
      if (diff < 3600)
        return `${Math.floor(diff / 60)}分钟前`;
      if (diff < 86400)
        return `${Math.floor(diff / 3600)}小时前`;
      if (diff < 2592e3)
        return `${Math.floor(diff / 86400)}天前`;
      return formatDate(timeString);
    };
    const maskNickname = (nickname) => {
      if (!nickname)
        return "匿名用户";
      if (nickname.includes("@")) {
        const [name, domain] = nickname.split("@");
        return `${name.length > 2 ? name.substring(0, 2) + "***" : name + "***"}@${domain.charAt(0)}***`;
      }
      if (/^\d+$/.test(nickname) && nickname.length >= 11) {
        return nickname.substring(0, 3) + "****" + nickname.substring(nickname.length - 4);
      }
      const len = nickname.length;
      if (len === 1)
        return nickname;
      if (len === 2)
        return nickname.charAt(0) + "*";
      if (len === 3)
        return nickname.charAt(0) + "*" + nickname.charAt(len - 1);
      return nickname.substring(0, 2) + "***" + nickname.substring(len - 2);
    };
    const getTypeClass = (type) => {
      const map = {
        "视频课程": "type-course",
        "音频课程": "type-course",
        "图文课程": "type-course",
        "专题课程": "type-course",
        "精选课件": "type-courseware",
        "精选试卷": "type-exam"
      };
      return map[type] || "type-default";
    };
    const getPriceText = (item) => {
      if (item.sales_mode == 1)
        return "免费";
      if (item.sales_mode == 2)
        return "会员免费";
      return `￥${item.price || 0}`;
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
      return true;
    };
    const canAccess = () => {
      if (courseData.sales_mode === "1")
        return isLogin.value;
      if (courseData.sales_mode === "2")
        return isLogin.value && isVipMember.value;
      if (courseData.sales_mode === "3")
        return isLogin.value && hasPurchased.value;
      return true;
    };
    const showPurchaseOverlay = common_vendor.computed(() => {
      if (imageList.value.length === 0)
        return false;
      if (currentSwiperIndex.value === 0)
        return false;
      return !canAccess();
    });
    const purchasePromptText = common_vendor.computed(() => {
      if (!isLogin.value)
        return "请登录后查看完整内容";
      if (courseData.sales_mode === "2")
        return "请开通会员查看完整内容";
      if (courseData.sales_mode === "3")
        return "请购买课程查看完整内容";
      return "";
    });
    const purchaseButtonText = common_vendor.computed(() => {
      if (!isLogin.value)
        return "立即登录";
      if (courseData.sales_mode === "2")
        return "开通会员";
      if (courseData.sales_mode === "3")
        return `立即购买 ¥${courseData.price}`;
      return "";
    });
    const getPurchaseTipText = () => {
      if (!isLogin.value)
        return "请登录后查看完整内容";
      if (courseData.sales_mode === "2")
        return "请开通会员查看完整内容";
      if (courseData.sales_mode === "3")
        return "请购买课程查看完整内容";
      return "";
    };
    const totalCourseHours = common_vendor.computed(() => flattenedChapters.value.length);
    const isVipMember = common_vendor.computed(() => memberStatus.value.is_valid_member === true);
    const priceTagClass = common_vendor.computed(() => {
      if (courseData.sales_mode === "1")
        return "tag-free";
      if (courseData.sales_mode === "2")
        return "tag-vip";
      return "tag-paid";
    });
    const priceTagText = common_vendor.computed(() => {
      if (courseData.sales_mode === "1")
        return "全集免费";
      if (courseData.sales_mode === "2")
        return "会员免费";
      return "付费查看";
    });
    const buttonClass = common_vendor.computed(() => {
      if (courseData.sales_mode === "1")
        return "btn-free";
      if (courseData.sales_mode === "2")
        return "btn-vip";
      return "btn-pay";
    });
    const buttonText = common_vendor.computed(() => {
      if (pageLoading.value)
        return "加载中...";
      if (hasPurchased.value)
        return "✓ 已购买";
      if (courseData.sales_mode === "1")
        return isLogin.value ? "立即学习" : "登录后免费学习";
      if (courseData.sales_mode === "2") {
        if (!isLogin.value)
          return "登录后学习";
        if (!isVipMember.value)
          return "开通会员免费学";
        return "会员免费学习";
      }
      if (!isLogin.value)
        return `登录后购买 ¥${courseData.price}`;
      return `立即购买 ¥${courseData.price}`;
    });
    const displayDescription = common_vendor.computed(() => {
      const d = courseData.description || "";
      if (!isDescExpanded.value && d.length > 50)
        return d.substring(0, 50) + "...";
      return d;
    });
    const displayLecturerDesc = common_vendor.computed(() => {
      const d = lecturerData.description || "";
      if (!isLecturerExpanded.value && d.length > 50)
        return d.substring(0, 50) + "...";
      return d;
    });
    const formattedContent = common_vendor.computed(() => {
      const c = courseData.content;
      if (!c)
        return null;
      return c.replace(/^"|"$/g, "").replace(/\\"/g, '"').replace(/\\n/g, "<br/>").replace(
        /\\t/g,
        "&nbsp;&nbsp;&nbsp;&nbsp;"
      ).replace(/\\\\/g, "\\");
    });
    const finalAmount = common_vendor.computed(() => {
      const p = courseData.price || 0;
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
      if (paymentState.paymentMethod === "balance") {
        return isBalanceInsufficient.value ? "余额不足" : `余额支付 ¥${finalAmount.value}`;
      }
      return `微信支付 ¥${finalAmount.value}`;
    });
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: imageList.value.map((i) => i.url),
        indicator: "number",
        loop: true
      });
    };
    const onSwiperChange = (e) => {
      currentSwiperIndex.value = e.detail.current;
    };
    const prevImage = () => {
      if (imageList.value.length <= 1)
        return;
      currentSwiperIndex.value = currentSwiperIndex.value === 0 ? imageList.value.length - 1 : currentSwiperIndex.value - 1;
    };
    const nextImage = () => {
      if (imageList.value.length <= 1)
        return;
      currentSwiperIndex.value = currentSwiperIndex.value === imageList.value.length - 1 ? 0 : currentSwiperIndex.value + 1;
    };
    const selectImage = (index) => {
      if (index > 0 && !canAccess()) {
        common_vendor.index.showToast({
          title: getPurchaseTipText(),
          icon: "none",
          duration: 2e3
        });
        return;
      }
      currentSwiperIndex.value = index;
    };
    const buildImageList = () => {
      const list = [];
      if (flattenedChapters.value.length > 0) {
        flattenedChapters.value.forEach((ch, i) => {
          if (ch.path) {
            list.push({
              url: ch.path,
              caption: ch.original_name || ch.title || `章节 ${i + 1}`,
              type: "image"
            });
          }
        });
      }
      if (list.length === 0 && courseData.cover) {
        list.push({
          url: courseData.cover,
          caption: courseData.name,
          type: "image"
        });
      }
      imageList.value = list;
    };
    const flattenAllChapters = (list) => {
      const r = [];
      const f = (c, p = []) => {
        if (!c || !Array.isArray(c))
          return;
        for (let i = 0; i < c.length; i++) {
          const t = c[i];
          const cp = [...p, i];
          if (t.imagetexts && Array.isArray(t.imagetexts)) {
            for (let j = 0; j < t.imagetexts.length; j++) {
              r.push({
                ...t.imagetexts[j],
                pathIndex: [...cp],
                imageIndex: j,
                isChild: p.length > 0,
                parentIndex: p.length > 0 ? p[p.length - 1] : null,
                original_name: t.imagetexts[j].name || `章节${j + 1}`
              });
            }
          }
          if (t.children && t.children.length > 0)
            f(t.children, cp);
        }
      };
      f(list);
      return r;
    };
    const isChapterActive = (item) => {
      return currentSwiperIndex.value === flattenedChapters.value.indexOf(item);
    };
    const selectChapter = (item) => {
      const idx = flattenedChapters.value.indexOf(item);
      if (idx === -1)
        return;
      if (idx > 0 && !canAccess()) {
        common_vendor.index.showToast({
          title: getPurchaseTipText(),
          icon: "none",
          duration: 2e3
        });
        return;
      }
      currentSwiperIndex.value = idx;
    };
    const fetchLecturerData = async (lecturerid) => {
      try {
        const res = await api_index.fetchSpecificLecturerData(shopId.value, lecturerid);
        if (res.data)
          Object.assign(lecturerData, res.data);
      } catch (e) {
      }
    };
    const fetchCourseListData = async () => {
      if (!shopId.value || !courseId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          courseid: courseId.value
        };
        const res = await api_index.getImageCourseList(formData);
        if (!res.data) {
          common_vendor.index.showToast({
            title: "未找到课程数据",
            icon: "none"
          });
          return;
        }
        const d = res.data;
        rawCategory.value = d.category || "";
        Object.assign(courseData, {
          id: d.course_id || "",
          name: d.name || "",
          cover: d.cover || "",
          view_count: d.view_count || 0,
          created_at: d.created_at || "",
          description: d.description || "",
          content: d.content || "",
          sales_mode: d.sales_mode || "1",
          price: d.price || 0,
          regionNames: d.regionNames || "",
          lecturer_id: d.lecturer_id || "[]",
          linked_courses: d.linked_courses,
          linked_coursewares: d.linked_coursewares,
          linked_exams: d.linked_exams,
          isFeatured: d.is_featured || false
        });
        if (d.linked_courses) {
          try {
            linkedCourses.value = typeof d.linked_courses === "string" ? JSON.parse(d.linked_courses) : d.linked_courses;
            flattenedChapters.value = flattenAllChapters(linkedCourses.value);
          } catch (e) {
            flattenedChapters.value = [];
          }
        } else {
          flattenedChapters.value = [];
        }
        buildImageList();
        if (d.lecturer_id) {
          try {
            const ids = typeof d.lecturer_id === "string" ? JSON.parse(d.lecturer_id) : d.lecturer_id;
            if (ids && ids.length > 0 && ids[0].length > 0) {
              await fetchLecturerData(ids[0][0]);
            }
          } catch (e) {
          }
        }
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: courseId.value,
              type: "imagecourse"
            });
            await getStats();
          } catch (e) {
          }
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "获取课程数据失败",
          icon: "none"
        });
      }
    };
    const getStats = async () => {
      try {
        const [fv, fl] = await Promise.all([
          api_index.getFavoriteRecord({
            UXMID: shopId.value,
            content_id: courseId.value,
            type: "imagecourse"
          }),
          api_index.getFollowRecord({
            UXMID: shopId.value,
            user_id: userId.value,
            content_id: courseId.value,
            type: "imagecourse"
          })
        ]);
        if (fv.status === "success") {
          favoriteData.value = fv.data;
          isFavorited.value = fv.data.is_favorited;
        }
        if (fl.status === "success") {
          followData.value = fl.data;
          isFollowing.value = fl.data.is_following;
        }
      } catch (e) {
      }
    };
    const checkPurchaseStatus = async () => {
      if (!isLogin.value)
        return;
      try {
        const res = await api_index.checkImageTextCoursePurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: courseId.value,
          product_type: "imagecourse"
        });
        if (res.data) {
          hasPurchased.value = res.data.has_purchased;
          if (res.data.member_status)
            memberStatus.value = res.data.member_status;
        }
      } catch (e) {
        hasPurchased.value = false;
      }
    };
    const fetchUserBalance = async () => {
      var _a;
      if (!isLogin.value)
        return;
      try {
        const res = await api_index.getMemberData({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (((_a = res.data) == null ? void 0 : _a.balance) !== void 0) {
          const b = Number(res.data.balance);
          userBalance.value = isNaN(b) ? 0 : b;
        }
      } catch (e) {
        userBalance.value = 0;
      }
    };
    const fetchLatestComments = async () => {
      if (!shopId.value || !courseId.value)
        return;
      try {
        const res = await api_index.getImageTextCourseComments({
          UXMID: shopId.value,
          course_id: courseId.value
        });
        if (res.status === "success") {
          commentsData.value = (res.data || []).map((comment) => ({
            ...comment,
            isExpanded: false
          }));
          commentsPage.value = 1;
          updateDisplayedComments();
        }
      } catch (e) {
        commentsData.value = [];
        displayedComments.value = [];
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
        const res = await api_index.getImageTextRelatedRecommendations({
          UXMID: shopId.value,
          category: [categoryId]
        });
        relatedData.value = res.data || [];
      } catch (e) {
      }
    };
    const fetchCouponsList = async () => {
      if (!shopId.value)
        return;
      try {
        couponData.value = (await api_index.getCouponsList({
          UXMID: shopId.value
        })).data || [];
      } catch (e) {
      }
    };
    const updateDisplayedComments = () => {
      const endIndex = commentsPage.value * COMMENTS_PER_PAGE;
      displayedComments.value = commentsData.value.slice(0, endIndex);
      hasMoreComments.value = endIndex < commentsData.value.length;
    };
    const loadMoreComments = () => {
      commentsPage.value++;
      updateDisplayedComments();
    };
    const submitComment = async () => {
      if (!checkLoginStatus())
        return;
      if (!commentText.value.trim()) {
        common_vendor.index.showToast({
          title: "评论不能为空",
          icon: "none"
        });
        return;
      }
      if (isSubmitting.value)
        return;
      isSubmitting.value = true;
      try {
        const res = await api_index.submitImageTextCourseComment({
          UXMID: shopId.value,
          user_id: userId.value,
          course_id: courseId.value,
          content: commentText.value.trim()
        });
        if (res.status === "success") {
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          commentText.value = "";
          await fetchLatestComments();
        }
      } catch (e) {
      } finally {
        isSubmitting.value = false;
      }
    };
    const toggleLikeComment = async (comment) => {
      if (!checkLoginStatus())
        return;
      try {
        const res = await api_index.likeImageTextCourseComment({
          UXMID: shopId.value,
          user_id: userId.value,
          course_id: courseId.value,
          comment_id: comment.id
        });
        if (res.status === "success") {
          comment.is_liked = !comment.is_liked;
          comment.like_count += comment.is_liked ? 1 : -1;
        }
      } catch (e) {
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
    const getUserCouponData = async () => {
      if (!isLogin.value)
        return;
      paymentState.loading.coupon = true;
      try {
        const res = await api_index.getUserCoupons({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (res.status === "success" && Array.isArray(res.data)) {
          const now = /* @__PURE__ */ new Date();
          paymentState.availableCoupons = res.data.filter((uc) => {
            const c = uc.coupon_detail;
            return uc.status === "unused" && c.status && (!c.end_time || parseDate(c.end_time) > now) && (!c.usage_limit || courseData.price >= c.usage_limit);
          });
        }
      } catch (e) {
        paymentState.availableCoupons = [];
      } finally {
        paymentState.loading.coupon = false;
      }
    };
    const isCouponAvailable = (uc) => {
      const c = uc.coupon_detail;
      return uc.status === "unused" && c.status && (!c.end_time || parseDate(c.end_time) > /* @__PURE__ */ new Date()) && (!c.usage_limit || courseData.price >= c.usage_limit);
    };
    const toggleCouponList = () => {
      paymentState.showCouponList = !paymentState.showCouponList;
    };
    const selectCoupon = (uc) => {
      paymentState.selectedCoupon = uc;
      paymentState.showCouponList = false;
    };
    const clearCoupon = () => {
      paymentState.selectedCoupon = null;
    };
    const openPaymentModal = async () => {
      if (!checkLoginStatus())
        return;
      resetPaymentState();
      showPaymentModal.value = true;
      await Promise.all([fetchUserBalance(), getUserCouponData()]);
    };
    const closePaymentModal = () => {
      resetPaymentState();
      showPaymentModal.value = false;
      orderId.value = null;
    };
    const handlePaymentMaskClick = () => closePaymentModal();
    const selectPaymentMethod = (m) => {
      paymentState.paymentMethod = m;
    };
    const confirmPay = async () => {
      if (!orderId.value)
        return;
      paymentState.loading.submit = true;
      try {
        paymentState.paymentMethod === "balance" ? await handleBalancePay() : await handleWechatPay();
      } catch (e) {
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
        const res = await api_index.processPayment({
          UXMID: shopId.value,
          user_id: userId.value,
          order_id: orderId.value,
          payment_method: "balance",
          user_coupon_id: ((_a = paymentState.selectedCoupon) == null ? void 0 : _a.user_coupon_id) || null,
          amount: finalAmount.value
        });
        if (res.status === "success") {
          handlePaymentSuccess();
        } else {
          common_vendor.index.showToast({
            title: res.message || "支付失败",
            icon: "none"
          });
        }
      } catch (e) {
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
        const res = await api_index.recordFavorite({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: courseId.value,
          type: "imagecourse"
        });
        if (res.status === "success") {
          isFavorited.value = res.is_favorited;
          favoriteData.value.favorite_record_count += res.is_favorited ? 1 : -1;
          common_vendor.index.showToast({
            title: isFavorited.value ? "已收藏" : "已取消",
            icon: "none"
          });
        }
      } catch (e) {
      }
    };
    const handleFollow = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const res = await api_index.recordFollow({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: courseId.value,
          type: "imagecourse"
        });
        if (res.status === "success") {
          isFollowing.value = res.is_following;
          followData.value.follow_record_count += res.is_following ? 1 : -1;
          common_vendor.index.showToast({
            title: isFollowing.value ? "已关注" : "已取消",
            icon: "none"
          });
        }
      } catch (e) {
      }
    };
    const handleFollowLecturer = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const res = await api_index.recordFollow({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: lecturerData.lecturer_id,
          type: "lecturer"
        });
        if (res.status === "success") {
          isLecturerFollowed.value = res.is_following;
          common_vendor.index.showToast({
            title: isLecturerFollowed.value ? "已关注讲师" : "已取消",
            icon: "none"
          });
        }
      } catch (e) {
      }
    };
    const handleShare = () => {
      common_vendor.index.showToast({
        title: "请点击右上角分享",
        icon: "none"
      });
    };
    const handlePurchase = () => {
      if (!checkLoginStatus())
        return;
      if (courseData.sales_mode === "1") {
        common_vendor.index.showToast({
          title: "开始免费学习",
          icon: "success"
        });
      } else if (courseData.sales_mode === "2") {
        if (!isVipMember.value)
          handleUpgradeVip();
        else
          common_vendor.index.showToast({
            title: "会员免费学习",
            icon: "success"
          });
      } else {
        handleBuyNow();
      }
    };
    const handleBuyNow = async () => {
      if (!checkLoginStatus())
        return;
      purchaseLoading.value = true;
      try {
        const res = await api_index.createOrder({
          UXMID: shopId.value,
          user_id: userId.value,
          order_type: "course",
          product_type: "imagecourse",
          product_id: courseId.value,
          product_name: courseData.name,
          unit_price: courseData.price,
          quantity: 1,
          expire_time: 24
        });
        if (res.status === "success") {
          orderId.value = res.data.order_id;
          openPaymentModal();
        } else {
          common_vendor.index.showToast({
            title: res.message || "创建订单失败",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "创建订单失败",
          icon: "none"
        });
      } finally {
        purchaseLoading.value = false;
      }
    };
    const handlePurchaseAction = () => {
      if (!checkLoginStatus())
        return;
      if (courseData.sales_mode === "2") {
        common_vendor.index.navigateTo({
          url: "/pages/benefits/benefits"
        });
      } else {
        handleBuyNow();
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
    const toggleLecturerExpand = () => {
      isLecturerExpanded.value = !isLecturerExpanded.value;
    };
    const switchTab = (i) => {
      currentTab.value = i;
    };
    const goToCourse = (item) => {
      common_vendor.index.navigateTo({
        url: `/pages/course/imagecourse?id=${item.course_id || item.id}`
      });
    };
    const navigateTo = (url) => {
      const isTab = url.includes("index") || url.includes("resource");
      (isTab ? common_vendor.index.switchTab : common_vendor.index.navigateTo)({
        url
      });
    };
    const navigateToLogin = () => {
      checkLoginStatus();
    };
    const checkTextOverflow = () => {
      needDescExpand.value = (courseData.description || "").length > 50;
      needLecturerExpand.value = (lecturerData.description || "").length > 50;
    };
    const goToLecturerDetail = () => {
      if (!lecturerData.lecturer_id) {
        common_vendor.index.showToast({
          title: "暂无讲师信息",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/lecturer/lecturer?id=${lecturerData.lecturer_id}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad(async (options) => {
      try {
        pageLoading.value = true;
        if (options.id)
          courseId.value = options.id;
        else {
          pageLoading.value = false;
          return;
        }
        const uxfid = common_vendor.index.getStorageSync("UXFID");
        const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
        const shopid = common_vendor.index.getStorageSync("shopId");
        token.value = uxfid || "";
        userId.value = uxfkey || "";
        shopId.value = shopid || "";
        isLogin.value = !!(uxfid && uxfkey && shopid);
        if (!isLogin.value) {
          checkLoginStatus();
          pageLoading.value = false;
          return;
        }
        await fetchCourseListData();
        await Promise.all([getRecommendations(), fetchCouponsList()]);
        await Promise.all([checkPurchaseStatus(), fetchUserBalance()]);
        await fetchLatestComments();
        checkTextOverflow();
      } catch (e) {
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
        a: common_vendor.o(($event) => navigateTo("/pages/index/index"), "a3"),
        b: common_vendor.o(($event) => navigateTo("/pages/resource/resource"), "09"),
        c: common_vendor.p({
          separator: "/"
        }),
        d: common_vendor.f(imageList.value, (image, index, i0) => {
          return common_vendor.e({
            a: image.url,
            b: common_vendor.o(($event) => previewImage(index), index),
            c: image.caption
          }, image.caption ? {
            d: common_vendor.t(image.caption)
          } : {}, {
            e: index
          });
        }),
        e: currentSwiperIndex.value,
        f: common_vendor.o(onSwiperChange, "50"),
        g: courseData.isFeatured
      }, courseData.isFeatured ? {} : {}, {
        h: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        i: common_vendor.t(currentSwiperIndex.value + 1),
        j: common_vendor.t(imageList.value.length)
      } : {}, {
        k: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        l: common_vendor.p({
          type: "left",
          size: "20",
          color: "#fff"
        }),
        m: common_vendor.o(prevImage, "e8"),
        n: common_vendor.p({
          type: "right",
          size: "20",
          color: "#fff"
        }),
        o: common_vendor.o(nextImage, "d8")
      } : {}, {
        p: imageList.value.length > 1 && showThumbnails.value
      }, imageList.value.length > 1 && showThumbnails.value ? {
        q: common_vendor.f(imageList.value, (image, index, i0) => {
          return common_vendor.e({
            a: image.url,
            b: index > 0 && !canAccess()
          }, index > 0 && !canAccess() ? {
            c: "8182af11-6-" + i0,
            d: common_vendor.p({
              type: "image",
              size: "32",
              color: "#fff"
            })
          } : {}, {
            e: index,
            f: "thumb-" + index,
            g: currentSwiperIndex.value === index ? 1 : "",
            h: common_vendor.o(($event) => selectImage(index), index)
          });
        }),
        r: "thumb-" + currentSwiperIndex.value
      } : {}, {
        s: showPurchaseOverlay.value
      }, showPurchaseOverlay.value ? {
        t: common_vendor.t(purchasePromptText.value),
        v: common_vendor.t(purchaseButtonText.value),
        w: common_vendor.o(handlePurchaseAction, "5d")
      } : {}, {
        x: common_vendor.t(courseData.name),
        y: common_vendor.t(priceTagText.value),
        z: common_vendor.n(priceTagClass.value),
        A: common_vendor.p({
          type: "eye",
          size: "16",
          color: "#999"
        }),
        B: common_vendor.t(formatNumber(courseData.view_count)),
        C: common_vendor.p({
          type: "list",
          size: "16",
          color: "#999"
        }),
        D: common_vendor.t(totalCourseHours.value),
        E: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        F: common_vendor.t(formatDate(courseData.created_at)),
        G: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666"
        }),
        H: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        I: common_vendor.o(handleFavorite, "47"),
        J: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666"
        }),
        K: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        L: common_vendor.o(handleFollow, "a8"),
        M: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666"
        }),
        N: common_vendor.o(handleShare, "06"),
        O: common_vendor.t(buttonText.value),
        P: common_vendor.n(buttonClass.value),
        Q: common_vendor.o(handlePurchase, "c5"),
        R: pageLoading.value || hasPurchased.value || isVipMember.value || courseData.sales_mode === "1",
        S: common_vendor.t(displayDescription.value),
        T: isDescExpanded.value ? 1 : "",
        U: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        V: common_vendor.o(toggleDescExpand, "03")
      } : {}, {
        W: isDescExpanded.value
      }, isDescExpanded.value ? {
        X: common_vendor.o(toggleDescExpand, "12")
      } : {}, {
        Y: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        Z: common_vendor.o(handleFollowLecturer, "a4"),
        aa: lecturerData.photo_path || lecturerData.avatar,
        ab: common_vendor.t(lecturerData.name),
        ac: common_vendor.o(goToLecturerDetail, "46"),
        ad: common_vendor.t(displayLecturerDesc.value),
        ae: isLecturerExpanded.value ? 1 : "",
        af: !isLecturerExpanded.value && needLecturerExpand.value
      }, !isLecturerExpanded.value && needLecturerExpand.value ? {
        ag: common_vendor.o(toggleLecturerExpand, "46")
      } : {}, {
        ah: isLecturerExpanded.value
      }, isLecturerExpanded.value ? {
        ai: common_vendor.o(toggleLecturerExpand, "47")
      } : {}, {
        aj: currentTab.value === 0 ? 1 : "",
        ak: common_vendor.o(($event) => switchTab(0), "73"),
        al: currentTab.value === 1 ? 1 : "",
        am: common_vendor.o(($event) => switchTab(1), "3d"),
        an: common_vendor.t(commentsData.value.length),
        ao: currentTab.value === 2 ? 1 : "",
        ap: common_vendor.o(($event) => switchTab(2), "86"),
        aq: common_vendor.t(totalCourseHours.value),
        ar: common_vendor.f(flattenedChapters.value, (item, index, i0) => {
          return {
            a: "8182af11-13-" + i0,
            b: common_vendor.t(item.original_name || item.title),
            c: index,
            d: isChapterActive(item) ? 1 : "",
            e: common_vendor.o(($event) => selectChapter(item), index)
          };
        }),
        as: common_vendor.p({
          type: "image",
          size: "16",
          color: "#999"
        }),
        at: currentTab.value === 0,
        av: formattedContent.value
      }, formattedContent.value ? {
        aw: formattedContent.value
      } : {}, {
        ax: currentTab.value === 1,
        ay: isLogin.value
      }, isLogin.value ? {
        az: commentText.value,
        aA: common_vendor.o(($event) => commentText.value = $event.detail.value, "0a"),
        aB: common_vendor.t(commentText.value.length),
        aC: common_vendor.o(submitComment, "31"),
        aD: !commentText.value.trim() || isSubmitting.value
      } : {
        aE: common_vendor.o(navigateToLogin, "15")
      }, {
        aF: displayedComments.value.length > 0
      }, displayedComments.value.length > 0 ? common_vendor.e({
        aG: common_vendor.f(displayedComments.value, (comment, index, i0) => {
          return common_vendor.e({
            a: comment.avatar || defaultAvatar,
            b: common_vendor.t(maskNickname(comment.nickname)),
            c: common_vendor.t(formatCommentTime(comment.created_at)),
            d: common_vendor.t(comment.content),
            e: comment.isExpanded ? 1 : "",
            f: comment.content && comment.content.length > 50
          }, comment.content && comment.content.length > 50 ? {
            g: common_vendor.t(comment.isExpanded ? "收起" : "展开"),
            h: common_vendor.o(($event) => comment.isExpanded = !comment.isExpanded, comment.id)
          } : {}, {
            i: "8182af11-14-" + i0,
            j: common_vendor.p({
              type: comment.is_liked ? "hand-up-filled" : "hand-up",
              size: "14",
              color: comment.is_liked ? "#2c62ef" : "#999"
            }),
            k: common_vendor.t(comment.like_count || 0),
            l: comment.is_liked ? 1 : "",
            m: common_vendor.o(($event) => toggleLikeComment(comment), comment.id),
            n: comment.id
          });
        }),
        aH: hasMoreComments.value
      }, hasMoreComments.value ? common_vendor.e({
        aI: commentsLoading.value
      }, commentsLoading.value ? {
        aJ: common_vendor.p({
          type: "spinner-cycle",
          size: "16",
          color: "#999"
        })
      } : {}, {
        aK: commentsLoading.value
      }, commentsLoading.value ? {} : !hasMoreComments.value ? {} : {
        aM: common_vendor.t(displayedComments.value.length),
        aN: common_vendor.t(commentsData.value.length)
      }, {
        aL: !hasMoreComments.value,
        aO: commentsLoading.value ? 1 : "",
        aP: !hasMoreComments.value || commentsLoading.value ? 1 : "",
        aQ: common_vendor.o(($event) => !commentsLoading.value && hasMoreComments.value && loadMoreComments(), "24")
      }) : {}) : {}, {
        aR: currentTab.value === 2,
        aS: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        aT: common_vendor.f(relatedData.value, (item, index, i0) => {
          return {
            a: item.cover,
            b: common_vendor.t(item.type || "课程"),
            c: common_vendor.n(getTypeClass(item.type)),
            d: common_vendor.t(item.name),
            e: common_vendor.t(item.description),
            f: common_vendor.t(getPriceText(item)),
            g: common_vendor.t(formatNumber(item.view_count)),
            h: index,
            i: common_vendor.o(($event) => goToCourse(item), index)
          };
        })
      } : {}, {
        aU: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        aV: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        aW: common_vendor.o(closePaymentModal, "0a"),
        aX: common_vendor.t(courseData.name),
        aY: common_vendor.t(courseData.price),
        aZ: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        ba: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        bb: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        bc: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        bd: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        be: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        bf: common_vendor.o(clearCoupon, "f1")
      } : {}, {
        bg: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        bh: common_vendor.o(toggleCouponList, "65"),
        bi: common_vendor.f(paymentState.availableCoupons, (uc, k0, i0) => {
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
            g: "8182af11-18-" + i0,
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
        bj: paymentState.showCouponList,
        bk: balanceIcon,
        bl: common_vendor.t(isBalanceInsufficient.value ? "余额不足" : "可用: ¥" + userBalance.value.toFixed(2)),
        bm: common_vendor.s(isBalanceInsufficient.value ? "color:#ef4444" : ""),
        bn: paymentState.paymentMethod === "balance" ? 1 : "",
        bo: paymentState.paymentMethod === "balance" ? 1 : "",
        bp: isBalanceInsufficient.value ? 1 : "",
        bq: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "b1"),
        br: wechatIcon,
        bs: paymentState.paymentMethod === "wechat" ? 1 : "",
        bt: paymentState.paymentMethod === "wechat" ? 1 : "",
        bv: common_vendor.o(($event) => selectPaymentMethod("wechat"), "e4"),
        bw: common_vendor.t(courseData.price),
        bx: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        by: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        bz: common_vendor.t(finalAmount.value),
        bA: common_vendor.t(payButtonText.value),
        bB: common_vendor.o(confirmPay, "ea"),
        bC: payDisabled.value,
        bD: paymentState.loading.submit,
        bE: common_vendor.o(() => {
        }, "db"),
        bF: common_vendor.o(handlePaymentMaskClick, "5d")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8182af11"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/imagecourse.js.map
