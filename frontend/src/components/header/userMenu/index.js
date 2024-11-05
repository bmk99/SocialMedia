import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DisplayAccessibility from "./DisplayAccessibility";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
export default function UserMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(0);
  const logout = () => {
    Cookies.set("user", "");
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };
  return (
    <div className="mmenu">
      {visible === 0 && (
        <div>
          <Link to="/profile" className="mmenu_header hover3">
            <img src={user?.picture} alt="" />
            <div className="mmenu_col">
              <span>
                {user?.first_name} {user?.last_name}
              </span>
              <span>See your profile</span>
            </div>
          </Link>

          <div className="mmenu_splitter"></div>

          <div
            className="mmenu_item hover3"
            onClick={() => {
              setVisible(3);
            }}
          >
            {/* <div className="small_circle">
              <i className="dark_filled_icon"></i>
            </div> */}
            <span>Display & Accessibility</span>
            <div className="rArrow">
              <ArrowRightIcon />
            </div>
          </div>
          <div
            className="mmenu_item hover3"
            onClick={() => {
              logout();
            }}
          >
            <span>Logout</span>
            <div className="small_circle">
              <LogoutIcon />
            </div>
          </div>
        </div>
      )}
      {visible === 3 && <DisplayAccessibility setVisible={setVisible} />}
    </div>
  );
}
