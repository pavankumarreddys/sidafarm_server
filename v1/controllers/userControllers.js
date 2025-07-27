const User = require("../schemas/User");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error("Error fetching all users:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};
const getCurrentUserByToken = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is stored in req.user by validateToken middleware
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching current user by token:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error("Error fetching user by ID:", err);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: err.message });
  }
};


module.exports = { getAllUsers, getUserById ,getCurrentUserByToken};
