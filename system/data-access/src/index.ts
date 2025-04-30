import { readFileSync } from "fs";
import { join } from "path";

import { Generator, Wrapper } from "./core/client"

import { response, validations } from "./core";

import HttpsServer from "@astrolabz/https-server";

const documentationHtml = readFileSync("./index.html").toString("utf-8");
const port = 8083;
const rejectUnauthorized = process.env.HOST !== "local";
const sslCertificatePath = join(process.cwd(), "keys", "certificate.pem")
const sslKeyPath = join(process.cwd(), "keys", "private-key.pem")

const onListening = () => {
    console.log("Server listening: 8083.")
}

new HttpsServer({
    documentationHtml,
    onListening,
    port,
    rejectUnauthorized,
    sslCertificatePath,
    sslKeyPath,
})
.on("request", async({
    args,
    response: res,
}) => {
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
})
