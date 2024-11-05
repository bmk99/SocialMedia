const {
  validateEmail,
  validateLength,
  validateUsername,
} = require("../helpers/validate");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Post = require("../models/Post");
const { sendResetCode } = require("../helpers/mailer");
const Code = require("../models/code");
const generateCode = require("../helpers/generatecode");
const mongoose = require("mongoose");

exports.register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      bYear,
      bMonth,
      bDay,
      gender,
    } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid Email Address",
      });
    }
    const check = await User.findOne({ email });
    if (check) {
      return res.status(400).json({
        message: "Email already exists try with different email address",
      });
    }
    if (!validateLength(first_name, 3, 30)) {
      return res.status(400).json({
        message: "first name between 3 to 30 charectors",
      });
    }
    if (!validateLength(last_name, 1, 10)) {
      return res.status(400).json({
        message: "last name between 3 to 10 charectors",
      });
    }
    if (!validateLength(password, 6, 10)) {
      return res.status(400).json({
        message: "password between 6 charectors",
      });
    }
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password should be between 6 and 15 characters and must include at least one lowercase letter, one uppercase letter, one number, and one special character (@$!%*?&).",
      });
    }
    const cryptpassword = await bcrypt.hash(password, 12);
    let tempusername = first_name + last_name;
    let newusername = await validateUsername(tempusername);
    const user = await new User({
      first_name,
      last_name,
      email,
      password: cryptpassword,
      username: newusername,
      bYear,
      bMonth,
      bDay,
      gender,
    }).save();

    res.send({
      _id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      message: "Your Account created Succesfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "The entered email address is not connected to your account.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials. Please try again." });
    }

    const token = jwt.sign(
      { id: user._id.toString(), username: user.username },
      "secretkey",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      _id: user._id,
      username: user.username,
      picture: user.picture,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      picture: user.picture,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.findUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "Account doesn't exists",
      });
    }
    return res.status(200).json({
      email: user.email,
      picture: user.picture,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.sendResetPasswordCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");
    await Code.findOneAndRemove({ user: user._id });
    const code = generateCode(5);
    const savedcode = await new Code({
      code,
      user: user._id,
    }).save();
    sendResetCode(user.email, user.first_name, code);
    return res.status(200).json({
      message: "email Reset code has been send to email",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.validateResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    console.log(code);
    const user = await User.findOne({ email });
    const Dbcode = await Code.findOne({
      user: user._id,
    });
    console.log(user._id);
    if (Dbcode.code !== code) {
      return res.status(400).json({
        message: "Verfication does't exists",
      });
    }
    return res.status(200).json({ message: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.changepassword = async (req, res) => {
  const { email, password } = req.body;
  const cryptPassword = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    {
      password: cryptPassword,
    }
  );
  return res.status(200).json({ message: "ok" });
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      picture: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCover = async (req, res) => {
  try {
    const { url } = req.body;

    await User.findByIdAndUpdate(req.user.id, {
      cover: url,
    });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDetails = async (req, res) => {
  try {
    const { infos } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        details: infos,
      },
      {
        new: true,
      }
    );
    res.json(updated.details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const { identifier } = req.params;

    let profile;

    tId = mongoose.Types.ObjectId.isValid(identifier);

    const isObjectId = /^[a-f\d]{24}$/i.test(identifier);

    if (isObjectId) {
      profile = await User.findById(identifier).select("-password");
    } else {
      profile = await User.findOne({ username: identifier }).select(
        "-password"
      );
    }
    const user = await User.findById(req.user.id);
    const friendship = {
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    };
    if (!profile) {
      return res.status(500).json({ ok: false, message: "User not found." });
    }

    if (
      user.friends.includes(profile._id) &&
      profile.friends.includes(user._id)
    ) {
      friendship.friends = true;
    }
    if (user.following.includes(profile._id)) {
      friendship.following = true;
    }
    if (user.requests.includes(profile._id)) {
      friendship.requestReceived = true;
    }
    if (profile.requests.includes(user._id)) {
      friendship.requestSent = true;
    }

    const posts = await Post.find({ user: profile._id })
      .populate("user")

      .sort({ createdAt: -1 });
    await profile.populate("friends", "first_name last_name username picture");

    res.json({ ...profile.toObject(), friendship, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      const receiverName = receiver.username;

      if (
        !receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $push: { requests: sender._id },
        });
        if (
          !receiver.followers.includes(sender._id) &&
          !sender.following.includes(receiver._id)
        ) {
          await receiver.updateOne({
            $push: { followers: sender._id },
          });
          await sender.updateOne({
            $push: { following: receiver._id },
          });
          return res.json({
            message: ` Hey Friend Request sent  succesfully to ${receiverName} and follwing also `,
          });
        }

        return res.json({
          message: `Hey you already following and Now Friend Request sent succesfully to ${receiverName}  `,
        });
      } else {
        return res.status(400).json({
          message: `Hey Friend Request already sent to ${receiverName}`,
        });
      }
    } else {
      const senders = await User.findById(req.user.id);
      const senderName = senders.username;

      return res.status(400).json({
        message: `Einstein you can't Send the Friend Request To yourself  --- ${senderName} `,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.cancelRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      const receiverName = receiver.username;
      if (
        receiver.requests.includes(sender._id) &&
        !receiver.friends.includes(sender._id)
      ) {
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        return res.json({
          message: `your friend request to ${receiverName} has been cancelled ,Enjoy  `,
        });
      } else {
        return res.status(400).json({
          message: `You Already cancelled the friend request with ${receiverName} why again doing?`,
        });
      }
    } else {
      const senders = await User.findById(req.user.id);
      const senderName = senders.username;

      return res.status(400).json({
        message: `Einstein You can't cancel the request to yourself -${senderName}`,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.follow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      const receiverName = receiver.username;
      if (
        !receiver.followers.includes(sender._id) &&
        !sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $push: { followers: sender._id },
        });
        await sender.updateOne({
          $push: { following: receiver._id },
        });
        return res.json({
          message: `you are following  --${receiverName}  succesfully   `,
        });
      } else {
        return res.status(400).json({
          message: `You Already following the  ---${receiverName},  why again doing?`,
        });
      }
    } else {
      const senders = await User.findById(req.user.id);
      const senderName = senders.username;

      return res
        .status(400)
        .json({ message: `Einstein You can't follow yourself -${senderName}` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfollow = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const sender = await User.findById(req.user.id);
      const receiver = await User.findById(req.params.id);
      const receiverName = receiver.username;
      if (
        receiver.followers.includes(sender._id) &&
        sender.following.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: { followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });
        res.json({
          message: `you are unfollowing  --${receiverName}  succesfully   `,
        });
      } else {
        return res.status(400).json({
          message: `You Already unfollowing the  ---${receiverName},  why again doing?`,
        });
      }
    } else {
      const senders = await User.findById(req.user.id);
      const senderName = senders.username;

      return res.status(400).json({
        message: `Einstein You can't unfollow yourself -${senderName}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      const senderName = sender.username;
      const receiverName = receiver.username;
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $push: { friends: sender._id, following: sender._id },
        });
        await sender.updateOne({
          $push: { friends: receiver._id, followers: receiver._id },
        });
        await receiver.updateOne({
          $pull: { requests: sender._id },
        });
        res.json({
          message: `you(${receiverName}) are accepting the request from  --${senderName}  ,Now ${senderName}  and ${receiverName}  are friends`,
        });
      } else {
        return res.status(400).json({
          message: `You Already friends with ${senderName},  why again doing?`,
        });
      }
    } else {
      const receivers = await User.findById(req.user.id);
      const receiverNames = receivers.username;

      return res.status(400).json({
        message: `Einstein You can't accept requestyourself -${receiverNames}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.unfriend = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      const senderName = sender.username;
      const receiverName = receiver.username;
      if (
        receiver.friends.includes(sender._id) &&
        sender.friends.includes(receiver._id)
      ) {
        await receiver.updateOne({
          $pull: {
            friends: sender._id,
            following: sender._id,
            followers: sender._id,
          },
        });
        await sender.updateOne({
          $pull: {
            friends: receiver._id,
            followers: receiver._id,
            following: receiver._id,
          },
        });

        res.json({
          message: `${receiverName} and ${senderName} are not friends `,
        });
      } else {
        return res.status(400).json({
          message: `not friends with ${senderName} and ${receiverName} why again doing?`,
        });
      }
    } else {
      const receivers = await User.findById(req.user.id);
      const receiverNames = receivers.username;

      return res.status(400).json({
        message: `Einstein You can't unfriend  with yourself -${receiverNames}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    if (req.user.id !== req.params.id) {
      const receiver = await User.findById(req.user.id);
      const sender = await User.findById(req.params.id);
      const senderName = sender.username;
      const receiverName = receiver.username;
      if (receiver.requests.includes(sender._id)) {
        await receiver.updateOne({
          $pull: { requests: sender._id, followers: sender._id },
        });
        await sender.updateOne({
          $pull: { following: receiver._id },
        });

        return res.json({
          message: `${receiverName} deleted request that sent by the ${senderName} `,
        });
      } else {
        return res
          .status(400)
          .json({ message: `already deleted the request ` });
      }
    } else {
      const receivers = await User.findById(req.user.id);
      const receiverNames = receivers.username;

      return res.status(400).json({
        message: `Einstein You can't unfriend  with yourself -${receiverNames}`,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const results = await User.find({ $text: { $search: searchTerm } }).select(
      "first_name last_name username picture"
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToSearchHistory = async (req, res) => {
  try {
    const { searchUser } = req.body;
    const search = {
      user: searchUser,
      createdAt: new Date(),
    };
    const user = await User.findById(req.user.id);
    const check = user.search.find((x) => x.user.toString() === searchUser);
    if (check) {
      await User.updateOne(
        {
          _id: req.user.id,
          "search._id": check._id,
        },
        {
          $set: { "search.$.createdAt": new Date() },
        }
      );
    } else {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          search,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSearchHistory = async (req, res) => {
  try {
    const results = await User.findById(req.user.id)
      .select("search")
      .populate("search.user", "first_name last_name username picture");
    res.json(results.search);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromSearch = async (req, res) => {
  try {
    const { searchUser } = req.body;
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $pull: { search: { user: searchUser } } }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFriendsPageInfos = async (req, res) => {
  try {
    const current_user = await User.findById(req.user.id)
      .select("friends requests")
      .populate("friends", "first_name last_name picture username")
      .populate("requests", "first_name last_name picture username");

    const sentRequests = await User.find({
      requests: req.user.id,
    }).select("first_name last_name picture username");

    const allUsers = await User.find()
      .select("first_name last_name picture username")
      .sort({ createdAt: -1 });

    const updatedAllUsers = allUsers.filter((user) => {
      const isFriend = current_user.friends.some((friend) =>
        friend._id.equals(user._id)
      );
      const hasReceivedRequest = sentRequests.some((sentUser) =>
        sentUser._id.equals(user._id)
      );
      const hasSentRequest = current_user.requests.some((requestUser) =>
        requestUser._id.equals(user._id)
      );
      return (
        !isFriend &&
        !hasReceivedRequest &&
        !hasSentRequest &&
        !user._id.equals(req.user.id)
      );
    });

    res.status(200).json({
      friends: current_user.friends,
      requests: current_user.requests,
      sentRequests,
      allUsers: updatedAllUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
