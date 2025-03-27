import * as system from "./core/system";
import validation from "./core/event-validation";
import { io } from "./core";
import { UserCommunication } from "./core/events/index";

const main = async () => {
  let rules: io.api.EventRules.DataAccessObject[];
  let subscriptions: io.api.EventSubscriptions.DataAccessObject[];
  try {
      rules = await io.api.EventRules.fetch();
      if (!rules || !rules.length) throw new Error("Event rules io fetch failed.");
      subscriptions = await io.api.EventSubscriptions.fetch();
      if (!subscriptions || !subscriptions.length) throw new Error("Event subscriptions io fetch failed.");
  }
  catch(error: any) {
      throw new Error("Server initialization error: " + error.message);
  }

  const webSockerServer = new system.WebSocketServer({
    /**
     *  Just a mock right now so we can focus on live data.
     *  A real production implementation could perform various
     *  operations like:
     *    - JWKS endpoint JWT signature verification by authorization server
     *    - session and JWT verification through the database
     */
    authCallback: (sessionId) => Promise.resolve(true),
    eventValidationCallback: (message) => {
      try {
        validation(message, rules);
        return true;
      }
      catch(error) {
        return false;
      }
    },
  });
  
  /**
   *  Messages emitted through this in memory stream should already
   *  have been authenticated and validated at this point.
   */
  webSockerServer.on("client_message", async (message) => {
    subscriptions.forEach(subscription =>
      io.api.SubscriptionJob({
        args: message.data,
        domain: subscription.domain,
      })
      .then(
        result => {
          if (result.status < 200 || result.status > 299) {
            webSockerServer.emit("client_request_error", {
              ...message,
              data: {
                userDisplayText: "An error occured. Please try again later or reach out to customer support.",
              }
            });
          }
          else {
            const userDisplayText = UserCommunication[message.eventKey].success;
            webSockerServer.emit("client_request_success", {
              ...message,
              data: {
                userDisplayText,
              }
            });
          }
        }
      )
    )
  })
}

main();
