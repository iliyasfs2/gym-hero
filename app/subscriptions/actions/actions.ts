"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addPlanAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const duration = formData.get("duration") as string;
  const status = (formData.get("status") as string) || "Active";

  if (!name || isNaN(price) || !duration) {
    return;
  }

  const { error } = await supabase.from("plans").insert([
    {
      name,
      price,
      duration,
      status,
    },
  ]);

  if (error) {
    console.error("Add Error:", error.message);
    return;
  }

  // بروزرسانی کش هر دو مسیر
  revalidatePath("/subscriptions", "page");
  revalidatePath("/user/subscribe", "page");

  redirect("/subscriptions");
}

export async function updatePlanAction(formData: FormData) {
  const supabase = await createClient();

  const planId = formData.get("planId") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const duration = formData.get("duration") as string;
  const status = formData.get("status") as string;

  if (!planId || !name || isNaN(price) || !duration) {
    console.error("Missing fields or planId");
    return;
  }

  const { error } = await supabase
    .from("plans")
    .update({ name, price, duration, status })
    .eq("id", planId);

  if (error) {
    console.error("Update Error:", error.message);
    return;
  }

  revalidatePath("/subscriptions", "page");
  revalidatePath("/user/subscribe", "page");

  redirect("/subscriptions");
}

export async function deletePlanAction(formData: FormData) {
  const supabase = await createClient();

  const planId = formData.get("planId") as string;

  if (!planId) {
    console.error("No planId provided");
    return;
  }

  const { error } = await supabase.from("plans").delete().eq("id", planId);

  if (error) {
    console.error("Delete Error:", error.message);
    return;
  }

  revalidatePath("/subscriptions", "page");
  revalidatePath("/user/subscribe", "page");

  redirect("/subscriptions");
}
