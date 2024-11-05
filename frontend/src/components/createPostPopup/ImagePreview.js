// import { useRef } from "react";
// import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
// import DangerousIcon from "@mui/icons-material/Dangerous";
// import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
// export default function ImagePreview({
//   text,
//   user,
//   setText,
//   images,
//   setImages,
//   setShowPrev,
//   setError,
// }) {
//   const imageInputRef = useRef(null);
//   const handleImages = (e) => {


//     let files = Array.from(e.target.files);
//     files.forEach((img) => {
//       if (
//         img.type !== "image/jpeg" &&
//         img.type !== "image/png" &&
//         img.type !== "image/webp" &&
//         img.type !== "image/gif"
//       ) {
//         setError(
//           `${img.name} format is unsupported ! only Jpeg, Png, Webp, Gif are allowed.`
//         );
//         files = files.filter((item) => item.name !== img.name);
//         return;
//       } else if (img.size > 1024 * 1024 * 5) {
//         setError(`${img.name} size is too large max 5mb allowed.`);
//         files = files.filter((item) => item.name !== img.name);
//         return;
//       } else {
//         const reader = new FileReader();
//         reader.readAsDataURL(img);
//         reader.onload = (readerEvent) => {
//           setImages((images) => [...images, readerEvent.target.result]);
//         };
//       }
//     });
//   };
//   return (
//     <div className="overflow_a scrollbar">
//       <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />
//       <div className="add_pics_wrap">
//         <input
//           type="file"
//           accept="image/jpeg,image/png,image/webp,image/gif"
//           multiple
//           hidden
//           ref={imageInputRef}
//           onChange={handleImages}
//         />
        
//         {images && images.length ? (
//           <div className="add_pics_inside1 p0">
//             <div className="preview_actions">
//               <button
//                 className="hover1"
//                 onClick={() => {
//                   imageInputRef.current.click();
//                 }}
//               >
//                 <AddAPhotoIcon />
//                 Add Photos
//               </button>
//             </div>
//             <div
//               className="small_white_circle"
//               onClick={() => {
//                 setImages([]);
//               }}
//             >
//               <DangerousIcon />
//             </div>
//             <div
//               className={
//                 images.length === 1
//                   ? "preview1"
//                   : images.length === 2
//                   ? "preview2"
//                   : images.length === 3
//                   ? "preview3"
//                   : images.length === 4
//                   ? "preview4 "
//                   : images.length === 5
//                   ? "preview5"
//                   : images.length % 2 === 0
//                   ? "preview6"
//                   : "preview6 singular_grid"
//               }
//             >
//               {images.map((img, i) => (
//                 <img src={img} key={i} alt="" />
//               ))}
//             </div>
//           </div>
//         ) : (
//           <div className="add_pics_inside1">
//             <div
//               className="small_white_circle"
//               onClick={() => {
//                 setShowPrev(false);
//               }}
//             >
//               <DangerousIcon />
//             </div>
//             <div
//               className="add_col"
//               onClick={() => {
//                 imageInputRef.current.click();
//               }}
//             >
//               <AddAPhotoIcon />
//               {/* <span>Add Photos</span> */}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// -------------------
import { useRef } from "react";
import EmojiPickerBackgrounds from "./EmojiPickerBackgrounds";
import DangerousIcon from "@mui/icons-material/Dangerous";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

export default function ImagePreview({
  text,
  user,
  setText,
  images,
  setImages,
  setShowPrev,
  setError,
}) {
  const imageInputRef = useRef(null);

  const handleImages = (e) => {
    // Convert FileList to an array for easier manipulation
    let files = Array.from(e.target.files);

    // Process each file
    files.forEach((img) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(img.type)) {
        setError(`${img.name} format is unsupported! Only JPEG, PNG, WebP, and GIF are allowed.`);
        files = files.filter((item) => item.name !== img.name);
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 1024 * 1024 * 5; // 5MB in bytes
      if (img.size > maxSize) {
        setError(`${img.name} size is too large. Max 5MB allowed.`);
        files = files.filter((item) => item.name !== img.name);
        return;
      }

      // Read the image file as a Data URL for preview
      const reader = new FileReader();
      reader.readAsDataURL(img);
      reader.onload = (readerEvent) => {
        setImages((prevImages) => [...prevImages, readerEvent.target.result]);
      };
    });
  };

  return (
    <div className="overflow_a scrollbar">
      <EmojiPickerBackgrounds text={text} user={user} setText={setText} type2 />
      <div className="add_pics_wrap">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          hidden
          ref={imageInputRef}
          onChange={handleImages}
        />

        {images && images.length ? (
          <div className="add_pics_inside1 p0">
            <div className="preview_actions">
              <button
                className="hover1"
                onClick={() => imageInputRef.current.click()}
              >
                <AddAPhotoIcon />
                Add Photos
              </button>
            </div>
            <div
              className="small_white_circle"
              onClick={() => setImages([])}
            >
              <DangerousIcon />
            </div>
            <div
              className={
                images.length === 1
                  ? "preview1"
                  : images.length === 2
                  ? "preview2"
                  : images.length === 3
                  ? "preview3"
                  : images.length === 4
                  ? "preview4"
                  : images.length === 5
                  ? "preview5"
                  : images.length % 2 === 0
                  ? "preview6"
                  : "preview6 singular_grid"
              }
            >
              {images.map((img, i) => (
                <img src={img} key={i} alt={`Uploaded preview ${i}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="add_pics_inside1">
            <div
              className="small_white_circle"
              onClick={() => setShowPrev(false)}
            >
              <DangerousIcon />
            </div>
            <div
              className="add_col"
              onClick={() => imageInputRef.current.click()}
            >
              <AddAPhotoIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
