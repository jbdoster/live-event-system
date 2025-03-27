import { Prisma, reservations } from "../../../../../../.generated/prisma/rentals";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = reservations;

export type Filters = Prisma.$reservationsPayload["scalars"] | never;

class Class extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.rentals.reservations.findMany()
        .catch(
            error => {
                console.error(error);
                throw error;
            }
        )
    }

    read(input: {
        filter: Filters;
    }): Promise<DataAccessObject[]> {
        return this.rentals.reservations.findMany({
            where: input.filter,
        })
        .catch(
            error => {
                console.error(error);
                throw error;
            }
        )
    }
}

export default new Class();
