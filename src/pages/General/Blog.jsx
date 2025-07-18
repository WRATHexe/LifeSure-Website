import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Blog = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/blogs/${id}`);
      return res.data.blog;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!blog) return <div className="p-6">Blog not found.</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{blog.title}</h1>
      <div className="text-gray-500 mb-4">
        By {blog.author} | {new Date(blog.publishDate).toLocaleDateString()}
      </div>
      <div className="prose">{blog.content}</div>
    </div>
  );
};

export default Blog;
