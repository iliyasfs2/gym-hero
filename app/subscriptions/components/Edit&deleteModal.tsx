"use client";
import { useState } from "react";
import React from "react";

interface EditSubscriptionsProps {
  isModalOpen: boolean;
}
export default function EditSubscriptions(props: EditSubscriptionsProps) {
  return (
    <>
      {props.isModalOpen && (
        <div>
          <h1>Form Edit</h1>
        </div>
      )}
    </>
  );
}
