export const baseUrl = process.env.REACT_APP_BACKEND_URL;


export const paths = {
  auth: {
    login: `${baseUrl}/api1/login`,
    register: `${baseUrl}/api1/register`,
  },
  post: {
    create: `${baseUrl}/api1/createPost`,
    getAllPosts: `${baseUrl}//api1/getAllposts`,
  },
  reactions: {
    reactPost: `${baseUrl}//api1/postReact`,
    getReacts: `${baseUrl}//api1/getReacts`,
  },
  comments: {
    postComment: `${baseUrl}/api1/postComment`,
    getComments :`${baseUrl}/api1/getComments/`
  },
  user: {
    updateProfile: `${baseUrl}/api1/updateProfilePicture`,
    updateCover: `${baseUrl}/api1/updateCover`,
    getProfile :``
  },
  friends: {
    getFriends: `${baseUrl}/api1/getFriendsPageInfos`,
    addFriend: `${baseUrl}/api1/addFriend`,
    canceLRequest: `${baseUrl}/api1/cancelRequest`,
    acceptRequest: `${baseUrl}/api1/acceptRequest`,
    unfollow: `${baseUrl}/api1/unfollow`,
    follow: `${baseUrl}/api1/follow`,
    unFriend: `${baseUrl}/api1/unfriend`,
    deleteRequest: `${baseUrl}/api1/deleteRequest`,
  },
  search: {
    searching: ``,
    addToSearchHistory: ``,
    getSearchHistory: ``,
    removeFromSearch: ``,
  },
  messenger: {
    getConversations:``,
    
    
  },
  upload: {
    uploadImages: `${baseUrl}/api1/uploadImages`,
  },
  commentReaction:{
    commentReact : `${baseUrl}/api1/reactComment`,
    editComment :`${baseUrl}/api1/editComment`,
    deleteComment:`${baseUrl}/api1/deleteComment`
  }
};
