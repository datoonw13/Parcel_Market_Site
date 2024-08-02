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

export interface IStripePaymentMethods {
  object: string;
  data: {
    id: string;
    object: string;
    allow_redisplay: string;
    billing_details: {
      address: {
        city: null;
        country: string;
        line1: null;
        line2: null;
        postal_code: null;
        state: null;
      };
      email: string;
      name: string;
      phone: null;
    };
    card: {
      brand: string;
      checks: null;
      country: string;
      display_brand: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      funding: string;
      generated_from: null;
      last4: string;
      networks: null;
      three_d_secure_usage: null;
      wallet: null;
    };
    created: number;
    customer: string;
    livemode: boolean;
    metadata: null;
    type: string;
  }[];
  has_more: boolean;
  url: string;
}
