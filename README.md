# PayPal Here Tokenization

This is an OAuth site for handling PayPal Here first party authorizations.

## Environment Variables

| Variable        | Default       | Required | Description
| --------------- | ------------- | -------- | ---------------------------- |
| HTTP_PORT       | 3000          | no       | Web server port              |
| CLIENT_ID       |               | yes      | The OAuth Client ID          |
| SECRET          |               | yes      | The OAuth Secret             |
| REDIRECT_URI    |               | yes      | The redirect URI             |
| SANDBOX         | false         | no       | Is this a Sandbox deployment |

## Redirect URI

When you created the OAuth App, you had to specify a Redirect URI. It should point directly to this
microservice on the `/oath/return` endpoint. IE:

`https://example.com/oauth/return`

This entire path needs to be specified in the `REDIRECT_URI` env variable and it must match
the value you used in your OAuth app.

