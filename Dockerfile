FROM node:24 AS builder

WORKDIR /app

COPY . .

RUN yarn add shx -W --ignore-scripts && \
    yarn install --ignore-scripts && \
    yarn build

###

FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY --chown=node:node --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
