import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; 
import axios from "axios"; 


const initialState = {
  approvalURL: null, 
  isLoading: false, 
  orderId: null, 
  orderList: [], 
  orderDetails: null, 
};

// Async thunk for creating a new order
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/create",
      orderData 
    );

    return response.data;
  }
);

// Async thunk for capturing payment
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, payerId, orderId }) => {
    const response = await axios.post(
      "http://localhost:5000/api/shop/order/capture", 
      {
        paymentId,
        payerId,
        orderId,
      }
    );

    return response.data; 
  }
);

// Async thunk for getting all orders by user ID
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/list/${userId}` 
    );

    return response.data; 
  }
);

// Async thunk for getting order details
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/shop/order/details/${id}` 
    );

    return response.data; 
  }
);

// Creating the shopping order slice
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice", 
  initialState, 
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null; 
    },
  },
  extraReducers: (builder) => {
    builder
      // Handling creating a new order
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.approvalURL = action.payload.approvalURL; 
        state.orderId = action.payload.orderId; 
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId) 
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false; 
        state.approvalURL = null; 
        state.orderId = null; 
      })
      // Handling getting all orders by user ID
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.orderList = action.payload.data; 
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false; 
        state.orderList = []; 
      })
      // Handling getting order details
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.orderDetails = action.payload.data; 
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false; 
        state.orderDetails = null; 
      });
  },
});


export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
