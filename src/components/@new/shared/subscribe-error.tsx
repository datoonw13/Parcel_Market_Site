import Button from "@/components/shared/Button";
import routes from "@/helpers/routes";
import Image from "next/image";
import Link from "next/link";

const SubscribeError = () => (
  <div className="bg-grey-30 rounded-2xl p-5 flex items-center justify-center flex-col gap-6">
    <div className="w-[136px] h-[112px] md:w-48 md:h-[160px] relative">
      <Image src="/subscribe-error.svg" alt="" fill className="w-full h-full" />
    </div>
    <div className="space-y-3 mx-auto max-w-96">
      <h1 className="font-semibold md:font-medium text-md md:text-lg text-center">Your Free Subscription has been Expired</h1>
      <h2 className="text-grey-800 text-xs text-center">
        If you want to activate new plan click on Choose Plan button, or check the information on your profile section
      </h2>
    </div>
    <Link href={routes.user.subscription.fullUrl}>
      <Button classNames="!bg-warning !text-white !text-sm !px-6 !py-3">Subscribe</Button>
    </Link>
  </div>
);

export default SubscribeError;
