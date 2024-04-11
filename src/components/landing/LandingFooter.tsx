import LogoTwo from "@/icons/LogoTwo";
import Container from "../shared/Container";

const data = [
  {
    title: "Products",
    children: [
      {
        label: "Parcel Market",
      },
      {
        label: "Rejiggle",
      },
    ],
  },
  {
    title: "Resources",
    children: [
      {
        label: "Support",
      },
      {
        label: "Contacts",
      },
      {
        label: "Guides",
      },
      {
        label: "Privacy",
      },
      {
        label: "Terms",
      },
    ],
  },
  {
    title: "Company",
    children: [
      {
        label: "About",
      },
      {
        label: "Customers",
      },
      {
        label: "Partners",
      },
      {
        label: "Jobs",
      },
      {
        label: "Blog",
      },
    ],
  },
  {
    title: "Use cases",
    children: [
      {
        label: "SaaS",
      },
      {
        label: "Platforms",
      },
      {
        label: "Marketplaces",
      },
      {
        label: "E-commerce",
      },
    ],
  },
  {
    title: "Developers",
    children: [
      {
        label: "Documentation",
      },
      {
        label: "API reference",
      },
      {
        label: "Status",
      },
    ],
  },
  {
    title: "Social",
    children: [
      {
        label: "Facebook",
      },
      {
        label: "Twitter",
      },
    ],
  },
];

const LandingFooter = () => (
  <div>
    <Container
      className="bg-dark-green py-6 sm:py-8 lg:py-14 md:py-20 xl:py-24 flex flex-col 
    md:flex-row-reverse sm:justify-between"
    >
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-8 md:gap-x-18 lg:gap-x-24">
        {data.map((item) => (
          <div key={item.title}>
            <h4 className="text-green font-medium mb-2">{item.title}</h4>
            <ul>
              {item.children.map((child) => (
                <li className="text-grey-100 font-medium cursor-pointer mb-1" key={child.label}>
                  {child.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="w-[140px] md:w-[180px] lg:w-[220px] m-auto mt-12 md:m-0">
        <LogoTwo />
      </div>
    </Container>
    <Container
      className="bg-dark-green-400 text-center 
    sm:text-start text-white py-6 lg:text-start md:px-28"
    >
      ©2024 Parcel Market. All rights reserved.
    </Container>
  </div>
);

export default LandingFooter;
