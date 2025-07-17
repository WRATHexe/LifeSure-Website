import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  FaCalendarAlt,
  FaDollarSign,
  FaEdit,
  FaEye,
  FaFilter,
  FaPlus,
  FaSave,
  FaSearch,
  FaSpinner,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import Select from "react-select";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Modal from "../../../components/Modal/Modal";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const axiosSecure = useAxiosSecure();

  // Category options for React Select
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
  ];

  // Form for adding new policy
  const addForm = useForm({
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

  // Form for editing policy
  const editForm = useForm({
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

  // Extract unique categories from policies data
  const extractCategoriesFromPolicies = (policiesData) => {
    const uniqueCategories = [
      ...new Set(
        policiesData
          .map((policy) => policy.category)
          .filter((category) => category && category.trim() !== "")
      ),
    ].sort();

    return ["All Categories", ...uniqueCategories];
  };

  // Fetch policies from backend
  const fetchPolicies = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axiosSecure.get("/policies");

      if (response.data.success) {
        const transformedPolicies = response.data.policies.map((policy) => ({
          ...policy,
          id: policy._id || policy.id,
        }));

        setPolicies(transformedPolicies || []);
        const dynamicCategories =
          extractCategoriesFromPolicies(transformedPolicies);
        setCategories(dynamicCategories);
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

  useEffect(() => {
    fetchPolicies();
  }, [fetchPolicies]);

  useEffect(() => {
    if (policies.length > 0) {
      const updatedCategories = extractCategoriesFromPolicies(policies);
      setCategories(updatedCategories);
    }
  }, [policies]);

  // Filter policies
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

  // 🎯 Handle adding new policy
  const handleAddPolicy = async (data) => {
    try {
      setFormLoading(true);

      // Validate age range
      if (parseInt(data.minAge) >= parseInt(data.maxAge)) {
        toast.error("Maximum age must be greater than minimum age!");
        return;
      }

      // Validate coverage range
      if (parseFloat(data.coverageMin) >= parseFloat(data.coverageMax)) {
        toast.error("Maximum coverage must be greater than minimum coverage!");
        return;
      }

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

      const response = await axiosSecure.post("/policies", transformedData);

      if (response.data.success) {
        toast.success("Policy created successfully! 🎉");
        setShowAddModal(false);
        addForm.reset();
        fetchPolicies(); // Refresh data
      } else {
        throw new Error(response.data.error || "Failed to create policy");
      }
    } catch (error) {
      console.error("Error adding policy:", error);
      toast.error(error.response?.data?.error || "Failed to add policy");
    } finally {
      setFormLoading(false);
    }
  };

  // 🎯 Handle editing policy - FIXED
  const handleEditPolicy = (policy) => {
    console.log("Edit policy clicked:", policy); // Debug log

    setEditingPolicy(policy);

    // Pre-fill the edit form
    editForm.reset({
      title: policy.title,
      category:
        categoryOptions.find((opt) => opt.value === policy.category) || null,
      description: policy.description,
      minAge: policy.minAge?.toString() || "",
      maxAge: policy.maxAge?.toString() || "",
      coverageMin: policy.coverageMin?.toString() || "",
      coverageMax: policy.coverageMax?.toString() || "",
      duration:
        durationOptions.find((opt) => opt.value === policy.duration) || null,
      basePremium: policy.basePremium?.toString() || "",
      imageUrl: policy.imageUrl || "",
    });

    setShowEditModal(true);
  };

  // 🎯 Handle updating policy
  const handleUpdatePolicy = async (data) => {
    if (!editingPolicy) return;

    try {
      setFormLoading(true);

      // Validate age range
      if (parseInt(data.minAge) >= parseInt(data.maxAge)) {
        toast.error("Maximum age must be greater than minimum age!");
        return;
      }

      // Validate coverage range
      if (parseFloat(data.coverageMin) >= parseFloat(data.coverageMax)) {
        toast.error("Maximum coverage must be greater than minimum coverage!");
        return;
      }

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
      };

      const response = await axiosSecure.put(
        `/policies/${editingPolicy._id}`,
        transformedData
      );

      if (response.data.success) {
        toast.success("Policy updated successfully! ✅");
        setShowEditModal(false);
        setEditingPolicy(null);
        editForm.reset();
        fetchPolicies(); // Refresh data
      } else {
        throw new Error(response.data.error || "Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      toast.error(error.response?.data?.error || "Failed to update policy");
    } finally {
      setFormLoading(false);
    }
  };

  // 🎯 Handle deleting policy with SweetAlert
  const handleDeletePolicy = async (policyId) => {
    const policy = policies.find(
      (p) => p.id === policyId || p._id === policyId
    );

    if (!policy) {
      toast.error("Policy not found!");
      return;
    }

    const result = await Swal.fire({
      title: "Delete Policy?",
      html: `
        <div class="text-left">
          <p class="mb-3"><strong>Policy:</strong> ${policy.title}</p>
          <p class="mb-3"><strong>Category:</strong> ${policy.category}</p>
          <p class="mb-3"><strong>Applications:</strong> ${
            policy.applicationsCount || 0
          }</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
            <p class="text-red-700 text-sm">
              ⚠️ This action cannot be undone and will affect any existing applications.
            </p>
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Delete Policy",
      cancelButtonText: "Cancel",
      focusCancel: true,
    });

    if (result.isConfirmed) {
      try {
        setDeleteLoading(policyId);

        const deleteId = policy._id || policyId;
        const response = await axiosSecure.delete(`/policies/${deleteId}`);

        if (response.data.success) {
          setPolicies((prev) =>
            prev.filter(
              (policy) => policy.id !== policyId && policy._id !== policyId
            )
          );

          await Swal.fire({
            title: "Deleted Successfully!",
            text: `${policy.title} has been removed from your policies.`,
            icon: "success",
            confirmButtonColor: "#059669",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error(response.data.error || "Failed to delete policy");
        }
      } catch (error) {
        console.error("Error deleting policy:", error);

        await Swal.fire({
          title: "Deletion Failed",
          text: error.response?.data?.error || "Failed to delete policy",
          icon: "error",
          confirmButtonColor: "#dc2626",
        });
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // 🎯 Handle viewing policy details
  const handleViewPolicy = async (policy) => {
    await Swal.fire({
      title: policy.title,
      html: `
        <div class="text-left space-y-3">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="font-semibold text-gray-700">Category:</p>
              <p class="text-gray-600">${policy.category}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Age Range:</p>
              <p class="text-gray-600">${policy.minAge} - ${
        policy.maxAge
      } years</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Duration:</p>
              <p class="text-gray-600">${policy.duration || "Not specified"}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Coverage Range:</p>
              <p class="text-gray-600">${formatCurrency(
                policy.coverageMin
              )} - ${formatCurrency(policy.coverageMax)}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Premium:</p>
              <p class="text-gray-600 font-semibold">$${
                policy.basePremium
              }/month</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Applications:</p>
              <p class="text-gray-600">${policy.applicationsCount || 0}</p>
            </div>
          </div>
          <div>
            <p class="font-semibold text-gray-700">Description:</p>
            <p class="text-gray-600 mt-1">${policy.description}</p>
          </div>
        </div>
      `,
      width: "600px",
      confirmButtonText: "Close",
      confirmButtonColor: "#3B82F6",
    });
  };

  // ✅ Modal close handlers
  const closeAddModal = () => {
    setShowAddModal(false);
    addForm.reset();
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingPolicy(null);
    editForm.reset();
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

  // Custom Select Styles
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: "44px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": {
        borderColor: "#3B82F6",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#3B82F6"
        : state.isFocused
        ? "#EFF6FF"
        : "white",
      color: state.isSelected ? "white" : "#374151",
    }),
  };

  // 🎨 Policy Form Component
  const PolicyForm = ({ form, onSubmit, isEdit = false }) => (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Policy Title <span className="text-red-500">*</span>
        </label>
        <input
          {...form.register("title", {
            required: "Policy title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters",
            },
          })}
          type="text"
          placeholder="e.g., Premium Term Life Insurance"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {form.formState.errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.title.message}
          </p>
        )}
      </div>

      {/* Category and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <Controller
            name="category"
            control={form.control}
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
          {form.formState.errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Duration
          </label>
          <Controller
            name="duration"
            control={form.control}
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
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          {...form.register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          placeholder="Comprehensive description of policy benefits..."
          rows="4"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
        {form.formState.errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Age Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Minimum Age <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("minAge", {
              required: "Minimum age is required",
              min: { value: 0, message: "Age must be positive" },
              max: { value: 100, message: "Age must be less than 100" },
            })}
            type="number"
            placeholder="18"
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.minAge && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.minAge.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Maximum Age <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("maxAge", {
              required: "Maximum age is required",
              min: { value: 0, message: "Age must be positive" },
              max: { value: 100, message: "Age must be less than 100" },
            })}
            type="number"
            placeholder="65"
            min="0"
            max="100"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.maxAge && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.maxAge.message}
            </p>
          )}
        </div>
      </div>

      {/* Coverage Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Min Coverage <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("coverageMin", {
              required: "Minimum coverage is required",
              min: { value: 0, message: "Coverage must be positive" },
            })}
            type="number"
            placeholder="10000"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.coverageMin && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.coverageMin.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Max Coverage <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("coverageMax", {
              required: "Maximum coverage is required",
              min: { value: 0, message: "Coverage must be positive" },
            })}
            type="number"
            placeholder="1000000"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.coverageMax && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.coverageMax.message}
            </p>
          )}
        </div>
      </div>

      {/* Premium and Image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Base Premium ($/month) <span className="text-red-500">*</span>
          </label>
          <input
            {...form.register("basePremium", {
              required: "Base premium is required",
              min: { value: 0, message: "Premium must be positive" },
            })}
            type="number"
            placeholder="50.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {form.formState.errors.basePremium && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.basePremium.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image URL <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <input
            {...form.register("imageUrl")}
            type="url"
            placeholder="https://example.com/image.jpg"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Form Actions - IMPROVED CLEAN STYLING */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 bg-gray-50 -mx-6 px-6 py-4 mt-6">
        <button
          type="button"
          onClick={() => {
            if (isEdit) {
              closeEditModal();
            } else {
              closeAddModal();
            }
          }}
          className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors shadow-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formLoading}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50 ${
            isEdit
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {formLoading ? (
            <>
              <FaSpinner className="animate-spin w-4 h-4" />
              <span>{isEdit ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <>
              <FaSave className="w-4 h-4" />
              <span>{isEdit ? "Update Policy" : "Create Policy"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );

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
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <FaPlus className="mr-2" />
          Add New Policy
        </button>
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
                  {category}{" "}
                  {category !== "All Categories" &&
                    `(${
                      policies.filter((p) => p.category === category).length
                    })`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterCategory) && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPolicies.length} of {policies.length} policies
            {searchTerm && <span> matching "{searchTerm}"</span>}
            {filterCategory && <span> in {filterCategory}</span>}
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          📊 Available Categories: {categories.length - 1} categories found from{" "}
          {policies.length} policies
        </div>
      </div>

      {/* ✅ Policies Table - STATUS COLUMN REMOVED */}
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
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <FaPlus className="mr-2" />
                Add Your First Policy
              </button>
            )}
          </div>
        )}
      </div>

      {/* ✅ Add Policy Modal - Using Modal Component */}
      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title="Add New Policy"
        subtitle="Create a comprehensive insurance policy"
        icon={FaPlus}
        headerColor="blue"
        size="4xl"
      >
        <PolicyForm form={addForm} onSubmit={handleAddPolicy} />
      </Modal>

      {/* ✅ Edit Policy Modal - Using Modal Component */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title="Edit Policy"
        subtitle={editingPolicy ? `Editing: ${editingPolicy.title}` : ""}
        icon={FaEdit}
        headerColor="green"
        size="4xl"
      >
        <PolicyForm
          form={editForm}
          onSubmit={handleUpdatePolicy}
          isEdit={true}
        />
      </Modal>
    </div>
  );
};

export default AdminPolicies;
