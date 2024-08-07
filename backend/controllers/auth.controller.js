import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      gender,
      role,
      course,
      batch,
      courses,
      batches
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set profile picture
    const profilePicture = `https://avatar.iran.liara.run/public/${gender === "male" ? 'boy' : 'girl'}?username=${name}`;

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      gender,
      role,
      avatar: profilePicture,
      ...(role === 'student' && { course, batch }), // Assign course and batch if role is student
      ...(role === 'teacher' && { courses, batches }) // Assign courses and batches if role is teacher
    });

    // Save user
    await newUser.save();

    // Generate JWT Token and set cookie
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      avatar: newUser.avatar,
      role: newUser.role,
      ...(role === 'student' && { course: newUser.course, batch: newUser.batch }), // Include course and batch if role is student
      ...(role === 'teacher' && { courses: newUser.courses, batches: newUser.batches }) // Include courses and batches if role is teacher
    });
  } catch (error) {
    console.log("error in signup controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT Token and set cookie
    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      batch: user.batch,
      courses: user.courses,
      batches: user.batches,
      avatar: user.avatar
    });
  } catch (error) {
    console.log("error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = (req, res) => {
  try {
    // Clear the JWT cookie
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true, secure: true }); // httpOnly prevents client-side access, secure ensures it works only over HTTPS
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("error in logout controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};