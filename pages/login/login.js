"use strict";
const common_vendor = require("../../common/vendor.js");
const api_captcha = require("../../api/captcha.js");
const api_login = require("../../api/login.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const formatLoginTime = () => {
      const now = /* @__PURE__ */ new Date();
      const pad = (num) => String(num).padStart(2, "0");
      const year = now.getFullYear();
      const month = pad(now.getMonth() + 1);
      const day = pad(now.getDate());
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    };
    const formData = common_vendor.reactive({
      username: "",
      password: "",
      captcha: "",
      agree: false
    });
    const loginType = common_vendor.ref("captcha");
    const isPasswordMode = common_vendor.computed(() => loginType.value === "password");
    const isLoading = common_vendor.ref(false);
    const isSubmitting = common_vendor.ref(false);
    const isWechatLogging = common_vendor.ref(false);
    const captchaImage = common_vendor.ref("");
    const captchaUuid = common_vendor.ref("");
    const codeTime = common_vendor.ref(0);
    const codeBtnText = common_vendor.ref("获取验证码");
    const canGetCode = common_vendor.ref(false);
    const smsUuid = common_vendor.ref("");
    const isSendingSms = common_vendor.ref(false);
    const showAgreement = common_vendor.ref(false);
    const currentAgreement = common_vendor.reactive({
      title: "",
      content: ""
    });
    const agreementsMap = common_vendor.ref({});
    const isLoginDisabled = common_vendor.computed(() => {
      if (isPasswordMode.value) {
        return !formData.username || !formData.password || !formData.captcha;
      }
      return !formData.username || !formData.password;
    });
    let timerId = null;
    const extractErrorMessage = (error) => {
      if (!error)
        return "操作失败，请稍后重试";
      if (error.message && typeof error.message === "string")
        return error.message;
      if (error.data && error.data.message && typeof error.data.message === "string")
        return error.data.message;
      if (typeof error === "string")
        return error;
      return "操作失败，请稍后重试";
    };
    const extractResponseErrorMessage = (response) => {
      if (!response)
        return "登录失败：未知错误";
      if (response.data && response.data.message)
        return response.data.message;
      if (response.message)
        return response.message;
      return "登录失败：未知错误";
    };
    const fetchAndUpdateCaptcha = async () => {
      try {
        const response = await api_captcha.fetchCaptchaData();
        if (response) {
          captchaImage.value = response.captchaImage || response.img || "";
          captchaUuid.value = response.captchaUuid || response.uuid || "";
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取验证码失败",
          icon: "none"
        });
      }
    };
    const refreshCaptcha = () => {
      formData.captcha = "";
      fetchAndUpdateCaptcha();
    };
    const fetchAgreements = async () => {
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const response = await api_login.getPublishedAgreements(shopId);
        if (response && response.status === "success" && response.data) {
          const {
            list
          } = response.data;
          const map = {};
          list.forEach((item) => {
            if (!map[item.type] && item.is_published === 1) {
              map[item.type] = {
                title: item.title,
                content: item.content,
                type: item.type,
                type_name: item.type_name,
                version: item.version
              };
            }
          });
          agreementsMap.value = map;
        }
      } catch (error) {
      }
    };
    const sendSmsCode = async () => {
      if (isSendingSms.value)
        return;
      isSendingSms.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const smsFormData = {
          UXMID: shopId,
          phone: formData.username,
          type: "login",
          method: "login"
        };
        const response = await api_login.sendSmsAuthCode(smsFormData);
        if ((response == null ? void 0 : response.status) === "success") {
          smsUuid.value = response.uuid;
          startCountdown();
          common_vendor.index.showToast({
            title: "验证码已发送到手机，请查收",
            icon: "success"
          });
        } else {
          const errorMessage = extractResponseErrorMessage(response);
          common_vendor.index.showToast({
            title: errorMessage,
            icon: "none",
            duration: 2e3
          });
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        common_vendor.index.showToast({
          title: errorMessage,
          icon: "none",
          duration: 2e3
        });
      } finally {
        isSendingSms.value = false;
      }
    };
    const getDeviceInfo = () => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      return {
        platform: systemInfo.platform,
        model: systemInfo.model,
        brand: systemInfo.brand,
        system: systemInfo.system,
        version: systemInfo.version,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        windowWidth: systemInfo.windowWidth,
        windowHeight: systemInfo.windowHeight,
        statusBarHeight: systemInfo.statusBarHeight,
        language: systemInfo.language,
        fontSizeSetting: systemInfo.fontSizeSetting,
        pixelRatio: systemInfo.pixelRatio
      };
    };
    const getWechatCode = () => {
      return new Promise((resolve) => {
        common_vendor.index.login({
          provider: "weixin",
          success: (res) => {
            resolve(res.code || "");
          },
          fail: () => {
            resolve("");
          }
        });
      });
    };
    const loginByPassword = async (wechatCode = "") => {
      const shopId = common_vendor.index.getStorageSync("shopId");
      const deviceInfo = getDeviceInfo();
      const loginTime = formatLoginTime();
      const loginData = {
        username: formData.username,
        password: formData.password,
        captcha: formData.captcha,
        captchaUuid: captchaUuid.value,
        UXMID: shopId,
        deviceInfo: JSON.stringify(deviceInfo),
        browserInfo: JSON.stringify(deviceInfo),
        loginTime,
        wechatCode
      };
      try {
        return await api_login.fetchLoginaccount(loginData);
      } catch (error) {
        if (error && error.data)
          throw error.data;
        throw error;
      }
    };
    const loginBySms = async (wechatCode = "") => {
      const shopId = common_vendor.index.getStorageSync("shopId");
      const deviceInfo = getDeviceInfo();
      const loginTime = formatLoginTime();
      const loginData = {
        phone: formData.username,
        captcha: formData.password,
        uuid: smsUuid.value,
        UXMID: shopId,
        deviceInfo: JSON.stringify(deviceInfo),
        browserInfo: JSON.stringify(deviceInfo),
        loginTime,
        type: "login",
        wechatCode
      };
      try {
        return await api_login.loginWithSmsCaptcha(loginData);
      } catch (error) {
        if (error && error.data)
          throw error.data;
        throw error;
      }
    };
    const handleLoginSuccess = (response) => {
      if (response.UXFID && response.UXFKEY) {
        common_vendor.index.setStorageSync("UXFID", response.UXFID);
        common_vendor.index.setStorageSync("UXFKEY", response.UXFKEY);
      }
      if (response.openid) {
        common_vendor.index.setStorageSync("wechat_openid", response.openid);
      }
      common_vendor.index.showToast({
        title: response.message || "登录成功",
        icon: "success",
        duration: 1500,
        success: () => {
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/index/index"
            });
          }, 1500);
        }
      });
    };
    const handleUsernameInput = (event) => {
      const value = event.detail.value;
      formData.username = value;
      canGetCode.value = value.length === 11;
    };
    const handleSwitchLoginType = (type) => {
      loginType.value = type;
      formData.username = "";
      formData.password = "";
      formData.captcha = "";
      smsUuid.value = "";
      codeTime.value = 0;
      codeBtnText.value = "获取验证码";
      canGetCode.value = false;
      if (type === "password") {
        fetchAndUpdateCaptcha();
      }
    };
    const handleGetSmsCode = () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请阅读并同意相关协议"
        });
        return;
      }
      if (!canGetCode.value) {
        common_vendor.index.showToast({
          icon: "none",
          title: "请输入正确的手机号"
        });
        return;
      }
      if (codeTime.value > 0) {
        common_vendor.index.showToast({
          icon: "none",
          title: `请${codeTime.value}秒后再试`
        });
        return;
      }
      sendSmsCode();
    };
    const startCountdown = () => {
      codeTime.value = 60;
      if (timerId)
        clearInterval(timerId);
      timerId = setInterval(() => {
        if (codeTime.value >= 1) {
          codeTime.value--;
          codeBtnText.value = `${codeTime.value}秒后重试`;
        } else {
          codeTime.value = 0;
          codeBtnText.value = "获取验证码";
          clearInterval(timerId);
          timerId = null;
        }
      }, 1e3);
    };
    const handleToggleAgree = () => {
      formData.agree = !formData.agree;
    };
    const handleViewAgreement = (type) => {
      const agreement = agreementsMap.value[type];
      if (agreement) {
        currentAgreement.title = agreement.title;
        currentAgreement.content = agreement.content;
        showAgreement.value = true;
      } else {
        common_vendor.index.showToast({
          title: "协议内容加载中，请稍后再试",
          icon: "none"
        });
        fetchAgreements();
      }
    };
    const closeAgreement = () => {
      showAgreement.value = false;
    };
    const handleForgetPassword = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/forget",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleWechatLogin = () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意相关协议",
          icon: "none"
        });
        return;
      }
      if (isWechatLogging.value)
        return;
      isWechatLogging.value = true;
      common_vendor.index.login({
        provider: "weixin",
        success: (loginRes) => {
          if (loginRes.code) {
            const shopId = common_vendor.index.getStorageSync("shopId");
            const deviceInfo = getDeviceInfo();
            const loginTime = formatLoginTime();
            const wxLoginData = {
              code: loginRes.code,
              UXMID: shopId,
              deviceInfo: JSON.stringify(deviceInfo),
              loginTime
            };
            api_login.loginByWechat(wxLoginData).then((response) => {
              if ((response == null ? void 0 : response.status) === "success") {
                handleLoginSuccess(response);
              } else {
                const errorMessage = extractResponseErrorMessage(response);
                common_vendor.index.showToast({
                  title: errorMessage,
                  icon: "none",
                  duration: 2e3
                });
              }
            }).catch((error) => {
              const errorMessage = extractErrorMessage(error);
              common_vendor.index.showToast({
                title: errorMessage,
                icon: "none",
                duration: 2e3
              });
            }).finally(() => {
              isWechatLogging.value = false;
            });
          } else {
            common_vendor.index.showToast({
              title: "获取微信授权失败",
              icon: "none"
            });
            isWechatLogging.value = false;
          }
        },
        fail: (err) => {
          var _a;
          if (!((_a = err.errMsg) == null ? void 0 : _a.includes("cancel"))) {
            common_vendor.index.showToast({
              title: "微信登录失败，请稍后重试",
              icon: "none"
            });
          }
          isWechatLogging.value = false;
        }
      });
    };
    const handleRegister = () => {
      common_vendor.index.navigateTo({
        url: "/pages/login/register",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleBack = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index",
        fail: () => {
          common_vendor.index.showToast({
            title: "页面跳转失败",
            icon: "none"
          });
        }
      });
    };
    const handleSubmit = async () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意相关协议",
          icon: "none"
        });
        return;
      }
      if (isLoginDisabled.value) {
        common_vendor.index.showToast({
          title: "请填写完整信息",
          icon: "none"
        });
        return;
      }
      if (!isPasswordMode.value && !smsUuid.value) {
        common_vendor.index.showToast({
          title: "请先获取验证码",
          icon: "none"
        });
        return;
      }
      isSubmitting.value = true;
      try {
        let response;
        if (isPasswordMode.value) {
          response = await loginByPassword("");
        } else {
          response = await loginBySms("");
        }
        if ((response == null ? void 0 : response.status) === "success") {
          if (response.openid) {
            common_vendor.index.setStorageSync("wechat_openid", response.openid);
          }
          if (!response.openid && !common_vendor.index.getStorageSync("wechat_openid")) {
            try {
              const wechatCode = await getWechatCode();
              if (wechatCode) {
                const shopId = common_vendor.index.getStorageSync("shopId");
                common_vendor.index.request({
                  url: "/api/front/login/bind-wechat",
                  method: "POST",
                  data: {
                    code: wechatCode,
                    UXMID: shopId
                  },
                  header: {
                    "Authorization": "Bearer " + response.UXFID,
                    "Content-Type": "application/json"
                  }
                });
              }
            } catch (e) {
            }
          }
          handleLoginSuccess(response);
        } else {
          const errorMessage = extractResponseErrorMessage(response);
          common_vendor.index.showToast({
            title: errorMessage,
            icon: "none",
            duration: 2e3
          });
          if (isPasswordMode.value)
            refreshCaptcha();
        }
      } catch (error) {
        const errorMessage = extractErrorMessage(error);
        common_vendor.index.showToast({
          title: errorMessage,
          icon: "none",
          duration: 2e3
        });
        if (isPasswordMode.value)
          refreshCaptcha();
      } finally {
        isSubmitting.value = false;
      }
    };
    const cleanupTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };
    common_vendor.onMounted(() => {
      fetchAndUpdateCaptcha();
      fetchAgreements();
    });
    common_vendor.onUnmounted(() => {
      cleanupTimer();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBack, "cf"),
        b: common_vendor.o(handleRegister, "5c"),
        c: common_vendor.o(($event) => handleSwitchLoginType("captcha"), "d6"),
        d: loginType.value === "captcha" ? 1 : "",
        e: common_vendor.o(($event) => handleSwitchLoginType("password"), "dd"),
        f: loginType.value === "password" ? 1 : "",
        g: !isLoading.value
      }, !isLoading.value ? common_vendor.e({
        h: isPasswordMode.value
      }, isPasswordMode.value ? common_vendor.e({
        i: formData.username,
        j: common_vendor.o(($event) => formData.username = $event.detail.value, "6e"),
        k: formData.password,
        l: common_vendor.o(($event) => formData.password = $event.detail.value, "f4"),
        m: formData.captcha,
        n: common_vendor.o(($event) => formData.captcha = $event.detail.value, "e3"),
        o: captchaImage.value
      }, captchaImage.value ? {
        p: captchaImage.value,
        q: common_vendor.o(refreshCaptcha, "bd")
      } : {
        r: common_vendor.o(refreshCaptcha, "cf")
      }) : {
        s: common_vendor.o([($event) => formData.username = $event.detail.value, handleUsernameInput], "61"),
        t: formData.username,
        v: formData.password,
        w: common_vendor.o(($event) => formData.password = $event.detail.value, "93"),
        x: common_vendor.t(codeBtnText.value),
        y: common_vendor.o(handleGetSmsCode, "ac"),
        z: common_vendor.s(canGetCode.value ? "color: #2C62EF;" : "color: #C9C9C9;")
      }) : {}, {
        A: isLoginDisabled.value ? 1 : "",
        B: common_vendor.o(handleSubmit, "4a"),
        C: isSubmitting.value,
        D: isPasswordMode.value,
        E: common_vendor.o(handleForgetPassword, "9d"),
        F: formData.agree
      }, formData.agree ? {} : {}, {
        G: formData.agree ? 1 : "",
        H: common_vendor.o(handleToggleAgree, "89"),
        I: common_vendor.o(($event) => handleViewAgreement("user_agreement"), "9d"),
        J: common_vendor.o(($event) => handleViewAgreement("privacy_policy"), "0f"),
        K: common_vendor.p({
          type: "weixin",
          size: "44",
          color: "#07C160"
        }),
        L: common_vendor.o(handleWechatLogin, "e7"),
        M: isWechatLogging.value,
        N: showAgreement.value
      }, showAgreement.value ? {
        O: common_vendor.t(currentAgreement.title),
        P: common_vendor.o(closeAgreement, "33"),
        Q: currentAgreement.content,
        R: common_vendor.o(closeAgreement, "7c"),
        S: common_vendor.o(() => {
        }, "c2"),
        T: common_vendor.o(closeAgreement, "54")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
