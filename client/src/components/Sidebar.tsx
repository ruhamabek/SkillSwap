import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <>
      <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
        <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
          <div>
            <NavLink
              className={({ isActive }) =>
                `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                  isActive && "bg-slate-200"
                }`
              }
              title="chat"
              to="/chat"
            >
              💬
            </NavLink>

            <div
              title="add friend"
              className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            >
              ➕
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="h-16 flex items-center">
            <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
