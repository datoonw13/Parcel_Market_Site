const routes = {
  home: {
    root: "/",
    marketplace: "/lands-marketplace",
  },
  auth: {
    root: "/auth",
    signIn: "/auth/",
    signUp: "/auth/sign-up",
  },
  propertySearch: {
    root: "/find-property",
    signature: "/property-search/signature",
  },
  user: {
    root: "/user",
    properties: "/user/properties",
    profile: "/user/profile",
    listings: "/user/listings",
  },
};

export default routes;
