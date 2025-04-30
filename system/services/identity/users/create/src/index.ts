import { readFileSync } from "fs";
import { join } from "path";

import { config } from "dotenv"
const path = join(process.cwd(), ".env")
config({ path })

import { io, response, validations } from "./core";

import HttpsServer from "@astrolabz/https-server";

import { Contract } from "./core/types";

const documentationHtml = readFileSync("./index.html").toString("utf-8");
const port = 8086;
const rejectUnauthorized = process.env.HOST !== "local";
const sslCertificatePath = join(process.cwd(), "keys", "certificate.pem")
const sslKeyPath = join(process.cwd(), "keys", "private-key.pem")

const onListening = () => {
    console.log("Server listening: 8083.")
}

new HttpsServer<Contract>
({
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
        new validations.Arguments(args as any);
    }
    catch (error: any) {
        console.error(error)
        response.Writer.unauthorized(res);
        return;
    }

    const accessToken = await io.IdentityProvider.AccessToken.fetch();
    if (!accessToken) {
        console.error("No access token fetched");
        response.Writer.serverError(res);
        return
    }

    const user = await io.IdentityProvider.Client.Users.create(
        args,
        accessToken,
    )
    console.log("user\n", user)

    response.Writer.created(user, res);
})
