const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const V1AUTH = process.env.V1AUTH;
const V2AUTH = process.env.V2AUTH;
const v1TestURL = process.env.V1TestURL;
const v1ProdURL = process.env.V1ProdURL;
const v2TestURL = process.env.V2TestURL;
const v2ProdURL = process.env.V2ProdURL;

exports.handler = async (body) => {
    // grab the 4 variables passed by the UI
    let { ticketNum, version, environment, state } = body;

    let data; //this will be returned
    //grab the url based on the variables
    let url = getUrl(version, environment, ticketNum, state);

    //call the SNOW API
    let result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "non-cache",
            Authorization: version === "V1" ? V1AUTH : V2AUTH,
        },
        body: JSON.stringify(
            //body depends on the version, v1 or ENVX
            version === "V1" ? formatTicketToResolvedSCRAPIV1() : formatTicketToResolvedSCRAPIV2(ticketNum, state)
        ),
    })
        .then((response) => response.json())
        .then((_data) => (data = _data))
        .catch((error) => {
            //pass any error back to the UI
            data = error;
        });

    return data;
};

//format for resolving or cancelling tickets in V1
let formatTicketToResolvedSCRAPIV1 = function (currentAssignee = "AWSIntegration") {
    var updateJSON = {};
    var today = new Date();
    updateJSON.state = 6;
    updateJSON.close_notes = "Ticket resolved via client integration";
    updateJSON.u_steps_taken_to_resolve = "Ticket resolved via client integration";
    updateJSON.close_code = "Closed/Resolved by Caller";
    updateJSON.u_closure_category = "General";
    updateJSON.u_srt = "true";
    updateJSON.u_srt_date = today.toLocaleString(); //ticketData.u_srt_date;
    updateJSON.u_next_action = "Auto Close"; //ticketData.u_next_action;
    today.setDate(today.getDate() + 1);
    updateJSON.u_auto_close = "true";
    //updateJSON.u_auto_close_date = today.toLocaleString(); //if empty defaults to 24 hours later
    updateJSON.u_service_affecting = "No";
    updateJSON.u_current_business_impact_to_client = "N/A";
    //updateJSON.u_closure_category = 'General';//ticketData.u_closure_category;
    updateJSON.u_reason_problem_not_related = "No further recurrences expected";
    updateJSON.work_notes = "Status transition on behalf of client via integration";
    updateJSON.assigned_to = currentAssignee;
    updateJSON.check_only = "false";
    updateJSON.force_update = "true";

    return updateJSON;
};

//format for resolving or cancelling tickets in ENV-X
let formatTicketToResolvedSCRAPIV2 = function (ticketNum, state) {
    var updateJSON = {};
    updateJSON.number = ticketNum;
    updateJSON.check_only = "false";

    if (state === "resolve") {
        updateJSON.close_notes = "Ticket resolved via client integration";
        updateJSON.resolution_code = "Closed/Resolved by Caller"; //'Solved (Permanently)';
        updateJSON.assigned_to = "Envision Connect Integration";
        updateJSON.check_only = "false";
        updateJSON.force_update = "true";
    }

    if (state === "cancel") {
        updateJSON.comments = "Cancel Ticket";
    }

    return updateJSON;
};

let getUrl = (version, env, ticketNum, state) => {
    let url;

    if (version === "V1") {
        if (env === "Prod") {
            if (state == "resolve") {
                url = "https://" + v1ProdURL + "resolve/" + ticketNum;
            }
            //if cancel
            else {
                url = "https://" + v1ProdURL + "cancel/" + ticketNum;
            }
        } else {
            if (state == "resolve") {
                url = "https://" + v1TestURL + "resolve/" + ticketNum;
            }
            //if cancel
            else {
                url = "https://" + v1TestURL + "cancel/" + ticketNum;
            }
        }
    } else if (version === "V2") {
        if (env === "Prod") {
            if (state === "resolve") {
                url = "https://" + v2ProdURL + "resolve";
            } else {
                url = "https://" + v2ProdURL + "cancel";
            }
            //if test environment
        } else {
            if (state === "resolve") {
                url = "https://" + v2TestURL + "resolve";
            } else {
                url = "https://" + v2TestURL + "cancel";
            }
        }
    }
    return url;
};
