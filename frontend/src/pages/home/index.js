import { useSelector } from "react-redux";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import Stories from "../../components/home/stories";
import Post from "../../components/post/index"
import "./style.css";
export default function Home({setVisible,posts,user}) {
  
  return (
    <div className="home">
      <Header />
      {/* <LeftHome user={user} /> */}
      <div className="home_middle">
        <CreatePost user={user} setVisible={setVisible}/>
        <div className="posts">
          {posts.map((post) => (
            <Post key={post._id} post={post} user={user}/>
          ))}
        </div>
      </div>
      {/* <RightHome user={user} /> */}
    </div>
  );
}
