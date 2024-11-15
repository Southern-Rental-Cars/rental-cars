import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, LogLevel, OrdersController, ApiError, CheckoutPaymentIntent, StoreInVaultInstruction, CardVerificationMethod } from '@paypal/paypal-server-sdk';

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

const createOrder = async (totalCost: string, saveCard: boolean) => {
  const payload = {
    body: {
      intent: CheckoutPaymentIntent.CAPTURE,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: totalCost,
          },
        },
      ],
      paymentSource: {
        card: {
          attributes: {
            vault: {
              storeInVault: StoreInVaultInstruction.ONSUCCESS
            },
            verification: {
              method: CardVerificationMethod.SCAALWAYS
            }
          }
        },
      },
    },
    prefer: 'return=minimal',
  };

  try {
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
    return {
      jsonResponse: { error: 'Unknown error occurred' },
      httpStatusCode: 500,
    };
  }
};


export async function POST(req: NextRequest) {
    const {totalCost, saveCard} = await req.json();
    try {
        const { jsonResponse, httpStatusCode } = await createOrder(totalCost, saveCard);
        console.log("Response JSON:", JSON.stringify(jsonResponse, null, 2));

        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create order:', error);
        return NextResponse.json({ error: 'Failed to create order.' }, { status: 500 });
    }
}
