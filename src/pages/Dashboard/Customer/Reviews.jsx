import { FaSpinner, FaStar } from "react-icons/fa";
import Modal from "../../../components/Modal/Modal";

const ReviewModal = ({
  isOpen,
  onClose,
  policy,
  reviewData,
  setReviewData,
  onSubmit,
  isLoading,
}) => {
  const handleStarClick = (rating) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Review"
      subtitle={policy?.policyName || policy?.policy?.title || "Policy"}
      icon={FaStar}
      size="2xl"
      headerColor="green"
    >
      {policy && (
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rate your experience *
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  className={`text-3xl transition-all duration-200 hover:scale-110 ${
                    star <= reviewData.rating
                      ? "text-yellow-400 drop-shadow-sm"
                      : "text-gray-300 hover:text-yellow-200"
                  }`}
                >
                  <FaStar />
                </button>
              ))}
              <span className="ml-3 text-sm text-gray-600">
                {reviewData.rating > 0 &&
                  `${reviewData.rating} star${
                    reviewData.rating > 1 ? "s" : ""
                  }`}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your feedback *
            </label>
            <textarea
              value={reviewData.feedback}
              onChange={(e) =>
                setReviewData((prev) => ({
                  ...prev,
                  feedback: e.target.value,
                }))
              }
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Tell us about your experience with this policy or the agent who helped you..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Your review will be displayed as a testimonial on our website.
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin h-4 w-4" />
                </div>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ReviewModal;
