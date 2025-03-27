import { Prisma, rules } from "../../../.generated/prisma/event_server";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = rules;

export type Filters = Prisma.$rulesPayload["scalars"] | never;

class EventRules extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.eventServer.rules.findMany()
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
        return this.eventServer.rules.findMany({
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
