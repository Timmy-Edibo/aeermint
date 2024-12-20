"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useSignUp } from "@/contexts/SignUpContext";
import Loading from "../loading";
import Link from "next/link";
import countries from "world-countries";

const SignUpForm = () => {
  const {
    formData,
    handleInputChange,
    handleSignUp,
    error,
    isLoading,
    setUserType,
  } = useSignUp();
  const [selectedTab, setSelectedTab] = useState("regularUser"); // "regularUser" or "vendorUser"
  const param = useSearchParams();

  const phoneNumber = param?.get("phoneNumber");
  const country = localStorage?.getItem("signUpCountry");

  if (phoneNumber) formData.phoneNumber = phoneNumber;
  if (country) formData.country = country;
  // useEffect(() => {

  // }, []);

  const getCountries = () => {
    return countries.map((country) => ({
      name: country.name.common,
      code: country.cca2,
    }));
  };

  useEffect(() => {
    setUserType("regularUser");
  }, [])

  const countryList = getCountries();

  const selectUserType = (type) => {
    setUserType(type);
    setSelectedTab(type);
  };

  return (
    <div className="auth-form">
      {isLoading && <Loading />}
      <form onSubmit={handleSignUp}>
        <Tabs
          defaultActiveKey="regularUser"
          activeKey={selectedTab}
          onSelect={(k) => selectUserType(k)}
          className="mb-3"
          id="fill-tab-example"
          fill
        >
          <Tab className="font-bold" eventKey="regularUser" title="User">
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
                  disabled
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
                <label className="form-label">
                  National Identification Number
                </label>
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
            </>
          </Tab>
          <Tab eventKey="vendorUser" title="Vendor">
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
          </Tab>
        </Tabs>
        {/* Shared Fields */}
        <div className="col-12 mb-3">
          <label className="form-label">Phone Number</label>
          <input
            readOnly
            disabled
            name="phoneNumber"
            type="text"
            className="form-control bg-grey"
            value={formData?.phoneNumber}
            onChange={handleInputChange}
          />
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
