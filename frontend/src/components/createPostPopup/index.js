import {  useRef, useState } from "react";
import { useDispatch } from "react-redux";
import "./style.css";
import PostError from "./PostError";
import ImagePreview from "./ImagePreview";
import { createPost } from "../../api/post";
import AddToYourPost from "./AddToYourPost";
import { uploadImages } from "../../api/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";
import useClickOutside from "../../helpers/clickOutside";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import PulseLoader from "react-spinners/PulseLoader";
import DangerousIcon from "@mui/icons-material/Dangerous";

export default function CreatePostPopup({ user, setVisible }) {
  const dispatch = useDispatch();
  const popup = useRef(null);
  const [text, setText] = useState("");
  const [showPrev, setShowPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [background, setBackground] = useState("");

  // Close the popup when clicking outside
  useClickOutside(popup, () => {
    if (!loading) {
      setVisible(false);
    }
  });

  // Post submission logic with improvements
  const postSubmit = async () => {
    // Validate input
    if (!text && !background && (!images || images.length === 0)) {
      setError("Please add text, a background, or an image to create a post.");
      return;
    }

    try {
      setLoading(true);

      let response;
      if (background) {
        response = await createPost(
          null,
          background,
          text,
          null,
          user._id,
          user.token
        );
      } else if (images && images.length) {
        const postImages = images.map(dataURItoBlob);
        const path = `${user.username}/post_images`;
        const formData = new FormData();
        formData.append("path", path);
        postImages.forEach((image) => formData.append("file", image));
        console.log({formData})
        const uploadResponse = await uploadImages(formData, user.token);

        response = await createPost(
          null,
          null,
          text,
          uploadResponse,
          user._id,
          user.token
        );
      } else {
        response = await createPost(
          null,
          null,
          text,
          null,
          user._id,
          user.token
        );
      }

      if (response === "ok") {
        resetForm();
      } else {
        setError(response || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while creating the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setText("");
    setImages([]);
    setBackground("");
    setVisible(false);
  };

  return (
    <div className="blur">
      <div className="postBox" ref={popup}>
        {error && <PostError error={error} setError={setError} />}
        <div className="box_header">
          <div className="heading">
            <h2>Create Post</h2>
          </div>

          <div
            className="small_circle"
            onClick={() => {
              if (!loading) setVisible(false);
            }}
          >
            <DangerousIcon />
          </div>
        </div>
        <div className="box_profile">
          <img src={user.picture} alt="" className="box_profile_img" />
          <div className="box_col">
            <div className="box_profile_name">
              {user.first_name} {user.last_name}
            </div>
          </div>
        </div>
        {!showPrev ? (
          <EmojiPickerBackgrounds
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            setBackground={setBackground}
            background={background}
          />
        ) : (
          
          <ImagePreview
            text={text}
            user={user}
            setText={setText}
            showPrev={showPrev}
            images={images}
            setImages={setImages}
            setShowPrev={setShowPrev}
            setError={setError}
          />
        )}
        <AddToYourPost setShowPrev={setShowPrev} />

        <button className="post_submit" onClick={postSubmit} disabled={loading}>
          {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
        </button>
      </div>
    </div>
  );
}
// ---------------old.. 
// import { useEffect, useRef, useState } from "react";
// import "./style.css";
// import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
// import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
// import ImagePreview from "./ImagePreview";
// import useClickOutside from "../../helpers/clickOutside";
// import { createPost } from "../../api/post";
// import PulseLoader from "react-spinners/PulseLoader";
// import { useDispatch } from "react-redux";
// import PostError from "./PostError";
// import dataURItoBlob from "../../helpers/dataURItoBlob";
// import { uploadImages } from "../../api/uploadImages";
// import DangerousIcon from "@mui/icons-material/Dangerous";
// import AddToYourPost from "./AddToYourPost";
// export default function CreatePostPopup({ user, setVisible }) {
//   const dispatch = useDispatch();
//   const popup = useRef(null);
//   const [text, setText] = useState("");
//   const [showPrev, setShowPrev] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [images, setImages] = useState([]);
//   const [background, setBackground] = useState("");
//   useClickOutside(popup, () => {
//     setVisible(false);
//   });
  
//   const postSubmit = async () => {
//     if (background) {
//       setLoading(true);
//       const response = await createPost(
//         null,
//         background,
//         text,
//         null,
//         user._id,
//         user.token
//       );
//       setLoading(false);
//       if (response === "ok") {
//         setBackground("");
//         setText("");
//         setVisible(false);
//       } else {
//         setError(response);
//       }
//     } else if (images && images.length) {
//       setLoading(true);
//       const postImages = images.map((img) => {
//         return dataURItoBlob(img);
//       });
//       const path = `${user.username}/post_images`;
//       let formData = new FormData();
//       formData.append("path", path);
//       postImages.forEach((image) => {
//         formData.append("file", image);
//       });
//       const response = await uploadImages(formData, user.token);

//       const res = await createPost(
//         null,
//         null,
//         text,
//         response,
//         user._id,
//         user.token
//       );
//       setLoading(false);
//       if (res === "ok") {
//         setText("");
//         setImages("");
//         setVisible(false);
//       } else {
//         setError(res);
//       }
//     } else if (text) {
//       setLoading(true);
//       const response = await createPost(
//         null,
//         null,
//         text,
//         null,
//         user._id,
//         user.token
//       );
//       setLoading(false);
//       if (response === "ok") {
//         setBackground("");
//         setText("");
//         setVisible(false);
//       } else {
//         setError(response);
//       }
//     } else {
//       console.log("nothing");
//     }
//   };
//   return (
//     <div className="blur">
//       <div className="postBox" ref={popup}>
//         {error && <PostError error={error} setError={setError} />}
//         <div className="box_header">
//           <div
//             className="small_circle"
//             onClick={() => {
//               setVisible(false);
//             }}
//           >
//             <DangerousIcon />
//           </div>
//           <span>Create Post</span>
//         </div>
//         <div className="box_profile">
//           <img src={user.picture} alt="" className="box_profile_img" />
//           <div className="box_col">
//             <div className="box_profile_name">
//               {user.first_name} {user.last_name}
//             </div>
//           </div>
//         </div>
//         {!showPrev ? (
//           <>
//             <EmojiPickerBackgrounds
//               text={text}
//               user={user}
//               setText={setText}
//               showPrev={showPrev}
//               setBackground={setBackground}
//               background={background}
//             />
//           </>
//         ) : (
//           <ImagePreview
//             text={text}
//             user={user}
//             setText={setText}
//             showPrev={showPrev}
//             images={images}
//             setImages={setImages}
//             setShowPrev={setShowPrev}
//             setError={setError}
//           />
//         )}
//         <AddToYourPost setShowPrev={setShowPrev} />

//         <button
//           className="post_submit"
//           onClick={() => {
//             postSubmit();
//           }}
//           disabled={loading}
//         >
//           {loading ? <PulseLoader color="#fff" size={5} /> : "Post"}
//         </button>
//       </div>
//     </div>
//   );
// }
