import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import Modal from "../../components/Modal/Modal";
import useAxios from "../../hooks/useAxios";

const AllArticles = () => {
  const axios = useAxios();
  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ["allBlogs"],
    queryFn: async () => {
      const res = await axios.get("/blogs?limit=100");
      return res.data.blogs || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const [selectedBlog, setSelectedBlog] = useState(null);

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-indigo-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <FaBookOpen className="w-7 h-7 text-indigo-500 mr-2" />
            <span className="text-indigo-600 font-semibold uppercase tracking-wide text-sm">
              All Articles
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LifeSure Blog & Articles
          </h1>
          <p className="text-gray-600 text-lg">
            Explore our latest tips, news, and insurance insights.
          </p>
        </div>
        {isLoading ? (
          <div className="text-center py-20 text-gray-500">
            Loading articles...
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No articles found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-2 hover:shadow-2xl group cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedBlog(blog);
                }}
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {blog.title}
                  </h2>
                  <p className="text-gray-700 text-base mb-4 line-clamp-3">
                    {blog.content?.slice(0, 140) || "No summary available..."}
                    {blog.content && blog.content.length > 140 ? "..." : ""}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {blog.authorName || "Admin"} &middot;{" "}
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Blog Details Modal */}
      <Modal
        isOpen={!!selectedBlog}
        onClose={() => setSelectedBlog(null)}
        title={selectedBlog?.title}
        subtitle={
          selectedBlog
            ? `${selectedBlog.authorName || "Admin"} • ${
                selectedBlog.createdAt
                  ? new Date(selectedBlog.createdAt).toLocaleDateString()
                  : ""
              }`
            : ""
        }
        icon={FaBookOpen}
        headerColor="blue"
      >
        <div>
          <div className="mb-4 text-gray-700 whitespace-pre-line">
            {selectedBlog?.content}
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default AllArticles;
