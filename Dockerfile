FROM node:24 AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install --frozen-lockfile --ignore-scripts && \
    pnpm build

###

FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY --chown=node:node --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]
