const assert = require('assert');
const crypto = require('crypto');
const GithubWebhookValidator = require('./index');

const secret = '8b6cac4f7acb75a7012e6e9df2bacba779647819';

function createSignature(key, body) {
    return 'sha1=' + crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex');
}

function createEvent(hasEvent, hasDelivery, hasSignature, falseBody) {

    const body = JSON.stringify({ id: '1' });

    let headers = {};

    if (hasEvent) {
        headers['X-GitHub-Event'] = 'event';
    }

    if (hasDelivery) {
        headers['X-GitHub-Delivery'] = 'delivery';
    }

    if (hasSignature) {
        headers['X-Hub-Signature'] = createSignature(secret, body);
    }

    return {
        headers: headers,
        body: falseBody ? 'bad body' : body
    };
}

let callback;
let validator;
let lambdaEvent;

describe('GithubWebhookValidator', () => {

    it ('No secret configured, fail with 500', () => {

        callback = (err, response) => {
            assert.equal(response.statusCode, 500);
        };

        validator = new GithubWebhookValidator({});
        lambdaEvent = createEvent(true, true, true, false);

        validator.validate(lambdaEvent, callback);
    });

    it ('No signature header, fail with 401', () => {

        callback = (err, response) => {
            assert.equal(response.statusCode, 401);
        };

        validator = new GithubWebhookValidator({ secret: secret });
        lambdaEvent = createEvent(true, true, false, false);

        validator.validate(lambdaEvent, callback);
    });

    it ('No event header, fail with 422', () => {

        callback = (err, response) => {
            assert.equal(response.statusCode, 422);
        };

        validator = new GithubWebhookValidator({ secret: secret });
        lambdaEvent = createEvent(false, true, true, false);

        validator.validate(lambdaEvent, callback);
    });

    it ('No delivery header, fail with 422', () => {

        callback = (err, response) => {
            assert.equal(response.statusCode, 422);
        };

        validator = new GithubWebhookValidator({ secret: secret });
        lambdaEvent = createEvent(true, false, true, false);

        validator.validate(lambdaEvent, callback);
    });

    it ('Signature does not match, fail with 401', () => {

        callback = (err, response) => {
            assert.equal(response.statusCode, 401);
        };

        validator = new GithubWebhookValidator({ secret: secret });
        lambdaEvent = createEvent(true, true, true, true);

        validator.validate(lambdaEvent, callback);
    });

});
