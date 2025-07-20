import { useEffect, useState, useMemo } from "react";

const BlogFormModal = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  // Always use a safe object
  const safeInitialData = useMemo(() => initialData || {}, [initialData]);

  const [form, setForm] = useState({
    title: safeInitialData.title || "",
    content: safeInitialData.content || "",
  });

  useEffect(() => {
    setForm({
      title: safeInitialData.title || "",
      content: safeInitialData.content || "",
    });
  }, [safeInitialData, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative animate-fadeIn">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          {safeInitialData._id ? "Edit Blog" : "Add Blog"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Title</label>
            <input
              type="text"
              name="title"
              className="w-full border rounded px-3 py-2"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Content</label>
            <textarea
              name="content"
              className="w-full border rounded px-3 py-2 min-h-[100px]"
              value={form.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
              disabled={loading}
            >
              {loading
                ? safeInitialData._id
                  ? "Updating..."
                  : "Adding..."
                : safeInitialData._id
                ? "Update"
                : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormModal;
