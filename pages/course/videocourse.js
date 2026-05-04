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
  __name: "videocourse",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const courseId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
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
      linked_exams: null
    });
    const lecturerData = common_vendor.reactive({
      id: "",
      name: "",
      photo_path: "",
      avatar: "",
      description: "",
      lecturer_id: ""
    });
    const flattenedVideos = common_vendor.ref([]);
    const linkedCourses = common_vendor.ref([]);
    const linkedCourseWares = common_vendor.ref([]);
    const linkedExampapers = common_vendor.ref([]);
    let videoContext = null;
    const isPlaying = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const currentTime = common_vendor.ref(0);
    const duration = common_vendor.ref(0);
    const currentVideoSrc = common_vendor.ref("");
    const currentVideoIndex = common_vendor.ref({
      index: 0,
      subindex: 0,
      isChild: false,
      parentIndex: null
    });
    const nextVideoState = common_vendor.ref({});
    const autoplay = common_vendor.ref(true);
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
    const browseData = common_vendor.ref(null);
    const lecturerFollowData = common_vendor.ref(null);
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
      is_expired: true
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
      const diffInSeconds = Math.floor((now - commentTime) / 1e3);
      if (diffInSeconds < 60)
        return "刚刚";
      if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)}分钟前`;
      if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)}小时前`;
      if (diffInSeconds < 2592e3)
        return `${Math.floor(diffInSeconds / 86400)}天前`;
      return formatDate(timeString);
    };
    const maskNickname = (nickname) => {
      if (!nickname)
        return "匿名用户";
      if (nickname.includes("@")) {
        const [name, domain] = nickname.split("@");
        const maskedName = name.length > 2 ? name.substring(0, 2) + "***" : name + "***";
        return `${maskedName}@${domain.charAt(0)}***`;
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
    const checkTextOverflow = () => {
      needDescExpand.value = (courseData.description || "").length > 50;
      needLecturerExpand.value = (lecturerData.description || "").length > 50;
    };
    const finalAmount = common_vendor.computed(() => {
      const price = courseData.price || 0;
      const discount = paymentState.selectedCoupon ? paymentState.selectedCoupon.coupon_detail.discount_amount : 0;
      return Math.max(0, price - discount).toFixed(2);
    });
    const isBalanceInsufficient = common_vendor.computed(() => {
      return userBalance.value < parseFloat(finalAmount.value);
    });
    const availableCouponsCount = common_vendor.computed(() => {
      return paymentState.availableCoupons.filter((c) => isCouponAvailable(c)).length;
    });
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
    const totalCourseHours = common_vendor.computed(() => flattenedVideos.value.length);
    const isVipMember = common_vendor.computed(() => memberStatus.value.is_valid_member === true);
    const overallVideoTagClass = common_vendor.computed(() => courseData.sales_mode === "1" ? "tag-free" : "tag-paid");
    const overallVideoTagText = common_vendor.computed(() => {
      const salesMode = courseData.sales_mode;
      if (salesMode === "1")
        return "全集免费";
      if (salesMode === "2")
        return "会员免费";
      if (salesMode === "3")
        return "付费观看";
      return "";
    });
    const buttonClass = common_vendor.computed(() => {
      switch (courseData.sales_mode) {
        case "1":
          return "btn-free";
        case "2":
          return "btn-vip";
        default:
          return "btn-pay";
      }
    });
    const buttonText = common_vendor.computed(() => {
      if (pageLoading.value)
        return "加载中...";
      if (hasPurchased.value)
        return "✓ 已购买";
      switch (courseData.sales_mode) {
        case "1":
          return isLogin.value ? "立即学习" : "登录后免费学习";
        case "2":
          if (!isLogin.value)
            return "登录后学习";
          if (!isVipMember.value)
            return "开通会员免费学";
          return "会员免费学习";
        default:
          if (!isLogin.value)
            return `登录后购买 ¥${courseData.price}`;
          return `立即购买 ¥${courseData.price}`;
      }
    });
    const formattedDescription = common_vendor.computed(() => {
      const desc = courseData.description || "";
      if (!isDescExpanded.value && desc.length > 50)
        return desc.substring(0, 50) + "...";
      return desc;
    });
    const formattedLecturerDesc = common_vendor.computed(() => {
      const desc = lecturerData.description || "";
      if (!isLecturerExpanded.value && desc.length > 50)
        return desc.substring(0, 50) + "...";
      return desc;
    });
    const formattedContent = common_vendor.computed(() => {
      const content = courseData.content;
      if (!content)
        return null;
      let html = content.replace(/^"|"$/g, "");
      html = html.replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\t/g, "	").replace(/\\r/g, "\r").replace(
        /\\\\/g,
        "\\"
      );
      return html;
    });
    const checkIsFirstVideo = (video = null) => {
      const v = video || currentVideoIndex.value;
      return v.index === 0 && v.subindex === 0 && !v.isChild && v.parentIndex === null;
    };
    const canPlayVideo = (video) => {
      let isFirst = false;
      if (video && typeof video === "object") {
        if (video.pathIndex !== void 0)
          isFirst = checkIsFirstVideo(video);
        else
          isFirst = video.index === 0 && video.subindex === 0 && !video.isChild && video.parentIndex === null;
      }
      if (isFirst)
        return true;
      if (courseData.sales_mode === "1")
        return true;
      if (courseData.sales_mode === "2" && isVipMember.value)
        return true;
      if (courseData.sales_mode === "3" && hasPurchased.value)
        return true;
      return false;
    };
    const getPurchaseTipText = () => {
      switch (courseData.sales_mode) {
        case "2":
          return "请开通会员观看完整课程";
        case "3":
          return "请购买课程观看完整内容";
        default:
          return "请登录后观看";
      }
    };
    const getPriceText = (item) => {
      if (item.sales_mode == 1)
        return "免费";
      if (item.sales_mode == 2)
        return "会员免费";
      return `￥${item.price || 0}`;
    };
    const flattenAllVideos = (courseList) => {
      const result = [];
      const flatten = (courses, parentPath = []) => {
        if (!courses || !Array.isArray(courses))
          return;
        for (let i = 0; i < courses.length; i++) {
          const course = courses[i];
          const currentPath = [...parentPath, i];
          if (course.videos && Array.isArray(course.videos) && course.videos.length > 0) {
            for (let j = 0; j < course.videos.length; j++) {
              const video = course.videos[j];
              result.push({
                ...video,
                pathIndex: [...currentPath],
                videoIndex: j,
                isChild: parentPath.length > 0,
                parentIndex: parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
                original_name: video.original_name || video.name || `视频${j + 1}`,
                duration: video.duration || "00:00"
              });
            }
          }
          if (course.children && Array.isArray(course.children) && course.children.length > 0) {
            flatten(course.children, currentPath);
          }
        }
      };
      flatten(courseList);
      return result;
    };
    const findNextVideo = () => {
      const allVideos = flattenedVideos.value;
      if (allVideos.length === 0)
        return {};
      const currentIdx = allVideos.findIndex(
        (v) => v.videoIndex === currentVideoIndex.value.subindex && v.pathIndex[v.pathIndex.length - 1] === currentVideoIndex.value.index && v.isChild === currentVideoIndex.value.isChild && v.parentIndex === currentVideoIndex.value.parentIndex
      );
      if (currentIdx === -1 || currentIdx === allVideos.length - 1)
        return {};
      const nextVideo = allVideos[currentIdx + 1];
      return {
        index: nextVideo.pathIndex[nextVideo.pathIndex.length - 1],
        subindex: nextVideo.videoIndex,
        isChild: nextVideo.isChild,
        parentIndex: nextVideo.parentIndex
      };
    };
    const setVideoSource = (video) => {
      if (!video)
        return;
      currentVideoIndex.value = {
        index: video.pathIndex ? video.pathIndex[video.pathIndex.length - 1] : 0,
        subindex: video.videoIndex || 0,
        isChild: video.isChild || false,
        parentIndex: video.parentIndex || null
      };
      currentVideoSrc.value = video.path || "";
      nextVideoState.value = findNextVideo();
    };
    const isVideoActive = (video) => {
      const current = currentVideoIndex.value;
      return video.videoIndex === current.subindex && video.pathIndex[video.pathIndex.length - 1] === current.index && video.isChild === current.isChild && video.parentIndex === current.parentIndex;
    };
    const playVideo = (video) => {
      if (!canPlayVideo(video)) {
        common_vendor.index.showToast({
          title: getPurchaseTipText(),
          icon: "none",
          duration: 2e3
        });
        return;
      }
      setVideoSource(video);
      setTimeout(() => {
        if (videoContext && currentVideoSrc.value)
          videoContext.play();
      }, 100);
    };
    const playNextVideo = () => {
      if (!autoplay.value)
        return;
      const nextVideo = findNextVideo();
      if (Object.keys(nextVideo).length > 0) {
        const video = flattenedVideos.value.find(
          (v) => v.videoIndex === nextVideo.subindex && v.pathIndex[v.pathIndex.length - 1] === nextVideo.index && v.isChild === nextVideo.isChild && v.parentIndex === nextVideo.parentIndex
        );
        if (video) {
          if (!canPlayVideo(video)) {
            common_vendor.index.showToast({
              title: getPurchaseTipText(),
              icon: "none",
              duration: 2e3
            });
            return;
          }
          playVideo(video);
          common_vendor.index.showToast({
            title: "正在播放下一节",
            icon: "none"
          });
        }
      } else {
        common_vendor.index.showToast({
          title: "已是最后一节",
          icon: "none"
        });
      }
    };
    const onPlay = () => {
      isPlaying.value = true;
      isLoading.value = false;
    };
    const onPause = () => {
      isPlaying.value = false;
    };
    const onEnded = () => {
      isPlaying.value = false;
      if (autoplay.value)
        setTimeout(() => playNextVideo(), 1e3);
    };
    const onTimeUpdate = (e) => {
      currentTime.value = e.detail.currentTime;
      if (e.detail.duration)
        duration.value = e.detail.duration;
    };
    const onWaiting = () => {
      isLoading.value = true;
    };
    const onCanPlay = () => {
      isLoading.value = false;
    };
    const onLoadedMetadata = (e) => {
      duration.value = e.detail.duration;
    };
    const onVideoError = () => {
      if (currentVideoSrc.value)
        common_vendor.index.showToast({
          title: "视频加载失败",
          icon: "none"
        });
      isLoading.value = false;
    };
    const onFullScreenChange = () => {
    };
    const fetchLecturerData = async (lecturerid) => {
      try {
        const response = await api_index.fetchSpecificLecturerData(shopId.value, lecturerid);
        if (response.data)
          Object.assign(lecturerData, response.data);
      } catch (error) {
      }
    };
    const fetchCourseListData = async () => {
      if (!shopId.value || !courseId.value)
        return;
      try {
        const courseResponse = await api_index.getVideoCourseList({
          UXMID: shopId.value,
          user_id: userId.value,
          courseid: courseId.value
        });
        if (!courseResponse.data) {
          common_vendor.index.showToast({
            title: "未找到课程数据",
            icon: "none"
          });
          return;
        }
        const responseData = courseResponse.data;
        rawCategory.value = responseData.category || "";
        Object.assign(courseData, {
          id: responseData.course_id || "",
          name: responseData.name || "",
          cover: responseData.cover || "",
          view_count: responseData.view_count || 0,
          created_at: responseData.created_at || "",
          category: responseData.categoryLabels ? responseData.categoryLabels.join("/") : "课程详情",
          description: responseData.description || "",
          content: responseData.content || "",
          sales_mode: responseData.sales_mode || "1",
          price: responseData.price || 0,
          regionNames: responseData.regionNames || "",
          lecturer_id: responseData.lecturer_id || "[]",
          linked_courses: responseData.linked_courses,
          linked_coursewares: responseData.linked_coursewares,
          linked_exams: responseData.linked_exams
        });
        if (responseData.linked_courses) {
          try {
            linkedCourses.value = typeof responseData.linked_courses === "string" ? JSON.parse(responseData.linked_courses) : responseData.linked_courses;
            flattenedVideos.value = flattenAllVideos(linkedCourses.value);
          } catch (e) {
            linkedCourses.value = [];
            flattenedVideos.value = [];
          }
        } else {
          linkedCourses.value = [];
          flattenedVideos.value = [];
        }
        if (responseData.linked_coursewares) {
          try {
            linkedCourseWares.value = typeof responseData.linked_coursewares === "string" ? JSON.parse(responseData.linked_coursewares) : responseData.linked_coursewares;
          } catch (e) {
            linkedCourseWares.value = [];
          }
        } else {
          linkedCourseWares.value = [];
        }
        if (responseData.linked_exams) {
          try {
            linkedExampapers.value = typeof responseData.linked_exams === "string" ? JSON.parse(responseData.linked_exams) : responseData.linked_exams;
          } catch (e) {
            linkedExampapers.value = [];
          }
        } else {
          linkedExampapers.value = [];
        }
        if (responseData.lecturerName)
          lecturerData.name = responseData.lecturerName;
        if (responseData.lecturer_id) {
          try {
            const lecturerIds = typeof responseData.lecturer_id === "string" ? JSON.parse(responseData.lecturer_id) : responseData.lecturer_id;
            if (lecturerIds.length > 0 && lecturerIds[0].length > 0) {
              await fetchLecturerData(lecturerIds[0][0]);
            }
          } catch (e) {
          }
        }
        await common_vendor.nextTick$1();
        if (flattenedVideos.value.length > 0)
          setVideoSource(flattenedVideos.value[0]);
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: courseId.value,
              type: "videocourse"
            });
            await Promise.all([getBrowse(), getFavorite(), getFollow(), getLecturerFollow()]);
          } catch (e) {
          }
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取课程数据失败",
          icon: "none"
        });
      }
    };
    const getBrowse = async () => {
      if (!isLogin.value)
        return;
      try {
        const response = await api_index.getBrowseRecord({
          UXMID: shopId.value,
          content_id: courseId.value,
          type: "videocourse"
        });
        if (response.status === "success")
          browseData.value = response.data;
      } catch (error) {
      }
    };
    const getFavorite = async () => {
      if (!isLogin.value)
        return;
      try {
        const response = await api_index.getFavoriteRecord({
          UXMID: shopId.value,
          content_id: courseId.value,
          type: "videocourse"
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
          content_id: courseId.value,
          type: "videocourse"
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
        if (response.status === "success") {
          lecturerFollowData.value = response.data;
          isLecturerFollowed.value = response.data.is_following;
        }
      } catch (error) {
      }
    };
    const checkPurchaseStatus = async () => {
      if (!isLogin.value)
        return;
      purchaseLoading.value = true;
      try {
        const response = await api_index.checkCoursePurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: courseId.value,
          product_type: "videocourse"
        });
        hasPurchased.value = response.data.has_purchased;
        if (response.data.member_status)
          memberStatus.value = response.data.member_status;
      } catch (error) {
        hasPurchased.value = false;
      } finally {
        purchaseLoading.value = false;
      }
    };
    const fetchCouponsList = async () => {
      if (!shopId.value)
        return;
      try {
        const response = await api_index.getCouponsList({
          UXMID: shopId.value
        });
        couponData.value = response.data || [];
      } catch (error) {
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
    const fetchLatestComments = async () => {
      if (!shopId.value || !courseId.value)
        return;
      try {
        const response = await api_index.getCourseComments({
          UXMID: shopId.value,
          course_id: courseId.value
        });
        if (response.status === "success") {
          commentsData.value = (response.data || []).map((comment) => ({
            ...comment,
            isExpanded: false
          }));
          commentsPage.value = 1;
          updateDisplayedComments();
        }
      } catch (error) {
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
            const categoryArray = JSON.parse(trimmed);
            if (categoryArray.length > 0)
              categoryId = categoryArray[categoryArray.length - 1];
          }
        } catch (e) {
        }
      }
      if (!categoryId)
        return;
      try {
        const response = await api_index.getRelatedRecommendations({
          UXMID: shopId.value,
          category: [categoryId]
        });
        relatedData.value = response.data || [];
      } catch (error) {
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
            if (coupon.usage_limit > 0 && courseData.price < coupon.usage_limit)
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
      if (coupon.usage_limit > 0 && courseData.price < coupon.usage_limit)
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
    const handlePaymentMaskClick = () => {
      closePaymentModal();
    };
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
      setTimeout(() => {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        if (currentPage) {
          currentPage.onLoad({
            id: courseId.value
          });
        }
      }, 1500);
    };
    const updateDisplayedComments = () => {
      const endIndex = commentsPage.value * COMMENTS_PER_PAGE;
      displayedComments.value = commentsData.value.slice(0, endIndex);
      hasMoreComments.value = endIndex < commentsData.value.length;
    };
    const loadMoreComments = () => {
      commentsPage.value += 1;
      updateDisplayedComments();
    };
    const submitComment = async () => {
      if (!checkLoginStatus())
        return;
      if (!commentText.value.trim()) {
        common_vendor.index.showToast({
          title: "评论内容不能为空",
          icon: "none"
        });
        return;
      }
      if (isSubmitting.value)
        return;
      isSubmitting.value = true;
      try {
        const response = await api_index.submitCourseComment({
          UXMID: shopId.value,
          user_id: userId.value,
          course_id: courseId.value,
          content: commentText.value.trim()
        });
        if (response.status === "success") {
          common_vendor.index.showToast({
            title: "评论发布成功",
            icon: "success"
          });
          commentText.value = "";
          await fetchLatestComments();
        } else
          common_vendor.index.showToast({
            title: response.message || "评论发布失败",
            icon: "none"
          });
      } catch (error) {
        common_vendor.index.showToast({
          title: "评论发布失败",
          icon: "none"
        });
      } finally {
        isSubmitting.value = false;
      }
    };
    const toggleLikeComment = async (comment) => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.likeCourseComment({
          UXMID: shopId.value,
          user_id: userId.value,
          course_id: courseId.value,
          comment_id: comment.id
        });
        if (response.status === "success") {
          comment.is_liked = !comment.is_liked;
          comment.like_count = comment.is_liked ? (comment.like_count || 0) + 1 : Math.max(0, (comment.like_count || 0) - 1);
        }
      } catch (error) {
      }
    };
    const handleFavorite = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFavorite({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: courseId.value,
          type: "videocourse"
        });
        if (response.status === "success") {
          isFavorited.value = response.is_favorited;
          if (favoriteData.value) {
            favoriteData.value.is_favorited = response.is_favorited;
            favoriteData.value.favorite_record_count = response.is_favorited ? (favoriteData.value.favorite_record_count || 0) + 1 : Math.max(0, (favoriteData.value.favorite_record_count || 0) - 1);
          }
          common_vendor.index.showToast({
            title: isFavorited.value ? "已成功收藏" : "已取消收藏",
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
          content_id: courseId.value,
          type: "videocourse"
        });
        if (response.status === "success") {
          isFollowing.value = response.is_following;
          if (followData.value) {
            followData.value.is_following = response.is_following;
            followData.value.follow_record_count = response.is_following ? (followData.value.follow_record_count || 0) + 1 : Math.max(0, (followData.value.follow_record_count || 0) - 1);
          }
          common_vendor.index.showToast({
            title: isFollowing.value ? "已成功关注" : "已取消关注",
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
            title: isLecturerFollowed.value ? "已成功关注讲师" : "已取消关注讲师",
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
    const handlePurchase = () => {
      if (!checkLoginStatus())
        return;
      switch (courseData.sales_mode) {
        case "1":
          common_vendor.index.showToast({
            title: "开始免费学习",
            icon: "success"
          });
          break;
        case "2":
          if (!isVipMember.value)
            handleUpgradeVip();
          else
            common_vendor.index.showToast({
              title: "会员免费学习",
              icon: "success"
            });
          break;
        case "3":
          handleBuyNow();
          break;
        default:
          common_vendor.index.showToast({
            title: "开始学习",
            icon: "success"
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
          order_type: "course",
          product_type: "videocourse",
          product_id: courseId.value,
          product_name: courseData.name,
          unit_price: courseData.price,
          quantity: 1,
          expire_time: 24
        });
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
        url: "/pages/benefits/benefits",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const toggleDescExpand = () => {
      isDescExpanded.value = !isDescExpanded.value;
    };
    const toggleLecturerExpand = () => {
      isLecturerExpanded.value = !isLecturerExpanded.value;
    };
    const switchTab = (index) => {
      currentTab.value = index;
    };
    const toggleAutoplay = (e) => {
      autoplay.value = e.detail.value;
    };
    const goToCourse = (item) => {
      const id = item.course_id || item.id;
      common_vendor.index.navigateTo({
        url: `/pages/course/videocourse?id=${id}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateTo = (url) => {
      const isTabBarPage = url === "/pages/index/index" || url === "/pages/resource/resource";
      const navigateMethod = isTabBarPage ? common_vendor.index.switchTab : common_vendor.index.navigateTo;
      navigateMethod({
        url,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToLogin = () => {
      checkLoginStatus();
    };
    const cleanupResources = () => {
      videoContext = null;
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
          common_vendor.index.showToast({
            title: "缺少课程ID",
            icon: "none"
          });
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
      } catch (error) {
        common_vendor.index.showToast({
          title: "初始化失败，请刷新重试",
          icon: "none"
        });
      } finally {
        pageLoading.value = false;
      }
    });
    common_vendor.onMounted(() => {
      videoContext = common_vendor.index.createVideoContext("courseVideo");
      common_vendor.nextTick$1(() => {
        if (currentVideoSrc.value)
          videoContext = common_vendor.index.createVideoContext("courseVideo");
      });
    });
    common_vendor.onUnmounted(() => {
      cleanupResources();
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.o(($event) => navigateTo("/pages/index/index"), "a3"),
        b: common_vendor.o(($event) => navigateTo("/pages/resource/resource"), "09"),
        c: common_vendor.p({
          separator: "/"
        }),
        d: currentVideoSrc.value
      }, currentVideoSrc.value ? {
        e: currentVideoSrc.value,
        f: courseData.cover,
        g: common_vendor.o(onPlay, "38"),
        h: common_vendor.o(onPause, "2e"),
        i: common_vendor.o(onEnded, "27"),
        j: common_vendor.o(onTimeUpdate, "7e"),
        k: common_vendor.o(onWaiting, "49"),
        l: common_vendor.o(onCanPlay, "c4"),
        m: common_vendor.o(onLoadedMetadata, "8d"),
        n: common_vendor.o(onVideoError, "6a"),
        o: common_vendor.o(onFullScreenChange, "90")
      } : common_vendor.e({
        p: courseData.cover
      }, courseData.cover ? {
        q: courseData.cover
      } : {}), {
        r: common_vendor.t(courseData.name),
        s: overallVideoTagText.value
      }, overallVideoTagText.value ? {
        t: common_vendor.t(overallVideoTagText.value),
        v: common_vendor.n(overallVideoTagClass.value)
      } : {}, {
        w: common_vendor.p({
          type: "videocam",
          size: "16",
          color: "#999999"
        }),
        x: common_vendor.t(formatNumber(courseData.view_count)),
        y: common_vendor.p({
          type: "list",
          size: "16",
          color: "#999999"
        }),
        z: common_vendor.t(totalCourseHours.value),
        A: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999999"
        }),
        B: common_vendor.t(formatDate(courseData.created_at)),
        C: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666666"
        }),
        D: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        E: isFavorited.value ? 1 : "",
        F: common_vendor.o(handleFavorite, "e8"),
        G: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666666"
        }),
        H: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        I: isFollowing.value ? 1 : "",
        J: common_vendor.o(handleFollow, "8a"),
        K: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666666"
        }),
        L: common_vendor.o(handleShare, "be"),
        M: common_vendor.t(buttonText.value),
        N: common_vendor.n(buttonClass.value),
        O: common_vendor.o(handlePurchase, "f9"),
        P: pageLoading.value || hasPurchased.value || isVipMember.value || courseData.sales_mode === "1",
        Q: common_vendor.t(formattedDescription.value),
        R: isDescExpanded.value ? 1 : "",
        S: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        T: common_vendor.o(toggleDescExpand, "84")
      } : {}, {
        U: isDescExpanded.value
      }, isDescExpanded.value ? {
        V: common_vendor.o(toggleDescExpand, "63")
      } : {}, {
        W: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        X: common_vendor.o(handleFollowLecturer, "37"),
        Y: lecturerData.photo_path || lecturerData.avatar,
        Z: common_vendor.t(lecturerData.name),
        aa: common_vendor.o(goToLecturerDetail, "ff"),
        ab: common_vendor.t(formattedLecturerDesc.value),
        ac: isLecturerExpanded.value ? 1 : "",
        ad: !isLecturerExpanded.value && needLecturerExpand.value
      }, !isLecturerExpanded.value && needLecturerExpand.value ? {
        ae: common_vendor.o(toggleLecturerExpand, "e3")
      } : {}, {
        af: isLecturerExpanded.value
      }, isLecturerExpanded.value ? {
        ag: common_vendor.o(toggleLecturerExpand, "59")
      } : {}, {
        ah: currentTab.value === 0 ? 1 : "",
        ai: common_vendor.o(($event) => switchTab(0), "ea"),
        aj: currentTab.value === 1 ? 1 : "",
        ak: common_vendor.o(($event) => switchTab(1), "5f"),
        al: common_vendor.t(commentsData.value.length),
        am: currentTab.value === 2 ? 1 : "",
        an: common_vendor.o(($event) => switchTab(2), "bf"),
        ao: common_vendor.t(totalCourseHours.value),
        ap: autoplay.value,
        aq: common_vendor.o(toggleAutoplay, "fb"),
        ar: common_vendor.f(flattenedVideos.value, (video, index, i0) => {
          return common_vendor.e({
            a: !isVideoActive(video)
          }, !isVideoActive(video) ? {
            b: "7186185a-10-" + i0,
            c: common_vendor.p({
              type: "videocam",
              size: "16",
              color: "#999999"
            })
          } : {}, {
            d: common_vendor.t(video.original_name || video.title),
            e: common_vendor.t(video.duration),
            f: index,
            g: isVideoActive(video) ? 1 : "",
            h: common_vendor.o(($event) => playVideo(video), index)
          });
        }),
        as: currentTab.value === 0,
        at: formattedContent.value
      }, formattedContent.value ? {
        av: formattedContent.value
      } : {}, {
        aw: currentTab.value === 1,
        ax: isLogin.value
      }, isLogin.value ? {
        ay: commentText.value,
        az: common_vendor.o(($event) => commentText.value = $event.detail.value, "93"),
        aA: common_vendor.t(commentText.value.length),
        aB: common_vendor.o(submitComment, "ab"),
        aC: !commentText.value.trim() || isSubmitting.value
      } : {
        aD: common_vendor.o(navigateToLogin, "90")
      }, {
        aE: displayedComments.value.length > 0
      }, displayedComments.value.length > 0 ? common_vendor.e({
        aF: common_vendor.f(displayedComments.value, (comment, index, i0) => {
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
            i: "7186185a-11-" + i0,
            j: common_vendor.p({
              type: comment.is_liked ? "hand-up-filled" : "hand-up",
              size: "14",
              color: comment.is_liked ? "#2c62ef" : "#999999"
            }),
            k: common_vendor.t(comment.like_count || 0),
            l: comment.is_liked ? 1 : "",
            m: common_vendor.o(($event) => toggleLikeComment(comment), comment.id),
            n: comment.id
          });
        }),
        aG: hasMoreComments.value
      }, hasMoreComments.value ? common_vendor.e({
        aH: commentsLoading.value
      }, commentsLoading.value ? {} : {
        aI: common_vendor.t(displayedComments.value.length),
        aJ: common_vendor.t(commentsData.value.length)
      }, {
        aK: common_vendor.o(loadMoreComments, "8f")
      }) : {}) : {}, {
        aL: currentTab.value === 2,
        aM: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        aN: common_vendor.f(relatedData.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.cover,
            b: common_vendor.t(item.type || "课程"),
            c: common_vendor.n(getTypeClass(item.type)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(item.description),
            g: common_vendor.t(getPriceText(item)),
            h: common_vendor.t(formatNumber(item.view_count)),
            i: index,
            j: common_vendor.o(($event) => goToCourse(item), index)
          });
        })
      } : {}, {
        aO: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        aP: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        aQ: common_vendor.o(closePaymentModal, "46"),
        aR: common_vendor.t(courseData.name),
        aS: common_vendor.t(courseData.price),
        aT: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        aU: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        aV: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aW: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        aX: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        aY: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aZ: common_vendor.o(clearCoupon, "81")
      } : {}, {
        ba: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        bb: common_vendor.o(toggleCouponList, "66"),
        bc: common_vendor.f(paymentState.availableCoupons, (userCoupon, k0, i0) => {
          var _a2, _b2, _c;
          return common_vendor.e({
            a: common_vendor.t(userCoupon.coupon_detail.discount_amount),
            b: common_vendor.t(userCoupon.coupon_detail.name),
            c: userCoupon.coupon_detail.usage_limit > 0
          }, userCoupon.coupon_detail.usage_limit > 0 ? {
            d: common_vendor.t(userCoupon.coupon_detail.usage_limit)
          } : {}, {
            e: common_vendor.t(formatDate(userCoupon.coupon_detail.end_time)),
            f: ((_a2 = paymentState.selectedCoupon) == null ? void 0 : _a2.user_coupon_id) === userCoupon.user_coupon_id
          }, ((_b2 = paymentState.selectedCoupon) == null ? void 0 : _b2.user_coupon_id) === userCoupon.user_coupon_id ? {
            g: "7186185a-14-" + i0,
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
        bd: paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon
      }, paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon ? {} : {}, {
        be: paymentState.showCouponList,
        bf: balanceIcon,
        bg: isBalanceInsufficient.value
      }, isBalanceInsufficient.value ? {} : {
        bh: common_vendor.t(userBalance.value.toFixed(2))
      }, {
        bi: paymentState.paymentMethod === "balance" ? 1 : "",
        bj: paymentState.paymentMethod === "balance" ? 1 : "",
        bk: isBalanceInsufficient.value ? 1 : "",
        bl: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "59"),
        bm: wechatIcon,
        bn: paymentState.paymentMethod === "wechat" ? 1 : "",
        bo: paymentState.paymentMethod === "wechat" ? 1 : "",
        bp: common_vendor.o(($event) => selectPaymentMethod("wechat"), "e8"),
        bq: common_vendor.t(courseData.price),
        br: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        bs: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        bt: common_vendor.t(finalAmount.value),
        bv: common_vendor.t(payButtonText.value),
        bw: common_vendor.o(confirmPay, "f0"),
        bx: payDisabled.value,
        by: paymentState.loading.submit,
        bz: common_vendor.o(() => {
        }, "ff"),
        bA: common_vendor.o(handlePaymentMaskClick, "f5")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7186185a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/videocourse.js.map
