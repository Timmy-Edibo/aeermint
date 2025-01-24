"use client";
import Layout from "@/components/layout/Layout";
import SettingsMenu from "@/components/layout/SettingsMenu";
import Link from "next/link";
import { baseUrl } from "../../utils/constants";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function SettingsBank() {
  const [loading, setLoading] = useState(false);
  const [vendorBank, setVendorBank] = useState(null);
  const { getCurrentUser } = useAuth();

  console.log(getCurrentUser());

  const fetchVendorBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/payout`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // console.log(data?.data);
        setVendorBank(data?.data);
        console.log(data?.data);
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    // if (getCurrentUser()?.account?.interactableType === "VENDOR") {
    fetchVendorBanks();
  }, []);

  return (
    <>
      <Layout breadcrumbTitle="Bank">
        <div className="row">
          <div className="col-xxl-12 col-xl-12">
            <SettingsMenu />
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Add Bank Account or Card</h4>
              </div>
              <div className="card-body">
                <div className="verify-content">
                  <div className="d-flex align-items-center">
                    <span className="me-3 icon-circle bg-primary text-white">
                      <i className="fi fi-rs-bank" />
                    </span>
                    {vendorBank && (
                      <div className="primary-number">
                        <h5 className="mb-0">{vendorBank?.bankName}</h5>
                        <small>{vendorBank?.accountNumber}</small>
                        <br />
                        <span className="text-success">{vendorBank?.accountName}</span>
                      </div>
                    )}
                  </div>
                  <button className=" btn btn-outline-primary">Manage</button>
                </div>
                <hr className="border opacity-1" />
                {/* <div className="verify-content">
                  <div className="d-flex align-items-center">
                    <span className="me-3 icon-circle bg-primary text-white">
                      <i className="fi fi-rr-credit-card" />
                    </span>
                    <div className="primary-number">
                      <h5 className="mb-0">Master Card</h5>
                      <small>Credit Card *********5478</small>
                      <br />
                      <span className="text-success">Verified</span>
                    </div>
                  </div>
                  <button className=" btn btn-outline-primary">Manage</button>
                </div> */}
                <div className="mt-5">
                  <Link href="/add-vendor-bank-account" className="btn btn-primary m-2">
                    Add New Bank
                  </Link>
                  {/* <Link href="/add-card" className="btn btn-primary m-2">Add New Card</Link> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
