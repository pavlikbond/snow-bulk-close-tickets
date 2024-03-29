import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaMapSigns, FaRegFlag } from "react-icons/fa";
import { HiQueueList, HiTicket } from "react-icons/hi2";
import { BiCodeCurly, BiSearchAlt } from "react-icons/bi";
import Skeleton from "@mui/material/Skeleton";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useUserRole } from "./UserContext";
import DataArrayIcon from "@mui/icons-material/DataArray";
import UsefulLink from "./ui/UsefulLink";
const buttonStyle =
  "w-64 bg-cyan-500 duration-200 text-white font-semibold text-xl flex items-center px-4 py-4 rounded shadow";
const Home = ({ data }) => {
  const [usefulLinks, setUsefulLinks] = useState([]);
  const [fact, setFact] = useState("");
  const role = useUserRole();
  const [isDev, setIsDev] = useState(false);
  useEffect(() => {
    setIsDev(role === "developer");
  }, [role]);

  useEffect(() => {
    if (data.length) {
      setUsefulLinks(data);
    }
  }, [data]);

  useEffect(() => {
    fetch("https://uselessfacts.jsph.pl/api/v2/facts/random?language=en")
      .then((result) => result.json())
      .then((result) => {
        setFact(result.text);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="w-full p-10">
      <h1 className="text-center text-slate-700">Envision Connect Tools</h1>
      <Card sx={{ minWidth: 275, maxWidth: "50%", margin: "25px auto" }}>
        <CardContent>
          <div className="container">
            <h2 className="font-bold text-2xl my-2">Random Fact</h2>
            {fact ? <p className="font-semibold">{fact}</p> : <Skeleton variant="rounded" width={350} height={50} />}
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3 w-fit mx-auto">
        <Link to="/bulkCloser">
          <button className={buttonStyle}>
            <FaRegTrashAlt size="28" className="mr-3" />
            Ticket Closer
          </button>
        </Link>
        <Link to="queueReader">
          <button className={buttonStyle}>
            {" "}
            <HiQueueList size="28" className="mr-3" />
            Queue Reader
          </button>
        </Link>
        <Link to="groupMapping">
          <button className={buttonStyle}>
            {" "}
            <FaMapSigns size="28" className="mr-3" />
            Group Mapping
          </button>
        </Link>
        {isDev && (
          <>
            <Link to="ticketGenerator">
              <button className={buttonStyle}>
                {" "}
                <HiTicket size="28" className="mr-3" />
                Ticket Generator
              </button>
            </Link>
            <Link to="mappingGenerator">
              <button className={buttonStyle}>
                {" "}
                <BiCodeCurly size="28" className="mr-3" />
                Mapping Object
              </button>
            </Link>
            <Link to="groupmapper">
              <button className={buttonStyle}>
                {" "}
                <DataArrayIcon size="25" className="mr-3" />
                Group Mapper
              </button>
            </Link>
            <Link to="groupfinder">
              <button className={buttonStyle}>
                {" "}
                <BiSearchAlt size="28" className="mr-3" />
                Group Finder
              </button>
            </Link>
            <Link to="flags">
              <button className={buttonStyle}>
                {" "}
                <FaRegFlag size="25" className="mr-3" />
                Flags
              </button>
            </Link>
          </>
        )}
        <Link to="files">
          <button className={buttonStyle}>
            {" "}
            <AiOutlineFolderOpen size="28" className="mr-3" />
            Files
          </button>
        </Link>
      </div>
      <div className="container max-w-3xl mx-auto my-10">
        <p className="text-3xl font-bold text-center mb-4">Useful Links</p>
        <div className="grid grid-cols-1 divide-y-4">
          {usefulLinks.map((link, index) => (
            <UsefulLink key={index} link={link.url} name={link.name} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
