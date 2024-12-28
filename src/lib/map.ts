export const mapDefaultMarkers = {
  red: "/map/red.svg",
  redHighlighted: "/map/red-highlighted.svg",
  yellow: "/map/yellow.svg",
  yellowHighlighted: "/map/yellow-highlighted.svg",
  selling: "/map/selling.svg",
};

export const createMarkerImage = (imgUrl: String) => {
  const el = document.createElement("img");
  el.src = `${imgUrl}`;
  return el;
};
