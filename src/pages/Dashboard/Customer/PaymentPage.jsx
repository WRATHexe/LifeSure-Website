import { loadStripe } from "@stripe/stripe-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaLock,
  FaShieldAlt,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe(import.meta.env.VITE_PAY_KEY);

const PaymentPage = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // Get applicationId from URL
  const applicationId = searchParams.get("applicationId");

  const [stripe, setStripe] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState("");

  // Payment form data
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: user?.displayName || "",
  });

  // Initialize Stripe
  useEffect(() => {
    const initializeStripe = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
    };
    initializeStripe();
  }, []);

  // Fetch application details
  const {
    data: application,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["application-details", applicationId],
    queryFn: async () => {
      const response = await axiosSecure.get(`/applications/${applicationId}`);
      return response.data.application;
    },
    enabled: !!applicationId,
  });

  // Create payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (
        !application?.basePremium ||
        isNaN(application.basePremium) ||
        Number(application.basePremium) <= 0
      ) {
        toast.error("Invalid payment amount");
        return;
      }
      try {
        const response = await axiosSecure.post("/create-payment-intent", {
          amount: Number(application.basePremium),
          policyId: application.policyId,
        });
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        toast.error("Failed to initialize payment");
      }
    };

    if (
      application &&
      application.basePremium &&
      application.policyId &&
      user?.uid
    ) {
      createPaymentIntent();
    }
  }, [application, user?.uid, axiosSecure]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Format card number
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formattedValue = value.match(/.{1,4}/g)?.join(" ") || value;
    setPaymentData((prev) => ({ ...prev, cardNumber: formattedValue }));
  };

  // Format expiry date
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4);
    }
    setPaymentData((prev) => ({ ...prev, expiryDate: value }));
  };

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async () => {
      if (!stripe || !clientSecret) {
        throw new Error("Stripe not initialized");
      }

      setIsProcessing(true);

      // Mock payment processing (replace with real Stripe payment)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful payment response
      const paymentResult = {
        paymentIntent: {
          id: `pi_${Date.now()}`,
          status: "succeeded",
          amount: Math.round(Number(application.basePremium) * 100),
        },
      };

      // Record payment in database
      await axiosSecure.post("/confirm-payment", {
        paymentIntentId: paymentResult.paymentIntent.id,
        policyId: application.policyId,
        userId: user?.uid,
        amount: Number(application.basePremium),
      });

      return paymentResult;
    },
    onSuccess: (data) => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTransactionId(data.paymentIntent.id);
      toast.success("Payment processed successfully!");

      // Auto-redirect after 5 seconds
      setTimeout(() => {
        navigate("/dashboard/customer/payments");
      }, 5000);
    },
    onError: (error) => {
      setIsProcessing(false);
      toast.error("Payment failed. Please try again.");
      console.error("Payment error:", error);
    },
  });

  // Validate form
  const validateForm = () => {
    if (
      !paymentData.cardNumber ||
      paymentData.cardNumber.replace(/\s/g, "").length < 13
    ) {
      toast.error("Please enter a valid card number");
      return false;
    }
    if (!paymentData.expiryDate || paymentData.expiryDate.length !== 5) {
      toast.error("Please enter a valid expiry date");
      return false;
    }
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    if (!paymentData.cardholderName.trim()) {
      toast.error("Please enter cardholder name");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmitPayment = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    processPaymentMutation.mutate();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Redirect if no payment data
  useEffect(() => {
    if (
      !applicationId ||
      !application?.basePremium ||
      isNaN(application.basePremium) ||
      Number(application.basePremium) <= 0
    ) {
      toast.error("Invalid payment link");
      navigate("/dashboard/customer/payments");
    }
  }, [applicationId, application, navigate]);

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Payment | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !application) {
    return (
      <>
        <Helmet>
          <title>Payment Error | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimes className="text-4xl text-red-600 mb-4 mx-auto" />
            <p className="text-gray-600">Failed to load payment details</p>
            <button
              onClick={() => navigate("/dashboard/customer/payments")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Payments
            </button>
          </div>
        </div>
      </>
    );
  }

  // Payment Success Screen
  if (paymentSuccess) {
    return (
      <>
        <Helmet>
          <title>Payment Successful | LifeSure</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h1>

              <p className="text-gray-600 mb-6">
                Your premium payment has been processed successfully.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Amount Paid:</span>
                  <span className="font-semibold">
                    {formatCurrency(application.basePremium)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Policy:</span>
                  <span className="font-semibold">
                    {application.policyName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-xs">{transactionId}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard/customer/payments")}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  View Payment History
                </button>
                <button
                  onClick={() => navigate("/dashboard/customer/policies")}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  View My Policies
                </button>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Redirecting in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Main Payment Form
  return (
    <>
      <Helmet>
        <title>Secure Payment | LifeSure</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Secure Payment
            </h1>
            <p className="text-gray-600">
              Complete your premium payment securely
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <FaLock className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-600">Secure Payment</span>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-6">
                  {/* Card Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="cardNumber"
                        value={paymentData.cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <FaCreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={paymentData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <FaSpinner className="animate-spin w-5 h-5" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <FaLock className="w-5 h-5" />
                        <span>
                          Pay {formatCurrency(application.basePremium)}
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaShieldAlt className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {application.policyName}
                      </p>
                      <p className="text-sm text-gray-600">Premium Payment</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">
                        {formatCurrency(application.basePremium)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Processing Fee:</span>
                      <span className="font-semibold">$0.00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          Total:
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {formatCurrency(application.basePremium)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <FaLock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">
                        Secure Payment
                      </span>
                    </div>
                    <p className="text-xs text-blue-800">
                      Your payment information is encrypted and secure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
