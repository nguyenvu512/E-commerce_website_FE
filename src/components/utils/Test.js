import React, { useEffect, useState } from "react";
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const Test = () => {
  const [message, setMessage] = useState();

  useEffect(() => {
    const socket = new SockJS("http://localhost:8083/order-service/ws");
    const client = Stomp.over(socket);

    client.connect({}, () => {
      console.log("Connected to WebSocket");

      client.subscribe("/topic/orders", (msg) => {
        console.log(msg.body);
      });
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, []); // Đảm bảo kết nối chỉ được thiết lập một lần

  return (
    <div>
      <h1>WebSocket Notifications</h1>
      <ul>{message}</ul>
    </div>
  );
};

export default Test;
