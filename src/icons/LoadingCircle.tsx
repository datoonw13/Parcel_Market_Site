import React from "react";

const LoadingCircle = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
    <circle fill="none" strokeOpacity="1" stroke="#16DB65" strokeWidth="10" cx="100" cy="100" r="0">
      <animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite" />
      <animate
        attributeName="strokeWidth"
        calcMode="spline"
        dur="2"
        values="0;25"
        keyTimes="0;1"
        keySplines="0 .2 .5 1"
        repeatCount="indefinite"
      />
      <animate
        attributeName="strokeOpacity"
        calcMode="spline"
        dur="2"
        values="1;0"
        keyTimes="0;1"
        keySplines="0 .2 .5 1"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);

export default LoadingCircle;
