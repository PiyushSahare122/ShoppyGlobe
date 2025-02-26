import express from "express"; 
import {
  createOrder,        
  getAllOrdersByUser,   
  getOrderDetails,      
  capturePayment,       
} from "../controllers/order-controller.js"; 


const router = express.Router();

// Route to create a new order
router.post("/create", createOrder); 

// Route to capture payment for an order
router.post("/capture", capturePayment); 

// Route to get all orders for a specific user
router.get("/list/:userId", getAllOrdersByUser); 

// Route to get details of a specific order
router.get("/details/:id", getOrderDetails); 


export default router;
