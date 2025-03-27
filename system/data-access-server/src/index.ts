import https from "https";

import { IncomingMessage, ServerResponse } from "http";
import { readFileSync } from "fs";
import { join } from "path";

import { databases } from "./core/client"

import { request, response, validations } from "./core";

import { Types } from "./core"

const routine = async (
    args: Types.Args,
    res: ServerResponse<IncomingMessage>,
) => {
    try {
        new validations.Arguments(args);
        new validations.Existence(args);
    }
    catch (error: any) {
        response.Writer.clientError(res);
        return;
    }

    const accessor = databases[args.database][args.table];
    if (!accessor) {
        response.Writer.serverError(res);
        return;
    }

    try {
        const dataAccessObject = await accessor[args.operation]({
            filter: args.filter,
        });
        response.Writer.success(dataAccessObject, res);
    }
    catch (error: any) {
        console.error(error.message);
        response.Writer.serverError(res);
    }
    finally {
        res.end();
    }
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
    const isDocumentation = request.Parser.isDocumentation(req);
    if (isDocumentation) {
      response.Writer.documentation(res);
    }
    else if (method === "GET") {
        const args = request.Parser.argsGet(req);
        routine(args, res);        
    }
    else if (method === "POST") {
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
                args = request.Parser.argsPost(body, req);
            }
            catch(error: any) {
                response.Writer.clientError(res);
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
.listen(8083).on("listening", () => {
    console.log("Server listening: 8083.")
});
