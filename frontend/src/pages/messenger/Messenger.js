import React, { useEffect, useState, useRef } from "react";
import "./Messenger.css";
import Conversation from "../../components/chatMenu/Conversation";
import Messages from "../../components/chatBox/Messages";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import axios from "axios";
import { ClockLoader } from "react-spinners";
import { io } from "socket.io-client";
import { CloudOff } from "@material-ui/icons";
import Header from "../../components/header/index";

function Messenger({ user }) {
  const scroolRef = useRef();
  const socket = useRef(null);

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [chatOnline, setChatOnline] = useState(null);
  const [online, setOnline] = useState(null);

  // Initializing the socket and getting new messages
  useEffect(() => {
    socket.current = io("https://connect2all.onrender.com");
    socket.current.on("getMessage", (data) => {
      console.log(data && data);
      setArrivalMessages({
        senderId: data.senderUser,
        text: data.text,
        createdAt: Date.now(),
      });
    });


    return () => {
      socket.current.disconnect();
    };
  }, []);

  // If arrival messages are present, add them to messages
  useEffect(() => {
    arrivalMessages &&
      // currentChat?.members.includes(arrivalMessages.sender) &&
      currentChat?.members.some(
        (member) => member._id === arrivalMessages.senderId._id
      ) &&
      setMessages((prev) => [...prev, arrivalMessages]);
  }, [arrivalMessages, currentChat]);

  // Calling the socket io for the users checking
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      console.log({ users });

      //  for users either thery are online or not
      // setChatOnline(users);
      // const on = currentChat?.members?.includes(
      //   (m) => m._id === users.find((m) => m.userId === m)
      // );
      // const on = currentChat?.members?.some(member=> member._id === users.find((user => user.userId === )) )
      // on && setOnline(true);
    });

    return () => {
      socket.current.off("getUsers");
    };
  }, [user._id, currentChat, chatOnline]);

  // Getting all conversations from the currentuser id
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api1/getConversation/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setConversations(res.data);
      } catch (err) {
        console.log({ err });
      }
    };
    getData();
  }, [user]);

  // Getting all messages for the currentChat id
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api1/getMessages/${currentChat?._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    currentChat && getMessages();
  }, [currentChat, user.token]);

  // Send message to the backend
  const handleSendMessage = async (e) => {
    e.preventDefault();

    const inputs = {
      conversationId: currentChat._id,
      senderId: user._id,
      text: text,
    };

    // const receiverId = currentChat.members.find((member) => member !== user._id);
    const receiverUser = currentChat.members.find(
      (member) => member._id !== user._id
    );
    const receiverId = receiverUser._id;
    // console.log({ receiverUser });

    const datas = {
      // senderId: user._id,
      senderUser: user,
      receiverId: receiverId,
      text: text,
    };

    socket.current.emit("sendMessage", datas);

    try {
      setLoading(true);
      setText("");
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api1/newMessage/`, inputs, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      //  console.log(res.data)
      setMessages((prev) => [...prev, res.data]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the last message
  useEffect(() => {
    scroolRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  console.log({ currentChat });
  console.log({ messages });
  console.log({ arrivalMessages });
  console.log({ chatOnline });

  // for group by data
  function groupMessagesByDate(messages) {
    const groupedMessages = {};

    messages.forEach((message) => {
      const date = formatDate(message.createdAt);

      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }

      groupedMessages[date].push(message);
    });

    return Object.entries(groupedMessages).map(([date, messages]) => ({
      date,
      messages,
    }));
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  const groupedMessages = groupMessagesByDate(messages);
  console.log(groupedMessages);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <>
      <Header />

      <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input
              type="text"
              placeholder="search for the friends"
              className="chatMenu_Input"
            />
            <div className="chatMenu_Top">
              {conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)}>
                  <Conversation
                    key={c._id}
                    conversation={c}
                    currentUser={user}
                    online={online}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBox_Top">
                  {/* {online && (
                    <>
                      <span>online</span>
                    </>
                  )} */}
                  {groupedMessages.map((group) => (
                    <div key={`${group.date}-${Date.now()}`}>
                      <div className="date-header">{group.date}</div>

                      {group.messages.map((message) => (
                        <div className="div" ref={scroolRef}>
                          <Messages
                            key={message._id}
                            message={message}
                            own={message.senderId._id === user._id}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* {messages.map((m) => (
                    <div className="div" ref={scroolRef}>
                      <Messages
                        key={m._id}
                        message={m}
                        own={m.senderId === user._id}
                      />
                    </div>
                  ))} */}
                </div>
                <div className="chatBox_Bottom">
                  {/* <textarea
                    name="text"
                    value={text}
                    id=""
                    placeholder="send the text"
                    className="chatBoxBottom_input"
                    onChange={(e) => setText(e.target.value)}
                    cols="20"
                    rows="2"
                  ></textarea> */}
                  <textarea
                    name="text"
                    value={text}
                    id=""
                    placeholder="send the text"
                    className="chatBoxBottom_input"
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    cols="20"
                    rows="2"
                  ></textarea>
                  {loading ? <ClockLoader color="#36d7b7" size={30} /> : null}
                  <button className="button1" onClick={handleSendMessage}>
                    send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a New Chat for Conversation
              </span>
            )}
          </div>
        </div>

        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            {/* <ChatOnline chatOnline={chatOnline} currentUser={user} /> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenger;
