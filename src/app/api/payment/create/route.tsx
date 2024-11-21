import { NextRequest, NextResponse } from 'next/server';
import { Client, Environment, LogLevel, ApiError, VaultController, SetupTokenRequestPaymentSource } from '@paypal/paypal-server-sdk';
import { v4 as uuidv4 } from 'uuid';

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

const vaultController = new VaultController(client);

const createSetupToken = async (paymentSource : SetupTokenRequestPaymentSource) => {
    const payPalRequestId = uuidv4(); // Generate a unique ID for the request

    const payload = {
        payPalRequestId,  // Ensure idempotency with a unique request ID
        body: {
            paymentSource: paymentSource 
        },
    };

    try {
        const response = await vaultController.setupTokensCreate(payload);
        return {
            jsonResponse: response.result,
            httpStatusCode: response.statusCode,
        };
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('PayPal API error:', error);
            throw new Error(error.message);
        }
        return {
            jsonResponse: { error: 'Unknown error occurred' },
            httpStatusCode: 500,
        };
    }
};

const getSetupToken = async (tokenId: string) => {
    try {
        const response = await vaultController.setupTokensGet(tokenId);

        return {
            jsonResponse : response.result,
            httpStatusCode: response.statusCode,
        };  
    } catch (error) {
        if (error instanceof ApiError) {
            console.error("Paypal API error:", error);
            throw new Error(error.message);
        }
        return {
            jsonResponse: {error: "Server error"},
            httpStatusCode: 500
        }
    }
};

export async function POST(req: NextRequest) {
    const { paymentSource } = await req.json();
    try {
        const { jsonResponse, httpStatusCode } = await createSetupToken(paymentSource);

        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create setup token:', error);
        return NextResponse.json({ error: 'Failed to create setup token.' }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const tokenId = params.id;
    try {
        const { jsonResponse, httpStatusCode } = await getSetupToken(tokenId);

        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create setup token:', error);
        return NextResponse.json({ error: 'Failed to create setup token.' }, { status: 500 });
    }
}
