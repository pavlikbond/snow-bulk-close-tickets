import MenuItem from "@mui/material/MenuItem";
import { useState, useEffect } from "react";
import FlagIcon from "@mui/icons-material/Flag";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Link from "@mui/material/Link";

const FlagFinder = ({ data }) => {
  const [allFlags, setAllFlags] = useState({});
  const [selectedFlag, setSelectedFlag] = useState(null);
  const [selectedFlagName, setSelectedFlagName] = useState(null);
  const [loading, setLoading] = useState(true);
  let flags = {};

  const valueValidator = (value) => {
    if (typeof value === "object") {
      return "Object";
    } else if (typeof value === "string") {
      return value;
    } else if (typeof value === "number") {
      return value;
    } else if (typeof value === "boolean") {
      return value.toString();
    }
  };

  useEffect(() => {
    if (data.length) {
      for (let item of data) {
        for (let envItem of item?.tableData) {
          for (let mapping of envItem?.mappings) {
            for (let name of Object.keys(mapping.mapping)) {
              const tempObj = {
                client: item.name,
                environment: envItem.environment,
                table: envItem.tableName,
                company: mapping.Company,
                APIKeyId: item.APIKeyId,
                value: valueValidator(mapping.mapping[name]),
              };
              //add to flags if unique
              if (!flags[name]) {
                flags[name] = [tempObj];
              } else {
                flags[name] = [...flags[name], tempObj];
              }
            }
          }
        }
      }
      console.log(flags);
      //alphabetize flags by key name ignoring case
      flags = Object.keys(flags)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
        .reduce((acc, key) => {
          acc[key] = flags[key];
          return acc;
        }, {});

      setAllFlags(flags);
      setSelectedFlag(flags[Object.keys(flags)[0]]);
      setSelectedFlagName(Object.keys(flags)[0]);
      setLoading(false);
    }
  }, [data]);

  if (loading) {
    return (
      <Box className="m-auto">
        {Array.from(Array(18).keys()).map((skeleton, index) => {
          return <Skeleton key={index} animation="wave" variant="rounded" width={550} height={35} sx={{ mb: 0.5 }} />;
        })}
      </Box>
    );
  }

  return (
    <div className="mx-auto my-12">
      <div className="flex gap-4 items-start">
        <div className="grid gap-3 w-fit">
          <h3 className="font-semibold text-2xl flex items-center gap-2 justify-center">
            <FlagIcon />
            Flags
          </h3>
          <div className="rounded shadow bg-slate-50">
            {Object.keys(allFlags).map((flag) => {
              return (
                <MenuItem
                  key={flag}
                  onClick={() => {
                    setSelectedFlag(allFlags[flag]);
                    setSelectedFlagName(flag);
                  }}
                  selected={selectedFlagName === flag}
                >
                  {flag}
                </MenuItem>
              );
            })}
          </div>
        </div>
        {selectedFlag && (
          <div className="w-[1100px]">
            <FlagInfo flag={flagInfoData.find((flag) => flag.name === selectedFlagName)} />
            <FlagTable flag={selectedFlag} flagName={selectedFlagName} />
          </div>
        )}
      </div>
    </div>
  );
};

