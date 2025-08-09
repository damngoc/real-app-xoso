import React, { useState } from "react";

/**
 * props:
 * - open: boolean (hiển thị modal hay không)
 * - title: string (tiêu đề modal)
 * - fields: [{ name, label, type, value, required }]
 * - onChange: (e) => void (xử lý thay đổi input)
 * - onSubmit: (e) => void (xử lý submit form)
 * - onClose: () => void (đóng modal)
 * - submitLabel: string (nút submit, mặc định: "Lưu")
 */
const ModalForm = ({
  open,
  title,
  fields,
  onChange,
  onSubmit,
  onClose,
  submitLabel = "Lưu",
}) => {
  const [errors, setErrors] = useState({});
  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    fields.forEach((field) => {
      if (field.required && !field.value) {
        newErrors[field.name] = "Trường này là bắt buộc";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(e);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 sm:mx-0 relative flex flex-col"
        style={{
          maxHeight: "90vh",
        }}
      >
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-800 px-4 pt-6">
          {title}
        </h3>
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-4 pb-4 space-y-4"
          style={{ maxHeight: "70vh", minHeight: "0" }}
        >
          {fields.map((field) =>
            field.hidden ? null : (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={field.value}
                    onChange={onChange}
                    className="w-full p-3 border rounded-lg outline-none bg-white"
                  >
                    <option value="" disabled>
                      Chọn {field.label}
                    </option>
                    {field.options &&
                      field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={field.value}
                    onChange={onChange}
                    className="w-full !p-3 border rounded-lg outline-none"
                    min={field.type === "number" ? 0 : undefined}
                    autoComplete="off"
                  />
                )}
                {errors[field.name] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            )
          )}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 w-full sm:w-auto"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold w-full sm:w-auto"
            >
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
