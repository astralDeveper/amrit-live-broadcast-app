const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isBlockUser: {
    type: Boolean,
    default: false,
  },
});

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const chatTopicSchema = new mongoose.Schema(
  {
    participants: [ParticipantSchema], // Array of participants with block status
    messages: [MessageSchema], // Array of messages in the chat topic
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
    versionKey: false,
  }
);

// Indexes to optimize querying
chatTopicSchema.index({ "participants.userId": 1 });
chatTopicSchema.index({ "messages.sender": 1 });

module.exports = mongoose.model("ChatTopic", chatTopicSchema);
