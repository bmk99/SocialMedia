const { mongoose, Schema } = require("mongoose");

const MessagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversations",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model("Messages", MessagesSchema);

module.exports = Messages;
