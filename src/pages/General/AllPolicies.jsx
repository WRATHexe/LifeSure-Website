// filepath: d:\Hero Batch 11\Assignments\Assignment 12\LifeSure-Client\src\pages\General\Allpolicies.jsx
import { useCallback, useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaDollarSign,
  FaFilter,
  FaHeart,
  FaSearch,
  FaShieldAlt,
  FaSpinner,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { toast } from "react-toastify";
import PolicyCard from "../../components/PolicyCard";
import useAxios from "../../hooks/useAxios";

const AllPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const axios = useAxios();

  const POLICIES_PER_PAGE = 6;

  // Fetch policies from backend
  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/policies");

      if (response.data.success) {
        const transformedPolicies = response.data.policies.map((policy) => ({
          ...policy,
          id: policy._id || policy.id,
        }));

        setPolicies(transformedPolicies);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(
            transformedPolicies
              .map((policy) => policy.category)
              .filter((category) => category && category.trim() !== "")
          ),
        ].sort();

        setCategories(["All", ...uniqueCategories]);
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
  }, [axios]);

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  // Filter policies
  useEffect(() => {
    let filtered = [...policies];

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (policy) => policy.category === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (policy) =>
          policy.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          policy.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPolicies(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [policies, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPolicies.length / POLICIES_PER_PAGE);
  const startIndex = (currentPage - 1) * POLICIES_PER_PAGE;
  const endIndex = startIndex + POLICIES_PER_PAGE;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Our Insurance Policies
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Comprehensive coverage tailored to protect what matters most to
              you and your loved ones
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <FaShieldAlt className="text-blue-200" />
                <span>Trusted Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaHeart className="text-blue-200" />
                <span>Family First</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar className="text-blue-200" />
                <span>Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FaShieldAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Policies
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {policies.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FaUsers className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length - 1}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <FaDollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Starting From
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {policies.length > 0
                    ? formatCurrency(
                        Math.min(...policies.map((p) => p.basePremium || 0))
                      )
                    : "$0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[200px]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}{" "}
                    {category !== "All" &&
                      `(${
                        policies.filter((p) => p.category === category).length
                      })`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results info */}
          {(searchTerm || selectedCategory !== "All") && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredPolicies.length} of {policies.length} policies
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {selectedCategory !== "All" && (
                <span> in {selectedCategory}</span>
              )}
            </div>
          )}
        </div>

        {/* Policies Grid using PolicyCard Component */}
        {currentPolicies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentPolicies.map((policy, index) => (
              <PolicyCard key={policy.id} policy={policy} index={index} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Policies Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "No insurance policies are currently available."}
            </p>
            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <FaChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        {totalPages > 1 && (
          <div className="text-center mt-4 text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredPolicies.length)} of{" "}
            {filteredPolicies.length} policies
          </div>
        )}
      </div>
    </div>
  );
};

export default AllPolicies;
