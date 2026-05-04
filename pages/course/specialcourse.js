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
  __name: "specialcourse",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const courseId = common_vendor.ref("");
    const orderId = common_vendor.ref("");
    const pageLoading = common_vendor.ref(true);
    const currentMediaType = common_vendor.ref("videos");
    const availableMediaTypes = common_vendor.ref([]);
    let videoContext = null;
    const isVideoPlaying = common_vendor.ref(false);
    const currentVideoSrc = common_vendor.ref("");
    const currentVideoIndex = common_vendor.ref({
      index: 0,
      subindex: 0,
      isChild: false,
      parentIndex: null
    });
    let innerAudioContext = null;
    const isAudioPlaying = common_vendor.ref(false);
    const audioCurrentTime = common_vendor.ref(0);
    const audioDuration = common_vendor.ref(0);
    const audioProgress = common_vendor.ref(0);
    const currentAudioSrc = common_vendor.ref("");
    const currentAudioTitle = common_vendor.ref("");
    const currentAudioIndex = common_vendor.ref({
      index: 0,
      subindex: 0,
      isChild: false,
      parentIndex: null
    });
    const needTitleScroll = common_vendor.ref(false);
    const imageList = common_vendor.ref([]);
    const currentImageIndex = common_vendor.ref(0);
    const showThumbnails = common_vendor.ref(true);
    const autoplay = common_vendor.ref(true);
    const nextMediaState = common_vendor.ref({});
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
    const linkedCourses = common_vendor.ref({});
    const linkedCourseWares = common_vendor.ref([]);
    const linkedExampapers = common_vendor.ref([]);
    const flattenedCurrentMedia = common_vendor.ref([]);
    const isDescExpanded = common_vendor.ref(false);
    const isLecturerExpanded = common_vendor.ref(false);
    const isFavorited = common_vendor.ref(false);
    const isFollowing = common_vendor.ref(false);
    const isLecturerFollowed = common_vendor.ref(false);
    const currentTab = common_vendor.ref(0);
    const commentText = common_vendor.ref("");
    const needDescExpand = common_vendor.ref(false);
    const needLecturerExpand = common_vendor.ref(false);
    const favoriteData = common_vendor.ref({});
    const followData = common_vendor.ref({});
    const browseData = common_vendor.ref(null);
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
    common_vendor.watch(
      () => currentAudioTitle.value || courseData.name,
      (newTitle) => {
        needTitleScroll.value = newTitle && newTitle.length > 10;
      },
      {
        immediate: true
      }
    );
    const hasVideoContent = common_vendor.ref(false);
    const hasAudioContent = common_vendor.ref(false);
    const hasImageContent = common_vendor.ref(false);
    const isFullScreen = common_vendor.ref(false);
    common_vendor.computed(() => true);
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
      if (currentMediaType.value === "imagetexts") {
        return currentImageIndex.value > 0 && !canAccess();
      }
      return false;
    });
    const totalCourseHours = common_vendor.computed(() => flattenedCurrentMedia.value.length);
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
      return content.replace(/^"|"$/g, "").replace(/\\"/g, '"').replace(/\\n/g, "<br/>").replace(
        /\\t/g,
        "&nbsp;"
      ).replace(/\\\\/g, "\\");
    });
    const statsIcon = common_vendor.computed(() => {
      switch (currentMediaType.value) {
        case "videos":
          return "videocam";
        case "mp3s":
          return "sound";
        case "imagetexts":
          return "eye";
        default:
          return "videocam";
      }
    });
    const statsUnit = common_vendor.computed(() => {
      switch (currentMediaType.value) {
        case "videos":
          return "次播放";
        case "mp3s":
          return "次播放";
        case "imagetexts":
          return "次浏览";
        default:
          return "次播放";
      }
    });
    const chapterIcon = common_vendor.computed(() => {
      switch (currentMediaType.value) {
        case "videos":
          return "videocam";
        case "mp3s":
          return "sound";
        case "imagetexts":
          return "image";
        default:
          return "videocam";
      }
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
      if (paymentState.paymentMethod === "balance")
        return isBalanceInsufficient.value ? "余额不足" : `余额支付 ¥${finalAmount.value}`;
      return `微信支付 ¥${finalAmount.value}`;
    });
    const flattenAllMedia = (courseList, mediaKey) => {
      const result = [];
      const flatten = (courses, parentPath = []) => {
        if (!courses || !Array.isArray(courses))
          return;
        for (let i = 0; i < courses.length; i++) {
          const course = courses[i];
          const currentPath = [...parentPath, i];
          const items = course[mediaKey];
          if (items && Array.isArray(items) && items.length > 0) {
            for (let j = 0; j < items.length; j++) {
              const item = items[j];
              result.push({
                ...item,
                pathIndex: [...currentPath],
                itemIndex: j,
                isChild: parentPath.length > 0,
                parentIndex: parentPath.length > 0 ? parentPath[parentPath.length - 1] : null,
                original_name: item.name || item.title || `${mediaKey === "videos" ? "视频" : mediaKey === "mp3s" ? "音频" : "章节"}${j + 1}`,
                duration: item.duration || ""
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
    const findNextMedia = () => {
      const allMedia = flattenedCurrentMedia.value;
      if (allMedia.length === 0)
        return {};
      const currentIndex = currentMediaType.value === "videos" ? currentVideoIndex.value : currentMediaType.value === "mp3s" ? currentAudioIndex.value : {
        index: currentImageIndex.value,
        subindex: 0,
        isChild: false,
        parentIndex: null
      };
      const currentIdx = allMedia.findIndex((m) => {
        const idx = currentMediaType.value === "imagetexts" ? currentImageIndex.value : currentIndex.subindex;
        return m.itemIndex === idx && m.pathIndex[m.pathIndex.length - 1] === currentIndex.index && m.isChild === currentIndex.isChild && m.parentIndex === currentIndex.parentIndex;
      });
      if (currentIdx === -1 || currentIdx === allMedia.length - 1)
        return {};
      const next = allMedia[currentIdx + 1];
      return {
        index: next.pathIndex[next.pathIndex.length - 1],
        subindex: next.itemIndex,
        isChild: next.isChild,
        parentIndex: next.parentIndex
      };
    };
    const isMediaActive = (item) => {
      const current = currentMediaType.value === "videos" ? currentVideoIndex.value : currentMediaType.value === "mp3s" ? currentAudioIndex.value : {
        index: currentImageIndex.value,
        subindex: 0,
        isChild: false,
        parentIndex: null
      };
      return item.itemIndex === current.subindex && item.pathIndex[item.pathIndex.length - 1] === current.index && item.isChild === current.isChild && item.parentIndex === current.parentIndex;
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
        isAudioPlaying.value = true;
      });
      innerAudioContext.onPause(() => {
        isAudioPlaying.value = false;
      });
      innerAudioContext.onStop(() => {
        isAudioPlaying.value = false;
      });
      innerAudioContext.onEnded(() => {
        isAudioPlaying.value = false;
        if (autoplay.value)
          setTimeout(() => playNextMedia(), 1e3);
      });
      innerAudioContext.onTimeUpdate(() => {
        if (innerAudioContext) {
          audioCurrentTime.value = innerAudioContext.currentTime;
          if (innerAudioContext.duration) {
            audioDuration.value = innerAudioContext.duration;
            audioProgress.value = audioCurrentTime.value / audioDuration.value * 100;
          }
        }
      });
      innerAudioContext.onError(() => {
        isAudioPlaying.value = false;
        common_vendor.index.showToast({
          title: "音频播放失败",
          icon: "none"
        });
      });
    };
    const toggleAudioPlay = () => {
      if (!innerAudioContext)
        initAudioContext();
      if (!currentAudioSrc.value) {
        common_vendor.index.showToast({
          title: "暂无音频资源",
          icon: "none"
        });
        return;
      }
      if (isAudioPlaying.value) {
        innerAudioContext.pause();
      } else {
        if (innerAudioContext.src !== currentAudioSrc.value) {
          innerAudioContext.src = currentAudioSrc.value;
        }
        innerAudioContext.play();
      }
    };
    const seekAudioTo = (event) => {
      if (!innerAudioContext || !audioDuration.value)
        return;
      const query = common_vendor.index.createSelectorQuery();
      query.select(".mini-progress-bar").boundingClientRect((rect) => {
        if (rect && event.detail && event.detail.x) {
          const ratio = Math.max(0, Math.min(1, (event.detail.x - rect.left) / rect.width));
          const seekTime = ratio * audioDuration.value;
          innerAudioContext.seek(seekTime);
        }
      }).exec();
    };
    const setMediaSource = (item, mediaType) => {
      if (!item)
        return;
      if (mediaType === "videos") {
        currentVideoIndex.value = {
          index: item.pathIndex ? item.pathIndex[item.pathIndex.length - 1] : 0,
          subindex: item.itemIndex || 0,
          isChild: item.isChild || false,
          parentIndex: item.parentIndex || null
        };
        currentVideoSrc.value = item.path || "";
        isVideoPlaying.value = false;
        videoContext = common_vendor.index.createVideoContext("courseVideo");
      } else if (mediaType === "mp3s") {
        currentAudioIndex.value = {
          index: item.pathIndex ? item.pathIndex[item.pathIndex.length - 1] : 0,
          subindex: item.itemIndex || 0,
          isChild: item.isChild || false,
          parentIndex: item.parentIndex || null
        };
        currentAudioTitle.value = item.original_name || item.title || "";
        currentAudioSrc.value = item.path || "";
        audioCurrentTime.value = 0;
        audioProgress.value = 0;
        isAudioPlaying.value = false;
        if (innerAudioContext) {
          innerAudioContext.stop();
          innerAudioContext.src = currentAudioSrc.value;
        }
      } else if (mediaType === "imagetexts") {
        currentImageIndex.value = flattenedCurrentMedia.value.indexOf(item);
        buildImageList();
      }
      nextMediaState.value = findNextMedia();
    };
    const playMedia = (item) => {
      const mediaType = currentMediaType.value;
      const idx = flattenedCurrentMedia.value.indexOf(item);
      if (idx > 0 && !canAccess()) {
        common_vendor.index.showToast({
          title: purchasePromptText.value,
          icon: "none",
          duration: 2e3
        });
        return;
      }
      setMediaSource(item, mediaType);
      if (mediaType === "videos") {
        common_vendor.nextTick$1(() => {
          if (videoContext) {
            videoContext.play();
          }
        });
      } else if (mediaType === "mp3s") {
        common_vendor.nextTick$1(() => {
          if (!innerAudioContext)
            initAudioContext();
          innerAudioContext.play();
        });
      }
    };
    const playNextMedia = () => {
      if (!autoplay.value || currentMediaType.value === "imagetexts")
        return;
      const next = findNextMedia();
      if (Object.keys(next).length > 0) {
        const found = flattenedCurrentMedia.value.find(
          (m) => m.itemIndex === next.subindex && m.pathIndex[m.pathIndex.length - 1] === next.index && m.isChild === next.isChild && m.parentIndex === next.parentIndex
        );
        if (found) {
          if (!canAccess()) {
            common_vendor.index.showToast({
              title: purchasePromptText.value,
              icon: "none",
              duration: 2e3
            });
            return;
          }
          playMedia(found);
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
    const onVideoPlay = () => {
      isVideoPlaying.value = true;
    };
    const onVideoPause = () => {
      isVideoPlaying.value = false;
    };
    const onVideoEnded = () => {
      isVideoPlaying.value = false;
      if (autoplay.value)
        setTimeout(() => playNextMedia(), 1e3);
    };
    const onVideoTimeUpdate = (e) => {
    };
    const onVideoWaiting = () => {
    };
    const onVideoCanPlay = () => {
    };
    const onVideoLoadedMetadata = (e) => {
    };
    const onVideoError = () => {
      if (currentVideoSrc.value) {
        common_vendor.index.showToast({
          title: "视频加载失败",
          icon: "none"
        });
      }
    };
    const onFullScreenChange = (e) => {
      isFullScreen.value = e.detail.fullScreen;
    };
    const buildImageList = () => {
      const list = [];
      if (flattenedCurrentMedia.value.length > 0) {
        flattenedCurrentMedia.value.forEach((ch, i) => {
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
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: imageList.value.map((i) => i.url),
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
      if (index > 0 && !canAccess()) {
        common_vendor.index.showToast({
          title: "请先购买课程查看完整内容",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      currentImageIndex.value = index;
    };
    const switchMediaType = (type) => {
      if (currentMediaType.value === type)
        return;
      if (currentMediaType.value === "videos" && videoContext) {
        videoContext.pause();
      } else if (currentMediaType.value === "mp3s" && innerAudioContext) {
        innerAudioContext.pause();
      }
      currentMediaType.value = type;
      updateCurrentMediaList();
      buildImageList();
      if (flattenedCurrentMedia.value.length > 0) {
        setMediaSource(flattenedCurrentMedia.value[0], type);
        if (type === "imagetexts") {
          currentImageIndex.value = 0;
        }
      }
    };
    const updateCurrentMediaList = () => {
      const linkedData = linkedCourses.value;
      if (!linkedData) {
        flattenedCurrentMedia.value = [];
        return;
      }
      let courseList = [];
      let mediaKey = "";
      switch (currentMediaType.value) {
        case "videos":
          courseList = linkedData.videocourse || [];
          mediaKey = "videos";
          break;
        case "mp3s":
          courseList = linkedData.mp3course || [];
          mediaKey = "mp3s";
          break;
        case "imagetexts":
          courseList = linkedData.imagetextcourse || [];
          mediaKey = "imagetexts";
          break;
        default:
          courseList = linkedData.videocourse || [];
          mediaKey = "videos";
      }
      flattenedCurrentMedia.value = flattenAllMedia(courseList, mediaKey);
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
        const courseResponse = await api_index.getWinnowCourseList(formData);
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
          description: responseData.description || "",
          content: responseData.content || "",
          sales_mode: responseData.sales_mode || "1",
          price: responseData.price || 0,
          regionNames: responseData.regionNames || "",
          lecturer_id: responseData.lecturer_id || "[]",
          linked_courses: responseData.linked_courses,
          linked_coursewares: responseData.linked_coursewares,
          linked_exams: responseData.linked_exams,
          isFeatured: responseData.is_featured || false
        });
        if (responseData.linked_courses) {
          try {
            linkedCourses.value = typeof responseData.linked_courses === "string" ? JSON.parse(responseData.linked_courses) : responseData.linked_courses;
          } catch (e) {
            linkedCourses.value = {};
          }
        } else {
          linkedCourses.value = {};
        }
        const linked = linkedCourses.value;
        hasVideoContent.value = linked.videocourse && linked.videocourse.length > 0;
        hasAudioContent.value = linked.mp3course && linked.mp3course.length > 0;
        hasImageContent.value = linked.imagetextcourse && linked.imagetextcourse.length > 0;
        availableMediaTypes.value = [];
        if (hasVideoContent.value)
          availableMediaTypes.value.push("videos");
        if (hasAudioContent.value)
          availableMediaTypes.value.push("mp3s");
        if (hasImageContent.value)
          availableMediaTypes.value.push("imagetexts");
        if (availableMediaTypes.value.length > 0) {
          currentMediaType.value = availableMediaTypes.value[0];
        }
        updateCurrentMediaList();
        buildImageList();
        if (responseData.linked_coursewares) {
          try {
            linkedCourseWares.value = typeof responseData.linked_coursewares === "string" ? JSON.parse(responseData.linked_coursewares) : responseData.linked_coursewares;
          } catch (e) {
            linkedCourseWares.value = [];
          }
        }
        if (responseData.linked_exams) {
          try {
            linkedExampapers.value = typeof responseData.linked_exams === "string" ? JSON.parse(responseData.linked_exams) : responseData.linked_exams;
          } catch (e) {
            linkedExampapers.value = [];
          }
        }
        if (responseData.lecturer_id) {
          try {
            const lecturerIds = typeof responseData.lecturer_id === "string" ? JSON.parse(responseData.lecturer_id) : responseData.lecturer_id;
            if (lecturerIds && lecturerIds.length > 0 && lecturerIds[0].length > 0) {
              await fetchLecturerData(lecturerIds[0][0]);
            }
          } catch (e) {
          }
        }
        if (flattenedCurrentMedia.value.length > 0) {
          setMediaSource(flattenedCurrentMedia.value[0], currentMediaType.value);
        }
        if (isLogin.value) {
          try {
            await api_index.recordBrowseHistory({
              UXMID: shopId.value,
              user_id: userId.value,
              content_id: courseId.value,
              type: "winnowcourse"
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
          type: "winnowcourse"
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
          type: "winnowcourse"
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
          type: "winnowcourse"
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
        const response = await api_index.checkWinnowsCoursePurchaseStatus({
          UXMID: shopId.value,
          user_id: userId.value,
          product_id: courseId.value,
          product_type: "winnowcourse"
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
        const response = await api_index.getWinnowsCourseComments({
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
        const response = await api_index.getWinnowsRelatedRecommendations({
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
        const response = await api_index.submitWinnowsCourseComment({
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
        const response = await api_index.likeWinnowsCourseComment({
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
          title: "余额支付失败",
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
    const handleFavorite = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const response = await api_index.recordFavorite({
          UXMID: shopId.value,
          user_id: userId.value,
          content_id: courseId.value,
          type: "winnowcourse"
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
          type: "winnowcourse"
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
      if (courseData.sales_mode === "1") {
        common_vendor.index.showToast({
          title: "开始免费学习",
          icon: "success"
        });
      } else if (courseData.sales_mode === "2") {
        if (!isVipMember.value) {
          handleUpgradeVip();
        } else {
          common_vendor.index.showToast({
            title: "会员免费学习",
            icon: "success"
          });
        }
      } else {
        handleBuyNow();
      }
    };
    const handlePurchaseAction = () => {
      if (!checkLoginStatus())
        return;
      if (courseData.sales_mode === "2") {
        common_vendor.index.navigateTo({
          url: "/pages/benefits/benefits"
        });
      } else if (courseData.sales_mode === "3") {
        handleBuyNow();
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
          product_type: "winnowcourse",
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
        url: `/pages/course/specialcourse?id=${id}`,
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
    const checkTextOverflow = () => {
      needDescExpand.value = (courseData.description || "").length > 50;
      needLecturerExpand.value = (lecturerData.description || "").length > 50;
    };
    const cleanupResources = () => {
      videoContext = null;
      if (innerAudioContext) {
        innerAudioContext.destroy();
        innerAudioContext = null;
      }
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
        const loggedIn = checkLoginStatus();
        initAudioContext();
        await fetchCourseListData();
        await Promise.all([getRecommendations(), fetchCouponsList()]);
        if (loggedIn) {
          await Promise.all([checkPurchaseStatus(), fetchUserBalance()]);
        }
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
        d: currentMediaType.value === "videos"
      }, currentMediaType.value === "videos" ? common_vendor.e({
        e: currentVideoSrc.value
      }, currentVideoSrc.value ? {
        f: currentVideoSrc.value,
        g: courseData.cover,
        h: common_vendor.o(onVideoPlay, "b7"),
        i: common_vendor.o(onVideoPause, "df"),
        j: common_vendor.o(onVideoEnded, "97"),
        k: common_vendor.o(onVideoTimeUpdate, "a5"),
        l: common_vendor.o(onVideoWaiting, "58"),
        m: common_vendor.o(onVideoCanPlay, "95"),
        n: common_vendor.o(onVideoLoadedMetadata, "b4"),
        o: common_vendor.o(onVideoError, "2f"),
        p: common_vendor.o(onFullScreenChange, "c0")
      } : common_vendor.e({
        q: courseData.cover
      }, courseData.cover ? {
        r: courseData.cover
      } : {})) : {}, {
        s: currentMediaType.value === "mp3s"
      }, currentMediaType.value === "mp3s" ? common_vendor.e({
        t: courseData.cover
      }, courseData.cover ? {
        v: courseData.cover
      } : {}, {
        w: courseData.cover || lecturerData.photo_path || lecturerData.avatar,
        x: common_vendor.t(currentAudioTitle.value || courseData.name),
        y: needTitleScroll.value
      }, needTitleScroll.value ? {
        z: common_vendor.t(currentAudioTitle.value || courseData.name)
      } : {}, {
        A: needTitleScroll.value ? 1 : "",
        B: common_vendor.t(lecturerData.name),
        C: isAudioPlaying.value ? "/static/image/course/pause.png" : "/static/image/course/play.png",
        D: common_vendor.o(toggleAudioPlay, "28"),
        E: audioDuration.value > 0
      }, audioDuration.value > 0 ? {
        F: audioProgress.value + "%",
        G: common_vendor.o(seekAudioTo, "ff"),
        H: common_vendor.t(formatTime(audioCurrentTime.value)),
        I: common_vendor.t(formatTime(audioDuration.value))
      } : {}) : {}, {
        J: currentMediaType.value === "imagetexts"
      }, currentMediaType.value === "imagetexts" ? common_vendor.e({
        K: common_vendor.f(imageList.value, (image, index, i0) => {
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
        L: currentImageIndex.value,
        M: common_vendor.o(onSwiperChange, "ca"),
        N: courseData.isFeatured
      }, courseData.isFeatured ? {} : {}, {
        O: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        P: common_vendor.t(currentImageIndex.value + 1),
        Q: common_vendor.t(imageList.value.length)
      } : {}, {
        R: imageList.value.length > 1
      }, imageList.value.length > 1 ? {
        S: common_vendor.p({
          type: "left",
          size: "20",
          color: "#fff"
        }),
        T: common_vendor.o(prevImage, "04"),
        U: common_vendor.p({
          type: "right",
          size: "20",
          color: "#fff"
        }),
        V: common_vendor.o(nextImage, "36")
      } : {}, {
        W: imageList.value.length > 1 && showThumbnails.value
      }, imageList.value.length > 1 && showThumbnails.value ? {
        X: common_vendor.f(imageList.value, (image, index, i0) => {
          return common_vendor.e({
            a: image.url,
            b: index > 0 && !canAccess()
          }, index > 0 && !canAccess() ? {
            c: "1711c42f-6-" + i0,
            d: common_vendor.p({
              type: "image",
              size: "32",
              color: "#fff"
            })
          } : {}, {
            e: index,
            f: "thumb-" + index,
            g: currentImageIndex.value === index ? 1 : "",
            h: common_vendor.o(($event) => selectImage(index), index)
          });
        }),
        Y: "thumb-" + currentImageIndex.value
      } : {}, {
        Z: showPurchaseOverlay.value
      }, showPurchaseOverlay.value ? {
        aa: common_vendor.t(purchasePromptText.value),
        ab: common_vendor.t(purchaseButtonText.value),
        ac: common_vendor.o(handlePurchaseAction, "d4")
      } : {}) : {}, {
        ad: common_vendor.t(courseData.name),
        ae: common_vendor.t(priceTagText.value),
        af: common_vendor.n(priceTagClass.value),
        ag: common_vendor.p({
          type: statsIcon.value,
          size: "16",
          color: "#999"
        }),
        ah: common_vendor.t(formatNumber(courseData.view_count)),
        ai: common_vendor.t(statsUnit.value),
        aj: common_vendor.p({
          type: "list",
          size: "16",
          color: "#999"
        }),
        ak: common_vendor.t(totalCourseHours.value),
        al: common_vendor.p({
          type: "calendar",
          size: "16",
          color: "#999"
        }),
        am: common_vendor.t(formatDate(courseData.created_at)),
        an: common_vendor.p({
          type: isFavorited.value ? "star-filled" : "star",
          size: "22",
          color: isFavorited.value ? "#ffcc00" : "#666"
        }),
        ao: common_vendor.t(((_a = favoriteData.value) == null ? void 0 : _a.favorite_record_count) || 0),
        ap: common_vendor.o(handleFavorite, "0b"),
        aq: common_vendor.p({
          type: isFollowing.value ? "heart-filled" : "heart",
          size: "22",
          color: isFollowing.value ? "#fd676f" : "#666"
        }),
        ar: common_vendor.t(((_b = followData.value) == null ? void 0 : _b.follow_record_count) || 0),
        as: common_vendor.o(handleFollow, "36"),
        at: common_vendor.p({
          type: "redo",
          size: "22",
          color: "#666"
        }),
        av: common_vendor.o(handleShare, "a6"),
        aw: common_vendor.t(buttonText.value),
        ax: common_vendor.n(buttonClass.value),
        ay: common_vendor.o(handlePurchase, "1e"),
        az: pageLoading.value || hasPurchased.value || isVipMember.value || courseData.sales_mode === "1",
        aA: common_vendor.t(formattedDescription.value),
        aB: isDescExpanded.value ? 1 : "",
        aC: !isDescExpanded.value && needDescExpand.value
      }, !isDescExpanded.value && needDescExpand.value ? {
        aD: common_vendor.o(toggleDescExpand, "c9")
      } : {}, {
        aE: isDescExpanded.value
      }, isDescExpanded.value ? {
        aF: common_vendor.o(toggleDescExpand, "b4")
      } : {}, {
        aG: common_vendor.t(isLecturerFollowed.value ? "已关注" : "+ 关注"),
        aH: common_vendor.o(handleFollowLecturer, "22"),
        aI: lecturerData.photo_path || lecturerData.avatar,
        aJ: common_vendor.t(lecturerData.name),
        aK: common_vendor.o(goToLecturerDetail, "f4"),
        aL: common_vendor.t(formattedLecturerDesc.value),
        aM: isLecturerExpanded.value ? 1 : "",
        aN: !isLecturerExpanded.value && needLecturerExpand.value
      }, !isLecturerExpanded.value && needLecturerExpand.value ? {
        aO: common_vendor.o(toggleLecturerExpand, "5b")
      } : {}, {
        aP: isLecturerExpanded.value
      }, isLecturerExpanded.value ? {
        aQ: common_vendor.o(toggleLecturerExpand, "51")
      } : {}, {
        aR: currentTab.value === 0 ? 1 : "",
        aS: common_vendor.o(($event) => switchTab(0), "b8"),
        aT: currentTab.value === 1 ? 1 : "",
        aU: common_vendor.o(($event) => switchTab(1), "a7"),
        aV: common_vendor.t(commentsData.value.length),
        aW: currentTab.value === 2 ? 1 : "",
        aX: common_vendor.o(($event) => switchTab(2), "7e"),
        aY: hasVideoContent.value
      }, hasVideoContent.value ? {
        aZ: common_vendor.p({
          type: "videocam",
          size: "18",
          color: currentMediaType.value === "videos" ? "#2c62ef" : "#999"
        }),
        ba: currentMediaType.value === "videos" ? 1 : "",
        bb: common_vendor.o(($event) => switchMediaType("videos"), "e9")
      } : {}, {
        bc: hasAudioContent.value
      }, hasAudioContent.value ? {
        bd: common_vendor.p({
          type: "sound",
          size: "18",
          color: currentMediaType.value === "mp3s" ? "#2c62ef" : "#999"
        }),
        be: currentMediaType.value === "mp3s" ? 1 : "",
        bf: common_vendor.o(($event) => switchMediaType("mp3s"), "a8")
      } : {}, {
        bg: hasImageContent.value
      }, hasImageContent.value ? {
        bh: common_vendor.p({
          type: "image",
          size: "18",
          color: currentMediaType.value === "imagetexts" ? "#2c62ef" : "#999"
        }),
        bi: currentMediaType.value === "imagetexts" ? 1 : "",
        bj: common_vendor.o(($event) => switchMediaType("imagetexts"), "a8")
      } : {}, {
        bk: common_vendor.t(totalCourseHours.value),
        bl: currentMediaType.value !== "imagetexts"
      }, currentMediaType.value !== "imagetexts" ? {
        bm: autoplay.value,
        bn: common_vendor.o(toggleAutoplay, "c5")
      } : {}, {
        bo: common_vendor.f(flattenedCurrentMedia.value, (item, index, i0) => {
          return common_vendor.e({
            a: !isMediaActive(item)
          }, !isMediaActive(item) ? {
            b: "1711c42f-16-" + i0,
            c: common_vendor.p({
              type: chapterIcon.value,
              size: "16",
              color: "#999"
            })
          } : {}, {
            d: common_vendor.t(item.original_name || item.title || item.name),
            e: common_vendor.t(item.duration || ""),
            f: index,
            g: isMediaActive(item) ? 1 : "",
            h: common_vendor.o(($event) => playMedia(item), index)
          });
        }),
        bp: currentTab.value === 0,
        bq: formattedContent.value
      }, formattedContent.value ? {
        br: formattedContent.value
      } : {}, {
        bs: currentTab.value === 1,
        bt: isLogin.value
      }, isLogin.value ? {
        bv: commentText.value,
        bw: common_vendor.o(($event) => commentText.value = $event.detail.value, "19"),
        bx: common_vendor.t(commentText.value.length),
        by: common_vendor.o(submitComment, "86"),
        bz: !commentText.value.trim() || isSubmitting.value
      } : {
        bA: common_vendor.o(navigateToLogin, "d8")
      }, {
        bB: displayedComments.value.length > 0
      }, displayedComments.value.length > 0 ? common_vendor.e({
        bC: common_vendor.f(displayedComments.value, (comment, index, i0) => {
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
            i: "1711c42f-17-" + i0,
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
        bD: hasMoreComments.value
      }, hasMoreComments.value ? common_vendor.e({
        bE: commentsLoading.value
      }, commentsLoading.value ? {} : {
        bF: common_vendor.t(displayedComments.value.length),
        bG: common_vendor.t(commentsData.value.length)
      }, {
        bH: common_vendor.o(loadMoreComments, "9e")
      }) : {}) : {}, {
        bI: currentTab.value === 2,
        bJ: relatedData.value.length > 0
      }, relatedData.value.length > 0 ? {
        bK: common_vendor.f(relatedData.value, (item, index, i0) => {
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
        bL: showPaymentModal.value
      }, showPaymentModal.value ? common_vendor.e({
        bM: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        bN: common_vendor.o(closePaymentModal, "bb"),
        bO: common_vendor.t(courseData.name),
        bP: common_vendor.t(courseData.price),
        bQ: !paymentState.loading.coupon
      }, !paymentState.loading.coupon ? {
        bR: common_vendor.t(availableCouponsCount.value)
      } : {}, {
        bS: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        bT: common_vendor.t(paymentState.selectedCoupon.coupon_detail.name),
        bU: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        bV: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        bW: common_vendor.o(clearCoupon, "5a")
      } : {}, {
        bX: common_vendor.p({
          type: paymentState.showCouponList ? "up" : "down",
          size: "16",
          color: "#61666D"
        }),
        bY: common_vendor.o(toggleCouponList, "7a"),
        bZ: common_vendor.f(paymentState.availableCoupons, (uc, k0, i0) => {
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
            g: "1711c42f-20-" + i0,
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
        ca: paymentState.showCouponList,
        cb: balanceIcon,
        cc: common_vendor.t(isBalanceInsufficient.value ? "余额不足" : "可用: ¥" + userBalance.value.toFixed(2)),
        cd: common_vendor.s(isBalanceInsufficient.value ? "color:#ef4444" : ""),
        ce: paymentState.paymentMethod === "balance" ? 1 : "",
        cf: paymentState.paymentMethod === "balance" ? 1 : "",
        cg: isBalanceInsufficient.value ? 1 : "",
        ch: common_vendor.o(($event) => !isBalanceInsufficient.value && selectPaymentMethod("balance"), "fc"),
        ci: wechatIcon,
        cj: paymentState.paymentMethod === "wechat" ? 1 : "",
        ck: paymentState.paymentMethod === "wechat" ? 1 : "",
        cl: common_vendor.o(($event) => selectPaymentMethod("wechat"), "5f"),
        cm: common_vendor.t(courseData.price),
        cn: paymentState.selectedCoupon
      }, paymentState.selectedCoupon ? {
        co: common_vendor.t(paymentState.selectedCoupon.coupon_detail.discount_amount)
      } : {}, {
        cp: common_vendor.t(finalAmount.value),
        cq: common_vendor.t(payButtonText.value),
        cr: common_vendor.o(confirmPay, "48"),
        cs: payDisabled.value,
        ct: paymentState.loading.submit,
        cv: common_vendor.o(() => {
        }, "2f"),
        cw: common_vendor.o(handlePaymentMaskClick, "50")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1711c42f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/course/specialcourse.js.map
