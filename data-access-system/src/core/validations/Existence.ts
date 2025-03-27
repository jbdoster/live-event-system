import { Types } from "../types";

import { databases } from "../client";

export default class {
    constructor(args: Types.Args) {
        if (!databases[args.database]) throw new Error("Database not found.");
        if (!databases[args.database][args.table]) throw new Error("Database table not found.");
    }
}
