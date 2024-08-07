import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const loggedInUser = await User.findById(loggedInUserId);

    if (!loggedInUser) {
      return res.status(404).json({ error: "User not found" });
    }

    let filteredUsers;

    if (loggedInUser.role === 'student') {
      // For students, show only teachers
      filteredUsers = await User.find({
        _id: { $ne: loggedInUserId }, // Exclude the logged-in user
        role: 'teacher'
      }).select("-password");
    } else if (loggedInUser.role === 'teacher') {
      // For teachers, show all students in their course and batch
      filteredUsers = await User.find({
        _id: { $ne: loggedInUserId }, // Exclude the logged-in user
        role: 'student',
        course: { $in: loggedInUser.courses },
        batch: { $in: loggedInUser.batches }
      }).select("-password");
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
