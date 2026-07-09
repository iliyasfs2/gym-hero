export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  activeMembers: number;
  status: "Active" | "Inactive";
}
