import React, { useEffect, useState } from "react";
import "@/css/user/BankTransfer.scss";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatCurrency } from "@/utils/helper";
import { userAPI } from "@/services/userApi";
import { ROUTES } from "@/config/constants";
import { getUserStorage } from "@/utils/Auth";

const BankTransfer = () => {
  const user = getUserStorage();
  const navigate = useNavigate();
  const [bankInfo, setBankInfo] = useState(null);
  // lấy thông tin bank chủ thanh toán
  const getBankInfo = async () => {
    try {
      const response = await userAPI.getSystemBank();
      setBankInfo(response?.data?.result);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBankInfo();
  }, []);
  const setAmount = (amount) => {
    const amountInput = document.getElementById("amountInput");
    if (amountInput) {
      amountInput.value = formatCurrency(amount);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Số tài khoản đã được sao chép!");
  };

  const handleTransfer = async () => {
    const amountInput = document.getElementById("amountInput");
    // chuyển định dạng số tiền hợp lệ từ 2.000.000 → 2000000
    const formattedAmount = amountInput.value
      .replace(/\./g, "")
      .replace("₫", "")
      .trim();
    const note = document.getElementById("messageInput").value;
    const amount = parseFloat(formattedAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Số tiền không hợp lệ!");
      return;
    }
    // Call the API to process the transfer
    try {
      await userAPI.transactionDeposit({ amount, note });
      toast.success("Chuyển tiền thành công!");
      navigate(ROUTES.TRANSACTION_DETAILS);
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <>
        <title>Chuyển tiền - VietinBank</title>
        <div className="container">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between p-4 text-white">
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-lg font-semibold tracking-wide">
                Chuyển tiền nhanh
              </h1>
              <div className="w-10"></div>
            </div>
          </div>
          <div className="content">
            <div className="bank-info">
              <div className="bank-name">
                <div className="bank-icon">{bankInfo?.bankName.charAt(0)}</div>
                <div className="bank-name-text">{bankInfo?.bankName}</div>
              </div>
              <div className="account-info">
                <div className="info-row">
                  <span className="info-label">Số tài khoản:</span>
                  <span
                    className="info-value account-number"
                    onClick={() => copyToClipboard(bankInfo?.accountNumber)}
                  >
                    {bankInfo?.accountNumber}
                    <button className="copy-btn">📋</button>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Chủ tài khoản:</span>
                  <span className="info-value">
                    {bankInfo?.accountHolderName}
                  </span>
                </div>
              </div>
            </div>
            <div className="amount-section">
              <div className="section-title">💰 Số tiền chuyển</div>
              <input
                type="text"
                name="amount"
                className="amount-input"
                id="amountInput"
                placeholder="0 VNĐ"
                style={{ padding: "18px" }}
                onChange={(e) => {
                  e.target.value = e.target.value.replace(/[^0-9]/g, "");
                }}
                onBlur={(e) => {
                  // e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  e.target.value = formatCurrency(
                    e.target.value.replace(/[^0-9]/g, "")
                  );
                }}
              />
              <div className="quick-amounts">
                <button
                  className="amount-btn"
                  onClick={() => setAmount(100000)}
                >
                  100K
                </button>
                <button
                  className="amount-btn"
                  onClick={() => setAmount(200000)}
                >
                  200K
                </button>
                <button
                  className="amount-btn"
                  onClick={() => setAmount(500000)}
                >
                  500K
                </button>
                <button
                  className="amount-btn"
                  onClick={() => setAmount(1000000)}
                >
                  1 triệu
                </button>
                <button
                  className="amount-btn"
                  onClick={() => setAmount(2000000)}
                >
                  2 triệu
                </button>
                <button
                  className="amount-btn"
                  onClick={() => setAmount(5000000)}
                >
                  5 triệu
                </button>
              </div>
            </div>
            <div className="message-section">
              <div className="section-title">💬 Nội dung chuyển khoản</div>
              <textarea
                className="message-input"
                name="note"
                placeholder="Nhập nội dung chuyển khoản..."
                id="messageInput"
                defaultValue={`${user?.username ?? "Người dùng"} chuyển tiền`}
              />
            </div>
            <button className="transfer-btn" onClick={handleTransfer}>
              <span className="btn-text">CHUYỂN TIỀN NGAY</span>
              <div className="loading" />
            </button>
            <div className="notes">
              <h3>Lưu ý quan trọng:</h3>
              <ul>
                <li>Nhấn vào số tài khoản để sao chép</li>
                <li>Kiểm tra kỹ thông tin trước khi chuyển</li>
                <li>Giao dịch sẽ được xử lý trong vòng 1-2 phút</li>
                <li>Lưu giữ biên lai giao dịch để đối soát</li>
              </ul>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default BankTransfer;
