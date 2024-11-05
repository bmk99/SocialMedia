import React, { useEffect, useState } from "react";
import "./Conversation.css";
import axios from "axios";

function Conversation({ conversation, currentUser, handleCurrentChat }) {
  const [user, setUser] = useState({ profilePicture: "", username: "" });
  const [loading, setLoading] = useState(true);

  // console.log(user.username)
  const friend = Object.keys(conversation.members).find(
    (key) => conversation.members[key] !== currentUser._id
  );
  const friendId = conversation.members[friend];

  useEffect(() => {
    const getUserData = async () => {
      try {
        const res = await axios.get(
          `/users/getUser/?userId=${friendId}&timestamp=${Date.now()}`
        );
        // console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getUserData();

    // setUser(friendId)
  }, [friendId, currentUser]);

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        // <div className="conversations hover1" onClick={handleCurrentChat}>
        //   <img
        //     src={
        //       user.profilePicture
        //         ? user.profilePicture
        //         : "https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
        //     }
        //     alt="nature"
        //     className="conversation_image"
        //   />
        //   <span className="conversatoin_name">{user.username}</span>
        // </div>
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
  
          <div className="chatOnline_name">Kir</div>
        </div>
      </div>
      )}
    </>
  );
}

export default Conversation;
