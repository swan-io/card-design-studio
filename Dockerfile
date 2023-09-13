FROM node:18 AS builder

WORKDIR /app

COPY . .

RUN yarn add shx -W && yarn install && yarn build

###

FROM cgr.dev/chainguard/node:latest

WORKDIR /app

COPY --chown=node:node --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 8080

CMD ["/usr/bin/npm", "start"]
