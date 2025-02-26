import express from "express"; 
import {
  addToCart,         
  fetchCartItems,   
  deleteCartItem,    
  updateCartItemQty, 
} from "../controllers/cart-controller.js"; 

// Create a new router instance
const router = express.Router();

// Route to add an item to the cart
router.post("/add", addToCart); 

// Route to fetch cart items for a specific user
router.get("/get/:userId", fetchCartItems); 

// Route to update the quantity of a cart item
router.put("/update-cart", updateCartItemQty); 

// Route to delete a specific item from the cart
router.delete("/:userId/:productId", deleteCartItem); 


export default router;
