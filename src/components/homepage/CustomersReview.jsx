import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
  FaStar,
} from "react-icons/fa";
import useAxios from "../../hooks/useAxios";

const MAX_REVIEWS = 5;

const CustomersReview = () => {
  const axios = useAxios();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["homepage-reviews"],
    queryFn: async () => {
      const res = await axios.get("/reviews?limit=10");
      return res.data.reviews || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Carousel state
  const [current, setCurrent] = useState(0);
  const visibleReviews = reviews.slice(0, MAX_REVIEWS);

  const prev = () =>
    setCurrent((prev) => (prev === 0 ? visibleReviews.length - 1 : prev - 1));
  const next = () =>
    setCurrent((prev) => (prev === visibleReviews.length - 1 ? 0 : prev + 1));

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-gray-500">Loading reviews...</span>
        </div>
      </section>
    );
  }

  if (!visibleReviews.length) {
    return null;
  }

  const review = visibleReviews[current];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg">
            Real feedback from real LifeSure policyholders
          </p>
        </div>
        <div className="relative bg-white rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center">
          <FaQuoteLeft className="text-blue-200 text-4xl absolute -top-6 left-8" />
          <img
            src={
              review.user &&
              review.user.photoURL &&
              review.user.photoURL.startsWith("http")
                ? review.user.photoURL
                : "/avatar-default.png"
            }
            alt={review.user?.displayName || "Customer"}
            className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-lg mb-4 object-cover"
            onError={(e) => {
              e.target.src = "/avatar-default.png";
            }}
          />
          <div className="flex items-center mb-2">
            <span className="font-semibold text-lg text-gray-900 mr-2">
              {review.user?.displayName || "Anonymous"}
            </span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-gray-700 text-base text-center mb-4 max-w-xl">
            {review.feedback}
          </p>
          <span className="text-xs text-gray-400">
            Policy: {review.policy?.title || "—"}
          </span>
          {/* Carousel Controls */}
          {visibleReviews.length > 1 && (
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                onClick={prev}
                className="bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-blue-50 transition"
                aria-label="Previous review"
              >
                <FaChevronLeft className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          )}
          {visibleReviews.length > 1 && (
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                onClick={next}
                className="bg-white border border-gray-200 rounded-full p-2 shadow hover:bg-blue-50 transition"
                aria-label="Next review"
              >
                <FaChevronRight className="h-5 w-5 text-blue-600" />
              </button>
            </div>
          )}
        </div>
        {/* Dots */}
        {visibleReviews.length > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {visibleReviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full ${
                  idx === current ? "bg-blue-600" : "bg-gray-300"
                }`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomersReview;
