const routes = {
  home: {
    root: "/",
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
  },
};

export default routes;
