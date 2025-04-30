import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";

import { Types } from "../types";

export default class {
    static documentation(
        html: string,
        response: ServerResponse<IncomingMessage>,
    ): void {
        response.writeHead(
            200,
            {
                "content-type": "text/html",
            },
        );
        response.write(html || "404");
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
        response.end();
    }

    static clientError(
        response: ServerResponse<IncomingMessage>,
        message: string,
    ): void {
        response.writeHead(
            400,
            {
                "content-type": "application/json",
            },
        );
        const error = JSON.stringify({
            message,
        });
        response.write(error);
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
        response.end();
    }
}