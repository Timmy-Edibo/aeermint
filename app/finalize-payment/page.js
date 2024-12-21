"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useRouter } from "next/navigation";
import { baseUrl } from "../../utils/constants";

export default function FinalizePayment() {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptPin, setPromptPin] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const router = useRouter();
  const param = useSearchParams();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      // Update the pin state
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);

      // Move to the next input if the current one is filled
      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (pin[index] === "") {
        // Move focus to the previous input if current is empty
        if (index > 0) {
          document.getElementById(`pin-input-${index - 1}`).focus();
        }
      }
      // Clear the current input
      const updatedPin = [...pin];
      updatedPin[index] = "";
      setPin(updatedPin);
    }
  };

  const finalizeTransaction = async () => {
    if (!pin) {
      ToastDisplay("Please enter the transaction pin", "error");
      return;
    }

    const transactionPin = pin.join(""); // Combine PIN digits into a single string
    if (transactionPin.length !== 4) {
      ToastDisplay("Please enter a 4-digit transaction pin", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/transactions/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(param.get("amount")), // Ensure valid number
          routableNumber: param.get("routableNumber"),
          transactionPin: transactionPin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Transaction failed");
      }

      const data = await response.json();
      setTransactionDetails(data);

      // Redirect after successful transaction
      setTimeout(() => {
        router.push("/wallets");
      }, 3000);
    } catch (error) {
      console.error("Error finalizing transaction:", error.message);
      ToastDisplay(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setPromptPin(true); // Show the pin prompt
  };

  const handleCancel = () => {
    setPromptPin(false); // Reset pin prompt view
    setPin(""); // Clear the pin input
  };

  return (
    <Layout breadcrumbTitle="Complete Process">
      <div className="verification section-padding">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              {!promptPin ? (
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Exchange Details</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <span className="text-primary">
                                Exchange Amount
                              </span>
                            </td>
                            <td>
                              <span className="text-primary">
                                {param.get("amount")} {param.get("currency")}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>Payment Method</td>
                            <td>Airtime Balance</td>
                          </tr>
                          <tr>
                            <td>Exchange Rate</td>
                            <td>{param.get("exchangeRate")}</td>
                          </tr>
                          <tr>
                            <td>Fee</td>
                            <td>{param.get("serviceCharge")}</td>
                          </tr>
                          <tr>
                            <td>Total</td>
                            <td>{param.get("totalAmount")}</td>
                          </tr>
                          <tr>
                            <td>Vat</td>
                            <td>
                              <div className="text-danger">0.25</div>
                            </td>
                          </tr>
                          <tr>
                            <td> Required Units</td>
                            <td>{param.get("requiredUnits")}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-3">
                      <button
                        onClick={handleComplete}
                        className="btn btn-primary"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => router.back()}
                        className="btn btn-secondary btn-danger"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Pin Input</h4>
                  </div>
                  <div className="card-body">
                    <div>
                      <div className="d-flex justify-content-center mb-4">
                        {pin.map((digit, index) => (
                          <input
                            key={index}
                            id={`pin-input-${index}`}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) =>
                              handleChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="form-control mx-1 text-center"
                            style={{
                              height: "50px",
                              fontSize: "24px",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          />
                        ))}
                      </div>
                      <div className="d-flex justify-content-center gap-3 mt-3">
                        <button
                          onClick={finalizeTransaction}
                          className="btn btn-primary"
                          disabled={loading} // Disable while processing
                        >
                          {loading ? "Processing..." : "Submit Pin"}
                        </button>

                        <button
                          onClick={handleCancel}
                          className="btn btn-secondary btn-danger"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {transactionDetails && (
          <ToastDisplay
            show={true}
            title="Transaction Details"
            message={`STATUS: ${transactionDetails?.message}`}
            type="success"
          />
        )}
      </div>
    </Layout>
  );
}
