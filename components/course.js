"use strict";
const common_vendor = require("../common/vendor.js");
const api_index = require("../api/index.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_search_bar = () => "../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "course",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const search = (e) => {
      const keyword = e.value || searchKeyword.value;
      if (keyword && keyword.trim()) {
        fetchCourseListData(true);
      } else {
        fetchCourseListData(true);
      }
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      fetchCourseListData(true);
    };
    const input = (e) => {
      searchKeyword.value = e.value;
    };
    const blur = () => {
    };
    const focus = () => {
    };
    const currentCategory = common_vendor.ref(0);
    const categoryList = common_vendor.ref([
      {
        id: 0,
        name: "视频课程",
        icon: "videocam",
        type: "videocourse"
      },
      {
        id: 1,
        name: "音频课程",
        icon: "headphones",
        type: "audiocourse"
      },
      {
        id: 2,
        name: "图文课程",
        icon: "images",
        type: "imagecourse"
      },
      {
        id: 3,
        name: "专题课程",
        icon: "star",
        type: "specialcourse"
      }
    ]);
    const switchCategory = (index) => {
      currentCategory.value = index;
      fetchCourseListData(true);
    };
    const currentSort = common_vendor.ref(1);
    const changeSort = (value) => {
      if (currentSort.value !== value) {
        currentSort.value = value;
        fetchCourseListData(true);
      }
    };
    const layoutMode = common_vendor.ref("grid");
    const toggleLayout = () => {
      layoutMode.value = layoutMode.value === "grid" ? "list" : "grid";
    };
    const filterPopup = common_vendor.ref(null);
    const tempDifficulty = common_vendor.ref(null);
    const tempWinnow = common_vendor.ref(null);
    const tempSalesMode = common_vendor.ref(null);
    const tempCourseStatus = common_vendor.ref(null);
    const selectedDifficulty = common_vendor.ref(null);
    const selectedWinnow = common_vendor.ref(null);
    const selectedSalesMode = common_vendor.ref(null);
    const selectedCourseStatus = common_vendor.ref(null);
    const difficultyOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: 1,
        label: "简单"
      },
      {
        value: 2,
        label: "一般"
      },
      {
        value: 3,
        label: "中等"
      },
      {
        value: 4,
        label: "困难"
      },
      {
        value: 5,
        label: "挑战"
      },
      {
        value: 6,
        label: "极难"
      }
    ];
    const winnowOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: 1,
        label: "精选"
      },
      {
        value: 2,
        label: "非精选"
      }
    ];
    const salesModeOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: 1,
        label: "免费"
      },
      {
        value: 2,
        label: "VIP免费"
      },
      {
        value: 3,
        label: "付费购买"
      }
    ];
    const courseStatusOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: "1",
        label: "连载中"
      },
      {
        value: "2",
        label: "已完结"
      }
    ];
    const showFilterPopup = () => {
      tempDifficulty.value = selectedDifficulty.value;
      tempWinnow.value = selectedWinnow.value;
      tempSalesMode.value = selectedSalesMode.value;
      tempCourseStatus.value = selectedCourseStatus.value;
      filterPopup.value.open();
    };
    const closeFilter = () => {
      filterPopup.value.close();
    };
    const resetTempFilter = () => {
      tempDifficulty.value = null;
      tempWinnow.value = null;
      tempSalesMode.value = null;
      tempCourseStatus.value = null;
    };
    const applyFilter = () => {
      selectedDifficulty.value = tempDifficulty.value;
      selectedWinnow.value = tempWinnow.value;
      selectedSalesMode.value = tempSalesMode.value;
      selectedCourseStatus.value = tempCourseStatus.value;
      filterPopup.value.close();
      fetchCourseListData(true);
    };
    const courseList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const currentPageSize = common_vendor.ref(20);
    const totalCount = common_vendor.ref(0);
    const bannerList = common_vendor.ref([
      {
        title: "会员限时特惠",
        desc: "开通会员享全场课程低至2折",
        icon: "gift",
        gradient: "linear-gradient(135deg, #ff7b54 0%, #ff2d7b 100%)",
        path: "/pages/benefits/benefits"
      },
      {
        title: "VIP专属权益",
        desc: "免费畅学精品课程，解锁专属内容",
        icon: "fire",
        gradient: "linear-gradient(135deg, #00d4aa 0%, #0066cc 100%)",
        path: "/pages/benefits/benefits"
      },
      {
        title: "会员0元学",
        desc: "开通即享海量课程免费学习",
        icon: "vip",
        gradient: "linear-gradient(135deg, #b980f0 0%, #6a0dad 100%)",
        path: "/pages/benefits/benefits"
      }
    ]);
    const courseTypeConfig = {
      videocourse: {
        label: "视频课程",
        typeName: "视频课程",
        fetchApi: api_index.fetchVideoCourseListToSubPage
      },
      audiocourse: {
        label: "音频课程",
        typeName: "音频课程",
        fetchApi: api_index.fetchMP3CourseListToSubPage
      },
      imagecourse: {
        label: "图文课程",
        typeName: "图文课程",
        fetchApi: api_index.fetchImageTextCourseListToSubPage
      },
      specialcourse: {
        label: "专题课程",
        typeName: "专题课程",
        fetchApi: api_index.fetchWinnowCourseListToSubPage
      }
    };
    const getCurrentCourseType = () => {
      const category = categoryList.value[currentCategory.value];
      return (category == null ? void 0 : category.type) || "videocourse";
    };
    let fetchLock = false;
    const fetchCourseListData = async (reset = false) => {
      var _a;
      if (fetchLock)
        return;
      fetchLock = true;
      if (reset) {
        currentPageSize.value = 20;
        noMore.value = false;
        courseList.value = [];
      }
      loading.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const courseType = getCurrentCourseType();
        const formData = {
          UXMID: shopId,
          currentPage: 1,
          pageSize: currentPageSize.value,
          type: courseType,
          difficulty: selectedDifficulty.value,
          winnow: selectedWinnow.value,
          sales_mode: selectedSalesMode.value,
          coursestatus: selectedCourseStatus.value,
          coursesort: currentSort.value,
          inputkeyword: ((_a = searchKeyword.value) == null ? void 0 : _a.trim()) || null
        };
        const typeConfig = courseTypeConfig[courseType] || courseTypeConfig.videocourse;
        const response = await typeConfig.fetchApi(formData);
        if (response && response.status === "success" && response.data) {
          const dataList = Array.isArray(response.data) ? response.data : response.data.list || [];
          if (response.data.total) {
            totalCount.value = response.data.total;
          } else if (response.total) {
            totalCount.value = response.total;
          }
          const formattedData = dataList.map((item) => ({
            id: item.course_id || item.id,
            name: item.name || item.title || "未命名课程",
            description: item.description || item.desc || "",
            cover: item.cover || item.image || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
            image: item.cover || item.image || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
            price: item.price || 0,
            sales_mode: item.sales_mode || 0,
            viewCount: item.view_count || 0,
            salesCount: item.view_count || 0,
            mainType: courseType,
            typeName: typeConfig.typeName,
            isFeatured: item.winnowstatus || item.is_featured || false
          }));
          courseList.value = formattedData;
          if (dataList.length < currentPageSize.value) {
            noMore.value = true;
          } else if (totalCount.value > 0) {
            noMore.value = courseList.value.length >= totalCount.value;
          } else {
            noMore.value = false;
          }
        } else {
          if (reset) {
            courseList.value = [];
          }
          noMore.value = true;
        }
      } catch (error) {
        if (reset) {
          courseList.value = [];
        }
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        loading.value = false;
        refreshing.value = false;
        fetchLock = false;
      }
    };
    const loadMore = () => {
      if (!loading.value && !noMore.value) {
        currentPageSize.value += 20;
        fetchCourseListData(false);
      }
    };
    const onRefresh = () => {
      refreshing.value = true;
      fetchCourseListData(true);
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
    const getTypeClass = (type) => {
      const map = {
        videocourse: "type-course",
        audiocourse: "type-course",
        imagecourse: "type-course",
        specialcourse: "type-course",
        courseware: "type-courseware",
        exam: "type-exam"
      };
      return map[type] || "type-default";
    };
    const goToBanner = (banner) => {
      if (banner.path) {
        common_vendor.index.navigateTo({
          url: banner.path,
          fail: () => {
            common_vendor.index.switchTab({
              url: banner.path,
              fail: () => {
                common_vendor.index.showToast({
                  title: "页面跳转失败",
                  icon: "none"
                });
              }
            });
          }
        });
      } else {
        common_vendor.index.showToast({
          title: banner.title,
          icon: "none"
        });
      }
    };
    const goToDetail = (item) => {
      const courseType = getCurrentCourseType();
      const routeMap = {
        videocourse: "/pages/course/videocourse",
        audiocourse: "/pages/course/audiocourse",
        imagecourse: "/pages/course/imagecourse",
        specialcourse: "/pages/course/specialcourse"
      };
      const url = routeMap[courseType] || "/pages/course/videocourse";
      common_vendor.index.navigateTo({
        url: `${url}?id=${item.id}`,
        fail: () => {
          common_vendor.index.showToast({
            title: "详情页开发中",
            icon: "none"
          });
        }
      });
    };
    common_vendor.onLoad((options) => {
      if (options && options.type) {
        const type = options.type;
        const index = categoryList.value.findIndex((item) => item.type === type);
        if (index !== -1) {
          currentCategory.value = index;
        }
      }
      if (options && options.currentSort) {
        const sortValue = parseInt(options.currentSort);
        if (sortValue >= 1 && sortValue <= 3) {
          currentSort.value = sortValue;
        }
      }
    });
    common_vendor.onMounted(() => {
      fetchCourseListData(true);
    });
    common_vendor.onUnmounted(() => {
      fetchLock = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(search, "a3"),
        b: common_vendor.o(blur, "36"),
        c: common_vendor.o(focus, "7e"),
        d: common_vendor.o(input, "3e"),
        e: common_vendor.o(clearSearch, "04"),
        f: common_vendor.o(search, "24"),
        g: common_vendor.o(($event) => searchKeyword.value = $event, "77"),
        h: common_vendor.p({
          focus: false,
          placeholder: "请输入搜索内容",
          radius: 50,
          clearButton: "auto",
          cancelButton: "none",
          modelValue: searchKeyword.value
        }),
        i: common_vendor.f(categoryList.value, (item, index, i0) => {
          return {
            a: "c5b0547c-1-" + i0,
            b: common_vendor.p({
              type: item.icon,
              size: "32",
              color: "#ffffff"
            }),
            c: common_vendor.n("icon-bg-" + index % 12),
            d: common_vendor.t(item.name),
            e: index,
            f: currentCategory.value === index ? 1 : "",
            g: common_vendor.o(($event) => switchCategory(index), index)
          };
        }),
        j: currentSort.value === 1 ? 1 : "",
        k: common_vendor.o(($event) => changeSort(1), "0a"),
        l: currentSort.value === 2 ? 1 : "",
        m: common_vendor.o(($event) => changeSort(2), "04"),
        n: currentSort.value === 3 ? 1 : "",
        o: common_vendor.o(($event) => changeSort(3), "c1"),
        p: common_vendor.p({
          type: "settings",
          size: "18",
          color: "#2c62ef"
        }),
        q: common_vendor.o(showFilterPopup, "b7"),
        r: common_vendor.p({
          type: "bars",
          size: "18",
          color: "#2c62ef"
        }),
        s: common_vendor.o(toggleLayout, "b7"),
        t: !searchKeyword.value && courseList.value.length > 0
      }, !searchKeyword.value && courseList.value.length > 0 ? {
        v: common_vendor.f(bannerList.value, (banner, idx, i0) => {
          return {
            a: common_vendor.t(banner.title),
            b: common_vendor.t(banner.desc),
            c: "c5b0547c-4-" + i0,
            d: common_vendor.p({
              type: banner.icon,
              size: "56",
              color: "rgba(255,255,255,0.25)"
            }),
            e: banner.gradient,
            f: common_vendor.o(($event) => goToBanner(banner), idx),
            g: idx
          };
        })
      } : {}, {
        w: layoutMode.value === "grid"
      }, layoutMode.value === "grid" ? {
        x: common_vendor.f(courseList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.cover,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(getPriceText(item)),
            g: index,
            h: common_vendor.o(($event) => goToDetail(item), index)
          });
        })
      } : {
        y: common_vendor.f(courseList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.cover,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.name),
            f: common_vendor.t(item.description),
            g: common_vendor.t(getPriceText(item)),
            h: common_vendor.t(item.viewCount),
            i: index,
            j: common_vendor.o(($event) => goToDetail(item), index)
          });
        })
      }, {
        z: loading.value
      }, loading.value ? {} : noMore.value && courseList.value.length > 0 ? {} : courseList.value.length === 0 && !loading.value ? {} : {}, {
        A: noMore.value && courseList.value.length > 0,
        B: courseList.value.length === 0 && !loading.value,
        C: common_vendor.o(loadMore, "2f"),
        D: refreshing.value,
        E: common_vendor.o(onRefresh, "28"),
        F: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        G: common_vendor.o(closeFilter, "fe"),
        H: common_vendor.f(difficultyOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempDifficulty.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempDifficulty.value = item.value, idx)
          };
        }),
        I: common_vendor.f(winnowOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempWinnow.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempWinnow.value = item.value, idx)
          };
        }),
        J: common_vendor.f(salesModeOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempSalesMode.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempSalesMode.value = item.value, idx)
          };
        }),
        K: common_vendor.f(courseStatusOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempCourseStatus.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempCourseStatus.value = item.value, idx)
          };
        }),
        L: common_vendor.o(resetTempFilter, "1c"),
        M: common_vendor.o(applyFilter, "93"),
        N: common_vendor.sr(filterPopup, "c5b0547c-5", {
          "k": "filterPopup"
        }),
        O: common_vendor.p({
          type: "bottom",
          ["mask-click"]: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c5b0547c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/course.js.map
