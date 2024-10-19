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
    totalPrice: number; // Define the totalPrice prop
    onPaymentSuccess: () => void; // Add callback for payment success
  }

// PayPal configuration
const paypalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  components: "buttons,card-fields",
  "disable-funding": "",
  currency: "USD",
  "buyer-country": "US",
  "data-page-type": "product-details",
  "data-sdk-integration-source": "developer-studio",
};

// Custom style for card fields
const cardFieldStyle = {
    input: {
      "font-size": "16px", // This corresponds to text-base in Tailwind
      "font-family": "Arial, sans-serif", // Use font-sans for this in Tailwind
      color: "#333", // Corresponds to text-gray-800 in Tailwind
      padding: "8px", // p-2 in Tailwind
      "border-radius": "8px", // rounded-lg in Tailwind
      "border": "1px solid #ddd", // border-gray-300 in Tailwind
    },
    ".invalid": {
      color: "red", // text-red-500 in Tailwind
    },
    ".paypal-number-field": {
      "font-size": "18px", // text-lg in Tailwind
      color: "#111", // text-gray-800 in Tailwind
    },
  };
  

const PaypalButtons: React.FC<PaypalButtonsProps> = ({ totalPrice, onPaymentSuccess }) => {
  const [isPaying, setIsPaying] = useState(false);
  const [billingAddress, setBillingAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    adminArea1: "",
    adminArea2: "",
    countryCode: "US",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Handle billing address changes
  const handleBillingAddressChange = (field: string, value: string) => {
    setBillingAddress((prevAddress) => ({
      ...prevAddress,
      [field]: value,
    }));
  };

  // Create PayPal order
  const createOrder = async () => {
    console.log("INSIDE createOrder");
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalCost: totalPrice.toFixed(2),
        }),
      });

      const orderData = await response.json();
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

  // Handle PayPal payment approval
  const onApprove = async (data: any) => {
    try {
      const response = await fetch(`/api/orders/${data.orderID}/capture`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const orderData = await response.json();
      console.log("INSIDE ONAPPROVE: " + orderData);

      const transaction =
        orderData?.purchase_units?.[0]?.payments?.captures?.[0] ||
        orderData?.purchase_units?.[0]?.payments?.authorizations?.[0];

      if (!transaction || transaction.status === "DECLINED") {
        const errorMessage = `Transaction ${transaction?.status}: ${transaction?.id}`;
        throw new Error(errorMessage);
      }
      // Call the callback to notify the parent component of payment success
      onPaymentSuccess();
    } catch (error) {
      console.error("Transaction approval error:", error);
    }
  };

  // Handle PayPal errors
  const onError = (error: any) => {
    console.error("PayPal error:", error);
  };

  return (
    <PayPalScriptProvider options={paypalConfig}>
      {/* Container with consistent width */}
      <div className="bg-white rounded-lg">
        {/* Payment Method Selection */}
        <div className="flex mb-6 space-x-6">
          <PaymentRadioOption
            label="Credit Card"
            value="Credit Card"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          <PaymentRadioOption
            label="PayPal"
            value="PayPal"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
          <PaymentRadioOption
            label="Google Pay"
            value="Google Pay"
            selectedValue={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        {/* Consistent width for Credit Card and PayPal */}
        <div className="w-full">
          {paymentMethod === "Credit Card" && (
            <PayPalCardFieldsProvider createOrder={createOrder} onApprove={onApprove} onError={onError} style={cardFieldStyle}>
              <div className="credit-card-fields space-y-0">
                <PayPalNumberField/>
                <div className="grid grid-cols-2 gap-4">
                  <PayPalExpiryField/>
                  <PayPalCVVField/>
                </div>
                <PayPalNameField />
                {/* Billing Address */}
                <div className="grid grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Address line"
                    onChange={(e) => handleBillingAddressChange("addressLine1", e.target.value)}
                    />

                    <input
                    type="text"
                    placeholder="Postal/zip code"
                    onChange={(e) => handleBillingAddressChange("postalCode", e.target.value)}
                    />
                </div>
              </div>
              {/* Submit Payment Button */}
              <SubmitPaymentButton isPaying={isPaying} setIsPaying={setIsPaying} billingAddress={billingAddress} />
            </PayPalCardFieldsProvider>
          )}
          {/* PayPal Payment Buttons */}
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

// Payment Radio Option Component
const PaymentRadioOption: React.FC<{
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}> = ({ label, value, selectedValue, onChange }) => (
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

// Submit Payment Button Component
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
    cardFieldsForm.submit({ billingAddress }).catch((err) => {
      setIsPaying(false);
      console.error("Error submitting PayPal card fields:", err);
    });
  };
  
  return (
    <button
      className={`mt-6 w-full p-3 bg-blue-600 text-white rounded-lg ${isPaying ? "opacity-50" : ""}`}
      onClick={handleClick}
      disabled={isPaying} >
      {isPaying ? "Processing..." : "Pay"}
    </button>
  );
};

export default PaypalButtons;
