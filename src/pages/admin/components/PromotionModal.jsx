// import React, { useState } from "react";
// import { toast } from "react-toastify";

// const PromotionModal = ({ onClose, onSubmit }) => {
//   const [title, setTitle] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (ev) => setPreview(ev.target.result);
//       reader.readAsDataURL(file);
//     } else {
//       setPreview("");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!title.trim()) {
//       toast.error("Vui lòng nhập tiêu đề.");
//       return;
//     }
//     if (!image) {
//       toast.error("Vui lòng chọn ảnh.");
//       return;
//     }
//     // Gửi dữ liệu lên parent nếu cần
//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("content", image);
//     console.log(formData);
//     if (onSubmit) onSubmit(formData);
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 p-6 relative flex flex-col">
//         <button
//           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
//           onClick={onClose}
//         >
//           &times;
//         </button>
//         <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
//           Thêm khuyến mãi mới
//         </h3>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Tiêu đề <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="title"
//               className="w-full border border-gray-200 rounded-lg !px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Nhập tiêu đề khuyến mãi"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Ảnh khuyến mãi <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="file"
//               name="content"
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full"
//             />
//             {preview && (
//               <img
//                 src={preview}
//                 alt="Preview"
//                 className="mt-2 rounded-lg max-h-40 object-contain border"
//               />
//             )}
//           </div>
//           <div className="flex justify-end gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
//             >
//               Hủy
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
//             >
//               Thêm mới
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PromotionModal;

import React, { useState, useRef } from "react";
import { Upload, X, Image, Plus } from "lucide-react";
import { toast } from "react-toastify";

const PromotionModal = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageSelect(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!selectedImage) {
      toast.error("Vui lòng chọn ảnh");
      return;
    }

    setIsSubmitting(true);

    // Tạo FormData để gửi file
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("content", title.trim());
    formData.append("image", selectedImage);
    // Gửi dữ liệu lên server hoặc xử lý theo yêu cầu
    onSubmit(formData);

    setIsSubmitting(false);
  };

  const handleCancel = () => {
    setTitle("");
    setSelectedImage(null);
    setImagePreview(null);
    onClose();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Thêm khuyến mãi mới
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề khuyến mãi"
              className="w-full !px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ảnh khuyến mãi <span className="text-red-500">*</span>
            </label>

            {!imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  isDragging
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium">
                      Kéo thả ảnh vào đây hoặc
                    </p>
                    <p className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                      Chọn ảnh từ máy tính
                    </p>
                  </div>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF tối đa 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border-2 border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={removeImage}
                      className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-all duration-300 transform scale-90 group-hover:scale-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <span className="flex items-center">
                    <Image className="w-4 h-4 mr-1" />
                    {selectedImage?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Thay đổi
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm mới
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;
