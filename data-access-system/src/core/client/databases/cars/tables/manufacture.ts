import { Prisma, manufacture } from "../../../../../../.generated/prisma/cars";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = manufacture;

export type Filters = Prisma.$manufacturePayload["scalars"] | never;

class Class extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.cars.manufacture.findMany()
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
        return this.cars.manufacture.findMany({
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
