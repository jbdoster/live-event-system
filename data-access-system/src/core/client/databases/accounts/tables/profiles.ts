import { Prisma, profiles } from "../../../../../../.generated/prisma/accounts";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = profiles;

export type Filters = Prisma.$profilesPayload["scalars"] | never;

class Class extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.accounts.profiles.findMany()
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
        return this.accounts.profiles.findMany({
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
