const express = require("express");
const {
  postComment,
  getComments,
  reactComment,
  editComment,
  deleteComment,
} = require("../controllers/comment");
const { authUser } = require("../middlewares/auth");

const router = express.Router();

router.post("/postComment", authUser, postComment);


router.put("/reactComment", authUser, reactComment);
router.put("/editComment", authUser, editComment);
router.delete("/deleteComment/:commentId", authUser, deleteComment);
router.get("/getComments/:id", authUser, getComments);

module.exports = router;
