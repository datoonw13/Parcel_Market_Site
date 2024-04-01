import ArrowCircleIcon from "@/icons/ArrowCircleIcon";
import clsx from "clsx";
import Button from "./Button";

interface Props {
  totalSteps: number;
  currentStep: number;
  goBack: () => void;
}

const ProgressBar = (props: Props) => {
  const { currentStep, goBack, totalSteps } = props;
  const completedPercent = (100 / totalSteps) * currentStep;
  return (
    <div>
      <div className="flex items-center gap-8 justify-between mb-4">
        <Button startIcon={<ArrowCircleIcon />} type="text" classNames="!p-0">
          Back
        </Button>
        <p className="text-green-600 font-medium">{completedPercent}% complete</p>
      </div>
      <div className="flex gap-1">
        {new Array(totalSteps).fill(totalSteps).map((_, i) => (
          <div className={clsx("bg-green h-[12px] w-full first:rounded-l-lg last:rounded-r-lg", i + 1 > currentStep && "opacity-20")} key={Math.random()} />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
