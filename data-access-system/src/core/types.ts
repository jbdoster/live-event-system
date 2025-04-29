// import { Generate } from "./client";
// import { Query } from "./client";

export type Placeholder = {
    Filters: any;
}
export type databases = {
    accounts: Placeholder;
    event_server: Placeholder;
    cars: Placeholder;
    rentals: Placeholder;
}

/**
 *  Unite all types needed for this whole project into 1 place.
 *  Makes it easier to have 1 source of truth.
 */
export namespace Types {
    export type Args<T = unknown> = {
        insert?: {
            data: {},
            
        }
    }

    /**
     *  Refer to all database names.
     */
    export type Databases = keyof databases;

    export type Filters =
        databases["accounts"]["Filters"] |
        databases["event_server"]["Filters"] |
        databases["cars"]["Filters"] |
        databases["rentals"]["Filters"];

    /**
     *  Only derive the member methods from this interface.
     *  These will be bound to the contract the clients can use.
     * 
     *  TODO
     */
    export type Operations = "create" | "read" | "readAll" | "update";
        // typeof Generate[keyof (typeof Generate)] extends Function ? keyof (typeof Generate) : never;
    /**
     *  Refer to all database table names.
     */
    export type Tables =
        keyof (databases["accounts"]) |
        keyof (databases["event_server"]) |
        keyof (databases["cars"]) |
        keyof (databases["rentals"])


    /**
     *  Prisma does not currently nor plan to support foreign table
     *  remote server schema introspection/code generation.
     * 
     *  TODO
     */
    export type DataAccessObject = any;
}
