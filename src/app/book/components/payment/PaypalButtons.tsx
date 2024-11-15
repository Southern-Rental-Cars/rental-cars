import React, { useState } from "react";
import {
  PayPalScriptProvider,
  usePayPalCardFields,
  PayPalCardFieldsProvider,
  PayPalButtons,
  PayPalNameField,
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

const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  components: "buttons,card-fields",
  "disable-funding": "",
  currency: "USD",
  "buyer-country": "US",
  "data-page-type": "product-details",
  "data-sdk-integration-source": "developer-studio",
};

const cardFieldStyle = {
  input: {
    "font-size": "16px",
    color: "#333",
    padding: "8px",
    "border-radius": "8px",
  },
  ".invalid": {
    color: "red",
  },
  ".paypal-number-field": {
    "font-size": "18px",
    color: "#111",
  },
};

const PaypalButtons: React.FC<PaypalButtonsProps> = ({ totalPrice, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit/Debit");
  const [saveCard, setSaveCard] = useState(false); // State for the save card checkbox
  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    adminArea1: "",
    adminArea2: "",
    countryCode: "US",
    postalCode: "",
  });

  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  const createOrder = async () => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCost: totalPrice.toFixed(2),
          saveCard, // Pass the checkbox value to the server
        }),
      });

      const orderData = await response.json();
      console.log(orderData);
      if (orderData.id) {
        return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue}: ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Order creation error:", error);
      return `Could not initiate PayPal Checkout... ${error}`;
    }
  };

  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const orderData = await response.json();
      console.log(orderData);
      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];
      if (!transaction || transaction.status === "DECLINED") {
        const errorMessage = `Transaction ${transaction?.status}: ${transaction?.id}`;
        throw new Error(errorMessage);
      }
      const paypalData = {
        paypal_order_id: data.orderID,
        paypal_transaction_id: transaction.id,
        is_paid: transaction.status === "COMPLETED",
      };
      onPaymentSuccess(paypalData);
    } catch (error) {
      console.error("Transaction approval error:", error);
    }
  };

  const onError = (error: any) => {
    console.error("PayPal error:", error);
  };

  return (
    <PayPalScriptProvider options={paypalConfig}>
      <div className="bg-white rounded-lg">
        <div className="flex mb-3 space-x-6">
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
        <div className="w-full">
          {paymentMethod === "Credit/Debit" && (
            <PayPalCardFieldsProvider createOrder={createOrder} onApprove={onApprove} onError={onError} style={cardFieldStyle}>
              <div className="credit-card-fields space-y-0">
                <PayPalNumberField/>
                <div className="grid grid-cols-2 gap-4">
                  <PayPalExpiryField/>
                  <PayPalCVVField/>
                </div>
                <PayPalNameField />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    className="border border-gray-400 rounded-lg p-2 ml-1 placeholder-gray-600"
                    type="text"
                    placeholder="Address line"
                    onChange={(e) => handleBillingAddressChange("addressLine1", e.target.value)}
                  />
                  <input
                    className="border border-gray-400 rounded-lg p-2 mr-1 placeholder-gray-600"
                    type="text"
                    placeholder="Postal code"
                    onChange={(e) => handleBillingAddressChange("postalCode", e.target.value)}
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="checkbox"
                    id="save"
                    name="save"
                    checked={saveCard}
                    onChange={() => setSaveCard(!saveCard)}
                  />
                  <label htmlFor="save" className="ml-2">Save your card</label>
                </div>
              </div>
              <SubmitPaymentButton isPaying={isPaying} setIsPaying={setIsPaying} billingAddress={billingAddress} />
            </PayPalCardFieldsProvider>
          )}
          {paymentMethod === "PayPal" && (
            <div className="mt-6">
              <PayPalButtons
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                style={{ shape: "pill", layout: "vertical", color: "gold", label: "paypal" }}
              />
            </div>
          )}
        </div>
      </div>
    </PayPalScriptProvider>
  );
};

const PaymentRadioOption: React.FC<{ label: string; value: string; selectedValue: string; onChange: (value: string) => void; }> = ({ label, value, selectedValue, onChange }) => (
  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
    <input
      type="radio"
      name="paymentMethod"
      value={value}
      checked={selectedValue === value}
      onChange={() => onChange(value)}
      className="mr-2 text-blue-600 focus:ring-blue-500"
    />
    {label}
  </label>
);

const SubmitPaymentButton: React.FC<{
  isPaying: boolean;
  setIsPaying: React.Dispatch<React.SetStateAction<boolean>>;
  billingAddress: any;
}> = ({ isPaying, setIsPaying, billingAddress }) => {
  const { cardFieldsForm } = usePayPalCardFields();

  const handleClick = async () => {
    if (!cardFieldsForm) {
      throw new Error("Unable to find any child components in the <PayPalCardFieldsProvider />");
    }

    const formState = await cardFieldsForm.getState();
    if (!formState.isFormValid) {
      return alert("The payment form is invalid");
    }

    setIsPaying(true);
    cardFieldsForm.submit().catch((err) => {
      setIsPaying(false);
      console.error("Error submitting PayPal card fields:", err);
    });
  };

  return (
    <button
      className={`mt-6 w-full p-3 bg-blue-600 text-white rounded-lg ${isPaying ? "opacity-50" : ""}`}
      onClick={handleClick}
      disabled={isPaying}
    >
      {isPaying ? "Processing..." : "Confirm Booking"}
    </button>
  );
};

export default PaypalButtons;
