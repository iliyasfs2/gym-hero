import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/app/user/profile/components/profileForm";

export const revalidate = 0;

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  let bmi = null;
  if (profile?.height && profile?.weight) {
    const heightInMeters = profile.height / 100;
    bmi = Number(
      (profile.weight / (heightInMeters * heightInMeters)).toFixed(1),
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <ProfileForm
        initialData={{
          name: profile?.full_name || "",
          email: user.email || "",
          phone: profile?.phone || "",
          age: profile?.age || "",
          height: profile?.height || "",
          weight: profile?.weight || "",
          bmi: bmi,
        }}
        userId={user.id}
      />
    </div>
  );
}
