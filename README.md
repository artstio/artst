# Artst

## Development

From your terminal:

```sh
npm install
npm run dev
```

## Stripe Webhook Envs

In order to start receiving Stripe Events to our Webhook Endpoint, we'll require to install the Stripe CLI. Once installed run the following command in your console:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should give you a Webhook Secret Key. Copy and paste it into your .env file as DEV_STRIPE_WEBHOOK_ENDPOINT.

Important

This command should be running in your console while developing.
