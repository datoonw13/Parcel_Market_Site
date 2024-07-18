import { getUserAction } from "@/server-actions/user/actions";
import clsx from "clsx";
import classes from "@/app/value-land/(main)/styles.module.css";
import AboutLandForm from "./about-land-form";
import ValueLandStepper from "../value-land-stepper";

const AboutLand = async () => {
  const user = await getUserAction();
  return (
    <div className="h-full flex flex-col w-full gap-6">
      <ValueLandStepper currentStep={3} />
      <div className={clsx("space-y-3 md:space-y-2", classes["content-space-x"])}>
        <h1 className="text-lg font-semibold ">Did we find your property?</h1>
        <h2 className="text-sm text-grey-800">Use the map or list below to select your property.</h2>
      </div>
      <AboutLandForm user={user} />
    </div>
  );
};

export default AboutLand;
