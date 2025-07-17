import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaArrowLeft,
  FaCalculator,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaSpinner,
  FaUser,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import Modal from "../../components/Modal/Modal";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const QuotePage = () => {
  const { policyId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [calculating, setCalculating] = useState(false);
  const [quote, setQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      age: "",
      gender: "",
      coverageAmount: "",
      duration: "",
      smoker: false,
      occupation: "",
      healthCondition: "excellent",
    },
  });

  // Fetch policy details using TanStack Query
  const {
    data: policy,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["policy", policyId],
    queryFn: async () => {
      if (!policyId) {
        throw new Error("No policy ID provided");
      }

      const response = await axiosSecure.get(`/policies/${policyId}`);

      // Handle different response structures
      if (response.data.success) {
        return response.data.policy;
      } else if (response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error("Policy not found");
      }
    },
    enabled: !!policyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching policy:", error);
      toast.error("Failed to load policy details");
    },
  });

  // Calculate premium based on form data
  const calculatePremium = (data) => {
    if (!policy) return 0;

    let basePremium = policy.basePremium;
    const coverageAmount = parseInt(data.coverageAmount);
    const age = parseInt(data.age);
    const duration = parseInt(data.duration);

    // Base calculation: premium per 100k coverage
    let premium = (basePremium * coverageAmount) / 100000;

    // Age factor
    if (age < 25) premium *= 0.8;
    else if (age < 35) premium *= 1.0;
    else if (age < 45) premium *= 1.3;
    else if (age < 55) premium *= 1.6;
    else if (age < 65) premium *= 2.0;
    else premium *= 2.5;

    // Gender factor
    if (data.gender === "female") premium *= 0.9;

    // Smoker factor
    if (data.smoker) premium *= 1.5;

    // Health condition factor
    switch (data.healthCondition) {
      case "excellent":
        premium *= 1.0;
        break;
      case "good":
        premium *= 1.1;
        break;
      case "fair":
        premium *= 1.3;
        break;
      case "poor":
        premium *= 1.6;
        break;
      default:
        premium *= 1.0;
    }

    // Duration factor
    if (duration <= 10) premium *= 1.0;
    else if (duration <= 20) premium *= 0.95;
    else premium *= 0.9;

    // Occupation risk factor
    const riskFactors = {
      "desk-job": 1.0,
      "moderate-risk": 1.2,
      "high-risk": 1.5,
    };
    premium *= riskFactors[data.occupation] || 1.0;

    return Math.max(Math.round(premium), 50); // Minimum premium of $50
  };

  const onSubmit = async (data) => {
    setCalculating(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const monthlyPremium = calculatePremium(data);
      const annualPremium = monthlyPremium * 12;

      const quoteData = {
        ...data,
        monthlyPremium,
        annualPremium,
        coverageAmount: parseInt(data.coverageAmount),
        duration: parseInt(data.duration),
        totalPremium: annualPremium * parseInt(data.duration),
        generatedAt: new Date().toISOString(),
        policyId: policyId,
        policyTitle: policy?.title,
      };

      setQuote(quoteData);
      setShowQuoteModal(true);

      // Save quote to localStorage for later use
      localStorage.setItem("lastQuote", JSON.stringify(quoteData));

      toast.success("Quote generated successfully!");
    } catch (error) {
      console.error("Error calculating quote:", error);
      toast.error("Failed to calculate quote. Please try again.");
    } finally {
      setCalculating(false);
    }
  };

  const handleApplyForPolicy = () => {
    if (!user) {
      toast.info("Please login to apply for the policy");
      navigate("/login", { state: { from: `/application/${policyId}` } });
      return;
    }

    // Store quote data to pre-fill application form
    sessionStorage.setItem("quoteData", JSON.stringify(quote));
    setShowQuoteModal(false);
    navigate(`/application/${policyId}`);
  };

  const handleCloseModal = () => {
    setShowQuoteModal(false);
  };

  const handleGetAnotherQuote = () => {
    setShowQuoteModal(false);
    reset();
    setQuote(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading policy details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error?.message || "Failed to load policy"}
          </h2>
          <p className="text-gray-600 mb-4">
            Please try again or select a different policy.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/policies")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Policies
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No policy found
  if (!policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Policy Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested policy could not be found.
          </p>
          <button
            onClick={() => navigate("/policies")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Get Your Quote
                </h1>
                <p className="text-gray-600">
                  {policy?.title || "Calculate your premium instantly"}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-blue-600">
              <FaCalculator className="w-8 h-8" />
              <span className="text-sm font-medium">Premium Calculator</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quote Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FaUser className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Personal Information
                  </h2>
                  <p className="text-gray-600">
                    Fill in your details to get an accurate quote
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      {...register("age", {
                        required: "Age is required",
                        min: { value: 18, message: "Minimum age is 18" },
                        max: { value: 80, message: "Maximum age is 80" },
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your age"
                    />
                    {errors.age && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.age.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.gender.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coverage Amount * (USD)
                    </label>
                    <select
                      {...register("coverageAmount", {
                        required: "Coverage amount is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select coverage amount</option>
                      <option value="50000">$50,000</option>
                      <option value="100000">$100,000</option>
                      <option value="250000">$250,000</option>
                      <option value="500000">$500,000</option>
                      <option value="1000000">$1,000,000</option>
                      <option value="2000000">$2,000,000</option>
                    </select>
                    {errors.coverageAmount && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.coverageAmount.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Policy Duration * (Years)
                    </label>
                    <select
                      {...register("duration", {
                        required: "Duration is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select duration</option>
                      <option value="10">10 Years</option>
                      <option value="15">15 Years</option>
                      <option value="20">20 Years</option>
                      <option value="25">25 Years</option>
                      <option value="30">30 Years</option>
                    </select>
                    {errors.duration && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.duration.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Occupation Risk Level *
                    </label>
                    <select
                      {...register("occupation", {
                        required: "Occupation is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select occupation type</option>
                      <option value="desk-job">Desk Job / Low Risk</option>
                      <option value="moderate-risk">Moderate Risk</option>
                      <option value="high-risk">High Risk</option>
                    </select>
                    {errors.occupation && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.occupation.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Health Condition *
                    </label>
                    <select
                      {...register("healthCondition", {
                        required: "Health condition is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                    {errors.healthCondition && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.healthCondition.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    {...register("smoker")}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    I am a smoker or use tobacco products
                  </label>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={calculating}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    {calculating ? (
                      <>
                        <FaSpinner className="animate-spin w-5 h-5" />
                        <span>Calculating...</span>
                      </>
                    ) : (
                      <>
                        <FaCalculator className="w-5 h-5" />
                        <span>Calculate Premium</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Policy Info & Tips */}
          <div className="space-y-6">
            {/* Policy Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Policy Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Policy Name:</span>
                  <span className="font-medium text-gray-800">
                    {policy.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-800">
                    {policy.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Premium:</span>
                  <span className="font-medium text-gray-800">
                    ${policy.basePremium}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age Range:</span>
                  <span className="font-medium text-gray-800">
                    {policy.minAge} - {policy.maxAge} years
                  </span>
                </div>
              </div>

              {/* Always visible Apply button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={handleApplyForPolicy}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaShieldAlt className="w-5 h-5" />
                  <span>Apply for This Policy</span>
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Skip the quote and apply directly
                </p>
              </div>
            </div>

            {/* Quote Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FaInfoCircle className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Quote Tips</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Younger applicants get lower premiums</li>
                <li>• Non-smokers receive significant discounts</li>
                <li>• Longer policy terms often have better rates</li>
                <li>• Good health conditions reduce premiums</li>
                <li>• This is an estimate - final rates may vary</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Result Modal */}
      <Modal
        isOpen={showQuoteModal}
        onClose={handleCloseModal}
        title="Your Insurance Quote"
        subtitle={`${policy?.title} - Premium Calculation`}
        icon={FaCheckCircle}
        size="3xl"
        headerColor="green"
      >
        {quote && (
          <div className="space-y-6">
            {/* Premium Results */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatCurrency(quote.monthlyPremium)}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Monthly Premium
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {formatCurrency(quote.annualPremium)}
                  </div>
                  <div className="text-sm text-green-700 font-medium">
                    Annual Premium
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 mb-1">
                    {formatCurrency(quote.totalPremium)}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total ({quote.duration} years)
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FaInfoCircle className="w-4 h-4 mr-2 text-blue-600" />
                Quote Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Coverage Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(quote.coverageAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Policy Duration:</span>
                    <span className="font-medium">{quote.duration} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{quote.age} years</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="font-medium capitalize">
                      {quote.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Smoker:</span>
                    <span className="font-medium">
                      {quote.smoker ? "Yes" : "No"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Health Condition:</span>
                    <span className="font-medium capitalize">
                      {quote.healthCondition}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApplyForPolicy}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaShieldAlt className="w-5 h-5" />
                <span>Apply for This Policy</span>
              </button>
              <button
                onClick={handleGetAnotherQuote}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
              >
                <FaCalculator className="w-5 h-5" />
                <span>Get Another Quote</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <FaExclamationTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This is an estimated quote based
                    on the information provided. The final premium may vary
                    based on medical examination, underwriting review, and other
                    factors. This quote is valid for 30 days from the date of
                    generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuotePage;
