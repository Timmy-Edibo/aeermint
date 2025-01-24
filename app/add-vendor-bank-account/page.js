"use client";

import { useState } from "react";
import Layout from "@/components/layout/Layout";
import banks from "../../utils/banks";
export default function AddCard() {
  const [vendorBank, setVendorBank] = useState('');
  const handleBankSelectChange = (event) => setVendorBank(event.target.value);
  
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
                    <form action="bank-add-successful">
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
                            {banks.map((bank) => (
                              <option value={bank.name} key={bank.slug}>
                                {bank?.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3 col-xl-12">
                          <label className="form-label">Account number </label>
                          <input
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
    </>
  );
}
