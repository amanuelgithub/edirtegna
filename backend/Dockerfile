#-------------------
# Development
#-------------------
FROM node:20-alpine AS development

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY  package*.json ./

RUN npm i --loglevel verbose --fetch-timeout=600000 --legacy-peer-deps

COPY  . .

# ENTRYPOINT [ "node", "dist/cli.js" ]
CMD ["ts-node", "-r", "tsconfig-paths/register", "apps/api/src/cli.ts"]
#-------------------
# Production Build
#-------------------
FROM node:20-alpine AS prod-build

RUN apk update && apk add curl bash g++ make && rm -rf /var/cache/apk/*

# install node-prune (https://github.com/tj/node-prune)
RUN curl -sf https://gobinaries.com/tj/node-prune | bash -s -- -b /usr/local/bin

WORKDIR /usr/src/app

COPY package*.json ./

# copy node_modules
COPY --from=development /usr/src/app/node_modules ./node_modules

# copy source files
COPY . .

# build application
RUN npm run build

# remove development dependencies
RUN npm prune --omit=dev

# run node prune
RUN /usr/local/bin/node-prune

# remove unused dependencies
RUN rm -rf node_modules/rxjs/src/
RUN rm -rf node_modules/rxjs/bundles/
RUN rm -rf node_modules/rxjs/_esm5/
RUN rm -rf node_modules/rxjs/_esm2015/
RUN rm -rf node_modules/swagger-ui-dist/*.map

COPY ./resources ./resources

#-------------------
# Production
#-------------------
FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV production

# copy from production build image
COPY --from=prod-build /usr/src/app/dist ./dist
COPY --from=prod-build /usr/src/app/env ./env
COPY --from=prod-build /usr/src/app/node_modules ./node_modules

FROM production AS api

CMD [ "node", "./dist/apps/api/main.js" ]

FROM production AS worker

CMD [ "node", "./dist/apps/job/main.js" ]

