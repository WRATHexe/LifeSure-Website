import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Claims = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [reason, setReason] = useState("");

  const userId = ""; // get from auth context or props

  // Fetch only approved policies
  const { data: applications = [] } = useQuery({
    queryKey: ["customer-approved-applications"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/applications/user/${userId}`);
      // Filter for approved applications
      return (res.data.applications || []).filter(
        (app) => app.status === "approved"
      );
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      await axiosSecure.post("/customer/claims", {
        policyId: data.policyId,
        reason: data.reason,
      });
    },
    onSuccess: () => {
      setSelectedPolicy(null);
      setReason("");
      queryClient.invalidateQueries(["customer-claims"]);
      toast.success("Claim submitted successfully!");
    },
    onError: () => {
      toast.error("Failed to submit claim. Please try again.");
    },
  });

  const handlePolicyChange = (e) => {
    const policy = applications.find(
      (app) => (app.policy?._id || app.policyId) === e.target.value
    );
    setSelectedPolicy(policy?.policy || null);
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-gray-50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FaShieldAlt className="text-blue-600 text-2xl mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Claim Request Form
          </h2>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedPolicy) {
              toast.error("Please select a policy.");
              return;
            }
            mutation.mutate({
              policyId: selectedPolicy._id,
              reason,
            });
          }}
          className="space-y-6"
        >
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Policy
            </label>
            <select
              value={selectedPolicy?._id || ""}
              onChange={handlePolicyChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select Approved Policy</option>
              {applications.map((app) => (
                <option
                  key={app.policy?._id || app.policyId}
                  value={app.policy?._id || app.policyId}
                >
                  {app.policyName || app.policy?.title || "Unknown Policy"}
                </option>
              ))}
            </select>
          </div>
          {selectedPolicy && (
            <div>
              <label className="block font-semibold mb-1 text-gray-700">
                Policy Name
              </label>
              <input
                type="text"
                value={
                  selectedPolicy.policyName ||
                  selectedPolicy.name ||
                  selectedPolicy.title
                }
                readOnly
                className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-gray-100 text-gray-700"
              />
            </div>
          )}
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Reason for Claim
            </label>
            <textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Describe the reason for your claim..."
            />
          </div>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center"
          >
            {mutation.isLoading ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              "Submit Claim"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Claims;
