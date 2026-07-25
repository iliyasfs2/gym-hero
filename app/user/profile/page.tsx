import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/app/user/profile/profileForm";

export const revalidate = 0;

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single();

  let bmi = null;
  if (profile?.height && profile?.weight) {
    const heightInMeters = profile.height / 100;
    bmi = Number(
      (profile.weight / (heightInMeters * heightInMeters)).toFixed(1),
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>
      <ProfileForm
        initialData={{
          name: profile?.full_name || "",
          email: session.user.email || "",
          phone: profile?.phone || "",
          age: profile?.age || "",
          height: profile?.height || "",
          weight: profile?.weight || "",
          bmi: bmi,
        }}
        userId={session.user.id}
      />
    </div>
  );
}
