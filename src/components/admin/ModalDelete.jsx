import React from "react";
import { Trash2 } from "lucide-react";

/**
 * props:
 * - open: boolean (hiển thị modal hay không)
 * - title: string (tiêu đề modal)
 * - message: string (nội dung xác nhận)
 * - onConfirm: () => void (xác nhận xóa)
 * - onClose: () => void (đóng modal)
 * - confirmLabel: string (nút xác nhận, mặc định: "Xóa")
 */
const ModalDelete = ({
  open,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa mục này?",
  onConfirm,
  onClose,
  confirmLabel = "Xóa",
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 transition-all duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-2 p-6 relative flex flex-col items-center animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl transition-colors duration-200"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="w-16 h-16 mb-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center shadow-lg animate-pop">
          <Trash2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
          {title}
        </h3>
        <p className="mb-6 text-gray-700 text-center">{message}</p>
        <div className="flex gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
          >
            <Trash2 className="w-5 h-5" />
            {confirmLabel}
          </button>
        </div>
      </div>
      {/* Hiệu ứng fade-in */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeInModal .25s cubic-bezier(.4,0,.2,1);
          }
          @keyframes fadeInModal {
            from { opacity: 0; transform: translateY(40px) scale(0.96);}
            to { opacity: 1; transform: translateY(0) scale(1);}
          }
          .animate-pop {
            animation: popIcon .3s cubic-bezier(.4,0,.2,1);
          }
          @keyframes popIcon {
            0% { transform: scale(0.7);}
            70% { transform: scale(1.15);}
            100% { transform: scale(1);}
          }
        `}
      </style>
    </div>
  );
};

export default ModalDelete;
