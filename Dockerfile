FROM node:18 AS builder

WORKDIR /app

COPY . .

RUN yarn add shx -W --ignore-scripts && \
    yarn install --ignore-scripts && \
    yarn playwright install --with-deps && \
    yarn build

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
