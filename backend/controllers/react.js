const Reactions = require("../models/React");

exports.postReact = async (req, res) => {
  try {
    const { postRef, react } = req.body;
    const check = await Reactions.findOne({
      postRef: postRef,
      reactBy: req.user.id,
    });
    console.log({check})

    if (check == null) {
      const newReact = new Reactions({
        react: react,
        postRef: postRef,
        reactBy: req.user.id,
      });
      newReact.populate("reactBy", "_id picture first_name last_name username");
      await newReact.save();
      return res.status(201).json(newReact);
    } else {
      if (check.react == react) {
        const updatedReact = await Reactions.findByIdAndRemove(
          check._id
        ).populate("reactBy", "_id picture first_name last_name username");

        return res.status(201).json(updatedReact);
      } else {
        // console.log(react);
        const updatedReact = await Reactions.findByIdAndUpdate(
          check._id,
          {
            react: react,
          },
          { new: true }
        ).populate("reactBy", "_id picture first_name last_name username");
       
        return res.status(201).json(updatedReact);
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getReacts = async (req, res) => {
  try {
    const reactsArray = await Reactions.find({
      postRef: req.params.id,
    }).populate("reactBy", "_id picture first_name last_name username");

    const check = await Reactions.findOne({
      postRef: req.params.id,
      reactBy: req.user.id,
    });

    const newReacts = reactsArray.reduce((accumulator, react) => {
      let key = react["react"];
      if (!accumulator[key]) {
        accumulator[key] = [];
      }
      accumulator[key].push(react);
      return accumulator;
    }, {});
    
    const reacts = [
      {
        react: "like",
        count: newReacts.like ? newReacts.like.length : 0,
        users: newReacts.like ? newReacts.like : [],
      },
      {
        react: "love",
        count: newReacts.love ? newReacts.love.length : 0,
        users: newReacts.love ? newReacts.love : [],
      },
      {
        react: "haha",
        count: newReacts.haha ? newReacts.haha.length : 0,
        users: newReacts.haha ? newReacts.haha : [],
      },
      {
        react: "sad",
        count: newReacts.sad ? newReacts.sad.length : 0,
        users: newReacts.sad ? newReacts.sad : [],
      },
      {
        react: "wow",
        count: newReacts.wow ? newReacts.wow.length : 0,
        users: newReacts.wow ? newReacts.wow : [],
      },
      {
        react: "angry",
        count: newReacts.angry ? newReacts.angry.length : 0,
        users: newReacts.angry ? newReacts.angry : [],
      },
    ];

    return res.status(200).json({
      reacts,
      check: check?.react ,
      total: reactsArray.length,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
