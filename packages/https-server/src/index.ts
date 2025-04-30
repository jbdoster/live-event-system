import https from "https";
import { readFileSync } from "fs";
import EventEmitter from "node:events";

import { request, response, validations } from "./core";

import { Types } from "./core"
import { ServerResponse } from "http";

export default class<Contract = Record<string, any>> extends EventEmitter<{
    request: [{
        args: Contract;
        response: ServerResponse;
    }],
}> {
    constructor(
        options: {
            documentationHtml: string;
            sslKeyPath: string;
            sslCertificatePath: string;
            rejectUnauthorized: boolean;
            port: number;
            onListening: () => void;
        }
    ) {
        super();

        const rejectUnauthorized = options.rejectUnauthorized;
        const key = readFileSync(options.sslKeyPath);
        const cert = readFileSync(options.sslCertificatePath);

        https.createServer(
            {
                cert,
                key,
                rejectUnauthorized,
            },
            async (req, res) => {

            console.log("Request: ", req.method, req.url, req.headers);
        
            const method = request.Parser.method(req);
            const path = request.Parser.path(req);

            if (path === "/documentation") {
              response.Writer.documentation(
                options.documentationHtml,
                res,
            );
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
                    let args: Contract;
            
                    try {
                        args = request.Parser.args(body, req) as Contract;
                    }
                    catch(error: any) {
                        response.Writer.clientError(res, "Request body cannot be parsed.");
                        return;
                    }

                    this.emit("request", {args, response: res});
                });
        
                req.on("error", (error) => {
                    console.error(error.message);
                    response.Writer.serverError(res);
                })
            }
        })
        .listen(options.port)
        .on("listening", options.onListening);
    }
}
