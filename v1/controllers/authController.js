const User = require("../schemas/User");
const Vehicle = require("../schemas/Vehicle");
const jwt = require("jsonwebtoken");

const OTP_CODE = "123456"; // For demo purpose

// In a real application, you would generate a random OTP and send it via SMS
// or email. Here, we are using a static OTP for simplicity.
const signup = async (req, res) => {
  try {
    const { name, role, mobileNumber } = req.body;

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = new User({ name, role, mobileNumber });
    await user.save();

    res.status(201).json({ message: "User created, please verify OTP" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { mobileNumber, option } = req.body;
    const user = await User.findOne({ mobileNumber });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "OTP sent", otp: OTP_CODE });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res
        .status(400)
        .json({ message: "Mobile number and OTP are required" });
    }

    if (otp !== OTP_CODE) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    const user = await User.findOneAndUpdate(
      { mobileNumber },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // If no vehicle selected (e.g., staff login)
    res.json({ message: "OTP verified", token, userData: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login, verifyOtp };
