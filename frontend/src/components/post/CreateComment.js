// scene2  taken from the chatgpt modified above code
import React, { useEffect, useRef, useState } from "react";
import Picker from "emoji-picker-react";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { ClockLoader } from "react-spinners";
import Tooltip from "@mui/material/Tooltip";
import { editComment, postComments } from "../../api/post";
import { uploadImages } from "../../api/uploadImages";
import dataURItoBlob from "../../helpers/dataURItoBlob";

export default function CreateComment({
  user,
  postRef,
  setComments,
  setCountComment,
  comment,
  editVisible = false,
  setEditVisible,
  replied = false,
  editCommentData,
  addCommentData,
}) {
  const [commentData, setCommentData] = useState({
    text: !replied ? comment?.comment || "" : "",
    commentImage: !replied ? comment?.image || "" : "",
    error: "",
    loading: false,
  });
  const [picker, setPicker] = useState(false);
  const [cursor, setCursor] = useState(0);
  const textRef = useRef(null);
  const imgInput = useRef(null);

  useEffect(() => {
    textRef.current.selectionEnd = cursor;
  }, [cursor]);

  const handleEmoji = ({ emoji }) => {
    const ref = textRef.current;
    ref.focus();
    const start = commentData.text.substring(0, ref.selectionStart);
    const end = commentData.text.substring(ref.selectionStart);
    const newText = start + emoji + end;
    setCommentData({ ...commentData, text: newText });
    setCursor(start.length + emoji.length);
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setCommentData({ ...commentData, commentImage: event.target.result });
    };
  };

  const handleComment = async () => {
    //  --- for edited comment
    if (editVisible) {
      // if comment is edited
      console.log("insid the edited");
      let imgComment;
      // -- edited comment if nothing changed
      if (
        comment.text === commentData.text &&
        comment.image === commentData.image
      ) {
        setEditVisible(false);
        setCommentData({
          text: "",
          commentImage: "",
          error: "",
          loading: false,
        });
      }
      //  -- edited comment if both image and text changed
      else {
        try {
          // --edited comment if images was changed
          if (
            commentData.commentImage !== comment.image &&
            commentData.commentImage !== ""
          ) {
            const img = dataURItoBlob(commentData.commentImage);
            const path = `${user.username}/post_images/${comment.postRef}`;
            let formData = new FormData();
            formData.append("path", path);
            formData.append("file", img);
            imgComment = await uploadImages(formData, path, user.token);
          }
          // --edited comment remaining as it is
          const commentImage = imgComment
            ? imgComment[0].url
            : commentData.image;
          const { data } = await editComment(
            comment._id,
            commentData.text,
            commentImage,
            user.token
          );

          console.log({ data });

          editCommentData(data.comment, comment);
          setCommentData({
            text: "",
            commentImage: "",
            error: "",
            loading: false,
          });
          setEditVisible(false);
        } catch (error) {
          console.log({ error });
          setCommentData({
            ...commentData,
            error: "Error posting comment",
            loading: false,
          });
        }
      }
      // ---- new comment
    } else {
      let parentID = replied ? comment._id : "";
      console.log({ parentID });
      //  -- new comment -if image was there
      if (commentData.commentImage !== "") {
        setCommentData({ ...commentData, loading: true });
        const img = dataURItoBlob(commentData.commentImage);
        const path = `${user.username}/post_images/${postRef}`;
        let formData = new FormData();
        formData.append("path", path);
        formData.append("file", img);
        const imgComment = await uploadImages(formData, path, user.token);

        try {
          console.log({ parentID });
          const data = await postComments(
            postRef,
            commentData.text,
            imgComment[0].url,
            user.token,
            parentID
          );
          console.log({ data });
          addCommentData(data, comment);

          setCountComment((prev) => prev + 1);
          setCommentData({
            text: "",
            commentImage: "",
            error: "",
            loading: false,
          });
        } catch (error) {
          setCommentData({
            ...commentData,
            error: "Error posting comment",
            loading: false,
          });
          console.log({ error });
        }
      }
      //  -- new comment if image is not present
      else {
        setCommentData({ ...commentData, loading: true });

        try {
          const data = await postComments(
            postRef,
            commentData.text,
            "",
            user.token,
            parentID
          );
          console.log({ data });
          addCommentData(data);
          setCountComment((prev) => prev + 1);
          setCommentData({
            text: "",
            commentImage: "",
            error: "",
            loading: false,
          });
        } catch (error) {
          setCommentData({
            ...commentData,
            error: "Error posting comment",
            loading: false,
          });
          console.log({ error });
        }
      }
    }
  };
  console.log(commentData.text);
  const handleCommentCancel = () => {
    if (editVisible) {
      setEditVisible(false);
      setCommentData({ text: "", commentImage: "", error: "", loading: false });
    } else {
      setCommentData({ text: "", commentImage: "", error: "", loading: false });
    }
  };
  // console.log({editVisible})
  // console.log({replied});
  return (
    <>
      <div className="create_comment_wrap">
        <div className="create_comment_1">
          <img src={user?.picture} alt="" />
          <div className="create_comment_1_comment_input_wrap">
            {picker && (
              <div className="comment_emoji_picker">
                <Picker onEmojiClick={handleEmoji} />
              </div>
            )}
            <input
              type="file"
              hidden
              ref={imgInput}
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleImage}
            />
            {commentData.error && (
              <div className="postError comment_error">
                <div className="postError_error">{commentData.error}</div>
                <button
                  className="blue_btn"
                  onClick={() => setCommentData({ ...commentData, error: "" })}
                >
                  Try again
                </button>
              </div>
            )}
            <input
              type="text"
              ref={textRef}
              value={commentData.text}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleComment();
              }}
              placeholder="Write a comment..."
              onChange={(e) =>
                setCommentData({ ...commentData, text: e.target.value })
              }
              onClick={() => setCursor(textRef.current.selectionStart)}
            />
            <ClockLoader
              color="black"
              size={20}
              loading={commentData.loading}
            />
          </div>

          <div className="create_comment_2">
            <div className="create_comment_2_left">
              <div
                className="comment_circle_icon hover2"
                onClick={() => setPicker((prev) => !prev)}
              >
                <AddReactionIcon />
              </div>
              <div
                className="comment_circle_icon hover2"
                onClick={() => imgInput.current.click()}
              >
                <AddAPhotoIcon />
              </div>
            </div>

            <div className="create_comment_2_right">
              <div
                className="comment_circle_icon hover2"
                onClick={() => handleCommentCancel()}
              >
                <Tooltip title="Cancel">
                  <CancelIcon fontSize="small" />
                </Tooltip>
              </div>
              <div
                className="comment_circle_icon hover2"
                onClick={() => handleComment()}
              >
                <Tooltip title="Comment">
                  <SendIcon fontSize="small" />
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        {commentData.commentImage && (
          <div className="comment_img_preview">
            <img src={commentData.commentImage} alt="" />
            <div
              className="small_white_circle"
              onClick={() =>
                setCommentData({ ...commentData, commentImage: "" })
              }
            >
              <i className="exit_icon">
              </i>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// --------------same but included comments.........
// import { useEffect, useRef, useState } from "react";
// import Picker from "emoji-picker-react";
// import { comment, postComments } from "../../api/post";
// import SendIcon from "@mui/icons-material/Send";
// import dataURItoBlob from "../../helpers/dataURItoBlob";
// import { uploadImages } from "../../api/uploadImages";
// import CancelIcon from "@mui/icons-material/Cancel";
// import AddReactionIcon from "@mui/icons-material/AddReaction";
// import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
// import { ClockLoader } from "react-spinners";
// import Tooltip from "@mui/material/Tooltip";
// import Comments from "./Comments";

// export default function CreateComment({
//   user,
//   postRef,
//   setComments,
//   setCount,
// }) {
//   const [picker, setPicker] = useState(false);
//   const [text, setText] = useState("");
//   const [error, setError] = useState("");
//   const [commentImage, setCommentImage] = useState("");
//   const [cursor, setCursor] = useState();
//   const [loading, setLoading] = useState(false);

//   const textRef = useRef(null);
//   useEffect(() => {
//     textRef.current.selectionEnd = cursor;
//   }, [cursor]);
//   const imgInput = useRef(null);

//   // emoji handler
//   const handleEmoji = ({ emoji }) => {
//     const ref = textRef.current;
//     ref.focus();
//     const start = text.substring(0, ref.selectionStart);
//     const end = text.substring(ref.selectionStart);
//     const newText = start + emoji + end;
//     setText(newText);
//     setCursor(start.length + emoji.length);
//   };

//   // comment Image handler
//   const handleImage = (e) => {
//     let file = e.target.files[0];
//     // if (
//     //   file.type !== "image/jpeg" &&
//     //   file.type !== "image/png" &&
//     //   file.type !== "image/webp" &&
//     //   file.type !== "image/gif"
//     // ) {
//     //   setError(`${file.name} format is not supported.`);
//     //   return;
//     // } else if (file.size > 1024 * 1024 * 5) {
//     //   setError(`${file.name} is too large max 5mb allowed.`);
//     //   return;
//     // }
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = (event) => {
//       setCommentImage(event.target.result);
//     };
//   };

//   // total comment handler including img(emoji,image),text,em
//   const handleComment = async (e) => {
//     if (commentImage !== "") {
//       setLoading(true);

//       const img = dataURItoBlob(commentImage);
//       const path = `${user.username}/post_images/${postRef}`;
//       let formData = new FormData();
//       formData.append("path", path);
//       formData.append("file", img);
//       const imgComment = await uploadImages(formData, path, user.token);
//       console.log(imgComment);
//       console.log(imgComment[0]);

//       const newComment = await postComments(
//         postRef,
//         text,
//         imgComment[0].url,
//         user.token
//       );

//       // setComments(newComment)
//       setCount((prev) => ++prev);
//       setLoading(false);
//       setText("");
//       setCommentImage("");
//       console.log(newComment);
//     } else {
//       setLoading(true);

//       // const newComment = await comment(postId, text, "", user.token);
//       console.log(postRef);
//       const newComment = await postComments(postRef, text, "", user.token);
//       setComments((prevComment) => [...prevComment, newComment]);
//       setCount((prev) => ++prev);
//       setLoading(false);
//       setText("");
//       setCommentImage("");
//       console.log(newComment);
//     }
//   };
//   const handleCommentCancel = () => {
//     setText("");
//     setLoading(false);
//     setCommentImage("");
//   };

//   return (
//     <div className="create_comment_wrap">
//       <div className="create_comment_1">
//         <img src={user?.picture} alt="" />
//         <div className="create_comment_1_comment_input_wrap">
//           {picker && (
//             <div className="comment_emoji_picker">
//               <Picker onEmojiClick={handleEmoji} />
//             </div>
//           )}
//           <input
//             type="file"
//             hidden
//             ref={imgInput}
//             accept="image/jpeg,image/png,image/gif,image/webp"
//             onChange={handleImage}
//           />
//           {error && (
//             <div className="postError comment_error">
//               <div className="postError_error">{error}</div>
//               <button className="blue_btn" onClick={() => setError("")}>
//                 Try again
//               </button>
//             </div>
//           )}
//           <input
//             type="text"
//             ref={textRef}
//             value={text}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") handleComment();
//             }}
//             placeholder="Write a comment..."
//             onChange={(e) => setText(e.target.value)}
//           />

//           <ClockLoader color="black" size={20} loading={loading} />
//         </div>

//         <div className="create_comment_2">
//           <div className="create_comment_2_left">
//             <div
//               className="comment_circle_icon hover2"
//               onClick={() => {
//                 setPicker((prev) => !prev);
//               }}
//             >
//               <AddReactionIcon />
//               {/* <i className="emoji_icon">emoji</i> */}
//             </div>
//             <div
//               className="comment_circle_icon hover2"
//               onClick={() => imgInput.current.click()}
//             >
//               {/* <i className="camera_icon">cam</i> */}
//               <AddAPhotoIcon/>
//             </div>
//           </div>
//           <div className="create_comment_2_right">
//             <div
//               className="comment_circle_icon hover2"
//               onClick={handleCommentCancel}
//             >
//               <Tooltip title="cancel">
//                 <CancelIcon fontSize="small" />
//               </Tooltip>
//             </div>

//             <div className="comment_circle_icon hover2" onClick={handleComment}>
//               <Tooltip title="comment">
//                 <SendIcon fontSize="small" />
//               </Tooltip>
//             </div>
//           </div>
//         </div>
//       </div>

//       {commentImage && (
//         <div className="comment_img_preview">
//           <img src={commentImage} alt="" />
//           <div
//             className="small_white_circle"
//             onClick={() => setCommentImage("")}
//           >
//             <i className="exit_icon"></i>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// _______________________________________________________________________
// -------------------------------------
