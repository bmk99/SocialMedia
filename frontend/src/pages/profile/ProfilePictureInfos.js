import { useRef, useState } from "react";
import ProfilePicture from "../../components/profilePicture";
import Friendship from "./Friendship";
import { Link, useNavigate } from "react-router-dom";
import CameraAltIcon from '@mui/icons-material/CameraAlt';


export default function ProfilePictureInfos({
  user,
  profile,
  visitor,
  photos,
  othername,
}) {
  const [show, setShow] = useState(false);
  const pRef = useRef(null);
  console.log({profile})
  // const navigate = useNavigate()
  console.log({visitor})
  
  // const handleMessage =async () =>{

    // try {
    //   const res = await axios.get(
    //   `${process.env.REACT_APP_BACKEND_URL}/new/${user.id}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${user.token}`,
    //     },
    //   }
    // );
    //   // console.log(res);
    // } catch (err) {
    //   console.log({ err });
    // }

  // }
  return (
    <div className="profile_img_wrap">
      {show && <ProfilePicture user={user} setShow={setShow} pRef={pRef} photos={photos} />}
      <div className="profile_w_left">
        <div className="profile_w_img">
          <div
            className="profile_w_bg"
            ref={pRef}
            style={{
              backgroundSize: "cover",
              backgroundImage: `url(${profile.picture})`,
            }}
          ></div>
          {!visitor && (
            <div
              className="profile_circle hover1"
              onClick={() => setShow(true)}
            >
              {/* <i className="camera_filled_icon"></i> */}
              <CameraAltIcon/>
            </div>
          )}
        </div>
        <div className="profile_w_col">
          <div className="profile_name">
            {profile.first_name} {profile.last_name}
            <div className="othername">{othername && `(${othername})`}</div>
          </div>
          <div className="profile_friend_count">
            {profile?.friends && (
              <div className="profile_card_count">
                {profile?.friends.length === 0
                  ? ""
                  : profile?.friends.length === 1
                  ? "1 Friend"
                  : `${profile?.friends.length} Friends`}
              </div>
            )}
          </div>
          <div className="profile_friend_imgs">
            {profile?.friends &&
              profile.friends.slice(0, 6).map((friend, i) => (
                <Link to={`/profile/${friend.username}`} key={i}>
                  <img
                    src={friend.picture}
                    alt=""
                    style={{
                      transform: `translateX(${-i * 0}px)`,
                      zIndex: `${i}`,
                    }}
                  />
                </Link>
              ))}
          </div>
          {/* {
            visitor ?
            <> */}
          
            {/* </>:""
            
          } */}
          </div>
        
      </div>
      {visitor ? (
        <Friendship friendshipp={profile?.friendship} profileid={profile._id} user={user} />
      ) : (
       ""
      )}
    </div>
  );
}
