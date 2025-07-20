import { useQuery } from "@tanstack/react-query";
import { FaArrowRight, FaBookOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import useAxios from "../../hooks/useAxios";

const MAX_BLOGS = 4;

const TopBlog = () => {
  const axios = useAxios();
  const {
    data: blogs = [],
    isLoading,
  } = useQuery({
    queryKey: ["latestBlogs"],
    queryFn: async () => {
      const res = await axios.get("/blogs?limit=8");
      // Sort by createdAt descending, just in case
      return (res.data.blogs || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    staleTime: 5 * 60 * 1000,
  });

  const visibleBlogs = blogs.slice(0, MAX_BLOGS);

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-pink-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-gray-500">Loading latest articles...</span>
        </div>
      </section>
    );
  }

  if (!visibleBlogs.length) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-3">
            <FaBookOpen className="w-6 h-6 text-indigo-500 mr-2" />
            <span className="text-indigo-600 font-semibold uppercase tracking-wide text-sm">
              Latest Articles
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            From Our Blog
          </h2>
          <p className="text-gray-600 text-lg">
            Stay informed with the latest tips, news, and insights from LifeSure
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {visibleBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-700 text-base mb-4 line-clamp-3">
                  {blog.content?.slice(0, 120) || "No summary available..."}
                  {blog.content && blog.content.length > 120 ? "..." : ""}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {blog.authorName || "Admin"} &middot;{" "}
                  {blog.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : ""}
                </span>
                <Link
                  to={`/blogs/${blog._id}`}
                  className="inline-flex items-center text-indigo-600 font-semibold hover:underline"
                >
                  Read more <FaArrowRight className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/blogs"
            className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>View All Articles</span>
            <FaArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopBlog;
