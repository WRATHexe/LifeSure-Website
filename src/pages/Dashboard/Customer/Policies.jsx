import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaDollarSign,
  FaExclamationCircle,
  FaFileAlt,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaTimes,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ReviewModal from "./Reviews";
import PdfDownloader from "./pdfDownloader";

const Policies = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [selectedPolicy, setSelectedPolicy] = useState(null);
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
    const config = {
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: FaExclamationCircle,
        border: "border-yellow-200",
        label: "Pending",
      },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        icon: FaCheckCircle,
        border: "border-green-200",
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-800",
        icon: FaTimesCircle,
        border: "border-red-200",
        label: "Rejected",
      },
    };

    const c = config[status?.toLowerCase()] || config.pending;
    const Icon = c.icon;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${c.bg} ${c.text} ${c.border}`}
      >
        <Icon className="w-4 h-4 mr-1" />
        {c.label}
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

  const handleGiveReview = (policy) => {
    setReviewData({
      rating: 0,
      feedback: "",
      policyId: policy._id,
    });
    setSelectedPolicy(policy);
    setShowReviewModal(true);
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
                value: policies.filter((p) => p.status === "pending").length,
                icon: FaExclamationCircle,
                color: "yellow",
              },
              {
                title: "Approved",
                value: policies.filter((p) => p.status === "approved").length,
                icon: FaCheckCircle,
                color: "green",
              },
              {
                title: "Rejected",
                value: policies.filter((p) => p.status === "rejected").length,
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
                        Coverage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Premium
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
                          <span className="text-sm text-gray-900">
                            {policy.coverageAmount || policy.policy?.coverageMax
                              ? formatCurrency(
                                  policy.coverageAmount ||
                                    policy.policy?.coverageMax
                                )
                              : "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {policy.duration ||
                              policy.policy?.duration ||
                              "N/A"}
                          </span>
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
                            {policy.status === "approved" && (
                              <>
                                <button
                                  onClick={() => handleGiveReview(policy)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <FaStar className="h-3 w-3 mr-1" />
                                  Give Review
                                </button>
                                <PdfDownloader policy={policy} user={user} />
                              </>
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

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        policy={selectedPolicy}
        reviewData={reviewData}
        setReviewData={setReviewData}
        onSubmit={handleSubmitReview}
        isLoading={submitReviewMutation.isLoading}
      />
    </>
  );
};

export default Policies;
