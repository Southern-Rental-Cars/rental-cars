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

/* Create payment token */
const createPaymentToken = async (paymentSource : SetupTokenRequestPaymentSource) => {
    const payPalRequestId = uuidv4(); // Generate a unique ID for the request

    const payload = {
        payPalRequestId,  // Ensure idempotency with a unique request ID
        body: {
            paymentSource: paymentSource  // Make sure payment_source is structured correctly
        },
    };

    try {
        const response = await vaultController.paymentTokensCreate(payload);
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

/* Delete payment token */
const deletePaymentTokenById = async (tokenId: string) => {
    try {
        const response = await vaultController.paymentTokensDelete(tokenId);
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

/* Get all payment tokens from customer */
const getAllPaymentMethods = async (customerId: string) => {
    try {
        const response = await vaultController.customerPaymentTokensGet({customerId});
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

/* Get payment token by id */
const getPaymentMethodbyId = async (tokenId: string) => {
    try {
        const response = await vaultController.paymentTokensGet(tokenId);
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
}

export async function POST(req: NextRequest) {
    const { paymentSource } = await req.json();
    try {
        const { jsonResponse, httpStatusCode } = await createPaymentToken(paymentSource);

        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create setup token:', error);
        return NextResponse.json({ error: 'Failed to create setup token.' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const tokenId = params.id;
    try {
        const { jsonResponse, httpStatusCode } = await deletePaymentTokenById(tokenId);

        return NextResponse.json(jsonResponse, { status: httpStatusCode });
    } catch (error) {
        console.error('Failed to create setup token:', error);
        return NextResponse.json({ error: 'Failed to create setup token.' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams, pathname } = new URL(req.url);

    const customerId = searchParams.get('customer_id');
    const paymentMethodId = /^\/payment\/([^/]+)$/.exec(pathname)?.[1];

    try {
        if (customerId) {
            const { jsonResponse, httpStatusCode } = await getAllPaymentMethods(customerId);
            return NextResponse.json(jsonResponse, { status: httpStatusCode });
        } else if (paymentMethodId) {
            const { jsonResponse, httpStatusCode } = await getPaymentMethodbyId(paymentMethodId);
            return NextResponse.json(jsonResponse, { status: httpStatusCode });
        }
        
        return NextResponse.json({
            error: 'Invalid request'
        }, { status: 400 });
    } catch (error) {
        console.error('Error:', error);

        if (error instanceof ApiError) {
            return NextResponse.json({
                error: error.message,
                details: error.result
            }, { status: error.statusCode || 500 });
        }

        return NextResponse.json({ 
            error: 'Server Error' 
        }, { status: 500 });
    }
}

