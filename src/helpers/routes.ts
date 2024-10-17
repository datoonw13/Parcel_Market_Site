const routes = {
  home: {
    url: "home",
    protected: false,
    fullUrl: "/home",
  },
  aboutUs: {
    url: "about-us",
    protected: false,
    fullUrl: "/about-us",
  },
  marketplace: {
    url: "marketplace",
    fullUrl: "/marketplace",
    protected: true,
    landDetails: {
      url: ":id",
      fullUrl: "/marketplace/:id",
      protected: true,
    },
  },
  auth: {
    url: "auth",
    fullUrl: "/auth",
    protected: false,
    signIn: {
      url: "sign-in",
      fullUrl: "/auth/sign-in",
      protected: false,
    },
    signUp: {
      url: "sign-up",
      fullUrl: "/auth/sign-up",
      protected: false,
    },
  },
  user: {
    url: "user",
    fullUrl: "/user",
    protected: true,
    notifications: {
      url: "notifications",
      fullUrl: "/user/notifications",
      protected: true,
    },
    messages: {
      url: "messages",
      fullUrl: "/user/messages",
      protected: true,
    },
    profile: {
      url: "profile",
      fullUrl: "/user/profile",
      protected: true,
    },
    properties: {
      url: "properties",
      fullUrl: "/user/properties",
      protected: true,
    },
    followedProperties: {
      url: "followed-listings",
      fullUrl: "/user/followed-listings",
      protected: true,
    },
    offers: {
      url: "offers",
      fullUrl: "/user/offers",
      protected: true,
      received: {
        url: "received",
        fullUrl: "/user/offers/received",
        protected: true,
      },
      sent: {
        url: "sent",
        fullUrl: "/user/offers/sent",
        protected: true,
      },
    },
    subscription: {
      url: "subscription",
      fullUrl: "/user/subscription",
      protected: true,
    },
    recentSearches: {
      url: "recent-searches",
      fullUrl: "/user/recent-searches",
      protected: true,
    },
  },
  valueLand: {
    url: "value-land",
    fullUrl: "/value-land",
    calculationTerms: {
      url: "calculation-terms",
      fullUrl: "/value-land/calculation-terms",
      protected: false,
    },
    protected: false,
    found: {
      url: "found",
      fullUrl: "/value-land/found",
      protected: false,
    },
    about: {
      url: "about",
      fullUrl: "/value-land/about",
      protected: false,
    },
    value: {
      url: "value",
      fullUrl: "/value-land/value",
      protected: false,
    },
    signature: {
      url: "signature",
      fullUrl: "/value-land/signature",
      protected: true,
    },
    terms: {
      url: "terms",
      fullUrl: "/value-land/terms",
      protected: true,
    },
  },
  checkout: {
    url: "checkout",
    protected: true,
    fullUrl: "/checkout",
  },
  subscription: {
    url: "subscription",
    protected: true,
    fullUrl: "/subscription",
  },
  userSubscription: {
    url: "user-subscription",
    protected: true,
    fullUrl: "/user-subscription",
  },
  volt: {
    url: "volt",
    protected: false,
    fullUrl: "/volt",
  },
  privacyPolicy: {
    url: "privacy-policy",
    protected: false,
    fullUrl: "/privacy-policy",
  },
  questions: {
    url: "questions",
    protected: false,
    fullUrl: "/questions",
  },
  termsConditions: {
    url: "terms-conditions",
    protected: false,
    fullUrl: "/terms-conditions",
  },
};

export const getAllRoutes = (
  obj?: { [key: string]: any },
  prevUrl: string = "",
  prevUrls: { [key: string]: { protected: boolean } } = {}
) => {
  const urls = prevUrls;
  if (!obj) {
    obj = routes;
  }
  Object.keys(obj).forEach((key) => {
    let url = prevUrl;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      url += `${url ? "/" : ""}${obj[key].url}`;
      urls[`/${url}`] = { protected: obj[key].protected };
      return getAllRoutes(obj[key], url, prevUrls);
    }
    return null;
  });
  return urls;
};

export default routes;
