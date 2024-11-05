export default function dataURItoBlob(dataURI) {
  // Convert base64 or URL-encoded data component to raw binary data
  const byteString = dataURI.split(",")[0].indexOf("base64") >= 0 
    ? atob(dataURI.split(",")[1]) 
    : decodeURIComponent(dataURI.split(",")[1]);

  // Separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // Convert byte string to an array buffer
  const uint8Array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  

  // Create and return the Blob
  return new Blob([uint8Array], { type: mimeString });
}













// -----------old way
// export default function dataURItoBlob(dataURI) {
//   // Convert base64/URLEncoded data component to raw binary data held in a string
//   let byteString;
//   if (dataURI.split(",")[0].indexOf("base64") >= 0) {
//     byteString = atob(dataURI.split(",")[1]);
//   } else {
//     byteString = unescape(dataURI.split(",")[1]);
//   }

//   // Separate out the mime component
//   const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

//   // Create an ArrayBuffer and a typed array (Uint8Array) from the binary string
//   const arrayBuffer = new ArrayBuffer(byteString.length);
//   const uint8Array = new Uint8Array(arrayBuffer);

//   // Write the bytes of the string to the typed array
//   for (let i = 0; i < byteString.length; i++) {
//     uint8Array[i] = byteString.charCodeAt(i);
//   }

//   // Create and return the Blob
//   return new Blob([uint8Array], { type: mimeString });
// }
