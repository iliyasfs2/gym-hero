"use client";

import React, { useState } from "react";
import Sidebar from "@/app/components/Sidebar";
import GlowLayout from "@/app/components/GlowLayout";
import { useApp, Member } from "@/app/components/context/AppContext";
import MemberFilters from "./MemberFilters";
import MemberTable from "./MemberTable";
import AddMemberModal from "./AddMemberModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import MemberViewDrawer from "./MemberViewDrawer";
import { FilterStatus, NewMemberFormData, DetailedMember } from "./types";

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
}

interface MembersClientContainerProps {
  initialMembers: Member[];
  availablePlans: SubscriptionPlan[];
}

export default function MembersClientContainer({
  initialMembers,
  availablePlans,
}: MembersClientContainerProps) {
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
  const [members, setMembers] = useState<Member[]>(initialMembers);

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

  const handleSaveMember = async (data: NewMemberFormData): Promise<void> => {
    const selectedPlan = availablePlans.find((p) => p.name === data.plan);
    const price = selectedPlan ? selectedPlan.price : 0;

    const { createClient } = await import("@/utils/supabase/clinet");
    const supabase = createClient();

    const { data: insertedMember, error } = await supabase
      .from("members")
      .insert([
        {
          name: data.name.trim(),
          phone: data.phone.trim(),
          plan_name: data.plan,
          price: price,
          status: "Active",
          joined_date: data.startDate
            ? new Date(data.startDate).toISOString()
            : new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error.message);
      return;
    }

    if (insertedMember) {
      const newMember: Member = {
        id: insertedMember.id,
        name: insertedMember.name,
        phone: insertedMember.phone || "",
        plan: insertedMember.plan_name,
        price: Number(insertedMember.price) || 0,
        status: insertedMember.status,
        joinDate: insertedMember.joined_date
          ? insertedMember.joined_date.split("T")[0]
          : data.startDate,
      };

      setMembers((prev) => [newMember, ...prev]);
      addMember(newMember);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeleteId) {
      const { createClient } = await import("@/utils/supabase/clinet");
      const supabase = createClient();

      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", selectedDeleteId);

      if (error) {
        console.error(error.message);
        return;
      }

      setMembers((prev) => prev.filter((m) => m.id !== selectedDeleteId));
      setIsDeleteOpen(false);
      setSelectedDeleteId(null);
    }
  };

  const handleUpdateMember = async (data: NewMemberFormData) => {
    if (editingMember) {
      const selectedPlan = availablePlans.find((p) => p.name === data.plan);
      const price = selectedPlan ? selectedPlan.price : 0;

      const { createClient } = await import("@/utils/supabase/clinet");
      const supabase = createClient();

      const { error } = await supabase
        .from("members")
        .update({
          name: data.name.trim(),
          phone: data.phone.trim(),
          plan_name: data.plan,
          price: price,
          joined_date: data.startDate
            ? new Date(data.startDate).toISOString()
            : new Date().toISOString(),
        })
        .eq("id", editingMember.id);

      if (error) {
        console.error(error.message);
        return;
      }

      setMembers((prev) =>
        prev.map((m) =>
          m.id === editingMember.id
            ? {
                ...m,
                name: data.name.trim(),
                phone: data.phone.trim(),
                plan: data.plan,
                price: price,
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
          availablePlans={availablePlans}
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
          availablePlans={availablePlans}
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
