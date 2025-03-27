import http from "http";

http.createServer(function (req, res) {
    console.log("Request: ", req.method, req.url, req.headers);
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
        let args;

        try {
            args = JSON.parse(body);
            // args = JSON.parse(body) as Types.Args;
            console.log("Request: ", req.url, req.method, req.headers, args);
        }
        catch(error: any) {
            res.writeHead(
                400,
                {
                    "content-type": "application/json",
                },
            );
            res.write({
                message: "Request body not readable.",
            })
            res.end();
            return;
        }

        // try {
        //     new validations.Required(args);
        // }
        // catch (error: any) {
        //     res.writeHead(
        //         400,
        //         {
        //             "content-type": "application/json",
        //         },
        //     );
        //     res.write({
        //         message: error.message,
        //     })
        //     res.end();
        //     return;
        // }

        // try {
        //     const dataAccessObject = await accessor[args.operation]({
        //         filter: args.filter,
        //     });
        //     res.writeHead(
        //         200,
        //         {
        //             "content-type": "application/json",
        //         },
        //     );
        //     res.write(
        //         JSON.stringify({
        //             data: dataAccessObject,
        //         }),
        //     );
        // }
        // catch (error: any) {
        //     console.error(error.message);
        //     res.writeHead(
        //         500,
        //         {
        //             "content-type": "application/json",
        //         },
        //     );
        //     res.write({
        //         message: "Server error.",
        //     });
        // }
        // finally {
        //     res.end();
        // }
    });
})
.listen(8081).on("listening", () => {
    console.log("Server listening: 8081.")
});
