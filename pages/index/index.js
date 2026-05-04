"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_swiper_dot2 = common_vendor.resolveComponent("uni-swiper-dot");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  (_easycom_uni_search_bar2 + _easycom_uni_swiper_dot2 + _easycom_uni_icons2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_swiper_dot = () => "../../uni_modules/uni-swiper-dot/components/uni-swiper-dot/uni-swiper-dot.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_swiper_dot + _easycom_uni_icons)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const searchValue = common_vendor.ref("");
    const handleSearch = (res) => {
      const keyword = res.value || searchValue.value;
      if (keyword && keyword.trim()) {
        const trimmedKeyword = keyword.trim();
        common_vendor.index.switchTab({
          url: "/pages/resource/resource",
          success: () => {
            common_vendor.index.$emit("searchFromHome", trimmedKeyword);
          },
          fail: (err) => {
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
      }
    };
    const swiperList = common_vendor.ref([]);
    const current = common_vendor.ref(0);
    const mode = common_vendor.ref("default");
    common_vendor.ref(false);
    const getMiniCarousel = async () => {
      try {
        const formData = {
          UXMID: common_vendor.index.getStorageSync("shopId")
        };
        const response = await api_index.fetchGetMiniCarousel(formData);
        if (response && response.status === "success" && response.data) {
          const carouselData = response.data.weapp_carousel_images || [];
          swiperList.value = carouselData.map((item) => ({
            image: item.imageUrl,
            linkUrl: item.linkUrl
          }));
        } else {
          swiperList.value = [];
        }
      } catch (error) {
        swiperList.value = [];
        common_vendor.index.showToast({
          title: "轮播图加载失败",
          icon: "none"
        });
      }
    };
    const hotList = common_vendor.ref([]);
    const hotLoading = common_vendor.ref(false);
    const getVideoCourseList = async () => {
      if (hotLoading.value)
        return;
      hotLoading.value = true;
      try {
        const formData = {
          UXMID: common_vendor.index.getStorageSync("shopId"),
          currentPage: 1,
          pageSize: 10,
          type: "videocourse",
          coursesort: 3
        };
        const response = await api_index.fetchVideoCourseListToSubPage(formData);
        if (response && response.status === "success" && response.data) {
          const courseData = response.data || [];
          hotList.value = courseData.map((item) => ({
            id: item.course_id,
            name: item.name,
            price: item.price || 0,
            image: item.cover || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
            mainType: mapCourseType(item.type),
            typeName: item.type === "视频课程" ? "视频课程" : item.type || "课程",
            isFeatured: item.winnowstatus || false,
            description: item.description || "",
            lecturerName: item.lecturerName || "",
            viewCount: item.view_count || 0,
            categoryLabels: item.categoryLabels || [],
            sales_mode: item.sales_mode,
            course_id: item.course_id
          }));
        } else {
          hotList.value = [];
        }
      } catch (error) {
        hotList.value = [];
      } finally {
        hotLoading.value = false;
      }
    };
    const featuredList = common_vendor.ref([]);
    const featuredLoading = common_vendor.ref(false);
    const getFeaturedCourseList = async () => {
      if (featuredLoading.value)
        return;
      featuredLoading.value = true;
      try {
        const formData = {
          UXMID: common_vendor.index.getStorageSync("shopId"),
          currentPage: 1,
          pageSize: 10,
          winnow: 1,
          coursesort: 1
        };
        const response = await api_index.fetchWinnowCourseListToSubPage(formData);
        if (response && response.status === "success" && response.data) {
          const courseData = response.data || [];
          featuredList.value = courseData.map((item) => ({
            id: item.course_id,
            name: item.name,
            price: item.price || 0,
            image: item.cover || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
            mainType: mapCourseType(item.type),
            typeName: item.type === "专题课程" ? "专题课程" : item.type || "课程",
            isFeatured: item.winnowstatus || true,
            description: item.description || "",
            lecturerName: item.lecturerName || "",
            viewCount: item.view_count || 0,
            categoryLabels: item.categoryLabels || [],
            sales_mode: item.sales_mode,
            course_id: item.course_id
          }));
        } else {
          featuredList.value = [];
        }
      } catch (error) {
        featuredList.value = [];
      } finally {
        featuredLoading.value = false;
      }
    };
    const recommendList = common_vendor.ref([]);
    const recommendLoading = common_vendor.ref(false);
    const getRecommendCourseList = async () => {
      if (recommendLoading.value)
        return;
      recommendLoading.value = true;
      try {
        const formData = {
          UXMID: common_vendor.index.getStorageSync("shopId"),
          currentPage: 1,
          pageSize: 10,
          type: "videocourse",
          coursesort: 5
        };
        const response = await api_index.fetchVideoCourseListToSubPage(formData);
        if (response && response.status === "success" && response.data) {
          const courseData = response.data || [];
          recommendList.value = courseData.map((item) => ({
            id: item.course_id,
            name: item.name,
            price: item.price || 0,
            image: item.cover || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
            mainType: mapCourseType(item.type),
            typeName: item.type === "视频课程" ? "视频课程" : item.type || "课程",
            isFeatured: item.winnowstatus || false,
            description: item.description || item.name || "暂无描述",
            lecturerName: item.lecturerName || "",
            viewCount: item.view_count || 0,
            salesCount: item.view_count || 0,
            categoryLabels: item.categoryLabels || [],
            sales_mode: item.sales_mode,
            course_id: item.course_id
          }));
        } else {
          recommendList.value = [];
        }
      } catch (error) {
        recommendList.value = [];
      } finally {
        recommendLoading.value = false;
      }
    };
    const mapCourseType = (type) => {
      const typeMap = {
        "视频课程": "course",
        "音频课程": "audio",
        "图文课程": "image",
        "专题课程": "special"
      };
      return typeMap[type] || "course";
    };
    const getPriceText = (item) => {
      const salesMode = item.sales_mode;
      if (salesMode == 1) {
        return "免费";
      } else if (salesMode == 2) {
        return "会员免费";
      } else {
        return `￥${item.price || 0}`;
      }
    };
    const handleSwiperClick = (item) => {
      if (item.linkUrl) {
        common_vendor.index.navigateTo({
          url: "/" + item.linkUrl,
          fail: () => {
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    };
    const navList = common_vendor.ref([
      {
        id: 1,
        title: "视频课程",
        icon: "videocam",
        path: "/components/course",
        type: "videocourse"
      },
      {
        id: 2,
        title: "音频课程",
        icon: "headphones",
        path: "/components/course",
        type: "audiocourse"
      },
      {
        id: 3,
        title: "图文课程",
        icon: "images",
        path: "/components/course",
        type: "imagecourse"
      },
      {
        id: 4,
        title: "专题课程",
        icon: "star",
        path: "/components/course",
        type: "specialcourse"
      },
      {
        id: 5,
        title: "专题课件",
        icon: "folder-add",
        path: "/components/courseware",
        type: "specialcourseware"
      },
      {
        id: 6,
        title: "精选试卷",
        icon: "paperclip",
        path: "/components/exampaper",
        type: "featured"
      },
      {
        id: 7,
        title: "刷题考试",
        icon: "compose",
        path: "/pages/practice/practice",
        type: "practice"
      },
      {
        id: 8,
        title: "限时优惠",
        icon: "notification",
        path: "/pages/coupon/coupon",
        type: "coupon"
      }
    ]);
    const newsList = common_vendor.ref([]);
    const newsLoading = common_vendor.ref(false);
    const showNewsModal = common_vendor.ref(false);
    const currentNews = common_vendor.ref({});
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatShortTime = (timeStr) => {
      if (!timeStr)
        return "刚刚";
      const date = parseDate(timeStr);
      if (isNaN(date.getTime()))
        return "刚刚";
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (minutes < 1)
        return "刚刚";
      if (minutes < 60)
        return `${minutes}分钟前`;
      if (hours < 24)
        return `${hours}小时前`;
      if (days < 7)
        return `${days}天前`;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}-${day}`;
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
    const processHtmlContent = (content) => {
      if (!content)
        return "";
      let processedContent = content;
      if (processedContent.startsWith('"') && processedContent.endsWith('"')) {
        processedContent = processedContent.slice(1, -1);
      }
      processedContent = processedContent.replace(/\\n/g, "").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      processedContent = processedContent.replace(/&ldquo;/g, '"').replace(/&rdquo;/g, '"').replace(/&mdash;/g, "—").replace(/&nbsp;/g, " ");
      return processedContent;
    };
    const getArticleData = async () => {
      if (newsLoading.value)
        return;
      newsLoading.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const response = await api_index.getArticle(shopId, 1, 10);
        if (response && response.status === "success" && response.data) {
          const articleData = response.data || [];
          newsList.value = articleData.map((item) => ({
            id: item.id,
            title: item.article_title || "新闻标题",
            cover: item.cover || "",
            source: item.article_type || "新闻资讯",
            time: formatShortTime(item.created_at),
            fullTime: formatFullTime(item.created_at),
            content: processHtmlContent(item.content),
            summary: item.summary || "",
            views: item.views || 0,
            isFeatured: item.is_featured === 1,
            tags: item.tags ? JSON.parse(item.tags) : []
          }));
          if (newsList.value.length === 0) {
            newsList.value = [{
              id: 0,
              title: "暂无新闻公告",
              source: "系统",
              time: "刚刚",
              fullTime: formatFullTime(/* @__PURE__ */ new Date()),
              content: "<p>暂无新闻内容</p>"
            }];
          }
        }
      } catch (error) {
        newsList.value = [{
          id: 0,
          title: "暂无新闻公告",
          source: "系统",
          time: "刚刚",
          fullTime: formatFullTime(/* @__PURE__ */ new Date()),
          content: "<p>暂无新闻内容</p>"
        }];
      } finally {
        newsLoading.value = false;
      }
    };
    const handleNewsItemClick = (item) => {
      currentNews.value = item;
      showNewsModal.value = true;
    };
    const handleNewsMore = () => {
      common_vendor.index.navigateTo({
        url: "/pages/news/news",
        fail: () => {
          common_vendor.index.showToast({
            title: "新闻列表开发中",
            icon: "none"
          });
        }
      });
    };
    const closeNewsModal = () => {
      showNewsModal.value = false;
    };
    const handleShareNews = () => {
      common_vendor.index.showToast({
        title: "请点击右上角菜单分享",
        icon: "none",
        duration: 2e3
      });
    };
    common_vendor.ref(0);
    const old = common_vendor.reactive({
      scrollTop: 0
    });
    const change = (e) => {
      current.value = e.detail.current;
    };
    const handleNavClick = (item) => {
      common_vendor.index.navigateTo({
        url: `${item.path}?type=${item.type}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToVideoCourse = (item) => {
      if (!item.course_id) {
        common_vendor.index.showToast({
          title: "课程信息错误",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/course/videocourse?id=${item.course_id}`,
        fail: (err) => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const navigateToSpecialCourse = (item) => {
      if (!item.course_id) {
        common_vendor.index.showToast({
          title: "课程信息错误",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/course/specialcourse?id=${item.course_id}`,
        fail: (err) => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleMore = () => {
      common_vendor.index.navigateTo({
        url: `/components/course?type=videocourse&currentSort=3`,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleHotClick = (item) => {
      navigateToVideoCourse(item);
    };
    const handleFeaturedMore = () => {
      common_vendor.index.navigateTo({
        url: `/components/course?type=specialcourse`,
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleFeaturedClick = (item) => {
      if (item.typeName === "专题课程" || item.mainType === "special") {
        navigateToSpecialCourse(item);
      } else {
        navigateToVideoCourse(item);
      }
    };
    const handleRecommendMore = () => {
      common_vendor.index.navigateTo({
        url: `/components/course?type=recommend`,
        fail: () => {
          common_vendor.index.showToast({
            title: "查看更多推荐课程",
            icon: "none"
          });
        }
      });
    };
    const handleRecommendClick = (item) => {
      navigateToVideoCourse(item);
    };
    const getTypeClass = (type) => {
      const map = {
        course: "type-course",
        courseware: "type-courseware",
        exam: "type-exam",
        audio: "type-course",
        image: "type-course",
        special: "type-course"
      };
      return map[type] || "type-default";
    };
    const onPageScroll = (e) => {
      old.scrollTop = e.detail.scrollTop;
    };
    common_vendor.onMounted(() => {
      getMiniCarousel();
      getArticleData();
      getVideoCourseList();
      getFeaturedCourseList();
      getRecommendCourseList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch, "a5"),
        b: common_vendor.o(() => {
        }, "ac"),
        c: common_vendor.o(($event) => searchValue.value = $event, "b2"),
        d: common_vendor.p({
          placeholder: "请输入搜索内容",
          radius: 50,
          clearButton: "auto",
          cancelButton: "none",
          modelValue: searchValue.value
        }),
        e: swiperList.value.length > 0
      }, swiperList.value.length > 0 ? {
        f: common_vendor.f(swiperList.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.o(($event) => handleSwiperClick(item), index),
            c: index
          };
        }),
        g: common_vendor.o(change, "3c"),
        h: common_vendor.p({
          info: swiperList.value,
          current: current.value,
          field: "content",
          mode: mode.value
        })
      } : {}, {
        i: common_vendor.f(navList.value, (item, index, i0) => {
          return {
            a: "1cf27b2a-2-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "32",
              color: "#ffffff"
            }),
            c: common_vendor.n("icon-bg-" + index % 8),
            d: common_vendor.t(item.title),
            e: index,
            f: common_vendor.o(($event) => handleNavClick(item), index)
          };
        }),
        j: common_vendor.p({
          type: "sound",
          size: "24",
          color: "#ff6b3d"
        }),
        k: newsList.value.length > 0
      }, newsList.value.length > 0 ? {
        l: common_vendor.f(newsList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.o(($event) => handleNewsItemClick(item), index),
            c: index
          };
        })
      } : {
        m: common_vendor.t(newsLoading.value ? "加载中..." : "暂无新闻")
      }, {
        n: common_vendor.p({
          type: "right",
          size: "18",
          color: "#cccccc"
        }),
        o: common_vendor.o(handleNewsMore, "59"),
        p: common_assets._imports_0,
        q: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999999"
        }),
        r: common_vendor.o(handleMore, "3d"),
        s: hotList.value.length > 0
      }, hotList.value.length > 0 ? {
        t: common_vendor.f(hotList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.image,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(getPriceText(item)),
            g: index,
            h: common_vendor.o(($event) => handleHotClick(item), index)
          });
        })
      } : {
        v: common_vendor.p({
          type: "videocam",
          size: "48",
          color: "#cbd5e1"
        })
      }, {
        w: common_assets._imports_1,
        x: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999999"
        }),
        y: common_vendor.o(handleFeaturedMore, "25"),
        z: featuredList.value.length > 0
      }, featuredList.value.length > 0 ? {
        A: common_vendor.f(featuredList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.image,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(getPriceText(item)),
            g: index,
            h: common_vendor.o(($event) => handleFeaturedClick(item), index)
          });
        })
      } : {
        B: common_vendor.p({
          type: "star",
          size: "48",
          color: "#cbd5e1"
        })
      }, {
        C: common_assets._imports_2,
        D: common_vendor.p({
          type: "right",
          size: "14",
          color: "#999999"
        }),
        E: common_vendor.o(handleRecommendMore, "0d"),
        F: recommendList.value.length > 0
      }, recommendList.value.length > 0 ? {
        G: common_vendor.f(recommendList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.image,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(item.description),
            g: common_vendor.t(getPriceText(item)),
            h: common_vendor.t(item.viewCount),
            i: index,
            j: common_vendor.o(($event) => handleRecommendClick(item), index)
          });
        })
      } : {
        H: common_vendor.p({
          type: "heart",
          size: "56",
          color: "#cbd5e1"
        })
      }, {
        I: common_vendor.o(onPageScroll, "2d"),
        J: showNewsModal.value
      }, showNewsModal.value ? common_vendor.e({
        K: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#8599b0"
        }),
        L: common_vendor.o(closeNewsModal, "2f"),
        M: common_vendor.t(currentNews.value.title),
        N: common_vendor.p({
          type: "person",
          size: "14",
          color: "#8599b0"
        }),
        O: common_vendor.t(currentNews.value.source),
        P: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "#8599b0"
        }),
        Q: common_vendor.t(currentNews.value.fullTime),
        R: currentNews.value.cover
      }, currentNews.value.cover ? {
        S: currentNews.value.cover
      } : {}, {
        T: currentNews.value.content,
        U: common_vendor.p({
          type: "redo",
          size: "20",
          color: "#3b82f6"
        }),
        V: common_vendor.o(handleShareNews, "fa"),
        W: common_vendor.o(() => {
        }, "55"),
        X: common_vendor.o(closeNewsModal, "08")
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
