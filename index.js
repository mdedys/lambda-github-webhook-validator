const crypto = require('crypto');

function signRequestBody(key, body) {
    return 'sha1=' + crypto.createHmac('sha1', key).update(body, 'utf-8').digest('hex');
}

class GithubWebhookValidator {

    constructor(options) {
        this.secret = options.secret;
    }

    isSignatureValid(event, callback) {

        const headers = event.headers;
        const sig = headers['X-Hub-Signature'];
        const githubEvent = headers['X-GitHub-Event'];
        const id = headers['X-GitHub-Delivery'];

        if (!this.secret) {
            callback(null, {
                statusCode: 500,
                headers: { 'Content-Type': 'text/plain' },
                body: 'No github secret provided'
            });

            return false;
        }

        const calculatedSig = signRequestBody(this.secret, event.body);

        if (!sig) {
            callback(null, {
                statusCode: 401,
                headers: { 'Content-Type': 'text/plain' },
                body: 'No github signature found on request'
            });

            return false;
        }

        if (!githubEvent || !id) {
            callback(null, {
                statusCode: 422,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Not a valid github event'
            });

            return false;
        }

        if (sig !== calculatedSig) {
            callback(null, {
                statusCode: 401,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Github signature does not match'
            });

            return false;
        }

        return true;
    }
}

module.exports = GithubWebhookValidator;
