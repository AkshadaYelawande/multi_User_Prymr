// import { useState } from "react";
// import { FaArrowLeftLong } from "react-icons/fa6";
// import { useNavigate } from "react-router";
// import { baseURL } from "../../../Constants/urls";

// const ForgetPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isValid, setIsValid] = useState(true);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleEmailChange = (e) => {
//     const { value } = e.target;
//     setEmail(value); // Check if the email is valid
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
//     setIsValid(emailRegex.test(value) && value.trim() !== "");
//   };

//   const handleContinue = async (e) => {
//     try {
//       const response = await fetch(
//         `${baseURL}/auth/forgotPassword?email=${email}`,
//         {
//           method: "POST",
//         }
//       );

//       const data = await response.json();
//       console.log(data);

//       if (response.status) {
//         toast("Email Sent to mail");
//         setMessage(data.message);
//         navigate("/resetPassword");
//       } else {
//         setError(data.message);
//       }
//       console.log("response", response);
//     } catch (error) {
//       console.error("Error:", error);
//       setError("An error occurred. Please try again later.");
//     }

//     setLoading(false);
//   };

//   const handleBack = () => {
//     navigate("/signin");
//   };

//   return (
//     <div className="text-white h-auto flex flex-col container px-2">
//       <div className="flex-grow">
//         <div className="ml-6 mt-8 flex items-center">
//           <FaArrowLeftLong className="mr-2" />
//           <p
//             className="text-base cursor-pointer font-semibold leading-[21.82px] text-center "
//             onClick={handleBack}
//           >
//             Sign in to account
//           </p>
//         </div>
//         <h1 className="m-2 text-4xl mt-6 mb-4 font-bold leading-[38.19px] text-left">
//           Forgot Password
//         </h1>
//         <p className="m-3 text-sm font-normal leading-[20.46px] text-left">
//           Please enter the email address you used when creating this account,
//           and we’ll send you instructions to reset your password.
//         </p>
//         <div className="space-y-2 py-3">
//           <label className="block mb-1 ml-3">Email Address / Username</label>
//           <input
//             className="w-[90vw] md:w-[50vw] m-3 h-[50px] pl-5 bg-gray-800 rounded-tl-md"
//             type="email"
//             name="email"
//             value={email}
//             placeholder="Enter Email Address"
//             onChange={handleEmailChange}
//             required
//           />
//           {email.length > 0 && (
//             <p
//               className={`text-xs mt-1 ml-3 ${
//                 isValid ? "text-green-500" : "text-red-500"
//               }`}
//             >
//               {isValid ? "Email is valid" : "Email is not valid"}
//             </p>
//           )}
//         </div>
//       </div>
//       <div className="w-[80vw] fixed  bottom-0 ml-3 flex flex-col items-center py-3 ">
//         <button
//           className="text-white mb-3 font-bold bg-opacity-300 bg-blue-600 w-[80vw] md:w-[50vw] h-[45px] rounded-full"
//           type="submit"
//           onClick={handleContinue}
//         >
//           Continue
//         </button>
//         <img src="/Images/Line.png" className="bg-black" alt="Line" />
//       </div>
//     </div>
//   );
// };
// export default ForgetPassword;

import { useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../../Constants/urls";
import blueFly from "../../../assets/mainpageclouds.svg";
import { useToastManager } from "../../Context/ToastContext";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToastManager();
  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value); // Update email state
    validateEmail(value); // Validate email format
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    setIsValidEmail(emailRegex.test(email) && email.trim() !== "");
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isValidEmail) {
        return; // Don't proceed if email is invalid
      }

      const response = await fetch(
        `${baseURL}/auth/forgotPassword?email=${email}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setMessage(data.message);
        // toast(" Directing to Forgot Password");
      } else {
        if (data && data.message) {
          toast(data.message); // Show error message from backend
        } else {
          toast("Something went wrong. Please try again."); // Default error message
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  const handleBack = () => {
    navigate("/signin");
  };

  return (
    <div className="bg-cover bg-center absolute h-[100vh] w-full flex justify-center items-center">
      <img
        src={blueFly}
        alt="Blue cloud"
        className="absolute w-full h-full object-cover"
      />
      <div className="relative min-h-screen flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <FaArrowLeftLong
                className="text-white text-2xl mr-2 cursor-pointer"
                onClick={handleBack}
              />
              <p
                className="text-base cursor-pointer font-semibold leading-[21.82px] text-white"
                onClick={handleBack}
              >
                Sign in to account
              </p>
            </div>
            <h1 className="text-4xl font-bold leading-[38.19px] text-white mb-4">
              Forget Password
            </h1>
            <p className="text-sm font-normal leading-[20.46px] text-white mb-6">
              Please enter the email address you used when creating this
              account, and we’ll send you instructions to reset your password.
            </p>
            <form onSubmit={handleContinue} className="space-y-4">
              <label className="block mb-1 text-white">
                Email Address / Username
              </label>
              <input
                className={`w-full h-12 px-4 bg-gray-600 text-white rounded-md ${
                  !isValidEmail && email.length > 0 && "border-red-500"
                }`}
                type="email"
                name="email"
                value={email}
                placeholder="Enter Email Address"
                onChange={handleEmailChange}
                required
              />
              {!isValidEmail && email.length > 0 && (
                <p className="text-xs text-red-500">Invalid email address</p>
              )}
              <button
                className={`w-full cursor-pointer h-12 mb-10 bg-blue-600 text-white font-bold rounded-md ${
                  loading && "opacity-50 cursor-not-allowed"
                }`}
                type="submit"
                disabled={!isValidEmail || loading}
              >
                {loading ? "Sending..." : "Continue"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
