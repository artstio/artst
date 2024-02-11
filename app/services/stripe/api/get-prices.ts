import type { Plan } from "@prisma/client";
import type { Stripe } from "stripe";
import { stripe } from "~/services/stripe/config.server";

export async function getStripePrices(params: Stripe.PriceListParams) {
  return stripe.prices.list(params);
}

export async function deleteAllStripePrices() {
  const prices = await stripe.prices.list();
  await Promise.all(
    prices.data.map((price) =>
      stripe.prices.update(price.id, { active: false })
    )
  );
}
