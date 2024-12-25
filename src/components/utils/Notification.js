import "./Notification.css";

let notificationTimeout;

export const showNotification = (content) => {
  // Kiểm tra nếu thông báo đang hiển thị
  if (document.querySelector(".custom-notification")) {
    return;
  }

  // Tạo một div thông báo
  const notificationDiv = document.createElement("div");
  notificationDiv.className = "custom-notification"; // CSS class cho thông báo
  notificationDiv.innerText = content;

  // Thêm thông báo vào DOM
  document.body.appendChild(notificationDiv);

  // Xóa thông báo sau 3 giây
  notificationTimeout = setTimeout(() => {
    document.body.removeChild(notificationDiv);
    notificationTimeout = null;
  }, 3000);
};
