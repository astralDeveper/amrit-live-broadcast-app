const ChatTopic = require("./chatTopic.model");
const Conversation = require("./conversation.modle");
const mongoose = require("mongoose");
const User = require("../user/user.model");
const Setting = require("../setting/setting.model");

const dayjs = require("dayjs");
const arrayShuffle = require("shuffle-array");

exports.store = async (req, res) => {
  console.log(req.body);
  try {
    const { senderUserId, receiverUserId } = req.body;
    if (!senderUserId || !receiverUserId) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Details!" });
    }

    const senderUser = await User.findById(senderUserId);
    if (!senderUser) {
      return res
        .status(400)
        .json({ status: false, message: "Sender User does not exist!" });
    }
    const receiverUser = await User.findById(receiverUserId);
    if (!receiverUser) {
      return res
        .status(400)
        .json({ status: false, message: "Receiver User does not exist!" });
    }

    let chatTopic = await ChatTopic.findOne({
      $or: [
        { participants: [senderUserId, receiverUserId] },
        { participants: [receiverUserId, senderUserId] },
      ],
    });

    if (chatTopic) {
      return res
        .status(200)
        .json({ status: true, message: "Success!!", chatTopic });
    }

    chatTopic = new ChatTopic({ participants: [senderUserId, receiverUserId] });
    await chatTopic.save();

    return res
      .status(200)
      .json({ status: true, message: "Success!!", chatTopic });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: false,
        error: error.message || "Internal Server Error!",
      });
  }
};

// exports.getAllChatTopics = async (req, res) => {
//   try {
//     // Fetch all chat topics from the database
//     const chatTopics = await ChatTopic.find();

//     // Return the chat topics in the response
//     return res.status(200).json({ status: true, message: "Success!!", chatTopics });
//   } catch (error) {
//     return res.status(500).json({ status: false, error: error.message || "Internal Server Error!" });
//   }
// };

exports.getAllChatTopics = async (req, res) => {
  try {
    // Fetch all chat topics from the database and populate participants with their names
    const chatTopics = await ChatTopic.find().populate(
      "participants",
      "name image coverImage"
    );

    // Return the chat topics in the response
    return res
      .status(200)
      .json({ status: true, message: "Success!!", chatTopics });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: false,
        error: error.message || "Internal Server Error!",
      });
  }
};
exports.getAllChatTopicsbyId = async (req, res) => {
  try {
    console.log("adsas",req.params)
    // Extract userId from route parameters
    const { userId } = req.params;

    // Fetch chat topics where userId is in the participants array and populate participants with their names and images
    const chatTopics = await ChatTopic.find({
      participants: userId
    }).populate("participants", "name image coverImage");

    // Return the filtered chat topics in the response
    return res
      .status(200)
      .json({ status: true, message: "Success!!", chatTopics });
  } catch (error) {
    return res
      .status(500)
      .json({
        status: false,
        error: error.message || "Internal Server Error!",
      });
  }
};


exports.getChatList = async (req, res) => {
  try {
    const start = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 20;
    const userId = req.query.userId;
    // return

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exist!" });
    }

    const list = await ChatTopic.aggregate([
      {
        $match: { participants: { $in: [mongoose.Types.ObjectId(userId)] } },
      },
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "participantsData",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messagesData",
        },
      },
      {
        $unwind: {
          path: "$participantsData",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $unwind: {
          path: "$messagesData",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          topic: "$_id",
          message: "$messagesData.content",
          date: "$messagesData.date",
          createdAt: "$messagesData.createdAt",
          userId: "$participantsData._id",
          name: "$participantsData.name",
          username: "$participantsData.username",
          image: "$participantsData.image",
          country: "$participantsData.country",
          isVIP: "$participantsData.isVIP",
          isFake: "$participantsData.isFake",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: limit,
      },
    ]);

    let now = dayjs();
    const chatList = list.map((data) => ({
      ...data,
      time:
        now.diff(data.createdAt, "minute") === 0
          ? "Just Now"
          : now.diff(data.createdAt, "minute") <= 60
          ? now.diff(data.createdAt, "minute") + " minutes ago"
          : now.diff(data.createdAt, "hour") >= 24
          ? dayjs(data.createdAt).format("DD MMM, YYYY")
          : now.diff(data.createdAt, "hour") + " hour ago",
    }));

    const setting = await Setting.findOne({}).sort({ createdAt: -1 });
    if (!setting?.isFake) {
      return res.status(200).json({
        status: true,
        message: "Success",
        chatList: chatList,
      });
    } else {
      const fakeData = await User.find({ isFake: true });
      const fakeUser = arrayShuffle(fakeData);

      const fakeStart = start - chatList.length;
      const fakeLimit = Math.min(limit, fakeUser.length - fakeStart + 1);

      const fakeChatList = fakeUser
        .slice(fakeStart, fakeStart + fakeLimit)
        .map((element) => ({
          topic: null,
          message: "hello !",
          date: null,
          createdAt: null,
          userId: element._id,
          name: element.name,
          username: element.username,
          image: element.image,
          country: element.country,
          isVIP: element.isVIP,
          time: "Just now",
          isFake: true,
        }));
      console.log("req.query");
      return res.status(200).json({
        status: true,
        message: "Success",
        chatList: [...chatList, ...fakeChatList],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      error: error.message || "Internal Server Error",
    });
  }
};

