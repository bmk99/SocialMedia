import axios from "axios";
import { paths } from "../routesEndPoint/paths";
export const uploadImages = async (formData,token) => {
// Assuming you have a FormData object `formData`
for (let [key, value] of formData.entries()) {
  console.log(`${key}: ${value}`);
}
  try {
    const { data } = await axios.post(paths.upload.uploadImages, formData, {

      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data", // it is important
      },
    });
    return data;
  } catch (error) {
    return error.response.data.message;
  }
};
