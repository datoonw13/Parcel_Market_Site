import clsx from "clsx";
import React from "react";

export const ClockIcon1 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg className={clsx("w-4 h-4", `fill-${color}`, className)} viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.49971 0H0.500003C0.367394 0 0.240216 0.0478884 0.146448 0.133132C0.0526788 0.218376 0 0.333992 0 0.454545C0 1.79156 0.416482 3.0215 1.11551 3.92933C1.45088 4.36487 1.85879 4.73401 2.32241 5C1.85879 5.26599 1.45088 5.63513 1.11551 6.07067C0.416482 6.9785 0 8.20844 0 9.54545C0 9.79649 0.223858 10 0.5 10H7.5C7.77614 10 8 9.79649 8 9.54545C8 8.20844 7.58352 6.9785 6.88449 6.07067C6.54912 5.63513 6.14121 5.26599 5.67759 5C6.14121 4.73401 6.54912 4.36487 6.88449 3.92933C7.58352 3.0215 8 1.79156 8 0.454545C8 0.333992 7.94732 0.218376 7.85355 0.133132C7.75978 0.0478884 7.63232 0 7.49971 0ZM4 4.54545C4.75856 4.54545 5.49643 4.14674 6.06526 3.408C6.55852 2.7674 6.90027 1.89619 6.98144 0.909093H1.01856C1.09973 1.89619 1.44148 2.7674 1.93474 3.408C2.50357 4.14674 3.24144 4.54545 4 4.54545ZM4 5.45455C3.24144 5.45455 2.50357 5.85326 1.93474 6.592C1.44148 7.2326 1.09973 8.10381 1.01856 9.09091H6.98144C6.90027 8.10381 6.55852 7.2326 6.06526 6.592C5.49643 5.85326 4.75856 5.45455 4 5.45455Z"
    />
  </svg>
);

export const ClockIcon2 = ({ className, color = "black" }: { className?: string; color?: string }) => (
  <svg className={clsx("w-4 h-4", `fill-${color}`, className)} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.35355 2.85355L2.85355 1.35355C3.04882 1.15829 3.04882 0.841709 2.85355 0.646447C2.65829 0.451184 2.34171 0.451184 2.14645 0.646447L0.646447 2.14645C0.451184 2.34171 0.451184 2.65829 0.646447 2.85355C0.841709 3.04882 1.15829 3.04882 1.35355 2.85355Z" />
    <path d="M9.14645 0.646447C9.34171 0.451184 9.65829 0.451184 9.85355 0.646447L11.3536 2.14645C11.5488 2.34171 11.5488 2.65829 11.3536 2.85355C11.1583 3.04882 10.8417 3.04882 10.6464 2.85355L9.14645 1.35355C8.95118 1.15829 8.95118 0.841709 9.14645 0.646447Z" />
    <path d="M6.5 3.5C6.5 3.22386 6.27614 3 6 3C5.72386 3 5.5 3.22386 5.5 3.5V6C5.5 6.27614 5.72386 6.5 6 6.5H8.5C8.77614 6.5 9 6.27614 9 6C9 5.72386 8.77614 5.5 8.5 5.5H6.5V3.5Z" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 1C3.23858 1 1 3.23858 1 6C1 7.54293 1.6992 8.92237 2.7964 9.83899L2.11134 10.6854C1.93762 10.9001 1.9708 11.2149 2.18545 11.3887C2.4001 11.5624 2.71494 11.5292 2.88866 11.3146L3.62715 10.4021C4.33344 10.7835 5.14197 11 6 11C6.86172 11 7.67351 10.7816 8.38193 10.3972L9.10862 11.3112C9.28048 11.5273 9.59501 11.5632 9.81117 11.3914C10.0273 11.2195 10.0632 10.905 9.89138 10.6888L9.21087 9.83291C10.3039 8.91629 11 7.53951 11 6C11 3.23858 8.76142 1 6 1ZM2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6C10 7.38637 9.29512 8.60831 8.22187 9.32672C7.58655 9.75199 6.823 10 6 10C5.18146 10 4.42174 9.75467 3.78849 9.33363C2.70943 8.61618 2 7.39083 2 6Z"
      fill="white"
    />
  </svg>
);