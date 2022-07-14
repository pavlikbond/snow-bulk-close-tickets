const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.resolver = async (ticketNum, environment) => {
    let data;

    let env = environment === "Prod" ? "" : "test";

    let result = await fetch(
        `https://ensono${env}.service-now.com/api/x_aito_rest_provid/v2/generic/incident/resolve/${ticketNum}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic QVdTSW50ZWdyYXRpb246Tis/QjQnTSVeQjU9dTZWS1paJFg=",
            },
            body: JSON.stringify(formatTicketToResolvedSCRAPI()),
        }
    )
        .then((response) => response.json())
        .then((_data) => (data = _data))
        .catch((error) => {
            console.log(error);
        });

    return data;
};

let formatTicketToResolvedSCRAPI = function (currentAssignee = "AWSIntegration") {
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
