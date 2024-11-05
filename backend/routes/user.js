const express = require("express");
const {
  register,
  login,
  findUser,
  sendResetPasswordCode,
  validateResetCode,
  changepassword,
  getProfile,
  updateProfilePicture,
  updateCover,
  updateDetails,
  addFriend,
  cancelRequest,
  follow,
  unfollow,
  acceptRequest,
  unfriend,
  deleteRequest,
  search,
  addToSearchHistory,
  getSearchHistory,
  removeFromSearch,
  getFriendsPageInfos,
} = require("../controllers/user");
const { authUser } = require("../middlewares/auth");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/findUser", findUser);

router.post("/sendResetPasswordCode", sendResetPasswordCode);
router.post("/validateResetCode", validateResetCode);
router.post("/changepassword", changepassword);

router.get("/getProfile/:identifier", authUser, getProfile);
router.put("/updateProfilePicture", authUser, updateProfilePicture);

router.put("/updateCover", authUser, updateCover);
router.put("/updateDetails", authUser, updateDetails);

router.put("/addFriend/:id", authUser, addFriend);
router.put("/unfriend/:id", authUser, unfriend);

router.put("/follow/:id", authUser, follow);
router.put("/unfollow/:id", authUser, unfollow);


router.post("/search/:searchTerm", authUser, search);
router.put("/addToSearchHistory", authUser, addToSearchHistory);
router.get("/getSearchHistory", authUser, getSearchHistory);
router.put("/removeFromSearch", authUser, removeFromSearch);

router.get("/getFriendsPageInfos", authUser, getFriendsPageInfos);

router.put("/acceptRequest/:id", authUser, acceptRequest);
router.put("/cancelRequest/:id", authUser, cancelRequest);
router.put("/deleteRequest/:id", authUser, deleteRequest);
module.exports = router;
