const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign Up
exports.register = async (req, res) => {
  try {
    console.log("Received signup request:", req.body); // Log request body

    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      console.error("User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Creating new user...");
    user = new User({ name, email, password, role });

    console.log("Hashing password...");
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    console.log("Saving user to database...");
    await user.save();

    console.log("User saved successfully:", user.email);
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" }, (err, token) => {
      if (err) {
        console.error("JWT Signing Error:", err);
        return res.status(500).json({ message: "Error generating token" });
      }
      console.log("Token generated successfully");
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    });

  } catch (err) {
    console.error("Unexpected Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Login user
exports.login = async (req, res) => {
  try {
    console.log("Received login request:", req.body); // Log request body

    const { email, password } = req.body;
    if (!email || !password) {
      console.error("Missing email or password");
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("User found:", user.email); // Log user found

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("Password does not match for:", user.email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Password matches, generating token...");
    const payload = { user: { id: user.id, role: user.role } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "3d" }, (err, token) => {
      if (err) {
        console.error("JWT Signing Error:", err);
        return res.status(500).json({ message: "Error generating token" });
      }
      console.log("Token generated successfully");
      res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    });

  } catch (err) {
    console.error("Unexpected Server Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
