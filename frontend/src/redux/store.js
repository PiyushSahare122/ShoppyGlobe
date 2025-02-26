import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice"; 
import shopProductsSlice from "./products-slice"; 
import shopCartSlice from "./cart-slice"; 
import shopOrderSlice from "./order-slice"; 

// Configuring the Redux store
const store = configureStore({
  reducer: {
    auth: authReducer, 
    shopProducts: shopProductsSlice, 
    shopCart: shopCartSlice, 
    shopOrder: shopOrderSlice, 
  },
});

export default store; 
