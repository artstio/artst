# Remix + Shadcn-ui Starter

A simple Remix + Shadcn-ui starter with an optimistic dark-mode based on [@kentcdodds's](https://twitter.com/kentcdodds) [client-hints](https://github.com/epicweb-dev/client-hints/tree/main) library.

## Why ?

I often reached out to implementing my own optimistic dark-mode logic every-single time I setup Shadcn-ui library, hence wanted to make this into a reusable repo that I and others can use it to quickly bootstrap a Remix starter.

## Screenshot

<img width="1107" alt="Screenshot 2024-01-25 at 14 22 47" src="https://github.com/rajeshdavidbabu/remix-shadcn-starter/assets/15684795/4611ba00-be8f-48a9-9648-a59fb56249b6">

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
