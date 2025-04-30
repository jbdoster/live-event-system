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
COPY --chown=app:app .env package.json pnpm-lock.yaml schema.docker.prisma tsconfig.json /app/
COPY --chown=app:app src /app/src/

# RUN chown -R app:app .

# Log in as non-root user created for Docker guest OS.
USER app

# Install node dependencies.
RUN pnpm install

# Private Docker network Postgres database port.
EXPOSE 5432

# Mock Authorization Server port.
EXPOSE 8080

# Web Socket Server port.
EXPOSE 8081