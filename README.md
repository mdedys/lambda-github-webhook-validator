[![NPM version][npm-image]][npm-url]
[![Build status][ci-image]][ci-url]
[![Coverage Status](https://coveralls.io/repos/github/mdedys/lambda-github-webhook-validator/badge.svg)](https://coveralls.io/github/mdedys/lambda-github-webhook-validator)

# Github request validator for AWS Lambda

Validates a github webhook event is correct. It will check the signature and all releveants headers that should exist.

## Development

Install dependecies

```shell
yarn install
```

## Tests

```shell
yarn test
```

## How to use

The validator will call the lambda callback a response and return false if it fails to verify
at any point the github request.

The responses are listed below:

* 401 - *No github signature found on request*
* 401 - *Github signature does not match*
* 422 - *Not a valid github event*

```javascript

const GithubWebhookValidator = require('lambda-github-webhook-validator');

const validator = GithubWebhookValidator({ secret: aSecret });

module.exports.handler = function(event, context, callback) => {
  if (validator.isSignatureValid(event, callback) {
      // Do work
  }
}

```

[npm-url]: https://npmjs.org/package/lambda-github-webhook-validator
[npm-image]: https://img.shields.io/npm/v/lambda-github-webhook-validator.png
[ci-url]: https://travis-ci.org/mdedys/lambda-github-webhook-validator
[ci-image]: https://img.shields.io/travis-ci/mdedys/lambda-github-webhook-validator.svg
