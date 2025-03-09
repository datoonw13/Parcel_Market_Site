"use client";

import Image from "next/image";
import { Button } from "../ui/button";

const ScheduleDemo = () => (
  <div className="mt-14 sm:mt-16 md:mt-24 lg:mt-28 xl:mt-32 max-w-6xl mx-auto px-4 lg:px-8 xl:px-20 relative rounded-2xl w-full">
    <div className="relative h-full flex gap-6 flex-col sm:flex-row justify-between items-center w-full p-10">
      <div className="absolute w-full h-full left-0 top-0">
        <div className="w-full h-full relative">
          <svg
            className="w-full h-full sm:hidden"
            preserveAspectRatio="none"
            viewBox="0 0 343 177"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="0.51001"
              width="342"
              height="176"
              rx="23.5"
              fill="url(#paint0_linear_3750_30021)"
              stroke="url(#paint1_linear_3750_30021)"
            />
            <mask id="mask0_3750_30021" maskUnits="userSpaceOnUse" x="0" y="0">
              <rect x="0.790039" y="1.49188" width="341.419" height="174.033" rx="23.5" fill="url(#paint2_linear_3750_30021)" />
              <rect x="0.790039" y="1.49188" width="341.419" height="174.033" rx="23.5" stroke="#C3D6D1" />
            </mask>
            <g mask="url(#mask0_3750_30021)">
              <path
                d="M-339.616 147.425C-325.391 65.6687 -259.194 -80.6916 -108.201 -12.08C80.5402 73.6845 212.639 266.282 355.098 41.1782C469.065 -138.905 510.277 -231.846 516.637 -255.807"
                stroke="url(#paint3_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
              <path
                d="M-340.491 166.755C-326.266 84.9986 -260.069 -61.3616 -109.076 7.24999C79.6652 93.0145 211.764 285.612 354.223 60.5081C468.19 -119.575 509.402 -212.516 515.762 -236.476"
                stroke="url(#paint4_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
              <path
                d="M-341.368 186.083C-327.143 104.327 -260.946 -42.0334 -109.953 26.5782C78.7882 112.343 210.887 304.94 353.346 79.8364C467.313 -100.247 508.525 -193.188 514.885 -217.148"
                stroke="url(#paint5_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
              <path
                d="M-342.246 205.408C-328.021 123.652 -261.824 -22.7083 -110.831 45.9033C77.9103 131.668 210.009 324.265 352.468 99.1615C466.435 -80.9217 507.647 -173.863 514.007 -197.823"
                stroke="url(#paint6_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
              <path
                d="M-343.123 224.73C-328.898 142.974 -262.701 -3.38671 -111.708 65.2249C77.0334 150.989 209.132 343.587 351.591 118.483C465.558 -61.6001 506.77 -154.541 513.13 -178.502"
                stroke="url(#paint7_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
              <path
                d="M-343.998 244.062C-329.773 162.305 -263.576 15.945 -112.583 84.5566C76.1584 170.321 208.257 362.919 350.716 137.815C464.683 -42.2684 505.895 -135.21 512.255 -159.17"
                stroke="url(#paint8_linear_3750_30021)"
                strokeOpacity="0.6"
                strokeWidth="0.632111"
              />
            </g>
            <defs>
              <linearGradient id="paint0_linear_3750_30021" x1="0" y1="88.51" x2="343" y2="88.51" gradientUnits="userSpaceOnUse">
                <stop stop-color="#157DD1" />
                <stop offset="1" stop-color="#16DB65" />
              </linearGradient>
              <linearGradient id="paint1_linear_3750_30021" x1="0" y1="88.51" x2="343" y2="88.51" gradientUnits="userSpaceOnUse">
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint2_linear_3750_30021"
                x1="0.290039"
                y1="88.5085"
                x2="342.709"
                y2="88.5085"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#9FD1B3" />
                <stop offset="1" stop-color="#0E8B40" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_3750_30021"
                x1="-321.516"
                y1="-251.58"
                x2="514.724"
                y2="-213.645"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_3750_30021"
                x1="-322.391"
                y1="-232.25"
                x2="513.849"
                y2="-194.315"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_3750_30021"
                x1="-323.268"
                y1="-212.921"
                x2="512.972"
                y2="-174.987"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_3750_30021"
                x1="-324.146"
                y1="-193.596"
                x2="512.094"
                y2="-155.662"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint7_linear_3750_30021"
                x1="-325.023"
                y1="-174.275"
                x2="511.218"
                y2="-136.34"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_3750_30021"
                x1="-325.898"
                y1="-154.943"
                x2="510.343"
                y2="-117.009"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
            </defs>
          </svg>
          <svg
            className="w-full h-full hidden sm:flex"
            preserveAspectRatio="none"
            viewBox="0 0 1180 153"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.5"
              y="1.11737"
              width="1179"
              height="151"
              rx="23.5"
              fill="url(#paint0_linear_3750_22414)"
              stroke="url(#paint1_linear_3750_22414)"
            />
            <mask id="mask0_3750_22414" maskUnits="userSpaceOnUse" x="1" y="1" width="1178" height="151">
              <rect x="1.5" y="1.96022" width="1177" height="149.311" rx="23.5" fill="url(#paint2_linear_3750_22414)" />
              <rect x="1.5" y="1.96022" width="1177" height="149.311" rx="23.5" stroke="#C3D6D1" />
            </mask>
            <g mask="url(#mask0_3750_22414)">
              <path
                d="M-208.729 186.262C-176.049 114.099 -40.382 -22.6526 240.845 7.64087C592.378 45.5077 829.118 184.74 1114.77 -33.1363C1343.3 -207.437 1427.89 -294.124 1441.62 -315.679"
                stroke="url(#paint3_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
              <path
                d="M-211.744 202.861C-179.064 130.698 -43.3975 -6.05332 237.829 24.2402C589.363 62.1071 826.102 201.339 1111.76 -16.537C1340.29 -190.838 1424.87 -277.525 1438.6 -299.08"
                stroke="url(#paint4_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
              <path
                d="M-214.761 219.459C-182.081 147.297 -46.4141 10.5451 234.813 40.8386C586.346 78.7055 823.086 217.938 1108.74 0.0614303C1337.27 -174.24 1421.86 -260.926 1435.59 -282.482"
                stroke="url(#paint5_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
              <path
                d="M-217.777 236.055C-185.097 163.893 -49.4298 27.141 231.797 57.4345C583.331 95.3014 820.07 234.534 1105.73 16.6574C1334.25 -157.644 1418.84 -244.33 1432.57 -265.886"
                stroke="url(#paint6_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
              <path
                d="M-220.793 252.648C-188.113 180.486 -52.4464 43.734 228.78 74.0275C580.314 111.894 817.053 251.127 1102.71 33.2504C1331.24 -141.051 1415.82 -227.737 1429.55 -249.293"
                stroke="url(#paint7_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
              <path
                d="M-223.809 269.249C-191.129 197.086 -55.462 60.3346 225.765 90.6281C577.298 128.495 814.038 267.727 1099.69 49.851C1328.22 -124.45 1412.81 -211.137 1426.54 -232.692"
                stroke="url(#paint8_linear_3750_22414)"
                stroke-opacity="0.6"
                stroke-width="0.632111"
              />
            </g>
            <defs>
              <linearGradient id="paint0_linear_3750_22414" x1="0" y1="76.6174" x2="1180" y2="76.6174" gradientUnits="userSpaceOnUse">
                <stop stop-color="#157DD1" />
                <stop offset="1" stop-color="#16DB65" />
              </linearGradient>
              <linearGradient id="paint1_linear_3750_22414" x1="0" y1="76.6174" x2="1180" y2="76.6174" gradientUnits="userSpaceOnUse">
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient id="paint2_linear_3750_22414" x1="1" y1="76.6157" x2="1179" y2="76.6157" gradientUnits="userSpaceOnUse">
                <stop stop-color="#9FD1B3" />
                <stop offset="1" stop-color="#0E8B40" />
              </linearGradient>
              <linearGradient
                id="paint3_linear_3750_22414"
                x1="-146.461"
                y1="-156.387"
                x2="1362.83"
                y2="117.89"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint4_linear_3750_22414"
                x1="-149.476"
                y1="-139.787"
                x2="1359.81"
                y2="134.49"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint5_linear_3750_22414"
                x1="-152.493"
                y1="-123.189"
                x2="1356.79"
                y2="151.088"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint6_linear_3750_22414"
                x1="-155.508"
                y1="-106.593"
                x2="1353.78"
                y2="167.684"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient id="paint7_linear_3750_22414" x1="-158.525" y1="-90" x2="1350.76" y2="184.277" gradientUnits="userSpaceOnUse">
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
              <linearGradient
                id="paint8_linear_3750_22414"
                x1="-161.541"
                y1="-73.3994"
                x2="1347.75"
                y2="200.878"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#16DB65" />
                <stop offset="1" stop-color="#157DD1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="space-y-0.5 z-10 relative">
        <h1 className="text-white text-2xl font-extrabold">Schedule a Demo</h1>
        <h2 className="text-white text-sm">Get a detailed demo from our experts and get all your questions answered with clarity.</h2>
      </div>
      <Button className="bg-grey-30 hover:bg-grey-50 text-black md:px-16 mr-auto sm:mr-0">Get a Demo</Button>
    </div>
  </div>
);

export default ScheduleDemo;
