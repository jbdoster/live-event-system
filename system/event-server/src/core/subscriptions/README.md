# Summary
This abstracts the actual work that needs to take place.
This is exclusively asynchronous I/O work including (but not limited to) API calls, database queries, file operation.
Each event should only invoke 1 job. This is because we might need to perform atomic actions
like transactional updates to a database.
We do not want bad data.