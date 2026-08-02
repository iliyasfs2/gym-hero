"use server";

import { createClient } from "./server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data.user?.id) {
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { error: memberError } = await serviceSupabase
      .from("members")
      .insert({
        user_id: data.user.id,
        name: email.split("@")[0],
        email: email,
        phone: "",
        plan_name: null,
        price: 0,
        status: "active",
        joined_date: new Date().toISOString(),
      });

    if (memberError) {
      console.error(
        "❌ Error creating member record on signup:",
        memberError.message,
      );
    }
  }

  return {
    success: true,
    message: "Account created successfully.",
  };
}

export async function completeProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const fullName = formData.get("fullName") as string;
  const age = formData.get("age") as string;
  const phone = formData.get("phone") as string;

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: fullName,
    age: age ? Number(age) : null,
    phone: phone,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { error: memberSyncError } = await serviceSupabase
    .from("members")
    .update({
      name: fullName,
      phone: phone,
    })
    .eq("user_id", user.id);

  if (memberSyncError) {
    console.error("❌ Error syncing members table:", memberSyncError.message);
  }

  return { success: true };
}

export async function signInAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
