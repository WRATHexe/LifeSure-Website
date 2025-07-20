import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCalendarAlt,
  FaCheck,
  FaEnvelope,
  FaFileAlt,
  FaSpinner,
  FaTimes,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Modal from "../../../components/Modal/Modal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Applications = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [selectedAgent, setSelectedAgent] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingAppId, setRejectingAppId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");

  // Fetch applications (no params)
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/applications");
      return response.data.applications || [];
    },
  });

  // Fetch agents for assignment
  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const response = await axiosSecure.get("/admin/agents");
      return response.data.agents || [];
    },
  });

  // Assign agent mutation
  const assignAgentMutation = useMutation({
    mutationFn: async ({ applicationId, agentId }) => {
      const response = await axiosSecure.patch(
        `/admin/applications/${applicationId}/assign-agent`,
        {
          agentId,
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      toast.success("Agent assigned successfully!");
      queryClient.invalidateQueries(["applications"]);
      setSelectedAgent((prev) => ({ ...prev, [data.applicationId]: "" }));
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to assign agent");
    },
  });

  // Reject application mutation
  const rejectApplicationMutation = useMutation({
    mutationFn: async ({ applicationId, feedback }) => {
      const response = await axiosSecure.patch(
        `/admin/applications/${applicationId}/reject`,
        { feedback }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application rejected with feedback!");
      setShowRejectModal(false); // <-- add this
      queryClient.invalidateQueries(["applications"]);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to reject application"
      );
    },
  });

  const handleAssignAgent = (applicationId) => {
    const agentId = selectedAgent[applicationId];
    if (!agentId) {
      toast.error("Please select an agent first");
      return;
    }
    assignAgentMutation.mutate({ applicationId, agentId });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        icon: FaSpinner,
      },
      Approved: { bg: "bg-green-100", text: "text-green-800", icon: FaCheck },
      Rejected: { bg: "bg-red-100", text: "text-red-800", icon: FaTimes },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        <Icon className="w-3 h-3 mr-1" />
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

  // Remove filtering and search, just use all applications
  const safeApplications = Array.isArray(applications) ? applications : [];

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Applications | LifeSure Admin</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4 mx-auto" />
            <p className="text-gray-600">Loading applications...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Applications | LifeSure Admin</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <FaTimes className="text-4xl text-red-600 mb-4 mx-auto" />
            <p className="text-gray-600">Failed to load applications</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Applications | LifeSure Admin</title>
        <meta
          name="description"
          content="Manage insurance policy applications, assign agents, and update application status"
        />
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Manage Applications
            </h1>
            <p className="text-gray-600">
              Review and manage insurance policy applications from users
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Applications",
                value: safeApplications.length,
                icon: FaFileAlt,
                color: "blue",
              },
              {
                title: "Pending",
                value: safeApplications.filter(
                  (app) => app.status === "Pending"
                ).length,
                icon: FaSpinner,
                color: "yellow",
              },
              {
                title: "Approved",
                value: safeApplications.filter(
                  (app) => app.status === "Approved"
                ).length,
                icon: FaCheck,
                color: "green",
              },
              {
                title: "Rejected",
                value: safeApplications.filter(
                  (app) => app.status === "Rejected"
                ).length,
                icon: FaTimes,
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

          {/* Applications Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
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
                      Assigned Agent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safeApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">
                          No applications found
                        </p>
                        <p className="text-sm">No data available.</p>
                      </td>
                    </tr>
                  ) : (
                    safeApplications.map((application) => (
                      <tr key={application._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {application.personalInfo?.fullName || "N/A"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FaEnvelope className="h-3 w-3 mr-1" />
                                {application.personalInfo?.email || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {application.policyName || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <FaCalendarAlt className="h-4 w-4 mr-2 text-gray-400" />
                            {formatDate(
                              application.submittedAt || application.createdAt
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(application.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {application.assignedAgent ? (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <FaUserTie className="h-5 w-5 text-green-600" />
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {application.assignedAgentName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <FaEnvelope className="h-3 w-3 mr-1" />
                                  {application.assignedAgentEmail}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              Not assigned
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {/* Assign Agent */}
                            {application.status === "Pending" &&
                              !application.assignedAgent && (
                                <div className="flex items-center space-x-2">
                                  <select
                                    value={selectedAgent[application._id] || ""}
                                    onChange={(e) =>
                                      setSelectedAgent((prev) => ({
                                        ...prev,
                                        [application._id]: e.target.value,
                                      }))
                                    }
                                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">Select Agent</option>
                                    {agents.map((agent) => (
                                      <option key={agent.uid} value={agent.uid}>
                                        {agent.displayName || agent.email}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    onClick={() =>
                                      handleAssignAgent(application._id)
                                    }
                                    disabled={assignAgentMutation.isLoading}
                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                  >
                                    {assignAgentMutation.isLoading ? (
                                      <FaSpinner className="animate-spin h-3 w-3" />
                                    ) : (
                                      <>
                                        <FaCheck className="h-3 w-3 mr-1" />
                                        Assign
                                      </>
                                    )}
                                  </button>
                                </div>
                              )}

                            {/* Reject Button */}
                            {application.status === "Pending" && (
                              <button
                                onClick={() => {
                                  setRejectingAppId(application._id);
                                  setShowRejectModal(true);
                                  setFeedback(""); // reset feedback
                                }}
                                disabled={rejectApplicationMutation.isLoading}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                              >
                                {rejectApplicationMutation.isLoading ? (
                                  <FaSpinner className="animate-spin h-3 w-3" />
                                ) : (
                                  <>
                                    <FaTimes className="h-3 w-3 mr-1" />
                                    Reject
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Reject Application Modal */}
        {showRejectModal && (
          <Modal
            isOpen={showRejectModal}
            onRequestClose={() => setShowRejectModal(false)}
            className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reject Application
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason for rejection. This will be visible to the
              applicant.
            </p>
            <textarea
              value={feedback}
              onChange={(e) => {
                if (e.target.value.length <= 300) setFeedback(e.target.value);
                if (e.target.value.trim()) setFeedbackError("");
              }}
              maxLength={300}
              rows={4}
              className={`w-full border rounded-md p-2 mb-1 focus:ring-2 focus:ring-blue-500 ${
                feedbackError ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Feedback is required"
            />
            <div className="flex justify-between items-center mb-2">
              {feedbackError && (
                <span className="text-red-500 text-xs">{feedbackError}</span>
              )}
              <span className="text-xs text-gray-400">
                {feedback.length}/300
              </span>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!feedback.trim()) {
                    setFeedbackError("Feedback is required");
                    toast.error("Feedback is required");
                    return;
                  }
                  setFeedbackError("");
                  rejectApplicationMutation.mutate({
                    applicationId: rejectingAppId,
                    feedback,
                  });
                }}
                disabled={rejectApplicationMutation.isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {rejectApplicationMutation.isLoading ? (
                  <FaSpinner className="animate-spin h-4 w-4" />
                ) : (
                  "Reject Application"
                )}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </>
  );
};

export default Applications;
