"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export type PaymentStatus = "Paid" | "Unpaid" | "Pending" | "Failed";

export type TimeFrame = "7d" | "30d" | "1y" | "all" | string;

export interface PaymentHistory {
  date: string;
  amount: string;
  status: PaymentStatus;
}

export interface Transaction {
  id: string;
  invoiceNo?: string;
  memberId?: string;
  memberName: string;
  memberEmail?: string;
  amount: number | string;
  status: PaymentStatus;
  date: string;
  method?: string;
  planName?: string;
}

export async function addPaymentAction(formData: FormData) {
  const userId = formData.get("userId") as string;
  const amount = Number(formData.get("amount"));
  const method = formData.get("method") as string;
  const rawStatus = (formData.get("status") as string) || "Paid";

  const status: PaymentStatus =
    rawStatus.toLowerCase() === "paid"
      ? "Paid"
      : rawStatus.toLowerCase() === "unpaid"
        ? "Unpaid"
        : rawStatus.toLowerCase() === "failed"
          ? "Failed"
          : "Pending";

  if (!userId || !amount) return { error: "Missing fields" };

  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(startDate.getMonth() + 1);

  const { error } = await supabase.from("user_subscriptions").insert([
    {
      user_id: userId,
      plan_name: "Manual Payment",
      amount: amount,
      duration_months: 1,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: "Active",
      payment_status: status,
      method: method,
    },
  ]);

  if (error) {
    console.error("Error inserting payment:", error.message);
    return { error: error.message };
  }

  revalidatePath("/payments");
}
