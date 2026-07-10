"use client";

import { useState } from "react";
import AddPlanModal from "./AddPlanModal";

export default function SubscriptionManager() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
      >
        + Add New Plan
      </button>

      <AddPlanModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
