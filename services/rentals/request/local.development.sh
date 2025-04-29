############################################
# Shell helper to easily build and         #
# run a local server instance using Docker.#
############################################

# Stop running any previously
# ran instances.
pnpm stop:server:local

# Delete any previously
# created containers.
pnpm remove:server:local

pnpm docker:network:remove

# Build a new container instance.
pnpm build:server:local

# As far as I have researched,
# BuildKit and Docker build cannot
# bind TCP/IP connection ports to
# pull the database schema.
# Initialize the container in the
# background to introspect the database
# and initialize the ORM instead.
pnpm init:server:local

# Only if not already created.
# Exits non-zero otherwise.
# Bypassing non-zero to silently fail
# but move forward (not preferred, but
# Docker offers no such option.)
pnpm docker:network:create

# Link the database and server to the same
# private Docker network so that the database
# schema can be pulled for the ORM generator.
pnpm docker:network:connect:database
pnpm docker:network:connect:server

# Pull the database schema and generate the ORM.
pnpm orm:pull:container
pnpm orm:generate:container

# Start the source watch and develop with hot reload.
pnpm run:server:local