import React from "react";
import "./chatOnline.css";

function ChatOnline() {
  return (
    <div className="chatOnline">
      <div className="chatOnline_wrap">
        <div className="chatOnline_image_container">
          <img
            src="https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
            className="chatOnline_image"
            alt=""
          />
          <div className="chatOnline_badge"></div>
        </div>

        {/* <div className="chatOnline_name">Kir</div> */}
      </div>
    </div>
  );
}

export default ChatOnline;
