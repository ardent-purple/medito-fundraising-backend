# syntax=docker/dockerfile:1

FROM node:20.11.1-alpine

# Run the application as a non-root user.
USER node

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 6969

# Run the application.
CMD npm run distribute
