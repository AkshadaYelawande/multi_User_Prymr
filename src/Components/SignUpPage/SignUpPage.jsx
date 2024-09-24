import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./signup.css";
import blueFly from "../../assets/mainpageclouds.svg";
import xcircle from "../../assets/xcircle.png";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { baseURL } from "../../Constants/urls";
import token from "../../Constants/urls";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useToastManager } from "../Context/ToastContext";
import axios from "axios";
import ZoomableImage from "./ZoomableImage";
import ValidationButton from "../OnboardingScreen/SignupIn/ValidationButton";

const SignupPage = () => {
  const toast = useToastManager();

  const [isSaving, setIsSaving] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState("");
  const [processedImage, setProcessedImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameRegex = /^[a-zA-Z]+$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let error = "";

    if (
      (name === "firstName" || name === "lastName") &&
      !nameRegex.test(value)
    ) {
      error = `${
        name === "firstName" ? "First" : "Last"
      } Name should only contain letters and must not be empty.`;
    } else if (name === "password" && !passwordRegex.test(value)) {
      error =
        "Password must contain at least one uppercase letter, one special character, one number, and be at least 8 characters long.";
      setPasswordValid(false);
    } else if (name === "password") {
      setPasswordValid(true);
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    setFormData({ ...formData, [name]: value });
  };

  const createInitialProfileImage = async (firstName, lastName) => {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    // Set background
    ctx.fillStyle = "#3498db"; // You can change this color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text
    ctx.font = "bold 80px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const initials = `${firstName.charAt(0)}${lastName.charAt(
      0
    )}`.toUpperCase();
    ctx.fillText(initials, canvas.width / 2, canvas.height / 2);

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Event prevented. Default form submission blocked.");

    if (isSubmitting) {
      console.log("Form is already submitting. Blocking multiple submissions.");
      return;
    }

    console.log("Setting form submission state to true.");
    setIsSubmitting(true);

    if (!selectedImage) {
      console.log("No profile icon selected.");
      setImageError("Please select your profile icon.");
      console.log("Image error set: Please select your profile icon.");
      setIsSubmitting(false);
      console.log(
        "Form submission state reset to false due to missing profile icon."
      );
      return;
    } else {
      console.log("Profile icon selected:", selectedImage);
      setImageError("");
      console.log("Image error cleared.");
    }

    // Validate form fields
    if (
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.userName !== "" &&
      passwordValid &&
      formData.email.trim() !== ""
    ) {
      console.log("Form validation passed:", formData);

      const profileImageBlob = await fetch(processedImage).then((r) =>
        r.blob()
      );

      try {
        // Step 1: Upload the selected image (profile image)
        const imageFormData = new FormData();
        // imageFormData.append("file", selectedImage);
        imageFormData.append("file", profileImageBlob, "profile.png");
        console.log("Image form data prepared:", imageFormData);

        console.log("Uploading profile image.");
        const profileImageUploadResponse = await axios.post(
          `${baseURL}/file-upload/uploadFile`,
          imageFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(
          "Profile image upload response received:",
          profileImageUploadResponse
        );

        // Make sure the API returned a valid URL
        if (
          !profileImageUploadResponse.data.status ||
          !profileImageUploadResponse.data.data.url
        ) {
          console.log("Profile image upload failed or URL missing.");
          throw new Error("Failed to upload profile image");
        }

        // Use the raw URL directly, no encoding
        const profileIconUrl = profileImageUploadResponse.data.data.url;
        console.log("Profile icon URL:", profileIconUrl);

        // Step 2: Create and upload initial profile icon (if needed)

        console.log("Generating initial profile icon.");
        const initialProfileIcon = await createInitialProfileImage(
          formData.firstName,
          formData.lastName
        );
        console.log("Initial profile icon created:", initialProfileIcon);

        const initialIconFormData = new FormData();
        initialIconFormData.append("file", initialProfileIcon);
        console.log(
          "Initial profile icon form data prepared:",
          initialIconFormData
        );

        console.log("Uploading initial profile icon.");
        const initialIconUploadResponse = await axios.post(
          `${baseURL}/file-upload/uploadFile`,
          initialIconFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(
          "Initial profile icon upload response received:",
          initialIconUploadResponse
        );

        // Ensure the API returned a valid URL for the initial profile icon
        if (
          !initialIconUploadResponse.data.status ||
          !initialIconUploadResponse.data.data.url
        ) {
          console.log("Initial profile icon upload failed or URL missing.");
          throw new Error("Failed to upload initial profile icon");
        }

        // Use the raw URL directly, no encoding
        const initialIconUrl = initialIconUploadResponse.data.data.url;
        console.log("Initial profile icon URL:", initialIconUrl);

        // Step 3: Create user with the profile icon URL
        console.log("Creating user with profile icon URL.");
        const createUserResponse = await axios.post(
          `${baseURL}/auth/createUser`,
          {
            ...formData,
            profileIcon: profileIconUrl,
            initialProfileIcon: initialIconUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        console.log("Create user response received:", createUserResponse);
        console.log("234", createUserResponse.data.status);

        if (createUserResponse.data.status) {
          console.log("User created successfully.");
          const { token, role, userName, email, profileIcon } =
            createUserResponse.data.data;
          console.log("User details:", {
            token,
            role,
            userName,
            email,
            profileIcon,
          });

          // Store token and user info securely
          localStorage.setItem("token", token);
          console.log("Token saved in localStorage:", token);
          localStorage.setItem("userRole", role);
          console.log("User role saved in localStorage:", role);
          localStorage.setItem("userName", userName);
          console.log("User name saved in localStorage:", userName);
          localStorage.setItem("userEmail", email);
          console.log("User email saved in localStorage:", email);
          localStorage.setItem("profileImage", profileIconUrl);
          // localStorage.setItem("profileImage", profileIconUrl);
          localStorage.setItem("initialProfileIcon", initialIconUrl);
          console.log("Profile icon saved in localStorage:", profileIconUrl);
          console.log(
            "initialProfileIcon icon saved in localStorage:",
            initialIconUrl
          );

          console.log("Navigating to home.");
          navigate("/prymr");

          console.log("Displaying success toast notification.");
          toast("Sign up successful");
        } else {
          console.log("Error creating user:", createUserResponse.data);
          handleErrorResponse(createUserResponse.data);
        }
      } catch (error) {
        console.error("Error during sign up process:", error);
        if (error.response && error.response.data) {
          handleErrorResponse(error.response.data);
        } else {
          toast("An error occurred during sign up");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      console.log(
        "Form validation failed. Fields missing or invalid:",
        formData
      );
      toast("Please fill out all the fields correctly");
      setIsSubmitting(false);
    }
  };

  const handleErrorResponse = (data) => {
    if (data.message) {
      setErrors({ general: data.message });
      toast(data.message);
    } else {
      setErrors({ general: "An unknown error occurred" });
      toast("An unknown error occurred");
    }
    setIsSubmitting(false);
  };
  const handleBack = () => {
    navigate("/");
  };

  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageError("");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessedImageChange = (dataUrl) => {
    setProcessedImage(dataUrl);
  };
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-cover bg-center relative overflow-y-auto py-8">
      <img
        src={blueFly}
        alt="Blue cloud"
        className="absolute w-full h-full object-cover"
      />
      <div className="absolute top-2 right-2 ">
        <img
          src={xcircle}
          className="w-8 h-8 cursor-pointer"
          onClick={handleBack}
        />
      </div>
      <div className="relative ml-2  mr-2 flex flex-col items-center justify-center text-white">
        <h1 className="md:text-[28px] text-[18px] font-bold mb-1 text-center">
          Sign Up to get started on Prymr
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 mt-5 bg-opacity-75 p-6 rounded-md sm:ml-[18px] sm:mr-[18px]"
        >
          {/* {" "}
          {errors.general && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {errors.general}
            </p>
          )} */}
          <label>
            First Name:
            <input
              className="w-full p-2  bg-gray-900 rounded-md"
              type="text"
              name="firstName"
              value={formData.firstName}
              placeholder="Enter First Name"
              maxLength={80}
              onChange={handleChange}
              required
            />
            {errors.firstName && (
              <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
            )}
          </label>
          <label>
            Last Name:
            <input
              className="w-full p-2  bg-gray-900 rounded-md"
              type="text"
              name="lastName"
              value={formData.lastName}
              placeholder="Enter Last Name"
              onChange={handleChange}
              maxLength={100}
              required
            />
            {errors.lastName && (
              <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
            )}
          </label>
          <label>
            User Name:
            <input
              className="w-full p-2 bg-gray-900 rounded-md"
              type="text"
              name="userName"
              value={formData.userName}
              placeholder="Enter User Name"
              onChange={handleChange}
              maxLength={80}
              required
            />
            {errors.userName && (
              <p className="text-xs text-red-500 mt-1">{errors.userName}</p>
            )}
          </label>
          <label>
            Email :
            <input
              className="w-full p-2  bg-gray-900 rounded-md"
              type="text"
              name="email"
              value={formData.email}
              placeholder="Enter Email Id"
              onChange={handleChange}
              required
            />
            {errors.email && (
              <p className="text-xs text-red-500 ">{errors.email}</p>
            )}
          </label>
          <label className="block relative mt-3">
            Password :
            <input
              className="w-full p-2 bg-gray-900 rounded-md pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />
            <span
              className="absolute inset-y-0 right-0 mb-7 flex items-center pr-3 cursor-pointer"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <AiFillEye className="w-5 h-5  text-gray-400" />
              ) : (
                <AiFillEyeInvisible className="w-5 h-5 text-gray-400" />
              )}
            </span>
            <ValidationButton password={formData.password} />
          </label>
          {errors.password && (
            <p className="text-xs text-red-500 mb-2 ">{errors.password}</p>
          )}
          <div className="mt-4">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                // className="mt-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                className="text-white cursor-pointer font-bold mt-3 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full"
              >
                Select Your Profile Icon
              </button>
            </label>
            {previewUrl && (
              <div className="mt-2 flex items-center justify-center">
                <ZoomableImage
                  src={previewUrl}
                  alt="Preview"
                  onImageChange={handleProcessedImageChange}
                />
              </div>
            )}
            {imageError && (
              <p className="text-xs text-red-500 mt-1">{imageError}</p>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className={`text-white cursor-pointer font-bold bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full ${
                isSubmitting && "opacity-50 cursor-not-allowed"
              }`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Register Now" : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
