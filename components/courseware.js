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
  __name: "courseware",
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
        name: "热门课件",
        icon: "fire-filled",
        type: "normal",
        winnow: null,
        coursewaresort: 3
      },
      {
        id: 1,
        name: "综合课件",
        icon: "folder-add-filled",
        type: "normal",
        winnow: null,
        coursewaresort: 1
      },
      {
        id: 2,
        name: "精选课件",
        icon: "star-filled",
        type: "normal",
        winnow: 1,
        coursewaresort: 1
      },
      {
        id: 3,
        name: "专题课件",
        icon: "vip-filled",
        type: "winnow",
        winnow: null,
        coursewaresort: 1
      }
    ]);
    const switchCategory = (index) => {
      currentCategory.value = index;
      const config = categoryList.value[index];
      if (config) {
        currentSort.value = config.coursewaresort;
        selectedWinnow.value = config.winnow;
      }
      selectedFileType.value = null;
      selectedDifficulty.value = null;
      selectedSalesMode.value = null;
      selectedCoursewareStatus.value = null;
      fetchFileListData(true);
    };
    const getCurrentCategoryConfig = () => {
      return categoryList.value[currentCategory.value] || categoryList.value[0];
    };
    const getCurrentCoursewareType = () => {
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
    const tempFileType = common_vendor.ref(null);
    const tempDifficulty = common_vendor.ref(null);
    const tempWinnow = common_vendor.ref(null);
    const tempSalesMode = common_vendor.ref(null);
    const tempCoursewareStatus = common_vendor.ref(null);
    const selectedFileType = common_vendor.ref(null);
    const selectedDifficulty = common_vendor.ref(null);
    const selectedWinnow = common_vendor.ref(null);
    const selectedSalesMode = common_vendor.ref(null);
    const selectedCoursewareStatus = common_vendor.ref(null);
    const fileTypeOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: "excel",
        label: "Excel课件"
      },
      {
        value: "word",
        label: "Word课件"
      },
      {
        value: "pdf",
        label: "PDF课件"
      },
      {
        value: "ppt",
        label: "PPT课件"
      },
      {
        value: "txt",
        label: "文本课件"
      },
      {
        value: "zip",
        label: "压缩课件"
      },
      {
        value: "other",
        label: "其他课件"
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
    const coursewareStatusOptions = [
      {
        value: null,
        label: "全部"
      },
      {
        value: "2",
        label: "已完结"
      },
      {
        value: "1",
        label: "连载中"
      }
    ];
    const showFilterPopup = () => {
      tempFileType.value = selectedFileType.value;
      tempDifficulty.value = selectedDifficulty.value;
      tempWinnow.value = selectedWinnow.value;
      tempSalesMode.value = selectedSalesMode.value;
      tempCoursewareStatus.value = selectedCoursewareStatus.value;
      filterPopup.value.open();
    };
    const closeFilter = () => {
      filterPopup.value.close();
    };
    const resetTempFilter = () => {
      tempFileType.value = null;
      tempDifficulty.value = null;
      tempWinnow.value = null;
      tempSalesMode.value = null;
      tempCoursewareStatus.value = null;
    };
    const applyFilter = () => {
      selectedFileType.value = tempFileType.value;
      selectedDifficulty.value = tempDifficulty.value;
      selectedWinnow.value = tempWinnow.value;
      selectedSalesMode.value = tempSalesMode.value;
      selectedCoursewareStatus.value = tempCoursewareStatus.value;
      filterPopup.value.close();
      fetchFileListData(true);
    };
    const fileList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const refreshing = common_vendor.ref(false);
    const noMore = common_vendor.ref(false);
    const currentPageSize = common_vendor.ref(20);
    const totalCount = common_vendor.ref(0);
    const coursewareTypeConfig = {
      normal: {
        label: "普通课件",
        typeName: "普通课件",
        fetchApi: api_index.fetchSubPageCourseWareList
      },
      winnow: {
        label: "专题课件",
        typeName: "专题课件",
        fetchApi: api_index.fetchSubPageSpecialCourseWareListData
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
        const categoryConfig = getCurrentCategoryConfig();
        const coursewareType = categoryConfig.type;
        const formData = {
          UXMID: shopId,
          currentPage: 1,
          pageSize: currentPageSize.value,
          type: selectedFileType.value,
          difficulty: selectedDifficulty.value,
          winnow: selectedWinnow.value,
          sales_mode: selectedSalesMode.value,
          coursewarestatus: selectedCoursewareStatus.value,
          coursewaresort: currentSort.value,
          inputkeyword: ((_a = searchKeyword.value) == null ? void 0 : _a.trim()) || null
        };
        const typeConfig = coursewareTypeConfig[coursewareType] || coursewareTypeConfig.normal;
        const response = await typeConfig.fetchApi(formData);
        if (response && response.status === "success" && response.data) {
          const dataList = Array.isArray(response.data) ? response.data : response.data.list || [];
          if (response.data.total) {
            totalCount.value = response.data.total;
          } else if (response.total) {
            totalCount.value = response.total;
          }
          const formattedData = dataList.map((item) => ({
            id: item.courseware_id || item.id,
            name: item.name || item.title || "未命名课件",
            description: item.description || item.desc || "",
            mainType: item.type || "other",
            typeName: item.type || "课件",
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
      const iconMap = {
        "doc": "/static/image/file/doc.png",
        "docx": "/static/image/file/doc.png",
        "word": "/static/image/file/doc.png",
        "pdf": "/static/image/file/pdf.png",
        "ppt": "/static/image/file/ppt.png",
        "pptx": "/static/image/file/ppt.png",
        "xls": "/static/image/file/xls.png",
        "xlsx": "/static/image/file/xls.png",
        "excel": "/static/image/file/xls.png",
        "txt": "/static/image/file/txt.png",
        "text": "/static/image/file/txt.png",
        "zip": "/static/image/file/zip.png",
        "rar": "/static/image/file/zip.png",
        "7z": "/static/image/file/zip.png"
      };
      const key = (item.fileExt || item.mainType || "").toLowerCase();
      return iconMap[key] || "/static/image/file/file.png";
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
      const coursewareType = getCurrentCoursewareType();
      const routeMap = {
        normal: "/pages/courseware/courseware",
        winnow: "/pages/courseware/specialcourseware"
      };
      const url = routeMap[coursewareType] || "/pages/courseware/courseware";
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
    const typeMap = {
      "courseware": "normal",
      "specialcourseware": "winnow",
      "normal": "normal",
      "winnow": "winnow",
      "hot": "hot",
      "comprehensive": "comprehensive",
      "featured": "featured",
      "special": "winnow"
    };
    const categoryNameMap = {
      "hot": "热门课件",
      "comprehensive": "综合课件",
      "featured": "精选课件",
      "special": "专题课件",
      "normal": "综合课件",
      "winnow": "专题课件"
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
        a: common_vendor.o(search, "c4"),
        b: common_vendor.o(blur, "9b"),
        c: common_vendor.o(focus, "0b"),
        d: common_vendor.o(input, "a5"),
        e: common_vendor.o(clearSearch, "61"),
        f: common_vendor.o(search, "34"),
        g: common_vendor.o(($event) => searchKeyword.value = $event, "ed"),
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
            a: "30eef855-1-" + i0,
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
        k: common_vendor.o(($event) => changeSort(1), "e8"),
        l: currentSort.value === 2 ? 1 : "",
        m: common_vendor.o(($event) => changeSort(2), "42"),
        n: currentSort.value === 3 ? 1 : "",
        o: common_vendor.o(($event) => changeSort(3), "0f"),
        p: common_vendor.p({
          type: "settings",
          size: "18",
          color: "#2c62ef"
        }),
        q: common_vendor.o(showFilterPopup, "32"),
        r: common_vendor.f(fileList.value, (item, index, i0) => {
          return common_vendor.e({
            a: getFileIconPath(item),
            b: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            c: common_vendor.t(item.name),
            d: common_vendor.t(item.description),
            e: common_vendor.t(getPriceText(item)),
            f: "30eef855-3-" + i0,
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
        B: common_vendor.o(closeFilter, "73"),
        C: common_vendor.f(fileTypeOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempFileType.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempFileType.value = item.value, idx)
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
        G: common_vendor.f(coursewareStatusOptions, (item, idx, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: idx,
            c: tempCoursewareStatus.value === item.value ? 1 : "",
            d: common_vendor.o(($event) => tempCoursewareStatus.value = item.value, idx)
          };
        }),
        H: common_vendor.o(resetTempFilter, "42"),
        I: common_vendor.o(applyFilter, "7d"),
        J: common_vendor.sr(filterPopup, "30eef855-4", {
          "k": "filterPopup"
        }),
        K: common_vendor.p({
          type: "bottom",
          ["mask-click"]: true
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-30eef855"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/courseware.js.map
