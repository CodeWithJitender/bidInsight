import React from "react";
import { Link } from "react-router-dom";
import lock from "../../public/lock.png";
import NormalBtn from "./NormalBtn";


function Unlock({data}) {
  console.log(data)
  const { head, p, container, imgSize = "w-10", link } = data;
  return (
    <div className={`unlock-box flex  items-center gap-4 ${container}`}>
      <div className="img">
        <img src={lock} className={imgSize} alt="" />
      </div>
      <div className="text">
        <h1 className="font-archivo text-white text-p">{head}</h1>
        <p className="font-inter text-white text-lg mt-2">{p}</p>
      </div>
      <div className="bg-btn-diagonal border-white text-white rounded-2xl px-4 py-3">
        <NormalBtn text="Get Notified" btnFun={true} />
      </div>
    </div>
  );
}

export default Unlock;
