import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  FaCalendarAlt,
  FaCertificate,
  FaEdit,
  FaEnvelope,
  FaLink,
  FaSave,
  FaShieldAlt,
  FaSpinner,
  FaTimes,
  FaUser,
  FaUserCheck,
  FaUserCog,
  FaUserTie,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    photoURL: "",
  });

  // GET user profile data using TanStack Query
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ["user-profile", user?.uid],
    queryFn: async () => {
      const response = await axiosSecure.get(`/users/${user?.uid}`);
      return response.data;
    },
    enabled: !!user?.uid,
    retry: 1,
    onError: (error) => {
      console.log(
        "Profile fetch error:",
        error.response?.data?.message || error.message
      );
      // Don't show error toast for 404, as this means user might not be in DB yet
      if (error.response?.status !== 404) {
        toast.error("Failed to load profile data");
      }
    },
  });

  // Sync profile data from user context when component mounts or user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        displayName: user.displayName || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  // Use role from backend or fallback to customer
  const userRole = userProfile?.user?.role || "customer";

  // Update profile mutation - matches your backend endpoint
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData) => {
      // Step 1: Update Firebase profile first
      await updateProfile(user, {
        displayName: updatedData.displayName,
        photoURL: updatedData.photoURL,
      });

      // Step 2: Update database using your backend endpoint
      const response = await axiosSecure.patch(`/users/${user?.uid}/profile`, {
        displayName: updatedData.displayName,
        photoURL: updatedData.photoURL,
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      // Step 3: Update the auth context
      updateUserProfile({
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });

      // Step 4: Invalidate and refetch user profile from backend
      queryClient.invalidateQueries(["user-profile", user?.uid]);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      toast.error(errorMessage);
      console.error("Profile update error:", error);
    },
  });

  // Update last login when component mounts (optional)
  const updateLastLoginMutation = useMutation({
    mutationFn: async () => {
      const response = await axiosSecure.patch(
        `/users/${user?.uid}/last-login`
      );
      return response.data;
    },
    onError: (error) => {
      console.log("Last login update failed:", error);
      // Don't show error to user as this is background operation
    },
  });

  // Update last login on component mount (optional)
  useEffect(() => {
    if (user?.uid) {
      updateLastLoginMutation.mutate();
    }
  }, [user?.uid, updateLastLoginMutation]);

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        label: "Administrator",
        icon: FaUserCog,
        bgColor: "bg-purple-100",
        textColor: "text-purple-800",
        borderColor: "border-purple-200",
        iconColor: "text-purple-600",
      },
      agent: {
        label: "Insurance Agent",
        icon: FaUserTie,
        bgColor: "bg-blue-100",
        textColor: "text-blue-800",
        borderColor: "border-blue-200",
        iconColor: "text-blue-600",
      },
      customer: {
        label: "Customer",
        icon: FaUser,
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        borderColor: "border-green-200",
        iconColor: "text-green-600",
      },
    };

    const config = roleConfig[role] || roleConfig.customer;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center px-4 py-2 rounded-full border ${config.bgColor} ${config.textColor} ${config.borderColor}`}
      >
        <Icon className={`w-4 h-4 mr-2 ${config.iconColor}`} />
        <span className="font-medium">{config.label}</span>
        <FaCertificate className={`w-4 h-4 ml-2 ${config.iconColor}`} />
      </div>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!profileData.displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    // Validate image URL if provided
    if (profileData.photoURL && !isValidUrl(profileData.photoURL)) {
      toast.error("Please enter a valid image URL");
      return;
    }

    updateProfileMutation.mutate(profileData);
  };

  const handleCancel = () => {
    // Reset to current user data from context
    setProfileData({
      displayName: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
    setIsEditing(false);
  };

  // URL validation helper
  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state
  if (isProfileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <FaSpinner className="animate-spin w-8 h-8 text-blue-600" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile fetch failed (but not for 404)
  if (profileError && profileError.response?.status !== 404) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4 text-center">
          <FaTimes className="w-12 h-12 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Failed to Load Profile
          </h2>
          <p className="text-gray-600">Please try refreshing the page</p>
          <button
            onClick={() =>
              queryClient.invalidateQueries(["user-profile", user?.uid])
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Profile | LifeSure</title>
      </Helmet>

      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              My Profile
            </h1>
            <p className="text-gray-600">
              Manage your account information and settings
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Cover Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 relative">
              <div className="absolute top-4 right-4">
                {getRoleBadge(userRole)}
              </div>
            </div>

            {/* Profile Content */}
            <div className="relative px-8 pb-8">
              {/* Profile Picture */}
              <div className="absolute -top-16 left-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-lg">
                    {profileData.photoURL ? (
                      <img
                        src={profileData.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        profileData.photoURL ? "hidden" : "flex"
                      }`}
                    >
                      <FaUser className="w-12 h-12 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end pt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FaEdit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancel}
                      className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <FaTimes className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                    >
                      {updateProfileMutation.isPending ? (
                        <>
                          <FaSpinner className="animate-spin w-4 h-4 mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Basic Information
                  </h3>

                  {/* Name Field - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="displayName"
                        value={profileData.displayName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FaUser className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">
                          {user?.displayName || "No name provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Photo URL Field - Editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Profile Photo URL
                    </label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type="url"
                            name="photoURL"
                            value={profileData.photoURL}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://example.com/your-photo.jpg"
                          />
                          <FaLink className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-500">
                          Enter a valid image URL (jpg, png, gif, webp)
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FaLink className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 text-sm break-all">
                          {user?.photoURL || "No photo URL provided"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email Field - Non-editable */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FaEnvelope className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user?.email}</span>
                      <FaUserCheck
                        className="w-4 h-4 text-green-600"
                        title="Verified"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed
                    </p>
                  </div>

                  {/* Role Badge */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {getRoleBadge(userRole)}
                    </div>
                  </div>
                </div>

                {/* Account Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Account Information
                  </h3>

                  {/* Last Login - From Firebase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Login
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(user?.metadata?.lastSignInTime)}
                      </span>
                    </div>
                  </div>

                  {/* Account Created - From Firebase */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Created
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaCalendarAlt className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(user?.metadata?.creationTime)}
                      </span>
                    </div>
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <FaShieldAlt className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900 font-mono text-sm">
                        {user?.uid}
                      </span>
                    </div>
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

export default Profile;
