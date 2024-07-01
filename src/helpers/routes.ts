const routes = {
  home: {
    url: "",
    protected: false,
    landsMarketplace: {
      url: "lands-marketplace",
      protected: true,
    },
  },
  auth: {
    url: "auth",
    protected: false,
    signIn: {
      url: "sign-in",
      protected: false,
    },
    signUp: {
      url: "sign-up",
      protected: false,
    },
  },
  propertySearch: {
    url: "find-property",
    protected: false,
    signature: {
      url: "signature",
      protected: true,
    },
  },
  user: {
    url: "user",
    protected: true,
    properties: {
      url: "properties",
      protected: true,
    },
    profile: {
      url: "profile",
      protected: true,
    },
    listings: {
      url: "listings",
      protected: false,
    },
    followedProperties: {
      url: "followed-properties",
      protected: true,
    },
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
