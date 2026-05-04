"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const defaultLogo = "/static/image/my/avatar.png";
const defaultQrcode = "/static/image/my/avatar.png";
const _sfc_main = {
  __name: "about",
  setup(__props) {
    const shopId = common_vendor.ref("");
    const showQrcodeModal = common_vendor.ref(false);
    const showLicenseModal = common_vendor.ref(false);
    const showProtocolModal = common_vendor.ref(false);
    const protocolModalTitle = common_vendor.ref("");
    const protocolModalContent = common_vendor.ref("");
    const aboutData = common_vendor.reactive({
      app_name: "",
      app_slogan: "",
      app_version: "",
      app_logo: "",
      company_intro_1: "",
      company_intro_2: "",
      service_phone: "",
      business_email: "",
      support_email: "",
      company_address: "",
      wechat_account: "",
      wechat_qrcode: "",
      weibo_url: "",
      douyin_url: "",
      xiaohongshu_url: "",
      business_license: "",
      icp_number: "",
      user_agreement: "",
      privacy_policy: "",
      child_privacy_policy: "",
      copyright_text: "",
      company_full_name: ""
    });
    const fetchAboutUsData = async () => {
      if (!shopId.value)
        return;
      try {
        const formData = {
          UXMID: shopId.value
        };
        const response = await api_index.fetchGetAboutUs(formData);
        if (response.status === "success" && response.data) {
          const data = response.data;
          aboutData.app_name = data.app_name || "";
          aboutData.app_slogan = data.app_slogan || "";
          aboutData.app_version = data.app_version || "";
          aboutData.app_logo = data.app_logo || "";
          aboutData.company_intro_1 = data.company_intro_1 || "";
          aboutData.company_intro_2 = data.company_intro_2 || "";
          aboutData.service_phone = data.service_phone || "";
          aboutData.business_email = data.business_email || "";
          aboutData.support_email = data.support_email || "";
          aboutData.company_address = data.company_address || "";
          aboutData.wechat_account = data.wechat_account || "";
          aboutData.wechat_qrcode = data.wechat_qrcode || "";
          aboutData.weibo_url = data.weibo_url || "";
          aboutData.douyin_url = data.douyin_url || "";
          aboutData.xiaohongshu_url = data.xiaohongshu_url || "";
          aboutData.business_license = data.business_license || "";
          aboutData.icp_number = data.icp_number || "";
          aboutData.user_agreement = data.user_agreement || "";
          aboutData.privacy_policy = data.privacy_policy || "";
          aboutData.child_privacy_policy = data.child_privacy_policy || "";
          aboutData.copyright_text = data.copyright_text || "";
          aboutData.company_full_name = data.company_full_name || "";
        }
      } catch (error) {
      }
    };
    const handleCall = () => {
      if (aboutData.service_phone) {
        const phoneNumber = aboutData.service_phone.replace(/-/g, "");
        common_vendor.index.makePhoneCall({
          phoneNumber
        });
      }
    };
    const handleCopy = (field) => {
      const content = aboutData[field] || "";
      common_vendor.index.setClipboardData({
        data: content,
        success: () => {
          common_vendor.index.showToast({
            title: "已复制",
            icon: "success"
          });
        }
      });
    };
    const openSocial = (type) => {
      switch (type) {
        case "wechat":
          showQrcodeModal.value = true;
          break;
        case "weibo":
          if (aboutData.weibo_url) {
            common_vendor.index.showToast({
              title: "请在浏览器中打开",
              icon: "none"
            });
          }
          break;
        case "douyin":
          if (aboutData.douyin_url) {
            common_vendor.index.showToast({
              title: "请在抖音中打开",
              icon: "none"
            });
          }
          break;
        case "xiaohongshu":
          if (aboutData.xiaohongshu_url) {
            common_vendor.index.showToast({
              title: "请在小红书中打开",
              icon: "none"
            });
          }
          break;
      }
    };
    const closeQrcodeModal = () => {
      showQrcodeModal.value = false;
    };
    const closeLicenseModal = () => {
      showLicenseModal.value = false;
    };
    const closeProtocolModal = () => {
      showProtocolModal.value = false;
    };
    const getProtocolTitle = (type) => {
      const titles = {
        license: "营业执照",
        icp: "ICP备案信息",
        user: "用户服务协议",
        privacy: "隐私政策",
        child: "儿童隐私保护指引"
      };
      return titles[type] || "详情";
    };
    const openProtocolModal = (type) => {
      let content = "";
      switch (type) {
        case "license":
          if (aboutData.business_license) {
            showLicenseModal.value = true;
            return;
          }
          break;
        case "icp":
          content = aboutData.icp_number;
          break;
        case "user":
          content = aboutData.user_agreement;
          break;
        case "privacy":
          content = aboutData.privacy_policy;
          break;
        case "child":
          content = aboutData.child_privacy_policy;
          break;
      }
      if (content) {
        protocolModalTitle.value = getProtocolTitle(type);
        protocolModalContent.value = content;
        showProtocolModal.value = true;
      }
    };
    common_vendor.onLoad(() => {
      const shopid = common_vendor.index.getStorageSync("shopId");
      shopId.value = shopid || "";
      fetchAboutUsData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: aboutData.app_logo || defaultLogo,
        b: common_vendor.t(aboutData.app_name || "应用名称"),
        c: common_vendor.t(aboutData.app_slogan || "让学习更简单，让成长更快乐"),
        d: common_vendor.t(aboutData.app_version || "1.0.0"),
        e: aboutData.company_intro_1 || aboutData.company_intro_2
      }, aboutData.company_intro_1 || aboutData.company_intro_2 ? common_vendor.e({
        f: common_vendor.p({
          type: "info",
          size: "20",
          color: "#2c62ef"
        }),
        g: aboutData.company_intro_1
      }, aboutData.company_intro_1 ? {
        h: common_vendor.t(aboutData.company_intro_1)
      } : {}, {
        i: aboutData.company_intro_2
      }, aboutData.company_intro_2 ? {
        j: common_vendor.t(aboutData.company_intro_2)
      } : {}) : {}, {
        k: aboutData.service_phone || aboutData.business_email || aboutData.support_email || aboutData.company_address
      }, aboutData.service_phone || aboutData.business_email || aboutData.support_email || aboutData.company_address ? common_vendor.e({
        l: common_vendor.p({
          type: "phone",
          size: "20",
          color: "#2c62ef"
        }),
        m: aboutData.service_phone
      }, aboutData.service_phone ? {
        n: common_vendor.p({
          type: "phone-filled",
          size: "18",
          color: "#64748b"
        }),
        o: common_vendor.t(aboutData.service_phone),
        p: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        q: common_vendor.o(handleCall, "6b")
      } : {}, {
        r: aboutData.business_email
      }, aboutData.business_email ? {
        s: common_vendor.p({
          type: "email",
          size: "18",
          color: "#64748b"
        }),
        t: common_vendor.t(aboutData.business_email),
        v: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        w: common_vendor.o(($event) => handleCopy("business_email"), "a8")
      } : {}, {
        x: aboutData.support_email
      }, aboutData.support_email ? {
        y: common_vendor.p({
          type: "help",
          size: "18",
          color: "#64748b"
        }),
        z: common_vendor.t(aboutData.support_email),
        A: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        B: common_vendor.o(($event) => handleCopy("support_email"), "a9")
      } : {}, {
        C: aboutData.company_address
      }, aboutData.company_address ? {
        D: common_vendor.p({
          type: "location",
          size: "18",
          color: "#64748b"
        }),
        E: common_vendor.t(aboutData.company_address)
      } : {}) : {}, {
        F: common_vendor.p({
          type: "star",
          size: "20",
          color: "#2c62ef"
        }),
        G: common_vendor.p({
          type: "weixin",
          size: "28",
          color: "#ffffff"
        }),
        H: common_vendor.o(($event) => openSocial("wechat"), "37"),
        I: common_vendor.p({
          type: "weibo",
          size: "28",
          color: "#ffffff"
        }),
        J: common_vendor.o(($event) => openSocial("weibo"), "33"),
        K: common_vendor.p({
          type: "videocam",
          size: "28",
          color: "#ffffff"
        }),
        L: common_vendor.o(($event) => openSocial("douyin"), "9a"),
        M: common_vendor.p({
          type: "heart",
          size: "28",
          color: "#ffffff"
        }),
        N: common_vendor.o(($event) => openSocial("xiaohongshu"), "cd"),
        O: aboutData.business_license || aboutData.icp_number || aboutData.user_agreement || aboutData.privacy_policy || aboutData.child_privacy_policy
      }, aboutData.business_license || aboutData.icp_number || aboutData.user_agreement || aboutData.privacy_policy || aboutData.child_privacy_policy ? common_vendor.e({
        P: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#2c62ef"
        }),
        Q: aboutData.business_license
      }, aboutData.business_license ? {
        R: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        S: common_vendor.o(($event) => openProtocolModal("license"), "d6")
      } : {}, {
        T: aboutData.icp_number
      }, aboutData.icp_number ? {
        U: common_vendor.t(aboutData.icp_number),
        V: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        W: common_vendor.o(($event) => openProtocolModal("icp"), "a0")
      } : {}, {
        X: aboutData.user_agreement
      }, aboutData.user_agreement ? {
        Y: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        Z: common_vendor.o(($event) => openProtocolModal("user"), "e9")
      } : {}, {
        aa: aboutData.privacy_policy
      }, aboutData.privacy_policy ? {
        ab: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        ac: common_vendor.o(($event) => openProtocolModal("privacy"), "5f")
      } : {}, {
        ad: aboutData.child_privacy_policy
      }, aboutData.child_privacy_policy ? {
        ae: common_vendor.p({
          type: "right",
          size: "14",
          color: "#cbd5e1"
        }),
        af: common_vendor.o(($event) => openProtocolModal("child"), "81")
      } : {}) : {}, {
        ag: aboutData.copyright_text || aboutData.company_full_name
      }, aboutData.copyright_text || aboutData.company_full_name ? common_vendor.e({
        ah: aboutData.copyright_text
      }, aboutData.copyright_text ? {
        ai: common_vendor.t(aboutData.copyright_text)
      } : {}, {
        aj: aboutData.company_full_name
      }, aboutData.company_full_name ? {
        ak: common_vendor.t(aboutData.company_full_name)
      } : {}) : {}, {
        al: showQrcodeModal.value
      }, showQrcodeModal.value ? common_vendor.e({
        am: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#8599b0"
        }),
        an: common_vendor.o(closeQrcodeModal, "b8"),
        ao: aboutData.wechat_qrcode || defaultQrcode,
        ap: aboutData.wechat_account
      }, aboutData.wechat_account ? {
        aq: common_vendor.t(aboutData.wechat_account)
      } : {}, {
        ar: common_vendor.o(closeQrcodeModal, "30"),
        as: common_vendor.o(() => {
        }, "5d"),
        at: common_vendor.o(closeQrcodeModal, "70")
      }) : {}, {
        av: showLicenseModal.value
      }, showLicenseModal.value ? {
        aw: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#8599b0"
        }),
        ax: common_vendor.o(closeLicenseModal, "da"),
        ay: aboutData.business_license,
        az: common_vendor.o(closeLicenseModal, "9e"),
        aA: common_vendor.o(() => {
        }, "21"),
        aB: common_vendor.o(closeLicenseModal, "07")
      } : {}, {
        aC: showProtocolModal.value
      }, showProtocolModal.value ? {
        aD: common_vendor.t(protocolModalTitle.value),
        aE: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#8599b0"
        }),
        aF: common_vendor.o(closeProtocolModal, "01"),
        aG: common_vendor.t(protocolModalContent.value),
        aH: common_vendor.o(closeProtocolModal, "b7"),
        aI: common_vendor.o(() => {
        }, "47"),
        aJ: common_vendor.o(closeProtocolModal, "dc")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-13a78ac6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/about/about.js.map
