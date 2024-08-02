export enum SubscriptionType {
  Annual = "Annual",
  Monthly = "Monthly",
  Trial = "Trial",
}

export type IStripeStatuses = "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "paused" | "trialing" | "unpaid";

export interface ISubscription {
  id: string;
  type: SubscriptionType;
  amount: number;
  created: Date;
  activeTo: Date;
  currency: string;
  status: IStripeStatuses;
}
