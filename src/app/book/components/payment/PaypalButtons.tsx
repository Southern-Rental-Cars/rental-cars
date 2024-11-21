import React, { useState, useCallback } from "react";
import {
  PayPalScriptProvider,
  usePayPalCardFields,
  PayPalCardFieldsProvider,
  PayPalButtons,
  PayPalNumberField,
  PayPalExpiryField,
  PayPalCVVField,
} from "@paypal/react-paypal-js";

interface PaypalButtonsProps {
  totalPrice: number;
  onPaymentSuccess: (paypalData: {
    paypal_order_id: string;
    paypal_transaction_id: string;
    is_paid: boolean;
  }) => void;
}

const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  components: "buttons,card-fields",
  currency: "USD",
  "buyer-country": "US",
  intent: "capture",
};

const CARD_FIELD_STYLE = {
  input: {
    fontSize: "16px",
    color: "#1f2937",
    padding: "16px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    width: "100%",
    minHeight: "48px",
  },
  ".invalid": {
    borderColor: "#ef4444",
    color: "#ef4444",
    backgroundColor: "#fef2f2",
  },
};

const PaypalButtons: React.FC<PaypalButtonsProps> = ({ totalPrice, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"Credit/Debit" | "PayPal">("Credit/Debit");

  const createOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ totalCost: totalPrice.toFixed(2) }),
      });

      const orderData = await response.json();
      if (!orderData.id) throw new Error("Failed to create order");
      return orderData.id;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const orderData = await response.json();
      const transaction = orderData?.purchase_units?.[0]?.payments?.captures?.[0];

      if (!transaction || transaction.status === "DECLINED") {
        throw new Error("Payment failed");
      }

      onPaymentSuccess({
        paypal_order_id: data.orderID,
        paypal_transaction_id: transaction.id,
        is_paid: transaction.status === "COMPLETED",
      });
    } catch (error) {
      console.error("Payment capture error:", error);
      throw error;
    } finally {
      // Do not reset `isPaying` here; let the parent handle it
    }
  };

  const onError = useCallback((error: any) => {
    console.error("PayPal error:", error);
    alert("Payment failed. Please try again.");
    setIsPaying(false); // Reset `isPaying` on error
  }, []);

  return (
    <PayPalScriptProvider options={PAYPAL_CONFIG}>
      <div className="w-full max-w-2xl mx-auto bg-white">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-6">
          <PaymentRadioOption
            label="Credit/Debit"
            value="Credit/Debit"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          <PaymentRadioOption
            label="PayPal"
            value="PayPal"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {paymentMethod === "Credit/Debit" ? (
          <PayPalCardFieldsProvider
            createOrder={createOrder}
            onApprove={async (data) => {
              setIsPaying(true); // Indicate payment is in progress
              await onApprove(data); // Capture the payment
            }}
            onError={onError}
            style={CARD_FIELD_STYLE}
          >
            <CreditCardForm isPaying={isPaying} setIsPaying={setIsPaying} />
          </PayPalCardFieldsProvider>
        ) : (
          <div className="mt-6">
            <PayPalButtons
              createOrder={createOrder}
              onApprove={async (data) => {
                setIsPaying(true); // Indicate payment is in progress
                await onApprove(data); // Capture the payment
              }}
              onError={onError}
              style={{ layout: "vertical" }}
            />
          </div>
        )}
      </div>
    </PayPalScriptProvider>
  );
};

const CreditCardForm: React.FC<{
  isPaying: boolean;
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isPaying, setIsPaying }) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardFieldsForm) return;

    try {
      setIsPaying(true);
      const formState = await cardFieldsForm.getState();

      if (!formState.isFormValid) {
        throw new Error("Please check your card details");
      }

      await cardFieldsForm.submit();
    } catch (error) {
      console.error("Payment submission error:", error);
      alert(error instanceof Error ? error.message : "Payment failed. Please try again.");
      setIsPaying(false); // Reset on failure
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PayPalNumberField />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <PayPalExpiryField />
        <PayPalCVVField />
      </div>

      <div className="w-full mt-4">
        <button
          type="submit"
          disabled={isPaying}
          className="w-full px-5 py-3 bg-blue-600 text-white text-md font-medium rounded-md
                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isPaying ? "Processing..." : `Confirm Booking`}
        </button>
      </div>
      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600">
          By clicking Confirm Booking you agree to the{" "}
          <a
            href="/terms-and-conditions"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
          .
        </span>
      </div>
    </form>
  );
};

const PaymentRadioOption: React.FC<{
  label: string;
  value: "Credit/Debit" | "PayPal";
  selectedValue: string;
  onChange: (value: "Credit/Debit" | "PayPal") => void;
}> = ({ label, value, selectedValue, onChange }) => (
  <label className="flex items-center cursor-pointer group">
    <input
      type="radio"
      value={value}
      checked={selectedValue === value}
      onChange={() => onChange(value)}
      className="h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
    />
    <span className="ml-3 text-base font-medium text-gray-700 group-hover:text-gray-900">
      {label}
    </span>
  </label>
);

export default PaypalButtons;
