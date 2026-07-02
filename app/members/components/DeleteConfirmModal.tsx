"use client";

import React from "react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-950 w-full max-w-sm rounded-2xl p-6 border border-white/[0.08] shadow-2xl">
        <h3 className="text-lg font-bold text-slate-100">Delete Member</h3>
        <p className="text-sm text-slate-400 mt-2">
          Are you sure you want to delete this member?
        </p>

        <div className="flex gap-3 mt-6 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
