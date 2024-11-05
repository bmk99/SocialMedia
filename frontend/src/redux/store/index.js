import { combineReducers } from "redux";
import { userReducer } from "../reducers/userReducer";
import { themeReducer } from "../reducers/themeReducer";

const rootReducer = combineReducers({
  user: userReducer,
  darkTheme: themeReducer,
});

export default rootReducer;
