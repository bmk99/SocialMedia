import Cookies from "js-cookie";
import { LOGIN, LOGOUT, VERIFY } from "../actions/actionTypes";

export function userReducer(
  state = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null,
  action
) {
  switch (action.type) {
    case LOGIN:
      return action.payload;
    case LOGOUT:
      return null;
    // case VERIFY:
    //   return {
    //     ...state,
    //     verified: action.payload,
    //   };

    default:
      return state;
  }
}
