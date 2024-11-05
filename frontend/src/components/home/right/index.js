import "./style.css";
export default function RightHome({ user }) {
  
  return (
    <div className="right_home">
      <div className="heading">Sponsored</div>
      <div className="contacts_wrap">
        <div className="contacts_header">
          <div className="contact hover3">
            <div className="contact_img">
              <img src={user.picture} alt="" />
            </div>
            <span>
              {user.first_name} {user.last_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
