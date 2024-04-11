const routes = {
  home: {
    root: "/",
  },
  auth: {
    root: "/auth",
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
  },
  propertySearch: {
    root: "/property-search",
    info: "/property-search/info",
    found: "/property-search/found",
    about: "/property-search/about",
    estimatedPrice: "/property-search/estimated-price",
    signature: "/property-search/signature",
  },
  user: {
    root: "/user",
    profile: "/user/profile",
  },
};

export default routes;
