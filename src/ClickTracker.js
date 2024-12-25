import React, { useState, useRef, useEffect } from "react";

function ClickTracker() {
  const [clicked, setClicked] = useState(false);
  const elementRef = useRef(null); // Tạo một ref để tham chiếu đến phần tử

  useEffect(() => {
    // Hàm này sẽ chạy mỗi khi người dùng click vào đâu đó
    const handleClickOutside = (event) => {
      // Kiểm tra nếu click nằm ngoài phần tử được tham chiếu
      if (elementRef.current && !elementRef.current.contains(event.target)) {
        setClicked(false);
      }
    };

    // Lắng nghe sự kiện click toàn bộ document
    document.addEventListener("click", handleClickOutside);

    // Dọn dẹp khi component bị unmount
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Hàm để xử lý click vào phần tử được tham chiếu
  const handleClick = () => {
    setClicked(true);
  };

  return (
    <div>
      <div
        ref={elementRef} // Gán ref cho phần tử
        onClick={handleClick} // Xử lý sự kiện click
        style={{
          padding: "20px",
          backgroundColor: clicked ? "green" : "lightgray",
          cursor: "pointer",
        }}
      >
        Click vào tôi!
      </div>

      <p>{clicked ? "Bạn đã click vào phần tử!" : "Chưa click vào phần tử."}</p>
    </div>
  );
}

export default ClickTracker;
