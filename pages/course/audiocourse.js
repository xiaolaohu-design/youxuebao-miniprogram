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
  __name: "audiocourse",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const courseId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
    let innerAudioContext = null;
    const isPlaying = common_vendor.ref(false);
    const currentTime = common_vendor.ref(0);
    const duration = common_vendor.ref(0);
    const progress = common_vendor.ref(0);
    const currentAudioSrc = common_vendor.ref("");
    const currentAudioTitle = common_vendor.ref("");
    const currentAudioIndex = common_vendor.ref({
      index: 0,
      subindex: 0,
      isChild: false,
      parentIndex: null
    });
    const nextAudioState = common_vendor.ref({});
    const autoplay = common_vendor.ref(true);
    const needTitleScroll = common_vendor.ref(false);
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
    const flattenedAudios = common_vendor.ref([]);
    const linkedCourses = common_vendor.ref([]);
    const linkedCourseWares = common_vendor.ref([]);
    const linkedExampapers = common_vendor.ref([]);
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
    common_vendor.watch(
      () => currentAudioTitle.value || courseData.name,
      (newTitle) => {
        needTitleScroll.value = newTitle && newTitle.length > 10;
      },
      {
        immediate: true
      }
    );
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
    const formatTime = (time) => {
      if (!time || isNaN(time))
        return "00:00";
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
    const totalCourseHours = common_vendor.computed(() => flattenedAudios.value.length);
    const isVipMember = common_vendor.computed(() => memberStatus.value.is_valid_member === true);
    const overallAudioTagClass = common_vendor.computed(() => courseData.sales_mode === "1" ? "tag-free" : "tag-paid");
    const overallAudioTagText = common_vendor.computed(() => {
      const salesMode = courseData.sales_mode;
      if (salesMode === "1")
        return "全集免费";
      if (salesMode === "2")
        return "会员免费";
      if (salesMode === "3")
        return "付费收听";
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
      html = html.replace(/\\"/g, '"').replace(/\\n/g, "<br/>").replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\\r/g, "").replace(/\\\\/g, "\\");
      return html;
    });
    const finalAmount = common_vendor.computed(() => {
      const price = courseData.price || 0;
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
      if (paymentState.paymentMethod === "balance") {
        return isBalanceInsufficient.value ? "余额不足" : `余额支付 ¥${finalAmount.value}`;
      }
      return `微信支付 ¥${finalAmount.value}`;
    });
    const checkIsFirstAudio = (audio = null) => {
      const a = audio || currentAudioIndex.value;
      return a.index === 0 && a.subindex === 0 && !a.isChild && a.parentIndex === null;
    };
    const canPlayAudio = (audio) => {
      let isFirst = false;
      if (audio && typeof audio === "object") {
        if (audio.pathIndex !== void 0)
          isFirst = checkIsFirstAudio(audio);
        else
          isFirst = audio.index === 0 && audio.subindex === 0 && !audio.isChild && audio.parentIndex === null;
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
          return "请开通会员收听完整课程";
        case "3":
          return "请购买课程收听完整内容";
        default:
          return "请登录后收听";
      }
    };
    const flattenAllAudios = (courseList) => {
      const result = [];
      const flatten = (courses, parentPath = []) => {
        if (!courses || !Array.isArray(courses))
          return;
        for (let i = 0; i < courses.length; i++) {
          const course = courses[i];
          const currentPath = [...parentPath, i];
          if (course.mp3s && Array.isArray(course.mp3s) && course.mp3s.length > 0) {
            for (let j = 0; j < course.mp3s.length; j++) {
              const audio = course.mp3s[j];
              result.push({
                ...audio,
                pathIndex: [...currentPath],
                audioIndex: j,
                isChild: parentPath.length > 0,
                parentIndex: parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
                original_name: audio.name || audio.title || `音频${j + 1}`,
                duration: audio.duration || "--:--"
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
    const findNextAudio = () => {
      const allAudios = flattenedAudios.value;
      if (allAudios.length === 0)
        return {};
      const currentIdx = allAudios.findIndex(
        (a) => a.audioIndex === currentAudioIndex.value.subindex && a.pathIndex[a.pathIndex.length - 1] === currentAudioIndex.value.index && a.isChild === currentAudioIndex.value.isChild && a.parentIndex === currentAudioIndex.value.parentIndex
      );
      if (currentIdx === -1 || currentIdx === allAudios.length - 1)
        return {};
      const nextAudio = allAudios[currentIdx + 1];
      return {
        index: nextAudio.pathIndex[nextAudio.pathIndex.length - 1],
        subindex: nextAudio.audioIndex,
        isChild: nextAudio.isChild,
        parentIndex: nextAudio.parentIndex
      };
    };
    const isAudioActive = (audio) => {
      const current = currentAudioIndex.value;
      return audio.audioIndex === current.subindex && audio.pathIndex[audio.pathIndex.length - 1] === current.index && audio.isChild === current.isChild && audio.parentIndex === current.parentIndex;
    };
    const initAudioContext = () => {
      if (innerAudioContext) {
        try {
          innerAudioContext.destroy();
        } catch (e) {
        }
        innerAudioContext = null;
      }
      innerAudioContext = common_vendor.index.createInnerAudioContext();
      innerAudioContext.autoplay = false;
      innerAudioContext.obeyMuteSwitch = false;
      innerAudioContext.onPlay(() => {
        isPlaying.value = true;
      });
      innerAudioContext.onPause(() => {
        isPlaying.value = false;
      });
      innerAudioContext.onStop(() => {
        isPlaying.value = false;
      });
      innerAudioContext.onEnded(() => {
        isPlaying.value = false;
        if (autoplay.value)
          setTimeout(() => playNextAudio(), 1e3);
      });
      innerAudioContext.onTimeUpdate(() => {
        if (innerAudioContext) {
          currentTime.value = innerAudioContext.currentTime;
          if (innerAudioContext.duration) {
            duration.value = innerAudioContext.duration;
            progress.value = currentTime.value / duration.value * 100;
          }
        }
      });
      innerAudioContext.onError(() => {
        isPlaying.value = false;
        common_vendor.index.showToast({
          title: "音频播放失败",
          icon: "none"
        });
      });
    };
    const togglePlay = () => {
      if (!innerAudioContext)
        initAudioContext();
      if (!currentAudioSrc.value) {
        common_vendor.index.showToast({
          title: "暂无音频资源",
          icon: "none"
        });
        return;
      }
      if (isPlaying.value) {
        innerAudioContext.pause();
      } else {
        if (innerAudioContext.src !== currentAudioSrc.value) {
          innerAudioContext.src = currentAudioSrc.value;
        }
        innerAudioContext.play();
      }
    };
    const seekTo = (event) => {
      if (!innerAudioContext || !duration.value)
        return;
      const query = common_vendor.index.createSelectorQuery();
      query.select(".mini-progress-bar").boundingClientRect((rect) => {
        if (rect && event.detail && event.detail.x) {
          const ratio = Math.max(0, Math.min(1, (event.detail.x - rect.left) / rect.width));
          const seekTime = ratio * duration.value;
          innerAudioContext.seek(seekTime);
        }
      }).exec();
    };
    const setAudioSource = (audio) => {
      if (!audio)
        return;
      currentAudioIndex.value = {
        index: audio.pathIndex ? audio.pathIndex[audio.pathIndex.length - 1] : 0,
        subindex: audio.audioIndex || 0,
        isChild: audio.isChild || false,
        parentIndex: audio.parentIndex || null
      };
      currentAudioTitle.value = audio.original_name || audio.title || "";
      currentAudioSrc.value = audio.path || "";
      nextAudioState.value = findNextAudio();
      currentTime.value = 0;
      progress.value = 0;
      isPlaying.value = false;
      if (innerAudioContext) {
        innerAudioContext.stop();
        innerAudioContext.src = currentAudioSrc.value;
      }
    };
    const playAudio = (audio) => {
      if (!canPlayAudio(audio)) {
        common_vendor.index.showToast({
          title: getPurchaseTipText(),
          icon: "none",
          duration: 2e3
        });
        return;
      }
      setAudioSource(audio);
      common_vendor.nextTick$1(() => {
        if (!innerAudioContext)
          initAudioContext();
        innerAudioContext.src = currentAudioSrc.value;
        innerAudioContext.play();
      });
    };
    const playNextAudio = () => {
      if (!autoplay.value)
        return;
      const nextAudio = findNextAudio();
      if (Object.keys(nextAudio).length > 0) {
        const audio = flattenedAudios.value.find(
          (a) => a.audioIndex === nextAudio.subindex && a.pathIndex[a.pathIndex.length - 1] === nextAudio.index && a.isChild === nextAudio.isChild && a.parentIndex === nextAudio.parentIndex
        );
        if (audio) {
          if (!canPlayAudio(audio)) {
            common_vendor.index.showToast({
              title: getPurchaseTipText(),
              icon: "none",
              duration: 2e3
            });
            return;
          }
          playAudio(audio);
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
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          courseid: courseId.value
        };
        const courseResponse = await api_index.getAudioCourseList(formData);
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
            flattenedAudios.value = flattenAllAudios(linkedCourses.value);
          } catch (e) {
            linkedCourses.value = [];
            flattenedAudios.value = [];
          }
        } else {
          linkedCourses.value = [];
          flattenedAudios.value = [];
        }
        if (responseData.linked_coursewares) {
          try {
            linkedCourseWares.value = typeof responseData.linked_coursewares === "string" ? JSON.parse(
              responseData.linked_coursewares
            ) : responseData.linked_coursewares;
          } catch (e) {
            linkedCourseWares.value = [];
          }
        } else {
          linkedCourseWares.value = [];
        }
        if (responseData.linked_exams) {
          try {
            linkedExampapers.value = typeof responseData.linked_exams === "string" ? JSON.parse(
              responseData.linked_exams
            ) : responseData.linked_exams;
          } catch (e) {
            linkedExampapers.value = [];
          }
        } else {
          linkedExampapers.value = [];
        }
        if (responseData.lecturer_id) {
          try {
            const lecturerIds = typeof responseData.lecturer_id === "string" ? JSON.parse(responseData.lecturer_id) : responseData.lecturer_id;
            if (lecturerIds && lecturerIds.length > 0 && lecturerIds[0].length > 0)
              await fetchLecturerData(lecturerIds[0][0]);
          } catch (e) {
          }
        }
        if (flattenedAudios.value.length > 0)
          setAudioSource(flattenedAudios.value[0]);
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: courseId.value,
              type: "audiocourse"
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
          type: "audiocourse"
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
          type: "audiocourse"
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
          type: "audiocourse"
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
        const response = await api_index.checkMp3CoursePurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: courseId.value,
          product_type: "audiocourse"
        });
        if (response.data) {
          hasPurchased.value = response.data.has_purchased;
          if (response.data.member_status)
            memberStatus.value = response.data.member_status;
        }
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
        const response = await api_index.getMp3CourseComments({
          UXMID: shopId.value,
          course_id: courseId.value
        });
        if (response.status === "success") {
          commentsData.value = response.data || [];
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
        const response = await api_index.getMp3RelatedRecommendations({
          UXMID: shopId.value,
          category: [categoryId]
        });
        relatedData.value = response.data || [];
      } catch (error) {
      }
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
        const response = await api_index.submitMp3CourseComment({
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
        } else {
          common_vendor.index.showToast({
            title: response.message || "评论发布失败",
            icon: "none"
          });
        }
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
        const response = await api_index.likeMp3CourseComment({
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
      setTimeout(() => {
        checkPurchaseStatus();
      }, 1500);
    };
    const handleFavorite = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFavorite({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: courseId.value,
          type: "audiocourse"
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
        await getFavorite();
      } catch (error) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
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
          type: "audiocourse"
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
        await getFollow();
      } catch (error) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
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
        await getLecturerFollow();
      } catch (error) {
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
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
          product_type: "audiocourse",
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
        url: "/pages/benefits/benefits"
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
        url: `/pages/course/audiocourse?id=${id}`
      });
    };
    const navigateTo = (url) => {
      const isTabBarPage = url === "/pages/index/index" || url === "/pages/resource/resource";
      const navigateMethod = isTabBarPage ? common_vendor.index.switchTab : common_vendor.index.navigateTo;
      navigateMethod({
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
        if (options.id) {
          courseId.value = options.id;
        } else {
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
        initAudioContext();
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
    common_vendor.onUnmounted(() => {
      if (innerAudioContext) {
        innerAudioContext.destroy();
        innerAudioContext = null;
      }
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.o(($event) => navigateTo("/pages/index/index"), "a3"),
        b: common_vendor.o(($event) => navigateTo("/pages/resource/resource"), "09"),
        c: common_vendor.p({
          separator: "/"
        }),
        d: courseData.cover
      }, courseData.cover ? {
        e: courseData.cover
      } : {}, {
        f: courseData.cover || lecturerData.photo_path || lecturerData.avatar,
        g: common_vendor.t(currentAudioTitle.value || courseData.name),
        h: needTitleScroll.value
      }, needTitleScroll.value ? {
        i: common_vendor.t(currentAudioTitle.value || courseData.name)
      } : {}, {
        j: needTitleScroll.value ? 1 : "",
        k: common_vendor.t(lecturerData.name),
        l: isPlaying.value ? "/static/image/course/pause.png" : "/static/image/course/play.png",
        m: common_vendor.o(togglePlay, "f0"),
        n: duration.value > 0
      }, duration.value > 0 ? {
        o: progress.value + "%",
        p: common_vendor.o(seekTo, "b9"),
        q: common_vendor.t(formatTime(currentTime.value)),
        r: common_vendor.t(formatTime(duration.value))
      } : {}, {
        s: common_vendor.t(courseData.name),
        t: overallAudioTagText.value
      }, overallAudioTagText.value ? {
        v: common_vendor.t(overallAudioTagText.value),
        w: common_vendor.n(overallAudioTagClass.value)
      } : {}, {
        x: common_vendor.p({
          type: "sound",
          size: "16",
          color: "#999"
        }),
        y: common_vendor.t(formatNumber(courseData.view_count)),
        z: common_vendor.p({
          type: "list",
          size: "16",
          color: "#999"
        }),
        A: common_vendor.t(totalCourseHours.value),
        B: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        C: common_vendor.t(formatDate(courseData.created_at)),
        D: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666"
        }),
        E: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        F: common_vendor.o(handleFavorite, "5f"),
        G: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666"
        }),
        H: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        I: common_vendor.o(handleFollow, "e6"),
        J: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666"
        }),
        K: common_vendor.o(handleShare, "2e"),
        L: common_vendor.t(buttonText.value),
        M: common_vendor.n(buttonClass.value),
        N: common_vendor.o(handlePurchase, "4b"),
        O: pageLoading.value || hasPurchased.value || isVipMember.value || courseData.sales_mode === "1",
        P: common_vendor.t(formattedDescription.value),
        Q: isDescExpanded.value ? 1 : "",
        R: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        S: common_vendor.o(toggleDescExpand, "84")
      } : {}, {
        T: isDescExpanded.value
      }, isDescExpanded.value ? {
        U: common_vendor.o(toggleDescExpand, "54")
      } : {}, {
        V: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        W: common_vendor.o(handleFollowLecturer, "a8"),
        X: lecturerData.photo_path || lecturerData.avatar,
        Y: common_vendor.t(lecturerData.name),
        Z: common_vendor.o(goToLecturerDetail, "68"),
        aa: common_vendor.t(formattedLecturerDesc.value),
        ab: isLecturerExpanded.value ? 1 : "",
        ac: !isLecturerExpanded.value && needLecturerExpand.value
      }, !isLecturerExpanded.value && needLecturerExpand.value ? {
        ad: common_vendor.o(toggleLecturerExpand, "a7")
      } : {}, {
        ae: isLecturerExpanded.value
      }, isLecturerExpanded.value ? {
        af: common_vendor.o(toggleLecturerExpand, "f8")
      } : {}, {
        ag: currentTab.value === 0 ? 1 : "",
        ah: common_vendor.o(($event) => switchTab(0), "01"),
        ai: currentTab.value === 1 ? 1 : "",
        aj: common_vendor.o(($event) => switchTab(1), "d5"),
        ak: common_vendor.t(commentsData.value.length),
        al: currentTab.value === 2 ? 1 : "",
        am: common_vendor.o(($event) => switchTab(2), "c2"),
        an: common_vendor.t(totalCourseHours.value),
        ao: autoplay.value,
        ap: common_vendor.o(toggleAutoplay, "ff"),
        aq: common_vendor.f(flattenedAudios.value, (audio, index, i0) => {
          return common_vendor.e({
            a: !isAudioActive(audio)
          }, !isAudioActive(audio) ? {
            b: "42476c74-10-" + i0,
            c: common_vendor.p({
              type: "sound",
              size: "16",
              color: "#999"
            })
          } : {}, {
            d: common_vendor.t(audio.original_name || audio.title),
            e: common_vendor.t(audio.duration || "--:--"),
            f: index,
            g: isAudioActive(audio) ? 1 : "",
            h: common_vendor.o(($event) => playAudio(audio), index)
          });
        }),
        ar: currentTab.value === 0,
        as: formattedContent.value
      }, formattedContent.value ? {
        at: formattedContent.value
      } : {}, {
        av: currentTab.value === 1,
        aw: isLogin.value
      }, isLogin.value ? {
        ax: commentText.value,
        ay: common_vendor.o(($event) => commentText.value = $event.detail.value, "bb"),
        az: common_vendor.t(commentText.value.length),
        aA: common_vendor.o(submitComment, "be"),
        aB: !commentText.value.trim() || isSubmitting.value
      } : {
        aC: common_vendor.o(navigateToLogin, "5c")
      }, {
        aD: displayedComments.value.length > 0
      }, displayedComments.value.length > 0 ? common_vendor.e({
        aE: common_vendor.f(displayedComments.value, (comment, index, i0) => {
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
            i: "42476c74-11-" + i0,
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
        aF: hasMoreComments.value
      }, hasMoreComments.value ? common_vendor.e({
        aG: commentsLoading.value
      }, commentsLoading.value ? {} : {
        aH: common_vendor.t(displayedComments.value.length),
        aI: common_vendor.t(commentsData.value.length)
      }, {
        aJ: common_vendor.o(loadMoreComments, "e8")
      }) : {}) : {}, {
        aK: currentTab.value === 2,
        aL: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        aM: common_vendor.f(relatedData.value, (item, index, i0) => {
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
        aN: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        aO: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        aP: common_vendor.o(closePaymentModal, "dc"),
        aQ: common_vendor.t(courseData.name),
        aR: common_vendor.t(courseData.price),
        aS: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        aT: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        aU: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aV: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        aW: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        aX: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        aY: common_vendor.o(clearCoupon, "20")
      } : {}, {
        aZ: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        ba: common_vendor.o(toggleCouponList, "27"),
        bb: common_vendor.f(paymentState.availableCoupons, (userCoupon, k0, i0) => {
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
            g: "42476c74-14-" + i0,
            h: common_vendor.p({
              type: "checkmarkempty",
              size: "16",
              color: "#fff"
            })
          } : {}, {
            i: userCoupon.user_coupon_id,
            j: ((_c = paymentState.selectedCoupon) == null ? void 0 : _c.user_coupon_id) === userCoupon.user_coupon_id ? 1 : "",
            k: !isCouponAvailable(userCoupon) ? 1 : "",
            l: common_vendor.o(($event) => selectCoupon(userCoupon), userCoupon.user_coupon_id)
          });
        }),
        bc: paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon
      }, paymentState.availableCoupons.length === 0 && !paymentState.loading.coupon ? {} : {}, {
        bd: paymentState.showCouponList,
        be: balanceIcon,
        bf: isBalanceInsufficient.value
      }, isBalanceInsufficient.value ? {} : {
        bg: common_vendor.t(userBalance.value.toFixed(2))
      }, {
        bh: paymentState.paymentMethod === "balance" ? 1 : "",
        bi: paymentState.paymentMethod === "balance" ? 1 : "",
        bj: isBalanceInsufficient.value ? 1 : "",
        bk: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "c2"),
        bl: wechatIcon,
        bm: paymentState.paymentMethod === "wechat" ? 1 : "",
        bn: paymentState.paymentMethod === "wechat" ? 1 : "",
        bo: common_vendor.o(($event) => selectPaymentMethod("wechat"), "64"),
        bp: common_vendor.t(courseData.price),
        bq: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        br: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        bs: common_vendor.t(finalAmount.value),
        bt: common_vendor.t(payButtonText.value),
        bv: common_vendor.o(confirmPay, "59"),
        bw: payDisabled.value,
        bx: paymentState.loading.submit,
        by: common_vendor.o(() => {
        }, "01"),
        bz: common_vendor.o(handlePaymentMaskClick, "f1")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-42476c74"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/audiocourse.js.map
