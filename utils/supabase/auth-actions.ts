"use server";

import { createClient } from "./server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

function mapAuthError(rawMessage: string): string {
  const msg = rawMessage.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please check your details and try again.";
  }
  if (
    msg.includes("user already registered") ||
    msg.includes("already been registered")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email before signing in.";
  }
  if (
    msg.includes("password should be at least") ||
    msg.includes("password is too short")
  ) {
    return "Password must be at least 6 characters long.";
  }
  if (
    msg.includes("unable to validate email address") ||
    msg.includes("invalid email")
  ) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("rate limit") || msg.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (msg.includes("network") || msg.includes("fetch failed")) {
    return "Connection issue. Please check your internet and try again.";
  }

  return "Something went wrong. Please try again.";
}

export async function ensureUserRecords(
  userId: string,
  email: string,
  fallbackName: string,
) {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing in env variables.");
    return;
  }

  const serviceSupabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
  );

  // ۱. بررسی یا ایجاد رکورد در جدول members
  const { data: existingMember } = await serviceSupabase
    .from("members")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!existingMember) {
    const { error: memberError } = await serviceSupabase
      .from("members")
      .insert({
        user_id: userId,
        name: fallbackName,
        email: email,
        phone: "",
        plan_name: null,
        price: 0,
        status: "active",
        joined_date: new Date().toISOString(),
      });

    if (memberError) {
      console.error(
        "Error creating missing member record:",
        memberError.message,
      );
    }
  }

  // ۲. بررسی یا ایجاد رکورد در جدول profiles
  const { data: existingProfile } = await serviceSupabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (!existingProfile) {
    const { error: profileError } = await serviceSupabase
      .from("profiles")
      .insert({
        id: userId,
        full_name: fallbackName,
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error(
        "Error creating missing profile record:",
        profileError.message,
      );
    }
  }
}

export async function signUpAction(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // ۱. ساخت کاربر در Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    console.error("RAW SUPABASE ERROR:", error.message);
    return { success: false, error: mapAuthError(error.message) };
  }

  if (!data.user) {
    return {
      success: false,
      error: "Could not create account. Please try again.",
    };
  }

  // ۲. ایجاد نشست فوری برای ست شدن کوکی‌ها
  await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // ۳. اطمینان از ساخت رکوردهای پایه در دیتابیس
  await ensureUserRecords(data.user.id, email, email.split("@")[0]);

  return {
    success: true,
    userId: data.user.id, // 👈 برای استفاده در فرانت‌اند
    message: "Account created successfully.",
  };
}

export async function completeProfileAction(formData: FormData) {
  const supabase = await createClient();

  // ۱. دریافت کاربر از سشن جاری
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ۲. در صورت عدم وجود سشن، خواندن userId مستقیم از FormData
  const passedUserId = formData.get("userId") as string;
  const targetUserId = user?.id || passedUserId;

  if (!targetUserId) {
    return { success: false, error: "Not authenticated" };
  }

  const fullName = formData.get("fullName") as string;
  const age = formData.get("age") as string;
  const phone = formData.get("phone") as string;

  // استفاده از کلاینت عمومی یا Service Role برای اطمینان از انجام عملیات
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const dbClient = serviceRoleKey
    ? createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceRoleKey)
    : supabase;

  // به‌روزرسانی یا ایجاد پروفایل
  const { error: profileError } = await dbClient.from("profiles").upsert({
    id: targetUserId,
    full_name: fullName,
    age: age ? Number(age) : null,
    phone: phone,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return { success: false, error: mapAuthError(profileError.message) };
  }

  // همگام‌سازی جدول members
  if (serviceRoleKey) {
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
    );

    const { error: memberSyncError } = await serviceSupabase
      .from("members")
      .update({
        name: fullName,
        phone: phone,
      })
      .eq("user_id", targetUserId);

    if (memberSyncError) {
      console.error("Error syncing members table:", memberSyncError.message);
    }
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
    console.error("RAW SUPABASE ERROR:", error.message);
    return { success: false, error: mapAuthError(error.message) };
  }

  if (data.user) {
    const fallbackName =
      data.user.user_metadata?.full_name || email.split("@")[0];
    await ensureUserRecords(data.user.id, email, fallbackName);
  }

  return { success: true, user: data.user };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { success: true };
}
