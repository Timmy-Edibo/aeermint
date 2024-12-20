"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import Loading from "../loading";
import { baseUrl } from "../../utils/constants";
import countries from "../../utils/countries";

export default function RegisterPhone() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState("");

  const router = useRouter();

  // Register phone number
  const registerPhoneNumber = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/auth/register-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();

      localStorage?.setItem("signUpPhoneNumber", data?.data?.phoneNumber);
      localStorage?.setItem("signUpCountry", country);

      router.push("/otp-code?phoneNumber=" + data?.data?.phoneNumber);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div className="authincation">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              <div className="mini-logo text-center my-5">
                <Link href="/index">
                  <img
                    style={{ width: "20%", justifySelf: "center" }}
                    src="./images/aermint_logo_one.png"
                    alt=""
                  />
                </Link>
              </div>
              <div className="card">
                <div className="card-body">
                  <h3 className="text-center">2-Step Verification</h3>
                  <p className="text-center mb-5">
                    We will send one time code on this number
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      registerPhoneNumber();
                    }}
                  >
                    <div className="mb-3 col-12">
                      <label className="form-label">Country</label>
                      <select
                        onChange={(event) => setCountry(event.target.value)}
                        className="form-select"
                        name="country"
                      >
                        <option value="">Select</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3 col-12">
                      <label className="mb-3">Your phone number</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <span className="input-group-text">
                            <i className="fi fi-sr-phone-call" />
                          </span>
                        </div>
                        <input
                          type="number"
                          value={phoneNumber}
                          className="form-control"
                          placeholder="Enter phone number"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="alert-text">
                      <small>
                        Security is critical on Aermint. to help keep your
                        account safe, we'll text you a verification code when
                        you sign in on a new device
                      </small>
                    </div>
                    <div className="text-center mt-4">
                      <button type="submit" className="btn btn-success w-100">
                        Send
                      </button>
                    </div>
                  </form>
                  <div className="new-account mt-3 d-flex justify-content-between">
                    <p>
                      Don't get code?{" "}
                      <Link className="text-primary" href="/otp-code">
                        Resend
                      </Link>
                    </p>
                  </div>
                  <div className="new-account d-flex justify-content-between">
                    <p>
                      Already have an account?
                      <Link className="text-primary" href="/signin">
                        {" "}
                        Sign In
                      </Link>
                    </p>
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
    </>
  );
}
