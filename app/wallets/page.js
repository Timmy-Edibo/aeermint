"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import ChartjsBalanceOvertime2 from "@/components/chart/ChartjsBalanceOvertime2";
import ChartjsBalanceOvertime3 from "@/components/chart/ChartjsBalanceOvertime3";
import ChartjsBalanceOvertime4 from "@/components/chart/ChartjsBalanceOvertime4";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useAuth } from "../../contexts/AuthContext";
import {
  formatDate,
  formatDateAndTime,
  formatTime,
} from "../../utils/dateAndTimeFormatter";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import { baseUrl } from "../../utils/constants";

export default function Wallets() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pinStatus, setPinStatus] = useState(false);
  const [transactionsList, setTransactionsList] = useState([]);

  const router = useRouter();

  const fetchUserDetails = useCallback(async () => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const type =
      (storedUser?.account?.interactableType ||
        storedUser?.routable?.routableNumber) === "USER"
        ? "user/auth/user-detail"
        : `vendor/auth/vendor-detail?routableNumber=${
            storedUser?.account?.routable?.routableNumber ||
            storedUser?.routable?.routableNumber
          }`;
    try {
      // setLoading(true);
      const response = await fetch(`${baseUrl}/${type}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const user = await data?.data;
        setUser(user);
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData?.message || "An error occurred. Please try again."
        );
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message); // Save error message to display
    } finally {
      // setLoading(false);
    }
  }, [user]);

  const fetchUserTransactions = useCallback(
    async (pageNum) => {
      pageNum = page || 1;
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      const type =
        storedUser?.account?.interactableType === "USER" ? "user" : "vendor";

      try {
        const response = await fetch(
          `${baseUrl}/transactions/${type}?page=${pageNum}&limit=10`, // Use `page` for pagination
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();

          if (data && data?.data) {
            setCount(data?.data?.meta?.totalCount);
            setTransactionsList(
              data?.data?.transactions // Add the new transactions fetched from API
            );
          }
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "An error occurred. Please try again."
          );
        }
      } catch (error) {
        console.error("An error occurred:", error.message);
        setError(error.message); // Save error message to display
      } finally {
        setLoading(false);
      }
    },
    [user, page]
  );

  const handleScroll = (event) => {
    const bottom =
      event.target.scrollHeight ===
      event.target.scrollTop + event.target.clientHeight;
    if (bottom && !loading) {
      // If the user has reached the bottom, load more transactions
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchUserTransactions(nextPage);
        return nextPage;
      });
    }
  };

  const checkPinStatus = async () => {
    try {
      setLoading(true);
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      const routableNumber =
        storedUser?.routable?.routableNumber ||
        storedUser?.account?.routable?.routableNumber;
      const response = await fetch(
        `${baseUrl}/auth/pin-status?routableNumber=${routableNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (data?.data?.hasTransactionPin) {
          setPinStatus(true);
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (transaction) => {
    const uuid = transaction && transaction?.uuid && transaction?.uuid;
    router.push(`/transaction-details/${uuid}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();

      await fetchUserTransactions();

      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      if (storedUser?.account?.interactableType === "USER") {
        await checkPinStatus();
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Layout breadcrumbTitle="Wallets">
        {loading && <Loading />}
        <div className="wallet-tab">
          <div className="col-xxl-6 col-xl-6 col-lg-6">
            <div className="card">
              <div className="card-body">
                <div className="welcome-profile">
                  <div className="d-flex align-items-center">
                    <img src="./images/avatar/3.jpg" alt="" />
                    <div className="ms-3">
                      {user && user?.account?.interactableType === "USER" ? (
                        <h4>
                          Welcome, {user?.firstName} {user?.lastName}!
                        </h4>
                      ) : (
                        <h4>Welcome, {user?.businessName}!</h4>
                      )}
                      {user &&
                      user?.account?.interactableType === "USER" &&
                      !pinStatus ? (
                        <p>
                          Looks like you are not set up a pin yet. Set it up to
                          use the full potential of Aermint.
                        </p>
                      ) : (
                        <p>
                          Begin using Aermint for all payments at supported
                          vendors
                        </p>
                      )}
                    </div>
                  </div>
                  <ul>
                    <li>
                      {user && user?.account?.interactableType === "USER" && (
                        <Link href="/create-pin">
                          <span
                            className={
                              user &&
                              user?.account?.interactableType === "USER" &&
                              !pinStatus
                                ? "not-verified"
                                : "verified"
                            }
                          >
                            {user &&
                            user?.account?.interactableType === "USER" &&
                            !pinStatus ? (
                              <i className="fi fi-bs-check" />
                            ) : (
                              <i className="fi fi-rs-shield-check" />
                            )}
                          </span>
                          Verify Transaction Pin
                        </Link>
                      )}
                    </li>
                    <li>
                      <Link href="#">
                        <span className={"verified"}>
                          <i className="fi fi-rs-shield-check" />
                        </span>
                        Two-factor authentication (2FA)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-0">
            <div className="col-xl-12">
              {user?.account?.interactableType === "USER" && (
                <div className="add-card-link">
                  <h5 className="mb-0">Initiate Purchase</h5>
                  <Link href={pinStatus ? "/add-bank" : "#"}>
                    <i className="fi fi-rr-square-plus" />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <br />

          <div className="row g-0">
            <div className="col-xl-12">
              <div className="tab-content wallet-tab-content">
                <div
                  className={
                    activeIndex == 1
                      ? "tab-pane fade show active"
                      : "tab-pane fade"
                  }
                >
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="wallet-total-balance">
                            <p className="mb-0">Total Balance</p>
                            <h2>
                              {user?.account?.currency}{" "}
                              {user?.account?.completedBalance}
                            </h2>
                          </div>
                          <div className="rank">
                            <h5>Account number</h5>
                            <p>{user?.account?.routable?.routableNumber}</p>
                          </div>
                          <span className="reg_divider" />
                          <div className="rank">
                            <h5>Currency</h5>
                            <p>{user?.account?.currency}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xxl-6 col-xl-6 col-lg-6">
                      <div className="card">
                        <div className="card-body">
                          <div className="registered">
                            <h5>Created</h5>
                            <p>{user && formatDate(user?.createdAt)}</p>
                          </div>
                          <div className="rank">
                            <h5>Type</h5>
                            <p>{user?.account?.interactableType}</p>
                          </div>
                          <span className="reg_divider" />

                          <span className="reg_divider" />
                          <div className="rank">
                            <h5>Country</h5>
                            <p>{user?.country}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">
                      <div className="card">
                        <div className="card-header">
                          <h4 className="card-title">Transactions ({count})</h4>
                        </div>
                        <div className="card-body">
                          <div className="transaction-table">
                            <div className="table-responsive">
                              <table className="table mb-0 table-responsive-sm">
                                <thead>
                                  <tr>
                                    <th>Ref</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Currency</th>
                                  </tr>
                                </thead>
                                <tbody
                                  style={{
                                    maxHeight: "400px",
                                    overflowY: "auto",
                                  }}
                                  onScroll={handleScroll}
                                >
                                  {transactionsList?.length > 0 &&
                                    transactionsList?.map(
                                      (transaction, index) => (
                                        <tr
                                          key={index}
                                          onClick={() =>
                                            handleRowClick(transaction)
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <td>{transaction?.transactionRef}</td>
                                          <td>
                                            {formatDate(transaction?.createdAt)}
                                          </td>
                                          <td>
                                            {formatTime(transaction?.createdAt)}
                                          </td>
                                          <td>{transaction?.status}</td>
                                          <td>{transaction?.amount}</td>
                                          <td>{transaction?.currency}</td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        {transactionsList?.length <= 0 && (
                          <div className="card-body height-200 d-flex align-items-center justify-content-center">
                            <p className="mt-5">
                              You have no transactions yet! Create one by
                              hitting the{" "}
                              <Link href="/" className="text-primary">
                                Initiate Button
                              </Link>{" "}
                              as a regular user.{" "}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
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
