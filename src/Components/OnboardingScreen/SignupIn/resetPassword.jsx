import { FaArrowLeftLong, FaEye, FaEyeSlash } from "react-icons/fa6";
import "./signup.css";
import ValidationButton from "./ValidationButton";
import { useNavigate, useParams } from "react-router";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { baseURL } from "../../../Constants/urls";
import { RxCrossCircled } from "react-icons/rx";
import blueFly from "../../../assets/mainpageclouds.svg";
import { useToastManager } from "../../Context/ToastContext";

const ResetPassword = () => {
  const toast = useToastManager();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  // const { token } = useParams();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  });

  if (token) {
    formData.token = token;
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/auth/verifyForgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      // console.log(data);

      if (response.status) {
        toast(data.message);
        navigate("/signin");
      } else {
        toast(data.message);
        console.log(data.message);
      }
    } catch (error) {
      toast(error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  return (
    <div className="h-screen bg-cover bg-center relative text-white w-full flex justify-center items-center ">
      <img
        src={blueFly}
        alt="Blue cloud"
        className="absolute w-full h-full object-cover"
      />
      <ToastContainer position="top-center" />
      <div className="relative px-5 w-full max-w-md ">
        <div className="pt-5 m-4 relative">
          <div className="absolute top-0 right-5">
            <RxCrossCircled className="w-8 h-8 cursor-pointer" />
          </div>
          <h1 className="m-4 text-4xl font-bold leading-[38.19px] text-left">
            Reset Password
          </h1>
          {/* {/ <h3 className="mb-2 text-center">Please enter your new password.</h3> /} */}
        </div>

        <form className="space-y-4 bg-gray-800 p-4 mb-8">
          <label className="block relative">
            New Password
            <div className="relative">
              <input
                className="w-full mt-1 h-12 pl-2 bg-gray-900 rounded-md pr-10"
                type={isPasswordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder="Enter Password"
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="absolute w-10 top-1/2 right-3 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </label>
          <ValidationButton password={formData.password} />

          <label className="block relative py-[8vh]">
            Confirm Password
            <div className="relative">
              <input
                className="w-full mt-2 h-12 pl-2 bg-gray-900 rounded-md pr-10"
                type={isConfirmPasswordVisible ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm Your Password"
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                className="absolute w-10 top-1/2 right-3 transform -translate-y-1/2"
                onClick={toggleConfirmPasswordVisibility}
              >
                {isConfirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {formData.password === formData.confirmPassword ? (
              <p className="text-xs text-green-500 mt-1">Password Matches!</p>
            ) : (
              <p className="text-xs text-red-500 mt-1">
                Password Does Not Match
              </p>
            )}
          </label>
          <button
            className="text-white mt-8 font-bold bg-opacity-300  bg-blue-600 w-full h-[6vh] rounded-full"
            type="submit"
            onClick={handleContinue}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