const FlagTable = ({ flag, flagName }) => {
  return (
    <div className="overflow-x-auto w-full">
      <h2 className="text-center text-xl py-1 text-white font-semibold bg-slate-600">{flagName}</h2>
      <table className="table table-compact w-full min-w-[800px] table-auto">
        <thead>
          <tr>
            <th className="w-12"></th>
            <th className="pl-5 ">Client</th>
            <th className="pr-5 ">Company</th>
            <th className="pr-5 ">Value</th>
            <th className="pr-5 ">Table Name</th>
          </tr>
        </thead>
        <tbody>
          {flag.map((each, index) => {
            return (
              <tr key={index} className="hover">
                <td className="text-ellipsis text-slate-700">{index + 1}</td>
                <td className="text-ellipsis overflow-hidden whitespace-nowrap text-slate-700 font-semibold pl-5 ">
                  {each.client}
                </td>
                <td className="text-ellipsis overflow-hidden whitespace-nowrap text-slate-700 font-semibold pl-5">
                  {each.company}
                </td>
                <td className="text-ellipsis overflow-hidden whitespace-nowrap text-slate-700 font-semibold pr-5">
                  {each.value}
                </td>
                <td className="text-ellipsis overflow-hidden whitespace-nowrap text-slate-700 font-semibold">
                  <Link
                    href={`https://us-west-1.console.aws.amazon.com/dynamodbv2/home?region=us-west-1#edit-item?itemMode=2&pk=${each.APIKeyId}&route=ROUTE_ITEM_EXPLORER&sk=&table=${each.table}`}
                    rel="noopener"
                    target="_blank"
                  >
                    {each.table}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const FlagInfo = ({ flag }) => {
  if (!flag)
    return (
      <div className="rounded shadow bg-yellow-50 p-6 my-6 w-full font-semibold text-slate-600 text-lg">
        No info available
      </div>
    );
  return (
    <div className="rounded shadow bg-emerald-50 p-6 my-6 grid w-full text-slate-600 gap-1 divide-y">
      {Object.keys(flag).map((key) => {
        return (
          <div key={key} className="flex gap-2">
            <div className="flex-1 font-semibold">{key.toUpperCase()}</div>
            <div className="flex-[7]">{flag[key]}</div>
          </div>
        );
      })}
    </div>
  );
};

const flagInfoData = [
  {
    name: "account",
    description: "Company name as it appears in ServiceNow. Used for validating incoming client requests",
    type: "String",
    required: "true",
    default: "N/A",
  },
  {
    name: "sysid",
    description: "System id for the company.",
    type: "String",
    required: "true",
    default: "N/A",
  },
  {
    name: "contact",
    description:
      "Sys id for the default contact which gets set up when client is created in the system. Email can be used sometimes but can cause issues because sometimes there’s multiple accounts with the same default email.",
    type: "String",
    required: "true",
    default: "N/A",
  },
  {
    name: "collisionDetection",
    description:
      "If true, will remove fields from client update payloads if there’s an update currently in the queue for that field.",
    type: "Boolean",
    required: "false",
    default: "false",
  },
  {
    name: "contactLookup",
    description:
      "True will try to find the contact based on the payload.contactEmail that was sent, if no match it found it defaults to mapping.contact. This can be enabled separately from automatic creation.",
    type: "Boolean",
    required: "false",
    default: "true",
  },
  {
    name: "contactCreation",
    description:
      "True will (if no match is found from above) package up the relevant info and pass it to the HandOffQueue after ticket creation.",
    type: "Boolean",
    required: "false",
    default: "false",
  },
  {
    name: "convertChangeTypeToNormal",
    description:
      "Will convert “Complex” change type to “Normal.” This was only needed for Verisk and shouldn’t need to be used for anyone else.",
    type: "Boolean",
    required: "false",
    default: "N/A",
  },
  {
    name: "convertToLegacyFormat",
    description:
      "This flag is mainly used for sending v1 error messages back to the client, replacing “Case” with “Incident” etc. Should be true for all Combo clients, false for new v2 clients.",
    type: "Boolean",
    required: "false",
    default: "true",
  },
  {
    name: "overrideClientNumWithRefNum",
    description:
      "When true, the clientNumber field will be overridden with the referenceNumber field for Normal changes when the initial create payload is sent. This is specifically used for Trustmark and should not be set for any other client.",
    type: "Boolean",
    required: "false",
    default: "N/A",
  },
  {
    name: "preventReopen",
    description:
      "When set to true, any updates that Ensono sends after reopening a ticket will go to the queue as a comment. It will also prevent a client from reopening a resolved Ensono ticket. If set to false, updates will come as normal. Can also be an array with specific modules for which 'preventReopen' is true, for example ['Request'], or ['Incident']",
    type: "Boolean or Array of Strings",
    required: "false",
    default: "false",
  },
  {
    name: "removeEPrefix",
    description:
      "Removes the “e-“ from the Ensono ticket number. Should almost always be false, unless specifically requested by client.",
    type: "Boolean",
    required: "false",
    default: "false",
  },
  {
    name: "simpleInboundPriority",
    description:
      "If true, the Lambda will read the payload priority coming from the client. If false, it will read the impact and urgency fields instead. Should be true for Combo clients, false for new v2 clients.",
    type: "Boolean",
    required: "false",
    default: "true",
  },
  {
    name: "multipleQueueRead",
    description:
      "Returns more than 10 messages in a single queue read in multiples of 10. Needs to be placed in the first mapping object in mappings array.",
    type: "Integer",
    required: "false",
    default: "1",
  },
  {
    name: "convertServiceDowntime",
    description: "Should only be used for Moog. This changes the u_service_downtime field to '1'",
    type: "Boolean",
    required: "false",
    default: "N/A",
  },
  {
    name: "forceCloseFromClientResolve",
    description:
      "When a client sends a resolve status update, the ticket will also be closed instead of just resolved.",
    type: "Boolean",
    required: "false",
    default: "false",
  },
];
export default FlagFinder;
