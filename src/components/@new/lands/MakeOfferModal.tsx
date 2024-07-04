import dynamic from "next/dynamic";

const ResponsiveModal = dynamic(() => import("../shared/modals/ResponsiveModal"), { ssr: false });

const MakeOfferModal = () => <ResponsiveModal content={<div />} responsiveContent={<div>qww</div>} open handleClose={() => {}} />;

export default MakeOfferModal;
