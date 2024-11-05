const reactionsArray = [
  {
    name: "like",
    image: "../../../reacts/like.gif",
  },
  {
    name: "love",
    image: "../../../reacts/love.gif",
  },
  {
    name: "haha",
    image: "../../../reacts/haha.gif",
  },
  {
    name: "wow",
    image: "../../../reacts/wow.gif",
  },
  {
    name: "sad",
    image: "../../../reacts/sad.gif",
  },
  {
    name: "angry",
    image: "../../../reacts/angry.gif",
  },
];
export default function ReactsPopup({ visible, setVisible, reactHandler }) {
  return (
    <>
      {visible && (
        <div
          className="reacts_popup"
          onMouseOver={() => {
            setTimeout(() => {
              setVisible(true);
            }, 300);
          }}
          onMouseLeave={() => {
            setTimeout(() => {
              setVisible(false);
            }, 0);
          }}
        >
          {reactionsArray.map((reaction, i) => (
            <div
              className="react"
              key={i}
              onClick={() =>{
                reactHandler(reaction.name)
                setTimeout(()=>{

                  setVisible(false)
                },30)
              } 
              }
            >
              <img src={reaction.image} alt="" />
            </div>
          ))}
        </div>
      )}
    </>
  );
}
