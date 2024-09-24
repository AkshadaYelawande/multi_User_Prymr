//  perfect working
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import xcircle from "../../../assets/xcircle.png";
import blueFly from "../../../assets/mainpageclouds.svg";
import { baseURL, showToast } from "../../../Constants/urls";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useToastManager } from "../../Context/ToastContext";

const SignIn = ({ mediaBtn }) => {
  const toast = useToastManager();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        setErrors(
          "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long."
        );
      } else {
        setErrors("");
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Validate username/email
    if (!formData.username) {
      newErrors.username = "Username or email is required";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await fetch(`${baseURL}/auth/loginUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await result.json();

        if (data.status === true) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("userName", data.data.userName);
          localStorage.setItem("userEmail", data.data.email);
          localStorage.setItem("userRole", data.data.role);
          console.log("userRole" + data.data.role);

          toast(data.message);
          navigate("/prymr");
        } else {
          const newErrors = {};
          if (data.message) {
            toast(data.message);
          }
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((error) => {
              if (error.field && error.message) {
                newErrors[error.field] = error.message;
              }
            });
          }
          setErrors(newErrors);
        }
      } catch (error) {
        console.error("Error signing in:", error);
      }
    }
  };

  const handleForgetPassword = () => {
    toast("Directing to ForgetPassword");
  };

  const handleBack = () => {
    navigate("/");
  };
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="bg-cover bg-center absolute h-[100vh] w-full flex flex-col  justify-center items-center text-white ">
      <img
        src={blueFly}
        alt="Blue cloud"
        className="absolute w-full h-full object-cover"
      />

      <div className="absolute top-2 right-2 z-10">
        <img
          src={xcircle}
          className="w-8 h-8 cursor-pointer"
          onClick={handleBack}
        />
      </div>
      <div className="relative flex items-center justify-center">
        <h1 className="text-[28px] text-nowrap px-10 font-bold  ">
          Sign In to Prymr
        </h1>
      </div>

      <div className="m-6 w-full relative md:w-[400px]">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-75 p-6 rounded-md space-y-4  ml-[18px] mr-[18px]"
        >
          <label>
            Email Address / Username
            <input
              className={`w-full p-2  bg-gray-900 rounded-md ${
                errors.username ? "border-red-500" : ""
              }`}
              type="text"
              name="username"
              value={formData.username}
              placeholder="Enter Email Address or Username"
              onChange={handleChange}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </label>

          <label className="block mb-2 relative">
            Password :
            <input
              className={`w-full p-2 bg-gray-900 rounded-md pr-10 ${
                errors.password ? "border-red-500" : ""
              }`}
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />{" "}
            <div
              className="absolute inset-y-0 right-0 mt-3 flex items-center pr-3 cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <AiFillEye className="w-5 h-5  text-gray-400" />
              ) : (
                <AiFillEyeInvisible className="w-5 h-5 text-gray-400" />
              )}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </label>

          <Link to="/forgetpassword">
            <p
              className=" text-white text-sm  text-right mb-8"
              onClick={handleForgetPassword}
            >
              Forgot Password?
            </p>
          </Link>
          <div className="justify-center mt-6">
            <button
              className="text-white font-bold bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full"
              type="submit"
            >
              Sign In
            </button>
            <div className="mt-3 text-center">
              <p>
                Don't have an account?{" "}
                <Link to="/signuppage" className="text-blue-500">
                  Sign Up
                </Link>
              </p>
            </div>
            <img
              src="/Images/Line.png"
              className="mt-4 w-20 mx-auto"
              alt="Line"
            />
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="toast-custom"
        />
      </div>
    </div>
  );
};

export default SignIn;
