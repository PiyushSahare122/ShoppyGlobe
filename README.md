
# API Documentation

This document provides a detailed overview of the API for the shopping application. It includes information about authentication, product management, shopping cart operations, and order processing.

## Table of Contents

- [Base URL](#base-url)
- [Authentication Endpoints](#authentication-endpoints)
- [Product Management Endpoints](#product-management-endpoints)
- [Shopping Cart Endpoints](#shopping-cart-endpoints)
- [Order Management Endpoints](#order-management-endpoints)
- [Error Handling](#error-handling)


## Base URL

The base URL for the API is:
http://localhost:5000/api



## Authentication Endpoints

### 1. Register a New User

- **Endpoint**: `POST /auth/register`
- **Request Body**:
  ```json
  {
    "userName": "string",
    "email": "string",
    "password": "string"
  }

- **Description**: Registers a new user.

### 2. Log In User
-**Endpoint**: `POST /auth/login`
- **Request Body**:
  ```json
  
  {
  "email": "string",
  "password": "string"
  }


- **Description**: Logs in a user and returns authentication tokens.

### 3\. Log Out User

*   **Endpoint**: POST /auth/logout
    
*   **Request Body**: None
    
*   **Description**: Logs out the current user.
    

### 4\. Check Authentication Status

*   **Endpoint**: GET /auth/check-auth
    
*   **Request Body**: None
    
*   **Description**: Checks if the user is authenticated.
    

Product Management Endpoints
----------------------------

### 1\. Get All Products

*   **Endpoint**: GET /shop/products/get
    
*   **Request Body**: None
    
*   **Description**: Retrieves a list of filtered products.
    

### 2\. Get Product Details

*   **Endpoint**: GET /shop/products/get/:id
    
*   **Request Body**: None
    
*   **Description**: Retrieves details of a specific product by ID.
    

Shopping Cart Endpoints
-----------------------

### 1\. Add Item to Cart

*   **Endpoint**: POST /shop/cart/add
     ```json
      {
       "userId": "string",
       "productId": "string",
      "quantity": number
      }

*   **Description**: Adds an item to the user's cart.
    

### 2\. Fetch Cart Items

*   **Endpoint**: GET /shop/cart/get/:userId
    
*   **Request Body**: None
    
*   **Description**: Fetches cart items for a specific user.
    

### 3\. Update Cart Item Quantity

*   **Endpoint**: PUT /shop/cart/update-cart
    
*   **Description**: Updates the quantity of a cart item.
   - **Request Body**:
      ```json
      {
       "userId": "string",
       "productId": "string",
        "quantity": number
       }
    

### 4\. Delete Item from Cart

*   **Endpoint**: DELETE /shop/cart/:userId/:productId
    
*   **Request Body**: None
    
*   **Description**: Deletes a specific item from the cart.

Order Management Endpoints
--------------------------

### 1\. List All Orders for a User

*   **Endpoint**: GET /shop/order/list/:userId
    
*   **Request Body**: None
    
*   **Description**: Retrieves all orders for a specific user.
    

### 2\. Get Order Details

*   **Endpoint**: GET /shop/order/details/:id
    
*   **Request Body**: None
    
*   **Description**: Retrieves details of a specific order by ID.
    

Error Handling
--------------

Each endpoint implements error handling to return appropriate status codes and messages for invalid requests. Common status codes include:

*   **400 Bad Request**: The request could not be understood or was missing required parameters.
    
*   **401 Unauthorized**: Authentication failed or user does not have permissions for the desired action.
    
*   **404 Not Found**: The requested resource was not found.
    
*   **500 Internal Server Error**: An error occurred on the server.
    

Conclusion
----------

This API documentation provides a comprehensive overview of the available endpoints, their request formats, and descriptions. Follow the guidelines for error handling, authentication, and input validation to maintain the integrity and security of the application.



    
