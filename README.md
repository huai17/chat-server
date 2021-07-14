# Chat-Server

A simple chat server built with socket.io.

## Development Environment

You need to install NodeJS in your local machine.

First, install dependancies with `yarn install` or `npm install`.

Then, start the dev server with `yarn dev` or `npm run dev`.

The development server will restart automatically while you modify the source code.

## Test Environment

The test environment is the same as development environment.

Instead of starting the server, run the test with `yarn test` or `npm run test`.

## Production Environment

- NodeJS

You need to install NodeJS in your local machine.

First, install dependancies with `yarn install` or `npm install`.

Second, build the server with `yarn build` or `npm run build`.

Then, set environment variable `NODE_ENV=production`.

Finally, start the prod server with `yarn start` or `npm start`.

- Docker

You need to install Docker in your local machine.

Build and start the prod server with `docker-compose up`.

## Port Config

The server listen on port 5566 by default.

You can change the default port in file: `src/index.ts`.

For Docker, the port setting is in file: `dicker-compose.yaml`.
