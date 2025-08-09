import moment from 'moment';
// ✅ Hàm định dạng ngày
export const formatDate = (
  date,
  format = 'YYYY-MM-DD'
) => {
  return date ? moment(date).format(format) : '';
};

// ✅ Hàm hiển thị thời gian tương đối (ví dụ: "2 ngày trước")
export const fromNow = (date) => {
  return moment(date).fromNow();
};

// ✅ Hàm kiểm tra đã hết hạn chưa
export const isExpired = (date) => {
  return moment().isAfter(moment(date));
};

// ✅ Hàm tạo chuỗi giờ UTC (dùng khi gửi lên API)
export const toUTCString = (date) => {
  return moment(date).utc().format();
};