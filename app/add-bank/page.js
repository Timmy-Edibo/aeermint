"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { useRouter } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import Loading from "../loading";
import { baseUrl } from "../../utils/constants";
import VendorDetails from "./VendorDetails";

export default function AddBank() {
  const [vendor, setVendor] = useState(null);
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState("accountNumber");
  const router = useRouter();

  const fetchVendorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${baseUrl}/vendor/auth/vendor-detail?routableNumber=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!response.ok) {
        // Attempt to parse the error message from the response
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();
      setVendor(data?.data);
    } catch (error) {
      console.error(error.message);
      setError(error.message); // Save error message to display
    } finally {
      setLoading(false);
    }
  };

  const initiateTransaction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: amount > 0 ? parseInt(amount) : 0,
          routableNumber: vendor?.account?.routable?.routableNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();

      // Use the response data directly for routing
      const encodedString = `routableNumber=${vendor?.account?.routable?.routableNumber}&amount=${amount}&currency=${vendor?.account?.currency}&info=${data?.data?.message}&exchangeRate=${data?.data?.exchangeRate}&requiredUnits=${data?.data?.requiredUnits}&serviceCharge=${data?.data?.serviceCharge}&totalAmount=${data?.data?.totalAmount}`
      router.push(
        `/finalize-payment?${encodedString}`
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStage("accountNumber");
  }, []);

  const handleSetAmount = (e) => {
    e.preventDefault();
    setAmount(e.target.value);
  };

  const handlePay = (e) => {
    e.preventDefault();
    initiateTransaction();
  };

  const handleFindVendor = (e) => {
    e.preventDefault();
    fetchVendorDetails();
    setStage("vendorDetails");
  };

  return (
    <>
      <Layout breadcrumbTitle="Initiate Purchase">
        {loading && <Loading />}
        <div className="verification section-padding">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-xl-5 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Find vendor account</h4>
                  </div>
                  <div className="card-body">
                    {stage === "accountNumber" && (
                      <form onSubmit={(e) => handleFindVendor(e)}>
                        <div className="form-row">
                          <div className="mb-3 col-xl-12">
                            <label className="mr-sm-2">Routing number </label>
                            <input
                              type="text"
                              value={query}
                              className="form-control"
                              placeholder="Enter routing number"
                              onChange={(e) => setQuery(e.target.value)}
                            />
                          </div>

                          <div className="col-12 mt-5">
                            {/* <button type="submit">Submit</button> */}
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                              style={{
                                backgroundColor: "#007bff",
                                borderColor: "#007bff",
                                padding: "10px 20px",
                                fontSize: "16px",
                                fontWeight: "bold",
                                borderRadius: "5px",
                              }}
                            >
                              Find
                            </button>
                          </div>
                        </div>
                      </form>
                    )}
                    <br />

                    {stage === "vendorDetails" && vendor && (
                      <>
                        <VendorDetails {...vendor} />
                        <div className="col-12 mt-5">
                          <button
                            onClick={() => {
                              setStage("inputAmount");
                            }}
                            className="btn btn-primary w-100"
                            style={{
                              backgroundColor: "#007bff",
                              borderColor: "#007bff",
                              padding: "10px 20px",
                              fontSize: "16px",
                              fontWeight: "bold",
                              borderRadius: "5px",
                            }}
                          >
                            Confirm
                          </button>
                        </div>
                      </>
                    )}

                    {stage === "inputAmount" && vendor && (
                      <div>
                        <div>
                          <label className="mr-sm-2">Amount:</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => handleSetAmount(e)}
                          />
                        </div>
                        <br />

                        <div className="col-12 mt-5">
                          <button
                            onClick={(e) => handlePay(e)}
                            className="btn btn-success btn-primary w-100"
                            style={{
                              backgroundColor: "#007bff",
                              borderColor: "#6c757d",
                              padding: "10px 20px",
                              fontSize: "16px",
                              fontWeight: "bold",
                              borderRadius: "5px",
                            }}
                          >
                            Continue
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && (
          <ToastDisplay
            title="Error"
            message={error}
            type="error"
            show={error}
            onClose={() => setError(null)}
          />
        )}
      </Layout>
    </>
  );
}
