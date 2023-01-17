import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Link } from "react-router-dom";
const Home = () => {
    const [fact, setFact] = useState("");

    useEffect(() => {
        fetch("https://uselessfacts.jsph.pl/random.json?language=en")
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
                        <p className="font-semibold">{fact}</p>
                    </div>
                </CardContent>
            </Card>
            <div className="flex justify-center gap-3">
                <Link to="/bulkCloser">
                    <button className="btn btn-primary">Ticket Closer</button>
                </Link>
                <Link to="queueReader">
                    {" "}
                    <button className="btn btn-primary">Queue Reader</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
