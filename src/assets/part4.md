# Client Responsibilities

## TRIGGERING

The client should determine what tickets should be sent to Ensono and when. This could be based on Assigned Group, Category, CI, Approval Status, etc. The client should distinguish between when to send a create (if the vendor/partner/Ensono ticket number field is blank) call and when to send an update, and what type of update.

## FORMATTING

- **Create format**: All required JSON fields need to be included in creates JSON format
- **Update format**: For updates, besides required identity fields, only fields that have changed should be included as an array.
- **Note**: Including every field with every update could cause unnecessary ticket ‘hopping’ that can cause the ticket to take longer to be resolved.

## APPENDING CUSTOM OR EXTRA FIELDS

Any fields not listed in the Bridge Data section will need to be concatenated to one of the existing fields, usually description or comments. This logic is normally required when clients send Requests or Tasks to Ensono. These fields will also need to be considered when building update triggers on the client side. Important fields, such as start and end dates on a Change Task, would need to pass any updated information over the integration.

## DUPLICATE PREVENTION

- **Create transaction**: The client should only send one create transaction for any given ticket, unless an error is returned.
- **Update transaction**: the client should make sure only changed fields are passed
- **Comment transaction**: comments/notes/logs are only sent once as note array, with or without update array as Update transaction

## MAPPING

The client may need to create mappings for certain fields. A commonly mapped field on the client side is the “status” or “state” field. Additionally, the client may map their specific Impact/Urgency/Priority to a Priority value of 1 through 4. Alternatively, the client may send the impact and urgency fields in the payload which can be mapped by Ensono. If an invalid group is passed, the error will be returned from Ensono’s ITSM. If an invalid priority is passed, the mapping will choose the default priority of 3.

## LOGGING

In case the need for troubleshooting and bug fixes arise, the client should keep logs of any processes, Requests to the bridge, and Responses from the bridge.

## ERROR HANDLING AND RETRY

Depending on the operation being performed and the error message received, the client should take different actions.

- **Example 1**: If the error is related to the group provided, the client should send a ‘default’ group.
- **Example 2**: If the API call times out, wait for 60 to 120 sec and then try to resend the transaction.

# READING, PROCESSING, AND DELETING FROM THE QUEUE

Creates & Updates & Public Attachments from Ensono will be added to the client’s queue that they can interact with via the API. The client should check the queue at a regular interval (normally 30-300 seconds) for messages. If messages are returned, the client should process those messages as they see fit and delete the message from the queue to prevent duplicate processing.

The queues are FIFO (First In, First Out) so the first messages must be read, processed, and deleted before the later messages can be read. When reading the queue, an array of message objects will be returned (examples below). Each message Object will have multiple fields, but only a few may be needed.

The Body element will have the ticket JSON from the Ensono ticket system for the relevant transaction, the ReceiptHandle element will be needed to DELETE messages from the queue, and the last two fields are in the Attributes object. In this array are objects with important fields, including the SentTimestamp and MessageGroupID fields. Transactions from each queue read should be grouped by MessageGroupID (Ticket number) and ordered by SentTimestamp. Different ticket numbers can be processed in any order, but the transactions for each ticket should be processed sequentially by their SentTimestamp. Once the transaction is processed, the ReceiptHandle should be used to DELETE that message from the queue so that it is not read again and the next transaction can be processed. When messages are read from the queue, the messages are made invisible to other read calls for the next 30 seconds. If a message is not DELETE-ed from the queue, the message will be resent (and no new messages sent for the same MessageGroupID) during the next read call up to 20 times before the message is moved out of the normal queue and to a failure queue. The queue also has a message expiration of 4 days, which means if the messages isn’t read 20 times or deleted within 4 days of being added to the queue, then the message will be deleted automatically.

## RETURNING CLIENT TICKET NUMBERS

If the client reads their queue and finds a ticket that needs to be created in their system, then once the ticket is created the client should call PUT /tickets/{ticketnumber}/returnptn to return their Partner Ticket Number and ID to Ensono’s ITSM.

Any transaction from Ensono where the “clientTicketNumber” is an empty string or the attribute ClientReferenceAvailable is set to false means the client’s ticket number has not been returned to the Ensono system.

## QUEUE ALERTS

There are 2 alarms setup by default to send alerts to a client defined email address. The first alarm fires when the unread messages count exceeds 10 for a 30 minute period, meaning the prod queue isn’t being read. The second alarm fires when the average age of the messages is over 1 hour old, meaning messages aren’t being deleted from the prod queue. The alarms will be setup to send to the client email address so a ticket can manually be created on the client side to investigate integration issue.

# INTERNAL ASSIGNMENTS

When a bridged ticket has been assigned to an internal client group in the client’s system, Ensono needs a bridge transaction to let our users know to no longer work the ticket. The most common approach to this is to hard code an update that moves the ticket to our generic client group and sets the ticket to a Pending status. If the ticket is then closed internally at the client, the bridge will need to send a resolution/closure update to close the Ensono ticket.

# OUT-OF-SCOPE TRANSACTIONS

Because Ensono sends all clients’ transaction over the bridge, some transactions may be out of scope, depending on each client’s contract. If there are any bridge cases that are out of scope, additional logic will be needed on the client’s side to DELETE any of those messages from the queue. This will prevent the client’s queue from getting ‘clogged’ with unneeded transactions.

# TROUBLE-SHOOTING

When an issue occurs, client should check the log that was kept in client system to troubleshoot.

- **Example 1**: If a ticket was created in client system but not bridged to Ensono system, check if client system has sent the create transaction. If the transaction was sent, what was the response. If the response was successful but still the ticket did not show in Ensono system, please reach out to Ensono team.
- **Example 2**: If there were multiple tickets found in client system that have the same Ensono ticket number, it indicates that the messages in the queue might not be deleted successfully. Check the log if there was an error occurred when deleting messages from the queue. If no error found, reach out to Ensono team for assistance.

# RE-OPEN

A Resolved Ensono ticket can also be moved back to open status if the resolution is rejected. If the client allows reopening of that ticket, when they receive Ensono status update from resolved to previous status, reopen the ticket. If the client doesn’t allow reopening of that ticket, one option is to create a new ticket and call /returnptn to send Ensono the new ticket number. The other option is for the client to receive all updates after the ticket is resolved as comments.

If the client re-opened a ticket, the client needs to send Ensono a status update transaction.

If the client closes a ticket, send Ensono a closure transaction and Ensono will close the ticket. Likewise, if the client receives a closure transaction from Ensono, the client needs to close the ticket.
