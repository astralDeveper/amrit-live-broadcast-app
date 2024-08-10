const express = require("express");
const route = express.Router();

const checkAccessWithKey = require("../../checkAccess");

const ChatTopicController = require("./chatTopic.controller");

// get chat list
route.get("/chatList", ChatTopicController.getChatList);


// get chat list
route.get("/allchatList", ChatTopicController.getAllChatTopics);

route.get("/chatListbyid/:userId", ChatTopicController.getAllChatTopicsbyId);

//create chat topic
route.post("/createRoom", ChatTopicController.store);

route.patch('/blockfriend', ChatTopicController.blockUsers);

module.exports = route;
