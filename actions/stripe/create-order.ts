"use server";

import stripe from "@/lib/stripe";

type OrderType = {
  redirectUrl: string;
};

export const createOrder = async (params: OrderType) => {
  const tempPrice = 100;

  try {
    const taxRate = await stripe.taxRates.create({
      display_name: "Sales Tax",
      description: "Goods & Service Tax",
      jurisdiction: "US - CA",
      percentage: 10,
      inclusive: false
    });

    // https://docs.stripe.com/api/checkout/sessions/create
    let payment = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: "_user._id",
      payment_method_types: ["card"],
      // customer: customer.id,
      customer_email: "sacreddevking@gmail.com",
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Product Name",
              description: "Description of Product",
              // description: membership.description + " - " + moment().add(membership.period, 'months').format("YYYY-MM-DD HH:mm:ss"),
              images: ["https://answersheet.au/logo.svg"] // image would be shown on payment page
            },
            unit_amount: Number(Math.round((tempPrice / 1.1) * 100))
          },
          tax_rates: [taxRate.id],
          quantity: 1
        }
      ],
      // success_url: `${process.env.NEXT_PUBLIC_APP_URL}/private-membership`,
      // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/private-membership`
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}${params.redirectUrl}?gateway=stripe&session_id={CHECKOUT_SESSION_ID}&history_id=history_id`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}${params.redirectUrl}?gateway=cancelled`
    });

    return {
      success: true,
      payment
    };
  } catch (error) {
    return {
      success: false,
      error
    };
  }
};