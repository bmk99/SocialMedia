const router = require("express").Router();
const { newMessage, getMessages } = require("../controllers/messages");
const { authUser } = require("../middlewares/auth");

router.post("/newMessage", authUser, newMessage);
router.get("/getMessages/:conversationId", authUser, getMessages);

module.exports = router;
