import { useState, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DownloadIcon from "@mui/icons-material/Download";
import IconButton from "@mui/material/IconButton";
import pdf from "../assets/pdf.png";
import word from "../assets/word.png";
import document from "../assets/document.png";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
const Files = () => {
  const [folders, setFolders] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      fetch(`${process.env.REACT_APP_API_ENDPOINT}/files`, {
        headers: {
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFolders(processFileList(data.Contents));
        })
        .finally(() => {
          setLoading(false);
        });
    };
    fetchFiles();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-12 min-w-[700px] max-w-[1000px] mx-auto">
        <Skeleton variant="rounded" className="w-full" height={60} />
        <Skeleton variant="rounded" className="w-full" height={60} />
        <Skeleton variant="rounded" className="w-full" height={60} />
        <Skeleton variant="rounded" className="w-full" height={60} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-12 min-w-[700px] max-w-[1000px] mx-auto">
      {Object.entries(folders).map(([key, value], index) => {
        return <File folderName={key} files={value} key={index} />;
      })}
    </div>
  );
};

const processFileList = (files) => {
  //separate files into folders and files
  const result = {};
  for (let file of files) {
    let path = file.Key.split("/");
    if (path.length === 1 || path.length == 2) continue;
    else {
      if (!result[path[1]]) result[path[1]] = [];
      else {
        result[path[1]] = [...result[path[1]], path[2]];
      }
    }
  }

  console.log(result);
  return result;
};

const File = ({ folderName, files }) => {
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  //make folder name proper case
  const downloadFile = async (file) => {
    let url = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/files?folder=${folderName}&file=${file}`, {
      headers: {
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data.url;
      })
      .catch((err) => {
        console.log(err);
        setOpen(true);
      });

    if (url) {
      window.open(url, "_blank");
    } else {
      setOpen(true);
    }
  };

  const getIcon = (file) => {
    const extension = file.split(".").at(-1);
    switch (extension) {
      case "pdf":
        return pdf;
      case "docx":
        return word;
      default:
        return document;
    }
  };

  return (
    <div className="w-full">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <div className="flex gap-4 items-center">
            <FolderOpenIcon className="text-slate-400" fontSize="large" />{" "}
            <h2 className="text-slate-600 font-bold text-2xl">
              {folderName.charAt(0).toUpperCase() + folderName.slice(1)}
            </h2>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {files.map((file) => {
              return (
                <ListItem
                  className="hover:bg-slate-100 transition-all duration-300"
                  key={file}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        downloadFile(file);
                      }}
                    >
                      <DownloadIcon className="text-emerald-400" />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    <img src={getIcon(file)} alt="pdf" className="w-6 h-6" />
                  </ListItemIcon>
                  <ListItemText
                    primary={file}
                    className="text-slate-500"
                    primaryTypographyProps={{ fontWeight: "600" }}
                  />
                </ListItem>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Something went wrong!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Files;
