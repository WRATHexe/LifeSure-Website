import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
    FaCalendarAlt,
    FaCheckCircle,
    FaDollarSign,
    FaExclamationCircle,
    FaEye,
    FaFileAlt,
    FaInfoCircle,
    FaShieldAlt,
    FaSpinner,
    FaStar,
    FaTimes,
    FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Policies = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 0,
    feedback: "",
    policyId: "",
  });

  // Fetch user's policies
  const {
    data: policies = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-policies", user?.uid],
    queryFn: async () => {
      const response = await axiosSecure.get(`/applications/user/${user?.uid}`);
      // ✅ FIX: Access the applications array correctly
      return response.data.applications || []; // Make sure to return the applications array
    },
    enabled: !!user?.uid,
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      const response = await axiosSecure.post("/reviews", {
        ...reviewData,
        userId: user?.uid,
        userName: user?.displayName || "Anonymous",
        userEmail: user?.email,
        submittedAt: new Date().toISOString(),
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setShowReviewModal(false);
      setReviewData({ rating: 0, feedback: "", policyId: "" });
      queryClient.invalidateQueries(["user-policies"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit review");
    },
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: FaExclamationCircle,
        border: "border-yellow-200",
      },
      Approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: FaCheckCircle,
        border: "border-green-200",
      },
      Rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: FaTimesCircle,
        border: "border-red-200",
      },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleViewDetails = (policy) => {
    setSelectedPolicy(policy);
    setShowDetailsModal(true);
  };

  const handleGiveReview = (policy) => {
    setReviewData({
      rating: 0,
      feedback: "",
      policyId: policy._id,
    });
    setSelectedPolicy(policy);
    setShowReviewModal(true);
  };

  const handleStarClick = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (reviewData.rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    if (!reviewData.feedback.trim()) {
      toast.error("Please write your feedback");
      return;
    }

    submitReviewMutation.mutate(reviewData);
  };

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading My Policies | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
            <p className="text-gray-600">Loading your policies...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error | LifeSure</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimes className="text-4xl text-red-600 mb-4 mx-auto" />
            <p className="text-gray-600">Failed to load your policies</p>
            <p className="text-sm text-gray-500 mt-2">
              {error?.message || "Please try again later"}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Policies | LifeSure</title>
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Policies
            </h1>
            <p className="text-gray-600">
              View all your applied insurance policies and their current status
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Applications",
                value: policies.length,
                icon: FaFileAlt,
                color: "blue",
              },
              {
                title: "Pending",
                value: policies.filter((p) => p.status === "Pending").length,
                icon: FaExclamationCircle,
                color: "yellow",
              },
              {
                title: "Approved",
                value: policies.filter((p) => p.status === "Approved").length,
                icon: FaCheckCircle,
                color: "green",
              },
              {
                title: "Rejected",
                value: policies.filter((p) => p.status === "Rejected").length,
                icon: FaTimesCircle,
                color: "red",
              },
            ].map((stat) => (
              <div key={stat.title} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div
                    className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Policies List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {policies.length === 0 ? (
              <div className="text-center py-12">
                <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No policies found
                </h3>
                <p className="text-gray-600">
                  You haven't applied for any insurance policies yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Policy
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {policies.map((policy, index) => (
                      <tr
                        key={policy._id || index}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaShieldAlt className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {policy.policyName ||
                                  policy.policy?.title ||
                                  "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID:{" "}
                                {policy.policyId || policy.policy?._id || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(
                              policy.submittedAt ||
                                policy.createdAt ||
                                new Date()
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(policy.status || "Pending")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaDollarSign className="h-4 w-4 mr-1 text-gray-400" />
                            {policy.premium || policy.policy?.premium
                              ? formatCurrency(
                                  policy.premium || policy.policy?.premium
                                )
                              : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(policy)}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaEye className="h-3 w-3 mr-1" />
                              View Details
                            </button>
                            {policy.status === "Approved" && (
                              <button
                                onClick={() => handleGiveReview(policy)}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <FaStar className="h-3 w-3 mr-1" />
                                Give Review
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Policy Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Policy Details"
        subtitle={selectedPolicy?.policyName || selectedPolicy?.policy?.title}
        icon={FaInfoCircle}
        size="2xl"
        headerColor="blue"
      >
        {selectedPolicy && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Name
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPolicy.policyName ||
                    selectedPolicy.policy?.title ||
                    "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy ID
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPolicy.policyId ||
                    selectedPolicy.policy?._id ||
                    "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coverage Amount
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPolicy.coverageAmount ||
                  selectedPolicy.policy?.coverageAmount
                    ? formatCurrency(
                        selectedPolicy.coverageAmount ||
                          selectedPolicy.policy?.coverageAmount
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Premium
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPolicy.premium || selectedPolicy.policy?.premium
                    ? formatCurrency(
                        selectedPolicy.premium || selectedPolicy.policy?.premium
                      )
                    : "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {selectedPolicy.duration ||
                    selectedPolicy.policy?.duration ||
                    "N/A"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Application Date
                </label>
                <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {formatDate(
                    selectedPolicy.submittedAt ||
                      selectedPolicy.createdAt ||
                      new Date()
                  )}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="bg-gray-50 p-3 rounded-lg">
                {getStatusBadge(selectedPolicy.status || "Pending")}
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Review Modal */}
      <Modal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        title="Submit Review"
        subtitle={selectedPolicy?.policyName || selectedPolicy?.policy?.title}
        icon={FaStar}
        size="2xl"
        headerColor="green"
      >
        {selectedPolicy && (
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate your experience *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className={`text-3xl transition-all duration-200 hover:scale-110 ${
                      star <= reviewData.rating
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {reviewData.rating > 0 &&
                    `${reviewData.rating} star${
                      reviewData.rating > 1 ? "s" : ""
                    }`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share your feedback *
              </label>
              <textarea
                value={reviewData.feedback}
                onChange={(e) =>
                  setReviewData((prev) => ({
                    ...prev,
                    feedback: e.target.value,
                  }))
                }
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Tell us about your experience with this policy or the agent who helped you..."
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Your review will be displayed as a testimonial on our website.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitReviewMutation.isLoading}
                className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {submitReviewMutation.isLoading ? (
                  <div className="flex items-center justify-center">
                    <FaSpinner className="animate-spin h-4 w-4" />
                  </div>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  );
};

export default Policies;
