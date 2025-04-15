// src/components/Status.js
import React from "react";

function Status({ status }) {
  return (
    <div className={`status p-2 rounded-md ${status === "success" ? "bg-green-100 text-green-600" : status === "error" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}>
      {status}
    </div>
  );
}

export default Status;