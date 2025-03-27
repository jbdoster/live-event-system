import { Prisma, profile } from "../../../.generated/prisma/users";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = profile;

export type Filters = Prisma.$profilePayload["scalars"] | never;

class EventRules extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.users.profile.findMany()
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
        return this.users.profile.findMany({
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

export default new EventRules();
