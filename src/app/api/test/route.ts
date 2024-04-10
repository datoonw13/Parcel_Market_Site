import { NextResponse } from "next/server";

const delay = (time: number) =>
  new Promise((res) => {
    setTimeout(res, time);
  });

export async function GET(request: Request) {
  await delay(1000);
  return NextResponse.json({
    access_token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwLCJuYW1lIjoicXdkcXdkIiwiZW1haWwiOiJpbWVkYWNmMUBnbWFpbC5jb20iLCJyb2xlIjpudWxsLCJpYXQiOjE3MTI3NjMwMjksImV4cCI6MTcxMjc3MzgyOX0.wloK5NM34VapuEfmJ2xc6OyS1CQ1NLyjBxVZEpPh57g",
    payload: {
      sub: 10,
      name: "qwdqwd",
      email: "imedacf1@gmail.com",
      role: null,
    },
  });
}
