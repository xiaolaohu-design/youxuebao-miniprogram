"use strict";
const common_vendor = require("../../common/vendor.js");
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
  __name: "register",
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
      phone: "",
      smsCode: "",
      password: "",
      confirmPassword: "",
      agree: false
    });
    const codeTime = common_vendor.ref(0);
    const codeBtnText = common_vendor.ref("获取验证码");
    const canGetCode = common_vendor.ref(false);
    const smsUuid = common_vendor.ref("");
    const isSendingSms = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const isSubmitting = common_vendor.ref(false);
    const isWechatLogging = common_vendor.ref(false);
    const showAgreement = common_vendor.ref(false);
    const currentAgreement = common_vendor.reactive({
      title: "",
      content: ""
    });
    const agreementsMap = common_vendor.ref({});
    let timerId = null;
    const isRegisterDisabled = common_vendor.computed(() => {
      return !(formData.phone.length === 11 && formData.smsCode && formData.password && formData.confirmPassword);
    });
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
        return "操作失败：未知错误";
      if (response.data && response.data.message)
        return response.data.message;
      if (response.message)
        return response.message;
      return "操作失败：未知错误";
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
        pixelRatio: systemInfo.pixelRatio
      };
    };
    const handlePhoneInput = (event) => {
      const value = event.detail.value;
      formData.phone = value;
      canGetCode.value = value.length === 11;
    };
    const fetchAgreements = async () => {
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const response = await api_login.getPublishedAgreements(shopId);
        if ((response == null ? void 0 : response.status) === "success" && response.data) {
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
    const handleSendSmsCode = async () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意相关协议",
          icon: "none"
        });
        return;
      }
      if (!canGetCode.value) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号",
          icon: "none"
        });
        return;
      }
      if (codeTime.value > 0) {
        common_vendor.index.showToast({
          title: `请${codeTime.value}秒后再试`,
          icon: "none"
        });
        return;
      }
      if (isSendingSms.value)
        return;
      isSendingSms.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const smsFormData = {
          UXMID: shopId,
          phone: formData.phone,
          type: "register",
          method: "register"
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
    const handleRegisterSubmit = async () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意相关协议",
          icon: "none"
        });
        return;
      }
      if (formData.phone.length !== 11) {
        common_vendor.index.showToast({
          title: "请输入11位手机号",
          icon: "none"
        });
        return;
      }
      if (!smsUuid.value) {
        common_vendor.index.showToast({
          title: "请先获取验证码",
          icon: "none"
        });
        return;
      }
      if (formData.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码长度不能少于6位",
          icon: "none"
        });
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        common_vendor.index.showToast({
          title: "两次输入的密码不一致",
          icon: "none"
        });
        return;
      }
      isSubmitting.value = true;
      try {
        const shopId = common_vendor.index.getStorageSync("shopId");
        const deviceInfo = getDeviceInfo();
        const registerTime = formatLoginTime();
        const registerData = {
          phone: formData.phone,
          password: formData.password,
          captcha: formData.smsCode,
          uuid: smsUuid.value,
          UXMID: shopId,
          deviceType: "MiniProgram",
          deviceInfo: JSON.stringify(deviceInfo),
          browserInfo: JSON.stringify(deviceInfo),
          registerTime,
          type: "register"
        };
        const response = await api_login.registerAccount(registerData);
        if ((response == null ? void 0 : response.status) === "success") {
          if (response.UXFID && response.UXFKEY) {
            common_vendor.index.setStorageSync("UXFID", response.UXFID);
            common_vendor.index.setStorageSync("UXFKEY", response.UXFKEY);
          }
          common_vendor.index.showToast({
            title: response.message || "注册成功",
            icon: "success",
            duration: 1500,
            success: () => {
              cleanupTimer();
              setTimeout(() => {
                common_vendor.index.switchTab({
                  url: "/pages/login/login"
                });
              }, 1500);
            }
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
        isSubmitting.value = false;
      }
    };
    const handleWechatRegister = () => {
      if (!formData.agree) {
        common_vendor.index.showToast({
          title: "请阅读并同意相关协议",
          icon: "none"
        });
        return;
      }
      if (isWechatLogging.value)
        return;
      common_vendor.index.getUserProfile({
        desc: "用于完善会员资料",
        success: (profileRes) => {
          const userInfo = profileRes.userInfo;
          isWechatLogging.value = true;
          common_vendor.index.login({
            provider: "weixin",
            success: (loginRes) => {
              if (loginRes.code) {
                const shopId = common_vendor.index.getStorageSync("shopId");
                const deviceInfo = getDeviceInfo();
                const loginTime = formatLoginTime();
                const formData2 = {
                  code: loginRes.code,
                  UXMID: shopId,
                  deviceInfo: JSON.stringify(deviceInfo),
                  loginTime,
                  nickname: userInfo.nickName,
                  avatar: userInfo.avatarUrl,
                  gender: userInfo.gender
                };
                api_login.loginByWechat(formData2).then((response) => {
                  if ((response == null ? void 0 : response.status) === "success") {
                    if (response.UXFID && response.UXFKEY) {
                      common_vendor.index.setStorageSync("UXFID", response.UXFID);
                      common_vendor.index.setStorageSync("UXFKEY", response.UXFKEY);
                    }
                    common_vendor.index.showToast({
                      title: response.message || "注册成功",
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
                  } else {
                    const errorMessage = extractResponseErrorMessage(
                      response
                    );
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
        },
        fail: () => {
        }
      });
    };
    const handleBack = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index",
        fail: () => {
          common_vendor.index.navigateBack();
        }
      });
    };
    const handleGoToLogin = () => {
      cleanupTimer();
      common_vendor.index.navigateTo({
        url: "/pages/login/login",
        fail: () => {
          common_vendor.index.switchTab({
            url: "/pages/index/index"
          });
        }
      });
    };
    const cleanupTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };
    common_vendor.onMounted(() => {
      fetchAgreements();
    });
    common_vendor.onUnmounted(() => {
      cleanupTimer();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBack, "f7"),
        b: common_vendor.o(handleGoToLogin, "ac"),
        c: !isLoading.value
      }, !isLoading.value ? {
        d: common_vendor.o([($event) => formData.phone = $event.detail.value, handlePhoneInput], "0f"),
        e: formData.phone,
        f: formData.smsCode,
        g: common_vendor.o(($event) => formData.smsCode = $event.detail.value, "13"),
        h: common_vendor.t(codeBtnText.value),
        i: common_vendor.o(handleSendSmsCode, "14"),
        j: common_vendor.s(canGetCode.value ? "color: #2C62EF;" : "color: #C9C9C9;"),
        k: formData.password,
        l: common_vendor.o(($event) => formData.password = $event.detail.value, "3b"),
        m: formData.confirmPassword,
        n: common_vendor.o(($event) => formData.confirmPassword = $event.detail.value, "3b")
      } : {}, {
        o: isRegisterDisabled.value ? 1 : "",
        p: isSubmitting.value,
        q: common_vendor.o(handleRegisterSubmit, "be"),
        r: formData.agree
      }, formData.agree ? {} : {}, {
        s: formData.agree ? 1 : "",
        t: common_vendor.o(handleToggleAgree, "32"),
        v: common_vendor.o(($event) => handleViewAgreement("user_agreement"), "1d"),
        w: common_vendor.o(($event) => handleViewAgreement("privacy_policy"), "4d"),
        x: common_vendor.p({
          type: "weixin",
          size: "44",
          color: "#07C160"
        }),
        y: common_vendor.o(handleWechatRegister, "5a"),
        z: isWechatLogging.value,
        A: showAgreement.value
      }, showAgreement.value ? {
        B: common_vendor.t(currentAgreement.title),
        C: common_vendor.o(closeAgreement, "59"),
        D: currentAgreement.content,
        E: common_vendor.o(closeAgreement, "d7"),
        F: common_vendor.o(() => {
        }, "82"),
        G: common_vendor.o(closeAgreement, "71")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-838b72c9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/register.js.map
