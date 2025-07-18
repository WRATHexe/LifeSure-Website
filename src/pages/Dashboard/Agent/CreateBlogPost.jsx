import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const CreateBlogPost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (data) => {
      await axiosSecure.post("/agent/blogs", data);
    },
    onSuccess: () => {
      toast.success("Blog published!");
      queryClient.invalidateQueries(["agent-blogs"]);
      navigate("/dashboard/agent/blogs");
    },
    onError: () => toast.error("Failed to publish blog"),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Add Blog Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={8}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {mutation.isLoading ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPost;
