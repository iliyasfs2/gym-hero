"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp, Member } from "@/app/components/context/AppContext";
import MemberFilters from "./components/MemberFilters";
import MemberTable from "./components/MemberTable";
import AddMemberModal from "./components/AddMemberModal";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import MemberViewDrawer from "./components/MemberViewDrawer";
import {
  FilterStatus,
  NewMemberFormData,
  DetailedMember,
} from "./components/types";

const MOCK_MEMBERS: Member[] = [
  {
    id: "1",
    name: "Ali Ahmadi",
    phone: "09123456789",
    plan: "Gold Plan",
    status: "Active",
    joinDate: "2026-06-01",
    price: 150,
  },
  {
    id: "2",
    name: "Sara Kamali",
    phone: "09359876543",
    plan: "Silver Plan",
    status: "Expired",
    joinDate: "2026-05-15",
    price: 100,
  },
  {
    id: "3",
    name: "Reza Nouri",
    phone: "09191112233",
    plan: "Gold Plan",
    status: "Expiring Soon",
    joinDate: "2026-06-20",
    price: 150,
  },
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<FilterStatus>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<DetailedMember | null>(
    null,
  );

  const { addMember } = useApp();
  const [members, setMembers] = useState<Member[]>(MOCK_MEMBERS);

  const filteredMembers: Member[] = members.filter(
    (member: Member): boolean => {
      const query: string = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        member.name.toLowerCase().includes(query) ||
        (member.phone ? String(member.phone).includes(query) : false);
      const matchesStatus =
        selectedFilter === "All" || member.status === selectedFilter;
      return matchesSearch && matchesStatus;
    },
  );

  const handleSaveMember = (data: NewMemberFormData): void => {
    let price = 50;
    if (data.plan.includes("Standard")) price = 100;
    if (data.plan.includes("Premium")) price = 150;

    const newMember: Member = {
      id: Date.now().toString(),
      name: data.name.trim(),
      phone: data.phone.trim(),
      plan: data.plan,
      price: price,
      status: "Active",
      joinDate: data.startDate,
    };

    setMembers((prev) => [newMember, ...prev]);
    addMember(newMember);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (selectedDeleteId) {
      setMembers((prev) => prev.filter((m) => m.id !== selectedDeleteId));
      setIsDeleteOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleUpdateMember = (data: NewMemberFormData) => {
    if (editingMember) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: data.name.trim(),
                phone: data.phone.trim(),
                plan: data.plan,
                joinDate: data.startDate,
              }
            : m,
        ),
      );
      setIsEditOpen(false);
      setEditingMember(null);
    }
  };

  return (
    <GlowLayout>
      <div className="flex h-screen w-full bg-[#0b1224] text-white overflow-hidden">
        <Sidebar />

        <main className="flex-1 h-full bg-[#0b1224] p-4 md:p-8 space-y-6 overflow-y-auto z-10 transition-all duration-300">
          <div className="w-full mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-white/[0.02] pb-5">
              <div>
                <h1 className="text-2xl font-bold text-slate-200 tracking-tight">
                  Gym Members
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Manage, search, and filter registered athletes
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                <span>+</span>
                <span>Add Member</span>
              </button>
            </div>

            <MemberFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />

            <MemberTable
              members={filteredMembers}
              onEditClick={(member) => {
                setEditingMember(member);
                setIsEditOpen(true);
              }}
              onDeleteClick={(id) => {
                setSelectedDeleteId(id);
                setIsDeleteOpen(true);
              }}
              onViewClick={(member) => setViewingMember(member)}
            />
          </div>
        </main>
      </div>

      {isModalOpen && (
        <AddMemberModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMember}
        />
      )}

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {isEditOpen && (
        <AddMemberModal
          initialData={editingMember}
          onClose={() => {
            setIsEditOpen(false);
            setEditingMember(null);
          }}
          onSave={handleUpdateMember}
        />
      )}

      <MemberViewDrawer
        member={viewingMember}
        onClose={() => setViewingMember(null)}
        onEditClick={(member) => {
          setEditingMember(member);
          setIsEditOpen(true);
        }}
        onDeleteClick={(id) => {
          setSelectedDeleteId(id);
          setIsDeleteOpen(true);
        }}
      />
    </GlowLayout>
  );
}
