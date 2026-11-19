export type PaymentStatus = "Paid" | "Unpaid" | "Pending" | "Failed";

export type TimeFrame = "7d" | "30d" | "1y" | "all" | string;

export interface PaymentHistory {
  date: string;
  amount: string;
  status: PaymentStatus;
}

export interface Transaction {
  id: string;
  invoiceNo?: string;
  memberId?: string;
  memberName: string;
  memberEmail?: string;
  amount: number | string;
  status: PaymentStatus;
  date: string;
  method?: string;
  planName?: string;
}
