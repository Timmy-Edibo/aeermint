"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { baseUrl } from "../../utils/constants";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useAuth } from "@/contexts/AuthContext";

const LookupForm = () => {
  const [vendorData, setVendorData] = useState({});
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { setAuth } = useAuth();

  const initiator = useCallback(() => {
    const data = localStorage.getItem("vendorData");
    if (data) {
      const newData = JSON.parse(data);
      console.log("New Data", newData);
      setVendorData(newData);
    }
  }, []);

  // const confirmVendorSignUp = async () => {
  //   // e.preventDefault();

  //   setIsLoading(true); // Start loading state

  //   try {
  //     const { phoneNumber, rcNumber } = vendorData;

  //     // Define the payload based on the user type
  //     const payload = {
  //       password: password,
  //       phoneNumber: phoneNumber,
  //       rcNumber: rcNumber,
  //     };

  //     const response = await fetch(`${baseUrl}/vendor/auth/register`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) {
  //       // Handle response errors
  //       const errorData = await response.json();
  //       throw new Error(
  //         errorData.message || "Signup failed. Please try again."
  //       );
  //     }

  //     const data = await response.json();
  //     localStorage.setItem("accessToken", data?.data?.token);
  //     setAuth(true, data?.data);
  //     localStorage?.removeItem("signUpPhoneNumber");
  //     localStorage?.removeItem("signUpCountry");
  //     localStorage?.removeItem("vendorData");
  //     router.push("/wallets");

  //     // change to toast
  //     // alert(`Signup successful: Welcome, ${data.firstName || "User"}!`);
  //   } catch (err) {
  //     console.error("Signup error:", err.message);
  //     setError(err.message || "An unexpected error occurred.");
  //   } finally {
  //     setIsLoading(false); // End loading state
  //   }
  // };

  const confirmVendorSignUp = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    setIsLoading(true); // Start loading state

    try {
      const {
        phoneNumber,
        rcNumber,
        email,
        country,
        businessName,
        businessType,
        businessAddress,
      } = vendorData;

      // Define the payload based on the user type
      const payload = {
        password: password,
        phoneNumber: phoneNumber,
        rcNumber: rcNumber,
        email: email,
        country: country,
        businessName: businessName,
        businessType: businessType,
        businessAddress: businessAddress,
      };

      const response = await fetch(`${baseUrl}/vendor/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Handle response errors
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Signup failed. Please try again."
        );
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data?.data?.token);
      setAuth(true, data?.data);
      localStorage?.removeItem("signUpPhoneNumber");
      localStorage?.removeItem("signUpCountry");
      localStorage?.removeItem("vendorData");
      router.push("/wallets");

      // Show toast or notification for successful signup
      alert(`Signup successful!`);
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  useEffect(() => {
    initiator();
  }, []);

  console.log("Vendor Data", vendorData);

  return (
    // <div>
    //   <button onClick={() => router.back()}>back</button>
    //   <h1>Vendor Data</h1>

    //   <div>
    //     <div>
    //       <p>{vendorData?.name}</p>
    //       <p>{vendorData?.email}</p>
    //       <p>{vendorData?.phoneNumber}</p>
    //       <p>{vendorData?.country}</p>
    //       <p>{vendorData?.rcNumber}</p>
    //       <p>{vendorData?.businessName}</p>
    //       <p>{vendorData?.businessType}</p>
    //       <p>{vendorData?.businessAddress}</p>
    //     </div>

    //     {!showPasswordInput && (
    //       <button onClick={() => setShowPasswordInput(true)}>
    //         Confirm Vendor Details
    //       </button>
    //     )}

    //     {showPasswordInput && (
    //       <form onSubmit={confirmVendorSignUp}>
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //         />
    //         <button type="submit">Sign Up</button>
    //       </form>
    //     )}
    //   </div>
    //   {error && (
    //     <ToastDisplay
    //       title="Error"
    //       message={error}
    //       type="error"
    //       show={error}
    //       onClose={() => setError(null)}
    //     />
    //   )}
    // </div>
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={() => router.back()}>
        Back
      </button>

      <div className="card shadow-sm p-4">
        <div className="row mb-3">
          <div className="col-md-6">
            {/* <p>
              <strong>Name:</strong> {vendorData?.name}
            </p> */}
            <p>
              <strong>Email:</strong> {vendorData?.email}
            </p>
            <p>
              <strong>Phone Number:</strong> {vendorData?.phoneNumber}
            </p>
          </div>
          <div className="col-md-6">
            <p>
              <strong>Country:</strong> {vendorData?.country}
            </p>
            <p>
              <strong>RC Number:</strong> {vendorData?.rcNumber}
            </p>
            <p>
              <strong>Business Name:</strong> {vendorData?.businessName}
            </p>
            <p>
              <strong>Business Type:</strong> {vendorData?.businessType}
            </p>
            <p>
              <strong>Business Address:</strong> {vendorData?.businessAddress}
            </p>
          </div>
        </div>

        {!showPasswordInput ? (
          <button
            className="btn btn-primary btn-block"
            onClick={() => setShowPasswordInput(true)}
          >
            Confirm Vendor Details
          </button>
        ) : (
          <form onSubmit={confirmVendorSignUp} className="mt-3">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <br/>
            <button type="submit" className="btn btn-success btn-block">
              Sign Up
            </button>
          </form>
        )}
      </div>

      {error && (
        <div className="mt-3">
          <ToastDisplay
            title="Error"
            message={error}
            type="error"
            show={error}
            onClose={() => setError(null)}
          />
        </div>
      )}
    </div>
  );
};

export default LookupForm;
