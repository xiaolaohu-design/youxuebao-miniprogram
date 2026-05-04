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
  __name: "practicedetail",
  setup(__props) {
    const token = common_vendor.ref("");
    const userId = common_vendor.ref("");
    const shopId = common_vendor.ref("");
    const isLogin = common_vendor.ref(false);
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
    const pageType = common_vendor.ref("");
    const subjectId = common_vendor.ref("");
    const questionTypeParam = common_vendor.ref("");
    const currentIndex = common_vendor.ref(0);
    const questionList = common_vendor.ref([]);
    const questionStatusList = common_vendor.ref([]);
    const allAnswers = common_vendor.ref({});
    const totalCount = common_vendor.computed(() => questionList.value.length);
    common_vendor.computed(() => questionStatusList.value.filter((s) => s.status !== "none").length);
    const currentQuestion = common_vendor.computed(() => questionList.value[currentIndex.value] || {});
    const showAnswer = common_vendor.ref(false);
    const isNightMode = common_vendor.ref(false);
    const isCollected = common_vendor.ref(false);
    const hasNote = common_vendor.ref(false);
    const noteContent = common_vendor.ref("");
    const settingsPopup = common_vendor.ref(null);
    const excludeAnswered = common_vendor.ref(false);
    const fontSize = common_vendor.ref("normal");
    const fontSizes = [
      {
        label: "小",
        value: "small"
      },
      {
        label: "适中",
        value: "normal"
      },
      {
        label: "大",
        value: "large"
      }
    ];
    const timerEnabled = common_vendor.ref(false);
    const elapsedTime = common_vendor.ref(0);
    const timer = common_vendor.ref(null);
    const fontSizeClass = common_vendor.computed(() => {
      if (fontSize.value === "small")
        return "font-small";
      if (fontSize.value === "large")
        return "font-large";
      return "";
    });
    const correctionPopup = common_vendor.ref(null);
    const correctionTypes = ["题目错误", "答案错误", "解析错误", "其他问题"];
    const selectedCorrectionType = common_vendor.ref("题目错误");
    const correctionContent = common_vendor.ref("");
    const currentAnswer = common_vendor.computed({
      get: () => {
        const ans = allAnswers.value[currentIndex.value];
        return typeof ans === "string" ? ans : "";
      },
      set: (val) => {
        allAnswers.value[currentIndex.value] = val;
      }
    });
    const currentMultiAnswer = common_vendor.computed({
      get: () => {
        const ans = allAnswers.value[currentIndex.value];
        return Array.isArray(ans) ? ans : [];
      },
      set: (val) => {
        allAnswers.value[currentIndex.value] = [...val];
      }
    });
    const currentFillAnswer = common_vendor.computed({
      get: () => {
        const ans = allAnswers.value[currentIndex.value];
        return Array.isArray(ans) ? ans : [];
      },
      set: (val) => {
        allAnswers.value[currentIndex.value] = [...val];
      }
    });
    const hasAnswered = common_vendor.computed(() => {
      const q = currentQuestion.value;
      if (!q)
        return false;
      const answer = allAnswers.value[currentIndex.value];
      if (answer === void 0 || answer === null)
        return false;
      if (q.type === "single" || q.type === "judge")
        return answer !== "";
      if (q.type === "multiple")
        return Array.isArray(answer) && answer.length > 0;
      if (q.type === "fill" || q.type === "essay")
        return Array.isArray(answer) && answer.some((a) => a && a.trim() !== "");
      return false;
    });
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
    const htmlToNodes = (html) => {
      if (!html)
        return [];
      if (Array.isArray(html))
        return html;
      return html.replace(
        /<img([^>]*)>/g,
        '<img$1 style="max-width:100%;height:auto;vertical-align:middle;">'
      );
    };
    const getQuestionConfig = (type) => {
      const m = {
        "days": {
          count: 20,
          questionsort: 1
        },
        "order": {
          count: null,
          questionsort: 1
        },
        "random": {
          count: null,
          questionsort: 6
        },
        "chapter": {
          count: null,
          questionsort: 1
        },
        "category": {
          count: null,
          questionsort: 1
        },
        "previous": {
          count: null,
          questionsort: 1,
          map: 13
        },
        "exam": {
          count: null,
          questionsort: 1
        },
        "errors": {
          count: null,
          questionsort: 1,
          isCorrect: 0
        },
        "notes": {
          count: null,
          questionsort: 1,
          hasNotes: 1
        },
        "collections": {
          count: null,
          questionsort: 1,
          hasCollections: 1
        },
        "reviews": {
          count: null,
          questionsort: 1
        },
        "mistakes": {
          count: null,
          questionsort: 1,
          isErrors: 1
        }
      };
      return m[type] || m["order"];
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
    const initAnswerForIndex = (index) => {
      if (allAnswers.value[index] !== void 0)
        return;
      const q = questionList.value[index];
      if (!q)
        return;
      if (q.type === "multiple")
        allAnswers.value[index] = [];
      else if (q.type === "fill" || q.type === "essay")
        allAnswers.value[index] = q.correctAnswers && q.correctAnswers.length > 0 ? q.correctAnswers.map(() => "") : [""];
      else
        allAnswers.value[index] = "";
    };
    const fetchQuestionBankList = async () => {
      if (!checkLoginStatus())
        return;
      try {
        const config = getQuestionConfig(pageType.value);
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          category: subjectId.value ? Number(subjectId.value) : null,
          map: config.map || null,
          type: pageType.value === "category" ? questionTypeParam.value : config.type || null,
          difficulty: null,
          region: null,
          winnow: null,
          year: null,
          questionsort: config.questionsort || 1,
          inputkeyword: null,
          count: config.count || null,
          excludeAnswered: excludeAnswered.value,
          question_ids: []
        };
        const recordTypes = ["errors", "notes", "collections", "reviews", "mistakes"];
        if (recordTypes.includes(pageType.value)) {
          const recordsFormData = {
            UXMID: shopId.value,
            user_id: userId.value,
            category: subjectId.value || null,
            is_correct: config.isCorrect || null,
            notes: config.hasNotes || null,
            collections: config.hasCollections || null,
            is_errors: config.isErrors || null
          };
          const recordsResponse = await api_index.getPracticeRecords(recordsFormData);
          if (recordsResponse.data && recordsResponse.data.length > 0) {
            formData.question_ids = recordsResponse.data.map((r) => r.question_id);
          } else {
            questionList.value = [];
            common_vendor.index.showToast({
              title: "暂无题目",
              icon: "none"
            });
            return;
          }
        }
        const response = await api_index.fetchPracticeQuestionBankList(formData);
        if (response.data && response.data.length > 0) {
          questionList.value = response.data.map(formatQuestionData);
        } else {
          questionList.value = [];
          common_vendor.index.showToast({
            title: "暂无题目",
            icon: "none"
          });
        }
      } catch (e) {
        common_vendor.index.showToast({
          title: "获取题目失败",
          icon: "none"
        });
      }
    };
    const fetchPracticeRecords = async () => {
      if (!checkLoginStatus() || questionList.value.length === 0)
        return;
      const q = questionList.value[currentIndex.value];
      if (!q)
        return;
      try {
        const formData = {
          UXMID: shopId.value,
          user_id: userId.value,
          category: subjectId.value || null,
          question_id: q.id
        };
        const response = await api_index.getPracticeRecords(formData);
        if (response.data && response.data.length > 0) {
          const record = response.data[0];
          isCollected.value = !!record.is_collected;
          hasNote.value = !!record.notes;
          noteContent.value = record.notes || "";
        } else {
          isCollected.value = false;
          hasNote.value = false;
          noteContent.value = "";
        }
      } catch (e) {
      }
    };
    const saveCurrentPracticeRecord = async () => {
      if (!checkLoginStatus())
        return;
      const q = questionList.value[currentIndex.value];
      if (!q)
        return;
      try {
        let isCorrect = null;
        if (showAnswer.value) {
          const status = questionStatusList.value[currentIndex.value];
          if (status)
            isCorrect = status.status === "correct" ? true : status.status === "wrong" ? false : null;
        }
        await api_index.savePracticeRecords({
          UXMID: shopId.value,
          user_id: userId.value,
          practice_type: pageType.value || "order",
          question_id: q.id,
          notes: noteContent.value || "",
          is_correct: isCorrect,
          is_collected: isCollected.value
        });
      } catch (e) {
      }
    };
    const getTypeName = (t) => ({
      single: "单选题",
      multiple: "多选题",
      judge: "判断题",
      fill: "填空题",
      essay: "简答题"
    })[t] || "未知题型";
    const getTypeIcon = (t) => ({
      single: "smallcircle",
      multiple: "circle-filled",
      judge: "help",
      fill: "compose",
      essay: "chat"
    })[t] || "help";
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
    const getOptionClass = (option) => ({
      "selected": currentAnswer.value === option,
      "correct": showAnswer.value && currentQuestion.value.answer === option,
      "wrong": showAnswer.value && currentAnswer.value === option && currentQuestion.value.answer !== option
    });
    const getMultipleOptionClass = (option) => {
      const isCorrect = currentQuestion.value.answer.includes(option);
      const isUserSelected = currentMultiAnswer.value.includes(option);
      if (!showAnswer.value)
        return {
          "selected": isUserSelected,
          "correct": false,
          "wrong": false,
          "missed": false
        };
      if (isCorrect) {
        if (!isUserSelected)
          return {
            "selected": false,
            "correct": true,
            "wrong": false,
            "missed": true
          };
        return {
          "selected": false,
          "correct": true,
          "wrong": false,
          "missed": false
        };
      }
      if (isUserSelected && !isCorrect)
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
      "selected": currentAnswer.value === option,
      "correct": showAnswer.value && currentQuestion.value.answer === option,
      "wrong": showAnswer.value && currentAnswer.value === option && currentQuestion.value.answer !== option
    });
    const validateFillAnswer = () => {
      const q = currentQuestion.value;
      if (!q.correctAnswers || q.correctAnswers.length === 0)
        return false;
      const arr = currentFillAnswer.value;
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
    const goBack = () => {
      clearTimer();
      saveCurrentPracticeRecord();
      if (hasAnswered.value && !showAnswer.value) {
        common_vendor.index.showModal({
          title: "提示",
          content: "当前题目尚未查看解析，确定要退出吗？",
          success: (r) => {
            if (r.confirm)
              common_vendor.index.navigateBack();
          }
        });
      } else {
        common_vendor.index.navigateBack();
      }
    };
    const showMoreMenu = () => {
      var _a;
      (_a = settingsPopup.value) == null ? void 0 : _a.open();
    };
    const closeSettingsPopup = () => {
      var _a;
      (_a = settingsPopup.value) == null ? void 0 : _a.close();
    };
    const toggleExcludeAnswered = (e) => {
      excludeAnswered.value = e.detail.value;
    };
    const toggleMode = () => {
      isNightMode.value = !isNightMode.value;
      common_vendor.index.showToast({
        title: isNightMode.value ? "已切换夜间模式" : "已切换日间模式",
        icon: "none"
      });
    };
    const setFontSize = (size) => {
      fontSize.value = size;
    };
    const toggleTimerEnabled = (e) => {
      timerEnabled.value = e.detail.value;
    };
    const formatElapsedTime = () => {
      const hours = Math.floor(elapsedTime.value / 3600);
      const minutes = Math.floor(elapsedTime.value % 3600 / 60);
      const seconds = elapsedTime.value % 60;
      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };
    const startTimer = () => {
      clearTimer();
      if (timerEnabled.value) {
        timer.value = setInterval(() => {
          elapsedTime.value++;
        }, 1e3);
      }
    };
    const clearTimer = () => {
      if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
      }
    };
    const resetTimer = () => {
      clearTimer();
      elapsedTime.value = 0;
    };
    const applySettings = async () => {
      common_vendor.index.setStorageSync("practice_exclude_answered", excludeAnswered.value);
      common_vendor.index.setStorageSync("practice_font_size", fontSize.value);
      common_vendor.index.setStorageSync("practice_timer_enabled", timerEnabled.value);
      const oldExcludeAnswered = common_vendor.index.getStorageSync("practice_exclude_answered_old");
      if (excludeAnswered.value !== oldExcludeAnswered) {
        common_vendor.index.setStorageSync("practice_exclude_answered_old", excludeAnswered.value);
        currentIndex.value = 0;
        allAnswers.value = {};
        common_vendor.index.showLoading({
          title: "加载中..."
        });
        await fetchQuestionBankList();
        initAllAnswers();
        initQuestionStatus();
        loadQuestionData();
        common_vendor.index.hideLoading();
      }
      resetTimer();
      if (timerEnabled.value) {
        startTimer();
      }
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      closeSettingsPopup();
    };
    const setSingleAnswer = (option) => {
      currentAnswer.value = option;
      updateQuestionStatus();
    };
    const toggleMultiAnswer = (option) => {
      const arr = [...currentMultiAnswer.value];
      const idx = arr.indexOf(option);
      if (idx > -1)
        arr.splice(idx, 1);
      else
        arr.push(option);
      arr.sort();
      currentMultiAnswer.value = arr;
      updateQuestionStatus();
    };
    const onInputChange = () => {
      updateQuestionStatus();
    };
    const updateQuestionStatus = () => {
      const status = questionStatusList.value[currentIndex.value];
      if (status && hasAnswered.value)
        status.status = "answered";
    };
    const showAnalysisFunc = () => {
      showAnswer.value = true;
      const q = currentQuestion.value;
      const status = questionStatusList.value[currentIndex.value];
      if (!status)
        return;
      if (q.type === "multiple") {
        const ua = currentMultiAnswer.value.sort().join("");
        const ca = q.answer.split("").sort().join("");
        status.status = ua === ca ? "correct" : "wrong";
      } else if (q.type === "judge" || q.type === "single") {
        status.status = currentAnswer.value === q.answer ? "correct" : "wrong";
      } else if (q.type === "fill" || q.type === "essay") {
        status.status = validateFillAnswer() ? "correct" : hasAnswered.value ? "wrong" : "answered";
      }
      saveCurrentPracticeRecord();
    };
    const prevQuestion = () => {
      if (currentIndex.value > 0) {
        saveCurrentPracticeRecord();
        currentIndex.value--;
        loadQuestionData();
      }
    };
    const nextQuestion = () => {
      if (currentIndex.value < totalCount.value - 1) {
        saveCurrentPracticeRecord();
        currentIndex.value++;
        loadQuestionData();
      } else
        finishPractice();
    };
    const loadQuestionData = () => {
      initAnswerForIndex(currentIndex.value);
      showAnswer.value = false;
      fetchPracticeRecords();
    };
    const toggleCollect = () => {
      isCollected.value = !isCollected.value;
      common_vendor.index.showToast({
        title: isCollected.value ? "已收藏" : "已取消收藏",
        icon: "none"
      });
      saveCurrentPracticeRecord();
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
      saveCurrentPracticeRecord();
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
            saveCurrentPracticeRecord();
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
        const q = questionList.value[currentIndex.value];
        await api_index.createCorrection({
          UXMID: shopId.value,
          user_id: userId.value,
          content_type: "practice",
          content_id: q.id,
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
    const previewImage = () => {
      if (currentQuestion.value.image)
        common_vendor.index.previewImage({
          urls: [currentQuestion.value.image],
          current: currentQuestion.value.image
        });
    };
    const finishPractice = () => {
      clearTimer();
      const c = questionStatusList.value.filter((s) => s.status === "correct").length;
      const w = questionStatusList.value.filter((s) => s.status === "wrong").length;
      common_vendor.index.showModal({
        title: "练习完成",
        content: `共${totalCount.value}题
答对${c}题，答错${w}题
用时：${formatElapsedTime()}`,
        confirmText: "返回",
        cancelText: "",
        showCancel: false,
        success: () => goBack()
      });
    };
    const initAllAnswers = () => {
      for (let i = 0; i < questionList.value.length; i++)
        initAnswerForIndex(i);
    };
    const initQuestionStatus = () => {
      questionStatusList.value = questionList.value.map(() => ({
        status: "none"
      }));
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
      pageType.value = options.type || "order";
      if (options.type === "chapter") {
        subjectId.value = options.chapterId || options.subjectId || "";
      } else {
        subjectId.value = options.subjectId || "";
      }
      if (options.type === "category" && options.categories) {
        questionTypeParam.value = options.categories;
      }
    });
    common_vendor.onMounted(async () => {
      if (!isLogin.value)
        return;
      const savedExcludeAnswered = common_vendor.index.getStorageSync("practice_exclude_answered");
      if (savedExcludeAnswered !== "") {
        excludeAnswered.value = savedExcludeAnswered;
      }
      const savedFontSize = common_vendor.index.getStorageSync("practice_font_size");
      if (savedFontSize && savedFontSize !== "") {
        fontSize.value = savedFontSize;
      } else {
        fontSize.value = "normal";
      }
      const savedTimerEnabled = common_vendor.index.getStorageSync("practice_timer_enabled");
      if (savedTimerEnabled !== "") {
        timerEnabled.value = savedTimerEnabled;
      }
      const savedMode = common_vendor.index.getStorageSync("practice_night_mode");
      if (savedMode !== "")
        isNightMode.value = savedMode;
      await fetchQuestionBankList();
      initAllAnswers();
      initQuestionStatus();
      loadQuestionData();
      if (timerEnabled.value) {
        startTimer();
      }
    });
    common_vendor.onUnmounted(() => {
      clearTimer();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(currentIndex.value + 1),
        b: common_vendor.t(totalCount.value),
        c: timerEnabled.value
      }, timerEnabled.value ? {
        d: common_vendor.p({
          type: "clock",
          size: "16",
          color: "#FF6B35"
        }),
        e: common_vendor.t(formatElapsedTime())
      } : {}, {
        f: common_vendor.p({
          type: isNightMode.value ? "color-filled" : "color",
          size: "20",
          color: isNightMode.value ? "#FFD700" : "#666"
        }),
        g: common_vendor.o(toggleMode, "70"),
        h: common_vendor.p({
          type: "more-filled",
          size: "20",
          color: "#666"
        }),
        i: common_vendor.o(showMoreMenu, "fa"),
        j: questionList.value.length > 0
      }, questionList.value.length > 0 ? common_vendor.e({
        k: common_vendor.p({
          type: getTypeIcon(currentQuestion.value.type),
          size: "14",
          color: "#fff"
        }),
        l: common_vendor.t(getTypeName(currentQuestion.value.type)),
        m: getTypeColor(currentQuestion.value.type),
        n: common_vendor.t(getDifficultyName(currentQuestion.value.difficulty)),
        o: common_vendor.n("difficulty-" + currentQuestion.value.difficulty),
        p: common_vendor.p({
          type: isCollected.value ? "heart-filled" : "heart",
          size: "20",
          color: isCollected.value ? "#FF4D4F" : "#999"
        }),
        q: common_vendor.o(toggleCollect, "54"),
        r: common_vendor.p({
          type: hasNote.value ? "compose" : "compose",
          size: "20",
          color: hasNote.value ? "#FAAD14" : "#999"
        }),
        s: common_vendor.o(toggleNote, "0e"),
        t: common_vendor.p({
          type: "flag",
          size: "20",
          color: "#999"
        }),
        v: common_vendor.o(showCorrectionPopup, "10"),
        w: currentQuestion.value.titleNodes,
        x: currentQuestion.value.image
      }, currentQuestion.value.image ? {
        y: currentQuestion.value.image,
        z: common_vendor.o(previewImage, "36")
      } : {}, {
        A: currentQuestion.value.type === "single"
      }, currentQuestion.value.type === "single" ? {
        B: common_vendor.f(currentQuestion.value.options, (option, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option.label),
            b: option.contentNodes
          }, showAnswer.value ? common_vendor.e({
            c: currentQuestion.value.answer === option.label
          }, currentQuestion.value.answer === option.label ? {
            d: "ddba2a24-7-" + i0,
            e: common_vendor.p({
              type: "checkmark-filled",
              size: "18",
              color: "#52C41A"
            })
          } : currentAnswer.value === option.label && currentQuestion.value.answer !== option.label ? {
            g: "ddba2a24-8-" + i0,
            h: common_vendor.p({
              type: "close-filled",
              size: "18",
              color: "#FF4D4F"
            })
          } : {}, {
            f: currentAnswer.value === option.label && currentQuestion.value.answer !== option.label
          }) : {}, {
            i: idx,
            j: common_vendor.n(getOptionClass(option.label)),
            k: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer(option.label), idx)
          });
        }),
        C: showAnswer.value
      } : {}, {
        D: currentQuestion.value.type === "multiple"
      }, currentQuestion.value.type === "multiple" ? {
        E: common_vendor.f(currentQuestion.value.options, (option, idx, i0) => {
          return common_vendor.e({
            a: common_vendor.t(option.label),
            b: option.contentNodes
          }, showAnswer.value ? common_vendor.e({
            c: currentQuestion.value.answer.includes(option.label) && currentMultiAnswer.value.includes(option.label)
          }, currentQuestion.value.answer.includes(option.label) && currentMultiAnswer.value.includes(option.label) ? {
            d: "ddba2a24-9-" + i0,
            e: common_vendor.p({
              type: "checkmark-filled",
              size: "18",
              color: "#52C41A"
            })
          } : currentMultiAnswer.value.includes(option.label) && !currentQuestion.value.answer.includes(option.label) ? {
            g: "ddba2a24-10-" + i0,
            h: common_vendor.p({
              type: "close-filled",
              size: "18",
              color: "#FF4D4F"
            })
          } : {}, {
            f: currentMultiAnswer.value.includes(option.label) && !currentQuestion.value.answer.includes(option.label)
          }) : {}, {
            i: idx,
            j: common_vendor.n(getMultipleOptionClass(option.label)),
            k: common_vendor.o(($event) => !showAnswer.value && toggleMultiAnswer(option.label), idx)
          });
        }),
        F: showAnswer.value
      } : {}, {
        G: currentQuestion.value.type === "judge"
      }, currentQuestion.value.type === "judge" ? common_vendor.e({
        H: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        I: currentQuestion.value.answer === "正确"
      }, currentQuestion.value.answer === "正确" ? {
        J: common_vendor.p({
          type: "checkmark-filled",
          size: "18",
          color: "#52C41A"
        })
      } : currentAnswer.value === "正确" && currentQuestion.value.answer !== "正确" ? {
        L: common_vendor.p({
          type: "close-filled",
          size: "18",
          color: "#FF4D4F"
        })
      } : {}, {
        K: currentAnswer.value === "正确" && currentQuestion.value.answer !== "正确"
      }) : {}, {
        M: common_vendor.n(getJudgeOptionClass("正确")),
        N: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer("正确"), "3c"),
        O: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        P: currentQuestion.value.answer === "错误"
      }, currentQuestion.value.answer === "错误" ? {
        Q: common_vendor.p({
          type: "checkmark-filled",
          size: "18",
          color: "#52C41A"
        })
      } : currentAnswer.value === "错误" && currentQuestion.value.answer !== "错误" ? {
        S: common_vendor.p({
          type: "close-filled",
          size: "18",
          color: "#FF4D4F"
        })
      } : {}, {
        R: currentAnswer.value === "错误" && currentQuestion.value.answer !== "错误"
      }) : {}, {
        T: common_vendor.n(getJudgeOptionClass("错误")),
        U: common_vendor.o(($event) => !showAnswer.value && setSingleAnswer("错误"), "4a")
      }) : {}, {
        V: currentQuestion.value.type === "fill" || currentQuestion.value.type === "essay"
      }, currentQuestion.value.type === "fill" || currentQuestion.value.type === "essay" ? {
        W: common_vendor.f(currentQuestion.value.correctAnswers, (answer, answerIndex, i0) => {
          return common_vendor.e({
            a: common_vendor.t(answer.label)
          }, currentQuestion.value.type === "fill" ? {
            b: "请输入" + answer.label,
            c: showAnswer.value,
            d: common_vendor.o([($event) => currentFillAnswer.value[answerIndex] = $event.detail.value, onInputChange], answerIndex),
            e: currentFillAnswer.value[answerIndex]
          } : {}, currentQuestion.value.type === "essay" ? {
            f: "请输入" + answer.label,
            g: showAnswer.value,
            h: common_vendor.o([($event) => currentFillAnswer.value[answerIndex] = $event.detail.value, onInputChange], answerIndex),
            i: currentFillAnswer.value[answerIndex]
          } : {}, {
            j: answerIndex
          });
        }),
        X: currentQuestion.value.type === "fill",
        Y: currentQuestion.value.type === "essay"
      } : {}, {
        Z: showAnswer.value
      }, showAnswer.value ? common_vendor.e({
        aa: common_vendor.p({
          type: "info-filled",
          size: "18",
          color: "#FF6B35"
        }),
        ab: currentQuestion.value.type === "essay"
      }, currentQuestion.value.type === "essay" ? {} : {}, {
        ac: currentQuestion.value.type !== "essay"
      }, currentQuestion.value.type !== "essay" ? {
        ad: currentQuestion.value.answerNodes
      } : {}, {
        ae: currentQuestion.value.type === "essay"
      }, currentQuestion.value.type === "essay" ? {
        af: currentQuestion.value.answerNodes
      } : {}, {
        ag: currentQuestion.value.analysisNodes
      }) : {}) : {}, {
        ah: common_vendor.n(fontSizeClass.value),
        ai: common_vendor.n({
          "night-mode": isNightMode.value
        }),
        aj: common_vendor.p({
          type: "arrow-left",
          size: "18",
          color: currentIndex.value === 0 ? "#ccc" : "#666"
        }),
        ak: currentIndex.value === 0 ? 1 : "",
        al: common_vendor.o(prevQuestion, "50"),
        am: common_vendor.t(currentIndex.value === totalCount.value - 1 ? "完成" : "下一题"),
        an: currentIndex.value < totalCount.value - 1
      }, currentIndex.value < totalCount.value - 1 ? {
        ao: common_vendor.p({
          type: "arrow-right",
          size: "18",
          color: "#666"
        })
      } : {}, {
        ap: currentIndex.value === totalCount.value - 1 ? 1 : "",
        aq: common_vendor.o(nextQuestion, "3d"),
        ar: isNightMode.value ? 1 : "",
        as: !showAnswer.value && hasAnswered.value
      }, !showAnswer.value && hasAnswered.value ? {
        at: common_vendor.p({
          type: "eye-filled",
          size: "20",
          color: "#fff"
        }),
        av: common_vendor.o(showAnalysisFunc, "3e")
      } : {}, {
        aw: common_vendor.p({
          type: "closeempty",
          size: "22",
          color: "#999"
        }),
        ax: common_vendor.o(closeSettingsPopup, "b1"),
        ay: common_vendor.p({
          type: "eye-slash",
          size: "24",
          color: "#666"
        }),
        az: excludeAnswered.value,
        aA: common_vendor.o(toggleExcludeAnswered, "e8"),
        aB: common_vendor.p({
          type: "font",
          size: "24",
          color: "#666"
        }),
        aC: common_vendor.f(fontSizes, (size, k0, i0) => {
          return {
            a: common_vendor.t(size.label),
            b: size.value,
            c: fontSize.value === size.value ? 1 : "",
            d: common_vendor.o(($event) => setFontSize(size.value), size.value)
          };
        }),
        aD: common_vendor.p({
          type: "calendar",
          size: "24",
          color: "#666"
        }),
        aE: timerEnabled.value,
        aF: common_vendor.o(toggleTimerEnabled, "35"),
        aG: common_vendor.o(closeSettingsPopup, "64"),
        aH: common_vendor.o(applySettings, "66"),
        aI: isNightMode.value ? 1 : "",
        aJ: common_vendor.sr(settingsPopup, "ddba2a24-19", {
          "k": "settingsPopup"
        }),
        aK: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        aL: common_vendor.p({
          type: "closeempty",
          size: "22",
          color: "#999"
        }),
        aM: common_vendor.o(closeCorrectionPopup, "d0"),
        aN: common_vendor.f(correctionTypes, (type, idx, i0) => {
          return {
            a: common_vendor.t(type),
            b: idx,
            c: selectedCorrectionType.value === type ? 1 : "",
            d: common_vendor.o(($event) => selectedCorrectionType.value = type, idx)
          };
        }),
        aO: `请描述${selectedCorrectionType.value || "题目错误"}的详细情况...`,
        aP: correctionContent.value,
        aQ: common_vendor.o(($event) => correctionContent.value = $event.detail.value, "c6"),
        aR: common_vendor.t(correctionContent.value.length),
        aS: common_vendor.o(closeCorrectionPopup, "36"),
        aT: common_vendor.o(handleSubmitCorrection, "a1"),
        aU: !correctionContent.value.trim(),
        aV: common_vendor.sr(correctionPopup, "ddba2a24-24", {
          "k": "correctionPopup"
        }),
        aW: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        }),
        aX: common_vendor.t(hasNote.value ? "编辑笔记" : "添加笔记"),
        aY: common_vendor.o(closeNotePopup, "47"),
        aZ: common_vendor.p({
          type: "closeempty",
          size: "20",
          color: "#999"
        }),
        ba: noteContent.value,
        bb: common_vendor.o(($event) => noteContent.value = $event.detail.value, "18"),
        bc: common_vendor.t(noteContent.value.length),
        bd: hasNote.value
      }, hasNote.value ? {
        be: common_vendor.o(deleteNote, "94")
      } : {}, {
        bf: common_vendor.o(closeNotePopup, "46"),
        bg: common_vendor.o(saveNote, "b2"),
        bh: common_vendor.sr(notePopup, "ddba2a24-26", {
          "k": "notePopup"
        }),
        bi: common_vendor.p({
          type: "bottom",
          ["safe-area"]: false
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ddba2a24"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/practice/practicedetail.js.map
