"use server";

import { createClient } from "@/public/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addPlanAction(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const duration = formData.get("duration") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase
    .from("plans")
    .insert([{ name, price, duration, status }]);

  if (error) {
    return;
  }

  revalidatePath("/subscriptions");

  redirect("/subscriptions");
}
