import { EventEmitter, WebSocket, WebSocketServer } from 'ws';

import { Message } from "../types";

type AuthCallback = (sessionId: string) => Promise<boolean>;
type EventValidationCallback = (message: Message) => boolean;
type UserCommunicationEvent = 
    Omit<Message, "eventKey" | "version">
    & {
        data: {
            userDisplayText: string;
        }
    };

export default class extends EventEmitter<{
    client_message: [Message],
    client_request_error: [UserCommunicationEvent],
    client_request_success: [UserCommunicationEvent],
}> {
    private authCallback: AuthCallback;
    private eventValidationCallback: EventValidationCallback;
    private sessionSocketMap: Map<string, WebSocket>;
    private server: WebSocketServer;

    constructor(args: {
        authCallback: AuthCallback,
        eventValidationCallback: EventValidationCallback,
    }) {
        super();
        this.authCallback = args.authCallback;
        this.eventValidationCallback = args.eventValidationCallback;
        this.sessionSocketMap = new Map();
        this.server = new WebSocketServer({
            port: 8084,
        });
        this.server.on("listening", () => {
            console.log("Server listening: 8084");
        });

        this.on("client_request_error", (message) => {
            const clientConnection = this.sessionSocketMap.get(message.sessionId);
            if (clientConnection) {
                const encoded = JSON.stringify({
                    "eventKey": "client_request_error",
                    ...message,
                });
                clientConnection.send(encoded);
            }
            else {
                console.warn("No client connection sourced, skipping: " + message.sessionId);
            }
        });

        this.on("client_request_success", (message) => {
            const clientConnection = this.sessionSocketMap.get(message.sessionId);
            if (clientConnection) {
                const encoded = JSON.stringify({
                    ...message,
                    "eventKey": "client_request_success",
                });
                clientConnection.send(encoded);
            }
            else {
                console.warn("No client connection sourced, skipping: " + message.sessionId);
            }
        });

        this.server.on('connection', (socket) => {
            socket.on('error', console.error);
            socket.on('message', async (buffer: Buffer) => {
                const message = this.bufferToObject(buffer);
                console.log('received: %s', message);

                const authenticated = await this.authCallback(message.sessionId)
                if (!authenticated) {
                    this.emit("client_request_error", {
                        ...message,
                        data: {
                            userDisplayText: "An error occured. Please try refreshing your page and logging in again.",
                        },
                    });
                    return;
                }

                switch (message.eventKey) {
                    case "opened_client_connection":
                        this.linkSessionAndWebSocket(message.sessionId, socket);
                        break;

                    default:
                        const valid = await this.eventValidationCallback(message);
                        if (!valid) {
                            this.emit("client_request_error", {
                                ...message,
                                data: {
                                    userDisplayText: "An error occured. Please try refreshing your page and logging in again.",
                                },
                            });
                            return;
                        }
                        this.emit("client_message", message);
                }
            });
        });
    }

    private bufferToObject(buffer: Buffer): Message {
        try {
          return JSON.parse(buffer.toString("utf-8"));
        }
        catch(error) {
          throw new Error("Could not read websocket message data.");
        }
    }

    private linkSessionAndWebSocket(
        sessionId: string,
        socket: WebSocket,
    ): void {
        this.sessionSocketMap.set(sessionId, socket);
    }
}