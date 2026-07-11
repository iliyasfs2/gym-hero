"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function addPaymentAction(formData: FormData) {
  const memberName = formData.get("memberName") as string;
  const amount = Number(formData.get("amount"));
  const method = formData.get("method") as string;
  const status = formData.get("status") as string;

  if (!memberName || !amount) return { error: "Missing fields" };

  const { error } = await supabase.from("payments").insert([
    {
      member_name: memberName,
      amount: amount,
      method: method,
      status: status,
    },
  ]);

  if (error) {
    console.error("Error inserting payment:", error.message);
    return { error: error.message };
  }

  revalidatePath("/payments");
}
