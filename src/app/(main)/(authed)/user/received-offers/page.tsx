import OfferBox from "@/components/@new/offer/offer-box.tsx/OfferBox";
import ParcelNumberDesktopFilter from "@/components/@new/shared/filters/desktop/ParcelNumberDesktopFilter";

const opts = [
  {
    label: "0.2544",
    value: "0.1326",
  },
  {
    label: "0.7452",
    value: "0.0934",
  },
  {
    label: "0.9945",
    value: "0.8985",
  },
  {
    label: "0.1453",
    value: "0.8177",
  },
  {
    label: "0.6385",
    value: "0.1000",
  },
  {
    label: "0.0181",
    value: "0.3882",
  },
  {
    label: "0.7554",
    value: "0.9214",
  },
  {
    label: "0.8407",
    value: "0.3003",
  },
  {
    label: "0.6760",
    value: "0.3127",
  },
  {
    label: "0.0805",
    value: "0.5269",
  },
  {
    label: "0.1405",
    value: "0.5818",
  },
  {
    label: "0.2202",
    value: "0.9812",
  },
  {
    label: "0.2086",
    value: "0.2956",
  },
  {
    label: "0.5028",
    value: "0.7873",
  },
  {
    label: "0.9706",
    value: "0.4997",
  },
  {
    label: "0.1629",
    value: "0.9953",
  },
  {
    label: "0.1525",
    value: "0.9402",
  },
  {
    label: "0.9063",
    value: "0.6235",
  },
  {
    label: "0.3129",
    value: "0.8631",
  },
  {
    label: "0.1469",
    value: "0.7486",
  },
  {
    label: "0.0486",
    value: "0.0337",
  },
  {
    label: "0.6198",
    value: "0.9437",
  },
  {
    label: "0.8922",
    value: "0.6650",
  },
  {
    label: "0.3456",
    value: "0.4879",
  },
  {
    label: "0.6456",
    value: "0.9552",
  },
];
const UserOffers = () => (
  <div>
    <ParcelNumberDesktopFilter options={opts} />
    <OfferBox />
  </div>
);

export default UserOffers;
