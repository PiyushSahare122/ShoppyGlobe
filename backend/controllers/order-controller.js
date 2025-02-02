import Order from "../models/Order.js"; 
import Cart from "../models/Cart.js"; 
import Product from "../models/Product.js"; 

// Create Order
export const createOrder = async (req, res) => {
  try {
    
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus = "pending", 
      paymentMethod,
      paymentStatus = "unpaid", 
      totalAmount,
      orderDate = new Date(), 
      orderUpdateDate = new Date(), 
      cartId,
    } = req.body;

    // Create a new order instance
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
    });

    // Save the newly created order to the database
    await newlyCreatedOrder.save();

    // Respond with success message and newly created order ID
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred!", 
    });
  }
};

// Capture Payment
export const capturePayment = async (req, res) => {
  try {
    const { orderId } = req.body; 

   
    let order = await Order.findById(orderId);

    // Check if the order exists
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    // Update order and payment status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";

    // Update stock for each product in the order
    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      // Check if the product exists
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${item.productId}`,
        });
      }

      product.totalStock -= item.quantity; // Reduce product stock by quantity ordered

      await product.save(); // Save the updated product stock
    }

    // Delete the cart associated with the order
    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    // Save the updated order
    await order.save();

    // Respond with success message and order data
    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred!", 
    });
  }
};

// Get All Orders by User
export const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params; 

    
    const orders = await Order.find({ userId });

    // Check if any orders were found
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred!", 
    });
  }
};

// Get Order Details
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params; 

    
    const order = await Order.findById(id);

    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e); 
    res.status(500).json({
      success: false,
      message: "Some error occurred!", 
    });
  }
};
