import React, { useCallback, useEffect, useState } from "react";

function VendorDetails(props) {
  return (
    <div className="card-body">
      <div className="table-responsive">
        <table className="table">
          <tbody>
            <tr>
              <td className="text-bold">Business Name</td>
              <td>{props?.businessName}</td>
            </tr>
            <tr>
              <td className="text-bold">Business Address</td>
              <td>{props?.businessAddress}</td>
            </tr>
            <tr>
              <td className="text-bold">Account Number</td>
              <td>{props?.account?.routable?.routableNumber}</td>
            </tr>
            <tr>
              <td className="text-bold">Business Type</td>
              <td>{props?.businessType}</td>
            </tr>
            <tr>
              <td className="text-bold">Location</td>
              <td>{props?.country}</td>
            </tr>
            <tr>
              <td className="text-bold">Currency</td>
              <td>{props?.account?.currency}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VendorDetails;
