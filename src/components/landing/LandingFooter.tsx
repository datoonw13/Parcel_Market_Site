import LogoTwo from "@/icons/LogoTwo";

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
    <div className="bg-dark-green">
      <div>
        {data.map((item) => (
          <div key={item.title}>
            <div>
              <h4 className="text-green font-medium">{item.title}</h4>
              <ul>
                {item.children.map((child) => (
                  <li className="text-grey-100 font-medium" key={child.label}>
                    {child.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      <div>
        <LogoTwo />
      </div>
    </div>
    <div className="bg-dark-green-400 text-center text-white py-6 lg:text-start md:wpx-28">©2024 Parcel Market. All rights reserved.</div>
  </div>
);

export default LandingFooter;
