import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import User from "../models/user.js"; 

// Register a new user
export const registerUser = async (req, res) => {
  const { userName, email, password } = req.body; 
  try {
    // Check if a user with the given email already exists
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message: "User already exists with the same email! Please try again.",
      });
    }

    // Hash the password before saving it
    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword, 
    });

    // Save the new user to the database
    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred.",
    });
  }
};

// Login an existing user
export const loginUser = async (req, res) => {
  const { email, password } = req.body; 
  

  try {
    // Check if the user exists in the database
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please register first.",
      });
    }

    // Compare the provided password with the stored hashed password
    const checkPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign(
      {
        id: checkUser._id, 
        role: checkUser.role, 
        email: checkUser.email, 
        userName: checkUser.userName, 
      },
      "CLIENT_SECRET_KEY", 
      { expiresIn: "60m" } 
    );

    // Set the token in an HTTP-only cookie and send a response
    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully.",
      user: {
        email: checkUser.email, 
        role: checkUser.role,
        id: checkUser._id, 
        userName: checkUser.userName, 
      },
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred.",
    });
  }
};

// Logout the user
export const logoutUser = (req, res) => {
  // Clear the token cookie to log the user out
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

// Authentication middleware to protect routes
export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token; 
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!", 
    });
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    req.user = decoded; // Attach the decoded user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!", 
    });
  }
};
