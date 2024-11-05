import AddIcon from '@mui/icons-material/Add';
import "./style.css";
import { stories } from "../../../data/home";
import Story from "./Story";
export default function Stories() {
  return (
    <div className="stories">
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
      {stories.map((story, i) => (
        <Story story={story} />
      ))}
   
    </div>
  );
}
