import { Abstract } from "./client/Abstract";
import { databases } from "./client";

/**
 *  Unite all types needed for this whole project into 1 place.
 *  Makes it easier to have 1 source of truth.
 */
export namespace Types {
    export type Args = {
        database: Databases;
        filter?: Filters;
        operation: Operations;
        table: Tables;
    }

    /**
     *  Refer to all database names.
     */
    export type Databases = keyof typeof databases;

    export type Filters =
        databases.accounts.Filters |
        databases.event_server.Filters |
        databases.cars.Filters |
        databases.rentals.Filters;

    /**
     *  Only derive the member methods from this interface.
     *  These will be bound to the contract the clients can use.
     */
    export type Operations = Abstract[keyof Abstract] extends Function ? keyof Abstract : never;

    /**
     *  Refer to all database table names.
     */
    export type Tables =
        keyof (typeof databases.accounts) |
        keyof (typeof databases.event_server) |
        keyof (typeof databases.cars) |
        keyof (typeof databases.rentals)

    export type DataAccessObject =
        databases.accounts.DataAccessObject |
        databases.event_server.DataAccessObject |
        databases.cars.DataAccessObject |
        databases.rentals.DataAccessObject;
}
