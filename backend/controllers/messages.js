const MessagesSchema = require("../models/Messages");
const User = require("../models/User");

exports.newMessage = async (req, res) => {
  const { conversationId, senderId, text } = req.body;

  try {
    const newMessage = await MessagesSchema.create({
      conversationId,
      senderId,
      text,
    });

    const populatedMessage = await MessagesSchema.populate(
      newMessage,
      "senderId",
      "-password"
    );

    return res.status(200).json(populatedMessage);
  } catch (err) {
    return res.status(500).json({ error: "Error creating a new message." });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await MessagesSchema.find({
      conversationId: req.params.conversationId,
    }).populate("senderId", "-password");
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};
