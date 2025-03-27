import { SubscriptionJobResponse } from "../../types";

export default async (
    input: {
        domain: string;
        args: Record<string, unknown>;
        
    }
): Promise<SubscriptionJobResponse> => {
    try {
        const response = await fetch(
            `https://${input.domain}`,
            {
                body: JSON.stringify(input.args),
                method: "POST",
            }
        );

        const body = await response.text();
        const data = JSON.parse(body);
        return {
            message: data?.message,
            status: response.status,
        }
    }
    catch(error: any) {
        console.error(error.message);
        return {
            message: error.message,
            status: 400,
        }
    }
}
