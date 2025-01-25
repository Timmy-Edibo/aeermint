"use client";

import React, { createContext, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { baseUrl } from "../utils/constants";

const SignUpContext = createContext();

export const SignUpProvider = ({ children }) => {
  const { setAuth } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    country: "",
    nationalIdentificationNo: "",
    rcNumber: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState(null);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Start loading state

    try {
      const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        country,
        nationalIdentificationNo,
        rcNumber,
      } = formData;

      // Define the API endpoint based on the user type
      let url = "";
      if (userType === "regularUser") {
        url = "user/auth/register";
      } else if (userType === "vendorUser") {
        url = "vendor/auth/vendor-lookup";
      } else {
        throw new Error("Invalid user type selected.");
      }

      // Define the payload based on the user type
      let payload;
      if (userType === "regularUser") {
        payload = {
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          country,
          nationalIdentificationNo,
        };
      } else if (userType === "vendorUser") {
        payload = {
          // password,
          phoneNumber,
          rcNumber,
        };
      }

      // Make the API request
      const response = await fetch(`${baseUrl}/${url}`, {
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

      if (userType === "vendorUser") {
        const data = await response.json();
        localStorage.setItem("vendorData", JSON.stringify(data?.data));
        router.push("/vendor-lookup");
      } else {
        const data = await response.json();
        localStorage.setItem("accessToken", data.data.token);
        setAuth(true, data.data);
        localStorage?.removeItem("signUpPhoneNumber");
        localStorage?.removeItem("signUpCountry");
        router.push("/wallets");
      }
      // change to toast
      alert(`Signup successful: Welcome, ${data.firstName || "User"}!`);
    } catch (err) {
      console.error("Signup error:", err.message);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <SignUpContext.Provider
      value={{
        formData,
        handleInputChange,
        handleSignUp,
        error,
        isLoading,
        setUserType,
      }}
    >
      {children}
    </SignUpContext.Provider>
  );
};

// Custom hook for consuming the SignUpContext
export const useSignUp = () => useContext(SignUpContext);
