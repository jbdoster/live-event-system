import { Types } from "../types";

export default class {
    constructor(args: Types.Args) {
        if (!args) throw new Error("Args needed.");
        if (!args.database) throw new Error("database argument needed.");
        if (!args.operation) throw new Error("operation argument needed.");
        if (!args.table) throw new Error("table argument needed.");
    }
}
