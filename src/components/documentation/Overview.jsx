import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Markdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";

const Overview = () => {
  const [data1, setData1] = useState("");
  const [data2, setData2] = useState("");
  const [data3, setData3] = useState("");
  const [data4, setData4] = useState("");

  useEffect(() => {
    fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part1.md")
      .then((res) => res.text())
      .then((data) => setData1(data));
    fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part2.md")
      .then((res) => res.text())
      .then((data) => setData2(data));
    fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part3.md")
      .then((res) => res.text())
      .then((data) => setData3(data));
    fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part4.md")
      .then((res) => res.text())
      .then((data) => setData4(data));
  }, []);

  // const data1 = useQuery({
  //   queryKey: ["overview"],
  //   queryFn: () => fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part1.md").then((res) => res.text()),
  // }).data;

  // const data2 = useQuery({
  //   queryKey: ["overview"],
  //   queryFn: () => fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part2.md").then((res) => res.text()),
  // }).data;

  // const data3 = useQuery({
  //   queryKey: ["overview"],
  //   queryFn: () => fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part3.md").then((res) => res.text()),
  // }).data;

  // const data4 = useQuery({
  //   queryKey: ["overview"],
  //   queryFn: () => fetch("https://public-client-guide.s3.us-west-1.amazonaws.com/part4.md").then((res) => res.text()),
  // }).data;

  return (
    <div className="my-20">
      <Container maxWidth="lg">
        <div className="grid gap-8">
          <div className="rounded shadow-sm bg-slate-50 p-4 grid">
            <Markdown>{data1}</Markdown>
          </div>
          <div className="rounded shadow-sm bg-slate-50 p-4 grid">
            <Markdown>{data2}</Markdown>
          </div>
          <div className="rounded shadow-sm bg-slate-50 p-4 grid">
            <Markdown>{data3}</Markdown>
          </div>
          <div className="rounded shadow-sm bg-slate-50 p-4 grid">
            <Markdown>{data4}</Markdown>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Overview;
