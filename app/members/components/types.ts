import { Member } from "@/app/components/context/AppContext";

export interface NewMemberFormData {
  name: string;
  phone: string;
  plan: string;
  startDate: string;
}

export type FilterStatus = "All" | "Active" | "Expired" | "Expiring Soon";

export interface PaymentHistory {
  date: string;
  amount: string;
  status: "Paid" | "Unpaid" | "Pending";
}

export interface WorkoutDay {
  day: string;
  target: string;
}

export interface DetailedMember extends Member {
  email?: string;
  endDate?: string;
  daysLeft?: number;
  payments?: PaymentHistory[];
  workoutPlan?: WorkoutDay[];
}
