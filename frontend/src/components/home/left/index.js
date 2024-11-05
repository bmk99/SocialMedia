import "./style.css";
import { Link } from "react-router-dom";
import { stories } from "../../../data/home";
import Story from "../stories/Story";
import AddIcon from '@mui/icons-material/Add';
export default function LeftHome({ user }) {
  return (
    <div className="left_home scrollbar">
      <Link to="/profile" className="left_link hover1">
        <img src={user?.picture} alt="" />
        <span>
          {user?.first_name} {user.last_name}
        </span>
      </Link>
      <div className="create_story_card">
        <img
          src="../../../images/default_pic.png"
          alt=""
          className="create_story_img"
        />
        <div className="plus_story">
          <AddIcon color="#fff"/>
        </div>
        <div className="story_create_text">Create Story</div>
      </div>

      <div className="more_left">
        {stories.map((story, i) => (
          <Story story={story} key={i} />
        ))}
       
      </div>
    </div>
  );
}
