const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../utils/generateToken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = Token.generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed.", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = Token.generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role, // ضروري عشان الفرونت اند يعرف هل هو أدمن ولا لأ
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed.", error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch user.", error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    // منع الأدمن إنه يشيل صلاحية admin عن نفسه بالغلط
    if (req.user._id.toString() === id && updates.role && updates.role !== "admin") {
      return res
        .status(400)
        .json({ message: "لا يمكنك تغيير صلاحيتك الخاصة." });
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update user.", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // منع الأدمن إنه يحذف حسابه هو نفسه
    if (req.user._id.toString() === id) {
      return res
        .status(400)
        .json({ message: "لا يمكنك حذف حسابك الخاص." });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete user.", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch users.", error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, email, password } = req.body;

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile.", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  updateProfile, // إضافة جديدة
};

