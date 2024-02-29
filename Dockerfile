# lts-gallium refers to v16
# Using this instead of node:16 to avoid dependabot updates
FROM node as builder

WORKDIR /usr/src/app
COPY . .
ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}
RUN yarn install && yarn build

FROM node

ARG APP_ENV=development
ENV NODE_ENV=${APP_ENV}
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/.env .env

EXPOSE 3000
USER node
CMD [ "yarn", "start:prod" ]
