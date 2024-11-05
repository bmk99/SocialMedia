const router = require("express").Router();
const { authUser } = require("../middlewares/auth");

const {
  newConversation,
  getConversation,
} = require("../controllers/conversations");


router.post("/newConversation", authUser, newConversation);
router.get("/getConversation/:userId", authUser, getConversation);

module.exports = router;
