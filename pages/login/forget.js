"use strict";
const common_vendor = require("../../common/vendor.js");
const api_login = require("../../api/login.js");
const _sfc_main = {
  __name: "forget",
  setup(__props) {
    const formData = common_vendor.reactive({
      username: "",
      phone: "",
      smsCode: "",
      password: "",
      confirmPassword: ""
    });
    const codeTime = common_vendor.ref(0);
    const codeBtnText = common_vendor.ref("获取验证码");
    const canGetCode = common_vendor.ref(false);
    const smsUuid = common_vendor.ref("");
    const isSendingSms = common_vendor.ref(false);
    const isLoading = common_vendor.ref(false);
    const isSubmitting = common_vendor.ref(false);
    let timerId = null;
    const isResetDisabled = common_vendor.computed(() => {
      const usernameValid = /^[a-zA-Z0-9_]{8,16}$/.test(formData.username);
      const phoneValid = /^1[3-9]\d{9}$/.test(formData.phone);
      const passwordValid = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(formData.password);
      return !(usernameValid && phoneValid && formData.smsCode && passwordValid && formData.password === formData.confirmPassword);
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
    const handlePhoneInput = (event) => {
      const value = event.detail.value;
      formData.phone = value;
      const usernameValid = /^[a-zA-Z0-9_]{8,16}$/.test(formData.username);
      const phoneValid = value.length === 11;
      canGetCode.value = usernameValid && phoneValid;
    };
    const handleSendSmsCode = async () => {
      if (!/^[a-zA-Z0-9_]{8,16}$/.test(formData.username)) {
        common_vendor.index.showToast({
          title: "请输入正确的用户名（8-16位字母、数字或下划线）",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
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
          username: formData.username,
          phone: formData.phone,
          type: "resetPassword",
          method: "resetPassword"
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
    const handleResetPassword = async () => {
      if (!/^[a-zA-Z0-9_]{8,16}$/.test(formData.username)) {
        common_vendor.index.showToast({
          title: "请输入正确的用户名（8-16位字母、数字或下划线）",
          icon: "none",
          duration: 2e3
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
      if (!/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/.test(formData.password)) {
        common_vendor.index.showToast({
          title: "密码需包含大小写字母、数字和特殊字符，8到16位",
          icon: "none",
          duration: 2500
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
        const resetData = {
          UXMID: shopId,
          username: formData.username,
          phone: formData.phone,
          new_password: formData.password,
          captcha: formData.smsCode,
          uuid: smsUuid.value,
          type: "resetPassword"
        };
        const response = await api_login.resetPassword(resetData);
        if ((response == null ? void 0 : response.status) === "success") {
          common_vendor.index.showToast({
            title: response.message || "密码重置成功",
            icon: "success",
            duration: 1500,
            success: () => {
              cleanupTimer();
              smsUuid.value = "";
              setTimeout(() => {
                common_vendor.index.redirectTo({
                  url: "/pages/login/login"
                });
              }, 1500);
            }
          });
        } else if ((response == null ? void 0 : response.status) === "warning") {
          common_vendor.index.showToast({
            title: response.message || "密码未修改",
            icon: "none",
            duration: 2e3
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
      common_vendor.index.redirectTo({
        url: "/pages/login/login"
      });
    };
    const handleGoToRegister = () => {
      cleanupTimer();
      common_vendor.index.redirectTo({
        url: "/pages/login/register"
      });
    };
    const cleanupTimer = () => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    };
    common_vendor.onUnmounted(() => {
      cleanupTimer();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleBack, "1f"),
        b: common_vendor.o(handleGoToLogin, "aa"),
        c: !isLoading.value
      }, !isLoading.value ? {
        d: formData.username,
        e: common_vendor.o(($event) => formData.username = $event.detail.value, "31"),
        f: common_vendor.o([($event) => formData.phone = $event.detail.value, handlePhoneInput], "0f"),
        g: formData.phone,
        h: formData.smsCode,
        i: common_vendor.o(($event) => formData.smsCode = $event.detail.value, "54"),
        j: common_vendor.t(codeBtnText.value),
        k: common_vendor.o(handleSendSmsCode, "3b"),
        l: common_vendor.s(canGetCode.value ? "color: #2C62EF;" : "color: #C9C9C9;"),
        m: formData.password,
        n: common_vendor.o(($event) => formData.password = $event.detail.value, "74"),
        o: formData.confirmPassword,
        p: common_vendor.o(($event) => formData.confirmPassword = $event.detail.value, "6b")
      } : {}, {
        q: isResetDisabled.value ? 1 : "",
        r: isSubmitting.value,
        s: common_vendor.o(handleResetPassword, "15"),
        t: common_vendor.o(handleGoToLogin, "0e"),
        v: common_vendor.o(handleGoToRegister, "41")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-79044ba6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/forget.js.map
