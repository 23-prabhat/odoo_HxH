export type CreateExpenseInput = {
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  receiptName?: string;
};
