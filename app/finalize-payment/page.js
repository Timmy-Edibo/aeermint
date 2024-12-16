// "use client";

// import React, { useState } from "react";
// import Layout from "@/components/layout/Layout";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import ToastDisplay from "../../components/elements/ToastDisplay";
// import { useRouter } from "next/navigation";
// import { baseUrl } from "../../utils/constants";

// export default function FinalizePayment() {
//   // const [vendor, setVendor] = useState({});
//   const [query, setQuery] = useState("");
//   const [amount, setAmount] = useState(0);
//   const [transactionDetails, setTransactionDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [promptPin, setPromptPin] = useState(false);
//   const [txPin, setTxPin] = useState("");
//   const router = useRouter();

//   const param = useSearchParams();

//   const finalizeTransaction = async () => {
//     try {
//       // const {} = vendor;
//       setPromptPin(true);
//       const response = await fetch(`${baseUrl}/transactions/pay`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//         body: JSON.stringify({
//           amount: param.get("amount") > 0 && parseInt(param.get("amount")),
//           routableNumber: param.get("routableNumber"),
//           transactionPin: txPin,
//         }),
//       });
//       if (!response.ok) {
//         throw new Error("An error occurred!");
//       }

//       const data = await response.json();
//       setTransactionDetails(data);
//       setTimeout(() => {
//         router.push("/wallets");
//       }, 3000);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handlePay = (e) => {
//     e.preventDefault();
//     finalizeTransaction();
//   };

//   return (
//     <>
//       <Layout breadcrumbTitle="Complete Process">
//         <div className="verification section-padding">
//           <div className="container h-100">
//             <div className="row justify-content-center h-100 align-items-center">
//               <div className="col-xl-5 col-md-6">
//                 <div className="card">
//                   <div className="card-header">
//                     <h2 className="card-title">Finalize Transaction</h2>
//                     {/* <br/> */}
//                   </div>

//                  {!promptPin &&  <div className="card-body">
//                     <div>
//                       <h6>
//                         Amount: {param.get("currency")} {param.get("amount")}
//                       </h6>
//                       <h6>{param.get("info")}</h6>
//                       <h6>Account Number: {param.get("routableNumber")}</h6>
//                     </div>
//                     <button
//                       onClick={(e) => handlePay(e)}
//                       className="btn btn-secondary btn-success w-100"
//                       style={{
//                         // backgroundColor: "green",
//                         borderColor: "#6c757d",
//                         padding: "10px 20px",
//                         fontSize: "16px",
//                         fontWeight: "bold",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Complete
//                     </button>
//                     <br />
//                     <button
//                       onClick={(e) => handlePay(e)}
//                       className="btn btn-secondary btn-danger w-100"
//                       style={{
//                         // backgroundColor: "green",
//                         borderColor: "#6c757d",
//                         padding: "10px 20px",
//                         fontSize: "16px",
//                         fontWeight: "bold",
//                         borderRadius: "5px",
//                       }}
//                     >
//                       Cancel
//                     </button>
//                   </div>}
//                   {promptPin && (
//                     <div>
//                       <input
//                         type="password"
//                         placeholder="Enter Transaction Pin"
//                         value={txPin}
//                         onChange={(e) => setTxPin(e.target.value)}
//                         className="form-control"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {transactionDetails && (
//           <ToastDisplay
//             show={true}
//             title="Transaction Details"
//             message={`STATUS: ${transactionDetails?.message}`}
//             type="success"
//           />
//         )}
//       </Layout>
//     </>
//   );
// }


"use client";

import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ToastDisplay from "../../components/elements/ToastDisplay";
import { useRouter } from "next/navigation";
import { baseUrl } from "../../utils/constants";

