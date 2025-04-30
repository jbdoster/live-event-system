export default class {
    static async fetch(): Promise<string | void> {
        const params = new URLSearchParams();
        params.append('client_id', process.env.IDENTITY_PROVIDER_USERS_SERVICE_ACCOUNT_CLIENT_ID!);
        params.append('client_secret', process.env.IDENTITY_PROVIDER_USERS_SERVICE_ACCOUNT_CLIENT_SECRET!);
        params.append('grant_type', "client_credentials");
        params.append('scope', "openid");

        const result = await fetch(process.env.IDENTITY_PROVIDER_TOKEN_URL!, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        })
        .catch(error => {
            console.log(error)
        })

        if (!result) {
            console.error("No result")
            return
        }

        if (!result.ok) {
            console.warn("Result not okay")
            return
        }

        const data = await result.json()
        .catch(
            error => {
                console.error(error)
            }
        );

        if (!data) {
            console.error("No data")
            return
        }

        if (!data.access_token) {
            console.error("No access token")
            return
        }

        return data.access_token;
    }
}