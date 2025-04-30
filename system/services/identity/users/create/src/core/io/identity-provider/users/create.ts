import { Contract } from "../../../types";

export default async (
    body: Contract,
    accessToken: string
): Promise<any> => {
    const result = await fetch(process.env.IDENTITY_PROVIDER_USERS_SERVICE_ACCOUNT_CREATE_URL!, {
        method: 'POST',
        headers: {
            
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + accessToken,
        },
        body: JSON.stringify(body),
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

    const locationHeader = result.headers.get('location'); // full URL to new user
    const id = locationHeader?.split('/').pop(); // extract user ID
    if (!id) {
        console.error("No ID located in response")
        return
    }

    return {
        ...body,
        id,
        credentials: undefined,
    };
}
