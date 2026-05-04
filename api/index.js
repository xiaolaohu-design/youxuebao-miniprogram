"use strict";
const utils_request = require("../utils/request.js");
const fetchVideoCourseListToSubPage = (formdata) => utils_request.request.post(`/api/front/getvideocourselisttosubpage`, formdata);
const fetchMP3CourseListToSubPage = (formdata) => utils_request.request.post(`/api/front/getmp3courselisttosubpage`, formdata);
const fetchImageTextCourseListToSubPage = (formdata) => utils_request.request.post(`/api/front/getimagetextcourselisttosubpage`, formdata);
const fetchWinnowCourseListToSubPage = (formdata) => utils_request.request.post(`/api/front/getwinnowcourselisttosubpage`, formdata);
const fetchGetSubjectCategoryList = (UXMID) => utils_request.request.post(`/api/front/getlecturercategory`, {
  UXMID
});
const fetchSubPageCourseWareList = (formdata) => utils_request.request.post(`/api/front/getsubpagecoursewarelist`, formdata);
const fetchSubPageSpecialCourseWareListData = (formdata) => utils_request.request.post(`/api/front/getsubpagespecialcoursewarelistdata`, formdata);
const getNormalExampaperList = (formdata) => utils_request.request.post(`/api/front/getnormalexampaperlistdata`, formdata);
const fetchGroupExampaperList = (formdata) => utils_request.request.post(`/api/front/getgroupexampaperlist`, formdata);
const getCategoriesAll = (UXMID, status) => utils_request.request.post(`/api/front/getcategoriesall`, {
  UXMID,
  status
});
const getArticle = (UXMID, currentPage, pageSize, inputTitle, inputType, inputAuthor, inputStatus, inputFeatured, inputTag) => utils_request.request.post(`/api/front/getarticle`, {
  UXMID,
  currentPage,
  pageSize,
  inputTitle,
  inputType,
  inputAuthor,
  inputStatus,
  inputFeatured,
  inputTag
});
const getMemberLevels = (UXMID) => utils_request.request.post(`/api/front/getmemberlevels`, {
  UXMID
});
const submitFeedback = (formdata) => utils_request.request.post(`/api/front/submitfeedback`, formdata);
const fetchGetMiniCarousel = (formdata) => utils_request.request.post("/api/front/getminicarousel", formdata);
const getCouponsList = (formdata) => utils_request.request.post("/api/front/getcouponslist", formdata);
const fetchSpecificLecturerData = (UXMID, lecturerid) => utils_request.request.post(
  `/api/front/specificlecturerdata`,
  {
    UXMID,
    lecturerid
  }
);
const getVideoCourseList = (formdata) => utils_request.request.post(`/api/front/getvideocourselistdata`, formdata);
const getAudioCourseList = (formData) => utils_request.request.post(`/api/front/getaudiocourselistdata`, formData);
const getImageCourseList = (formData) => utils_request.request.post(`/api/front/getimagecourselistdata`, formData);
const getWinnowCourseList = (formData) => utils_request.request.post(`/api/front/getwinnowcourselistdata`, formData);
const getBasicCourseWareList = (formData) => utils_request.request.post(`/api/front/getbasiccoursewarelistdata`, formData);
const getSpecialCourseWareList = (formData) => utils_request.request.post(`/api/front/getspecialcoursewaredata`, formData);
const getSpecialExampaperData = (formData) => utils_request.request.post(`/api/front/getspecialexampaperdata`, formData);
const getSpecialUniteExampaperData = (formData) => utils_request.request.post(`/api/front/getspecialuniteexampaperdata`, formData);
const fetchGetAboutUs = (formdata) => utils_request.request.post("/api/platform/home/getaboutus", formdata);
const saveSubjectSelection = (formdata) => utils_request.request.post(`/api/frontjwt/savesubjectselection`, formdata);
const getSubjectSelection = (formdata) => utils_request.request.post(`/api/frontjwt/getsubjectselection`, formdata);
const getSubjectCategory = (UXMID) => utils_request.request.post(`/api/frontjwt/getanswersubjectcategory`, {
  UXMID
});
const fetchQuestionBankListID = (formdata) => utils_request.request.post(`/api/front/getsubpagequestionbankid`, formdata);
const fetchPracticeQuestionBankList = (formdata) => utils_request.request.post(`/api/frontjwt/getpracticequestionbanklist`, formdata);
const savePracticeRecords = (formdata) => utils_request.request.post(`/api/frontjwt/savepracticerecords`, formdata);
const getPracticeRecords = (formdata) => utils_request.request.post(`/api/frontjwt/getpracticerecords`, formdata);
const recordBrowseHistory = (formdata) => utils_request.request.post(`/api/frontjwt/recordbrowsehistory`, formdata);
const getBrowseRecord = (formdata) => utils_request.request.post(`/api/frontjwt/getbrowserecord`, formdata);
const recordFavorite = (formdata) => utils_request.request.post(`/api/frontjwt/recordfavorite`, formdata);
const getFavoriteRecord = (formdata) => utils_request.request.post(`/api/frontjwt/getfavoriterecord`, formdata);
const recordFollow = (formdata) => utils_request.request.post(`/api/frontjwt/recordfollow`, formdata);
const getFollowRecord = (formdata) => utils_request.request.post(`/api/frontjwt/getfollowrecord`, formdata);
const recordDownload = (formdata) => utils_request.request.post(`/api/frontjwt/recorddownload`, formdata);
const getUserFavoriteHistory = (formdata) => utils_request.request.post(`/api/frontjwt/getuserfavoritehistory`, formdata);
const getUserBrowseHistory = (formdata) => utils_request.request.post(`/api/frontjwt/getuserbrowsehistory`, formdata);
const getUserDownloadHistory = (formdata) => utils_request.request.post(`/api/frontjwt/getuserdownloadhistory`, formdata);
const getDownloadRecord = (formdata) => utils_request.request.post(`/api/frontjwt/getdownloadrecord`, formdata);
const getUserFollowHistory = (formdata) => utils_request.request.post(`/api/frontjwt/getuserfollowhistory`, formdata);
const deleteFollowHistory = (formdata) => utils_request.request.post(`/api/frontjwt/deletefollowhistory`, formdata);
const getMemberData = (formdata) => utils_request.request.post(`/api/frontjwt/getmemberdata`, formdata);
const getUserCoupons = (formdata) => utils_request.request.post(`/api/frontjwt/getusercoupons`, formdata);
const getSignInRules = (formdata) => utils_request.request.post(`/api/frontjwt/getsigninrules`, formdata);
const memberSignIn = (formdata) => utils_request.request.post(`/api/frontjwt/membersignin`, formdata);
const getSignInDayRecord = (formdata) => utils_request.request.post(`/api/frontjwt/getsigntndayrecord`, formdata);
const editMemberData = (formdata) => utils_request.request.post(`/api/frontjwt/editmemberdata`, formdata);
const sendSmsCaptcha = (formdata) => utils_request.request.post(`/api/frontjwt/sendsmscaptcha`, formdata);
const verifySmsCaptchaInternal = (formdata) => utils_request.request.post(`/api/frontjwt/verifysmscaptchainternal`, formdata);
const verifyAndUpdatePhone = (formdata) => utils_request.request.post(`/api/frontjwt/verifyandupdatephone`, formdata);
const claimUserCoupon = (formdata) => utils_request.request.post(`/api/frontjwt/claimusercoupon`, formdata);
const claimFreeMembership = (formdata) => utils_request.request.post(`/api/frontjwt/claimfreemembership`, formdata);
const createOrder = (formdata) => utils_request.request.post(`/api/frontjwt/createorder`, formdata);
const processPayment = (formdata) => utils_request.request.post(`/api/frontjwt/processpayment`, formdata);
const checkCoursePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkcoursepurchasestatus`, formdata);
const submitCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/submitcoursecomment`, formdata);
const likeCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/likecoursecomment`, formdata);
const getCourseComments = (formdata) => utils_request.request.post(`/api/front/getcoursecomments`, formdata);
const getRelatedRecommendations = (formdata) => utils_request.request.post(`/api/front/getrelatedrecommendations`, formdata);
const checkMp3CoursePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkmp3coursepurchasestatus`, formdata);
const submitMp3CourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/submitmp3coursecomment`, formdata);
const likeMp3CourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/likemp3coursecomment`, formdata);
const getMp3CourseComments = (formdata) => utils_request.request.post(`/api/front/getmp3coursecomments`, formdata);
const getMp3RelatedRecommendations = (formdata) => utils_request.request.post(`/api/front/getmp3relatedrecommendations`, formdata);
const checkImageTextCoursePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkimagetextcoursepurchasestatus`, formdata);
const submitImageTextCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/submitimagetextcoursecomment`, formdata);
const likeImageTextCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/likeimagetextcoursecomment`, formdata);
const getImageTextCourseComments = (formdata) => utils_request.request.post(`/api/front/getimagetextcoursecomments`, formdata);
const getImageTextRelatedRecommendations = (formdata) => utils_request.request.post(`/api/front/getimagetextrelatedrecommendations`, formdata);
const checkWinnowsCoursePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkwinnowscoursepurchasestatus`, formdata);
const submitWinnowsCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/submitwinnowscoursecomment`, formdata);
const likeWinnowsCourseComment = (formdata) => utils_request.request.post(`/api/frontjwt/likewinnowscoursecomment`, formdata);
const getWinnowsCourseComments = (formdata) => utils_request.request.post(`/api/front/getwinnowscoursecomments`, formdata);
const getWinnowsRelatedRecommendations = (formdata) => utils_request.request.post(`/api/front/getwinnowsrelatedrecommendations`, formdata);
const checkCourseWarePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkcoursewarepurchasestatus`, formdata);
const downloadBasicCourseware = (formdata) => utils_request.request.post(`/api/frontjwt/downloadbasiccourseware`, formdata);
const getRelatedCourseWareRecommendations = (formdata) => utils_request.request.post(`/api/front/getrelatedcoursewarerecommendations`, formdata);
const checkSpecialCourseWarePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkspecialcoursewarepurchasestatus`, formdata);
const downloadSpecialCourseware = (formdata) => utils_request.request.post(`/api/frontjwt/downloadspecialcourseware`, formdata);
const getRelatedSpecialCourseWareRecommendations = (formdata) => utils_request.request.post(`/api/front/getrelatedspecialcoursewarerecommendations`, formdata);
const checkExampaperPurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkexampaperpurchasestatus`, formdata);
const downloadExampaperFiles = (formdata) => utils_request.request.post(`/api/frontjwt/downloadexampaperfiles`, formdata);
const getRelatedExampaperRecommendations = (formdata) => utils_request.request.post(`/api/front/getrelatedexampaperrecommendations`, formdata);
const checkGroupExampaperPurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkgroupexampaperpurchasestatus`, formdata);
const downloadGroupExampaperFiles = (formdata) => utils_request.request.post(`/api/frontjwt/downloadgroupexampaperfiles`, formdata);
const getRelatedGroupExampaperRecommendations = (formdata) => utils_request.request.post(`/api/front/getrelatedgroupexampaperrecommendations`, formdata);
const checkPracticePurchaseStatus = (formdata) => utils_request.request.post(`/api/frontjwt/checkpracticepurchasestatus`, formdata);
const getUserOrders = (formdata) => utils_request.request.post(`/api/frontjwt/getuserorders`, formdata);
const deleteUserOrder = (formdata) => utils_request.request.post(`/api/frontjwt/deleteuserorder`, formdata);
const getExchangeRules = (formdata) => utils_request.request.post(`/api/frontjwt/getpointexchangerules`, formdata);
const executeExchange = (formdata) => utils_request.request.post(`/api/frontjwt/executeexchange`, formdata);
const getExchangeRecords = (formdata) => utils_request.request.post(`/api/frontjwt/getexchangerecords`, formdata);
const getUserNotifications = (formdata) => utils_request.request.post(`/api/frontjwt/getusernotifications`, formdata);
const markNotificationAsRead = (formdata) => utils_request.request.post(`/api/frontjwt/markmotificationasread`, formdata);
const createCorrection = (formdata) => utils_request.request.post(`/api/frontjwt/createcorrection`, formdata);
const getLecturerDetail = (formdata) => utils_request.request.post(`/api/frontjwt/getlecturerdetail`, formdata);
exports.checkCoursePurchaseStatus = checkCoursePurchaseStatus;
exports.checkCourseWarePurchaseStatus = checkCourseWarePurchaseStatus;
exports.checkExampaperPurchaseStatus = checkExampaperPurchaseStatus;
exports.checkGroupExampaperPurchaseStatus = checkGroupExampaperPurchaseStatus;
exports.checkImageTextCoursePurchaseStatus = checkImageTextCoursePurchaseStatus;
exports.checkMp3CoursePurchaseStatus = checkMp3CoursePurchaseStatus;
exports.checkPracticePurchaseStatus = checkPracticePurchaseStatus;
exports.checkSpecialCourseWarePurchaseStatus = checkSpecialCourseWarePurchaseStatus;
exports.checkWinnowsCoursePurchaseStatus = checkWinnowsCoursePurchaseStatus;
exports.claimFreeMembership = claimFreeMembership;
exports.claimUserCoupon = claimUserCoupon;
exports.createCorrection = createCorrection;
exports.createOrder = createOrder;
exports.deleteFollowHistory = deleteFollowHistory;
exports.deleteUserOrder = deleteUserOrder;
exports.downloadBasicCourseware = downloadBasicCourseware;
exports.downloadExampaperFiles = downloadExampaperFiles;
exports.downloadGroupExampaperFiles = downloadGroupExampaperFiles;
exports.downloadSpecialCourseware = downloadSpecialCourseware;
exports.editMemberData = editMemberData;
exports.executeExchange = executeExchange;
exports.fetchGetAboutUs = fetchGetAboutUs;
exports.fetchGetMiniCarousel = fetchGetMiniCarousel;
exports.fetchGetSubjectCategoryList = fetchGetSubjectCategoryList;
exports.fetchGroupExampaperList = fetchGroupExampaperList;
exports.fetchImageTextCourseListToSubPage = fetchImageTextCourseListToSubPage;
exports.fetchMP3CourseListToSubPage = fetchMP3CourseListToSubPage;
exports.fetchPracticeQuestionBankList = fetchPracticeQuestionBankList;
exports.fetchQuestionBankListID = fetchQuestionBankListID;
exports.fetchSpecificLecturerData = fetchSpecificLecturerData;
exports.fetchSubPageCourseWareList = fetchSubPageCourseWareList;
exports.fetchSubPageSpecialCourseWareListData = fetchSubPageSpecialCourseWareListData;
exports.fetchVideoCourseListToSubPage = fetchVideoCourseListToSubPage;
exports.fetchWinnowCourseListToSubPage = fetchWinnowCourseListToSubPage;
exports.getArticle = getArticle;
exports.getAudioCourseList = getAudioCourseList;
exports.getBasicCourseWareList = getBasicCourseWareList;
exports.getBrowseRecord = getBrowseRecord;
exports.getCategoriesAll = getCategoriesAll;
exports.getCouponsList = getCouponsList;
exports.getCourseComments = getCourseComments;
exports.getDownloadRecord = getDownloadRecord;
exports.getExchangeRecords = getExchangeRecords;
exports.getExchangeRules = getExchangeRules;
exports.getFavoriteRecord = getFavoriteRecord;
exports.getFollowRecord = getFollowRecord;
exports.getImageCourseList = getImageCourseList;
exports.getImageTextCourseComments = getImageTextCourseComments;
exports.getImageTextRelatedRecommendations = getImageTextRelatedRecommendations;
exports.getLecturerDetail = getLecturerDetail;
exports.getMemberData = getMemberData;
exports.getMemberLevels = getMemberLevels;
exports.getMp3CourseComments = getMp3CourseComments;
exports.getMp3RelatedRecommendations = getMp3RelatedRecommendations;
exports.getNormalExampaperList = getNormalExampaperList;
exports.getPracticeRecords = getPracticeRecords;
exports.getRelatedCourseWareRecommendations = getRelatedCourseWareRecommendations;
exports.getRelatedExampaperRecommendations = getRelatedExampaperRecommendations;
exports.getRelatedGroupExampaperRecommendations = getRelatedGroupExampaperRecommendations;
exports.getRelatedRecommendations = getRelatedRecommendations;
exports.getRelatedSpecialCourseWareRecommendations = getRelatedSpecialCourseWareRecommendations;
exports.getSignInDayRecord = getSignInDayRecord;
exports.getSignInRules = getSignInRules;
exports.getSpecialCourseWareList = getSpecialCourseWareList;
exports.getSpecialExampaperData = getSpecialExampaperData;
exports.getSpecialUniteExampaperData = getSpecialUniteExampaperData;
exports.getSubjectCategory = getSubjectCategory;
exports.getSubjectSelection = getSubjectSelection;
exports.getUserBrowseHistory = getUserBrowseHistory;
exports.getUserCoupons = getUserCoupons;
exports.getUserDownloadHistory = getUserDownloadHistory;
exports.getUserFavoriteHistory = getUserFavoriteHistory;
exports.getUserFollowHistory = getUserFollowHistory;
exports.getUserNotifications = getUserNotifications;
exports.getUserOrders = getUserOrders;
exports.getVideoCourseList = getVideoCourseList;
exports.getWinnowCourseList = getWinnowCourseList;
exports.getWinnowsCourseComments = getWinnowsCourseComments;
exports.getWinnowsRelatedRecommendations = getWinnowsRelatedRecommendations;
exports.likeCourseComment = likeCourseComment;
exports.likeImageTextCourseComment = likeImageTextCourseComment;
exports.likeMp3CourseComment = likeMp3CourseComment;
exports.likeWinnowsCourseComment = likeWinnowsCourseComment;
exports.markNotificationAsRead = markNotificationAsRead;
exports.memberSignIn = memberSignIn;
exports.processPayment = processPayment;
exports.recordBrowseHistory = recordBrowseHistory;
exports.recordDownload = recordDownload;
exports.recordFavorite = recordFavorite;
exports.recordFollow = recordFollow;
exports.savePracticeRecords = savePracticeRecords;
exports.saveSubjectSelection = saveSubjectSelection;
exports.sendSmsCaptcha = sendSmsCaptcha;
exports.submitCourseComment = submitCourseComment;
exports.submitFeedback = submitFeedback;
exports.submitImageTextCourseComment = submitImageTextCourseComment;
exports.submitMp3CourseComment = submitMp3CourseComment;
exports.submitWinnowsCourseComment = submitWinnowsCourseComment;
exports.verifyAndUpdatePhone = verifyAndUpdatePhone;
exports.verifySmsCaptchaInternal = verifySmsCaptchaInternal;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
