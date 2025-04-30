# Summary

A blackbox for reading from and updating to databases in the system.

# Philosophy
This server does not operate statefully, yet not RESTfully either.
We will use all POST requests to simply pass the request data as a JSON object.

## Client Contracts
When client needs multiple tables, they can just nest the request in a JSON object.

This nesting represents the joining relations between tables.

It is the data access system's responsibility to map those inputs appropriately for joins and unions.

This goes for reads and updates.

Most ORM technologies provide a mapping capability, but it will be used behind the veil. It would be good to provide this same graphing opportunity to clients that make the requests to reduce and optimize network calls.

# Scale
The databases are separated into 2 categories:
1. Product Services
2. System

The system might not require a lot of state to be managed, but the product services will grow as long as a business does.

For this reason, each aspect of the product is separated into different databases.

The different databases are united through [Postgres FDW](http://www.postgresql.org/docs/current/interactive/postgres-fdw.html).

