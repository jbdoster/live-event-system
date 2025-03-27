import { Abstract } from "./client/Abstract";
import { databases } from "./client";

export namespace Types {
    export type Args = {
        database: Databases;
        filter?: Filters;
        operation: Operations;
        table: keyof Tables;
    }

    export type Databases = keyof typeof databases;

    export type Filters =
        databases.event_server.Filters |
        databases.users.Filters;

    /**
     *  Only derive the member methods from this interface.
     *  These will be bound to the contract the clients can use.
     */
    export type Operations = Abstract[keyof Abstract] extends Function ? keyof Abstract : never;

    export type Tables = typeof databases.event_server.rules;

    export type DataAccessObject =
        databases.event_server.DataAccessObject |
        databases.users.DataAccessObject;

}
