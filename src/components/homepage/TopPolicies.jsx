import { useEffect, useState } from "react";
import { FaArrowRight, FaFire, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import PolicyCard from "../PolicyCard";

const TopPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const axios = useAxios();

  // Fetch top policies from database
  useEffect(() => {
    const fetchTopPolicies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/policies/top-policies");

        if (response.data && response.data.success) {
          setPolicies(response.data.policies.slice(0, 6));
        } else {
          const fallbackResponse = await axios.get("/policies?limit=6");
          if (fallbackResponse.data && fallbackResponse.data.success) {
            setPolicies(fallbackResponse.data.policies.slice(0, 6));
          }
        }
      } catch {
        setPolicies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopPolicies();
  }, [axios]);

  // Handle view all policies
  const handleViewAll = () => {
    navigate("/Policies");
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FaSpinner className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading popular policies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaFire className="w-6 h-6 text-orange-500 mr-2" />
            <span className="text-orange-600 font-semibold uppercase tracking-wide text-sm">
              Most Popular
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Top Insurance Policies
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our most trusted and purchased life insurance policies,
            chosen by thousands of families
          </p>
        </div>

        {/* Policies Grid using PolicyCard */}
        {policies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {policies.map((policy, index) => (
              <div key={policy._id} className="relative">
                {/* Popularity Badge */}
                <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  <FaFire className="w-3 h-3" />
                  <span>#{index + 1}</span>
                </div>

                {/* Policy Card */}
                <PolicyCard
                  policy={{
                    ...policy,
                    id: policy._id,
                  }}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FaShieldAlt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Popular Policies Found
            </h3>
            <p className="text-gray-600">
              Check back later for our most popular insurance policies.
            </p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>View All Policies</span>
            <FaArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopPolicies;
