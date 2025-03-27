################################################
# Shell helper to easily build and             #
# run a local web server instance using Docker.#
################################################

# Stop running any previously
# ran instances.
pnpm stop:local

# Delete any previously
# created containers.
pnpm remove:local

# Build a new container instance.
pnpm build:local

# Run the container so we can connect it to the
# bridged and local private Docker networks.
pnpm run:local

# Link the web server to the back end network
# to connect to the API.
pnpm docker:network:connect:local

# Start the source watch and develop with hot reload.
pnpm run:local