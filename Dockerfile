FROM node:18 AS builder

WORKDIR /app

COPY . .

RUN yarn add shx -W --ignore-scripts && \
    yarn install --ignore-scripts && \
    yarn build

###

FROM mcr.microsoft.com/playwright:v1.41.1-jammy

WORKDIR /app

COPY --chown=node:node --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
