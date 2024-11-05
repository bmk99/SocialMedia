const ConversationSchema = require("../models/Conversations");
const User = require("../models/User");

exports.newConversation = async (req, res) => {
  const user1Id = req.body.user1;
  const user2Id = req.body.user2;

  const user1 = await User.findById(user1Id);
  const user2 = await User.findById(user2Id);

  if (!user1 || !user2) {
    return res.status(404).json({ error: "One or both users not found" });
  }

  if (!user1.friends.includes(user2Id) || !user2.friends.includes(user1Id)) {
    return res.status(403).json({ error: "Users are not friends" });
  }

  const existingConversation = await ConversationSchema.findOne({
    members: { $all: [user1Id, user2Id] },
  });

  if (existingConversation) {
    return res
      .status(200)
      .json({ message: "Conversation already exists", ok: true });
  }

  const newConversation = new ConversationSchema({
    members: [user1Id, user2Id],
  });

  try {
    const savedConversation = await newConversation.save();
    return res.status(200).json({ ok: true, savedConversation });
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.getConversation = async (req, res) => {
  try {
    const conversation = await ConversationSchema.find({
      members: { $in: [req.params.userId] },
    }).populate("members", "-password");

    return res.status(200).json(conversation);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
