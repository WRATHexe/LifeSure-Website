import { useCallback, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { Link } from "react-router";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const axiosSecure = useAxiosSecure();

  const categories = [
    "All Categories",
    "Term Life Insurance",
    "Whole Life Insurance",
    "Universal Life Insurance",
    "Variable Life Insurance",
    "Senior Life Insurance",
    "Child Life Insurance",
    "Group Life Insurance",
    "Critical Illness Insurance",
    "Disability Insurance",
  ];

  // Fetch policies from backend
  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/policies");

      if (response.data.success) {
        // Transform MongoDB _id to id for frontend compatibility
        const transformedPolicies = response.data.policies.map((policy) => ({
          ...policy,
          id: policy._id || policy.id, // Handle both _id and id
        }));
        setPolicies(transformedPolicies || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch policies");
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
      toast.error("Failed to load policies. Please try again.");
      setPolicies([]);
    } finally {
      setIsLoading(false);
    }
  }, [axiosSecure]);

  // Load policies on component mount
  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Filter policies based on search and category
  const filteredPolicies = policies.filter((policy) => {
    const matchesSearch =
      policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "" ||
      filterCategory === "All Categories" ||
      policy.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle deleting policy
  const handleDeletePolicy = async (policyId) => {
    const policy = policies.find(
      (p) => p.id === policyId || p._id === policyId
    );
    const confirmMessage = `Are you sure you want to delete "${policy?.title}"?\n\nThis action cannot be undone and will affect any existing applications.`;

    if (window.confirm(confirmMessage)) {
      try {
        setDeleteLoading(policyId);

        // Use the correct ID format for the API call
        const deleteId = policy._id || policyId;
        const response = await axiosSecure.delete(`/policies/${deleteId}`);

        if (response.data.success) {
          setPolicies((prev) =>
            prev.filter(
              (policy) => policy.id !== policyId && policy._id !== policyId
            )
          );
          toast.success("Policy deleted successfully!");
        } else {
          throw new Error(response.data.message || "Failed to delete policy");
        }
      } catch (error) {
        console.error("Error deleting policy:", error);
        let errorMessage = "Failed to delete policy. Please try again.";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        toast.error(errorMessage);
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Handle editing policy (placeholder for future implementation)
  const handleEditPolicy = (policy) => {
    toast.info("Edit functionality will be implemented in the next version!", {
      position: "top-right",
      autoClose: 3000,
    });
    console.log("Edit policy:", policy);
  };

  // Handle viewing policy details
  const handleViewPolicy = (policy) => {
    toast.info("View details functionality coming soon!", {
      position: "top-right",
      autoClose: 3000,
    });
    console.log("View policy:", policy);
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const calculateStats = () => {
    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p) => p.status === "Active").length;
    const totalApplications = policies.reduce(
      (sum, p) => sum + (p.applicationsCount || 0),
      0
    );
    const avgPremium =
      totalPolicies > 0
        ? policies.reduce((sum, p) => sum + (p.basePremium || 0), 0) /
          totalPolicies
        : 0;

    return { totalPolicies, activePolicies, totalApplications, avgPremium };
  };

  const stats = calculateStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading policies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Policies</h1>
          <p className="mt-2 text-gray-600">
            Create, edit, and manage your insurance policies
          </p>
        </div>
        <Link
          to="/dashboard/admin/policies/add"
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPlus className="mr-2" />
          Add New Policy
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Policies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalPolicies}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaDollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Active Policies
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.activePolicies}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaCalendarAlt className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalApplications}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100">
              <FaDollarSign className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                ${stats.avgPremium.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search policies by title, category, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[200px]"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category === "All Categories" ? "" : category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Results Summary */}
        {(searchTerm || filterCategory) && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPolicies.length} of {policies.length} policies
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {filterCategory && <span> in {filterCategory}</span>}
          </div>
        )}
      </div>

      {/* Policies Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Policy
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age Range
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coverage Range
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Premium
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applications
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPolicies.map((policy) => (
                <tr
                  key={policy.id || policy._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className="h-12 w-12 rounded-lg object-cover"
                        src={
                          policy.imageUrl ||
                          "https://via.placeholder.com/48/3B82F6/FFFFFF?text=P"
                        }
                        alt={policy.title}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48/3B82F6/FFFFFF?text=P";
                        }}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                          {policy.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {policy.duration || "No duration specified"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {policy.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {policy.minAge} - {policy.maxAge} years
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(policy.coverageMin)} -{" "}
                    {formatCurrency(policy.coverageMax)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${policy.basePremium}/month
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {policy.applicationsCount || 0} applications
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        policy.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {policy.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewPolicy(policy)}
                        className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-full transition-colors duration-200"
                        title="View Details"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditPolicy(policy)}
                        className="text-green-600 hover:text-green-900 p-2 hover:bg-green-50 rounded-full transition-colors duration-200"
                        title="Edit Policy"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          handleDeletePolicy(policy.id || policy._id)
                        }
                        disabled={deleteLoading === (policy.id || policy._id)}
                        className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors duration-200 disabled:opacity-50"
                        title="Delete Policy"
                      >
                        {deleteLoading === (policy.id || policy._id) ? (
                          <FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPolicies.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">
              {policies.length === 0
                ? "No policies found"
                : "No policies match your search"}
            </div>
            <p className="text-gray-500 mb-4">
              {policies.length === 0
                ? "Get started by adding your first policy"
                : "Try adjusting your search or filter criteria"}
            </p>
            {policies.length === 0 && (
              <Link
                to="/dashboard/admin/policies/add"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                Add Your First Policy
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPolicies;
