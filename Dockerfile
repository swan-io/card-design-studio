FROM node:18 AS builder
WORKDIR /app
ADD ./ ./
RUN yarn install
RUN yarn build
RUN rm -rf ./client

FROM cgr.dev/chainguard/node:latest
WORKDIR /app
COPY --chown=node:node --from=builder /app ./
ENV NODE_ENV=production
CMD ["/usr/bin/npm", "start"]
EXPOSE 8080
