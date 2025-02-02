import express from "express"; 
import {
  registerUser,  
  loginUser,     
  logoutUser,    
  authMiddleware, 
} from "../controllers/auth-controller.js"; 

// Create a new router instance
const router = express.Router();

// Route for user registration
router.post("/register", registerUser); 

// Route for user login
router.post("/login", loginUser); 

// Route for user logout
router.post("/logout", logoutUser); 

// Route to check if the user is authenticated
router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user; 
  res.status(200).json({ 
    success: true,
    message: "Authenticated user!",
    user,
  });
});


export default router;
