import PhotoSizeSelectActualIcon from '@mui/icons-material/PhotoSizeSelectActual';

export default function AddToYourPost({ setShowPrev }) {
  return (
    <div className="add-to-your-post">
      <button
        className="add-to-post-button hover1"
        onClick={() => setShowPrev(true)}
        aria-label="Add Photo to Your Post"
      >
        <PhotoSizeSelectActualIcon />
      </button>
    </div>
  );
}
