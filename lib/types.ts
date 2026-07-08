export type EventsMap = Record<string, { name: string }[]>;

export type Transaction = {
  id: string;
  vendor: string;
  category: string;
  date: string;
  amount: number;
  status: "approved" | "review" | "violation";
};
