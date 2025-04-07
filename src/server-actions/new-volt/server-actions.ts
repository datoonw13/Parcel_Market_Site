"use server";

export const testReq = async () => {
  const req = await fetch("https://dummyjson.com/auth/login?delay=5000", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: "emilys",
      password: "emilyspass",
      expiresInMins: 30, // optional, defaults to 60
    }),
    next: {
      revalidate: 10,
    },
  });
  const res = await req.json();

  return {
    res,
    message: "OK",
  };
};
