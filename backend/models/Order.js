import mongoose from "mongoose"; 

// Define the Order schema
const OrderSchema = new mongoose.Schema({
  // The ID of the user who placed the order
  userId: String,

  // The ID of the cart associated with the order
  cartId: String,
  
  // An array of items included in the order
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      quantity: Number,
    },
  ],
  
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  orderDate: Date,
  orderUpdateDate: Date,
  paymentId: String, 
  payerId: String,
});


export default mongoose.model("Order", OrderSchema);
