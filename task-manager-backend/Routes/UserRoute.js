const express = require("express");
const userRoute = express.Router();
const { User } = require("../Model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authentication } = require("../Middlewares/Authentication");
const nodemailer = require("nodemailer");

require("dotenv").config();

const otpStore = {};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//register
userRoute.post("/signup", async (req, res) => {
  const { username, mobileNo, email, password, role } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ mobileNo });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "mobileNo already exists", status: false });
    }
    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", status: false });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      mobileNo,
      role,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      status: true,
      user: {
        username: newUser.username,
        mobileno: newUser.mobileNo,
        emial: newUser.email,
        _id: newUser._id,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User Login Route
userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", status: false });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid password", status: false });
    }

    // Generate a JWT token
    const token = jwt.sign({ user: user }, process.env.SECRET_KEY, {
      // expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      user: user,
      token: token,
      status: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

userRoute.get("/get/user", authentication, async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Prepare the response
    const response = {
      _id: user._id,
      username: user.username,
      mobileNo: user.mobileNo,
      email: user.email,
      roll: user.roll,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    res.status(200).send(response);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Forgot password - Send OTP
userRoute.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", status: false });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    res.status(200).json({ message: "OTP sent successfully", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

// Reset Password
userRoute.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!otpStore[email] || otpStore[email].otp !== parseInt(otp)) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP", status: false });
    }

    if (Date.now() > otpStore[email].expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired", status: false });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    // Clear OTP after successful reset
    delete otpStore[email];

    res
      .status(200)
      .json({ message: "Password reset successful", status: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", status: false });
  }
});

module.exports = { userRoute };
