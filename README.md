# Bulk Ticket Closing Application for ServiceNow built with React
This repository is just meant to showcase a React app used for closing multiple tickets in ServiceNow and is not meant to be run locally. The application was made using React for the front end. AWS Cognito was used for user authentication. AWS Amplify was used to deploy the application to AWS S3 and deliver it via a CloudFront distribution. AWS Lambda was used as the serverless backend which is routed using API Gateway. The React app sends the ticket data to Lambda which processes the requests one by one. Lambda calls the correct ServiceNow API depending on which production version and environment is selected. Once the response from ServiceNow is processed, it is forwarded the front end.

## Purpose
This application was built so that multiple ServiceNow tickets could be closed in quick succession. Under normal circumstances, each ticket would have to be closed manually which would take 1-2 minutes per ticket. This app allows a user to close dozens of tickets in seconds. 

## Features
####  User login page managed by AWS Cognito

<img src="https://github-media.s3.amazonaws.com/ezgif.com-gif-maker.gif" width="600" />

#### Settings which allow the user to select the ServiceNow instance and environment (our company had 2 separate production instances of ServiceNow)


* The user could also select whether the ticket gets resolved or cancelled
* An optional "close notes" input field
* If the user selected the Production environment, a dialog box would appear where a user would have to type "Confirm" to proceed

<img src="https://github-media.s3.amazonaws.com/ezgif.com-gif-maker(1).gif" width="600" />

#### The application processes each ticket and displays the responses in a panel that appears on the right
* A status bar shows the ratio of successful/failed operations
* The results can then be downloaded to a CSV file. 

<img src="https://github-media.s3.amazonaws.com/snow+bulk+closer+3.gif" width="600" />
