"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SignUpForm from "./SignUpForm";
import { SignUpProvider } from "@/contexts/SignUpContext";


export default function SignUp() {
  const [signUpPhoneNumber, setSignUpPhoneNumber] = useState("");

  useEffect(() => {
    const phoneNumber = localStorage.getItem("signUpPhoneNumber");
    if (phoneNumber) {
      setSignUpPhoneNumber(phoneNumber);
    }
  }, []);

  return (
    <>
      <SignUpProvider>
        <div className="authincation">
          <div className="container h-100">
            <div className="row justify-content-center h-100 align-items-center">
              <div className="col-xl-6 col-md-6">
                <div className="mini-logo justify-content-center my-5">
                  <Link href="/">
                    <img
                      style={{ width: "20%", justifySelf: "center" }}
                      src="./images/aermint_logo_one.png"
                      alt=""
                    />
                  </Link>
                </div>
                <div className="card">
                  <div className="card-body">
                    <Link
                      className="page-back text-muted"
                      href={`/otp-code?phoneNumber=${signUpPhoneNumber}`}
                    >
                      <span>
                        <i className="fi fi-ss-angle-small-left" />
                      </span>{" "}
                      Back
                    </Link>
                    <h3 className="text-center">Sign Up</h3>
                    <p className="text-center mb-5">
                      Just a few more steps to get started
                    </p>
                    <SignUpForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignUpProvider>
    </>
  );
}
