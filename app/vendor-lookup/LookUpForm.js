"use client";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { baseUrl } from "../../utils/constants";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useAuth } from "@/contexts/AuthContext";

const LookupForm = () => {
  const [vendorData, setVendorData] = useState({});
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);


  const [error, setError] = useState(null);
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const initiator = useCallback(() => {
    const data = localStorage.getItem("vendorData");
    if (data) {
      const newData = JSON.parse(data);
      setVendorData(newData);
    }
  }, []);

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

  return (
    <div className="container">
      <div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <tbody>
                <tr>
                  <td>
                    <span className="">Email</span>
                  </td>
                  <td>
                    <span className="">{vendorData?.email}</span>
                  </td>
                </tr>
                <tr>
                  <td>Phone Number</td>
                  <td>{vendorData?.phoneNumber}</td>
                </tr>
                <tr>
                  <td>Country</td>
                  <td>{vendorData?.country}</td>
                </tr>
                <tr>
                  <td>RC Number</td>
                  <td>{vendorData?.rcNumber}</td>
                </tr>
                <tr>
                  <td>Business Name</td>
                  <td>{vendorData?.businessName}</td>
                </tr>
                <tr>
                  <td>Business Type</td>
                  <td>{vendorData?.businessType}</td>
                </tr>
                <tr>
                  <td>Business Address</td>
                  <td>{vendorData?.businessAddress}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <Button variant="primary" onClick={handleShow}
        >
          Confirm Vendor Details
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Almost done... Set a password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={confirmVendorSignUp}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                autoFocus
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={confirmVendorSignUp}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
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
