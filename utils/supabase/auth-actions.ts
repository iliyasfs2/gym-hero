"use server";

import { createClient } from "./server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function mapAuthError(err: unknown): string {
  if (!err) return "Authentication failed. Please try again.";

  let msg = "";
  if (typeof err === "string") {
    msg = err;
  } else if (typeof err === "object" && err !== null) {
    const errObj = err as {
      message?: string;
      error_description?: string;
      msg?: string;
    };
    msg = errObj.message || errObj.error_description || errObj.msg || "";
  } else {
    msg = String(err);
  }

  msg = msg.trim();

  if (!msg || msg === "{}" || msg === "[object Object]") {
    return "Something went wrong. Please try again.";
  }

  const lower = msg.toLowerCase();

  if (
    lower.includes("security purposes") ||
    lower.includes("60 seconds") ||
    lower.includes("rate limit") ||
    lower.includes("too many requests")
  ) {
    return "Please wait a moment before trying again.";
  }
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (
    lower.includes("user already registered") ||
    lower.includes("already been registered") ||
    lower.includes("already exists")
  ) {
    return "An account with this email already exists. Try signing in.";
  }
  if (lower.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }

  return msg;
}

export async function ensureUserRecords(
  userId: string,
  email: string,
  fallbackName: string,
) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) return;

    const serviceSupabase = createServiceClient(supabaseUrl, serviceRoleKey);

    const { data: existingMember } = await serviceSupabase
      .from("members")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!existingMember) {
      await serviceSupabase.from("members").insert({
        user_id: userId,
        name: fallbackName,
        email: email,
        phone: "",
        plan_name: null,
        price: 0,
        status: "active",
        joined_date: new Date().toISOString(),
      });
    }

    const { data: existingProfile } = await serviceSupabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    if (!existingProfile) {
      await serviceSupabase.from("profiles").insert({
        id: userId,
        full_name: fallbackName,
        role: "user",
        updated_at: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.error("ensureUserRecords error:", err);
  }
}

export async function signUpAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    if (!data.user) {
      return { success: false, error: "Could not create account." };
    }

    await supabase.auth.signInWithPassword({
      email,
      password,
    });

    await ensureUserRecords(data.user.id, email, email.split("@")[0]);

    return {
      success: true,
      userId: data.user.id,
    };
  } catch (err: unknown) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function signInAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    let role = "user";

    if (data.user) {
      const fallbackName =
        data.user.user_metadata?.full_name || email.split("@")[0];
      await ensureUserRecords(data.user.id, email, fallbackName);

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profile?.role) {
        role = profile.role;
      }
    }

    return { success: true, user: data.user, role };
  } catch (err: unknown) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function completeProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const fullName = formData.get("fullName") as string;
    const age = formData.get("age") as string;
    const phone = formData.get("phone") as string;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const dbClient =
      supabaseUrl && serviceRoleKey
        ? createServiceClient(supabaseUrl, serviceRoleKey)
        : supabase;

    const { data: existingProfile } = await dbClient
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    await dbClient.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      age: age ? Number(age) : null,
      phone: phone,
      role: existingProfile?.role || "user",
      updated_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
