################
# STAGE: local #
################
FROM node:alpine3.20 AS local

# Docker guest OS file system directory for project ownership and execution.
WORKDIR /app

# Create new Docker guest OS user to login as instead of root.
RUN adduser -h . -s /bin/sh -u 1001 -D app

# Use pnpm to install node dependencies.
RUN npm install -g pnpm

# Copy only necessary source files into Docker guest OS file system.
COPY --chown=app:app .env vite.config.local.js index.html package.json pnpm-lock.yaml /app/
COPY --chown=app:app src /app/src/

# Log in as non-root user created for Docker guest OS.
USER app

# Install node dependencies.
RUN pnpm install

# Web Server port to see in the browser.
EXPOSE 8082

CMD [ "pnpm", "dev:local" ]