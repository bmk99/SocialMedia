import React from "react";

function LikeProfiles({  user }) {
  return (
    <>
      <div className="reactions_wrap">
        <img src={user.reactBy.picture} alt="kirana" className="react_img" />

        <div className="react_wrap">
          <div className="react_name">
            {user.reactBy.first_name} {user.reactBy.last_name}{" "}
          </div>
        </div>
      </div>
    </>
  );
}

export default LikeProfiles;

//  --n
