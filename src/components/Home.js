import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";
import { FaRegTrashAlt, FaMapSigns } from "react-icons/fa";
import { HiQueueList, HiTicket } from "react-icons/hi2";
import { BiCodeCurly } from "react-icons/bi";
import Skeleton from "@mui/material/Skeleton";

const Home = () => {
    const [fact, setFact] = useState("");

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
                        {fact ? (
                            <p className="font-semibold">{fact}</p>
                        ) : (
                            <Skeleton variant="rounded" width={350} height={50} />
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-center gap-3">
                <Link to="/bulkCloser">
                    <button className="btn btn-primary">
                        <FaRegTrashAlt size="28" className="mr-3" />
                        Ticket Closer
                    </button>
                </Link>
                <Link to="queueReader">
                    <button className="btn btn-primary">
                        {" "}
                        <HiQueueList size="28" className="mr-3" />
                        Queue Reader
                    </button>
                </Link>
                <Link to="groupMapping">
                    <button className="btn btn-primary">
                        {" "}
                        <FaMapSigns size="28" className="mr-3" />
                        Group Mapping
                    </button>
                </Link>
                <Link to="ticketGenerator">
                    <button className="btn btn-primary">
                        {" "}
                        <HiTicket size="28" className="mr-3" />
                        Ticket Generator
                    </button>
                </Link>
                <Link to="mappingGenerator">
                    <button className="btn btn-primary">
                        {" "}
                        <BiCodeCurly size="28" className="mr-3" />
                        Mapping Object
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
