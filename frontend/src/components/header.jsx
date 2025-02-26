import { LogOut, Menu, ShoppingCart, UserCog } from "lucide-react"; 
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom"; 
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"; 
import { Button } from "./ui/button"; 
import { useDispatch, useSelector } from "react-redux"; 
import{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; 
import { Avatar, AvatarFallback } from "./ui/avatar"; 
import { logoutUser } from "@/redux/auth-slice"; 
import UserCartWrapper from "./cart"; 
import { useEffect, useState } from "react"; 
import { fetchCartItems } from "@/redux/cart-slice"; 
import { Label } from "./ui/label"; 

// Component to render the navigation menu items
function MenuItems() {
  const navigate = useNavigate(); 
  const location = useLocation(); 
  const [searchParams, setSearchParams] = useSearchParams();

  // Array defining the main navigation menu items
  const shoppingViewHeaderMenuItems = [
    { id: "home", label: "Home", path: "/shop/home" },
    { id: "products", label: "Products", path: "/shop/listing" },
  ];

  // Function to handle navigation on menu item click
  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters"); 
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products"
        ? { category: [getCurrentMenuItem.id] } 
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter)); 

    // Update search params if on listing page, otherwise navigate directly
    location.pathname.includes("listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`))
      : navigate(getCurrentMenuItem.path);
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {/* Render menu items */}
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)} 
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label} 
        </Label>
      ))}
    </nav>
  );
}

// Component to render the right side of the header (cart, user avatar, and dropdown menu)
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth); // Get user data from Redux store
  const { cartItems } = useSelector((state) => state.shopCart); 
  const [openCartSheet, setOpenCartSheet] = useState(false); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 

  // Function to handle user logout
  function handleLogout() {
    dispatch(logoutUser()); 
  }

  // Fetch cart items when user ID changes or component mounts
  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch, user?.id]);

  console.log(cartItems, "Piyush"); 

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)} 
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" /> 
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0} 
          </span>
          <span className="sr-only">User cart</span> 
        </Button>
        {/* Render UserCartWrapper to display cart items */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items
            : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black"> 
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userName[0].toUpperCase()} 
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56"> 
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel> 
          <DropdownMenuSeparator /> 
          <DropdownMenuItem onClick={() => navigate("/shop/account")}>
            <UserCog className="mr-2 h-4 w-4" /> 
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator /> 
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> 
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Main component for the shopping header
function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth); 

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background"> 
      <div className="flex h-16 items-center justify-between px-4 md:px-6"> 
        <Link to="/shop/home" className="flex items-center gap-2"> 
          <span className="font-bold italic">ShoppyGlobe</span> 
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden"> 
              <Menu className="h-6 w-6" /> 
              <span className="sr-only">Toggle header menu</span> 
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs"> 
            <MenuItems /> 
            <HeaderRightContent /> 
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block"> 
          <MenuItems />
        </div>

        <div className="hidden lg:block"> 
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader; 
