import { SubscriptionPlan } from "./types";

export const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: "1",
    name: "Standard Plan",
    price: 50,
    duration: "1 Month",
    status: "Active",
    activeMembers: 12,
  },
  {
    id: "2",
    name: "Gold VIP Plan",
    price: 130,
    duration: "3 Months",
    status: "Active",
    activeMembers: 8,
  },
  {
    id: "3",
    name: "Elite Diamond",
    price: 240,
    duration: "6 Months",
    status: "Inactive",
    activeMembers: 0,
  },
];
