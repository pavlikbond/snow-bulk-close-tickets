const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const V1AUTH = process.env.V1AUTH;
const V2AUTH = process.env.V2AUTH;
const v1TestURL = process.env.V1TestURL;
const v1ProdURL = process.env.V1ProdURL;
const v2TestURL = process.env.V2TestURL;
const v2ProdURL = process.env.V2ProdURL;

let getUrl = (version, env, ticketNum) => {
    let url;

    if (version === "V1") {
        if (env === "Prod") {
            url = "https://" + v1ProdURL + ticketNum;
        } else {
            url = "https://" + v1TestURL + ticketNum;
        }
    } else if (version === "V2") {
        if (env === "Prod") {
            url = "https://" + v2ProdURL;
        } else {
            url = "https://" + v2TestURL;
        }
    }
    return url;
};

exports.resolver = async (ticketNum, version, environment) => {
    let data;
    let url = getUrl(version, environment, ticketNum);

    console.log(url);

    let result = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "cache-control": "non-cache",
            Authorization: version === "V1" ? V1AUTH : V2AUTH,
        },
        body: JSON.stringify(
            version === "V1" ? formatTicketToResolvedSCRAPIV1() : formatTicketToResolvedSCRAPIV2(ticketNum)
        ),
    })
        .then((response) => response.json())
        .then((_data) => (data = _data))
        .catch((error) => {
            data = error;
        });

    return data;
};

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

let formatTicketToResolvedSCRAPIV2 = function (ticketNum) {
    var updateJSON = {};
    //var today = (new Date()); //not used
    updateJSON.number = ticketNum;
    updateJSON.close_notes = "Ticket resolved via client integration";
    updateJSON.resolution_code = "Closed/Resolved by Caller"; //'Solved (Permanently)';
    updateJSON.assigned_to = "Envision Connect Integration";
    updateJSON.check_only = "false";
    updateJSON.force_update = "true";
    updateJSON.comments = "Envision Connect Integration";
    console.log(updateJSON);
    return updateJSON;
};
