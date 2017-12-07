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

The validator will return a response if it fails to verify at any point the github request.
The responses are listed below:

* 401 - *No github signature found on request* 
* 401 - *Github signature does not match*
* 422 - *Not a valid github event*

```javascript

const GithubWebhookValidator = require('lambda-github-webhook-validator');

const validator = GithubWebhookValidator({ secret: aSecret });

module.exports.handler = function(event, context, callback) => {
  validator.validate(event, callback);
}

```
