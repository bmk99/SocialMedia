// import React, { useState } from "react";
// import "./Messages.css";
// import { format } from "timeago.js";

// function Messages({ message, own }) {
//   const messageDate = new Date(message.createdAt);
//   const formattedMessageDate = formatDate(messageDate);
//   const formattedMessageTime = formatTime(messageDate);
//   const [previousDate, setPreviousDate] = useState(null);

//   const showDate = !previousDate || formattedMessageDate !== previousDate;
//    console.log(formattedMessageDate)
//   if (showDate) {
//     setPreviousDate(formattedMessageDate);
//   }

//   return (
//     <div className={own ? "messages own" : "messages"}>
//       <div className="chatiingBox">
//         {own ? (
//           <>
//             <div className="messages_top">
//               <span className="messages_text">{message.text}</span>
//               <img
//                 src="https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
//                 alt="nature"
//                 className="messages_image"
//               />
//             </div>
//             <div className="messages_bottom">
//              {/* {format(message.createdAt)} */}

//              {formattedMessageTime}
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="messages_top">
//               <img
//                 src="https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
//                 alt="nature"
//                 className="messages_image"
//               />
//               <span className="messages_text">{message.text}</span>
//             </div>
//             <div className="messages_bottom">
//               {formattedMessageTime}
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// function formatDate(date) {
//   const day = date.getDate().toString().padStart(2, "0");
//   const month = (date.getMonth() + 1).toString().padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// }

// function formatTime(date) {
//   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
// }


// export default Messages;

import React, { useState } from "react";
import "./Messages.css";
import { format } from "timeago.js";
import { Link} from "react-router-dom";


function Messages({ message, own }) {
  const messageDate = new Date(message.createdAt);
  const formattedMessageDate = formatDate(messageDate);
  const formattedMessageTime = formatTime(messageDate);

  // console.log(message);

  return (
    <div className={own ? "messages own" : "messages"}>
      <div className="chatiingBox">
        {own ? (
          <>
            <div className="messages_top">
              <span className="messages_text">{message.text}</span>
              <Link to={`/profile/${message.senderId._id}`} >
              <img
                src={
                  message.senderId.picture
                    ? message.senderId.picture
                    : ""
                }
                alt="nature"
                className="messages_image"
              />
              </Link>
            </div>
            <div className="messages_bottom">
              {formattedMessageTime}
            </div>
          </>
        ) : (
          <>
            <div className="messages_top">
              <Link to={`/profile/${message.senderId._id}`}>
              <img
                src={
                  message.senderId.picture
                    ? message.senderId.picture
                    : ""
                }
                alt="nature"
                className="messages_image"
              />
              </Link>
              
              <span className="messages_text">{message.text}</span>
            </div>
            <div className="messages_bottom">{formattedMessageTime}</div>
          </>
        )}
      </div>
    </div>
  );
}

function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default Messages;