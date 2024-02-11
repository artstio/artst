import { PrismaClient } from "@prisma/client";
// import { db } from "~/utils/db.server";

import { getAllPlans } from "~/models/plan/get-plan";
// import { PRICING_PLANS } from "~/services/stripe/plans";
// import { configureStripeCustomerPortal } from "~/services/stripe/api/configure-customer-portal";
// import { getStripePrices } from "~/services/stripe/api/get-prices";

const prisma = new PrismaClient();

async function seed() {
  const plans = await getAllPlans();
  if (plans.length > 0) {
    console.log("🎉 Plans has already been seeded.");
    return;
  }

  // const seedProducts = Object.values(PRICING_PLANS).map(
  //   async ({
  //     id,
  //     name,
  //     description,
  //     limits,
  //     // prices
  //   }) => {
  //     // Format prices to match Stripe's API.
  //     // const pricesByInterval = Object.entries(prices).flatMap(
  //     //   ([interval, price]) => {
  //     //     return Object.entries(price).map(([currency, amount]) => ({
  //     //       interval,
  //     //       currency,
  //     //       amount,
  //     //     }));
  //     //   }
  //     // );

  //     // await createStripeProduct({
  //     // 	id,
  //     // 	name,
  //     // 	description: description || undefined,
  //     // });

  //     // Create Stripe price for the current product.
  //     // const stripePrices = await Promise.all(
  //     // 	pricesByInterval.map(price => {
  //     // 		return createStripePrice(id, price);
  //     // 	}),
  //     // );

  //     const { data: stripePrices } = await getStripePrices({ product: id });
  //     // Store product into database.
  //     try {
  //       await db.plan.upsert({
  //         where: {
  //           id,
  //         },
  //         update: {
  //           name,
  //           description,
  //           limits: {
  //             update: {
  //               maxItems: limits.maxItems,
  //             },
  //           },
  //           prices: {
  //             upsert: stripePrices.map((price) => ({
  //               where: {
  //                 id: price.id,
  //               },
  //               update: {
  //                 amount: price.unit_amount ?? 0,
  //                 currency: price.currency,
  //                 interval: price.recurring?.interval ?? "month",
  //                 active: price.active,
  //               },
  //               create: {
  //                 id: price.id,
  //                 amount: price.unit_amount ?? 0,
  //                 currency: price.currency,
  //                 interval: price.recurring?.interval ?? "month",
  //                 active: price.active,
  //               },
  //             })),
  //           },
  //         },
  //         create: {
  //           id,
  //           name,
  //           description,
  //           limits: {
  //             create: {
  //               maxItems: limits.maxItems,
  //             },
  //           },
  //           prices: {
  //             connectOrCreate: stripePrices.map((price) => ({
  //               where: {
  //                 id: price.id,
  //               },
  //               create: {
  //                 id: price.id,
  //                 amount: price.unit_amount ?? 0,
  //                 currency: price.currency,
  //                 interval: price.recurring?.interval ?? "month",
  //                 active: price.active,
  //               },
  //             })),
  //           },
  //         },
  //       });
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         console.error(error.message);
  //       }
  //     }

  //     // Return product ID and prices.
  //     // Used to configure the Customer Portal.
  //     return {
  //       product: id,
  //       prices: stripePrices.map((price) => price.id),
  //     };
  //   }
  // );

  // Create Stripe products and stores them into database.
  // const seededProducts = await Promise.all(seedProducts);
  console.log(`📦 Stripe Products has been successfully created.`);

  // Configure Customer Portal.
  // await configureStripeCustomerPortal(seededProducts);
  console.log(`👒 Stripe Customer Portal has been successfully configured.`);
  console.log(
    "🎉 Visit: https://dashboard.stripe.com/test/products to see your products."
  );
}

seed()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
