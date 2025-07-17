import {
  FaCalendarAlt,
  FaHeart,
  FaShieldAlt,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const PolicyCard = ({ policy, index = 0 }) => {
  const navigate = useNavigate();

  // Category icons mapping
  const categoryIcons = {
    "Term Life Insurance": FaShieldAlt,
    "Whole Life Insurance": FaHeart,
    "Universal Life Insurance": FaStar,
    "Variable Life Insurance": FaCalendarAlt,
    "Senior Life Insurance": FaUsers,
    "Child Life Insurance": FaHeart,
    "Group Life Insurance": FaUsers,
    "Critical Illness Insurance": FaShieldAlt,
    "Disability Insurance": FaShieldAlt,
  };

  // Category colors mapping
  const categoryColors = {
    "Term Life Insurance": "from-blue-500 to-blue-600",
    "Whole Life Insurance": "from-green-500 to-green-600",
    "Universal Life Insurance": "from-purple-500 to-purple-600",
    "Variable Life Insurance": "from-indigo-500 to-indigo-600",
    "Senior Life Insurance": "from-orange-500 to-orange-600",
    "Child Life Insurance": "from-pink-500 to-pink-600",
    "Group Life Insurance": "from-teal-500 to-teal-600",
    "Critical Illness Insurance": "from-red-500 to-red-600",
    "Disability Insurance": "from-yellow-500 to-yellow-600",
  };

  // Utility function for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Get icon and color for the policy category
  const IconComponent = categoryIcons[policy.category] || FaShieldAlt;
  const categoryColor =
    categoryColors[policy.category] || "from-blue-500 to-blue-600";

  // Handle policy click navigation
  const handlePolicyClick = () => {
    navigate(`/policies/${policy.id}`);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fadeInUp"
      onClick={handlePolicyClick}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Policy Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={
            policy.imageUrl ||
            `https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=${encodeURIComponent(
              policy.title
            )}`
          }
          alt={policy.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Category Badge */}
        <div
          className={`absolute top-4 left-4 bg-gradient-to-r ${categoryColor} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 shadow-lg`}
        >
          <IconComponent className="w-3 h-3" />
          <span className="truncate max-w-[120px]">{policy.category}</span>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Policy Content */}
      <div className="p-6">
        {/* Policy Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
          {policy.title}
        </h3>

        {/* Policy Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {policy.description}
        </p>

        {/* Policy Details */}
        <div className="space-y-3 mb-4">
          {/* Age Range */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Age Range:</span>
            <span className="font-medium text-gray-900">
              {policy.minAge} - {policy.maxAge} years
            </span>
          </div>

          {/* Coverage */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Coverage:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(policy.coverageMin)} -{" "}
              {formatCurrency(policy.coverageMax)}
            </span>
          </div>

          {/* Duration (if available) */}
          {policy.duration && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Duration:</span>
              <span className="font-medium text-gray-900">
                {policy.duration}
              </span>
            </div>
          )}
        </div>

        {/* Premium and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Premium Display */}
          <div className="text-center">
            <p className="text-sm text-gray-500">Starting at</p>
            <p className="text-2xl font-bold text-blue-600">
              ${policy.basePremium}
              <span className="text-sm text-gray-500 font-normal">/month</span>
            </p>
          </div>

          {/* View Details Button */}
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            View Details
          </button>
        </div>

        {/* Applications Count (if available) */}
        {policy.applicationsCount > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center text-xs text-gray-500">
              <FaUsers className="w-3 h-3 mr-1" />
              <span>{policy.applicationsCount} people have applied</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyCard;
