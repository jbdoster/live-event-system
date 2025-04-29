import createClient from "openapi-fetch";

import type { paths } from "./EventRules.schema"

export type DataAccessObject = {
  domain: string
  id: string
}

export const fetch = async () => {
  /**
   *  Skip TLS certificate validation when developing locally
   */
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  const client = createClient<paths>({ baseUrl: "https://localhost:8083" });
  const {
    data,
    error,
  } = await client.POST("/query", {
    body: {
      "columns": ["*"],
      "schema": "web_socket_event_system_events",
      "operation": "SELECT",
      "table": "subscriptions",
    },
  });

  if (error) {
      throw error;
  }
  else {
      return data as DataAccessObject[];
  }
}