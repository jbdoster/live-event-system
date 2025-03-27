import { PrismaClient as AccountsClient } from "../../../.generated/prisma/accounts";
import { PrismaClient as CarsClient } from "../../../.generated/prisma/cars";
import { PrismaClient as EventServerClient } from "../../../.generated/prisma/event_server";
import { PrismaClient as RentalsClient } from "../../../.generated/prisma/rentals";

import { Types } from "../types";

type DataAccessObject = Record<string, unknown>;

export abstract class Abstract<T = DataAccessObject> {
    protected accounts: AccountsClient;
    protected cars: CarsClient;
    protected eventServer: EventServerClient;
    protected rentals: RentalsClient;
    constructor() {
        this.accounts = new AccountsClient();
        this.cars = new CarsClient();
        this.eventServer = new EventServerClient();
        this.rentals = new RentalsClient();
    }

    abstract readAll(args: {
        filter?: Types.Filters; // | ...
    }): Promise<T[]>;
    abstract read(args: {
        filter: Types.Filters; // | ...
    }): Promise<T[]>;
}


