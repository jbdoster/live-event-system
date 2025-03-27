import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";

import { Types } from "../types";

export default class {
    static documentation(response: ServerResponse<IncomingMessage>): void {
        response.writeHead(
            200,
            {
                "content-type": "text/html",
            },
        );
        const documentation = readFileSync("./index.html").toString("utf-8");
        response.write(documentation);
        response.end();
    }

    static success(
        dataAccessObject: Types.DataAccessObject,
        response: ServerResponse<IncomingMessage>,
    ): void {
        response.writeHead(
            200,
            {
                "content-type": "application/json",
            },
        );
        response.write(
            JSON.stringify(dataAccessObject),
        );
    }

    static clientError(response: ServerResponse<IncomingMessage>): void {
        response.writeHead(
            400,
            {
                "content-type": "application/json",
            },
        );
        const message = JSON.stringify({
            message: "Request body not readable.",
        });
        response.write(message);
        response.end();
    }

    static serverError(response: ServerResponse<IncomingMessage>): void {
        response.writeHead(
            500,
            {
                "content-type": "application/json",
            },
        );
        response.write({
            message: "Server error.",
        });
    }
}