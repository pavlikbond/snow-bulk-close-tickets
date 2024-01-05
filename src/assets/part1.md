# Authentication

Authentication will be handled by an `x-api-key` header and a `clientName` parameter that must be included with each request. The `x-api-key` and `clientName` values will be provided separately once the client has been setup in the Ensono ITSM system(s). All calls are sent via HTTPS using TLS 1.2 with a 2048-bit SSL Certificate. IP Addresses and Ranges can be white-listed as needed. API-Keys can be rotated manually as needed.

# Environments

Each client stack will be configured with the following environments:

## /dev/

Dev is used for initial setup, development, unit testing, and bug fixes.

## /echo/

Echo can be used in conjunction with Dev to test the queue reading and processing. Echo calls the same Ensono SNOW instance as Dev, but any transactions sent via the integration are sent back to the queue as if an Ensono user had made the action. This can be used to initiate outbound-from-Ensono transactions or to confirm the success of inbound-to-Ensono transactions. There is no `/echo/queue`, instead transactions will flow to the `/dev/queue`. Echo currently works only for incidents and requests.

## /cert/

Cert is used for system testing, user acceptance testing, and testing the migration of the integration code and components.

## /prod/

Prod is the production environment of the integration.