export default function FinalizePayment() {
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [promptPin, setPromptPin] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const router = useRouter();
  const param = useSearchParams();

  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      // Update the pin state
      const updatedPin = [...pin];
      updatedPin[index] = value;
      setPin(updatedPin);

      // Move to the next input if the current one is filled
      if (value && index < 3) {
        document.getElementById(`pin-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (pin[index] === "") {
        // Move focus to the previous input if current is empty
        if (index > 0) {
          document.getElementById(`pin-input-${index - 1}`).focus();
        }
      }
      // Clear the current input
      const updatedPin = [...pin];
      updatedPin[index] = "";
      setPin(updatedPin);
    }
  };

  const finalizeTransaction = async () => {
    if (!pin) {
      ToastDisplay("Please enter the transaction pin", "error");
      return;
    }

    const transactionPin = pin.join(""); // Combine PIN digits into a single string
    if (transactionPin.length !== 4) {
      ToastDisplay("Please enter a 4-digit transaction pin", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/transactions/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(param.get("amount")), // Ensure valid number
          routableNumber: param.get("routableNumber"),
          transactionPin: transactionPin,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Transaction failed");
      }

      const data = await response.json();
      setTransactionDetails(data);

      // Redirect after successful transaction
      setTimeout(() => {
        router.push("/wallets");
      }, 3000);
    } catch (error) {
      console.error("Error finalizing transaction:", error.message);
      ToastDisplay(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    setPromptPin(true); // Show the pin prompt
  };

  const handleCancel = () => {
    setPromptPin(false); // Reset pin prompt view
    setPin(""); // Clear the pin input
  };

  // return (
  //   <Layout breadcrumbTitle="Complete Process">
  //     <div className="verification section-padding">
  //       <div className="container h-100">
  //         <div className="row justify-content-center h-100 align-items-center">
  //           <div className="col-xl-5 col-md-6">
  //             <div className="card">
  //               <div className="card-header">
  //                 <h2 className="card-title">Finalize Transaction</h2>
  //               </div>

  //               <div className="card-body">
  //                 <div className="d-flex justify-content-center mb-4">
  //                 {!promptPin ? (
  //                   // Transaction summary view
  //                   <div>
  //                     <div>
  //                       <h6>
  //                         Amount: {param.get("currency")} {param.get("amount")}
  //                       </h6>
  //                       <h6>{param.get("info")}</h6>
  //                       <h6>Account Number: {param.get("routableNumber")}</h6>
  //                     </div>
  //                     <button
  //                       onClick={handleComplete}
  //                       className="btn btn-secondary btn-success w-100"
  //                       style={{
  //                         borderColor: "#6c757d",
  //                         padding: "10px 20px",
  //                         fontSize: "16px",
  //                         fontWeight: "bold",
  //                         borderRadius: "5px",
  //                       }}
  //                     >
  //                       Complete
  //                     </button>
  //                     <br />
  //                     <button
  //                       onClick={() => router.back()}
  //                       className="btn btn-secondary btn-danger w-100"
  //                       style={{
  //                         borderColor: "#6c757d",
  //                         padding: "10px 20px",
  //                         fontSize: "16px",
  //                         fontWeight: "bold",
  //                         borderRadius: "5px",
  //                       }}
  //                     >
  //                       Cancel
  //                     </button>
  //                   </div>
  //                 ) : (
  //                   // Pin prompt view
  //                   <div>
  //                     <div className="d-flex justify-content-center mb-4">
  //                     {pin.map((digit, index) => (
  //                     <input
  //                       key={index}
  //                       id={`pin-input-${index}`}
  //                       type="text"
  //                       maxLength="1"
  //                       value={digit}
  //                       onChange={(e) => handleChange(e.target.value, index)}
  //                       onKeyDown={(e) => handleKeyDown(e, index)}
  //                       className="form-control mx-1 text-center"
  //                       style={{
  //                         width: "50px",
  //                         height: "50px",
  //                         fontSize: "24px",
  //                         fontWeight: "bold",
  //                         textAlign: "center",
  //                       }}
  //                     />
  //                   ))}
  //                   </div>
  //                     <button
  //                       onClick={finalizeTransaction}
  //                       className="btn btn-secondary btn-success w-100"
  //                       style={{
  //                         borderColor: "#6c757d",
  //                         padding: "10px 20px",
  //                         fontSize: "16px",
  //                         fontWeight: "bold",
  //                         borderRadius: "5px",
  //                       }}
  //                       disabled={loading} // Disable while processing
  //                     >
  //                       {loading ? "Processing..." : "Submit Pin"}
  //                     </button>
  //                     <br />
  //                     <button
  //                       onClick={handleCancel}
  //                       className="btn btn-secondary btn-danger w-100 mt-2"
  //                       style={{
  //                         borderColor: "#6c757d",
  //                         padding: "10px 20px",
  //                         fontSize: "16px",
  //                         fontWeight: "bold",
  //                         borderRadius: "5px",
  //                       }}
  //                     >
  //                       Cancel
  //                     </button>
  //                   </div>
  //                 )}
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {transactionDetails && (
  //       <ToastDisplay
  //         show={true}
  //         title="Transaction Details"
  //         message={`STATUS: ${transactionDetails?.message}`}
  //         type="success"
  //       />
  //     )}
  //   </Layout>
  // );

  return (
    <Layout breadcrumbTitle="Complete Process">
      <div className="verification section-padding">
        <div className="container h-100">
          <div className="row justify-content-center h-100 align-items-center">
            <div className="col-xl-5 col-md-6">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Finalize Transaction</h2>
                </div>
  
                <div className="card-body">
                  <div className="d-flex justify-content-center mb-4">
                    {!promptPin ? (
                      // Transaction summary view
                      <div>
                        <div>
                          <h6>
                            Amount: {param.get("currency")} {param.get("amount")}
                          </h6>
                          <h6>{param.get("info")}</h6>
                          <h6>Account Number: {param.get("routableNumber")}</h6>
                        </div>
                        <button
                          onClick={handleComplete}
                          className="btn btn-secondary btn-success w-100"
                          style={{
                            borderColor: "#6c757d",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          Complete
                        </button>
                        <br />
                        <button
                          onClick={() => router.back()}
                          className="btn btn-secondary btn-danger w-100"
                          style={{
                            borderColor: "#6c757d",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      // Pin prompt view
                      <div>
                        <div className="d-flex justify-content-center mb-4">
                          {pin.map((digit, index) => (
                            <input
                              key={index}
                              id={`pin-input-${index}`}
                              type="text"
                              maxLength="1"
                              value={digit}
                              onChange={(e) => handleChange(e.target.value, index)}
                              onKeyDown={(e) => handleKeyDown(e, index)}
                              className="form-control mx-1 text-center"
                              style={{
                                height: "50px",
                                fontSize: "24px",
                                fontWeight: "bold",
                                textAlign: "center",
                              }}
                            />
                          ))}
                        </div>
                        <button
                          onClick={finalizeTransaction}
                          className="btn btn-secondary btn-success w-100"
                          style={{
                            borderColor: "#6c757d",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                          disabled={loading} // Disable while processing
                        >
                          {loading ? "Processing..." : "Submit Pin"}
                        </button>
                        <br />
                        <button
                          onClick={handleCancel}
                          className="btn btn-secondary btn-danger w-100 mt-2"
                          style={{
                            borderColor: "#6c757d",
                            padding: "10px 20px",
                            fontSize: "16px",
                            fontWeight: "bold",
                            borderRadius: "5px",
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {transactionDetails && (
          <ToastDisplay
            show={true}
            title="Transaction Details"
            message={`STATUS: ${transactionDetails?.message}`}
            type="success"
          />
        )}
      </div>
    </Layout>
  );
  
}
