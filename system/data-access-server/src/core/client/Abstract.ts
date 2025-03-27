import { PrismaClient as EventServerClient } from "./.generated/prisma/event_server";
import { PrismaClient as UsersClient } from "./.generated/prisma/users";

import { Types } from "../types";

type DataAccessObject = Record<string, unknown>;

export abstract class Abstract<T = DataAccessObject> {
    protected eventServer: EventServerClient;
    protected users: UsersClient;
    constructor() {
        this.eventServer = new EventServerClient();
        this.users = new UsersClient();
    }

    abstract readAll(args: {
        filter?: Types.Filters; // | ...
    }): Promise<T[]>;
    abstract read(args: {
        filter: Types.Filters; // | ...
    }): Promise<T[]>;
}


