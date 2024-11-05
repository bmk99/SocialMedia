import axios from "axios";
import { paths } from "../routesEndPoint/paths";

//  POSTS \\

export const allPosts = async (token) => {
  try {
    const { data } = await axios.get(paths.post.getAllPosts, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { data };
  } catch (error) {
    return error;
  }
};
export const createPost = async (
  type,
  background,
  text,
  images,
  user,
  token
) => {
  try {
    const { data } = await axios.post(
      paths.post.create,
      {
        type,
        background,
        text,
        images,
        user,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.response.data.message;
  }
};

//  REACTS \\

export const reactPost = async (postRef, react, token) => {
  try {
    const { data } = await axios.put(
      paths.reactions.reactPost,
      {
        postRef,
        react,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error.response.data.message;
  }
};

export const getReacts = async (postId, token) => {
  try {
    const { data } = await axios.get(
      `${paths.reactions.getReacts}/${postId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(data);
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

// COMMENTS \\
// export const comment = async (postId, comment, image, token) => {
//   try {
//     const { data } = await axios.put(
//       'api1/comment',
//       {
//         postId, comment, image
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     return data;
//   } catch (error) {
//     return error.response.data.message;
//   }
// };

export const getComments = async (postId, token) => {
  try {
    const { data } = await axios.get(
      `${paths.comments.getComments}/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};

export const postComments = async (
  postRef,
  comment,
  image,
  token,
  parentID
) => {
  // console.log(postRef);
  console.log({ parentID });
  try {
    const { data } = await axios.post(
      `${paths.comments.postComment}`,
      { postRef, comment, image, parentID },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const commentReact = async (commentId, react, token) => {
  try {
    const data = await axios.put(
      `${paths.commentReaction.commentReact}`,
      { commentId, react },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};

export const editComment = async (commentId, text, image, token) => {
  try {
    const data = await axios.put(
      `${paths.commentReaction.editComment}`,
      { commentId, text, image },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export const deleteComment = async (commentId, token) => {
  try {
    const data = await axios.delete(
      `${paths.commentReaction.deleteComment}/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return "ok";
  } catch (error) {
    return error.data.message;
  }
};
