import { useEffect, useRef, useState } from "react";
import useClickOutside from "../../helpers/clickOutside";
// import { useSelector } from "react-redux";
import {
  acceptRequest,
  addFriend,
  cancelRequest,
  deleteRequest,
  follow,
  unfollow,
  unfriend,
} from "../../api/user";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import LoupeIcon from "@mui/icons-material/Loupe";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Friendship({ friendshipp, profileid, user }) {
  const [friendship, setFriendship] = useState(friendshipp);
  useEffect(() => {
    setFriendship(friendshipp);
  }, [friendshipp]);
  const [friendsMenu, setFriendsMenu] = useState(false);
  const [respondMenu, setRespondMenu] = useState(false);
  const menu = useRef(null);
  const menu1 = useRef(null);
  const navigate = useNavigate();
  // const { user } = useSelector((state) => ({ ...state }));

  const [inputs, setInputs] = useState("");
  useEffect(() => {
    setInputs({
      user1: user._id,
      user2: profileid,
    });
  }, [profileid, user._id]);
  useClickOutside(menu, () => setFriendsMenu(false));
  useClickOutside(menu1, () => setRespondMenu(false));

  const addFriendHandler = async () => {
    setFriendship({ ...friendship, requestSent: true, following: true });
    await addFriend(profileid, user.token);
  };
  const cancelRequestHandler = async () => {
    setFriendship({ ...friendship, requestSent: false, following: false });
    await cancelRequest(profileid, user.token);
  };
  const followHandler = async () => {
    setFriendship({ ...friendship, following: true });
    await follow(profileid, user.token);
  };
  const unfollowHandler = async () => {
    setFriendship({ ...friendship, following: false });
    await unfollow(profileid, user.token);
  };
  const acceptRequestHanlder = async () => {
    setFriendship({
      ...friendship,
      friends: true,
      following: true,
      requestSent: false,
      requestReceived: false,
    });
    await acceptRequest(profileid, user.token);
  };
  const unfriendHandler = async () => {
    setFriendship({
      ...friendship,
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    });
    await unfriend(profileid, user.token);
  };
  const deleteRequestHanlder = async () => {
    setFriendship({
      ...friendship,
      friends: false,
      following: false,
      requestSent: false,
      requestReceived: false,
    });
    await deleteRequest(profileid, user.token);
  };

  const handleMessage = async () => {
    try {
      const res = await axios.post(`/api1/newConversation`, inputs, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res);

      if (res.data.ok) {
        setInputs("");
        navigate("/messenger");
      }
    } catch (err) {
      console.log({ err });
    }
  };
  return (
    <div className="friendship">
      {friendship?.friends ? (
        <div className="friends_menu_wrap">
          <button className="gray_btn" onClick={() => setFriendsMenu(true)}>
            <PeopleIcon />
            <span>Friends</span>
          </button>
          {friendsMenu && (
            <div className="open_cover_menu_friends" ref={menu}>
              {friendship?.following ? (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => unfollowHandler()}
                >
                  Unfollow
                </div>
              ) : (
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => followHandler()}
                >
                  Follow
                </div>
              )}
              <div
                className="open_cover_menu_item hover1"
                onClick={() => unfriendHandler()}
              >
                Unfriend
              </div>
            </div>
          )}
        </div>
      ) : (
        !friendship?.requestSent &&
        !friendship?.requestReceived && (
          <button className="blue_btn" onClick={() => addFriendHandler()}>
            <PersonAddRoundedIcon />
            <span>Add Friend</span>
          </button>
        )
      )}
      {friendship?.requestSent ? (
        <button className="blue_btn" onClick={() => cancelRequestHandler()}>
          <PersonRemoveIcon />
          <span>Cancel Request</span>
        </button>
      ) : (
        friendship?.requestReceived && (
          <div className="friends_menu_wrap">
            <button className="gray_btn" onClick={() => setRespondMenu(true)}>
              <PersonIcon />
              <span>Respond</span>
            </button>
            {respondMenu && (
              <div className="open_cover_menu_respond" ref={menu1}>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => acceptRequestHanlder()}
                >
                  Confirm
                </div>
                <div
                  className="open_cover_menu_item hover1"
                  onClick={() => deleteRequestHanlder()}
                >
                  Delete
                </div>
              </div>
            )}
          </div>
        )
      )}
      {friendship?.following ? (
        <button className="gray_btn" onClick={() => unfollowHandler()}>
          <LoupeIcon />
          <span>Following</span>
        </button>
      ) : (
        <button className="blue_btn" onClick={() => followHandler()}>
          <LoupeIcon />
          <span>Follow</span>
        </button>
      )}
      {friendship?.friends ? (
        <>
          <button onClick={handleMessage}>Mess</button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
