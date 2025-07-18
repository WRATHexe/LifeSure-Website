import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Claims = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ policyId: "", reason: "", file: null });

  // Fetch user's active policies
  const { data: policies = [] } = useQuery({
    queryKey: ["customer-active-policies"],
    queryFn: async () => {
      const res = await axiosSecure.get("/customer/policies/active");
      return res.data.policies || [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("policyId", data.policyId);
      formData.append("reason", data.reason);
      if (data.file) formData.append("file", data.file);
      await axiosSecure.post("/customer/claims", formData);
    },
    onSuccess: () => {
      setForm({ policyId: "", reason: "", file: null });
      queryClient.invalidateQueries(["customer-claims"]);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Claim Request Form</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate(form);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Policy</label>
          <select
            name="policyId"
            value={form.policyId}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select Policy</option>
            {policies.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Reason for Claim</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            required
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Documents (optional)</label>
          <input
            type="file"
            name="file"
            onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {mutation.isLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Claims;
