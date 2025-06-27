import React from "react";
import { Link } from "react-router-dom";

function FormFooter({ data = {} }) {
  const back = data?.back;
  const next = data?.next;

  return (
    <div className="flex flex-col gap-4 mt-2 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <div className="flex flex-wrap justify-center md:justify-start gap-9 w-full md:w-auto">
          {/* Back button */}
          {back?.link && (
            <Link
              to={back.link}
              className="rounded-[20px] text-white text-lg px-[2.2rem] py-3 font-h border border-white transition-all duration-300 hover:bg-white hover:text-[#273BE2]"
            >
              {back.text}
            </Link>
          )}

          {/* Submit button */}
          {next && (
            <button
              type="submit"
              className="rounded-[20px] bg-[#273BE2] text-white text-lg px-14 py-3 font-h transition-all duration-300 hover:bg-[#1e2fb8]"
            >
              {next.text}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FormFooter;
