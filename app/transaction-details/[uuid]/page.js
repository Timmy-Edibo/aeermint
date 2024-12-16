"use client";

import Layout from "@/components/layout/Layout";
import { useParams } from "next/navigation";
import Loading from "../../loading";
import ToastDisplay from "../../../components/elements/ToastDisplay";
import { useEffect, useState } from "react";
import { formatDate, formatTime } from "../../../utils/dateAndTimeFormatter";
import { baseUrl } from "../../../utils/constants";

export default function TransactionDetails() {
  const { uuid } = useParams();
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const fetchTransactionDetails = async (uuid) => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    const type =
      storedUser?.account?.interactableType === "USER" ? "user" : "vendor";
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/transactions/${type}/${uuid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch transaction details"
        );
      }

      const data = await response.json();
      console.log("Fetched Data:", data);
      setParsedData(data?.data?.transaction);
    } catch (error) {
      console.error("Error fetching transaction details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (uuid) {
      fetchTransactionDetails(uuid);
    }
  }, [uuid]);

  return (
    <Layout breadcrumbTitle="Transaction Details">
      {loading && <Loading />}
      <div className="row">
        <div className="col-xxl-12 col-xl-12 col-md-12 col-sm-12">
          <div className="d-flex justify-content-around">
            <div className="w-50">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Transaction Details</h4>
                </div>
                <div className="card-body">
                  <div className="list-1 mt-3">
                    <ul>
                      <li>
                        <p className="mb-0">Transaction Ref</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.transactionRef}</span>
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">
                          {parsedData?.vendor?.interactableType === "USER" ? "Recipient" : "Sender"}
                        </p>
                        <h5 className="mb-0">
                          {parsedData?.vendor?.interactableType === "USER"? (
                            <span>
                              {parsedData?.vendor?.businessName}{" "}
                              {parsedData?.vendor?.businessAddress}
                            </span>
                          ) : (
                            <span>
                              {parsedData?.payer?.firstName}{" "}
                              {parsedData?.payer?.lastName}
                            </span>
                          )}
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">
                          {type === "USER" ? "Recipient Ac/No" : "Sender Ac/No"}
                        </p>
                        <h5 className="mb-0">
                          {parsedData?.vendor?.interactableType === "USER" ? (
                            <span>{parsedData?.vendor?.routableNumber}</span>
                          ) : (
                            <span>{parsedData?.payer?.routableNumber}</span>
                          )}
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">Transaction Amount</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.currency}</span>
                          <span>{parsedData?.amount}</span>
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">Transaction Fee</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.transactionFee}</span>
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">Exchange Rate</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.exchangeRate}</span>
                        </h5>
                      </li>
                      {/* <li>
                        <p className="mb-0">Vendor Name</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.vendorName}</span>
                        </h5>
                      </li> */}
                      {/* <li>
                        <p className="mb-0">Customer Name</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.customerName}</span>
                        </h5>
                      </li> */}
                      <li>
                        <p className="mb-0">Transaction Date</p>
                        <h5 className="mb-0">
                          <span>{formatDate(parsedData?.createdAt)}</span>
                        </h5>
                      </li>
                      <li>
                        <p className="mb-0">Transaction Time</p>
                        <h5 className="mb-0">
                          <span>{formatTime(parsedData?.createdAt)}</span>
                        </h5>
                      </li>
                      {/* <li>
                        <p className="mb-0">Transaction Completion Date</p>
                        <h5 className="mb-0">
                          <span>{parsedData?.completedAt}</span>
                        </h5>
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// "use client";

// import ChartjsDonut from "@/components/chart/ChartjsDonut";
// import Layout from "@/components/layout/Layout";
// import AnalyticsMenu from "@/components/layout/AnalyticsMenu";
// import { useRouter, useSearchParams } from "next/navigation";
// import Loading from "../loading";
// import ToastDisplay from "../../components/elements/ToastDisplay";
// import { useEffect, useState } from "react";
// import { formatDate, formatDateAndTime } from "../../utils/dateAndTimeFormatter";
// import { baseUrl } from "../../utils/constants";

// export default function TransactionDetails() {
//   const param = useParams();
//   const { uuid } = param;
//   const [parsedData, setParsedData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchTransactionDetails = async (uuid) => {
//     try {
//       setLoading(true);
//       const response = await fetch(`${baseUrl}/transactions/user/${uuid}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch transaction details");
//       }

//       const data = await response.json();
//       console.log("Fetched Data:", data);
//       setParsedData(data?.data);
//     } catch (error) {
//       console.error("Error fetching transaction details:", error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const initializeData = async () => {
//       if (!uuid) return; // Skip if `uuid` is undefined or null

//       try {
//         console.log(uuid);
//         setLoading(true);
//         await fetchTransactionDetails(uuid);
//       } catch (error) {

//         console.error("Error initializing transaction details:", error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeData();
//   }, []);

//   return (
//     <>
//       <Layout breadcrumbTitle="Transaction Details">
//         {loading && <Loading />}
//         <div className="row">
//           <div className="col-xxl-12 col-xl-12">
//             {/* <AnalyticsMenu /> */}
//             <div className="d-flex justify-content-around">
//               <div className="w-50">
//                 <div className="card">
//                   <div className="card-header">
//                     <h4 className="card-title">Transaction Details</h4>
//                   </div>
//                   <div className="card-body">
//                     {/* <ChartjsDonut /> */}
//                     <div className="list-1 mt-3">
//                       <ul>
//                         <li>
//                           <p className="mb-0">Transaction Ref</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.transactionRef}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Transaction Type</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.transactionType}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Transaction Amount</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.currency}</span><span>{parsedData?.amount}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Transaction Fees</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.fees}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Vendor Name</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.vendorName}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Customer Name</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.customerName}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Transaction Creation Date</p>
//                           <h5 className="mb-0">
//                             {/* <span>{formatDateAndTime(parsedData?.createdAt)}</span> */}
//                             <span>{formatDateAndTime(parsedData?.createdAt)}</span>
//                           </h5>
//                         </li>
//                         <li>
//                           <p className="mb-0">Transaction Completion Date</p>
//                           <h5 className="mb-0">
//                             <span>{parsedData?.completionDate}</span>
//                           </h5>
//                         </li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Layout>
//     </>
//   );
// }
