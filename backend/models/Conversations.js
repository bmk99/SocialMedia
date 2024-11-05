const { mongoose, Schema } = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversations", ConversationSchema);
module.exports = Conversation;
