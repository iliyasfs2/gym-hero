export type PaymentStatus = "Paid" | "Pending" | "Failed";
export type TimeFrame = "Today" | "Month" | "Year";

export interface Transaction {
  id: string;
  memberName: string;
  amount: number; 
  method: "Cash" | "Online" | "Card";
  date: string;
  status: PaymentStatus;
  invoiceNo: string;
}

export interface ChartDataPoint {
  label: string; 
  amount: number;
}


export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    memberName: "Ali Ahmadi",
    amount: 150,
    method: "Online",
    date: "2026-07-03",
    status: "Paid",
    invoiceNo: "INV-8821",
  },
  {
    id: "t2",
    memberName: "Sara Kamali",
    amount: 100,
    method: "Card",
    date: "2026-07-02",
    status: "Pending",
    invoiceNo: "INV-8822",
  },
  {
    id: "t3",
    memberName: "Reza Nouri",
    amount: 150,
    method: "Cash",
    date: "2026-07-01",
    status: "Paid",
    invoiceNo: "INV-8823",
  },
  {
    id: "t4",
    memberName: "Mina Alavi",
    amount: 50,
    method: "Online",
    date: "2026-06-28",
    status: "Failed",
    invoiceNo: "INV-8824",
  },
  {
    id: "t5",
    memberName: "Arash Moradi",
    amount: 150,
    method: "Online",
    date: "2026-06-25",
    status: "Paid",
    invoiceNo: "INV-8825",
  },
];
