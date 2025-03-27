export type Message = {
    eventKey: string;
    data: Record<string, unknown>;
    sessionId: string;
    version: number;
}

type Data = Record<string, unknown>;

export type Subscription = (message: Message) => Promise<Data>;
export type SubscriptionJobResponse = {
    data?: Data;
    message: string;
    status: number;
}