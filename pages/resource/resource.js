"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_search_bar2 = common_vendor.resolveComponent("uni-search-bar");
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_data_picker2 = common_vendor.resolveComponent("uni-data-picker");
  const _easycom_uni_load_more2 = common_vendor.resolveComponent("uni-load-more");
  (_easycom_uni_search_bar2 + _easycom_uni_icons2 + _easycom_uni_data_picker2 + _easycom_uni_load_more2)();
}
const _easycom_uni_search_bar = () => "../../uni_modules/uni-search-bar/components/uni-search-bar/uni-search-bar.js";
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_data_picker = () => "../../uni_modules/uni-data-picker/components/uni-data-picker/uni-data-picker.js";
const _easycom_uni_load_more = () => "../../uni_modules/uni-load-more/components/uni-load-more/uni-load-more.js";
if (!Math) {
  (_easycom_uni_search_bar + _easycom_uni_icons + _easycom_uni_data_picker + _easycom_uni_load_more)();
}
const _sfc_main = {
  __name: "resource",
  setup(__props) {
    const searchKeyword = common_vendor.ref("");
    let hasReceivedSearchEvent = false;
    common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const totalCount = common_vendor.ref(0);
    const hasMore = common_vendor.ref(true);
    const isLoadingMore = common_vendor.ref(false);
    const loading = common_vendor.ref(false);
    const loadMoreStatus = common_vendor.ref("more");
    const loadingText = common_vendor.ref({
      contentdown: "上拉加载更多",
      contentrefresh: "加载中...",
      contentnomore: "没有更多了"
    });
    const loadMoreText = common_vendor.ref({
      contentdown: "上拉加载更多",
      contentrefresh: "加载中...",
      contentnomore: "没有更多了"
    });
    const catalogTreeData = common_vendor.ref([]);
    const getSubjectCategory = async () => {
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const response = await api_index.fetchGetSubjectCategoryList(shopId);
        if (response && response.status === "success" && response.data) {
          catalogTreeData.value = transformCategoryData(response.data);
        } else {
          catalogTreeData.value = [];
        }
      } catch (error) {
        catalogTreeData.value = [];
      }
    };
    const transformCategoryData = (data) => {
      if (!data || !Array.isArray(data))
        return [];
      return data.map((item) => {
        const node = {
          text: item.label,
          value: item.value
        };
        if (item.children && Array.isArray(item.children) && item.children.length > 0) {
          node.children = transformCategoryData(item.children);
        }
        return node;
      });
    };
    const typeList = common_vendor.ref([
      {
        text: "视频课程",
        value: "videocourse"
      },
      {
        text: "音频课程",
        value: "audiocourse"
      },
      {
        text: "图文课程",
        value: "imagecourse"
      },
      {
        text: "专题课程",
        value: "specialcourse"
      },
      {
        text: "综合课件",
        value: "courseware"
      },
      {
        text: "专题课件",
        value: "specialcourseware"
      },
      {
        text: "综合试卷",
        value: "exampaper"
      },
      {
        text: "专题试卷",
        value: "specialexampaper"
      }
    ]);
    const featuredListData = common_vendor.ref([
      {
        text: "精选",
        value: 1
      },
      {
        text: "非精选",
        value: 2
      }
    ]);
    const sortListData = common_vendor.ref([
      {
        text: "综合",
        value: 1
      },
      {
        text: "最新",
        value: 2
      },
      {
        text: "最热",
        value: 3
      },
      {
        text: "最多收藏",
        value: 4
      },
      {
        text: "最多关注",
        value: 5
      },
      {
        text: "最多喜欢",
        value: 6
      }
    ]);
    const catalogPickerValue = common_vendor.ref([]);
    const typePickerValue = common_vendor.ref("");
    const featuredPickerValue = common_vendor.ref("");
    const sortPickerValue = common_vendor.ref("");
    const selectedCatalogValue = common_vendor.ref("");
    const selectedCatalogText = common_vendor.ref("");
    const selectedType = common_vendor.ref("");
    const selectedFeatured = common_vendor.ref("");
    const selectedSort = common_vendor.ref("");
    const catalogPicker = common_vendor.ref(null);
    const typePicker = common_vendor.ref(null);
    const featuredPicker = common_vendor.ref(null);
    const sortPicker = common_vendor.ref(null);
    const resourceList = common_vendor.ref([]);
    const typeMap = {
      "videocourse": {
        name: "视频课程",
        fetch: api_index.fetchVideoCourseListToSubPage
      },
      "audiocourse": {
        name: "音频课程",
        fetch: api_index.fetchMP3CourseListToSubPage
      },
      "imagecourse": {
        name: "图文课程",
        fetch: api_index.fetchImageTextCourseListToSubPage
      },
      "specialcourse": {
        name: "专题课程",
        fetch: api_index.fetchWinnowCourseListToSubPage
      },
      "courseware": {
        name: "综合课件",
        fetch: api_index.fetchSubPageCourseWareList
      },
      "specialcourseware": {
        name: "专题课件",
        fetch: api_index.fetchSubPageSpecialCourseWareListData
      },
      "exampaper": {
        name: "综合试卷",
        fetch: api_index.getNormalExampaperList
      },
      "specialexampaper": {
        name: "专题试卷",
        fetch: api_index.fetchGroupExampaperList
      }
    };
    const isFileType = common_vendor.computed(() => {
      const type = selectedType.value || "videocourse";
      return type === "courseware" || type === "specialcourseware" || type === "exampaper" || type === "specialexampaper";
    });
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
    const getFileIconPath = (item) => {
      const fileExt = (item.type || item.fileType || item.mainType || "").toLowerCase();
      const iconMap = {
        // Word文档
        "doc": "/static/image/file/doc.png",
        "docx": "/static/image/file/doc.png",
        "word": "/static/image/file/doc.png",
        // PDF文件
        "pdf": "/static/image/file/pdf.png",
        // PPT演示
        "ppt": "/static/image/file/ppt.png",
        "pptx": "/static/image/file/ppt.png",
        // Excel表格
        "xls": "/static/image/file/xls.png",
        "xlsx": "/static/image/file/xls.png",
        "excel": "/static/image/file/xls.png",
        // 文本文件
        "txt": "/static/image/file/txt.png",
        "text": "/static/image/file/txt.png",
        // 压缩包
        "zip": "/static/image/file/zip.png",
        "rar": "/static/image/file/zip.png",
        "7z": "/static/image/file/zip.png",
        // 课件/试卷默认图标
        "courseware": "/static/image/file/courseware.png",
        "exampaper": "/static/image/file/exam.png",
        "specialcourseware": "/static/image/file/courseware.png",
        "specialexampaper": "/static/image/file/exam.png"
      };
      return iconMap[fileExt] || "/static/image/file/file.png";
    };
    const fetchResourceList = async (isLoadMore = false) => {
      if (loading.value && !isLoadMore)
        return;
      if (isLoadMore && isLoadingMore.value) {
        return;
      }
      if (isLoadMore && !hasMore.value) {
        loadMoreStatus.value = "noMore";
        return;
      }
      if (!isLoadMore) {
        loading.value = true;
        pageSize.value = 20;
        hasMore.value = true;
        loadMoreStatus.value = "more";
      } else {
        isLoadingMore.value = true;
        loadMoreStatus.value = "loading";
        pageSize.value += 20;
      }
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const type = selectedType.value || "videocourse";
        const typeInfo = typeMap[type] || typeMap["videocourse"];
        const fetchMethod = typeInfo.fetch;
        const formData = {
          UXMID: shopId,
          currentPage: 1,
          pageSize: pageSize.value
        };
        if (selectedCatalogValue.value) {
          formData.category = selectedCatalogValue.value;
        }
        if (selectedFeatured.value !== "") {
          formData.winnow = selectedFeatured.value;
        }
        if (selectedSort.value) {
          if (type === "videocourse" || type === "audiocourse" || type === "imagecourse" || type === "specialcourse") {
            formData.coursesort = selectedSort.value;
          } else if (type === "courseware" || type === "specialcourseware") {
            formData.coursewaresort = selectedSort.value;
          } else if (type === "exampaper" || type === "specialexampaper") {
            formData.exampapersort = selectedSort.value;
          }
        }
        if (searchKeyword.value.trim()) {
          formData.inputkeyword = searchKeyword.value.trim();
        }
        const response = await fetchMethod(formData);
        if (response && response.status === "success" && response.data) {
          const responseData = response.data;
          const dataList = Array.isArray(responseData) ? responseData : responseData.list || [];
          if (responseData.total) {
            totalCount.value = responseData.total;
          } else if (responseData.totalCount) {
            totalCount.value = responseData.totalCount;
          }
          const formattedData = formatResourceData(dataList, type, typeInfo.name);
          resourceList.value = formattedData;
          if (dataList.length < pageSize.value) {
            hasMore.value = false;
          } else if (totalCount.value > 0) {
            hasMore.value = resourceList.value.length < totalCount.value;
          } else {
            hasMore.value = true;
          }
          if (isLoadMore) {
            loadMoreStatus.value = hasMore.value ? "more" : "noMore";
          }
        } else {
          if (!isLoadMore) {
            resourceList.value = [];
          } else {
            pageSize.value -= 20;
          }
          hasMore.value = false;
          loadMoreStatus.value = "noMore";
        }
      } catch (error) {
        if (!isLoadMore) {
          resourceList.value = [];
        } else {
          pageSize.value -= 20;
        }
        hasMore.value = false;
        loadMoreStatus.value = "noMore";
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "none"
        });
      } finally {
        if (!isLoadMore) {
          loading.value = false;
        } else {
          isLoadingMore.value = false;
        }
      }
    };
    const formatResourceData = (dataList, type, typeName) => {
      return dataList.map((item) => {
        const baseData = {
          id: item.course_id || item.id || item.courseware_id || item.paper_id || Date.now() + Math.random(),
          title: item.name || item.title || item.course_name || item.ware_name || item.paper_name || "未命名资源",
          description: item.description || item.desc || item.intro || "",
          fileType: item.type,
          mainType: type,
          typeName,
          cover: item.cover || item.image || item.thumb || "https://demo.youxuebao.com.cn/image/hot/default.jpg",
          price: item.price || 0,
          // 保存销售模式，用于价格显示
          sales_mode: item.sales_mode || 0,
          isFeatured: item.winnowstatus || item.is_featured || item.featured || false,
          viewCount: item.view_count || item.views || 0,
          downloadCount: item.download_count || item.downloads || 0,
          collectCount: item.collect_count || item.collects || 0,
          followCount: item.follow_count || item.follows || 0,
          likeCount: item.like_count || item.likes || 0,
          hotScore: item.hot_score || item.hot || 0,
          createTime: item.create_time || item.created_at || item.publish_time || (/* @__PURE__ */ new Date()).toISOString(),
          catalogValue: item.category_id || item.catalog_id || null,
          catalogPath: item.category_path || item.catalog_path || [],
          tags: item.tags || item.labels || item.categoryLabels || [],
          // 文件类型特有字段
          fileExt: item.file_ext || item.fileExt || item.file_type || item.fileType || "",
          fileSize: item.file_size || item.fileSize || ""
        };
        if (!Array.isArray(baseData.tags)) {
          baseData.tags = baseData.tags ? [baseData.tags] : [];
        }
        if (!Array.isArray(baseData.catalogPath)) {
          baseData.catalogPath = baseData.catalogValue ? [baseData.catalogValue] : [];
        }
        return baseData;
      });
    };
    const loadMore = () => {
      if (isLoadingMore.value) {
        return;
      }
      if (!hasMore.value) {
        loadMoreStatus.value = "noMore";
        return;
      }
      if (loading.value) {
        return;
      }
      fetchResourceList(true);
    };
    const filteredResources = common_vendor.computed(() => {
      return resourceList.value;
    });
    const sortedResources = common_vendor.computed(() => {
      return filteredResources.value;
    });
    common_vendor.watch([selectedType, selectedCatalogValue, selectedFeatured, selectedSort], () => {
      pageSize.value = 20;
      hasMore.value = true;
      loadMoreStatus.value = "more";
      fetchResourceList();
    }, {
      deep: true
    });
    let searchTimer = null;
    common_vendor.watch(searchKeyword, (newVal) => {
      if (searchTimer) {
        clearTimeout(searchTimer);
      }
      searchTimer = setTimeout(() => {
        pageSize.value = 20;
        hasMore.value = true;
        loadMoreStatus.value = "more";
        fetchResourceList();
      }, 500);
    });
    const openCatalogPicker = () => {
      if (catalogPicker.value) {
        catalogPicker.value.show();
      }
    };
    const openTypePicker = () => {
      if (typePicker.value) {
        typePicker.value.show();
      }
    };
    const openFeaturedPicker = () => {
      if (featuredPicker.value) {
        featuredPicker.value.show();
      }
    };
    const openSortPicker = () => {
      if (sortPicker.value) {
        sortPicker.value.show();
      }
    };
    const onCatalogChange = (e) => {
      let selectedValue = null;
      let selectedText = null;
      if (e.detail && e.detail.value) {
        const val = e.detail.value;
        if (Array.isArray(val) && val.length > 0) {
          const lastItem = val[val.length - 1];
          if (lastItem && typeof lastItem === "object") {
            selectedValue = lastItem.value;
            selectedText = lastItem.text;
          } else {
            selectedValue = lastItem;
          }
        } else if (val && typeof val === "object") {
          selectedValue = val.value;
          selectedText = val.text;
        } else if (typeof val === "number" || typeof val === "string") {
          selectedValue = val;
        }
      }
      if (selectedValue) {
        selectedCatalogValue.value = selectedValue;
        selectedCatalogText.value = selectedText;
        catalogPickerValue.value = e.detail.value || [selectedValue];
      } else {
        selectedCatalogValue.value = "";
        selectedCatalogText.value = "";
        catalogPickerValue.value = [];
      }
    };
    const onTypeChange = (e) => {
      let selectedValue = "";
      if (e.detail && e.detail.value) {
        const val = e.detail.value;
        if (Array.isArray(val) && val.length > 0) {
          const item = val[0];
          selectedValue = item && typeof item === "object" ? item.value : item;
        } else if (val && typeof val === "object") {
          selectedValue = val.value;
        } else if (typeof val === "string") {
          selectedValue = val;
        }
      }
      if (!selectedValue && e && typeof e === "object") {
        selectedValue = e.value;
        if (e[0] && typeof e[0] === "object") {
          selectedValue = e[0].value;
        }
      }
      selectedType.value = selectedValue || "";
      typePickerValue.value = selectedType.value;
    };
    const onFeaturedChange = (e) => {
      let selectedValue = "";
      if (e.detail && e.detail.value) {
        const val = e.detail.value;
        if (Array.isArray(val) && val.length > 0) {
          const item = val[0];
          selectedValue = item && typeof item === "object" ? item.value : item;
        } else if (val && typeof val === "object") {
          selectedValue = val.value;
        } else if (typeof val === "number") {
          selectedValue = val;
        }
      }
      if (!selectedValue && e && typeof e === "object") {
        selectedValue = e.value;
        if (e[0] && typeof e[0] === "object") {
          selectedValue = e[0].value;
        }
      }
      selectedFeatured.value = selectedValue !== "" ? selectedValue : "";
      featuredPickerValue.value = selectedFeatured.value;
    };
    const onSortChange = (e) => {
      let selectedValue = "";
      if (e.detail && e.detail.value) {
        const val = e.detail.value;
        if (Array.isArray(val) && val.length > 0) {
          const item = val[0];
          selectedValue = item && typeof item === "object" ? item.value : item;
        } else if (val && typeof val === "object") {
          selectedValue = val.value;
        } else if (typeof val === "number") {
          selectedValue = val;
        }
      }
      if (!selectedValue && e && typeof e === "object") {
        selectedValue = e.value;
        if (e[0] && typeof e[0] === "object") {
          selectedValue = e[0].value;
        }
      }
      selectedSort.value = selectedValue || "";
      sortPickerValue.value = selectedSort.value;
    };
    const resetFilters = async () => {
      selectedCatalogValue.value = "";
      selectedCatalogText.value = "";
      selectedType.value = "";
      selectedFeatured.value = "";
      selectedSort.value = "";
      searchKeyword.value = "";
      hasReceivedSearchEvent = false;
      catalogPickerValue.value = [];
      typePickerValue.value = "";
      featuredPickerValue.value = "";
      sortPickerValue.value = "";
      if (catalogPicker.value)
        await catalogPicker.value.hide();
      if (typePicker.value)
        await typePicker.value.hide();
      if (featuredPicker.value)
        await featuredPicker.value.hide();
      if (sortPicker.value)
        await sortPicker.value.hide();
      pageSize.value = 20;
      hasMore.value = true;
      loadMoreStatus.value = "more";
      await fetchResourceList();
    };
    const handleSearch = (res) => {
      const searchText = res.value || searchKeyword.value;
      if (searchText && searchText.trim()) {
        hasReceivedSearchEvent = false;
        pageSize.value = 20;
        hasMore.value = true;
        loadMoreStatus.value = "more";
        fetchResourceList();
      }
    };
    const handleSearchInput = (res) => {
      searchKeyword.value = res.value;
      hasReceivedSearchEvent = false;
    };
    const handleClearSearch = () => {
      searchKeyword.value = "";
      hasReceivedSearchEvent = false;
      pageSize.value = 20;
      hasMore.value = true;
      loadMoreStatus.value = "more";
      fetchResourceList();
    };
    const handleSearchFromHome = (keyword) => {
      if (keyword && keyword.trim()) {
        hasReceivedSearchEvent = true;
        searchKeyword.value = keyword.trim();
        common_vendor.nextTick$1(() => {
          pageSize.value = 20;
          hasMore.value = true;
          loadMoreStatus.value = "more";
          fetchResourceList();
        });
      }
    };
    const handleResourceClick = (item) => {
      const type = item.mainType;
      const id = item.id;
      const courseRouteMap = {
        "videocourse": "/pages/course/videocourse",
        "audiocourse": "/pages/course/audiocourse",
        "imagecourse": "/pages/course/imagecourse",
        "specialcourse": "/pages/course/specialcourse"
      };
      const coursewareRouteMap = {
        "courseware": "/pages/courseware/courseware",
        "specialcourseware": "/pages/courseware/specialcourseware"
      };
      const exampaperRouteMap = {
        "exampaper": "/pages/exampaper/exampaper",
        "specialexampaper": "/pages/exampaper/specialexampaper"
      };
      let url = "";
      if (courseRouteMap[type]) {
        url = `${courseRouteMap[type]}?id=${id}`;
      } else if (coursewareRouteMap[type]) {
        url = `${coursewareRouteMap[type]}?id=${id}`;
      } else if (exampaperRouteMap[type]) {
        url = `${exampaperRouteMap[type]}?id=${id}`;
      } else {
        if (type.includes("course")) {
          url = `/pages/course/detail?id=${id}&type=${type}`;
        } else if (type.includes("courseware")) {
          url = `/pages/courseware/detail?id=${id}&type=${type}`;
        } else if (type.includes("exampaper")) {
          url = `/pages/exam/detail?id=${id}&type=${type}`;
        }
      }
      if (url) {
        common_vendor.index.navigateTo({
          url,
          fail: (err) => {
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      }
    };
    const getTypeClass = (type) => {
      const map = {
        videocourse: "type-course",
        audiocourse: "type-audio",
        imagecourse: "type-image",
        specialcourse: "type-special",
        courseware: "type-courseware",
        specialcourseware: "type-courseware",
        exampaper: "type-exam",
        specialexampaper: "type-exam"
      };
      return map[type] || "type-default";
    };
    const formatNumber = (n) => {
      if (!n)
        return "0";
      return n >= 1e4 ? (n / 1e4).toFixed(1) + "w" : n + "";
    };
    const blur = () => {
      common_vendor.index.removeStorageSync("searchSource");
    };
    const focus = () => {
      common_vendor.index.removeStorageSync("searchSource");
    };
    common_vendor.onMounted(() => {
      common_vendor.index.$on("searchFromHome", handleSearchFromHome);
      getSubjectCategory();
      if (!hasReceivedSearchEvent) {
        fetchResourceList();
      }
    });
    common_vendor.onUnmounted(() => {
      common_vendor.index.$off("searchFromHome", handleSearchFromHome);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch, "51"),
        b: common_vendor.o(blur, "3e"),
        c: common_vendor.o(focus, "d4"),
        d: common_vendor.o(handleSearchInput, "98"),
        e: common_vendor.o(handleClearSearch, "8a"),
        f: common_vendor.o(($event) => searchKeyword.value = $event, "53"),
        g: common_vendor.p({
          focus: false,
          placeholder: "请输入搜索内容",
          radius: 50,
          clearButton: "auto",
          cancelButton: "none",
          modelValue: searchKeyword.value
        }),
        h: selectedCatalogValue.value ? 1 : "",
        i: common_vendor.p({
          type: selectedCatalogValue.value ? "up" : "down",
          size: "14",
          color: selectedCatalogValue.value ? "#6366f1" : "#333"
        }),
        j: common_vendor.o(openCatalogPicker, "8b"),
        k: selectedType.value ? 1 : "",
        l: common_vendor.p({
          type: selectedType.value ? "up" : "down",
          size: "14",
          color: selectedType.value ? "#6366f1" : "#333"
        }),
        m: common_vendor.o(openTypePicker, "43"),
        n: selectedFeatured.value ? 1 : "",
        o: common_vendor.p({
          type: selectedFeatured.value ? "up" : "down",
          size: "14",
          color: selectedFeatured.value ? "#6366f1" : "#333"
        }),
        p: common_vendor.o(openFeaturedPicker, "d1"),
        q: selectedSort.value ? 1 : "",
        r: common_vendor.p({
          type: selectedSort.value ? "up" : "down",
          size: "14",
          color: selectedSort.value ? "#6366f1" : "#333"
        }),
        s: common_vendor.o(openSortPicker, "a6"),
        t: common_vendor.o(resetFilters, "47"),
        v: common_vendor.sr(catalogPicker, "34c825ee-5", {
          "k": "catalogPicker"
        }),
        w: common_vendor.o(onCatalogChange, "57"),
        x: common_vendor.o(($event) => catalogPickerValue.value = $event, "17"),
        y: common_vendor.p({
          localdata: catalogTreeData.value,
          ["popup-title"]: "选择目录",
          ["clear-icon"]: false,
          multiple: false,
          modelValue: catalogPickerValue.value
        }),
        z: common_vendor.sr(typePicker, "34c825ee-6", {
          "k": "typePicker"
        }),
        A: common_vendor.o(onTypeChange, "6c"),
        B: common_vendor.o(($event) => typePickerValue.value = $event, "14"),
        C: common_vendor.p({
          localdata: typeList.value,
          ["popup-title"]: "选择类型",
          ["clear-icon"]: false,
          multiple: false,
          modelValue: typePickerValue.value
        }),
        D: common_vendor.sr(featuredPicker, "34c825ee-7", {
          "k": "featuredPicker"
        }),
        E: common_vendor.o(onFeaturedChange, "07"),
        F: common_vendor.o(($event) => featuredPickerValue.value = $event, "66"),
        G: common_vendor.p({
          localdata: featuredListData.value,
          ["popup-title"]: "选择状态",
          ["clear-icon"]: false,
          multiple: false,
          modelValue: featuredPickerValue.value
        }),
        H: common_vendor.sr(sortPicker, "34c825ee-8", {
          "k": "sortPicker"
        }),
        I: common_vendor.o(onSortChange, "b5"),
        J: common_vendor.o(($event) => sortPickerValue.value = $event, "4b"),
        K: common_vendor.p({
          localdata: sortListData.value,
          ["popup-title"]: "排序方式",
          ["clear-icon"]: false,
          multiple: false,
          modelValue: sortPickerValue.value
        }),
        L: loading.value
      }, loading.value ? {
        M: common_vendor.p({
          status: "loading",
          ["content-text"]: loadingText.value
        })
      } : common_vendor.e({
        N: isFileType.value
      }, isFileType.value ? {
        O: common_vendor.f(sortedResources.value, (item, k0, i0) => {
          return common_vendor.e({
            a: getFileIconPath(item),
            b: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            c: common_vendor.t(item.title),
            d: common_vendor.t(item.description),
            e: common_vendor.t(getPriceText(item)),
            f: "34c825ee-10-" + i0,
            g: common_vendor.t(formatNumber(item.downloadCount || item.viewCount)),
            h: item.id,
            i: common_vendor.o(($event) => handleResourceClick(item), item.id)
          });
        }),
        P: common_vendor.p({
          type: "download",
          size: "14",
          color: "#bbb"
        })
      } : {
        Q: common_vendor.f(sortedResources.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.cover,
            b: common_vendor.t(item.typeName),
            c: common_vendor.n(getTypeClass(item.mainType)),
            d: item.isFeatured
          }, item.isFeatured ? {} : {}, {
            e: common_vendor.t(item.title),
            f: common_vendor.t(item.description),
            g: common_vendor.f(item.tags.slice(0, 3), (tag, tagIndex, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tagIndex
              };
            }),
            h: common_vendor.t(getPriceText(item)),
            i: common_vendor.t(formatNumber(item.viewCount)),
            j: item.id,
            k: common_vendor.o(($event) => handleResourceClick(item), item.id)
          });
        })
      }), {
        R: sortedResources.value.length > 0
      }, sortedResources.value.length > 0 ? {
        S: common_vendor.p({
          status: loadMoreStatus.value,
          ["content-text"]: loadMoreText.value
        })
      } : {}, {
        T: !loading.value && sortedResources.value.length === 0
      }, !loading.value && sortedResources.value.length === 0 ? {
        U: common_assets._imports_0$1
      } : {}, {
        V: common_vendor.o(loadMore, "7b")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-34c825ee"]]);
_sfc_main.__runtimeHooks = 1;
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/resource/resource.js.map
