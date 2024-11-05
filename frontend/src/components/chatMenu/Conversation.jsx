// import React, { useEffect, useState } from "react";
// import "./Conversation.css";
// import axios from "axios";

// function Conversation({ conversation, currentUser, handleCurrentChat ,online}) {
//   const [user, setUser] = useState({ profilePicture: "", username: "" });
//   const [loading, setLoading] = useState(true);
//   // const [online,setOnline] = useState(false)
 
//   //  console.log(user)

//   useEffect(() => {
//     const friendId = conversation.members.find((m) => m !== currentUser.id);
//     // chatOnline.find(m=>m.userId === friendId) && setOnline(true) 
//     const getUserData = async () => {
//       try {
//         // const res = await axios.get(
//         //   `/users/getUser/?userId=${friendId}&timestamp=${Date.now()}`
//         // );
//         // console.log(res.data);

//        const res =  await axios.get(
//           `${process.env.REACT_APP_BACKEND_URL}/getProfile/${friendId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         setUser(res.data);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     getUserData();

//     // setUser(friendId)
//   }, [conversation, currentUser ]);
// // console.log(online)
//   return (
//     <>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         // <div className="conversations hover1" onClick={handleCurrentChat}>
//         //   <img
//         //     src={
//         //       user.profilePicture
//         //         ? user.profilePicture
//         //         : "https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
//         //     }
//         //     alt="nature"
//         //     className="conversation_image"
//         //   />
//         //   <span className="conversatoin_name">{user.username}</span>
//         // </div>
//         <div className="chatOnline">
         
//         <div className="chatOnline_wrap hover1" onClick={handleCurrentChat}>
//           <div className="chatOnline_image_container">
//           <img
//             src={
//               user.picture
//                 ? user.picture
//                 : "https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
//             }
//             alt="nature"
//             className="chatOnline_image"
//           />
//           {/* {online && 
//             <div className="chatOnline_badge"></div>
//           } */}
//             <div className="chatOnline_badge"></div>

//           </div>
  
//           <div className="chatOnline_name">{user.username}</div>
//         </div>
//       </div>
//       )}
//     </>
//   );
// }

// export default Conversation;

import React, { useEffect, useState } from "react";
import "./Conversation.css";

function Conversation({
  conversation,
  currentUser,
  handleCurrentChat,
  online,
}) {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  // const [online,setOnline] = useState(false)

  //  console.log(user)

  useEffect(() => {
    const friendId = conversation.members.find(
      (m) => m._id !== currentUser._id
    );

    setUser(friendId);
    // chatOnline.find(m=>m.userId === friendId) && setOnline(true)
    // const getUserData = async () => {
    //   try {
    //     const res = await axios.get(
    //       `/users/getUser/?userId=${friendId}&timestamp=${Date.now()}`
    //     );
    //     // console.log(res.data);
    //     setUser(res.data);
    //   } catch (err) {
    //     console.log(err);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // getUserData();

    // setUser(friendId)
  }, [conversation, currentUser]);
  // console.log(online)

  return (
    <>
      {/* {loading ? (
        <p>Loading...</p>
      ) : ( */}

      <div className="chatOnline">
        <div className="chatOnline_wrap hover1" onClick={handleCurrentChat}>
          <div className="chatOnline_image_container">
            <img
              src={
                user.picture
                  ? user.picture
                  : "https://th.bing.com/th?id=OIP.4siKIW3oZ4kEo0vkEVQ5hgHaLH&w=204&h=306&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
              }
              alt="nature"
              className="chatOnline_image"
            />
            {online && <div className="chatOnline_badge"></div>}
            {/* <div className="chatOnline_badge"></div> */}
          </div>

          <div className="chatOnline_name">{user.username}</div>
        </div>
      </div>
      {/* )} */}
    </>
  );
}

export default Conversation;
