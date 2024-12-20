"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { baseUrl } from "../../utils/constants";
import Loading from "../loading";

export default function OtpCode() {
  const [otp, setOtp] = useState(["", "", "", ""]); // Array for OTP inputs
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const inputRefs = useRef([]); // Ref for input focus handling

  const param = useSearchParams();
  const phoneNumber = param.get("phoneNumber");
  const maskedNumber = phoneNumber?.slice(0, -3).replace(/\d/g, 'x') + phoneNumber?.slice(-3);

  // Verify OTP
  const verifyOtp = async () => {
    const otpValue = otp.join(""); // Combine OTP digits
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/auth/verify-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phoneNumber, otp: otpValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An unknown error occurred!");
      }

      const data = await response.json();
      router.push(`/signup?phoneNumber=${localStorage?.getItem('signUpPhoneNumber')}`);
    } catch (error) {
      console.error(error.message);
      setError(error.message);
    } finally {
      // setLoading(false);
    }
  };

  // Prevent paste in OTP inputs
  const handlePaste = (e) => {
    e.preventDefault();
  };

  // Handle OTP input changes
  const handleOtpChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setOtp(updatedOtp);

      // Move focus to the next input
      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace and arrow key navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      const updatedOtp = [...otp];
      updatedOtp[index] = ""; // Clear current input
      setOtp(updatedOtp);
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
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
                  <Link className="page-back text-muted" href="/register-phone">
                    <span>
                      <i className="fi fi-ss-angle-small-left" />
                    </span>{" "}
                    Back
                  </Link>
                  <h3 className="text-center">OTP Verification</h3>
                  <p className="text-center mb-5">
                    We sent one time code to your number ending in {maskedNumber}.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      verifyOtp();
                    }}
                  >
                    <div className="mb-3  mb-3">
                      <label className="mb-3">Your OTP Code</label>
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ gap: "10px", margin: "20px 0" }}
                      >
                        {otp?.map((value, index) => (
                          <input
                            key={index}
                            type="text"
                            value={value}
                            onChange={(e) =>
                              handleOtpChange(e.target.value, index)
                            }
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="form-control text-center"
                            maxLength="1"
                            style={{
                              height: "50px",
                              fontSize: "18px",
                              fontWeight: "bold",
                              border: "1px solid #ccc",
                              borderRadius: "5px",
                            }}
                            ref={(el) => (inputRefs.current[index] = el)}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-success w-100">
                        Verify
                      </button>
                    </div>
                  </form>
                  <div className="info mt-3">
                    <p className="text-muted">
                      You are not recommended to save password to browsers!
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
