import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Blogs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch current agent's blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["agent-blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent/blogs");
      return res.data.blogs || [];
    },
  });

  // Delete blog mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.delete(`/agent/blogs/${id}`);
    },
    onSuccess: () => {
      toast.success("Blog deleted!");
      queryClient.invalidateQueries(["agent-blogs"]);
    },
    onError: () => toast.error("Failed to delete blog"),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blogs</h2>
        <Link
          to="/dashboard/agent/blogs/create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" /> Add Blog
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Title</th>
              <th className="px-4 py-2 border-b">Content</th>
              <th className="px-4 py-2 border-b">Publish Date</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : blogs.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  No blogs found.
                </td>
              </tr>
            ) : (
              blogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{blog.title}</td>
                  <td className="px-4 py-2 border-b">
                    {blog.content.length > 60
                      ? blog.content.slice(0, 60) + "..."
                      : blog.content}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {blog.publishDate
                      ? new Date(blog.publishDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1"
                      onClick={() =>
                        navigate(`/dashboard/agent/blogs/edit/${blog._id}`)
                      }
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1"
                      onClick={() => {
                        if (window.confirm(`Delete blog "${blog.title}"?`)) {
                          deleteMutation.mutate(blog._id);
                        }
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Blogs;
