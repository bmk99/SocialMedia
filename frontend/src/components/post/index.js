import { Link } from "react-router-dom";
import "./style.css";
import Moment from "react-moment";
// import { Dots, Public } from "../../svg";
import ReactsPopup from "./ReactsPopup";
import { useEffect, useReducer, useState } from "react";
import CreateComment from "./CreateComment";
import PostMenu from "./PostMenu";
import { editComment, getComments, getReacts, reactPost } from "../../api/post";
import Comments from "./Comments";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ShareIcon from "@mui/icons-material/Share";
import { reactsReducer } from "../../redux/reducers/allReducers";
import {
  reacts_request,
  reacts_success,
  reacts_error,
} from "../../redux/actions/allActions";
import LikeProfiles from "./LikeProfiles";
export default function Post({ post, user, profile }) {
  const [rerender, setRerender] = useState(false);

  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [likeVisible, setLikeVisible] = useState(false);
  const [likeVisible2, setLikeVisible2] = useState(false);
  const [filterdata, setFilterData] = useState("");

  const [{ loading, dataReacts, error }, dispatch] = useReducer(reactsReducer, {
    loading: true,
    dataReacts: {},
    error: "",
  });
  const [reacts, setReacts] = useState([]);
  const [check, setCheck] = useState("");
  const [total, setTotal] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [showComment, setShowComments] = useState(false);
  const [count, setCountComment] = useState(1);
  const [countReacts, setCountReacts] = useState(1);
  const [countReactSeperate, setCountReactSeperate] = useState(1);
  const [comments, setComments] = useState([]);

  // const { loading, dataReacts, error } = currentState;
  //  -- reaction the post with various emojis
  useEffect(() => {
    const getPostReacts = async () => {
      try {
        dispatch(reacts_request());
        const res = await getReacts(post._id, user.token);
        console.log(res.check);
        dispatch(reacts_success(res));
        setReacts(res.reacts);
        setCheck(res.check);
        setTotal(res.total);
      } catch (error) {
        dispatch(reacts_error(error));
      }
    };
    getPostReacts();
  }, [post._id, user.token]);
  console.log({ reacts });
  console.log({ check });
  const reactHandler = async (react) => {
    try {
      const res = await reactPost(post._id, react, user.token);
      const updatedReactsNew = [...reacts];
      if (check === react) {
        setCheck("");
        // Find the index of the react in the reacts array
        const index = updatedReactsNew.findIndex((x) => x.react === check);
        // i think no need to check whether the index was present or not
        if (index !== -1) {
          // Update the count property of the react
          const removeReacts = updatedReactsNew[index];
          const newUsers = removeReacts.users.filter(
            (use) => use.reactBy._id !== user._id
          );
          // console.log({ newUsers });
          updatedReactsNew[index] = {
            ...updatedReactsNew[index],
            count: --updatedReactsNew[index].count,
            users: newUsers,
          };
          console.log({ updatedReactsNew });
          setTotal((prev) => --prev);
        }
      } else {
        // for updating the new reaction emoji by the user
        setCheck(react);
        let previousReactIfPresent = updatedReactsNew.findIndex(
          (x) => x.react === check
        );
        let newReactFromUser = updatedReactsNew.findIndex(
          (x) => x.react === react
        );
        //  for removing the old reaction emoji by the user
        // for updating the new react
        console.log({ newReactFromUser });
        console.log({ previousReactIfPresent });
        if (previousReactIfPresent !== -1) {
          const removalReacts = updatedReactsNew[previousReactIfPresent];
          const newUsers2 = removalReacts.users.filter(
            (use) => use.reactBy._id !== user._id
          );
          updatedReactsNew[previousReactIfPresent] = {
            ...updatedReactsNew[previousReactIfPresent],
            count: --updatedReactsNew[previousReactIfPresent].count,
            users: newUsers2,
          };
          setTotal((prev) => --prev);
        }
        if (newReactFromUser !== -1) {
          let newUsers1 = [...updatedReactsNew[newReactFromUser].users, res];
          updatedReactsNew[newReactFromUser] = {
            ...updatedReactsNew[newReactFromUser],
            count: ++updatedReactsNew[newReactFromUser].count,
            users: newUsers1,
          };
          setTotal((prev) => ++prev);
        }
      }
      setReacts(updatedReactsNew);
    } catch (error) {
      console.log(error);
    }
  };

  // -- for seeing the indiviudal reactions...
  const handleReact = (react = "") => {
    setLikeVisible2(true);
    setFilterData(react);
  };

  const allReactsUsers = reacts.reduce((accumulator, react) => {
    react.users.map((user) => accumulator.push(user));
    return accumulator;
  }, []);

  const showmore = (para = "") => {
    if (para === "allReacts") {
      setCountReacts((prev) => prev + 3);
    } else if (para === "react") {
      setCountReactSeperate((prev) => prev + 3);
    } else {
      setCountComment((prev) => (prev = prev + 3));
    }
  };
  const showLess = (para) => {
    if (para === "allReacts") {
      setCountReacts(1);
    } else if (para === "react") {
      setCountReactSeperate(1);
    } else {
      setCountComment(1);
    }
  };

  //  -- commnents section
  useEffect(() => {
    allComments();
  }, []);
  const allComments = async () => {
    try {
      const res = await getComments(post._id, user.token);
      setComments(res);
    } catch (error) {
      console.log(error);
    }
  };
  console.log({comments})

  const findComment = (id) => {
    let commentToFind;
    const recurse = (comment, id) => {
      if (comment._id === id) {
        commentToFind = comment;
      } else {
        for (let i = 0; i < comment.children.length; i++) {
          const commentToSearch = comment.children[i];
          recurse(commentToSearch, id);
        }
      }
    };

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      recurse(comment, id);
    }

    return commentToFind;
  };

  const addCommentData = (data, comment = "") => {
    console.log({ data });
    if (data.parentID) {
      const parentComment = findComment(data.parentID);
      console.log("parent");
      parentComment.children = [...parentComment.children, data];
      setRerender(!rerender);
    } else {
      console.log("not parent");
      setComments((prevComments) => [...prevComments, data]);
    }
  };

  const removeCommentData = (data) => {
    console.log({ data });
    if (data.parentID) {
      console.log("removed parent");
      const parentComment = findComment(data.parentID);
      console.log({ parentComment });

      const filterdData = parentComment.children.filter(
        (parentChill) => parentChill._id !== data._id
      );
      parentComment.children = [...filterdData];
      setRerender(!rerender);
    } else {
      console.log("not paretn");
      setComments((prevComments) =>
        prevComments.filter((prevComment) => prevComment._id !== data._id)
      );
    }
  };

  const editCommentData = async (data, comment = "") => {
    if (data.parentID) {
      console.log(data.comment);
      const parentComment = findComment(data.parentID);
      const index = parentComment.children.findIndex((x) => x._id === data._id);

      parentComment.children[index] = {
        ...parentComment.children[index],
        comment: data.comment,
        edited: !parentComment.children[index].edited === true && true,
      };
      setRerender(!rerender);
    } else {
      console.log("not parent");

      setComments((prevComments) =>
        prevComments.map((prevComment) =>
          prevComment._id === data._id
            ? { ...prevComment, comment: data.comment }
            : prevComment
        )
      );
    }
  };
  
  const reactCommentData = (data) => {
    let like = data.like;
    let dislike = data.dislike;
    console.log({ like });
    console.log({ dislike });
    if (data.parentID) {
      console.log("parent react ");
      const parentComment = findComment(data.parentID);

      console.log({ parentComment });
      const index = parentComment.children.findIndex((x) => x._id === data._id);
      console.log({ index });
      parentComment.children[index] = {
        ...parentComment.children[index],
        like: [...like],
        dislike: [...dislike],
      };

      setRerender(!rerender);
    } else {
      console.log("not parent");
      setComments((prevComments) =>
        prevComments.map((prevComment) =>
          prevComment._id === data._id
            ? { ...prevComment, like: [...like], dislike: [...dislike] }
            : prevComment
        )
      );
    }
  };

  return (
    <div
      className={`post ${isInView ? "animate-slide-in" : ""}`}
      style={{ width: `${profile && "100%"}` }}
    >
      <div className="post_header">
        <Link
          to={`/profile/${post.user.username}`}
          className="post_header_left"
        >
          <img src={post.user.picture} alt="" />
          <div className="header_col">
            <div className="post_profile_name">
              {post.user.first_name} {post.user.last_name}
              <div className="updated_p">
                {post.type === "profilePicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } profile picture`}
                {post.type === "coverPicture" &&
                  `updated ${
                    post.user.gender === "male" ? "his" : "her"
                  } cover picture`}
              </div>
            </div>
            <div className="post_profile_privacy_date">
              <Moment fromNow interval={30}>
                {post.createdAt}
              </Moment>
            </div>
          </div>
        </Link>
        <div
          className="post_header_right hover1"
          onClick={() => setShowMenu((prev) => !prev)}
        >
          <MoreHorizIcon />
        </div>
      </div>
      {post.background ? (
        <div
          className="post_bg"
          style={{ backgroundImage: `url(${post.background})` }}
        >
          <div className="post_bg_text">{post.text}</div>
        </div>
      ) : post.type === null ? (
        <>
          <div className="post_text">{post.text}</div>
          {post.images && post.images.length && (
            <div
              className={
                post.images.length === 1
                  ? "grid_1"
                  : post.images.length === 2
                  ? "grid_2"
                  : post.images.length === 3
                  ? "grid_3"
                  : post.images.length === 4
                  ? "grid_4"
                  : post.images.length >= 5 && "grid_5"
              }
            >
              {post.images.slice(0, 5).map((image, i) => (
                <img src={image.url} key={i} alt="" className={`img-${i}`} />
              ))}
              {post.images.length > 5 && (
                <div className="more-pics-shadow">
                  +{post.images.length - 5}
                </div>
              )}
            </div>
          )}
        </>
      ) : post.type === "profilePicture" ? (
        <div className="post_profile_wrap">
          <div className="post_updated_bg">
            <img src={post.user.cover} alt="" />
          </div>
          <img
            src={post.images[0].url}
            alt=""
            className="post_updated_picture"
          />
        </div>
      ) : (
        <div className="post_cover_wrap">
          <img src={post.images[0].url} alt="" />
        </div>
      )}

      <div className="post_infos">
        <div className="reacts_count">
          <div className="reacts_count_imgs">
            {loading
              ? "..loading"
              : reacts &&
                reacts
                  .sort((a, b) => {
                    return b.count - a.count;
                  })
                  .slice(0, 3)
                  .map(
                    (reaction) =>
                      reaction.count > 0 && (
                        <img src={`/reacts/${reaction.react}.svg`} alt="" />
                      )
                  )}
          </div>
          <div
            className="reacts_count_num"
            onClick={() => setLikeVisible(!likeVisible)}
          >
            {total > 0 && total}{" "}
          </div>
        </div>
        <div className="to_right">
          <div className="comments_count">{comments?.length} comments</div>
        </div>
      </div>

      <div className="post_actions">
        <ReactsPopup
          visible={visible}
          setVisible={setVisible}
          reactHandler={reactHandler}
        />
        <div className="post_action">
          <div
            className="post_action hover1"
            onMouseOver={() => {
              setTimeout(() => {
                setVisible(true);
              }, 300);
            }}
            onMouseLeave={() => {
              setTimeout(() => {
                setVisible(false);
              }, 300);
            }}
            onClick={() => {
              reactHandler(check ? check : "like");
            }}
          >
            {check ? (
              <img
                src={`/reacts/${check}.svg`}
                alt="real"
                className="small_react"
                style={{ width: "18px" }}
              />
            ) : (
              <ThumbUpOffAltIcon />
            )}
            <span
              className="post_action"
              style={{
                color: `${
                  check === "Angry" || check === "Love"
                    ? "#ff794d"
                    : check === "Haha" || check === "Wow" || check === "Sad"
                    ? "#a7a21b"
                    : check === "Like"
                    ? "#8080ff"
                    : ""
                }`,
              }}
            >
              {check ? check : "Like"}
            </span>
          </div>
        </div>
        <div
          className="post_action hover1"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <ChatBubbleOutlineIcon />

          <span>Comment</span>
        </div>
        <div className="post_action hover1">
          <ShareIcon /> <span>Share</span>
        </div>
      </div>

      <div className="comments_wrap">
        <div className="comments_order"></div>
        {showComment && (
          <>
            <CreateComment
              user={user}
              postRef={post._id}
              setComments={setComments}
              setCountComment={setCountComment}
              addCommentData={addCommentData}
              editCommentData={editCommentData}
              reactCommentData={reactCommentData}
            />
            {comments &&
              comments
                .sort((a, b) => {
                  return new Date(b.commentAt) - new Date(a.commentAt);
                })
                .slice(0, count)
                .map((comment, i) => (
                  <Comments
                    addCommentData={addCommentData}
                    removeCommentData={removeCommentData}
                    editCommentData={editCommentData}
                    reactCommentData={reactCommentData}
                    setCountComment={setCountComment}
                    user={user}
                    setComments={setComments}
                    comment={comment}
                    key={comment._id}
                  />
                ))}
            {count < comments.length ? (
              <div className="view_comments" onClick={() => showmore()}>
                view more commens
              </div>
            ) : (
              <div className="view_comments" onClick={() => showLess()}>
                view less
              </div>
            )}
          </>
        )}
      </div>
      {likeVisible && (
        <div className="reactionsBox">
          <span
            onClick={() => {
              setLikeVisible(false);
            }}
          >
            close
          </span>
          <div className="main_reacts_header">
            <span onClick={() => setFilterData()}>All reacts..{total}</span>
            {reacts.map((react) => (
              <>
                <div
                  className="div"
                  onClick={() => {
                    handleReact(react);
                  }}
                >
                  {react.count > 0 && (
                    <>
                      <span>{react.react}</span>
                    </>
                  )}
                </div>
              </>
            ))}
          </div>

          <div className="boxHeader">
            <>
              {filterdata ? (
                <>
                  {filterdata.users.slice(0, countReactSeperate).map((user) => {
                    return (
                      <>
                        <LikeProfiles user={user} />
                      </>
                    );
                  })}

                  {countReactSeperate < filterdata.count ? (
                    <span onClick={() => showmore("react")}>view more</span>
                  ) : ( (filterdata.count === 1) ? (
                    ""
                  ) : (
                    <span onClick={() => showLess("react")}>view less </span>
                  ))}
                </>
              ) : (
                <>
                  {allReactsUsers.slice(0, countReacts).map((user) => (
                    <LikeProfiles user={user} like={user.react} />
                  ))}
                  {countReacts < total ? (
                    <>
                      <span onClick={() => showmore("allReacts")}>
                        view more
                      </span>
                    </>
                  ) : total === 1 ? (
                    ""
                  ) : (
                    <span onClick={() => showLess("allReacts")}>view less</span>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      )}

      {showMenu && (
        <PostMenu
          userId={user.id}
          postUserId={post.user._id}
          imagesLength={post?.images?.length}
          setShowMenu={setShowMenu}
        />
      )}
    </div>
  );
}
