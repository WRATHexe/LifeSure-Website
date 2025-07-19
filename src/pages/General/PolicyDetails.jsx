import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaClock,
  FaDollarSign,
  FaInfoCircle,
  FaQuoteLeft,
  FaShieldAlt,
  FaSpinner,
  FaUser,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PolicyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Fetch policy details using TanStack Query
  const {
    data: policy,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["policy", id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/policies/${id}`);

      if (response.data.success) {
        return response.data.policy;
      } else {
        throw new Error(response.data.message || "Policy not found");
      }
    },
    enabled: !!id, // Only run query if id exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    onError: (error) => {
      console.error("Error fetching policy details:", error);
      toast.error("Failed to load policy details");
      navigate("/Policies");
    },
  });

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handleGetQuote = () => {
    navigate(`/quote/${policy._id}`);
  };

  const handleBookConsultation = () => {
    navigate("/consultation", {
      state: { policyId: policy._id, policyTitle: policy.title },
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading policy details...</p>
        </div>
      </div>
    );
  }

  if (isError || !policy) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <FaInfoCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Policy Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            {error?.message || "The policy you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/Policies")}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Back to Policies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/Policies")}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to Policies</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Content */}
            <div className="p-8 lg:p-12">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FaShieldAlt className="w-4 h-4" />
                <span>{policy.category}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {policy.title}
              </h1>

              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {policy.description}
              </p>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaDollarSign className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">
                      Starting at
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">
                    ${policy.basePremium}
                    <span className="text-sm text-gray-500">/month</span>
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <FaShieldAlt className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">
                      Max Coverage
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">
                    {formatCurrency(policy.coverageMax)}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleGetQuote}
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <FaQuoteLeft className="w-5 h-5" />
                  <span>Get Quote</span>
                </button>

                <button
                  onClick={handleBookConsultation}
                  className="flex items-center justify-center space-x-2 bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-200"
                >
                  <FaUserTie className="w-5 h-5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:p-8">
              <div className="relative h-64 lg:h-full min-h-[300px]">
                <img
                  src={
                    policy.imageUrl ||
                    `https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=${encodeURIComponent(
                      policy.title
                    )}`
                  }
                  alt={policy.title}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=${encodeURIComponent(
                      policy.title
                    )}`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUser className="w-5 h-5 text-blue-600" />
              </div>
              <span className="font-semibold text-gray-900">Age Range</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {policy.minAge} - {policy.maxAge} years
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaShieldAlt className="w-5 h-5 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Coverage</span>
            </div>
            <p className="text-lg font-bold text-gray-800">
              {formatCurrency(policy.coverageMin)} -{" "}
              {formatCurrency(policy.coverageMax)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaClock className="w-5 h-5 text-purple-600" />
              </div>
              <span className="font-semibold text-gray-900">Duration</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {policy.duration || "Flexible"}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FaUsers className="w-5 h-5 text-orange-600" />
              </div>
              <span className="font-semibold text-gray-900">Applications</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">
              {policy.applicationsCount || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyDetails;
