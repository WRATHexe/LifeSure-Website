import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const defaultBlogImage =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const Blog = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch all blogs
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/blogs");
      return res.data.blogs;
    },
  });

  // Mutation to increase visit count
  const visitMutation = useMutation({
    mutationFn: async (id) => {
      await axiosSecure.patch(`/blogs/${id}/visit`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["blogs"]);
    },
  });

  // Handle Read More (open modal and increase visit count)
  const handleReadMore = (blog) => {
    setSelectedBlog(blog);
    setModalOpen(true);
    visitMutation.mutate(blog._id);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedBlog(null);
  };

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!blogs || blogs.length === 0)
    return <div className="p-6 text-gray-500">No blogs found.</div>;

  // Helper to get 20-30 words
  const getShortDetails = (text) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.slice(0, 30).join(" ") + (words.length > 30 ? "..." : "");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        Latest Blog Posts
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-white rounded-xl shadow p-4 flex flex-col"
          >
            <img
              src={blog.imageUrl || defaultBlogImage}
              alt={blog.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h2 className="text-xl font-bold text-blue-600 mb-2">
              {blog.title}
            </h2>
            <p className="text-gray-700 mb-2">
              {getShortDetails(blog.content)}
            </p>
            <div className="flex items-center mb-2">
              <img
                src={blog.authorPhotoURL || "https://i.pravatar.cc/40"}
                alt={blog.authorName || "Author"}
                className="w-8 h-8 rounded-full mr-2 border"
              />
              <span className="font-semibold text-gray-800 mr-2">
                {blog.authorName || "Agent"}
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-2">
                Author
              </span>
              <span className="text-gray-400 text-xs">
                {blog.publishDate
                  ? new Date(blog.publishDate).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-sm text-gray-500">
                Visits:{" "}
                <span className="font-bold">{blog.totalVisit || 0}</span>
              </span>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition"
                onClick={() => handleReadMore(blog)}
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for blog details */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={selectedBlog?.title}
        subtitle={
          selectedBlog
            ? `By ${selectedBlog.authorName || "Agent"} • ${
                selectedBlog.publishDate
                  ? new Date(selectedBlog.publishDate).toLocaleDateString()
                  : ""
              }`
            : ""
        }
        headerColor="blue"
      >
        {selectedBlog && (
          <div>
            <img
              src={selectedBlog.imageUrl || defaultBlogImage}
              alt={selectedBlog.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="flex items-center mb-4">
              <img
                src={selectedBlog.authorPhotoURL || "https://i.pravatar.cc/40"}
                alt={selectedBlog.authorName || "Author"}
                className="w-8 h-8 rounded-full mr-2 border"
              />
              <span className="font-semibold text-gray-800 mr-2">
                {selectedBlog.authorName || "Agent"}
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full mr-2">
                Author
              </span>
              <span className="text-gray-400 text-xs">
                {selectedBlog.publishDate
                  ? new Date(selectedBlog.publishDate).toLocaleDateString()
                  : ""}
              </span>
            </div>
            <div className="text-gray-700 mb-4 whitespace-pre-line">
              {selectedBlog.content}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Visits:{" "}
                <span className="font-bold">
                  {(selectedBlog.totalVisit || 0) + 1}
                </span>
              </span>
              {/* Removed "Go to Details Page" button */}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Blog;
