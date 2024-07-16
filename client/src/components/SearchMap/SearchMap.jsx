import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import ReactDOM from "react-dom";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import MapMarkerPopup from "../MapMarkerPopup/MapMarkerPopup";
import { mapStyleOptions } from "./mapStyleOptions"; // Adjust the path as necessary
import "mapbox-gl/dist/mapbox-gl.css";
import "./SearchMap.css";

export default function SearchMap({
  listings,
  hoveredListing,
  setHoveredListing,
}) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState(mapStyleOptions[0]);
  const [popupOpen, setPopupOpen] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

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

  // Update markers based on listings
  useEffect(() => {
    if (map.current && listings) {
      // Clear existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add new markers
      listings.forEach((listing) => {
        // Create a custom marker element
        const markerEl = document.createElement("div");
        markerEl.className = "map-marker"; // Ensure this class is styled in CSS
        markerEl.id = "mapMarker";

        // Create a container for the React component
        const popupContainer = document.createElement("div");

        // Create the popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupContainer
        );

        popup.on("open", () => {
          setPopupOpen(listing);
          // Render the React component into the container using createRoot
          createRoot(popupContainer).render(
            <MapMarkerPopup
              listing={listing}
              openDetailDialog={openDetailDialog}
              closeDetailDialog={closeDetailDialog}
            />
          );

        });

        popup.on("close", () => {
          setPopupOpen(null);
        });

        // Create and add the marker MapMarkerPopup
        new mapboxgl.Marker(markerEl)
          .setLngLat([listing.longitude, listing.latitude])
          .setPopup(popup)
          .addTo(map.current);

        markerEl.addEventListener("mouseenter", () =>
          setHoveredListing(listing)
        );
        markerEl.addEventListener("mouseleave", () => {
          setHoveredListing(null);
        });

        if (
          (hoveredListing && hoveredListing.id === listing.id) ||
          (popupOpen && popupOpen.id === listing.id)
        ) {
          markerEl.style.backgroundColor = "red"; // Example hover style
        } else {
          markerEl.style.backgroundColor = ""; // Reset style
        }
      });
    }
  }, [listings, hoveredListing, popupOpen]);

  const handleMapStyles = (style) => {
    setMapStyle(style);
  };

  const openDetailDialog = (e) => {
    e.preventDefault();
    console.log("clicked", e);
    setDetailDialog(true);
  };

  const closeDetailDialog = (e) => {
    e.preventDefault();
    console.log("clicked", e);
    setDetailDialog(false);
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
      <DialogComponent
        className="full-width-dialog"
        dialogState={detailDialog}
        closeDialog={closeDetailDialog}
        icon="close"
        // dialogHeader={listing.listing_title}
        backdropClosable={false}
      >
        <div>detail dialog</div>
      </DialogComponent>
    </div>
  );
}
