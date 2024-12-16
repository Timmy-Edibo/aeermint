"use client";

import React, { useEffect, useState } from "react";
import { useSignUp } from "@/contexts/SignUpContext";
import Loading from "../loading";
import Link from "next/link";
import countries from "world-countries";

const SignUpForm = () => {
  const { formData, handleInputChange, handleSignUp, error, isLoading } =
    useSignUp();
  const [selectedTab, setSelectedTab] = useState("regularUser"); // "regularUser" or "vendorUser"

  const getCountries = () => {
    return countries.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  };

  const countryList = getCountries();

  return (
    <div className="auth-form">
      {isLoading && <Loading />}
      <h4>Sign Up</h4>
      <div className="tab-buttons d-flex justify-content-center mb-4">
        <button
          className={`btn ${selectedTab === "regularUser" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedTab("regularUser")}
          style={{ width: "50%" }}
        >
          Regular User
        </button>
        <button
          className={`btn ${selectedTab === "vendorUser" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setSelectedTab("vendorUser")}
          style={{ width: "50%" }}
        >
          Vendor
        </button>
      </div>

      <form onSubmit={handleSignUp}>
        <div className="row">
          {/* Regular User Form */}
          {selectedTab === "regularUser" && (
            <>
              <div className="col-12 mb-3">
                <label className="form-label">First Name</label>
                <input
                  name="firstName"
                  type="text"
                  className="form-control"
                  value={formData?.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  name="lastName"
                  type="text"
                  className="form-control"
                  value={formData?.lastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  className="form-control"
                  value={formData?.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select a country</option>
                  {countryList.map((country) => (
                    <option key={country?.code} value={country?.name}>
                      {country?.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">National Identification Number</label>
                <input
                  name="nationalIdentificationNo"
                  type="text"
                  className="form-control"
                  value={formData?.nationalIdentificationNo}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-12 mb-3">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  value={formData?.email}
                  onChange={handleInputChange}
                />
              </div>
            </>
          )}

          {/* Vendor Form */}
          {selectedTab === "vendorUser" && (
            <div className="col-12 mb-3">
              <label className="form-label">RC Number</label>
              <input
                name="rcNumber"
                type="text"
                className="form-control"
                value={formData?.rcNumber}
                onChange={handleInputChange}
              />
            </div>
          )}

          {/* Shared Fields */}
          <div className="col-12 mb-3">
            <label className="form-label">Phone Number</label>
            <input
              name="phoneNumber"
              type="text"
              className="form-control"
              value={formData?.phoneNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={formData?.password}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}

        <div className="mt-3 d-grid gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </form>
      <p className="mt-3 mb-0">
        Already have an account?
        <Link className="text-primary" href="/signin">
          {" "}
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUpForm;

