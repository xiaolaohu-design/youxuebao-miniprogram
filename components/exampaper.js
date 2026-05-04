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
  __name: "exampaper",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    const search = (e) => {
      fetchFileListData(true);
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      fetchFileListData(true);
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
        name: "热门试卷",
        icon: "fire-filled",
        type: "normal",
        winnow: null,
        exampapersort: 3
      },
      {
        id: 1,
        name: "综合试卷",
        icon: "folder-add-filled",
        type: "normal",
        winnow: null,
        exampapersort: 1
      },
      {
        id: 2,
        name: "精选试卷",
        icon: "star-filled",
        type: "normal",
        winnow: 1,
        exampapersort: 1
      },
      {
        id: 3,
        name: "组卷试卷",
        icon: "vip-filled",
        type: "group",
        winnow: null,
        exampapersort: 1
      }
    ]);
    const switchCategory = (index) => {
      currentCategory.value = index;
      const config = categoryList.value[index];
      if (config) {
        currentSort.value = config.exampapersort;
        selectedWinnow.value = config.winnow;
      }
      selectedExampaperType.value = null;
      selectedDifficulty.value = null;
      selectedSalesMode.value = null;
      fetchFileListData(true);
    };
    const getCurrentCategoryConfig = () => {
      return categoryList.value[currentCategory.value] || categoryList.value[0];
    };
    const getCurrentExampaperType = () => {
      const config = getCurrentCategoryConfig();
      return config.type || "normal";
    };
    const currentSort = common_vendor.ref(1);
    const changeSort = (value) => {
      if (currentSort.value !== value) {
        currentSort.value = value;
        fetchFileListData(true);
      }
    };
    const filterPopup = common_vendor.ref(null);
    const tempExampaperType = common_vendor.ref(null);
    const tempDifficulty = common_vendor.ref(null);
    const tempWinnow = common_vendor.ref(null);
    const tempSalesMode = common_vendor.ref(null);
    const selectedExampaperType = common_vendor.ref(null);
    const selectedDifficulty = common_vendor.ref(null);
    const selectedWinnow = common_vendor.ref(null);
    const selectedSalesMode = common_vendor.ref(null);
    const exampaperTypeOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: 1,
        label: "课后练习"
      },
      {
        value: 2,
        label: "章节练习"
      },
      {
        value: 3,
        label: "日常习题"
      },
      {
        value: 4,
        label: "模拟考试"
      },
      {
        value: 5,
        label: "单元测试"
      },
      {
        value: 6,
        label: "月考测试"
      },
      {
        value: 7,
        label: "期中考试"
      },
      {
        value: 8,
        label: "期末考试"
      },
      {
        value: 9,
        label: "专项训练"
      },
      {
        value: 10,
        label: "小升初测试"
      },
      {
        value: 11,
        label: "中考测试"
      },
      {
        value: 12,
        label: "高考测试"
      },
      {
        value: 13,
        label: "历年真题"
      },
      {
        value: 14,
        label: "在线测验"
      },
      {
        value: 15,
        label: "互动问答"
      },
      {
        value: 16,
        label: "学习作业"
      },
      {
        value: 17,
        label: "小组讨论"
      },
      {
        value: 18,
        label: "案例分析"
      },
      {
        value: 19,
        label: "自我测试"
      }
    ];
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
    const showFilterPopup = () => {
      tempExampaperType.value = selectedExampaperType.value;
      tempDifficulty.value = selectedDifficulty.value;
      tempWinnow.value = selectedWinnow.value;
      tempSalesMode.value = selectedSalesMode.value;
      filterPopup.value.open();
    };
    const closeFilter = () => {
      filterPopup.value.close();
    };
    const resetTempFilter = () => {
      tempExampaperType.value = null;
      tempDifficulty.value = null;
      tempWinnow.value = null;
      tempSalesMode.value = null;
    };
    const applyFilter = () => {
      selectedExampaperType.value = tempExampaperType.value;
      selectedDifficulty.value = tempDifficulty.value;
      selectedWinnow.value = tempWinnow.value;
      selectedSalesMode.value = tempSalesMode.value;
      filterPopup.value.close();
      fetchFileListData(true);
    };
    const fileList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const currentPageSize = common_vendor.ref(20);
    const totalCount = common_vendor.ref(0);
    const exampaperTypeConfig = {
      normal: {
        label: "基础试卷",
        typeName: "基础试卷",
        fetchApi: api_index.getNormalExampaperList
      },
      group: {
        label: "组卷试卷",
        typeName: "组卷试卷",
        fetchApi: api_index.fetchGroupExampaperList
      }
    };
    let fetchLock = false;
    const fetchFileListData = async (reset = false) => {
      var _a;
      if (fetchLock)
        return;
      fetchLock = true;
      if (reset) {
        currentPageSize.value = 20;
        noMore.value = false;
        fileList.value = [];
      }
      loading.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const exampaperType = getCurrentExampaperType();
        const formData = {
          UXMID: shopId,
          currentPage: 1,
          pageSize: currentPageSize.value,
          type: selectedExampaperType.value,
          difficulty: selectedDifficulty.value,
          winnow: selectedWinnow.value,
          sales_mode: selectedSalesMode.value,
          exampapersort: currentSort.value,
          inputkeyword: ((_a = searchKeyword.value) == null ? void 0 : _a.trim()) || null
        };
        const typeConfig = exampaperTypeConfig[exampaperType] || exampaperTypeConfig.normal;
        const response = await typeConfig.fetchApi(formData);
        if (response && response.status === "success" && response.data) {
          const dataList = Array.isArray(response.data) ? response.data : response.data.list || [];
          if (response.data.total) {
            totalCount.value = response.data.total;
          } else if (response.total) {
            totalCount.value = response.total;
          }
          const formattedData = dataList.map((item) => ({
            id: item.paper_id || item.id,
            name: item.paper_title || item.name || item.title || "未命名试卷",
            description: item.description || item.desc || "",
            mainType: item.type || "other",
            typeName: item.type || "试卷",
            fileExt: item.type || "",
            fileSize: item.file_size || "",
            downloadCount: item.download_count || 0,
            viewCount: item.view_count || 0,
            price: item.price || 0,
            sales_mode: item.sales_mode || 0,
            isFeatured: item.winnowstatus || item.is_featured || false,
            createTime: item.created_at || ""
          }));
          fileList.value = formattedData;
          if (dataList.length < currentPageSize.value) {
            noMore.value = true;
          } else if (totalCount.value > 0) {
            noMore.value = fileList.value.length >= totalCount.value;
          } else {
            noMore.value = false;
          }
        } else {
          if (reset) {
            fileList.value = [];
          }
          noMore.value = true;
        }
      } catch (error) {
        if (reset) {
          fileList.value = [];
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
        fetchFileListData(false);
      }
    };
    const onRefresh = () => {
      refreshing.value = true;
      fetchFileListData(true);
    };
    const getFileIconPath = (item) => {
      const exampaperType = getCurrentExampaperType();
      if (exampaperType === "group") {
        return "/static/image/file/doc.png";
      }
      return "/static/image/file/file.png";
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
    const formatDownloadCount = (count) => {
      if (!count)
        return "0";
      if (count >= 1e4)
        return (count / 1e4).toFixed(1) + "w";
      if (count >= 1e3)
        return (count / 1e3).toFixed(1) + "k";
      return count.toString();
    };
    const goToDetail = (item) => {
      const exampaperType = getCurrentExampaperType();
      if (exampaperType === "group") {
        common_vendor.index.navigateTo({
          url: `/pages/exampaper/groupexampaper?id=${item.id}`,
          fail: () => {
            common_vendor.index.showToast({
              title: "详情页开发中",
              icon: "none"
            });
          }
        });
        return;
      }
      let url = "";
      if (item.isFeatured) {
        url = `/pages/exampaper/specialexampaper?id=${item.id}`;
      } else {
        url = `/pages/exampaper/exampaper?id=${item.id}`;
      }
      common_vendor.index.navigateTo({
        url,
        fail: () => {
          common_vendor.index.showToast({
            title: "详情页开发中",
            icon: "none"
          });
        }
      });
    };
    const typeMap = {
      "exampaper": "normal",
      "specialexampaper": "group",
      "normal": "normal",
      "group": "group",
      "hot": "hot",
      "comprehensive": "comprehensive",
      "featured": "featured",
      "special": "group"
    };
    const categoryNameMap = {
      "hot": "热门试卷",
      "comprehensive": "综合试卷",
      "featured": "精选试卷",
      "special": "专题试卷",
      "normal": "综合试卷",
      "group": "专题试卷"
    };
    common_vendor.onLoad((options) => {
      if (options && options.type) {
        const type = options.type;
        const mappedType = typeMap[type];
        if (mappedType) {
          let index = categoryList.value.findIndex((item) => item.name === categoryNameMap[mappedType]);
          if (index === -1) {
            index = categoryList.value.findIndex((item) => item.type === mappedType);
          }
          if (index !== -1) {
            currentCategory.value = index;
            const config = categoryList.value[index];
            if (config) {
              currentSort.value = config.exampapersort;
              selectedWinnow.value = config.winnow;
            }
          }
        }
      }
    });
    common_vendor.onMounted(() => {
      fetchFileListData(true);
    });
    common_vendor.onUnmounted(() => {
      fetchLock = false;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(search, "e7"),
        b: common_vendor.o(blur, "67"),
        c: common_vendor.o(focus, "93"),
        d: common_vendor.o(input, "e3"),
        e: common_vendor.o(clearSearch, "04"),
        f: common_vendor.o(search, "9b"),
        g: common_vendor.o(($event) => searchKeyword.value = $event, "60"),
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
            a: "4b6519de-1-" + i0,
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
        k: common_vendor.o(($event) => changeSort(1), "a6"),
        l: currentSort.value === 2 ? 1 : "",
        m: common_vendor.o(($event) => changeSort(2), "e2"),
        n: currentSort.value === 3 ? 1 : "",
        o: common_vendor.o(($event) => changeSort(3), "fd"),
        p: common_vendor.p({
          type: "settings",
          size: "18",
          color: "#2c62ef"
        }),
        q: common_vendor.o(showFilterPopup, "49"),
        r: common_vendor.f(fileList.value, (item, index, i0) => {
          return common_vendor.e({
            a: getFileIconPath(),
            b: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.description),
            e: common_vendor.t(getPriceText(item)),
            f: "4b6519de-3-" + i0,
            g: common_vendor.t(formatDownloadCount(item.downloadCount)),
            h: index,
            i: common_vendor.o(($event) => goToDetail(item), index)
          });
        }),
        s: common_vendor.p({
          type: "download",
          size: "14",
          color: "#bbb"
        }),
        t: loading.value
      }, loading.value ? {} : noMore.value && fileList.value.length > 0 ? {} : fileList.value.length === 0 && !loading.value ? {} : {}, {
        v: noMore.value && fileList.value.length > 0,
        w: fileList.value.length === 0 && !loading.value,
        x: common_vendor.o(loadMore, "2f"),
        y: refreshing.value,
        z: common_vendor.o(onRefresh, "28"),
        A: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999999"
        }),
        B: common_vendor.o(closeFilter, "45"),
        C: common_vendor.f(exampaperTypeOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempExampaperType.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempExampaperType.value = item.value, idx)
          };
        }),
        D: common_vendor.f(difficultyOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempDifficulty.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempDifficulty.value = item.value, idx)
          };
        }),
        E: common_vendor.f(winnowOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempWinnow.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempWinnow.value = item.value, idx)
          };
        }),
        F: common_vendor.f(salesModeOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempSalesMode.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempSalesMode.value = item.value, idx)
          };
        }),
        G: common_vendor.o(resetTempFilter, "99"),
        H: common_vendor.o(applyFilter, "df"),
        I: common_vendor.sr(filterPopup, "4b6519de-4", {
          "k": "filterPopup"
        }),
        J: common_vendor.p({
          type: "bottom",
          ["mask-click"]: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4b6519de"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/exampaper.js.map
