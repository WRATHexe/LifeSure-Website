import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaClock,
  FaDollarSign,
  FaExclamationTriangle,
  FaImage,
  FaRedo,
  FaSave,
  FaShieldAlt,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Select from "react-select";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AddPolicy = () => {
  const [isLoading, setIsLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      category: null,
      description: "",
      minAge: "",
      maxAge: "",
      coverageMin: "",
      coverageMax: "",
      duration: null,
      basePremium: "",
      imageUrl: "",
    },
  });

  // React Select Options
  const categoryOptions = [
    { value: "Term Life Insurance", label: "Term Life Insurance" },
    { value: "Whole Life Insurance", label: "Whole Life Insurance" },
    { value: "Universal Life Insurance", label: "Universal Life Insurance" },
    { value: "Variable Life Insurance", label: "Variable Life Insurance" },
    { value: "Senior Life Insurance", label: "Senior Life Insurance" },
    { value: "Child Life Insurance", label: "Child Life Insurance" },
    { value: "Group Life Insurance", label: "Group Life Insurance" },
    {
      value: "Critical Illness Insurance",
      label: "Critical Illness Insurance",
    },
    { value: "Disability Insurance", label: "Disability Insurance" },
  ];

  const durationOptions = [
    { value: "10 Years", label: "10 Years" },
    { value: "15 Years", label: "15 Years" },
    { value: "20 Years", label: "20 Years" },
    { value: "25 Years", label: "25 Years" },
    { value: "30 Years", label: "30 Years" },
    { value: "Lifetime", label: "Lifetime" },
    { value: "Until Age 65", label: "Until Age 65" },
    { value: "Until Age 70", label: "Until Age 70" },
    { value: "Until Age 25", label: "Until Age 25" },
    { value: "Annual Renewable", label: "Annual Renewable" },
  ];

  // Enhanced React Select Styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "48px",
      borderRadius: "12px",
      borderWidth: "2px",
      borderColor: state.isFocused ? "#3B82F6" : "#E5E7EB",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      backgroundColor: "white",
      "&:hover": {
        borderColor: "#3B82F6",
      },
      transition: "all 0.2s ease",
    }),
    option: (provided, state) => ({
      ...provided,
      borderRadius: "8px",
      margin: "2px 8px",
      backgroundColor:
        state.isSelected || state.isFocused ? "#3B82F6" : "transparent",
      color: state.isSelected ? "white" : "#374151",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3B82F6" : "#EFF6FF",
      },
      padding: "10px 12px",
      fontSize: "14px",
      fontWeight: state.isSelected ? "600" : "500",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#9CA3AF",
      fontSize: "14px",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      border: "1px solid #E5E7EB",
    }),
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Validate age range
      if (parseInt(data.minAge) >= parseInt(data.maxAge)) {
        toast.error("Maximum age must be greater than minimum age!");
        setIsLoading(false);
        return;
      }

      // Validate coverage range
      if (parseFloat(data.coverageMin) >= parseFloat(data.coverageMax)) {
        toast.error("Maximum coverage must be greater than minimum coverage!");
        setIsLoading(false);
        return;
      }

      // Transform data for API
      const transformedData = {
        title: data.title,
        category: data.category?.value || "",
        description: data.description,
        minAge: parseInt(data.minAge),
        maxAge: parseInt(data.maxAge),
        coverageMin: parseFloat(data.coverageMin),
        coverageMax: parseFloat(data.coverageMax),
        duration: data.duration?.value || "",
        basePremium: parseFloat(data.basePremium),
        imageUrl: data.imageUrl || "",
        status: "Active",
        applicationsCount: 0,
      };

      // Send to backend API
      const response = await axiosSecure.post("/policies", transformedData);

      if (response.data.success) {
        toast.success("Policy created successfully! 🎉");
        navigate("/dashboard/admin/policies");
      } else {
        throw new Error(response.data.message || "Failed to create policy");
      }
    } catch (error) {
      console.error("Error adding policy:", error);
      let errorMessage = "Failed to add policy. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (
      isDirty &&
      !window.confirm(
        "Are you sure you want to reset the form? All data will be lost."
      )
    ) {
      return;
    }
    reset();
    toast.info("Form has been reset");
  };

  const handleBack = () => {
    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      )
    ) {
      return;
    }
    navigate("/dashboard/admin/policies");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Enhanced Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 hover:scale-105"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Create New Policy
                </h1>
                <p className="text-blue-100 mt-1">
                  Design comprehensive insurance coverage with detailed terms
                </p>
              </div>
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400"></div>
        </div>

        {/* Enhanced Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FaShieldAlt className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Policy Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Policy Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("title", {
                        required: "Policy title is required",
                        minLength: {
                          value: 3,
                          message: "Title must be at least 3 characters",
                        },
                      })}
                      type="text"
                      placeholder="e.g., Premium Term Life Insurance"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 ${
                        errors.title
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.title && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600">
                        <FaExclamationTriangle className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          {errors.title.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="category"
                      control={control}
                      rules={{ required: "Please select a category" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={categoryOptions}
                          styles={customSelectStyles}
                          placeholder="Select Category"
                          isClearable
                          isSearchable
                        />
                      )}
                    />
                    {errors.category && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600">
                        <FaExclamationTriangle className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          {errors.category.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Duration{" "}
                      <FaClock className="inline w-4 h-4 ml-1 text-gray-400" />
                    </label>
                    <Controller
                      name="duration"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          options={durationOptions}
                          styles={customSelectStyles}
                          placeholder="Select Duration"
                          isClearable
                          isSearchable
                        />
                      )}
                    />
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description", {
                        required: "Description is required",
                        minLength: {
                          value: 10,
                          message: "Description must be at least 10 characters",
                        },
                      })}
                      placeholder="Comprehensive description of policy benefits, features, and terms..."
                      rows="5"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 resize-none ${
                        errors.description
                          ? "border-red-300 bg-red-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                    {errors.description && (
                      <div className="mt-2 flex items-center space-x-2 text-red-600">
                        <FaExclamationTriangle className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          {errors.description.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Coverage Details Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <FaUser className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Coverage Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Age Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Minimum Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("minAge", {
                          required: "Minimum age is required",
                          min: { value: 0, message: "Age must be positive" },
                          max: {
                            value: 100,
                            message: "Age must be less than 100",
                          },
                        })}
                        type="number"
                        placeholder="18"
                        min="0"
                        max="100"
                        className={`w-full pl-4 pr-10 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800 ${
                          errors.minAge
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                        years
                      </span>
                    </div>
                    {errors.minAge && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <FaExclamationTriangle className="w-3 h-3" />
                        <p className="text-xs font-medium">
                          {errors.minAge.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Maximum Age <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        {...register("maxAge", {
                          required: "Maximum age is required",
                          min: { value: 0, message: "Age must be positive" },
                          max: {
                            value: 100,
                            message: "Age must be less than 100",
                          },
                        })}
                        type="number"
                        placeholder="65"
                        min="0"
                        max="100"
                        className={`w-full pl-4 pr-10 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800 ${
                          errors.maxAge
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                        years
                      </span>
                    </div>
                    {errors.maxAge && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <FaExclamationTriangle className="w-3 h-3" />
                        <p className="text-xs font-medium">
                          {errors.maxAge.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Coverage Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Min Coverage <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register("coverageMin", {
                          required: "Minimum coverage is required",
                          min: {
                            value: 0,
                            message: "Coverage must be positive",
                          },
                        })}
                        type="number"
                        placeholder="10,000"
                        min="0"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800 ${
                          errors.coverageMin
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.coverageMin && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <FaExclamationTriangle className="w-3 h-3" />
                        <p className="text-xs font-medium">
                          {errors.coverageMin.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Max Coverage <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register("coverageMax", {
                          required: "Maximum coverage is required",
                          min: {
                            value: 0,
                            message: "Coverage must be positive",
                          },
                        })}
                        type="number"
                        placeholder="1,000,000"
                        min="0"
                        className={`w-full pl-10 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white text-gray-800 ${
                          errors.coverageMax
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.coverageMax && (
                      <div className="flex items-center space-x-1 text-red-600">
                        <FaExclamationTriangle className="w-3 h-3" />
                        <p className="text-xs font-medium">
                          {errors.coverageMax.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Media Section */}
              <div className="space-y-6 pt-8 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <FaDollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Pricing & Media
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Base Premium */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Base Premium ($/month){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        {...register("basePremium", {
                          required: "Base premium is required",
                          min: {
                            value: 0,
                            message: "Premium must be positive",
                          },
                        })}
                        type="number"
                        placeholder="50.00"
                        min="0"
                        step="0.01"
                        className={`w-full pl-10 pr-16 py-4 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-800 ${
                          errors.basePremium
                            ? "border-red-300 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm font-medium">
                        /month
                      </span>
                    </div>
                    {errors.basePremium && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <FaExclamationTriangle className="w-4 h-4" />
                        <p className="text-sm font-medium">
                          {errors.basePremium.message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Policy Image URL{" "}
                      <FaImage className="inline w-4 h-4 ml-1 text-gray-400" />
                      <span className="text-gray-500 text-xs font-normal ml-2">
                        (Optional)
                      </span>
                    </label>
                    <input
                      {...register("imageUrl")}
                      type="url"
                      placeholder="https://example.com/policy-image.jpg"
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white text-gray-800 placeholder-gray-400 hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Enhanced Form Actions */}
              <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center space-x-2 px-6 py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-all duration-200 hover:scale-105 border border-gray-200"
                >
                  <FaRedo className="w-4 h-4" />
                  <span>Reset Form</span>
                </button>

                <div className="flex space-x-4">
                  <Link
                    to="/dashboard/admin/policies"
                    className="px-6 py-3 text-gray-600 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !isValid}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin w-5 h-5" />
                        <span>Creating Policy...</span>
                      </>
                    ) : (
                      <>
                        <FaSave className="w-5 h-5" />
                        <span>Create Policy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPolicy;
