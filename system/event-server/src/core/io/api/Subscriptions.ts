import createClient from "openapi-fetch";

import type { paths } from "./EventRules.schema"

export type DataAccessObject = {
    event_key: string
    id: string
    required: boolean | null
    event_property_data_type: string | null
    number_value_minimum: number | null
    number_value_maximum: number | null
    string_length_maximum: number | null
    regular_expression_match: string | null
    version: number
    event_property_key: string
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
  } = await client.GET("/event_server", {
    params: {
      query: {
          operation: "readAll",
          table: "rules",
      },
    },
  });

  if (error) {
      throw error;
  }
  else {
      return data as DataAccessObject[];
  }
}