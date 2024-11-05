import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Home from "./pages/home";
import LoggedInRoutes from "./routes/LoggedInRoutes";
import NotLoggedInRoutes from "./routes/NotLoggedInRoutes";
import { useSelector } from "react-redux";
import Reset from "./pages/reset";
import CreatePostPopup from "./components/createPostPopup";
import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { postsReducer } from "./redux/reducers/allReducers";
import Friends from "./pages/friends";
// import Games from "./pages/games";
import Messenger from "./pages/messenger/Messenger";
import { POST_SUCCESS,POST_REQUEST,POST_ERROR } from "./redux/actions/actionTypes";

function App() {
  const [visible, setVisible] = useState(false);
  const { user, darkTheme } = useSelector((state) => ({ ...state }));
  const [{ loading, error, posts }, dispatch] = useReducer(postsReducer, {
    loading: false,
    posts: [],
    error: "",
  });
  
  useEffect(() => {
 
    getAllPosts();
  }, []);
  const getAllPosts = async () => {
    try {
      dispatch({
        type: POST_REQUEST,
      });
      const { data } = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api1/getAllposts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch({
        type: POST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: POST_ERROR,
        payload: error.response.data.message,
      });
    }
  };

  return (
    <div className={darkTheme && "dark"}>
    {visible && <CreatePostPopup user={user} setVisible={setVisible} />}
    <Routes>
      <Route element={<NotLoggedInRoutes />}>
        <Route path="/login" element={<Login />} exact />
      </Route>
      <Route element={<LoggedInRoutes />}>
        <Route
          path="/profile"
          element={<Profile user={user} setVisible={setVisible} />}
          exact
        />
        <Route
          path="/profile/:username"
          element={<Profile user={user} setVisible={setVisible} />}
          exact
        />
          <Route
            path="/friends"
            element={
              <Friends user={user} setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
     
            <Route
            path="/friends/:type"
            element={
              <Friends user={user} setVisible={setVisible} getAllPosts={getAllPosts} />
            }
            exact
          />
        <Route
          path="/"
          element={<Home user={user} setVisible={setVisible} posts={posts} />}
          exact
        />
          <Route
          path="/messenger"
          element={<Messenger user={user} setVisible={setVisible} />}
          exact
        />
        {/* <Route path="/activate/:token" element={<Activate />} exact /> */}
      </Route>
      <Route path="/reset" element={<Reset />} />
    </Routes>
  </div>
  );
}

export default App;
