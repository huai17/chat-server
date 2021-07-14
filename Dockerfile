FROM node:alpine AS build
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn build

FROM node:alpine AS prodiction
ENV NODE_ENV=production
EXPOSE 5566
WORKDIR /usr/src/app
COPY package.json .
COPY yarn.lock .
RUN yarn install --prod
COPY --from=build /usr/src/app/build build
CMD yarn start