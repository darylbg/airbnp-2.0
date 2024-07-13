import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { mapStyleOptions } from "./mapStyleOptions"; // Adjust the path as necessary
import "mapbox-gl/dist/mapbox-gl.css";
import "./SearchMap.css";

export default function SearchMap({ listings }) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState(mapStyleOptions[0]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0.1276);
  const [lat, setLat] = useState(51.5072);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle.option,
      center: [lng, lat],
      zoom: zoom,
    });

    if (listings) {
      listings.forEach((listing) => {
        new mapboxgl.Marker()
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map.current);
      });
    }
  }, []);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle.option);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (map.current && listings) {
      // Clear existing markers
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add new markers
      listings.forEach((listing) => {
        new mapboxgl.Marker()
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map.current);
      });
    }
  }, [listings]);

  const handleMapStyles = (style) => {
    setMapStyle(style);
  };

  return (
    <div className="search-map-wrapper">
      <div className="map-styles">
        <div className="map-styles-trigger">
          <div className="map-style">
            <button className="selected-map-style">
              <img src={mapStyle.img} alt={mapStyle.option} />
              <span className="text">{mapStyle.title}</span>
            </button>
          </div>
        </div>

        <div className="map-styles-dropdown">
          {mapStyleOptions.map((style) => (
            <div className="map-style" key={style.option}>
              <button
                onClick={() => handleMapStyles(style)}
                style={{
                  border:
                    mapStyle.option === style.option
                      ? "2px solid #0090FF"
                      : "2px solid #DBD8E0",
                }}
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
