# Bulk ticket closing application for ServiceNow built with React
This application is just meant to showcase a React app used for closing multiple tickets in ServiceNow and is not meant to be run locally or replicated. 

## Purpose
This application was built to be able to close multiple ServiceNow tickets in quick succession. Under normal circumstances, each ticket would have to be closed manualy which would take 1-2 minutes per ticket. This app allows a user to close dozens of tickets in seconds. 

## Features
* User login page managed by AWS Cognito
* Settings which allow the user to select the ServiceNow instance and version (our company had 2 separate production instances of ServiceNow)
* The user could also select whether the ticket gets resolved or cancelled
* An optional close note field
* If the user selected the Production environment, a dialog box would appear where a user would have to type "Confirm" to proceed
* If a user clicked "Submit" in the Production environment they would have to click again to confirm in a separate dialog box. This is done to ensure that production tickets don't get closed accidentially


![Alt Text](https://media.giphy.com/media/vFKqnCdLPNOKc/giphy.gif](https://github-media.s3.amazonaws.com/login.gif)
