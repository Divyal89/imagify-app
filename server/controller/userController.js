// import userModel from "../models/userModel.js";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.json({ sucess: false, message: "Missing Details" });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const userData = {
//       name,
//       email,
//       password: hashedPassword,
//     };
//     const newUser = new userModel(userData);
//     const user = await newUser.save();
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.json({ sucess: true, token, user: { name: user.name } });
//   } catch (error) {
//     console.log(error);
//     res.json({ sucess: false, message: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });

//     if (!user) {
//       return res.json({ sucess: false, message: "User Doesn't exit" });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (isMatch) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

//       res.json({ sucess: true, token, user: { name: user.name } });
//     } else {
//       return res.json({ sucess: false, message: "Invalid credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ sucess: false, message: error.message });
//   }
// };

// const userCredits = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const user = await userModel.findById(userId);
//     res.json({
//       success: true,
//       credit: user.creditBalance,
//       user: { name: user.name },
//     });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };
// export { registerUser, loginUser, userCredits };

import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing details",
      });
    }

    // 2. Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 6. SEND RESPONSE (IMPORTANT)
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: { name: user.name },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    // 7. Handle duplicate key safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      success: true,
      token,
      user: { name: user.name },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const userCredits = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);

    return res.json({
      success: true,
      credit: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUser, loginUser, userCredits };
