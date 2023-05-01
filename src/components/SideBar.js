import React from "react";
import { FaRegTrashAlt, FaMapSigns } from "react-icons/fa";
import { HiQueueList, HiTicket } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { BiCodeCurly } from "react-icons/bi";
import { AiOutlineHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";

const SideBar = () => {
  return (
    <div className="sticky top-0 left-0 min-w-[64px] min-h-screen h-full w-16 m-0 flex flex-col bg-gray-900 text-white shadow-md gap-16 z-50">
      <div className="mt-5">
        <SideBarIcon icon={<AiOutlineHome size="28" />} text="Home" route="/" />
        <SideBarIcon icon={<FaRegTrashAlt size="28" />} text="Bulk Closer" route="/bulkCloser" />
        <SideBarIcon icon={<HiQueueList size="28" />} text="Queue Reader" route="/queueReader" />
        <SideBarIcon icon={<FaMapSigns size="28" />} text="Group Mappings" route="/groupMapping" />
        <SideBarIcon icon={<HiTicket size="28" />} text="Ticket Generator" route="/ticketGenerator" />
        <SideBarIcon icon={<BiCodeCurly size="28" />} text="Mapping Object" route="/mappingGenerator" />
      </div>
      <div className="logout">
        <SideBarIcon icon={<FiLogOut size="28" />} text="Sign Out" signOut={true} />
      </div>
    </div>
  );
};

const SideBarIcon = ({ icon, text, route, signOut = false }) => {
  let logOff = async () => {
    //console.log(signOut);
    if (signOut) {
      try {
        await Auth.signOut();
      } catch (error) {
        console.log("error signing out: ", error);
      }
    }
  };

  return (
    <Link to={route} onClick={() => logOff()}>
      <div className="sidebar-icon group">
        {icon} <span className="sidebar-tooltip group-hover:scale-100 z-50">{text}</span>
      </div>
    </Link>
  );
};
export default SideBar;
