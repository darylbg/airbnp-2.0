import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapStyleStreet from "../../assets/images/map-styles/street.png";
import MapStyleLight from "../../assets/images/map-styles/light.png";
import MapStyleDark from "../../assets/images/map-styles/dark.png";
import "mapbox-gl/dist/mapbox-gl.css";
import "./SearchMap.css";

export default function SearchMap({ listings }) {
  const mapStyleOptions = [
    {
      option: "mapbox://styles/mapbox/streets-v12",
      img: MapStyleStreet,
      title: "Default",
    },
    {
      option: "mapbox://styles/mapbox/light-v11",
      img: MapStyleLight,
      title: "Light",
    },
    {
      option: "mapbox://styles/mapbox/dark-v11",
      img: MapStyleDark,
      title: "Dark",
    },
  ];

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState(mapStyleOptions[0]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-70.9);
  const [lat, setLat] = useState(42.35);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle.option,
      center: [lng, lat],
      zoom: zoom,
    });
  }, [listings, mapStyle]);

  const handleMapStyle = (option) => {
    console.log(option);
  };

  return (
    <div className="search-map-wrapper">
      <div className="map-styles">
        <div className="map-styles-trigger">
          <div className="map-style">
            <button className="map-style">
              <img src={mapStyle.img} alt={mapStyle.option} />
            </button>
          </div>
        </div>

        <div className="map-styles-dropdown">
          {mapStyleOptions.map((style) => (
            <div className="map-style">
              <button
                onClick={() => handleMapStyle(style.option)}
                key={style.option}
              >
                <img src={style.img} alt={style.option} />
              </button>
              <span>{style.title}</span>
            </div>
          ))}
        </div>
      </div>
      <div ref={mapContainer} className="search-map-container" />
    </div>
  );
}
