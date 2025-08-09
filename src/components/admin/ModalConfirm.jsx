import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import React, { useState } from "react";

export const ModalConfirm = ({
  isOpen,
  actionType,
  selectedTransaction,
  isProcessing,
  onClose,
  confirmAction,
}) => {
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen) return null;

  // Gọi confirmAction với lý do từ chối nếu là từ chối
  const handleConfirm = () => {
    if (actionType === "reject" && !rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối.");
      return;
    }
    confirmAction(actionType === "reject" ? rejectReason : undefined);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-2 p-6 relative flex flex-col items-center">
        <div className="w-16 h-16 mb-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-lg">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-xl font-bold text-gray-900 mb-2 text-center">
          Xác nhận {actionType === "approve" ? "chấp nhận" : "từ chối"}
        </h4>
        <p className="text-gray-600 text-center mb-6">
          Bạn có chắc chắn muốn{" "}
          <span
            className={
              actionType === "approve"
                ? "text-green-600 font-semibold"
                : "text-red-600 font-semibold"
            }
          >
            {actionType === "approve" ? "chấp nhận" : "từ chối"}
          </span>{" "}
          giao dịch nạp tiền{" "}
          <span className="font-semibold text-green-600">
            {selectedTransaction?.amount?.toLocaleString()} VNĐ
          </span>{" "}
          của người dùng{" "}
          <span className="font-semibold">{selectedTransaction?.user}</span>?
        </p>

        {/* Hiển thị textbox nhập lý do khi từ chối */}
        {actionType === "reject" && (
          <div className="w-full mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={isProcessing}
            />
          </div>
        )}

        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
            disabled={isProcessing}
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
              actionType === "approve"
                ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
            } ${isProcessing ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                {actionType === "approve" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                {actionType === "approve" ? "Chấp nhận" : "Từ chối"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
