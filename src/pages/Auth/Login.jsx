import Lottie from "lottie-react";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import insuranceAnimation from "../../assets/LottieAnimations/insurance-login.json";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [rememberMe, setRememberMe] = useState(false);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await login(formData.email, formData.password);

      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      toast.success("Welcome back to LifeSure! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address format.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
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

  const handleGoogle = async () => {
    setIsLoading(true);

    try {
      await googleLogin();

      toast.success("Google login successful! Welcome to LifeSure! 🎉", {
        position: "top-right",
        autoClose: 3000,
      });

      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);

      let errorMessage = "Google login failed. Please try again.";

      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Login was cancelled.";
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden">
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
              Secure Your Future Today
            </h3>
            <p className="text-gray-600 text-base leading-relaxed">
              Join thousands of families who trust LifeSure for comprehensive
              life insurance protection
            </p>

            {/* Trust indicators */}
            <div className="mt-6 flex justify-center items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Secure
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Trusted
              </div>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1 text-purple-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Reliable
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Login Form Side */}
        <div className="w-full lg:w-1/2 lg:pl-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back! 👋
            </h2>
            <p className="text-gray-600">
              Sign in to access your insurance dashboard
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
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="ml-3 text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address
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

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
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
                  placeholder="Enter your password"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me for 30 days
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline underline-offset-4"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading || loading}
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
                  Signing you in...
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
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Sign In to LifeSure
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

          {/* Google Login Button */}
          <button
            onClick={handleGoogle}
            disabled={isLoading || loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-md"
            type="button"
          >
            <FaGoogle className="w-5 h-5 mr-3 text-red-500" />
            Continue with Google
          </button>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            New to LifeSure?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-semibold hover:text-blue-500 transition-colors duration-200 hover:underline underline-offset-4"
            >
              Create your account
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
              Protected by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
