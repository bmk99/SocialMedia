const commentSchema = require("../models/Comments");

exports.postComment = async (req, res) => {
  try {
    const { postRef, comment, image, parentID } = req.body;
    // if (!commentSchema.find({ _id: parentID })) {
    //   throw new Error("parentid not found");
    // }
    if (!postRef) {
      throw new Error("post ref required");
    }
    const commentData = {
      postRef: postRef,
      comment: comment,
      image: image,
      commentBy: req.user.id,
    };
    parentID && (commentData.parentID = parentID);
    console.log({parentID})
    console.log({commentData})
    const newComment = new commentSchema(commentData);
    await newComment.save();
    await newComment.populate(
      "commentBy",
      "picture first_name last_name username gender"
    );
    return res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.getComments = async (req, res) => {
  const { id } = req.params;
  try {
    const allComments = await commentSchema
      .find({ postRef: id })
      .populate("commentBy", "first_name last_name picture username gender");

    const originalComments = allComments.reduce((accumulator, comment) => {
      if (comment.parentID) {
        allComments.forEach((user) => {
          if (comment.parentID.toString() === user._id.toString()) {
            user.children.push(comment);
          }
        });
      } else {
        accumulator.push(comment);
      }

      return accumulator;
    }, []);

    return res.status(200).json(originalComments);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

exports.reactComment = async (req, res) => {
  const { commentId, react } = req.body;

  try {
    const user = req.user.id;
    const comment = await commentSchema
      .findById(commentId)
      .populate("commentBy", "first_name last_name picture username gender");

    if (react) {
      if (comment.like.includes(user)) {
        comment.like.pull(user);
        await comment.save();
        console.log("removed");

        return res
          .status(200)
          .json({ status: false, message: "removed the like", comment });
      } else {
        comment.dislike.includes(user) && comment.dislike.pull(user);
        comment.like.push(user);
        await comment.save();
        console.log("saved");
        return res
          .status(200)
          .json({ status: true, message: "liked the comment ", comment });
      }
    } else {
      if (comment.dislike.includes(user)) {
        comment.dislike.pull(user);
        await comment.save();

        return res
          .status(200)
          .json({ status: false, message: "undo the disliked ", comment });
      } else {
        comment.like.includes(user) && comment.like.pull(user);
        comment.dislike.push(user);
        await comment.save();

        return res
          .status(200)
          .json({ status: true, message: "disliked the comment ", comment });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.editComment = async (req, res) => {
  const { commentId, text, image } = req.body;
  const comment = await commentSchema
    .findById(commentId)
    .populate("commentBy", "first_name last_name picture username gender");
  try {
    if (comment.edited === false) comment.edited = true;
    comment.comment = text;
    comment.image !== image && (comment.image = image);
    await comment.save();
    return res.status(200).json({ message: "edited succes fully", comment });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await commentSchema.findById(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (deletedComment.commentBy != req.user.id) {
      throw new Error("Not authorized to delete comment");
    }
    
    await deletedComment.deleteOne();
    await commentSchema.deleteMany({ parentID: commentId });

    return res.status(200).json(deletedComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting comment", error });
  }
};
