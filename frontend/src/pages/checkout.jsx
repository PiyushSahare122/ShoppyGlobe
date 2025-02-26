import { useDispatch, useSelector } from "react-redux"; 
import UserCartItemsContent from "@/components/cart-item"; 
import { Button } from "@/components/ui/button"; 
import { useState } from "react"; 
import { createNewOrder } from "@/redux/order-slice"; 
import { useToast } from "@/components/ui/use-toast"; 

// Functional component for the Shopping Checkout
function ShoppingCheckout() {
  // Accessing cart items and user information from the Redux store
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [isPaymentStart, setIsPaymentStart] = useState(false); 
  const dispatch = useDispatch(); 
  const { toast } = useToast(); 

  // Calculate the total amount of the cart
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice 
              : currentItem?.price) * 
              currentItem?.quantity,
          0
        )
      : 0; 

  // Function to initiate a dummy payment (simulating a payment process)
  function handleInitiateDummyPayment() {
    // Check if the cart is empty
    if (cartItems.items.length === 0) {
      toast({
        title: "Your cart is empty. Please add items to proceed.",
        variant: "destructive", 
      });
      return; 
    }

    // Prepare order data similar to what would be sent to a payment provider
    const orderData = {
      userId: user?.id, 
      cartId: cartItems?._id, 
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId, 
        title: singleCartItem?.title, 
        image: singleCartItem?.image, 
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice 
            : singleCartItem?.price, 
        quantity: singleCartItem?.quantity, 
      })),
      orderStatus: "pending", 
      paymentMethod: "COD", 
      paymentStatus: "pending", 
      totalAmount: totalCartAmount, 
      orderDate: new Date(), 
      orderUpdateDate: new Date(), 
    };

    setIsPaymentStart(true); 

    // Dispatch the order creation action
    dispatch(createNewOrder(orderData)).then((data) => {
      // Simulate payment processing after order creation
      setTimeout(() => {
        if (data?.payload?.success) { 
          const completedOrderData = {
            ...orderData,
            orderStatus: "completed", 
            paymentStatus: "completed", 
          };

          // Dispatch an action to save the completed order
          dispatch(createNewOrder(completedOrderData)).then((orderDataResult) => {
            if (orderDataResult?.payload?.success) { 
             
              
              toast({
                title: "Payment Successful!",
                description: "Your order has been placed.",
                variant: "success", 
              });
              // Reset payment state
              setIsPaymentStart(false);
            } else {
              // Notify user of order update failure
              toast({
                title: "Order Update Failed",
                description: "There was an issue updating your order status. Please try again.",
                variant: "destructive", 
              });
              setIsPaymentStart(false); 
            }
          });
        } else {
          // Notify user of payment failure
          toast({
            title: "Payment Failed",
            description: "There was an issue processing your payment. Please try again.",
            variant: "destructive", 
          });
          setIsPaymentStart(false); 
        }
      }, 2000); 
    });
  }

  return (
    <div className="flex flex-col"> {/* Main container for the checkout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5"> 
        <div className="flex flex-col gap-4"> 
          {/* Display cart items */}
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} /> 
              ))
            : null} 
          {/* Total and checkout button */}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between"> 
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span> 
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button onClick={handleInitiateDummyPayment} className="w-full"> 
              {isPaymentStart ? "Processing Payment..." : "Checkout"} 
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout; 
