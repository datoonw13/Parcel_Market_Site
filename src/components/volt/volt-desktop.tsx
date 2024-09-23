import { ScrollArea } from "@/components/ui/scroll-area";
import Logo from "@/icons/Logo";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import Link from "next/link";
import { IDecodedAccessToken } from "@/types/auth";
import { Dispatch, FC, SetStateAction } from "react";
import { VoltSteps } from "@/types/volt";
import VoltSearch from "./volt-search";
import VoltFooter from "./volt-footer";
import VoltSearchResult from "./volt-search-result";

const Map = dynamic(() => import("@/components/shared/map/Map"), { ssr: false });

const primaryLayout = `"details map" "footer map"`;
const secondaryLayout = `"details map" "footer footer"`;

interface VoltDesktopProps {
  user: IDecodedAccessToken | null;
  step: VoltSteps;
  setStep: Dispatch<SetStateAction<VoltSteps>>;
}

const VoltDesktop: FC<VoltDesktopProps> = ({ user, setStep, step }) => (
  <div
    style={{ gridTemplateAreas: primaryLayout }}
    className={cn(
      "hidden lg:grid h-full w-full grid-rows-[1fr_minmax(0,_max-content)] grid-cols-[350px_1fr] lg:grid-cols-[406px_1fr] xl:grid-cols-[490px_1fr]"
    )}
  >
    <div className="h-full grid grid-rows-[minmax(0,_max-content)_1fr] overflow-hidden" style={{ gridArea: "details" }}>
      <div className="px-14 xl:px-16 pt-14 xl:pt-16 pb-14">
        <Link href="/">
          <Logo className="w-[141px] h-10" />
        </Link>
      </div>
      <div className="overflow-hidden grid">
        <ScrollArea className="">
          <div className="overflow-hidden flex flex-col gap-8 px-5 lg:px-8 xl:px-11">
            {(step === VoltSteps.SEARCH || step === VoltSteps.SEARCH_RESULTS) && (
              <VoltSearch user={user} onSuccess={() => setStep(VoltSteps.SEARCH_RESULTS)} />
            )}
            {step === VoltSteps.SEARCH_RESULTS && <VoltSearchResult />}
          </div>
        </ScrollArea>
      </div>
    </div>
    <div className="bg-primary-main-100" style={{ gridArea: "map" }}>
      <Map
        properties={[{ parcelNumber: "test", latitude: 39.8283459, longitude: -98.5794797, center: true, markerType: "none" }]}
        disableZoom
        zoom={4}
        dragging={false}
      />
    </div>
    <div className="px-5 lg:px-8 xl:px-11 h-fit" style={{ gridArea: "footer" }}>
      <VoltFooter />
    </div>
  </div>
);

export default VoltDesktop;
