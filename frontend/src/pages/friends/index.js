import { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Header from "../../components/header";
import { friendspage } from "../../redux/reducers/allReducers";
import { getFriendsPageInfos } from "../../api/user";
import Card from "./Card";
// import {AiFillSetting, AiFillHome} from 'react-icons/ai';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import HomeIcon from "@mui/icons-material/Home";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import CakeIcon from "@mui/icons-material/Cake";
import SettingsIcon from "@mui/icons-material/Settings";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import "./style.css";
import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_ERROR,
} from "../../redux/actions/actionTypes";
export default function Friends({ user }) {
  // const { user } = useSelector((state) => ({ ...state }));
  const { type } = useParams();
  console.log({type})

  const [{ loading, error, data }, dispatch] = useReducer(friendspage, {
    loading: false,
    data: {},
    error: "",
  });

  const getData = async () => {
    dispatch({ type: FRIENDS_REQUEST });
    const res = await getFriendsPageInfos(user.token);
    console.log(res);
    if (res.status === "ok") {
      dispatch({ type: FRIENDS_SUCCESS, payload: res.data });
    } else {
      dispatch({ type: FRIENDS_ERROR, payload: res.data });
    }
  };
  useEffect(() => {
    getData();
  }, [user]);
  // console.log(data);

  return (
    <>
      <Header page="friends" />
      <div className="friends">
        <div className="friends_left">
          {error && error}
          <div className="friends_left_header">
            <h3>Friends</h3>
            <div className="small_circle">
              {/* <AiFillSetting /> */}
              <SettingsIcon />
              {/* <i className="settings_filled_icon"></i> */}
            </div>
          </div>
          <div className="friends_left_wrap">
            <Link
              to="/friends"
              className={`mmenu_item hover3 ${
                type === undefined && "active_friends"
              }`}
            >
              <div className="small_circle">
                {/* <i className="friends_home_icon "></i> */}
                <HomeIcon />
              </div>
              <span>Home</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </Link>
            <Link
              to="/friends/requests"
              className={`mmenu_item hover3 ${
                type === "requests" && "active_friends"
              }`}
            >
              <div className="small_circle">
                {/* <i className="friends_requests_icon"></i> */}
                <PersonAddIcon />
              </div>
              <span>Friend Requests</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </Link>
            <Link
              to="/friends/sent"
              className={`mmenu_item hover3 ${
                type === "sent" && "active_friends"
              }`}
            >
              <div className="small_circle">
                {/* <i className="friends_requests_icon"></i> */}
                <PersonAddIcon />
              </div>
              <span>Sent Requests</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </Link>
            <Link
              to="/friends/allUsers"
              className={`mmenu_item hover3 ${
                type === "allUsers" && "active_friends"
              }`}
            >
              <div className="small_circle">
                {/* <i className="friends_suggestions_icon"></i> */}
                <Diversity3Icon />
              </div>
              <span>Suggestions</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </Link>
            <Link
              to="/friends/allFriends"
              className={`mmenu_item hover3 ${
                type === "allFriends" && "active_friends"
              }`}
            >
              <div className="small_circle">
                {/* <i className="all_friends_icon"></i> */}
                <PeopleAltIcon />
              </div>
              <span>All Friends</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </Link>
            <div className="mmenu_item hover3">
              <div className="small_circle">
                {/* <i className="birthdays_icon"></i> */}
                <CakeIcon />
              </div>
              <span>Birthdays</span>
              <div className="rArrow">
                {/* <i className="right_icon"></i> */}
                <NavigateNextIcon />
              </div>
            </div>
          </div>
        </div>
        <div className="friends_right">
          {(type === undefined || type === "requests") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friend Requests</h3>
                {type === undefined && (
                  <Link to="/friends/requests" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.requests &&
                  data.requests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="request"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "sent") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Sent Requests</h3>
                {type === undefined && (
                  <Link to="/friends/sent" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.sentRequests &&
                  data.sentRequests.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="sent"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "allFriends") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Friends</h3>
                {type === undefined && (
                  <Link to="/friends/allFriends" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.friends &&
                  data.friends.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="allFriends"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
          {(type === undefined || type === "allUsers") && (
            <div className="friends_right_wrap">
              <div className="friends_left_header">
                <h3>Suggestions</h3>
                {type === undefined && (
                  <Link to="/friends/allUsers" className="see_link hover3">
                    See all
                  </Link>
                )}
              </div>
              <div className="flex_wrap">
                {data.allUsers &&
                  data.allUsers.map((user) => (
                    <Card
                      userr={user}
                      key={user._id}
                      type="allUsers"
                      getData={getData}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
