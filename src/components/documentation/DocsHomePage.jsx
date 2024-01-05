import React from "react";
const url = "https://public-client-guide.s3.us-west-1.amazonaws.com/Envision+Connect+2+Client+Guide+v1.2.pdf";
const DocsHomePage = () => {
  return <iframe src={`https://docs.google.com/viewer?url=${url}&embedded=true`} className="w-full h-full"></iframe>;
};

export default DocsHomePage;
