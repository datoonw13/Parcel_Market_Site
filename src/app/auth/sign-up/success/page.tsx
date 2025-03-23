"use client";

import dynamic from "next/dynamic";

const Success = dynamic(() => import("./success"), { ssr: false });

const SuccessPage = () => <Success />;

export default SuccessPage;
