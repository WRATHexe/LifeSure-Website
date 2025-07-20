import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import UseAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import BlogFormModal from "./BlogFormModal"; // <-- Import your modal component

const Blogs = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = UseAuth();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editBlog, setEditBlog] = useState(null);

  // Fetch current agent's blogs
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["agent-blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/agent/blogs");
      return res.data.blogs || [];
    },
  });

  // Add/Edit blog mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editBlog?._id) {
        // Edit
        await axiosSecure.put(`/agent/blogs/${editBlog._id}`, data);
      } else {
        // Add
        await axiosSecure.post("/agent/blogs", data);
      }
    },
    onSuccess: () => {
      toast.success(editBlog ? "Blog updated!" : "Blog added!");
      setModalOpen(false);
      setEditBlog(null);
      queryClient.invalidateQueries(["agent-blogs"]);
    },
    onError: () => toast.error("Failed to save blog"),
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

  // Open modal for add
  const handleAdd = () => {
    setEditBlog(null);
    setModalOpen(true);
  };

  // Open modal for edit
  const handleEdit = (blog) => {
    setEditBlog(blog);
    setModalOpen(true);
  };

  // Submit add/edit
  const handleSave = (form) => {
    // Add author and publish date for new blogs
    const data = editBlog
      ? form
      : {
          ...form,
          authorName: user?.displayName || user?.email,
          authorPhotoURL: user?.photoURL || "",
          publishDate: new Date(),
        };
    saveMutation.mutate(data);
  };

  return (
    <div className="p-6 min-h-[80vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-blue-700">Manage Blogs</h2>
          <button
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-semibold shadow hover:from-blue-600 hover:to-blue-700 transition-all gap-2"
            onClick={handleAdd}
          >
            <FaPlus /> Add Blog
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white rounded-xl shadow-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-blue-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-blue-500 font-semibold"
                  >
                    Loading blogs...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400">
                    No blogs found. Start by adding your first blog!
                  </td>
                </tr>
              ) : (
                blogs.map((blog, idx) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-semibold">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[180px]">
                      <div className="font-semibold text-blue-800 truncate">
                        {blog.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[250px]">
                      <div className="text-gray-700 text-sm truncate">
                        {blog.content.length > 60
                          ? blog.content.slice(0, 60) + "..."
                          : blog.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          {blog.authorName || "-"}
                        </span>
                        <div className="text-xs text-gray-500">
                          {blog.authorEmail || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {blog.publishDate
                        ? new Date(blog.publishDate).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs flex items-center gap-1 hover:bg-blue-600 transition"
                          onClick={() => handleEdit(blog)}
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1 hover:bg-red-600 transition"
                          onClick={() => {
                            if (
                              window.confirm(`Delete blog "${blog.title}"?`)
                            ) {
                              deleteMutation.mutate(blog._id);
                            }
                          }}
                          disabled={deleteMutation.isLoading}
                          title="Delete"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Add/Edit Blog Modal */}
      <BlogFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditBlog(null);
        }}
        onSubmit={handleSave}
        initialData={editBlog}
        loading={saveMutation.isLoading}
      />
    </div>
  );
};

export default Blogs;
