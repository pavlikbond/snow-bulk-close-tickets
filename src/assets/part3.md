# Client to Ensono API Methods (Synchronous)

## /tickets

- **POST**: Creates a ServiceNow ticket and returns the ticket number. Adds integration record and comments asynchronously.
- **Ticket Types**: Incident, Request

## /tickets/{TICKETNUMBER}

- **PUT**: Updates the fields of the specified ticket with the passed values. Returns successful or a SN error. Updates integration record and comments asynchronously.
- **GET**: Returns the current values of all fields on the specified ticket. This API is only available in dev environment.
- **Ticket Types**: Incident, Request

## /tickets/{TICKETNUMBER}/returnptn

- **PUT**: Updates the fields of the specified ticket’s integration record with the passed PTN.
- **Ticket Types**: Incident, Request

## /tickets/{TICKETNUMBER}/notes

- **PUT**: Adds 1 or more comments to the specified ticket asynchronously. Returns successful.
- **Ticket Types**: Incident, Request

## /tickets/{TICKETNUMBER}/attachments/{FILENAME}

- **GET**: Returns pre-signed URL to PUT file.
- **Ticket Types**: Incident, Request

# Client to Queue API Methods (Asynchronous)

## /queue

- **GET**: Returns 1-10 messages in the queue to be processed by the client. Once a message has been processed, the client should use the ReceiptHandle of the message to delete the message from the queue to prevent duplicate processing. Queue Messages can be grouped by their MessageGroupID (ticket number) and ordered by SentTimestamp. Since the Queues are FIFO (First In First Out), messages belonging to the same MessageGroupID must be deleted before the next messages can be retrieved.

## /queue/{RECEIPTHANDLE}

- **DELETE**: Deletes the specified message from the queue.
- **Note**: receiptHandle needs to be URL encoded.
