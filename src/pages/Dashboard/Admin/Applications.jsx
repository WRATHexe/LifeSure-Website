import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCalendarAlt,
  FaCheck,
  FaEnvelope,
  FaEye,
  FaFileAlt,
  FaFilter,
  FaSearch,
  FaSort,
  FaSpinner,
  FaTimes,
  FaUser,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Applications = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("applicationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedAgent, setSelectedAgent] = useState({});

  // Fetch applications
  const {
    data: applications = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["applications", searchTerm, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const response = await axiosSecure.get("/applications", {
        params: {
          search: searchTerm,
          status: statusFilter !== "all" ? statusFilter : undefined,
          sortBy,
          sortOrder,
        },
      });
      return response.data;
    },
  });

  // Fetch agents for assignment
  const { data: agents = [] } = useQuery({
    queryKey: ["agents"],
    queryFn: async () => {
      const response = await axiosSecure.get("/agents");
      return response.data;
    },
  });

  // Assign agent mutation
  const assignAgentMutation = useMutation({
    mutationFn: async ({ applicationId, agentId }) => {
      const response = await axiosSecure.patch(
        `/applications/${applicationId}/assign-agent`,
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
    mutationFn: async (applicationId) => {
      const response = await axiosSecure.patch(
        `/applications/${applicationId}/reject`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Application rejected successfully!");
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

  const handleRejectApplication = (applicationId) => {
    if (window.confirm("Are you sure you want to reject this application?")) {
      rejectApplicationMutation.mutate(applicationId);
    }
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

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.policyName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Loading Applications | LifeSure Admin</title>
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
          <title>Error | LifeSure Admin</title>
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
        <title>
          Manage Applications ({applications.length}) | LifeSure Admin
        </title>
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
                value: applications.length,
                icon: FaFileAlt,
                color: "blue",
              },
              {
                title: "Pending",
                value: applications.filter((app) => app.status === "Pending")
                  .length,
                icon: FaSpinner,
                color: "yellow",
              },
              {
                title: "Approved",
                value: applications.filter((app) => app.status === "Approved")
                  .length,
                icon: FaCheck,
                color: "green",
              },
              {
                title: "Rejected",
                value: applications.filter((app) => app.status === "Rejected")
                  .length,
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

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Sort By */}
              <div className="relative">
                <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="applicationDate">Application Date</option>
                  <option value="applicantName">Applicant Name</option>
                  <option value="policyName">Policy Name</option>
                  <option value="status">Status</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
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
                  {filteredApplications.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <FaFileAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-lg font-medium">
                          No applications found
                        </p>
                        <p className="text-sm">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredApplications.map((application) => (
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
                          <div className="text-sm text-gray-500">
                            ID: {application.policyId || "N/A"}
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
                              <FaUserTie className="h-4 w-4 mr-2 text-green-600" />
                              <span className="text-sm text-gray-900">
                                {application.assignedAgent.name}
                              </span>
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
                                      <option key={agent._id} value={agent._id}>
                                        {agent.name}
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
                                onClick={() =>
                                  handleRejectApplication(application._id)
                                }
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

                            {/* View Details */}
                            <button
                              onClick={() => {
                                // Navigate to application details
                                // navigate(`/dashboard/admin/applications/${application._id}`);
                              }}
                              className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <FaEye className="h-3 w-3 mr-1" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination could be added here */}
        </div>
      </div>
    </>
  );
};

export default Applications;
