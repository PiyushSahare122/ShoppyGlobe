import { Minus, Plus, Trash } from "lucide-react"; 
import { Button } from "./ui/button"; 
import { useDispatch, useSelector } from "react-redux"; 
import { deleteCartItem, updateCartQuantity } from "@/redux/cart-slice"; 
import { useToast } from "./ui/use-toast"; 

function UserCartItemsContent({ cartItem }) {
  // Selecting necessary state from the Redux store
  const { user } = useSelector((state) => state.auth); // Get user info from auth state
  const { cartItems } = useSelector((state) => state.shopCart); // Get cart items from shopCart state
  const { productList } = useSelector((state) => state.shopProducts); // Get product list from shopProducts state
  const dispatch = useDispatch(); 
  const { toast } = useToast(); // Getting the toast function to show notifications

  // Function to handle quantity updates of the cart item
  function handleUpdateQuantity(getCartItem, typeOfAction) {
    // Check if the action is to increase the quantity
    if (typeOfAction == "plus") {
      let getCartItems = cartItems.items || []; // Get current cart items

      if (getCartItems.length) {
        // Find index of current cart item
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        );

        // Find the current product in the product list
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        );

        // Get the total stock available for the product
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        console.log(getCurrentProductIndex, getTotalStock, "getTotalStock"); 

        // Check if the item exists in the cart
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity; // Get current quantity

          // If trying to exceed stock, show a toast notification
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: "destructive", // Style variant for error notification
            });

            return; // Exit the function to prevent further execution
          }
        }
      }
    }

    // Dispatching the action to update cart quantity
    dispatch(
      updateCartQuantity({
        userId: user?.id, // Pass user ID
        productId: getCartItem?.productId, // Pass product ID
        quantity: typeOfAction === "plus" // Determine new quantity based on action
          ? getCartItem?.quantity + 1
          : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      // Show success toast if update is successful
      if (data?.payload?.success) {
        toast({
          title: "Cart item is updated successfully",
        });
      }
    });
  }

  // Function to handle deleting a cart item
  function handleCartItemDelete(getCartItem) {
    // Dispatching the action to delete the cart item
    dispatch(
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      // Show success toast if deletion is successful
      if (data?.payload?.success) {
        toast({
          title: "Cart item is deleted successfully",
        });
      }
    });
  }

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image} 
        alt={cartItem?.title} 
        className="w-20 h-20 rounded object-cover" 
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3> 
        <div className="flex items-center gap-2 mt-1">
          {/* Button to decrease item quantity */}
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1} 
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span> 
          {/* Button to increase item quantity */}
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
          {/* Calculate and display total price for this cart item */}
        </p>
        {/* Trash icon button for deleting the cart item */}
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemsContent; 
