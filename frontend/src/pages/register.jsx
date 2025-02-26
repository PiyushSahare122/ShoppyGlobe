import { useToast } from "@/components/ui/use-toast"; 
import { registerUser } from "@/redux/auth-slice"; 
import { useState } from "react"; 
import { useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom"; 

// Initial state for the registration form
const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState); 
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 
  const { toast } = useToast(); 

  // Function to handle changes in the input fields
  function handleChange(event) {
    const { name, value } = event.target; 
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, 
    }));
  }

  // Function to handle form submission
  function onSubmit(event) {
    event.preventDefault(); 

    // Dispatch the registerUser action with the form data
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        // If registration is successful, show a success toast
        toast({
          title: data?.payload?.message,
        });
        navigate("/auth/login"); 
      } else {
        // If registration fails, show an error toast
        toast({
          title: data?.payload?.message,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login" 
          >
            Login
          </Link>
        </p>
      </div>
      
      {/* Form Starts Here */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
            User Name
          </label>
          <input
            type="text" 
            name="userName" 
            id="userName" 
            placeholder="Enter your user name" 
            value={formData.userName} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required 
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter your email" 
            value={formData.email} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required 
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password" 
            name="password" 
            id="password" 
            placeholder="Enter your password" 
            value={formData.password} 
            onChange={handleChange} 
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            required 
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default AuthRegister; 
