import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SubscribeClient from "./SubscribeClient";

export default async function SubscribePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: activePlans, error: dbError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("status", "Active")
    .order("price", { ascending: true });

  if (dbError) {
    console.error("Error fetching plans:", dbError.message);
  }

  return <SubscribeClient plans={activePlans || []} />;
}
