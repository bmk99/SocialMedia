import axios from "axios";
import { baseUrl } from "../routesEndPoint/paths";
export const getConversation = async (user) => {
  try {
    const { data } = await axios.get(`${baseUrl}/api1/getConversation/${user._id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const getAllMessages = async (currentChat, token) => {
  try {
    const { data } = await axios.get(`${baseUrl}/api1/getMessages/${currentChat?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  } catch (error) {
    return error;
  }
};

export const newMessage = async (inputs, token) => {
  try {
    const { data } = await axios.post(`${baseUrl}/api1/newMessage/`, inputs, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    return error;
  }
};

export const newConversation = async () => {
  try {
  } catch (error) {}
};
