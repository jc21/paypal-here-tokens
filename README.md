# PayPal Here Tokenization

This is an OAuth site for handling PayPal Here first party authorizations.


## Environment Variables

| Variable        | Default       | Required | Description
| --------------- | ------------- | -------- | ------------------------------- |
| SERVER_ID       |               | yes      | A unique ID for this server     |
| CLIENT_ID       |               | yes      | The OAuth Client ID             |
| SECRET          |               | yes      | The OAuth Secret                |
| ROOT_URL        |               | yes      | The hosted root of this service |
| SANDBOX         | false         | no       | Is this a Sandbox deployment    |
| HTTP_PORT       | 3000          | no       | Web server port                 |


## Root URL

This service needs to know where it's publicly hosted. For example: `https://paypal-here.example.com`
or if this is hosted as a sub-path: `https://example.com/paypal-here`


## Server ID

This paramater should be some random string that uniquely identifies this instance of the nodejs app.

A refresh token that is generated via this app with a particular server id is no longer usable if the server
id is changed. So if you find that your refresh tokens are compromised or you just want to invalidate all
of them, change the server id.


## Redirect URI

When you created the OAuth App, you had to specify a Redirect URI. It should point directly to this
microservice on the `/oath/return` endpoint. IE:

`https://paypal-here.example.com/oauth/return`
or
`https://example.com/paypal-here/oauth/return`

Viewing the root `/` of this service will give you some parameters that you should use in your
oauth app setup.
