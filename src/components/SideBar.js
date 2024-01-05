import { useState, useEffect } from "react";
import { FaRegTrashAlt, FaMapSigns, FaRegFlag } from "react-icons/fa";
import { HiQueueList, HiTicket } from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { BiCodeCurly, BiSearchAlt } from "react-icons/bi";
import { AiOutlineHome, AiOutlineFolderOpen } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useUserRole } from "./UserContext";
import DataArrayIcon from "@mui/icons-material/DataArray";
import DocsSidebar from "./ui/DocsSidebar";
import { useLocation } from "react-router-dom";
const SideBar = () => {
  const location = useLocation();
  const [isDev, setIsDev] = useState(false);
  const role = useUserRole();
  useEffect(() => {
    setIsDev(role === "developer");
  }, [role]);

  //function that listens for path changes detects if we're in the /docs* path and returns a boolean
  const isDocs = () => {
    const path = location.pathname;
    return path.includes("/docs");
  };

  return (
    <div className="flex flex-start sticky top-0 left-0 min-h-screen h-full">
      <div className=" min-w-[64px]  w-16 m-0 flex flex-col bg-gray-900 text-white shadow-md gap-16 z-50">
        <div className="mt-5">
          <SideBarIcon icon={<AiOutlineHome size="28" />} text="Home" route="/" />
          <SideBarIcon icon={<FaRegTrashAlt size="28" />} text="Bulk Closer" route="/bulkCloser" />
          <SideBarIcon icon={<HiQueueList size="28" />} text="Queue Reader" route="/queueReader" />
          <SideBarIcon icon={<FaMapSigns size="28" />} text="Group Mappings" route="/groupMapping" />
          {isDev && (
            <>
              <SideBarIcon icon={<HiTicket size="28" />} text="Ticket Generator" route="/ticketGenerator" />
              <SideBarIcon icon={<BiCodeCurly size="28" />} text="Mapping Object" route="/mappingGenerator" />
              <SideBarIcon icon={<DataArrayIcon size="25" />} text="Group Mapper" route="/groupmapper" />
              <SideBarIcon icon={<BiSearchAlt size="28" />} text="Group Finder" route="/groupfinder" />
              <SideBarIcon icon={<FaRegFlag size="25" />} text="Flags" route="/flags" />
            </>
          )}
          <SideBarIcon icon={<AiOutlineFolderOpen size="28" />} text="Files" route="/files" />
        </div>
        <div className="logout">
          <SideBarIcon icon={<FiLogOut size="28" />} text="Sign Out" signOut={true} />
        </div>
      </div>
      {
        //if we're in the /docs* path, render the docs sidebar
        isDocs() && <DocsSidebar />
      }
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
