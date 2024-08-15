const Follower = require("./follower.model");
const User = require("../user/user.model");
const LiveStreamingHistory = require("../liveStreamingHistory/liveStreamingHistory.model");

//FCM node
var FCM = require("fcm-node");
var config = require("../../config");
var fcm = new FCM(config.SERVER_KEY);

exports.follow = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const fromUserExist = await User.findById(req.body.fromUserId);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(req.body.toUserId);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const followUser = await Follower.findOne({
      $and: [
        {
          fromUserId: fromUserExist._id,
          toUserId: toUserExist._id,
        },
      ],
    });

    if (followUser) {
      return res
        .status(200)
        .send({ status: true, message: "User followed successfully!!" });
    }

    const followerData = {
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    };

    const addFollower = new Follower(followerData);

    addFollower.save(async (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      else {
        await User.updateOne(
          { _id: fromUserExist._id },
          { $inc: { following: 1 } }
        );
        await User.updateOne(
          { _id: toUserExist._id },
          { $inc: { followers: 1 } }
        );

        if (req.body.liveStreamingId) {
          const liveStreamingHistory = await LiveStreamingHistory.findById(
            req.body.liveStreamingId
          );

          if (liveStreamingHistory) {
            liveStreamingHistory.fans += 1;
            await liveStreamingHistory.save();
          }
        }

        return res
          .status(200)
          .send({ status: true, message: "User followed successfully!!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.unFollow = async (req, res) => {
  try {
    if (!req.body.fromUserId || !req.body.toUserId)
      return res
        .status(200)
        .json({ status: false, message: "Invalid Details!" });

    const fromUserExist = await User.findById(req.body.fromUserId);

    if (!fromUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(req.body.toUserId);

    if (!toUserExist) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    Follower.deleteOne({
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    }).exec(async (err, result) => {
      console.log(
        "🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕🍕"
      );
      if (err)
        return res
          .status(500)
          .json({ status: false, message: "Internal Server Error" });
      else {
        if (fromUserExist.following > 0) {
          await User.updateOne(
            { _id: fromUserExist._id },
            { $inc: { following: -1 } }
          );
        }
        if (toUserExist.followers > 0) {
          await User.updateOne(
            { _id: toUserExist._id },
            { $inc: { followers: -1 } }
          );
        }

        return res
          .status(200)
          .send({ status: true, message: "User unFollowed successfully!!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

// hirenbhai: date:6/1/22 toggle follow unFollow
exports.followUnFollow = async (req, res) => {
  console.log(req.body);
  try {
    const { fromUserId, toUserId, liveStreamingId } = req.body;

    if (!fromUserId || !toUserId) {
      return res
        .status(400) // Changed to 400 for bad request
        .json({ status: false, message: "Invalid Details!" });
    }

    const fromUserExist = await User.findById(fromUserId);
    if (!fromUserExist) {
      return res
        .status(404) // Changed to 404 for not found
        .json({ status: false, message: "User does not Exist!" });
    }

    const toUserExist = await User.findById(toUserId);
    if (!toUserExist) {
      return res
        .status(404)
        .json({ status: false, message: "User does not Exist!" });
    }

    const followUser = await Follower.findOne({
      fromUserId: fromUserExist._id,
      toUserId: toUserExist._id,
    });

    if (followUser) {
      // Unfollow logic
      await followUser.deleteOne();
      console.log("Unfollow Done");

      await Promise.all([
        fromUserExist.following > 0 &&
          User.updateOne(
            { _id: fromUserExist._id },
            { $inc: { following: -1 } }
          ),
        toUserExist.followers > 0 &&
          User.updateOne({ _id: toUserExist._id }, { $inc: { followers: -1 } }),
      ]);

      return res.status(200).json({
        status: true,
        message: "User unfollowed successfully!",
        isFollow: false,
      });
    } else {
      // Follow logic
      await new Follower({
        fromUserId: fromUserExist._id,
        toUserId: toUserExist._id,
      }).save();

      if (liveStreamingId) {
        await LiveStreamingHistory.updateOne(
          { _id: liveStreamingId },
          { $inc: { fans: 1 } }
        );
      }

      await Promise.all([
        User.updateOne({ _id: fromUserExist._id }, { $inc: { following: 1 } }),
        User.updateOne({ _id: toUserExist._id }, { $inc: { followers: 1 } }),
      ]);

      if (
        toUserExist &&
        !toUserExist.isBlock &&
        toUserExist.notification.newFollow
      ) {
        const payload = {
          to: toUserExist.fcmToken,
          notification: {
            body: `${fromUserExist.name} started following you.`,
            title: "New Follower",
          },
          data: {
            data: fromUserExist._id,
            type: "USER",
          },
        };

        // Send the FCM notification asynchronously
        fcm.send(payload, (err, response) => {
          if (err) {
            console.error("FCM Error:", err);
          } else {
            console.log("FCM Response:", response);
          }
        });
      }

      console.log("Follow Done");
      return res.status(200).json({
        status: true,
        message: "User followed successfully!",
        isFollow: true,
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: false, message: error.message || "Server Error" });
  }
};

exports.followerList = async (req, res) => {
  try {
    console.log("req.query", req.query);

    // Find the user by the provided userId
    const user = await User.findById(req.query.userId);
    console.log("user", user);

    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User does not exist!" });
    }

    // Find followers where toUserId matches the user's ID
    const followersData = await Follower.find({ toUserId: user._id }).populate(
      "fromUserId"
    );

    console.log("Followers before processing:", followersData);

    if (!followersData || followersData.length === 0) {
      return res
        .status(200)
        .json({ status: true, message: "No followers found", user: [] });
    }

    // Process each follower and check if the current user follows this follower
    const followers = await Promise.all(
      followersData.map(async (follower) => {
        const followerUser = follower.fromUserId;

        if (!followerUser) {
          // Skip processing if the followerUser is not found
          return null;
        }

        // Check if the current user follows this follower
        const isFollow = await Follower.exists({
          fromUserId: user._id,
          toUserId: followerUser._id,
        });

        return {
          userId: followerUser._id,
          name: followerUser.name,
          username: followerUser.username,
          gender: followerUser.gender,
          age: followerUser.age,
          image: followerUser.image,
          coverImage: followerUser.coverImage,
          country: followerUser.country,
          bio: followerUser.bio,
          followers: followerUser.followers,
          following: followerUser.following,
          video: followerUser.video,
          post: followerUser.post,
          isVIP: followerUser.isVIP,
          isFollow: !!isFollow,
        };
      })
    );

    // Filter out any null values that may have been returned
    const validFollowers = followers.filter((follower) => follower !== null);

    console.log("Processed followers:", validFollowers);

    return res
      .status(200)
      .json({ status: true, message: "Success!!", user: validFollowers });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

exports.followingList = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);

    if (!user) {
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    }

    const following = await Follower.aggregate([
      {
        $match: { fromUserId: user._id },
      },
      {
        $lookup: {
          from: "users",
          localField: "toUserId",
          foreignField: "_id",
          as: "following",
        },
      },
      {
        $unwind: {
          path: "$following",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "levels",
          localField: "following.level",
          foreignField: "_id",
          as: "level",
        },
      },
      {
        $unwind: {
          path: "$level",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          userId: "$following._id",
          name: "$following.name",
          username: "$following.username",
          gender: "$following.gender",
          age: "$following.age",
          image: "$following.image",
          country: "$following.country",
          bio: "$following.bio",
          followers: "$following.followers",
          following: "$following.following",
          video: "$following.video",
          post: "$following.post",
          level: "$level",
          isVIP: "$following.isVIP",
        },
      },
      { $addFields: { isFollow: true } },
      {
        $facet: {
          following: [
            { $skip: req.body.start ? parseInt(req.body.start) : 0 }, // how many records you want to skip
            { $limit: req.body.limit ? parseInt(req.body.limit) : 20 },
          ],
        },
      },
    ]);

    return res.status(200).json({
      status: true,
      message: "Success!!",
      user: following[0].following,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};

//get users followers & following list (for admin panel)
exports.followerFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId);
    if (!user)
      return res
        .status(200)
        .json({ status: false, message: "User does not Exist!" });
    if (req.query.type === "following") {
      const following = await Follower.find({ fromUserId: user._id }).populate(
        "toUserId"
      );
      if (!following)
        return res
          .status(200)
          .json({ status: false, message: "Data not found" });
      return res
        .status(200)
        .json({ status: true, message: "Success!!", follow: following });
    } else {
      const follower = await Follower.find({ toUserId: user._id }).populate(
        "fromUserId"
      );
      if (!follower)
        return res
          .status(200)
          .json({ status: false, message: "Data not found" });
      return res
        .status(200)
        .json({ status: true, message: "Success!!", follow: follower });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ status: false, error: error.message || "Server Error" });
  }
};
