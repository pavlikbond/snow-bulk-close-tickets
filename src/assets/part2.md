# Incident and Request Integration

## The Ensono Process

### ENSONO TRIGGERS

ALL Incidents and Requests have the same fields and process. ALL Case Incidents and Case Requests created for the client in the Ensono ITSM system will trigger transactions to the client’s Queue. ALL updates to certain fields on those tickets will cause update transactions to be sent to the client’s Queue. For attachments, if the “Is Public” flag is set to true after uploading, then Ensono will send a message to the queue with download information for the client.

### ENSONO FIELDS

The field updates that trigger update transactions from Ensono:

- description
- shortDescription
- priority (SLA at Ensono)
- group
- comments
- status
- public attachments

### RESOLUTION/CLOSURE

Ensono has both a Resolved and a Closed status. Once Resolved, the ticket can still receive comments. A Resolved ticket can also be moved back to open status if the resolution is rejected. Otherwise, a resolved ticket is set to Closed after 7 calendar days. Once a ticket has been Closed, no more updates are allowed to be made to the ticket.

Depending on the client’s re-open policy, the re-open scenario can be discussed in depth.
