import { useState } from "react";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const DocsSidebar = () => {
  const [open, setOpen] = useState({ 2: true, 3: true });

  const handleClick = (index) => {
    setOpen((prevOpen) => ({ ...prevOpen, [index]: !prevOpen[index] }));
  };

  const typography = {
    style: { fontWeight: 600, color: "rgb(100 116 139)", fontSize: "14px" },
  };
  return (
    <Box sx={{ width: "100%", maxWidth: 240, bgcolor: "background.paper" }}>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      >
        {links.map((link, index) => {
          if (link.sublinks) {
            return (
              <div key={index}>
                <ListItemButton onClick={() => handleClick(index)}>
                  <ListItemText primaryTypographyProps={typography} primary={link.name} />
                  {open[index] ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={open[index]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {link.sublinks.map((sublink, index) => (
                      <ListItemButton key={index} sx={{ pl: 4 }}>
                        <Link className="w-full " to={sublink.path}>
                          <ListItemText primaryTypographyProps={typography} primary={sublink.name} />
                        </Link>
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </div>
            );
          } else {
            return (
              <ListItemButton key={index}>
                <Link className="w-full" to={link.path}>
                  <ListItemText primaryTypographyProps={typography} primary={link.name} />
                </Link>
              </ListItemButton>
            );
          }
        })}
      </List>
    </Box>
  );
};

const links = [
  {
    name: "Home",
    path: "/docs",
  },
  {
    name: "Overview",
    path: "/docs/overview",
  },
  {
    name: "Incident/Request",
    path: "/docs/incident-request",
    sublinks: [
      {
        name: "Create",
        path: "/docs/incident-request/create",
      },
      {
        name: "Update",
        path: "/docs/incident-request/update",
      },
      {
        name: "Comments",
        path: "/docs/incident-request/comments",
      },
      {
        name: "Return PTN",
        path: "/docs/incident-request/return-ptn",
      },
      {
        name: "Queue Responses",
        path: "/docs/incident-request/queue",
      },
    ],
  },
  {
    name: "Change",
    path: "/docs/change",
    sublinks: [
      {
        name: "Aprrove/Reject",
        path: "/docs/change/approve-reject",
      },
      {
        name: "Comments",
        path: "/docs/change/comments",
      },
      {
        name: "Return PTN",
        path: "/docs/change/return-ptn",
      },
      {
        name: "Queue Responses",
        path: "/docs/change/queue",
      },
    ],
  },
  {
    name: "Delete from Queue",
    path: "/docs/delete-from-queue",
  },
  {
    name: "Get Ticket Details",
    path: "/docs/get-ticket-details",
  },
  {
    name: "Echo",
    path: "/docs/echo",
  },
];
export default DocsSidebar;
