export type Contract = {
    "username": string,
    "enabled": boolean,
    "email": string,
    "firstName": string,
    "lastName": string,
    "credentials": [
      {
        "type": string,
        "value": string,
        "temporary": boolean,
      }
    ]
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
     *  Prisma does not currently nor plan to support foreign table
     *  remote server schema introspection/code generation.
     * 
     *  TODO
     */
    export type DataAccessObject = Record<string, unknown>;
}
