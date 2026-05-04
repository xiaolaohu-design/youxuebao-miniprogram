"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  (_easycom_uni_icons2 + _easycom_uni_popup2)();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  (_easycom_uni_icons + _easycom_uni_popup)();
}
const _sfc_main = {
  __name: "titledetail",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const errorMsg = common_vendor.ref("");
    const questionDetail = common_vendor.ref(null);
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
    const questionId = common_vendor.ref("");
    const showAnswer = common_vendor.ref(false);
    const singleAnswer = common_vendor.ref("");
    const multiAnswer = common_vendor.ref([]);
    const fillAnswers = common_vendor.ref([]);
    const isNightMode = common_vendor.ref(false);
    const isCollected = common_vendor.ref(false);
    const hasNote = common_vendor.ref(false);
    const noteContent = common_vendor.ref("");
    const correctionPopup = common_vendor.ref(null);
    const correctionTypes = ["题目错误", "答案错误", "解析错误", "其他问题"];
    const selectedCorrectionType = common_vendor.ref("题目错误");
    const correctionContent = common_vendor.ref("");
    const notePopup = common_vendor.ref(null);
    const questionTypeMap = {
      "single_choice": "single",
      "multiple_choice": "multiple",
      "judgment": "judge",
      "fill_in_the_blank": "fill",
      "short_answer": "essay"
    };
    const difficultyMap = {
      "easy": "easy",
      "medium": "medium",
      "hard": "hard",
      "简单": "easy",
      "中等": "medium",
      "困难": "hard",
      "1": "easy",
      "2": "medium",
      "3": "hard"
    };
    const hasAnswered = common_vendor.computed(() => {
      if (!questionDetail.value)
        return false;
      const q = questionDetail.value;
      if (q.type === "single" || q.type === "judge")
        return singleAnswer.value !== "";
      if (q.type === "multiple")
        return multiAnswer.value.length > 0;
      if (q.type === "fill" || q.type === "essay")
        return fillAnswers.value.some((a) => a && a.trim() !== "");
      return false;
    });
    const htmlToNodes = (html) => {
      if (!html)
        return [];
      if (Array.isArray(html))
        return html;
      return html.replace(/<img([^>]*)>/g, '<img$1 style="max-width:100%;height:auto;vertical-align:middle;">');
    };
    const getTypeName = (t) => ({
      single: "单选题",
      multiple: "多选题",
      judge: "判断题",
      fill: "填空题",
      essay: "简答题"
    })[t] || "未知题型";
    const getTypeColor = (t) => ({
      single: "#FF6B35",
      multiple: "#2C62EF",
      judge: "#52C41A",
      fill: "#FAAD14",
      essay: "#7B2FBE"
    })[t] || "#999";
    const getDifficultyName = (d) => ({
      easy: "简单",
      medium: "中等",
      hard: "困难"
    })[d] || "中等";
    const checkLoginStatus = () => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      if (!uxfid || !uxfkey || !shopid) {
        setTimeout(() => {
          common_vendor.index.reLaunch({
            url: "/pages/login/login"
          });
        }, 100);
        return false;
      }
      token.value = uxfid;
      userId.value = uxfkey;
      shopId.value = shopid;
      isLogin.value = true;
      return true;
    };
    const formatQuestionData = (rawQuestion) => {
      var _a, _b, _c;
      const type = questionTypeMap[rawQuestion.questiontype] || "single";
      let options = [];
      if (rawQuestion.options && Array.isArray(rawQuestion.options)) {
        options = rawQuestion.options.map((opt) => ({
          label: opt.label || "",
          content: opt.content || "",
          contentNodes: htmlToNodes(opt.content || opt.label || "")
        }));
      }
      let answer = "", answerNodes = [], correctAnswers = [];
      if (type === "single") {
        const idx = (_a = rawQuestion.correct_answers) == null ? void 0 : _a[0];
        if (idx !== void 0 && idx !== null) {
          const opt = (_b = rawQuestion.options) == null ? void 0 : _b[idx - 1];
          if (opt) {
            answer = opt.label;
            answerNodes = htmlToNodes(`${opt.label}. ${opt.content}`);
          }
        }
      } else if (type === "multiple") {
        if (rawQuestion.correct_answers) {
          answer = rawQuestion.correct_answers.map((i) => {
            var _a2, _b2;
            return ((_b2 = (_a2 = rawQuestion.options) == null ? void 0 : _a2[i - 1]) == null ? void 0 : _b2.label) || "";
          }).join("");
          answerNodes = htmlToNodes(rawQuestion.correct_answers.map((i) => {
            var _a2;
            const o = (_a2 = rawQuestion.options) == null ? void 0 : _a2[i - 1];
            return o ? `${o.label}. ${o.content}` : "";
          }).join("<br/>"));
        }
      } else if (type === "judge") {
        answer = ((_c = rawQuestion.correct_answers) == null ? void 0 : _c[0]) === 1 ? "正确" : "错误";
        answerNodes = htmlToNodes(answer);
      } else if (type === "fill" || type === "essay") {
        if (rawQuestion.correct_answers) {
          correctAnswers = rawQuestion.correct_answers.map((item) => ({
            label: item.label || "",
            content: item.content || ""
          }));
          answerNodes = htmlToNodes(rawQuestion.correct_answers.map((a) => `${a.label}：${a.content}`).join(
            "<br/>"
          ));
        }
      }
      return {
        id: rawQuestion.question_id,
        type,
        title: rawQuestion.title || "",
        titleNodes: htmlToNodes(rawQuestion.title || ""),
        options,
        answer,
        answerNodes,
        correctAnswers,
        analysis: rawQuestion.analysis || "",
        analysisNodes: htmlToNodes(rawQuestion.analysis || ""),
        difficulty: difficultyMap[rawQuestion.difficulty] || "medium",
        image: rawQuestion.image || "",
        year: rawQuestion.year || "",
        maplabel: rawQuestion.maplabel || ""
      };
    };
    const initAnswer = () => {
      singleAnswer.value = "";
      multiAnswer.value = [];
      const q = questionDetail.value;
      if (q.type === "fill" || q.type === "essay") {
        fillAnswers.value = q.correctAnswers && q.correctAnswers.length > 0 ? q.correctAnswers.map(() => "") : [""];
      } else {
        fillAnswers.value = [];
      }
    };
    const fetchQuestionDetail = async () => {
      if (!checkLoginStatus())
        return;
      loading.value = true;
      errorMsg.value = "";
      try {
        const formData = {
          UXMID: shopId.value,
          question_id: questionId.value
        };
        const response = await api_index.fetchQuestionBankListID(formData);
        if (response.data && response.data.length > 0) {
          questionDetail.value = formatQuestionData(response.data[0]);
          initAnswer();
          showAnswer.value = false;
        } else {
          errorMsg.value = "未找到该题目";
        }
      } catch (e) {
        errorMsg.value = "获取题目失败，请稍后重试";
      } finally {
        loading.value = false;
      }
    };
    const savePracticeRecord = async (isCorrect = null) => {
      if (!checkLoginStatus() || !questionDetail.value)
        return;
      try {
        await api_index.savePracticeRecords({
          UXMID: shopId.value,
          user_id: userId.value,
          practice_type: "question_preview",
          question_id: questionDetail.value.id,
          notes: noteContent.value || "",
          is_correct: isCorrect,
          is_collected: isCollected.value
        }, token.value);
      } catch (e) {
      }
    };
    const setSingleAnswer = (option) => {
      singleAnswer.value = option;
    };
    const toggleMultiAnswer = (option) => {
      const arr = [...multiAnswer.value];
      const idx = arr.indexOf(option);
      if (idx > -1)
        arr.splice(idx, 1);
      else
        arr.push(option);
      arr.sort();
      multiAnswer.value = arr;
    };
    const onInputChange = () => {
    };
    const validateFillAnswer = () => {
      const q = questionDetail.value;
      if (!q.correctAnswers || q.correctAnswers.length === 0)
        return false;
      const arr = fillAnswers.value;
      if (arr.length !== q.correctAnswers.length)
        return false;
      for (let i = 0; i < q.correctAnswers.length; i++) {
        const u = (arr[i] || "").replace(/<[^>]*>/g, "").replace(/[\s\n\r"",，。、？；：（）(){}【】《》]/g, "").trim().toLowerCase();
        const c = (q.correctAnswers[i].content || "").replace(/<[^>]*>/g, "").replace(
          /[\s\n\r"",，。、？；：（）(){}【】《》]/g,
          ""
        ).trim().toLowerCase();
        if (u !== c)
          return false;
      }
      return true;
    };
    const showAnalysisFunc = () => {
      showAnswer.value = true;
      const q = questionDetail.value;
      let isCorrect = null;
      if (q.type === "multiple") {
        const ua = [...multiAnswer.value].sort().join("");
        const ca = q.answer.split("").sort().join("");
        isCorrect = ua === ca;
      } else if (q.type === "single" || q.type === "judge") {
        isCorrect = singleAnswer.value === q.answer;
      } else if (q.type === "fill" || q.type === "essay") {
        isCorrect = validateFillAnswer() ? true : hasAnswered.value ? false : null;
      }
      savePracticeRecord(isCorrect);
    };
    const getOptionClass = (option) => ({
      "selected": singleAnswer.value === option && !showAnswer.value,
      "correct": showAnswer.value && questionDetail.value.answer === option,
      "wrong": showAnswer.value && singleAnswer.value === option && questionDetail.value.answer !== option
    });
    const getMultipleOptionClass = (option) => {
      const isCorrect = questionDetail.value.answer.includes(option);
      const isUserSelected = multiAnswer.value.includes(option);
      if (!showAnswer.value)
        return {
          "selected": isUserSelected,
          "correct": false,
          "wrong": false,
          "missed": false
        };
      if (isCorrect && !isUserSelected)
        return {
          "selected": false,
          "correct": true,
          "wrong": false,
          "missed": true
        };
      if (isCorrect && isUserSelected)
        return {
          "selected": false,
          "correct": true,
          "wrong": false,
          "missed": false
        };
      if (!isCorrect && isUserSelected)
        return {
          "selected": false,
          "correct": false,
          "wrong": true,
          "missed": false
        };
      return {
        "selected": false,
        "correct": false,
        "wrong": false,
        "missed": false
      };
    };
    const getJudgeOptionClass = (option) => ({
      "selected": singleAnswer.value === option && !showAnswer.value,
      "correct": showAnswer.value && questionDetail.value.answer === option,
      "wrong": showAnswer.value && singleAnswer.value === option && questionDetail.value.answer !== option
    });
    const toggleCollect = () => {
      isCollected.value = !isCollected.value;
      common_vendor.index.showToast({
        title: isCollected.value ? "已收藏" : "已取消收藏",
        icon: "none"
      });
      savePracticeRecord();
    };
    const toggleNote = () => {
      var _a;
      if (!hasNote.value)
        noteContent.value = "";
      (_a = notePopup.value) == null ? void 0 : _a.open();
    };
    const closeNotePopup = () => {
      var _a;
      (_a = notePopup.value) == null ? void 0 : _a.close();
    };
    const saveNote = () => {
      if (!noteContent.value.trim()) {
        common_vendor.index.showToast({
          title: "笔记内容不能为空",
          icon: "none"
        });
        return;
      }
      hasNote.value = true;
      common_vendor.index.showToast({
        title: "笔记已保存",
        icon: "success"
      });
      savePracticeRecord();
      closeNotePopup();
    };
    const deleteNote = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定删除这条笔记吗？",
        success: (r) => {
          if (r.confirm) {
            hasNote.value = false;
            noteContent.value = "";
            common_vendor.index.showToast({
              title: "笔记已删除",
              icon: "success"
            });
            savePracticeRecord();
            closeNotePopup();
          }
        }
      });
    };
    const showCorrectionPopup = () => {
      var _a;
      if (!checkLoginStatus())
        return;
      selectedCorrectionType.value = "题目错误";
      correctionContent.value = "";
      (_a = correctionPopup.value) == null ? void 0 : _a.open();
    };
    const closeCorrectionPopup = () => {
      var _a;
      (_a = correctionPopup.value) == null ? void 0 : _a.close();
    };
    const handleSubmitCorrection = async () => {
      if (!correctionContent.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入纠错内容",
          icon: "none"
        });
        return;
      }
      try {
        await api_index.createCorrection({
          UXMID: shopId.value,
          user_id: userId.value,
          content_type: "practice",
          content_id: questionDetail.value.id,
          correction_detail: `[${selectedCorrectionType.value}] ${correctionContent.value}`
        });
        common_vendor.index.showToast({
          title: "纠错提交成功，感谢您的反馈！",
          icon: "success",
          duration: 2e3
        });
        closeCorrectionPopup();
      } catch (e) {
        common_vendor.index.showToast({
          title: "已有相同纠错，我们会尽快处理",
          icon: "none",
          duration: 2e3
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleMode = () => {
      isNightMode.value = !isNightMode.value;
      common_vendor.index.showToast({
        title: isNightMode.value ? "已切换夜间模式" : "已切换日间模式",
        icon: "none"
      });
    };
    const previewImage = () => {
      if (questionDetail.value.image)
        common_vendor.index.previewImage({
          urls: [questionDetail.value.image],
          current: questionDetail.value.image
        });
    };
    common_vendor.watch(isNightMode, (val) => {
      common_vendor.index.setStorageSync("practice_night_mode", val);
    });
    common_vendor.onLoad((options) => {
      const uxfid = common_vendor.index.getStorageSync("UXFID");
      const uxfkey = common_vendor.index.getStorageSync("UXFKEY");
      const shopid = common_vendor.index.getStorageSync("shopId");
      token.value = uxfid || "";
      userId.value = uxfkey || "";
      shopId.value = shopid || "";
      isLogin.value = !!(uxfid && uxfkey && shopid);
      if (!isLogin.value) {
        checkLoginStatus();
        return;
      }
      questionId.value = options.questionid || "";
      if (!questionId.value) {
        errorMsg.value = "缺少题目参数";
        return;
      }
    });
    common_vendor.onMounted(async () => {
      if (!isLogin.value)
        return;
      const savedMode = common_vendor.index.getStorageSync("practice_night_mode");
      if (savedMode !== "")
        isNightMode.value = savedMode;
      await fetchQuestionDetail();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: questionDetail.value
      }, questionDetail.value ? {
        b: common_vendor.t(questionDetail.value.id)
      } : {}, {
        c: common_vendor.o(goBack, "ef"),
        d: common_vendor.p({
          type: isNightMode.value ? "color-filled" : "color",
          size: "20",
          color: isNightMode.value ? "#FFD700" : "#666"
        }),
        e: common_vendor.o(toggleMode, "18"),
        f: loading.value
      }, loading.value ? {} : errorMsg.value ? {
        h: common_vendor.t(errorMsg.value),
        i: common_vendor.o(fetchQuestionDetail, "32")
      } : questionDetail.value ? common_vendor.e({
        k: common_vendor.t(getTypeName(questionDetail.value.type)),
        l: getTypeColor(questionDetail.value.type),
        m: common_vendor.t(getDifficultyName(questionDetail.value.difficulty)),
        n: common_vendor.n("difficulty-" + questionDetail.value.difficulty),
        o: common_vendor.p({
          type: isCollected.value ? "heart-filled" : "heart",
          size: "20",
          color: isCollected.value ? "#FF4D4F" : "#999"
        }),
        p: common_vendor.o(toggleCollect, "bf"),
        q: common_vendor.p({
          type: "compose",
          size: "20",
          color: hasNote.value ? "#FAAD14" : "#999"
        }),
        r: common_vendor.o(toggleNote, "5f"),
        s: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#999"
        }),
        t: common_vendor.o(showCorrectionPopup, "d1"),
        v: questionDetail.value.titleNodes,
        w: questionDetail.value.image
      }, questionDetail.value.image ? {
        x: questionDetail.value.image,
        y: common_vendor.o(previewImage, "fc")
      } : {}, {
        z: questionDetail.value.type === "single"
      }, questionDetail.value.type === "single" ? {
        A: common_vendor.f(questionDetail.value.options, (option, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option.label),
            b: option.contentNodes
          }, showAnswer.value ? common_vendor.e({
            c: questionDetail.value.answer === option.label
          }, questionDetail.value.answer === option.label ? {
            d: "259822d4-4-" + i0,
            e: common_vendor.p({
              type: "checkmark-filled",
              size: "18",
              color: "#52C41A"
            })
          } : singleAnswer.value === option.label && questionDetail.value.answer !== option.label ? {
            g: "259822d4-5-" + i0,
            h: common_vendor.p({
              type: "close-filled",
              size: "18",
              color: "#FF4D4F"
            })
          } : {}, {
            f: singleAnswer.value === option.label && questionDetail.value.answer !== option.label
          }) : {}, {
            i: idx,
            j: common_vendor.n(getOptionClass(option.label)),
            k: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer(option.label), idx)
          });
        }),
        B: showAnswer.value
      } : {}, {
        C: questionDetail.value.type === "multiple"
      }, questionDetail.value.type === "multiple" ? {
        D: common_vendor.f(questionDetail.value.options, (option, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option.label),
            b: option.contentNodes
          }, showAnswer.value ? common_vendor.e({
            c: questionDetail.value.answer.includes(option.label) && multiAnswer.value.includes(option.label)
          }, questionDetail.value.answer.includes(option.label) && multiAnswer.value.includes(option.label) ? {
            d: "259822d4-6-" + i0,
            e: common_vendor.p({
              type: "checkmark-filled",
              size: "18",
              color: "#52C41A"
            })
          } : multiAnswer.value.includes(option.label) && !questionDetail.value.answer.includes(option.label) ? {
            g: "259822d4-7-" + i0,
            h: common_vendor.p({
              type: "close-filled",
              size: "18",
              color: "#FF4D4F"
            })
          } : {}, {
            f: multiAnswer.value.includes(option.label) && !questionDetail.value.answer.includes(option.label)
          }) : {}, {
            i: idx,
            j: common_vendor.n(getMultipleOptionClass(option.label)),
            k: common_vendor.o(($event) => !showAnswer.value && toggleMultiAnswer(option.label), idx)
          });
        }),
        E: showAnswer.value
      } : {}, {
        F: questionDetail.value.type === "judge"
      }, questionDetail.value.type === "judge" ? common_vendor.e({
        G: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        H: questionDetail.value.answer === "正确"
      }, questionDetail.value.answer === "正确" ? {
        I: common_vendor.p({
          type: "checkmark-filled",
          size: "18",
          color: "#52C41A"
        })
      } : singleAnswer.value === "正确" && questionDetail.value.answer !== "正确" ? {
        K: common_vendor.p({
          type: "close-filled",
          size: "18",
          color: "#FF4D4F"
        })
      } : {}, {
        J: singleAnswer.value === "正确" && questionDetail.value.answer !== "正确"
      }) : {}, {
        L: common_vendor.n(getJudgeOptionClass("正确")),
        M: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer("正确"), "54"),
        N: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        O: questionDetail.value.answer === "错误"
      }, questionDetail.value.answer === "错误" ? {
        P: common_vendor.p({
          type: "checkmark-filled",
          size: "18",
          color: "#52C41A"
        })
      } : singleAnswer.value === "错误" && questionDetail.value.answer !== "错误" ? {
        R: common_vendor.p({
          type: "close-filled",
          size: "18",
          color: "#FF4D4F"
        })
      } : {}, {
        Q: singleAnswer.value === "错误" && questionDetail.value.answer !== "错误"
      }) : {}, {
        S: common_vendor.n(getJudgeOptionClass("错误")),
        T: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer("错误"), "e2")
      }) : {}, {
        U: questionDetail.value.type === "fill" || questionDetail.value.type === "essay"
      }, questionDetail.value.type === "fill" || questionDetail.value.type === "essay" ? {
        V: common_vendor.f(questionDetail.value.correctAnswers, (answer, answerIndex, i0) => {
          return common_vendor.e({
            a: common_vendor.t(answer.label)
          }, questionDetail.value.type === "fill" ? {
            b: "请输入" + answer.label,
            c: showAnswer.value,
            d: common_vendor.o([($event) => fillAnswers.value[answerIndex] = $event.detail.value, onInputChange], answerIndex),
            e: fillAnswers.value[answerIndex]
          } : {}, questionDetail.value.type === "essay" ? {
            f: "请输入" + answer.label,
            g: showAnswer.value,
            h: common_vendor.o([($event) => fillAnswers.value[answerIndex] = $event.detail.value, onInputChange], answerIndex),
            i: fillAnswers.value[answerIndex]
          } : {}, {
            j: answerIndex
          });
        }),
        W: questionDetail.value.type === "fill",
        X: questionDetail.value.type === "essay"
      } : {}, {
        Y: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        Z: common_vendor.p({
          type: "info-filled",
          size: "18",
          color: "#FF6B35"
        }),
        aa: questionDetail.value.type === "essay"
      }, questionDetail.value.type === "essay" ? {} : {}, {
        ab: questionDetail.value.type !== "essay"
      }, questionDetail.value.type !== "essay" ? {
        ac: questionDetail.value.answerNodes
      } : {}, {
        ad: questionDetail.value.type === "essay"
      }, questionDetail.value.type === "essay" ? {
        ae: questionDetail.value.answerNodes
      } : {}, {
        af: questionDetail.value.analysisNodes
      }) : {}) : !loading.value && !errorMsg.value ? {} : {}, {
        g: errorMsg.value,
        j: questionDetail.value,
        ag: !loading.value && !errorMsg.value,
        ah: isNightMode.value ? 1 : "",
        ai: !showAnswer.value
      }, !showAnswer.value ? {
        aj: common_vendor.p({
          type: "eye-filled",
          size: "20",
          color: "#fff"
        }),
        ak: common_vendor.o(showAnalysisFunc, "2c")
      } : {}, {
        al: common_vendor.o(closeCorrectionPopup, "cb"),
        am: common_vendor.p({
          type: "closeempty",
          size: "22",
          color: "#999"
        }),
        an: common_vendor.f(correctionTypes, (type, idx, i0) => {
          return {
            a: common_vendor.t(type),
            b: idx,
            c: selectedCorrectionType.value === type ? 1 : "",
            d: common_vendor.o(($event) => selectedCorrectionType.value = type, idx)
          };
        }),
        ao: `请描述${selectedCorrectionType.value || "题目错误"}的详细情况...`,
        ap: correctionContent.value,
        aq: common_vendor.o(($event) => correctionContent.value = $event.detail.value, "df"),
        ar: common_vendor.t(correctionContent.value.length),
        as: common_vendor.o(closeCorrectionPopup, "fa"),
        at: common_vendor.o(handleSubmitCorrection, "97"),
        av: !correctionContent.value.trim(),
        aw: common_vendor.sr(correctionPopup, "259822d4-14", {
          "k": "correctionPopup"
        }),
        ax: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        ay: common_vendor.t(hasNote.value ? "编辑笔记" : "添加笔记"),
        az: common_vendor.o(closeNotePopup, "27"),
        aA: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        aB: noteContent.value,
        aC: common_vendor.o(($event) => noteContent.value = $event.detail.value, "70"),
        aD: common_vendor.t(noteContent.value.length),
        aE: hasNote.value
      }, hasNote.value ? {
        aF: common_vendor.o(deleteNote, "10")
      } : {}, {
        aG: common_vendor.o(closeNotePopup, "c5"),
        aH: common_vendor.o(saveNote, "cf"),
        aI: common_vendor.sr(notePopup, "259822d4-16", {
          "k": "notePopup"
        }),
        aJ: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-259822d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/practice/titledetail.js.map
