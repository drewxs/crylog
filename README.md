# Crylog

A decentralized content management system.

## Prerequisites

This project requires NodeJS (version 16 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/).
To make sure you have them available on your machine,
try running the following command.

```shell
$ npm -v && node -v
```

## Configuration

Create a copy of .env.local.example and rename it to .env.local <br>
Update the values in .env.local to match your environment.

## Installation

Install dependencies:

```shell
$ yarn install
```

## Development

Run the local node:

```shell
$ yarn node-local
```

Deploy the local node to the local network:

```shell
$ yarn deploy-local
```

Run the application in development mode:

```shell
$ yarn dev
```

## Production Build

To build:

```shell
$ yarn build
```

Start the built application:

```shell
$ yarn start
```

## License

Copyright ©2022 [Andrew X. Shah](https://github.com/kito0).<br />
[MIT](https://github.com/kito0/crylog/blob/master/LICENSE) licensed.
