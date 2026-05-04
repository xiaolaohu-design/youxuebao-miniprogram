"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "news",
  setup(__props) {
    const currentCategory = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const showModal = common_vendor.ref(false);
    const currentNews = common_vendor.ref({});
    const currentPage = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const totalItems = common_vendor.ref(0);
    const hasMore = common_vendor.ref(true);
    const categories = common_vendor.ref([]);
    const articleData = common_vendor.ref([]);
    const shopId = common_vendor.ref("");
    const featuredNews = common_vendor.computed(() => {
      if (articleData.value.length >= 2) {
        return articleData.value.slice(0, 2);
      }
      return [];
    });
    const currentNewsList = common_vendor.computed(() => {
      if (articleData.value.length > 2) {
        return articleData.value.slice(2);
      }
      return articleData.value;
    });
    const parseDate = (timeStr) => {
      if (!timeStr)
        return /* @__PURE__ */ new Date(NaN);
      let str = String(timeStr).replace(/-/g, "/").replace(/T/g, " ").replace(/\.\d{3,}Z/g, "").replace(/Z/g, "").trim();
      return new Date(str);
    };
    const formatRelativeTime = (dateString) => {
      if (!dateString)
        return "刚刚";
      const date = parseDate(dateString);
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
      if (date.getFullYear() < now.getFullYear()) {
        return `${date.getFullYear()}-${month}-${day}`;
      }
      return `${month}-${day}`;
    };
    const formatFullTime = (dateString) => {
      if (!dateString)
        return "";
      const date = parseDate(dateString);
      if (isNaN(date.getTime()))
        return dateString;
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
    const formatArticleData = (items) => {
      if (!items || !items.length)
        return [];
      return items.map((item) => ({
        id: item.id,
        title: item.article_title || "",
        cover: item.cover || "",
        source: item.article_type || "新闻资讯",
        time: formatRelativeTime(item.created_at),
        fullTime: formatFullTime(item.created_at),
        content: processHtmlContent(item.content),
        summary: item.summary || "",
        views: item.views || 0,
        tags: item.tags ? JSON.parse(item.tags) : []
      }));
    };
    const fetchCategories = async () => {
      if (!shopId.value)
        return;
      try {
        const response = await api_index.getCategoriesAll(shopId.value, 1);
        if (response && response.data && response.data.length) {
          const reversedData = [...response.data].reverse();
          categories.value = reversedData.map((item) => ({
            id: item.id,
            name: item.name
          }));
          if (!currentCategory.value) {
            currentCategory.value = categories.value[0].id;
          }
        }
      } catch (error) {
      }
    };
    const fetchArticleList = async (page, size, type, isLoadMore = false) => {
      if (!shopId.value)
        return;
      loading.value = true;
      try {
        const response = await api_index.getArticle(shopId.value, page, size, null, type);
        if (response && response.data) {
          const formattedData = formatArticleData(response.data);
          if (isLoadMore) {
            articleData.value = [...articleData.value, ...formattedData];
          } else {
            articleData.value = formattedData;
          }
          const loadedCount = page * size;
          hasMore.value = response.total ? loadedCount < response.total : formattedData.length >= size;
          totalItems.value = response.total || 0;
        } else {
          if (!isLoadMore) {
            articleData.value = [];
          }
          hasMore.value = false;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取文章列表失败",
          icon: "none"
        });
      } finally {
        loading.value = false;
      }
    };
    const switchCategory = (categoryId) => {
      if (currentCategory.value === categoryId)
        return;
      currentCategory.value = categoryId;
      currentPage.value = 1;
      hasMore.value = true;
      articleData.value = [];
      fetchArticleList(currentPage.value, pageSize.value, categoryId, false);
    };
    const showNewsDetail = (news) => {
      currentNews.value = news;
      showModal.value = true;
    };
    const closeModal = () => {
      showModal.value = false;
    };
    const handleShareNews = () => {
      common_vendor.index.showToast({
        title: "请点击右上角菜单分享",
        icon: "none",
        duration: 2e3
      });
    };
    const handleLoadMore = () => {
      if (loading.value || !hasMore.value)
        return;
      currentPage.value++;
      fetchArticleList(currentPage.value, pageSize.value, currentCategory.value, true);
    };
    common_vendor.onMounted(async () => {
      shopId.value = common_vendor.index.getStorageSync("shopId") || "";
      if (!shopId.value)
        return;
      await fetchCategories();
      if (categories.value.length > 0) {
        currentCategory.value = categories.value[0].id;
        fetchArticleList(currentPage.value, pageSize.value, currentCategory.value, false);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(categories.value, (category, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(category.name),
            b: currentCategory.value === category.id
          }, currentCategory.value === category.id ? {} : {}, {
            c: category.id,
            d: currentCategory.value === category.id ? 1 : "",
            e: common_vendor.o(($event) => switchCategory(category.id), category.id)
          });
        }),
        b: featuredNews.value.length > 0
      }, featuredNews.value.length > 0 ? {
        c: common_vendor.f(featuredNews.value, (news, k0, i0) => {
          return {
            a: news.cover,
            b: common_vendor.t(news.title),
            c: common_vendor.t(news.source),
            d: common_vendor.t(news.time),
            e: news.id,
            f: common_vendor.o(($event) => showNewsDetail(news), news.id)
          };
        })
      } : {}, {
        d: common_vendor.f(currentNewsList.value, (news, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(news.title),
            b: common_vendor.t(news.source),
            c: common_vendor.t(news.time),
            d: news.cover
          }, news.cover ? {
            e: news.cover
          } : {}, {
            f: news.id,
            g: common_vendor.o(($event) => showNewsDetail(news), news.id)
          });
        }),
        e: loading.value
      }, loading.value ? {} : {}, {
        f: !hasMore.value && articleData.value.length > 0
      }, !hasMore.value && articleData.value.length > 0 ? {} : {}, {
        g: articleData.value.length === 0 && !loading.value
      }, articleData.value.length === 0 && !loading.value ? {
        h: common_assets._imports_0$5
      } : {}, {
        i: showModal.value
      }, showModal.value ? common_vendor.e({
        j: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#8599b0"
        }),
        k: common_vendor.o(closeModal, "89"),
        l: common_vendor.t(currentNews.value.title),
        m: common_vendor.p({
          type: "person",
          size: "14",
          color: "#8599b0"
        }),
        n: common_vendor.t(currentNews.value.source),
        o: common_vendor.p({
          type: "calendar",
          size: "14",
          color: "#8599b0"
        }),
        p: common_vendor.t(currentNews.value.fullTime),
        q: currentNews.value.cover
      }, currentNews.value.cover ? {
        r: currentNews.value.cover
      } : {}, {
        s: currentNews.value.content,
        t: common_vendor.p({
          type: "redo",
          size: "20",
          color: "#3b82f6"
        }),
        v: common_vendor.o(handleShareNews, "43"),
        w: common_vendor.o(() => {
        }, "73"),
        x: common_vendor.o(closeModal, "c9")
      }) : {}, {
        y: common_vendor.o(handleLoadMore, "eb")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-24bc9d41"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/news/news.js.map
