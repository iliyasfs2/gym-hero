"use client";

import React, { useState } from "react";
import { Transaction } from "./types";
import InvoiceModal from "./InvoiceModal";

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleOpenInvoice = (tx: Transaction) => {
    setSelectedTx(tx);
    setIsInvoiceOpen(true);
  };

  const getStatusStyle = (status: Transaction["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Pending":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Failed":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="bg-[#121824] rounded-2xl border border-white/[0.04] p-6 shadow-xl w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-200">
            📋 Transaction Ledger
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Recent Activities</p>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-500 text-sm">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search member or invoice..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full bg-black/20 border border-white/[0.08] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.02]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] bg-white/[0.01] text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Member</th>
              <th className="px-6 py-4">Invoice No</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Method</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02] text-sm text-slate-300">
            {currentItems.length > 0 ? (
              currentItems.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-white/[0.01] transition-colors group"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {tx.memberName}
                  </td>

                  <td
                    onClick={() => handleOpenInvoice(tx)}
                    className="px-6 py-4 text-blue-500 hover:text-blue-400 cursor-pointer font-mono text-xs transition-colors underline decoration-blue-500/30 underline-offset-2"
                  >
                    {tx.invoiceNo}
                  </td>
                  <td className="px-6 py-4 font-semibold text-blue-400">
                    ${tx.amount}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="bg-slate-800 px-2 py-1 rounded-md text-slate-400 border border-white/[0.04]">
                      {tx.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(tx.status)}`}
                    >
                      {tx.status === "Paid"
                        ? "● Paid"
                        : tx.status === "Pending"
                          ? "● Pending"
                          : "● Failed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenInvoice(tx)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 border border-white/[0.06] text-slate-300 px-3 py-1.5 rounded-lg transition-all cursor-pointer group-hover:border-blue-500/30"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-xs text-slate-500"
                >
                  No transactions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-2">
          <div className="text-xs text-slate-500">
            Showing{" "}
            <span className="text-slate-300 font-medium">
              {indexOfFirstItem + 1}
            </span>{" "}
            to{" "}
            <span className="text-slate-300 font-medium">
              {Math.min(indexOfLastItem, filteredTransactions.length)}
            </span>{" "}
            of{" "}
            <span className="text-slate-300 font-medium">
              {filteredTransactions.length}
            </span>{" "}
            entries
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-white/[0.04] text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === page
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-slate-800 border border-white/[0.04] text-slate-400 hover:text-slate-200 hover:bg-slate-700"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800 border border-white/[0.04] text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
