import React, { useState } from "react";
import Moment from "react-moment";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreateComment from "./CreateComment";
import { ClockLoader } from "react-spinners";
import axios from "axios";
import { commentReact } from "../../api/post";
import { deleteComment } from "../../api/post";
function Comments({
  setComments,
  comment,
  user,
  setCountComment,
  addCommentData,
  editCommentData,
  removeCommentData,
  reactCommentData,
}) {
  const [reply, setReply] = useState(false);
  const [loading, setLoading] = useState(false);
  const [commentMenu, setCommentMenu] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [seeReply, setSeeReplies] = useState(false);

  const [text, setEditText] = useState(comment.comment);

  const [reactions, setReactions] = useState({
    like: comment.like?.includes(user._id),
    dislike: comment.dislike?.includes(user._id),
  });

  const handleCommentReaction = async (react) => {
    //  react is like or dislike ........
    const inputs = {
      react,
      commentId: comment._id,
      token: user.token,
    };
    try {
      const { data } = await commentReact(
        inputs.commentId,
        react,
        inputs.token
      );

      if (react) {
        if (react) {
          setReactions((prev) => ({ ...prev, like: data.status }));
          if (reactions.dislike) {
            setReactions((prev) => ({ ...prev, dislike: false }));
          }
        }
      } else {
        setReactions((prev) => ({ ...prev, dislike: data.status }));
        if (reactions.like) {
          setReactions((prev) => ({ ...prev, like: false }));
        }
      }

      console.log({ data });
      reactCommentData(data.comment);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setLoading(true);
    try {
      const data = await deleteComment(comment._id, user.token);
      console.log({ data });
      removeCommentData(comment);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  console.log({ comment });
  return (
    <>
      { editVisible ? (
        <CreateComment
          comment={comment}
          postRef={comment.postRef}
          setComments={setComments}
          editVisible={editVisible}
          setEditVisible={setEditVisible}
          setEditText={setEditText}
          user={user}
          addCommentData={addCommentData}
          removeCommentData={removeCommentData}
          reactCommentData={reactCommentData}
          editCommentData={editCommentData}
        />
      ) : (
        <div className="comment">
          <img
            src={comment.commentBy?.picture}
            alt=""
            className="comment_img"
          />
          <div className="comment_col_1">
            <div className="comment_wrap">
              <div className="comment_name">
                {comment.commentBy?.first_name} {comment.commentBy?.last_name}{" "}
                {comment.edited && <span>(Edited)</span>}
              </div>
              <div className="comment_text">{comment.comment}</div>
            </div>
            {comment.image && (
              <img
                src={comment.image}
                alt="comment_image"
                className="comment_image"
              />
            )}

            <div className="comment_action">
              <div className="comment_react">
                <div
                  className="comment_like"
                  onClick={() => {
                    handleCommentReaction(true);
                  }}
                >
                  {reactions.like ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}

                  {comment.like.length > 0 && comment.like.length}
                </div>

                <div
                  className="comment_dislike"
                  onClick={() => {
                    handleCommentReaction(false);
                  }}
                >
                  {reactions.dislike ? (
                    <ThumbDownAltIcon />
                  ) : (
                    <ThumbDownOffAltIcon />
                  )}
                </div>
              </div>
              <div className="reply_comment">
                <div className="reply" onClick={() => setReply(!reply)}>
                  <span>| reply |</span>
                </div>
                {comment.children.length > 0 && (
                  <div
                    className="exist_replies"
                    onClick={() => setSeeReplies(!seeReply)}
                  >
                    <span>{comment.children.length} replies |</span>
                  </div>
                )}
              </div>
              <span>
                <Moment fromNow interval={30}>
                  {comment.createdAt}
                </Moment>
              </span>
            </div>
          </div>
          <div className="comment-col2">
            <MoreVertIcon onClick={() => setCommentMenu(!commentMenu)} />
            {commentMenu && (
              <>
                <div className="comment-col2-menu">
                  {user._id === comment.commentBy._id && (
                    <>
                      <div
                        className="edit"
                        onClick={(e) => {
                          setEditVisible(!editVisible);
                          setCommentMenu(!commentMenu);
                        }}
                      >
                        Edit
                      </div>
                      <div
                        className="delete"
                        onClick={() => {
                          handleDeleteComment();
                        }}
                      >
                        Delete
                        <ClockLoader
                          color="black"
                          size={20}
                          loading={loading}
                        />
                      </div>
                    </>
                  )}

                </div>
              </>
            )}
          </div>
        </div>
      )}

      {reply && (
        <CreateComment
          // key={comment._id}
          user={user}
          postRef={comment.postRef}
          setComments={setComments}
          setCountComment={setCountComment}
          replied={true}
          comment={comment}
          addCommentData={addCommentData}
          editCommentData={editCommentData}
          removeCommentData={removeCommentData}
          reactCommentData={reactCommentData}
        />
      )}
      {seeReply && (
        <>
          <div className="comment-chill">
            {comment.children?.map((commentChil) => (
              <Comments
                key={commentChil._id}
                comment={commentChil}
                setComments={setComments}
                user={user}
                setCountComment={setCountComment}
                addCommentData={addCommentData}
                editCommentData={editCommentData}
                removeCommentData={removeCommentData}
                reactCommentData={reactCommentData}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}

export default Comments;

// ------ same but included comments......

// import React, { useState } from "react";
// import Moment from "react-moment";
// import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
// import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
// import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import CreateComment from "./CreateComment";
// import { ClockLoader } from "react-spinners";
// import axios from "axios";
// import { commentReact } from "../../api/post";
// import { deleteComment } from "../../api/post";
// function Comments({
//   setComments,
//   comment,
//   user,
//   setCount,
//   addCommentData,
//   editCommentData,
//   removeCommentData,
//   reactCommentData,
// }) {
//   const [reply, setReply] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [commentMenu, setCommentMenu] = useState(false);
//   const [editVisible, setEditVisible] = useState(false);
//   const [seeReply, setSeeReplies] = useState(false);
//   // const content = user._id === comment.commentBy._id ? comment.comment :""

//   const [text, setEditText] = useState(comment.comment);
//   const [cancelEdit, setCancelEdit] = useState(false);

//   // const [reactComment, setReactComment] = useState(null);

//   // ---------------------------
//   // scene2  take2.1
//   // const [showingLike, setShowingLike] = useState(
//   //   comment.like.includes(user._id));
//   // const [showingDislike, setShowingDislike] = useState(
//   //   comment.dislike.includes(user._id));
//   //  scene2- take2.1

//   // --------------------------
//   // scene2 take2.2
//   const [reactions, setReactions] = useState({
//     like: comment.like?.includes(user._id),
//     dislike: comment.dislike?.includes(user._id),
//   });
//   //  scene2 take 2.2
//   // ----------------------------

//   // console.log(comment.like.includes(user._id));
//   // console.log({ comment });
//   // scene2 take2.1
//   // console.log({showingLike})
//   // console.log({showingDislike})
//   // scene2 take2.1
//   // console.log(comment.dislike.includes(user._id));

//   // __________________________________________________________________________
//   //  scene1
//   //  take 1 --succcess -- but it's lengthy
//   // -----------------------------------------------------------------
//   // const handleCommentReaction = async (react) => {
//   //   // console.log(reactComment)
//   //   const inputs = {
//   //     react,
//   //     commentId: comment._id,
//   //     token: user.token,
//   //   };
//   //   try {
//   //     const {data }= await commentReact(inputs.commentId, react, inputs.token);
//   //     console.log({ data });
//   //     // ---------------
//   //     // take1.1 - failed
//   //     // setComments(prev => (...prev.map(prevComment => ))
//   //     // ---------------
//   //     // console.log(data.status)
//   //     if(react){
//   //       if (data.status === true) {
//   //         const updatedComment = {
//   //           ...comment,
//   //           like: [...comment.like, user._id],
//   //         };
//   //         console.log(updatedComment)
//   //         setShowingLike(true);
//   //         setComments((prevComments) =>
//   //           // console.log(prevComments)
//   //           prevComments.map((prevComment) =>
//   //             prevComment._id === comment._id ? updatedComment : prevComment
//   //           )
//   //         );
//   //       } else {
//   //        const likeData =  comment.like.filter(
//   //          (like) => like !== user._id
//   //        );
//   //         const updatedCommentData ={
//   //           ...comment,
//   //           like:[...likeData]

//   //         }
//   //         console.log({updatedCommentData})
//   //         setShowingLike(false);
//   //         setComments((prevComments) =>
//   //           // console.log(prevComments)
//   //           prevComments.map((prevComment) =>
//   //             prevComment._id === comment._id ? updatedCommentData : prevComment
//   //           )
//   //         );

//   //       }
//   //     }else{
//   //       if(data.status === true){
//   //         todo -- to check whether user._id already inlcuded in the comment
//   //
//   //         const updatedDislike = {...comment, dislike:[...comment.dislike,user._id]}
//   //         console.log(updatedDislike)
//   //         setComments((prevComments)=>
//   //         prevComments.map(prevComment =>
//   //           prevComment._id === user._id ? updatedDislike:prevComment))
//   //           setShowingDislike(true)

//   //       }else{
//   //         const disliked = comment.dislike.filter(dislike => dislike !== user._id)
//   //         const updatedDislikedData = {
//   //           ...comment,
//   //           dislike:[...disliked]
//   //         }

//   //         setComments((prevComments)=>
//   //         prevComments.map(prevComment=>
//   //           prevComment._id === user._id ?  updatedDislikedData:prevComment))
//   //       }
//   //       setShowingDislike(false)

//   //     }

//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };
//   // ________________________________________________________________________________

//   // --------------------------------------------------------------------------
//   // scene2
//   // take2.1 -- some mistakes not getting proper data
//   //  take2.1.1 --- success   did some basic changes ....

//   // const handleCommentReaction = async (react) => {
//   //   // console.log(reactComment)
//   //   const inputs = {
//   //     react,
//   //     commentId: comment._id,
//   //     token: user.token,
//   //   };
//   //   try {
//   //     const {data }= await commentReact(inputs.commentId, react, inputs.token);
//   //     console.log({ data });
//   //     console.log(data.comment)
//   //     if(react){
//   //       if (data.status) {
//   //         if(showingDislike) setShowingDislike(false)
//   //         setShowingLike(true);

//   //         setComments((prevComments) =>
//   //           // console.log(prevComments)
//   //           prevComments.map((prevComment) =>
//   //             prevComment._id === comment._id ? data.comment : prevComment
//   //           )
//   //         );
//   //       } else {
//   //         if(showingDislike) setShowingDislike(false)
//   //         setShowingLike(false);
//   //         setComments((prevComments) =>
//   //           // console.log(prevComments)
//   //           prevComments.map((prevComment) =>
//   //             prevComment._id === comment._id ? data.comment : prevComment
//   //           )
//   //         );

//   //       }
//   //     }else{
//   //       if(data.status){

//   //       console.log('true inisde')
//   //           setComments((prevComments)=>
//   //           prevComments.map((prevComment) =>
//   //           prevComment._id === comment._id ? data.comment:prevComment))
//   //           if(showingLike) setShowingLike(false)
//   //           setShowingDislike(true)

//   //       }else{
//   //       console.log("false inside")

//   //         setComments((prevComments)=>
//   //         prevComments.map(prevComment=>
//   //           prevComment._id === comment._id ?  data.comment:prevComment))

//   //           if(showingLike) setShowingLike(false)
//   //           setShowingDislike(false)
//   //       }

//   //     }

//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };
//   // take2.1 end
//   // ______________________________________________________________________
//   // --------------------------------------------------------------------
//   //  scene2
//   // take 2.2 start  --elloo - taken help from the chatgpt
//   const handleCommentReaction = async (react) => {
//     // console.log(reactComment)
//     //  react is like or dislike ........
//     const inputs = {
//       react,
//       commentId: comment._id,
//       token: user.token,
//     };
//     try {
//       const { data } = await commentReact(
//         inputs.commentId,
//         react,
//         inputs.token
//       );
//       // console.log({ data });
//       // console.log(data.comment);
//       if (react) {
//         if (react) {
//           setReactions((prev) => ({ ...prev, like: data.status }));
//           if (reactions.dislike) {
//             setReactions((prev) => ({ ...prev, dislike: false }));
//           }
//         }
//       } else {
//         setReactions((prev) => ({ ...prev, dislike: data.status }));
//         if (reactions.like) {
//           setReactions((prev) => ({ ...prev, like: false }));
//         }
//       }
//       // --
//       // setComments((prevComments) =>
//       //   prevComments.map((prevComment) =>
//       //     prevComment._id === comment._id ? data.comment : prevComment
//       //   )
//       // );
//       // ---
//       console.log({ data });
//       reactCommentData(data.comment);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   //  take2.2 end
//   // ______________________________________
//   // const handle
//   // console.log({ editVisible });
//   const handleDeleteComment = async () => {
//     setLoading(true);
//     try {
//       const data = await deleteComment(comment._id, user.token);
//       console.log({ data });
//       // setComments((prevComments) =>
//       //   prevComments.filter((prevComment) => prevComment._id !== comment._id)
//       // );
//       removeCommentData(comment);
//       setLoading(false);
//     } catch (error) {
//       console.log(error);
//       setLoading(false);
//     }
//   };
//   // console.log({seeReply})
//   // console.log(replied)
//   console.log({ comment });
//   return (
//     <>
//       {editVisible ? (
//         <CreateComment
//           comment={comment}
//           postRef={comment.postRef}
//           setComments={setComments}
//           editVisible={editVisible}
//           setEditVisible={setEditVisible}
//           setEditText={setEditText}
//           user={user}
//           addCommentData={addCommentData}
//           removeCommentData={removeCommentData}
//           reactCommentData={reactCommentData}
//           editCommentData={editCommentData}
//         />
//       ) : (
//         <div className="comment">
//           <img
//             src={comment.commentBy?.picture}
//             alt=""
//             className="comment_img"
//           />
//           <div className="comment_col_1">
//             <div className="comment_wrap">
//               <div className="comment_name">
//                 {comment.commentBy?.first_name} {comment.commentBy?.last_name}{" "}
//                 {comment.edited && <span>(Edited)</span>}
//               </div>
//               <div className="comment_text">{comment.comment}</div>
//               {/* <div className="comment_text">{text}</div> */}
//             </div>
//             {comment.image && (
//               <img
//                 src={comment.image}
//                 alt="comment_image"
//                 className="comment_image"
//               />
//             )}

//             <div className="comment_action">
//               <div className="comment_react">
//                 <div
//                   className="comment_like"
//                   onClick={() => {
//                     handleCommentReaction(true);
//                   }}
//                 >
//                   {/* scene2 take2.2*/}
//                   {reactions.like ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />}
//                   {/* scene2 take2.2*/}

//                   {/* {showingLike ? <ThumbUpAltIcon /> : <ThumbUpOffAltIcon />} */}
//                   {comment.like.length > 0 && comment.like.length}
//                 </div>

//                 <div
//                   className="comment_dislike"
//                   onClick={() => {
//                     handleCommentReaction(false);
//                   }}
//                 >
//                   {/* scene2 take2*/}

//                   {reactions.dislike ? (
//                     <ThumbDownAltIcon />
//                   ) : (
//                     <ThumbDownOffAltIcon />
//                   )}
//                   {/* scene2 take2*/}

//                   {/* {showingDislike ? (
//                   <ThumbDownAltIcon />
//                 ) : (
//                   <ThumbDownOffAltIcon />
//                 )} */}
//                 </div>
//               </div>
//               <div className="reply_comment">
//                 <div className="reply" onClick={() => setReply(!reply)}>
//                   <span>| reply |</span>
//                 </div>
//                 {comment.children.length > 0 && (
//                   <div
//                     className="exist_replies"
//                     onClick={() => setSeeReplies(!seeReply)}
//                   >
//                     <span>{comment.children.length} replies |</span>
//                   </div>
//                 )}
//               </div>
//               <span>
//                 <Moment fromNow interval={30}>
//                   {comment.createdAt}
//                 </Moment>
//               </span>
//             </div>
//           </div>
//           <div className="comment-col2">
//             <MoreVertIcon onClick={() => setCommentMenu(!commentMenu)} />
//             {commentMenu && (
//               <>
//                 <div className="comment-col2-menu">
//                   {user._id === comment.commentBy._id && (
//                     <>
//                       <div
//                         className="edit"
//                         onClick={(e) => {
//                           setEditVisible(!editVisible);
//                           setCommentMenu(!commentMenu);
//                         }}
//                       >
//                         Edit
//                       </div>
//                       <div
//                         className="delete"
//                         onClick={() => {
//                           handleDeleteComment();
//                         }}
//                       >
//                         Delete
//                         <ClockLoader
//                           color="black"
//                           size={20}
//                           loading={loading}
//                         />
//                       </div>
//                     </>
//                   )}

//                   <div className="report">Report</div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}

//       {reply && (
//         <CreateComment
//           // key={comment._id}
//           user={user}
//           postRef={comment.postRef}
//           setComments={setComments}
//           setCount={setCount}
//           replied={true}
//           comment={comment}
//           setReply={setReply}
//           addCommentData={addCommentData}
//           editCommentData={editCommentData}
//           removeCommentData={removeCommentData}
//           reactCommentData={reactCommentData}
//         />
//       )}
//       {seeReply && (
//         <>
//           <div className="comment-chill">
//             {comment.children?.map((commentChil) => (
//               <Comments
//                 key={commentChil._id}
//                 comment={commentChil}
//                 setComments={setComments}
//                 user={user}
//                 setCount={setCount}
//                 addCommentData={addCommentData}
//                 editCommentData={editCommentData}
//                 removeCommentData={removeCommentData}
//                 reactCommentData={reactCommentData}
//               />
//             ))}
//           </div>
//         </>
//       )}
//       {/* {editComment && <CreateComment comment={comment} cancelEdit={cancelEdit} setCancelEdit={setCancelEdit} setEditText={setEditText} user={user}/>} */}
//     </>
//   );
// }

// export default Comments;
