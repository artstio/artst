# base node image
FROM node:18-bullseye-slim as base
LABEL maintainer="Artst <burak@okbrk.com>"
LABEL description="Runs the Artst app"

# set for base and all layer that inherit from it
ENV NODE_ENV production
ENV K8S_SERVER_PORT=80
ENV K8S_PROBES_PORT=9000

EXPOSE ${K8S_SERVER_PORT}
EXPOSE ${K8S_PROBES_PORT}

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl
RUN apt-get update && apt-get install -y ca-certificates

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules
COPY --from=build /myapp/node_modules/.prisma /myapp/node_modules/.prisma

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
ADD . .

CMD ["npm", "start"]