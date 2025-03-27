# Summary
Abstract the rest of the application away from the
inner workings of the Web Socket Server.
Allow other memory objects to subscribe to important
events using the Node context instead.
This is in case we use another library besides `ws` in the future.
This also sets a clear control boundary between communication with clients and the side-effects that take place in this server as a result of events.