import { NextRequest, NextResponse } from 'next/server';
import {
    Client,
    Environment,
    LogLevel,
    OrdersController,
    ApiError,
} from '@paypal/paypal-server-sdk';

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

// Capture PayPal Order
const captureOrder = async (orderID: string) => {
    const payload = { id: orderID, prefer: 'return=minimal'};
    try {
        const { body, ...httpResponse } = await ordersController.ordersCapture(payload);
        console.log("BODY: " + body);
        console.log("http response: " + httpResponse.statusCode);
        return { jsonResponse: JSON.parse(body.toString()), httpStatusCode: httpResponse.statusCode };
    } catch (error) {
        if (error instanceof ApiError) {
          console.error("PayPal API Error:", error.message);
          return { jsonResponse: { error: error.message }, httpStatusCode: error.statusCode || 500 };
        }
        return { jsonResponse: { error: "Unknown error occurred during order capture." }, httpStatusCode: 500};
      }
};

export async function POST(req: NextRequest) {
    const pathSegments = req.nextUrl.pathname.split('/'); // Split the URL by slashes
    const orderID = pathSegments[pathSegments.length - 2]; // Get the second last part of the path (which is the orderID)
    console.log("ORDERID: " + orderID);
    try {
        if (!orderID) { throw new Error("Order ID is missing"); }
        const { jsonResponse, httpStatusCode } = await captureOrder(orderID as string);
        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to capture order:', error);
        return NextResponse.json({ error: 'Failed to capture order.' }, { status: 500 });
    }
}
