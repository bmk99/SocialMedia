const { mongoose, Schema } = require("mongoose");
// const User = require("./user");
const { ObjectId } = mongoose.Schema;
const filter = require("../utils/filter");

const commentSchema = new mongoose.Schema(
  {
    postRef: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    comment: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    commentBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    like: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislike: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    parentID: {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    children: [],
    edited: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);


commentSchema.pre("save", async function (next) {
  if (this.comment.length > 0) {
    this.comment = filter.clean(this.comment);
  }
  next();
});

const comment = mongoose.model("comment", commentSchema);
module.exports = comment;