// exports.GetConversation = async (req, res) => {
//   try {
//     let auth = req.user;
//     let { id } = req.params;

//     if (!id) {
//       return res
//         .status(400)
//         .json({ message: "Id is required.", status: false });
//     }

//     let conversation = await Conversation.findOne({
//       participants: { $all: [auth?._id, id] },
//     });
//     return res.status(200).json({ conversation, status: false });
//   } catch (error) {
//     return res.status(500).json({ message: error?.message, status: false });
//   }
// };
// exports.DeleteRecentChat = async (req, res) => {
//   try {
//     let { id1, id2 } = req.params;

//     if (!id1 || !id2) {
//       return res
//         .status(400)
//         .json({ message: "Both participant IDs are required.", status: false });
//     }

//     // Find and delete the conversation involving both participants
//     let result = await Conversation.findOneAndDelete({
//       participants: { $all: [id1, id2] },
//     });

//     if (result) {
//       return res
//         .status(200)
//         .json({ message: "Conversation deleted successfully.", status: true });
//     } else {
//       return res
//         .status(404)
//         .json({ message: "Conversation not found.", status: false });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error?.message, status: false });
//   }
// };
// exports.GetConversations = async (req, res) => {
//   try {
//     let auth = req.body;

//     // Check if the user has an active conversation
//     if (auth.activeConversation) {
//       return res.status(403).json({ message: "You are currently in an active conversation", status: false });
//     }

//     let conversations = await Conversation.find({
//       participants: { $all: [auth._id] },
//     }).populate({ path: "participants", select: "name _id image displayName isprofileshown realName" });

//     return res.status(200).json({ conversations, status: true });
//   } catch (error) {
//     return res.status(500).json({ message: error.message, status: false });
//   }
// };

// exports.checkActiveConversation = async (req, res, next) => {
//   try {
//     let auth = req.body;

//     if (auth.activeConversation) {
//       return res.status(403).json({ message: "You are currently in an active conversation", status: false });
//     }

//     next();
//   } catch (error) {
//     return res.status(500).json({ message: error.message, status: false });
//   }
// };

// exports.EndConversation = async (req, res) => {
//   try {
//     let auth = req.body;
//     let { conversationId } = req.body;

//     // Find the conversation and ensure the user is a participant
//     let conversation = await Conversation.findById(conversationId);

//     if (!conversation.participants.includes(auth._id)) {
//       return res.status(403).json({ message: "You are not a participant in this conversation", status: false });
//     }

//     // Clear the active conversation field for all participants
//     await User.updateMany(
//       { _id: { $in: conversation.participants } },
//       { $unset: { activeConversation: "" } }
//     );

//     return res.status(200).json({ message: "Conversation ended", status: true });
//   } catch (error) {
//     return res.status(500).json({ message: error.message, status: false });
//   }
// };

// exports.StartConversation = async (req, res) => {
//   try {
//     let auth = req.body;
//     let { participantId } = req.body;

//     // Check if the user has an active conversation
//     if (auth.activeConversation) {
//       return res.status(403).json({ message: "You are currently in an active conversation", status: false });
//     }

//     // Create a new conversation
//     let conversation = new Conversation({
//       participants: [auth._id, participantId]
//     });

//     await conversation.save();

//     // Update user's active conversation
//     auth.activeConversation = conversation._id;
//     await auth.save();

//     return res.status(201).json({ conversation, status: true });
//   } catch (error) {
//     return res.status(500).json({ message: error.message, status: false });
//   }
// };
