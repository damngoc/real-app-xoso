import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Gamepad2, Clock } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { userAPI } from "@/services/userApi";
import { formatCurrency } from "@/utils/helper";

const GameDaiPhat = () => {
  const navigate = useNavigate();
  const roomId = useParams().roomId;
  const [activeTab, setActiveTab] = useState("game"); // "game" | "history"
  const [timer, setTimer] = useState(0); // Thời gian đặt dữ liệu
  const [betAmount, setBetAmount] = useState("");
  const [selectedCount, setSelectedCount] = useState(6);
  const [totalAmount, setTotalAmount] = useState(0);
  const [roomDetail, setRoomDetail] = useState(null);
  const [currentRound, setCurrentRound] = useState({});
  const [previousRound, setPreviousRound] = useState({});
  const [profileDetail, setProfileDetail] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [selectedNumbers, setSelectedNumbers] = useState({
    round1: { A: false, S: false, H: false, X: false },
    round2: { A: false, S: false, H: false, X: false },
    round3: { A: false, S: false, H: false, X: false },
    round4: { A: false, S: false, H: false, X: false },
    round5: { A: false, S: false, H: false, X: false },
  });

  // Lịch sử
  const [historyRounds, setHistoryRounds] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  // có phân trang
  const [historyPage, setHistoryPage] = useState(1);
  const [historyHasNext, setHistoryHasNext] = useState(true);
  const historyContainerRef = useRef();

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const result = response?.data?.result;
      setProfileDetail(result);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchRoomDetails = async () => {
    try {
      const response = await userAPI.getRoomDetails(roomId);
      const result = response?.data?.result;
      setRoomDetail(result);
      setCurrentRound(result?.currentRound);
      setPreviousRound(result?.previousRound);

      // Nếu remainingBettingTime trả về là mili giây, cần chia cho 1000 để lấy giây
      const rawTime = result?.currentRound?.remainingBettingTime || 0;
      const timeInSeconds =
        rawTime > 1000 ? Math.floor(rawTime / 1000) : rawTime;
      setTimer(timeInSeconds);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const fetchHistoryRounds = async (page = 1, append = false) => {
    setHistoryLoading(true);
    try {
      const response = await userAPI.geRoomBetHistory(roomId, { page });
      const result = response?.data?.result;
      const newData = result?.data || [];

      setHistoryHasNext(result?.pagination?.hasNextPage ?? false);
      setHistoryPage(result?.pagination?.currentPage ?? page);
      setHistoryRounds((prev) => (append ? [...prev, ...newData] : newData));
    } catch (error) {
      console.error("Error fetching room rounds:", error);
      setHistoryRounds(append ? historyRounds : []);
      setHistoryHasNext(false);
    }
    setHistoryLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Lazy loading khi cuộn cuối danh sách
  useEffect(() => {
    if (activeTab !== "history") return;
    const handleScroll = () => {
      const el = historyContainerRef.current;
      if (!el || historyLoading || !historyHasNext) return;
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 50) {
        fetchHistoryRounds(historyPage + 1, true);
      }
    };
    const el = historyContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, historyLoading, historyHasNext, historyPage, historyRounds]);

  // Khi chuyển tab hoặc room thì reset lịch sử
  useEffect(() => {
    if (activeTab === "game") {
      fetchRoomDetails();
    } else if (activeTab === "history") {
      setHistoryRounds([]);
      setHistoryPage(1);
      setHistoryHasNext(true);
      fetchHistoryRounds(1, false);
    }
  }, [roomId, activeTab]);

  useEffect(() => {
    let interval = null;
    if (timer > 0 && activeTab === "game") {
      interval = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timer === 0 && activeTab === "game") {
      // Random kết quả cho các round 1-4 và cập nhật hiển thị
      setSelectedNumbers((prev) => {
        const updated = { ...prev };
        for (let i = 1; i <= 4; i++) {
          updated[`round${i}`] = generateRandomNumbers(i, 1, 4);
        }
        return updated;
      });
      // khi hết thời gian, gọi lại fetchRoomDetails
      setTimeout(() => {
        fetchRoomDetails();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, activeTab]);

  // Hàm random kết quả khi hết phiên
  const generateRandomNumbers = () => {
    const randomNumbers = { A: false, S: false, H: false, X: false };
    // Random một vị trí đúng cho mỗi round
    const positions = ["A", "S", "H", "X"];
    const randomIndex = Math.floor(Math.random() * positions.length);
    randomNumbers[positions[randomIndex]] = true;
    return randomNumbers;
  };

  // Hàm tính toán tống số tiền cược -> không tính round 1, 2, 3, 4
  useEffect(() => {
    // Chỉ tính số lệnh và tổng tiền dựa trên round5
    const count = Object.values(selectedNumbers.round5).filter(Boolean).length;
    setSelectedCount(count);
    setTotalAmount(count * (parseInt(betAmount) || 0));
  }, [selectedNumbers.round5, betAmount]);

  // Hàm format lại thời gian (giây) sang mm:ss
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (num) => num.toString().padStart(2, "0");

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  };

  const toggleSelection = (round, position) => {
    setSelectedNumbers((prev) => ({
      ...prev,
      [round]: {
        ...prev[round],
        [position]: !prev[round][position],
      },
    }));
  };

  const handleChoose = async () => {
    if (betAmount <= 0) {
      toast.error("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (betAmount * selectedCount > profileDetail?.balance) {
      toast.error("Tổng số tiền cược không được lớn hơn số dư khả dụng.");
      return;
    }

    if (timer === 0) {
      toast.error("Đã hết thời gian đặt dữ liệu");
      return;
    }

    const selectedPositions = Object.entries(selectedNumbers.round5)
      .filter(([, value]) => value)
      .map(([key]) => key);

    if (selectedPositions.length === 0) {
      toast.error("Vui lòng chọn ít nhất một vị trí (A, S, H, X) ở khối 5.");
      return;
    }

    const dataSave = {
      roomId: roomId,
      bets: {
        types: selectedPositions,
        amounts: Number(betAmount),
      },
    };
    try {
      await userAPI.placeBets(dataSave);
      // toast.success("Chúc mừng, bạn đã đặt dữ liệu thành công!");
      // hiển thị popup show success
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);

      // reset input amount
      setBetAmount("");
      // reset round 5
      setSelectedNumbers((prev) => ({
        ...prev,
        round5: { A: false, S: false, H: false, X: false },
      }));
      fetchRoomDetails();
      fetchProfile();
    } catch (error) {
      console.log(error);
      toast.error("Đặt cược thất bại. Vui lòng thử lại.");
    }
  };

  const NumberBox = ({ round, position, isSelected, label, disabled }) => (
    <div
      onClick={() => !disabled && toggleSelection(round, position)}
      className={`relative w-20 h-20 rounded-xl cursor-pointer active:scale-95 shadow-lg
                ${
                  isSelected
                    ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-green-300"
                    : "bg-white text-gray-700 shadow-gray-200"
                } border-2 ${
        isSelected ? "border-green-500" : "border-gray-200"
      }`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-2xl font-bold 
                       ${isSelected ? "text-white" : "text-red-500"}`}
        >
          {label}
        </span>
      </div>
      {isSelected && (
        <div
          className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full 
                      flex items-center justify-center animate-pulse"
        >
          <span className="text-xs font-bold text-green-800">✓</span>
        </div>
      )}
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent"
        // Bỏ hiệu ứng hover
        style={{ opacity: 0 }}
      />
    </div>
  );

  const ResultBall = ({ number, index }) => (
    <div
      className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full 
                 flex items-center justify-center text-white font-bold text-lg shadow-lg 
                 transform transition-all duration-500 hover:scale-110 animate-bounce
                 border-2 border-white"
      style={{
        animationDelay: `${index * 100}ms`,
        animationDuration: "2s",
      }}
    >
      {number}
    </div>
  );

  // Tab header
  const TabHeader = () => (
    <div className="max-w-md mx-auto px-4 pb-2 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "game"
              ? "bg-gray-100 text-red-500 shadow-lg scale-105"
              : "bg-red-500 text-white hover:bg-red-400 hover:shadow-md"
          }`}
          onClick={() => setActiveTab("game")}
        >
          <Gamepad2 className="w-5 h-5" />
          <span className="text-sm">Trò chơi</span>
        </button>
        <button
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "history"
              ? "bg-gray-100 text-red-500 shadow-lg scale-105"
              : "bg-red-500 text-white hover:bg-red-400 hover:shadow-md"
          }`}
          onClick={() => setActiveTab("history")}
        >
          <Clock className="w-5 h-5" />
          <span className="text-sm">Lịch sử</span>
        </button>
      </div>
      <div className="text-right">
        <div className="text-red-100 font-bold text-lg">
          {formatCurrency(profileDetail?.balance)}
        </div>
        <div className="text-red-100 text-xs">Số Dư</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-red-600 to-red-700">
      {/* Header */}
      <div className="bg-red-500 shadow-xl">
        <div className="flex items-center justify-between p-4 text-white">
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/20 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold tracking-wide">
            {roomDetail?.name}
          </h1>
          <div className="w-10"></div>
        </div>
        {/* Tab Header */}
        <TabHeader />
      </div>

      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Tab Content */}
        {activeTab === "game" ? (
          <>
            {/* Game Timer & Results */}
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 opacity-50 animate-pulse" />
              <div className="relative z-10 flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-gray-800 text-sm mb-1 font-medium">
                    Phiên số {currentRound?.roundNumber}
                  </div>
                  <div className="text-red-600 font-mono text-3xl font-bold bg-white/20 rounded-lg px-3 py-1 backdrop-blur-sm">
                    {formatTime(timer)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-gray-800 text-sm mb-2 font-medium">
                    Kết quả phiên {previousRound?.roundNumber} ▼
                  </div>
                  <div className="flex space-x-1">
                    {previousRound?.resultNumbers?.map((num, index) => (
                      <ResultBall key={index} number={num} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Game Rounds */}
            <div className="p-4 space-y-6">
              {/* Round 1 */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    1
                  </span>
                  Dữ liệu 1
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <NumberBox
                    round="round1"
                    position="A"
                    isSelected={selectedNumbers.round1.A}
                    label="A"
                    disabled
                  />
                  <NumberBox
                    round="round1"
                    position="S"
                    isSelected={selectedNumbers.round1.S}
                    label="S"
                    disabled
                  />
                  <NumberBox
                    round="round1"
                    position="H"
                    isSelected={selectedNumbers.round1.H}
                    label="H"
                    disabled
                  />
                  <NumberBox
                    round="round1"
                    position="X"
                    isSelected={selectedNumbers.round1.X}
                    label="X"
                    disabled
                  />
                </div>
              </div>
              {/* Round 2 */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    2
                  </span>
                  Dữ liệu 2
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <NumberBox
                    round="round2"
                    position="A"
                    isSelected={selectedNumbers.round2.A}
                    label="A"
                    disabled
                  />
                  <NumberBox
                    round="round2"
                    position="S"
                    isSelected={selectedNumbers.round2.S}
                    label="S"
                    disabled
                  />
                  <NumberBox
                    round="round2"
                    position="H"
                    isSelected={selectedNumbers.round2.H}
                    label="H"
                    disabled
                  />
                  <NumberBox
                    round="round2"
                    position="X"
                    isSelected={selectedNumbers.round2.X}
                    label="X"
                    disabled
                  />
                </div>
              </div>
              {/* Round 3 */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    3
                  </span>
                  Dữ liệu 3
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <NumberBox
                    round="round3"
                    position="A"
                    isSelected={selectedNumbers.round3.A}
                    label="A"
                    disabled
                  />
                  <NumberBox
                    round="round3"
                    position="S"
                    isSelected={selectedNumbers.round3.S}
                    label="S"
                    disabled
                  />
                  <NumberBox
                    round="round3"
                    position="H"
                    isSelected={selectedNumbers.round3.H}
                    label="H"
                    disabled
                  />
                  <NumberBox
                    round="round3"
                    position="X"
                    isSelected={selectedNumbers.round3.X}
                    label="X"
                    disabled
                  />
                </div>
              </div>
              {/* Round 4 */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    4
                  </span>
                  Dữ liệu 4
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <NumberBox
                    round="round4"
                    position="A"
                    isSelected={selectedNumbers.round4.A}
                    label="A"
                    disabled
                  />
                  <NumberBox
                    round="round4"
                    position="S"
                    isSelected={selectedNumbers.round4.S}
                    label="S"
                    disabled
                  />
                  <NumberBox
                    round="round4"
                    position="H"
                    isSelected={selectedNumbers.round4.H}
                    label="H"
                    disabled
                  />
                  <NumberBox
                    round="round4"
                    position="X"
                    isSelected={selectedNumbers.round4.X}
                    label="X"
                    disabled
                  />
                </div>
              </div>
              {/* Round 5 */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                  <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                    5
                  </span>
                  Dữ liệu tổng
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  <NumberBox
                    round="round5"
                    position="A"
                    isSelected={selectedNumbers.round5.A}
                    label="A"
                  />
                  <NumberBox
                    round="round5"
                    position="S"
                    isSelected={selectedNumbers.round5.S}
                    label="S"
                  />
                  <NumberBox
                    round="round5"
                    position="H"
                    isSelected={selectedNumbers.round5.H}
                    label="H"
                  />
                  <NumberBox
                    round="round5"
                    position="X"
                    isSelected={selectedNumbers.round5.X}
                    label="X"
                  />
                </div>
              </div>
            </div>
            {/* Bottom Section */}
            <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-200">
              <div className="flex flex-col items-center justify-between mb-4">
                <div className="flex w-full mb-3 items-center space-x-3">
                  <span className="block w-1/3 whitespace-nowrap text-gray-700 font-medium">
                    Nhập số tiền:
                  </span>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    className="w-full border-2 border-gray-300 rounded-xl px-4 py-2 focus:border-blue-500 
                           focus:outline-none transition-all duration-300 shadow-md hover:shadow-lg
                           text-center font-medium"
                    placeholder="Nhập số tiền"
                  />
                </div>
                <div className="text-right text-sm w-full">
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-2 border border-blue-200">
                    <div className="text-gray-700">
                      Đã chọn{" "}
                      <span className="text-red-500 font-bold text-lg">
                        {selectedCount}
                      </span>{" "}
                      lệnh
                    </div>
                    <div className="text-gray-700">
                      Tổng Số{" "}
                      <span className="text-blue-600 font-bold text-lg">
                        {totalAmount}
                      </span>{" "}
                      đ
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={handleChoose}
                className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white py-4 rounded-2xl 
                       font-bold text-xl hover:from-red-600 hover:via-red-700 hover:to-red-600 
                       transition-all duration-300 transform hover:scale-105 shadow-xl 
                       hover:shadow-2xl active:scale-95 relative overflow-hidden group"
              >
                <span className="relative z-10">Đặt dữ liệu</span>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                            transform -skew-x-12 translate-x-full group-hover:translate-x-[-100%] 
                            transition-transform duration-700"
                />
              </button>
            </div>
          </>
        ) : (
          // Tab Lịch sử
          <div
            className="p-4 overflow-y-auto"
            ref={historyContainerRef}
            style={{ maxHeight: "calc(100vh - 10px)" }}
          >
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              Lịch sử đặt lệnh
            </h2>
            {historyRounds.length === 0 && !historyLoading ? (
              <div className="text-center py-8 text-gray-400">
                Chưa có lịch sử đặt lệnh.
              </div>
            ) : (
              <div className="space-y-4">
                {historyRounds.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow p-4 border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <div className="font-semibold text-gray-700">
                        Phiên: {item.roundNumber}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="text-sm text-gray-500">Kết quả:</div>
                        {/* Hiển thị kết quả từng số trong box xanh, chữ trắng */}
                        {item?.resultNumbers &&
                          item.resultNumbers.map((num, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 flex items-center justify-center rounded-lg bg-green-500 text-white font-sm text-sm"
                            >
                              {num}
                            </div>
                          ))}
                      </div>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "won"
                            ? "bg-green-100 text-green-700"
                            : item.status === "lost"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status === "won"
                          ? "Thắng"
                          : item.status === "lost"
                          ? "Thua"
                          : "Đang đặt cược"}
                      </span>
                    </div>
                  </div>
                ))}
                {historyLoading && (
                  <div className="text-center py-4 text-gray-400">
                    Đang tải thêm...
                  </div>
                )}
                {!historyHasNext && (
                  <div className="text-center py-4 text-gray-400">
                    Đã hiển thị toàn bộ lịch sử.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      {/* popup đặt cược thành công */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay nền đen mờ */}
          <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
          {/* Popup nằm trên tất cả và có chiều rộng phù hợp */}
          <div className="relative z-50 w-[95%] max-w-sm mx-auto bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center animate-fade-in">
            <svg
              className="w-16 h-16 text-green-500 mb-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="#e6ffed"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4"
                stroke="green"
                strokeWidth="2"
              />
            </svg>
            <div className="text-center text-xl font-bold text-green-600 mb-2">
              Chúc mừng, bạn đã đặt dữ liệu thành công!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDaiPhat;
