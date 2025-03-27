import { IncomingMessage } from "http";

import { Types } from "../../core";

type Method = "GET" | "POST";

export default class {
    static method(request: IncomingMessage): Method {
        return request.method as Method;
    }

    static isDocumentation(request: IncomingMessage): boolean {
        const parameters = new URL(`http://host${request.url}`);
        return parameters.pathname === "/documentation";
    }

    static argsGet(request: IncomingMessage): Types.Args {
        const parameters = new URL(`http://host${request.url}`);
        const database = parameters.pathname.replace("/", "");
        const args = {
            database,
        } as Types.Args;
        parameters.searchParams.forEach(
            (value, key) => (args[key] = value)
        )
        console.log(parameters);
        return args;
    }

    static argsPost(
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
