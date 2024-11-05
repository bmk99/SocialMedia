import {
  POST_SUCCESS,
  POST_ERROR,
  POST_REQUEST,
  PHOTOS_REQUEST,
  PHOTOS_SUCCESS,
  PHOTOS_ERROR,
  PROFILE_ERROR,
  PROFILE_REQUEST,
  PROFILE_SUCCESS,
  FRIENDS_ERROR,
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  REACTS_REQUEST,
  REACTS_SUCCESS,
  REACTS_ERROR,
  REACTS_POST,
  COMMENT_REACT_ERROR,
  COMMENT_REACT_REQUEST,
  COMMENT_REACT_POST,
  COMMENT_REACT_SUCCESS,
} from "./actionTypes";

export const post_request = () => {
  return {
    type: POST_REQUEST,
  };
};

export const post_success = (data) => {
  return {
    type: POST_SUCCESS,
    payload: data,
  };
};

export const post_error = (error) => {
  return {
    type: POST_ERROR,
    payload: error,
  };
};

// POST REACTIONS
export const reacts_request = () => {
  return {
    type: REACTS_REQUEST,
  };
};

export const reacts_success = (data) => {
  return {
    type: REACTS_SUCCESS,
    payload: data,
  };
};
export const reacts_error = (error) => {
  console.log(error);
  return {
    type: REACTS_ERROR,
    payload: error,
  };
};

export const reacts_post = (data) => {
  console.log();
  return {
    type: REACTS_POST,
    payload: data,
  };
};

//  COMMENTS REACTIONS
export const comment_react_request = () => {
  return {
    type: COMMENT_REACT_REQUEST,
  };
};

export const comment_react_success = (data) => {
  return {
    type: COMMENT_REACT_SUCCESS,
    payload: data,
  };
};
export const comment_react_error = (error) => {
  return {
    type: COMMENT_REACT_ERROR,
    payload: error,
  };
};
