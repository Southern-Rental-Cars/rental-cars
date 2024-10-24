import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, LogLevel, OrdersController, ApiError, CheckoutPaymentIntent } from '@paypal/paypal-server-sdk';

const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';

const client = new Client({
    clientCredentialsAuthCredentials: {
        oAuthClientId: PAYPAL_CLIENT_ID,
        oAuthClientSecret: PAYPAL_CLIENT_SECRET,
    },
    environment: Environment.Sandbox,
    logging: {
        logLevel: LogLevel.Info,
        logRequest: { logBody: true },
        logResponse: { logHeaders: true },
    },
});

const ordersController = new OrdersController(client);

const createOrder = async (totalCost: string) => {
  const payload = {
    body: {
      intent: CheckoutPaymentIntent.CAPTURE,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD', // Corrected format
            value: totalCost,
          },
        },
      ],
    },
    prefer: 'return=minimal',
  };

  try {
    // Making the API call and getting response from PayPal SDK
    const { body, ...httpResponse } = await ordersController.ordersCreate(payload);
    const jsonResponse = JSON.parse(body.toString());

    return {
      jsonResponse,
      httpStatusCode: httpResponse.statusCode,
    };

  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(error.message);
    }
    // Handle unknown errors
    return {
      jsonResponse: { error: 'Unknown error occurred' },
      httpStatusCode: 500,
    };
  }
};



export async function POST(req: NextRequest) {
    const {totalCost} = await req.json();
    try {
        const { jsonResponse, httpStatusCode } = await createOrder(totalCost);
        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }
}
