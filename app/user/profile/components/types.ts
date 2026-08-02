import { LucideIcon } from "lucide-react";

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  age: number | string;
  height: number | string;
  weight: number | string;
  bmi: number | null;
}

export interface StatusState {
  type: "success" | "error" | null;
  message: string;
}

export interface ProfileHeaderProps {
  formData: ProfileData;
  isEditing: boolean;
  onEditToggle: () => void;
  onCancel: () => void;
  onSignOut: () => void;
}

export interface ProfileCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface ProfileFormProps {
  initialData: ProfileData;
  userId: string;
}
