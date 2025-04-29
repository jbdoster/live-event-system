import https from "https";

import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import { join } from "path";

import { Generator, Wrapper } from "./core/client"

import { request, response, validations } from "./core";

import { Types } from "./core"

const routine = async (
    args: Types.Args,
    res: ServerResponse<IncomingMessage>,
) => {
    try {
        new validations.Arguments(args);
    }
    catch (error: any) {
        response.Writer.clientError(res, error.message);
        return;
    }

    const statement = Generator(args as any);

    let rows;
    try {
        rows = await Wrapper.query(statement);
    }
    catch (error: any) {
        response.Writer.clientError(res, error?.message);
        return;
    }

    response.Writer.success(rows, res);
}

const options = {
    key: readFileSync(join(process.cwd(), "keys", "private-key.pem")),
    cert: readFileSync(join(process.cwd(), "keys", "certificate.pem")),
    rejectUnauthorized: process.env.HOST !== "local",
};

https.createServer(
    options,
    async (req, res) => {
    console.log("Request: ", req.method, req.url, req.headers);

    const method = request.Parser.method(req);
    const path = request.Parser.path(req);
    if (path === "/documentation") {
      response.Writer.documentation(res);
    }
    else if (method !== "POST") {
        console.warn("Method not Post: ", method);
        response.Writer.clientError(res, "Bad request.");
    }
    else {
        let body = "";
        req.on('readable', () => {
            const buffer = req.read();
    
            /**
             *  Once the stream is read, that chunk cannot be read again and is nullified.
             *  Ensure there is data to be read from the buffer stream before concatenation.
             */
            if (!buffer) return;

            body += buffer;
        });
    
        req.on('end', async () => {
            let args: Types.Args;
    
            try {
                args = request.Parser.args(body, req);
            }
            catch(error: any) {
                response.Writer.clientError(res, "Request body cannot be parsed.");
                return;
            }

            routine(args, res);
        });

        req.on("error", (error) => {
            console.error(error.message);
            response.Writer.serverError(res);
        })
    }
})
.listen(8083)
.on("listening", () => {
    console.log("Server listening: 8083.")
});
