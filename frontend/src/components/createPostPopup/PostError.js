import React from "react";

export default function PostError({ error, setError }) {
  return (
    <div className="postError">
      <div className="postError_error">{error}</div>
      <button
        className="blue_btn"
        onClick={() => {
          setError("");
        }}
        // aria-label="Try again"
      >
        Try again
      </button>
    </div>
  );
}
