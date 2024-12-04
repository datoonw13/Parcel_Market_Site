import dynamic from "next/dynamic";
import TestSelect from "./select";

const TestMap = dynamic(() => import("./map"), { ssr: false });

const TestPage = async ({ searchParams }: any) => (
  <div className="w-full h-full flex flex-col gap-[250px]">
    <TestSelect />
    {searchParams.state && searchParams.county ? <TestMap searchParams={searchParams} /> : "loading"}
  </div>
);

export default TestPage;
