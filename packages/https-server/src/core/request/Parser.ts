import { IncomingMessage } from "http";

import { Types } from "..";

type Method = "GET" | "POST";
type Path  = "/documentation" | "/query";

export default class {
    static method(request: IncomingMessage): Method {
        return request.method as Method;
    }

    static path(request: IncomingMessage): Path {
        const parameters = new URL(`http://host${request.url}`);
        return parameters.pathname as Path;
    }

    static args(
        body: string,
        request: IncomingMessage,
    ): Types.Args {
        let args;
        try {
            args = JSON.parse(body);
            console.log("Request: ", request.url, request.method, request.headers, args);
            return args;
        }
        catch(error: any) {
            console.error(error.message);
            throw new Error("Could not parse POST request data.");
        }
    }
}
