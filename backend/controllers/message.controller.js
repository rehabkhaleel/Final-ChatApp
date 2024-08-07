import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Validate message content
    if (!message.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    // Find sender and receiver
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(400).json({ error: "Invalid sender or receiver" });
    }

    // Find or create a conversation
    let conversation;
    if (sender.role === 'teacher' && receiver.role === 'student') {
      conversation = await Conversation.findOne({
        teacher: senderId,
        student: receiverId
      });
      if (!conversation) {
        conversation = await Conversation.create({
          teacher: senderId,
          student: receiverId
        });
      }
    } else if (sender.role === 'student' && receiver.role === 'teacher') {
      conversation = await Conversation.findOne({
        teacher: receiverId,
        student: senderId
      });
      if (!conversation) {
        conversation = await Conversation.create({
          teacher: receiverId,
          student: senderId
        });
      }
    } else {
      return res.status(400).json({ error: "Invalid role combination for conversation" });
    }

    // Create a new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    // Add the new message to the conversation
    conversation.messages.push(newMessage._id);

    // Save the conversation and message in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // Emit message to the receiver via Socket.IO
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    // Find conversation between teacher and student
    let conversation;
    if (await User.findById(senderId).then(user => user.role) === 'teacher') {
      conversation = await Conversation.findOne({
        teacher: senderId,
        student: userToChatId
      }).populate("messages");
    } else {
      conversation = await Conversation.findOne({
        teacher: userToChatId,
        student: senderId
      }).populate("messages");
    }

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
