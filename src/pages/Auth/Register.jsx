import Lottie from "lottie-react";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import insuranceAnimation from "../../assets/LottieAnimations/insurance-login.json";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { createUser, setUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    photo: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState("");

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      } else if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter";
      } else if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one lowercase letter";
      }
    }

    if (
      formData.photo &&
      formData.photo.trim() &&
      !/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(formData.photo)
    ) {
      newErrors.photo =
        "Please enter a valid image URL (jpg, jpeg, png, gif, webp)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength checker
  const checkPasswordStrength = (password) => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (
      password.length >= 6 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password)
    ) {
      if (/\d/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return "strong";
      }
      return "medium";
    }
    return "weak";
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const RegisterHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Step 1: Create the user account
      const result = await createUser(formData.email, formData.password);
      const user = result.user;
      console.log("User registered:", user);

      // Step 2: Update profile directly with Firebase updateProfile
      if (formData.name || formData.photo) {
        const { updateProfile } = await import("firebase/auth");

        await updateProfile(user, {
          displayName: formData.name || null,
          photoURL: formData.photo || null,
        });

        console.log("Profile updated successfully");
      }

      // Step 3: Set the updated user in context
      setUser({
        ...user,
        displayName: formData.name,
        photoURL: formData.photo || null,
      });

      toast.success(
        "Welcome to LifeSure! 🎉 Your account has been created successfully!",
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );

      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "An account with this email already exists. Please try logging in.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const googleLoginHandler = async () => {
    setIsLoading(true);

    try {
      const result = await googleLogin();
      const user = result.user;
      setUser(user);

      toast.success("Welcome to LifeSure! 🎉 Google registration successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate("/");
    } catch (error) {
      console.error("Google registration error:", error);

      let errorMessage = "Google registration failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Registration was cancelled.";
      } else if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked. Please allow popups and try again.";
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "strong":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden py-12">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-indigo-400 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-300 rounded-full opacity-5 blur-2xl animate-pulse delay-500"></div>

        {/* Floating elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-40 w-6 h-6 bg-indigo-300 rounded-full opacity-20 animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-purple-300 rounded-full opacity-20 animate-bounce delay-700"></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 flex flex-col lg:flex-row items-center p-8 gap-8 max-w-6xl w-full mx-4 hover:shadow-3xl transition-all duration-500">
        {/* Logo Section - Mobile */}
        <div className="lg:hidden w-full text-center mb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              LifeSure
            </span>
          </div>
        </div>

        {/* Animation Side */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6">
          {/* Logo for desktop */}
          <div className="hidden lg:flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-lg hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              LifeSure
            </span>
          </div>

          <div className="relative">
            <Lottie
              animationData={insuranceAnimation}
              loop={true}
              style={{ height: "320px", width: "320px" }}
              className="mb-6 drop-shadow-lg"
            />
          </div>

          <div className="text-center max-w-sm">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Join LifeSure Today! 🚀
            </h3>
            <p className="text-gray-600 text-base leading-relaxed mb-4">
              Start securing your family's future with our comprehensive
              insurance plans
            </p>

            {/* Benefits list */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Instant policy quotes
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                24/7 customer support
              </div>
              <div className="flex items-center justify-center">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Competitive premiums
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Register Form Side */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Create Your Account 📝
            </h2>
            <p className="text-gray-600">
              Join thousands who trust LifeSure with their future
            </p>
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-shake">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={RegisterHandler} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 bg-white/70 backdrop-blur-sm
                    ${
                      errors.name
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center animate-fadeIn">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 bg-white/70 backdrop-blur-sm
                    ${
                      errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center animate-fadeIn">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 bg-white/70 backdrop-blur-sm
                    ${
                      errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }
                  `}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">
                      Password strength:
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength === "weak"
                          ? "text-red-600"
                          : passwordStrength === "medium"
                          ? "text-yellow-600"
                          : passwordStrength === "strong"
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{
                        width:
                          passwordStrength === "weak"
                            ? "33%"
                            : passwordStrength === "medium"
                            ? "66%"
                            : passwordStrength === "strong"
                            ? "100%"
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-sm text-red-600 flex items-center animate-fadeIn">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.password}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Must be at least 6 characters with uppercase and lowercase
                letters
              </p>
            </div>

            {/* Photo URL */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="url"
                  name="photo"
                  value={formData.photo}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200 bg-white/70 backdrop-blur-sm
                    ${
                      errors.photo
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300"
                    }
                  `}
                />
              </div>
              {errors.photo && (
                <p className="text-sm text-red-600 flex items-center animate-fadeIn">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {errors.photo}
                </p>
              )}
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your account...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  Create LifeSure Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Register Button */}
          <button
            onClick={googleLoginHandler}
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-md"
            type="button"
          >
            <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
            Sign up with Google
          </button>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have a LifeSure account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-500 transition-colors duration-200 hover:underline underline-offset-4"
            >
              Sign in here
            </Link>
          </p>

          {/* Security Badge */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              Your data is protected with enterprise-grade security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
