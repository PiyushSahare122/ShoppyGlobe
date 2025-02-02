import { useNavigate } from "react-router-dom"; 
import { Button } from "./ui/button"; 
import { SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"; 
import UserCartItemsContent from "./cart-item"; 

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate(); 
  // Calculate the total amount for items in the cart
  const totalCartAmount =
    cartItems && cartItems.length > 0 
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0 
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity, 
          0 
        )
      : 0; 

  return (
    <SheetContent className="sm:max-w-md"> 
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle> 
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {/* Render cart items if available */}
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent cartItem={item} />) 
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between"> 
          <span className="font-bold">Total</span> 
          <span className="font-bold">${totalCartAmount.toFixed(2)}</span> 
        </div>
      </div>
      {/* Checkout button that navigates to the checkout page */}
      <Button
        onClick={() => {
          navigate("/shop/checkout"); 
          setOpenCartSheet(false); 
        }}
        className="w-full mt-6" 
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper; 
