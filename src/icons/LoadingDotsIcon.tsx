const LoadingDotsIcon = () => (
  <svg viewBox="0 0 200 200">
    <circle fill="#696C60" stroke="#696C60" strokeWidth="15" r="15" cx="40" cy="100">
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.4"
      />
    </circle>
    <circle fill="#696C60" stroke="#696C60" strokeWidth="15" r="15" cx="100" cy="100">
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="-.2"
      />
    </circle>
    <circle fill="#696C60" stroke="#696C60" strokeWidth="15" r="15" cx="160" cy="100">
      <animate
        attributeName="opacity"
        calcMode="spline"
        dur="2"
        values="1;0;1;"
        keySplines=".5 0 .5 1;.5 0 .5 1"
        repeatCount="indefinite"
        begin="0"
      />
    </circle>
  </svg>
);

export default LoadingDotsIcon;
