import MapStyleStreet from "../../assets/images/map-styles/street.png";
import MapStyleSatellite from "../../assets/images/map-styles/satellite.png";
import MapStyleDetailed from "../../assets/images/map-styles/detailed.png";

export const mapStyleOptions = [
    {
      option: "mapbox://styles/mapbox/streets-v12",
      img: MapStyleStreet,
      title: "Default",
    },
    {
      option: "mapbox://styles/mapbox/standard",
      img: MapStyleDetailed,
      title: "Detailed"
    },
    {
      option: "mapbox://styles/mapbox/satellite-streets-v12",
      img: MapStyleSatellite,
      title: "Satellite"
    }
  ];