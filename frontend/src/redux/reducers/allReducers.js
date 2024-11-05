import { func } from "prop-types";
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
  REACTS_ERROR,
  REACTS_REQUEST,
  REACTS_SUCCESS,
  REACTS_POST,
  COMMENT_REACT_ERROR,
  COMMENT_REACT_REQUEST,
  COMMENT_REACT_SUCCESS,
} from "../actions/actionTypes";

export function postsReducer(state, action) {
  switch (action.type) {
    case POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };

    case POST_SUCCESS:
      return {
        ...state,
        posts: action.payload,
        loading: false,
        error: "",
      };
    case POST_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    default:
      return state;
  }
}

export function reactsReducer(state, action) {
  switch (action.type) {
    case REACTS_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    // case REACTS_POST:
    //   return{

    //   }
    case REACTS_SUCCESS:
      return {
        ...state,
        loading: false,
        dataReacts: action.payload,
        error: "",
      };
    case REACTS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

export function profileReducer(state, action) {
  switch (action.type) {
    case PROFILE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.payload,
        error: "",
      };
    case PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function photosReducer(state, action) {
  switch (action.type) {
    case PHOTOS_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case PHOTOS_SUCCESS:
      return {
        ...state,
        loading: false,
        photos: action.payload,
        error: "",
      };
    case PHOTOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function friendspage(state, action) {
  // console.log(state)
  switch (action.type) {
    case FRIENDS_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FRIENDS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: "",
      };
    case FRIENDS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}

export function commentReactReducer(state, action) {
  switch (action.type) {
    case COMMENT_REACT_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case COMMENT_REACT_SUCCESS:
      return {
        ...state,
        payload: action.payload,
        loading: false,
      };
    case COMMENT_REACT_ERROR:
      return {
        ...state,
        payload: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
