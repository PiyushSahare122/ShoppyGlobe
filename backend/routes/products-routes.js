import express from "express"; 
import { getFilteredProducts, getProductDetails } from "../controllers/products-controller.js"; 

// Create a new router instance
const router = express.Router();

// Route to get filtered products
router.get("/get", getFilteredProducts);

// Route to get details of a specific product
router.get("/get/:id", getProductDetails);


export default router;
