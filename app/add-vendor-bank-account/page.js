"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import Layout from "@/components/layout/Layout";
import banks from "../../utils/banks";
import { useAuth } from "../../contexts/AuthContext";
import { baseUrl } from "../../utils/constants";

export default function AddCard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [vendorBank, setVendorBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const handleBankSelectChange = (event) => setVendorBank(event.target.value);
  const { getCurrentUser } = useAuth();
  const router = useRouter();

  const addVendorBankAccount = async () => {
    try {
      setLoading(true);
      const selectedBank = banks.find((bank) => bank.name === vendorBank);
      const response = await fetch(`${baseUrl}/payout/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          currency: getCurrentUser()?.account?.currency,
          bankName: vendorBank,
          code: selectedBank?.code,
          accountNumber: accountNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/bank-add-successful");
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Layout breadcrumbTitle="Add Bank Account">
        <div className="verification section-padding">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-xl-5 col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h4 className="card-title">Link a Bank Account</h4>
                  </div>
                  <div className="card-body">
                    <form action={addVendorBankAccount}>
                      <div className="row">
                        <div className="mb-3 col-xl-12">
                          <label className="form-label">Bank Name</label>
                          <select
                            value={vendorBank}
                            name="country"
                            className="form-control"
                            onChange={handleBankSelectChange}
                          >
                            <option value="">Select a bank</option>
                            {banks?.map((bank) => (
                              <option value={bank.name} key={bank.slug}>
                                {bank?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3 col-xl-12">
                          <label className="form-label">Account number </label>
                          <input
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            type="text"
                            className="form-control"
                            placeholder="22383919201"
                          />
                        </div>
                        <div className="text-center col-12">
                          <button
                            type="submit"
                            className="btn btn-success w-100"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
      {error && (
        <ToastDisplay
          title="Error"
          message={error}
          type="error"
          show={error}
          onClose={() => setError(null)}
        />
      )}
    </>
  );
}
