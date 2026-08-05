"use server";

import { createClient } from "./server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function mapAuthError(err: any): string {
  if (!err) return "Authentication failed. Please try again.";

  let msg = "";
  if (typeof err === "string") {
    msg = err;
  } else if (typeof err === "object" && err !== null) {
    msg = err.message || err.error_description || err.msg || "";
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

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://gymheroo.netlify.app";

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error: mapAuthError(error) };
    }

    if (!data.user) {
      return { success: false, error: "Could not create account." };
    }

    await ensureUserRecords(data.user.id, email, email.split("@")[0]);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return {
        success: true,
        isEmailConfirmationRequired: true,
        message:
          "Account created! Please check your email to confirm your account.",
      };
    }

    return {
      success: true,
      userId: data.user.id,
      isEmailConfirmationRequired: false,
      message: "Account created successfully.",
    };
  } catch (err: any) {
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

    if (data.user) {
      const fallbackName =
        data.user.user_metadata?.full_name || email.split("@")[0];
      await ensureUserRecords(data.user.id, email, fallbackName);
    }

    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function completeProfileAction(formData: FormData) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const passedUserId = formData.get("userId") as string;
    const targetUserId = user?.id || passedUserId;

    if (!targetUserId) {
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

    await dbClient.from("profiles").upsert({
      id: targetUserId,
      full_name: fullName,
      age: age ? Number(age) : null,
      phone: phone,
      role: "user",
      updated_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: mapAuthError(err) };
  }
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
