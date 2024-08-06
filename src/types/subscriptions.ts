export enum SubscriptionType {
  Trial = "Trial",
  Monthly = "Monthly",
  Annual = "Annual",
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

export type IStripePaymentMethods = Array<{
  "id": string,
  "name": string,
  "last4": string,
  "brand": "visa" | 'mastercard' | 'amex',
  "isDefault": boolean
}> 

export interface IStripeCharge {
  amount: number;
  id: string;
  invoice: string;
  receipt_number: string;
  success: boolean;
  created: number;
  receipt_url: string;
  paid: boolean;
}
