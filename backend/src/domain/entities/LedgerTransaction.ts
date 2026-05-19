export interface LedgerTransaction {
  id?: string;
  customerId: string;
  type: "debit" | "credit";
  amount: number;
  referenceId?: string; // Could be Sale ID or Payment ID
  description: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
