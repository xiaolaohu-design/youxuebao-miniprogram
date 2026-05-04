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
const _sfc_main = {
  __name: "setting",
  setup(__props) {
    const userInfo = common_vendor.ref({
      nickname: "",
      username: "",
      fullPhone: "",
      mobile: ""
    });
    const shopId = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const uxfid = common_vendor.ref("");
    const showNicknameModal = common_vendor.ref(false);
    const showVerificationModal = common_vendor.ref(false);
    const showChangePhoneModal = common_vendor.ref(false);
    const showNewPasswordModal = common_vendor.ref(false);
    const newNickname = common_vendor.ref("");
    const nicknameFocus = common_vendor.ref(false);
    const modalTitle = common_vendor.ref("验证身份");
    const displayPhone = common_vendor.ref("");
    const verificationCode = common_vendor.ref("");
    const modalTip = common_vendor.ref("");
    const inputFocus = common_vendor.ref(false);
    const codeCountdown = common_vendor.ref(0);
    const codeSending = common_vendor.ref(false);
    const captchaUuid = common_vendor.ref("");
    let countdownTimer = null;
    const verifyCallback = common_vendor.ref(null);
    const newPhone = common_vendor.ref("");
    const newPhoneCode = common_vendor.ref("");
    const newPhoneModalTip = common_vendor.ref("");
    const newPhoneFocus = common_vendor.ref(false);
    const newPhoneCodeCountdown = common_vendor.ref(0);
    const newPhoneCodeSending = common_vendor.ref(false);
    const newPhoneCaptchaUuid = common_vendor.ref("");
    let newPhoneCountdownTimer = null;
    const newPhoneValid = common_vendor.computed(() => {
      const phone = newPhone.value.trim();
      return phone.length === 11 && /^1[3-9]\d{9}$/.test(phone);
    });
    const newPassword = common_vendor.ref("");
    const confirmPassword = common_vendor.ref("");
    const showPassword = common_vendor.ref(false);
    const showConfirmPassword = common_vendor.ref(false);
    const maskedPhone = common_vendor.computed(() => {
      const phone = userInfo.value.fullPhone || userInfo.value.mobile;
      if (!phone)
        return "未设置";
      return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    });
    const checkLoginStatus = () => {
      const fid = common_vendor.index.getStorageSync("UXFID");
      const fkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      if (!fid || !fkey || !shopid) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }, 100);
        return false;
      }
      uxfid.value = fid;
      userId.value = fkey;
      shopId.value = shopid;
      return true;
    };
    const validatePassword = (password) => {
      if (password.length < 6 || password.length > 20) {
        common_vendor.index.showToast({
          title: "密码长度应为6-20位",
          icon: "none"
        });
        return false;
      }
      const hasNumber = /\d/.test(password);
      const hasLetter = /[a-zA-Z]/.test(password);
      if (!hasNumber || !hasLetter) {
        common_vendor.index.showToast({
          title: "密码必须包含字母和数字",
          icon: "none"
        });
        return false;
      }
      return true;
    };
    const fetchUserInfo = async () => {
      if (!shopId.value || !userId.value || !uxfid.value)
        return;
      try {
        const res = await api_index.getMemberData({
          UXMID: shopId.value,
          user_id: userId.value
        });
        if (res.status === "success" && res.data) {
          userInfo.value = {
            nickname: res.data.username || "",
            username: res.data.username || "",
            fullPhone: res.data.mobile || "",
            mobile: res.data.mobile || ""
          };
        }
      } catch (error) {
      }
    };
    const closeNicknameModal = () => {
      showNicknameModal.value = false;
      newNickname.value = "";
      nicknameFocus.value = false;
    };
    const confirmNickname = async () => {
      const nickname = newNickname.value.trim();
      if (!nickname) {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "none"
        });
        return;
      }
      if (nickname.length > 20) {
        common_vendor.index.showToast({
          title: "昵称不能超过20个字符",
          icon: "none"
        });
        return;
      }
      if (nickname === (userInfo.value.nickname || userInfo.value.username || "")) {
        common_vendor.index.showToast({
          title: "昵称未作修改",
          icon: "none"
        });
        return;
      }
      if (!checkLoginStatus())
        return;
      common_vendor.index.showLoading({
        title: "修改中...",
        mask: true
      });
      try {
        const res = await api_index.editMemberData({
          UXMID: shopId.value,
          user_id: userId.value,
          username: nickname
        });
        if (res.status === "success") {
          userInfo.value.nickname = nickname;
          userInfo.value.username = nickname;
          closeNicknameModal();
          common_vendor.index.showToast({
            title: "昵称修改成功",
            icon: "success"
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "修改失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const closeVerificationModal = () => {
      showVerificationModal.value = false;
      verificationCode.value = "";
      modalTip.value = "";
      inputFocus.value = false;
      captchaUuid.value = "";
      if (countdownTimer) {
        clearInterval(countdownTimer);
        countdownTimer = null;
      }
      codeCountdown.value = 0;
      codeSending.value = false;
    };
    const handleGetCode = async () => {
      if (codeCountdown.value > 0 || codeSending.value)
        return;
      if (!checkLoginStatus())
        return;
      codeSending.value = true;
      try {
        const res = await api_index.sendSmsCaptcha({
          UXMID: shopId.value,
          user_id: userId.value,
          phone: userInfo.value.fullPhone || userInfo.value.mobile,
          type: "binding",
          method: "old"
        });
        if (res.status === "success") {
          captchaUuid.value = res.uuid || "";
          codeCountdown.value = 60;
          countdownTimer = setInterval(() => {
            if (codeCountdown.value > 0) {
              codeCountdown.value--;
            } else {
              clearInterval(countdownTimer);
              countdownTimer = null;
            }
          }, 1e3);
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
        } else {
          modalTip.value = res.message || "发送失败，请稍后重试";
        }
      } catch (error) {
        modalTip.value = "网络请求失败，请稍后重试";
      } finally {
        codeSending.value = false;
      }
    };
    const handleVerifyCode = async () => {
      const code = verificationCode.value.trim();
      if (code.length !== 6) {
        modalTip.value = "请输入6位验证码";
        return;
      }
      if (!checkLoginStatus())
        return;
      common_vendor.index.showLoading({
        title: "验证中...",
        mask: true
      });
      try {
        const res = await api_index.verifySmsCaptchaInternal({
          UXMID: shopId.value,
          user_id: userId.value,
          phone: userInfo.value.fullPhone || userInfo.value.mobile,
          uuid: captchaUuid.value,
          captcha: code,
          type: "binding"
        });
        if (res.status === "success") {
          closeVerificationModal();
          if (verifyCallback.value) {
            setTimeout(() => verifyCallback.value(), 300);
          }
        } else {
          modalTip.value = res.message || "验证码错误";
        }
      } catch (error) {
        modalTip.value = "验证失败，请稍后重试";
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const closeChangePhoneModal = () => {
      showChangePhoneModal.value = false;
      newPhone.value = "";
      newPhoneCode.value = "";
      newPhoneModalTip.value = "";
      newPhoneFocus.value = false;
      newPhoneCaptchaUuid.value = "";
      if (newPhoneCountdownTimer) {
        clearInterval(newPhoneCountdownTimer);
        newPhoneCountdownTimer = null;
      }
      newPhoneCodeCountdown.value = 0;
      newPhoneCodeSending.value = false;
    };
    const handleGetNewPhoneCode = async () => {
      if (newPhoneCodeCountdown.value > 0 || newPhoneCodeSending.value)
        return;
      if (!newPhoneValid.value) {
        newPhoneModalTip.value = "请输入正确的手机号码";
        return;
      }
      if (!checkLoginStatus())
        return;
      newPhoneCodeSending.value = true;
      try {
        const res = await api_index.sendSmsCaptcha({
          UXMID: shopId.value,
          user_id: userId.value,
          phone: newPhone.value.trim(),
          type: "binding",
          method: "new"
        });
        if (res.status === "success") {
          newPhoneCaptchaUuid.value = res.uuid || "";
          newPhoneCodeCountdown.value = 60;
          newPhoneCountdownTimer = setInterval(() => {
            if (newPhoneCodeCountdown.value > 0) {
              newPhoneCodeCountdown.value--;
            } else {
              clearInterval(newPhoneCountdownTimer);
              newPhoneCountdownTimer = null;
            }
          }, 1e3);
          common_vendor.index.showToast({
            title: "验证码已发送",
            icon: "success"
          });
        } else {
          newPhoneModalTip.value = res.message || "发送失败";
        }
      } catch (error) {
        newPhoneModalTip.value = "网络请求失败";
      } finally {
        newPhoneCodeSending.value = false;
      }
    };
    const confirmChangePhone = async () => {
      const phone = newPhone.value.trim();
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        newPhoneModalTip.value = "请输入正确的手机号码";
        return;
      }
      const code = newPhoneCode.value.trim();
      if (code.length !== 6) {
        newPhoneModalTip.value = "请输入6位验证码";
        return;
      }
      if (!checkLoginStatus())
        return;
      common_vendor.index.showLoading({
        title: "修改中...",
        mask: true
      });
      try {
        const res = await api_index.verifyAndUpdatePhone({
          UXMID: shopId.value,
          user_id: userId.value,
          phone,
          uuid: newPhoneCaptchaUuid.value,
          captcha: code,
          type: "binding"
        });
        if (res.status === "success") {
          closeChangePhoneModal();
          await fetchUserInfo();
          common_vendor.index.showToast({
            title: "手机号修改成功",
            icon: "success"
          });
        } else {
          newPhoneModalTip.value = res.message || "修改失败";
        }
      } catch (error) {
        newPhoneModalTip.value = "网络请求失败";
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const closeNewPasswordModal = () => {
      showNewPasswordModal.value = false;
      newPassword.value = "";
      confirmPassword.value = "";
      showPassword.value = false;
      showConfirmPassword.value = false;
    };
    const confirmNewPassword = async () => {
      const password = newPassword.value.trim();
      const confirmPwd = confirmPassword.value.trim();
      if (!validatePassword(password))
        return;
      if (password !== confirmPwd) {
        common_vendor.index.showToast({
          title: "两次密码输入不一致",
          icon: "none"
        });
        return;
      }
      if (!checkLoginStatus())
        return;
      common_vendor.index.showLoading({
        title: "修改中...",
        mask: true
      });
      try {
        const res = await api_index.editMemberData({
          UXMID: shopId.value,
          user_id: userId.value,
          password
        });
        if (res.status === "success") {
          closeNewPasswordModal();
          common_vendor.index.showModal({
            title: "修改成功",
            content: "密码修改成功，请牢记新密码",
            showCancel: false,
            confirmText: "确定"
          });
        } else {
          common_vendor.index.showToast({
            title: res.message || "修改失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "网络请求失败",
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const handleChangeNickname = () => {
      newNickname.value = userInfo.value.nickname || userInfo.value.username || "";
      showNicknameModal.value = true;
      setTimeout(() => {
        nicknameFocus.value = true;
      }, 100);
    };
    const handleChangePhone = () => {
      modalTitle.value = "验证身份";
      displayPhone.value = maskedPhone.value;
      verifyCallback.value = () => {
        setTimeout(() => {
          showChangePhoneModal.value = true;
          setTimeout(() => {
            newPhoneFocus.value = true;
          }, 100);
        }, 300);
      };
      showVerificationModal.value = true;
      setTimeout(() => {
        inputFocus.value = true;
      }, 100);
    };
    const handleChangePassword = () => {
      modalTitle.value = "验证身份";
      displayPhone.value = maskedPhone.value;
      verifyCallback.value = () => {
        setTimeout(() => {
          showNewPasswordModal.value = true;
        }, 300);
      };
      showVerificationModal.value = true;
      setTimeout(() => {
        inputFocus.value = true;
      }, 100);
    };
    common_vendor.onMounted(() => {
      const fid = common_vendor.index.getStorageSync("UXFID");
      const fkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      uxfid.value = fid || "";
      userId.value = fkey || "";
      shopId.value = shopid || "";
      if (!fid || !fkey || !shopid) {
        checkLoginStatus();
        return;
      }
      fetchUserInfo();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "person-filled",
          size: "22",
          color: "#6366f1"
        }),
        b: common_vendor.t(userInfo.value.nickname || userInfo.value.username || "未设置"),
        c: common_vendor.p({
          type: "right",
          size: "14",
          color: "#c0c4cc"
        }),
        d: common_vendor.o(handleChangeNickname, "f4"),
        e: common_vendor.p({
          type: "phone-filled",
          size: "22",
          color: "#10b981"
        }),
        f: common_vendor.t(maskedPhone.value),
        g: common_vendor.p({
          type: "right",
          size: "14",
          color: "#c0c4cc"
        }),
        h: common_vendor.o(handleChangePhone, "0b"),
        i: common_vendor.p({
          type: "locked-filled",
          size: "22",
          color: "#f59e0b"
        }),
        j: common_vendor.p({
          type: "right",
          size: "14",
          color: "#c0c4cc"
        }),
        k: common_vendor.o(handleChangePassword, "88"),
        l: showNicknameModal.value
      }, showNicknameModal.value ? {
        m: common_vendor.o(closeNicknameModal, "cc"),
        n: nicknameFocus.value,
        o: newNickname.value,
        p: common_vendor.o(($event) => newNickname.value = $event.detail.value, "b9"),
        q: common_vendor.t(newNickname.value.length),
        r: common_vendor.o(closeNicknameModal, "d0"),
        s: common_vendor.o(confirmNickname, "67"),
        t: common_vendor.o(() => {
        }, "c6"),
        v: common_vendor.o(closeNicknameModal, "ce")
      } : {}, {
        w: showVerificationModal.value
      }, showVerificationModal.value ? common_vendor.e({
        x: common_vendor.t(modalTitle.value),
        y: common_vendor.o(closeVerificationModal, "1f"),
        z: common_vendor.t(displayPhone.value),
        A: inputFocus.value,
        B: verificationCode.value,
        C: common_vendor.o(($event) => verificationCode.value = $event.detail.value, "7a"),
        D: codeSending.value
      }, codeSending.value ? {} : codeCountdown.value > 0 ? {
        F: common_vendor.t(codeCountdown.value)
      } : {}, {
        E: codeCountdown.value > 0,
        G: common_vendor.o(handleGetCode, "94"),
        H: codeCountdown.value > 0 || codeSending.value ? 1 : "",
        I: modalTip.value
      }, modalTip.value ? {
        J: common_vendor.t(modalTip.value)
      } : {}, {
        K: common_vendor.o(closeVerificationModal, "b4"),
        L: common_vendor.o(handleVerifyCode, "10"),
        M: common_vendor.o(() => {
        }, "83"),
        N: common_vendor.o(closeVerificationModal, "d7")
      }) : {}, {
        O: showChangePhoneModal.value
      }, showChangePhoneModal.value ? common_vendor.e({
        P: common_vendor.o(closeChangePhoneModal, "01"),
        Q: newPhoneFocus.value,
        R: newPhone.value,
        S: common_vendor.o(($event) => newPhone.value = $event.detail.value, "9e"),
        T: newPhoneCode.value,
        U: common_vendor.o(($event) => newPhoneCode.value = $event.detail.value, "c7"),
        V: newPhoneCodeSending.value
      }, newPhoneCodeSending.value ? {} : newPhoneCodeCountdown.value > 0 ? {
        X: common_vendor.t(newPhoneCodeCountdown.value)
      } : {}, {
        W: newPhoneCodeCountdown.value > 0,
        Y: common_vendor.o(handleGetNewPhoneCode, "4e"),
        Z: newPhoneCodeCountdown.value > 0 || !newPhoneValid.value || newPhoneCodeSending.value ? 1 : "",
        aa: newPhoneModalTip.value
      }, newPhoneModalTip.value ? {
        ab: common_vendor.t(newPhoneModalTip.value)
      } : {}, {
        ac: common_vendor.o(closeChangePhoneModal, "4c"),
        ad: common_vendor.o(confirmChangePhone, "e7"),
        ae: common_vendor.o(() => {
        }, "a3"),
        af: common_vendor.o(closeChangePhoneModal, "ca")
      }) : {}, {
        ag: showNewPasswordModal.value
      }, showNewPasswordModal.value ? {
        ah: common_vendor.o(closeNewPasswordModal, "71"),
        ai: showPassword.value ? "text" : "password",
        aj: newPassword.value,
        ak: common_vendor.o(($event) => newPassword.value = $event.detail.value, "51"),
        al: common_vendor.p({
          type: showPassword.value ? "eye-filled" : "eye-slash-filled",
          size: "20",
          color: "#8599b0"
        }),
        am: common_vendor.o(($event) => showPassword.value = !showPassword.value, "87"),
        an: showConfirmPassword.value ? "text" : "password",
        ao: confirmPassword.value,
        ap: common_vendor.o(($event) => confirmPassword.value = $event.detail.value, "8a"),
        aq: common_vendor.p({
          type: showConfirmPassword.value ? "eye-filled" : "eye-slash-filled",
          size: "20",
          color: "#8599b0"
        }),
        ar: common_vendor.o(($event) => showConfirmPassword.value = !showConfirmPassword.value, "45"),
        as: common_vendor.o(closeNewPasswordModal, "d6"),
        at: common_vendor.o(confirmNewPassword, "72"),
        av: common_vendor.o(() => {
        }, "10"),
        aw: common_vendor.o(closeNewPasswordModal, "2b")
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-018cdf56"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/setting/setting.js.map
