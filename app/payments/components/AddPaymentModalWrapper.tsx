"use client";
import React from "react";
import AddPaymentModal from "./AddPaymentModal";

interface Member {
  id: string;
  fullName: string;
}

export default function AddPaymentModalWrapper({
  isOpen,
  members,
}: {
  isOpen: boolean;
  members: Member[];
}) {
  return <AddPaymentModal isOpen={isOpen} members={members} />;
}
