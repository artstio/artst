import type { Plan } from "@prisma/client";
import type { Stripe } from "stripe";
import { stripe } from "~/services/stripe/config.server";

export async function getStripeProducts(params: Stripe.ProductListParams) {
  return stripe.products.list(params);
}

export async function deleteAllStripeProducts() {
  const products = await stripe.products.list();
  await Promise.all(
    products.data.map((product) => stripe.products.del(product.id))
  );
}
