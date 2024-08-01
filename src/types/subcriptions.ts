export enum SubscriptionType {
  Annual = "Annual",
  Monthly = "Monthly",
  Trial = "Trial",
}

export interface ISubscription {
  id: string;
  type: SubscriptionType;
  amount: number;
  created: Date;
  activeTo: Date;
  currency: string;
  status: string;
}
