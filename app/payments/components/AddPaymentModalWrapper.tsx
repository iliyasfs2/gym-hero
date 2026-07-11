"use client";
import React from "react";
import AddPaymentModal from "./AddPaymentModal";

export default function AddPaymentModalWrapper({
  isOpen,
}: {
  isOpen: boolean;
}) {
  return <AddPaymentModal isOpen={isOpen} />;
}
