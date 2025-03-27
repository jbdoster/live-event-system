import { Prisma, subscriptions } from "../../../../../../.generated/prisma/event_server";

import { Abstract } from "../../../Abstract";

export type DataAccessObject = subscriptions;

export type Filters = Prisma.$subscriptionsPayload["scalars"] | never;

class Class extends Abstract<DataAccessObject> {
    constructor() {
        super();
    }

    readAll(): Promise<DataAccessObject[]> {
        return this.eventServer.subscriptions.findMany()
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
        return this.eventServer.subscriptions.findMany({
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
