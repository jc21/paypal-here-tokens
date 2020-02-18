# PayPal Here Tokenization

This is an OAuth site for handling PayPal Here first party authorizations.


## Environment Variables

| Variable        | Default       | Required | Description
| --------------- | ------------- | -------- | ---------------------------- |
| SERVER_ID       |               | yes      | A unique ID for this server  |
| CLIENT_ID       |               | yes      | The OAuth Client ID          |
| SECRET          |               | yes      | The OAuth Secret             |
| REDIRECT_URI    |               | yes      | The redirect URI             |
| SANDBOX         | false         | no       | Is this a Sandbox deployment |
| HTTP_PORT       | 3000          | no       | Web server port              |


## Server ID

This paramater should be some random string that uniquely identifies this instance of the nodejs app.

A refresh token that is generated via this app with a particular server id is no longer usable if the server
id is changed. So if you find that your refresh tokens are compromised or you just want to invalidate all
of them, change the server id.


## Redirect URI

When you created the OAuth App, you had to specify a Redirect URI. It should point directly to this
microservice on the `/oath/return` endpoint. IE:

`https://example.com/oauth/return`

This entire path needs to be specified in the `REDIRECT_URI` env variable and it must match
the value you used in your OAuth app.

