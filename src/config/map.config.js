export const MAP_TOKEN =
  "pk.eyJ1IjoiYmlsYWxhamFuanVhIiwiYSI6ImNrOGVnZWVqZjE1cXQzbW1qNG42dWdndHAifQ.YNdhCHnkagnNmngls7H7Ow";

export const MAP_STYLE = "mapbox://styles/mapbox/dark-v9";

export const MAP_RTL_LINK =
  "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js";

export const clusterLayer = {
  id: "clusters",
  type: "circle",
  filter: ["has", "cases"],
  paint: {
    "circle-color": [
      "step",
      ["get", "cases"],
      "#51bbd6",
      1000,
      "#f1f075",
      10000,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "cases"], 30, 1000, 50, 10000, 70],
  },
};

export const clusterCountLayer = (criteriaTitle) => {
  return {
    id: "cluster-count",
    type: "symbol",
    filter: ["has", "cases"],
    layout: {
      "text-field": [
        "format",
        ["get", "country"],
        { "font-scale": 0.8 },
        "\n",
        ["get", "casesString"],
        "\n",
        criteriaTitle,
        { "font-scale": 0.8 },
      ],
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  };
};

export const unclusteredPointLayer = {
  id: "unclustered-point",
  type: "circle",
  filter: ["!", ["has", "cases"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 4,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};
