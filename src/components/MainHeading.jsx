import React from "react";
import TextAnimation1 from "../components/ExtraAnimation/TextAnimation1";
import TextAnimation2 from "../components/ExtraAnimation/TextAnimation2";

function MainHeading({ heading, pera, cl, tColor,animeStart="50", animeEnd="60" }) {
  return (
    <div className="pb-5 px-5">
      <div className={`main-heading m-auto ${cl}`}>
          <h2
            className={`${tColor} font-bold overflow-hidden audiowide-regular mb-[.5vh]`}
            style={{ fontSize:  window.innerWidth > 600 ? "clamp(20px, 20vw, 48px)" : "clamp(16px, 6vw, 32px)" }}
          >
        <TextAnimation1 animeStart={animeStart} animeEnd={animeEnd}>
            {heading ? heading : " "}
        </TextAnimation1>
          </h2>
          {pera && (
            <p className={`md:text-[21px] text-[12px] ${tColor} overflow-hidden font-normal raleway`}>
            <TextAnimation1 animeStart={animeStart}>
                {pera ? pera : " "}
            </TextAnimation1>
              </p>
          )}
      </div>
    </div>
  );
}

export default MainHeading;