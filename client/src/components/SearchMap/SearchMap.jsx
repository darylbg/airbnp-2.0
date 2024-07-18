import React, { useRef, useEffect, useState } from "react";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import { selectedListing, resetBooking } from "../../reducers/bookingReducer";
import MapMarkerPopup from "../MapMarkerPopup/MapMarkerPopup";
import { mapStyleOptions } from "./mapStyleOptions"; // Adjust the path as necessary
import "mapbox-gl/dist/mapbox-gl.css";
import "./SearchMap.css";
import { useDispatch, useSelector } from "react-redux";

export default function SearchMap({
  listings,
  hoveredListing,
  setHoveredListing,
  mapCenterCoordinates,
}) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState(mapStyleOptions[0]);
  const [popupOpen, setPopupOpen] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerPopups = useRef({});
  const dispatch = useDispatch();

  const [zoom, setZoom] = useState(9);

  const selectedListingId = useSelector(
    (state) => state.bookingCycle.booking.selectedListing?.id
  );
  const selectedListingU = useSelector(
    (state) => state.bookingCycle.booking.selectedListing
  );

  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle.option,
      center: [mapCenterCoordinates.lng, mapCenterCoordinates.lat],
      zoom: zoom,
    });

    if (listings) {
      listings.forEach((listing) => {
        new mapboxgl.Marker()
          .setLngLat([listing.longitude, listing.latitude])
          .addTo(map.current);
      });
    }
  }, [listings, mapCenterCoordinates]);

  useEffect(() => {
    if (map.current) {
      map.current.easeTo({
        center: [mapCenterCoordinates.lng, mapCenterCoordinates.lat],
        zoom: 10,
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [mapCenterCoordinates]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle.option);
    }
  }, [mapStyle]);

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
        markerEl.className = "map-marker";
        markerEl.id = `marker-${listing.id}`;

        // Create a container for the React component
        const popupContainer = document.createElement("div");

        // Create the popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupContainer
        );

        popup.on("open", () => {
          setPopupOpen(listing);
          dispatch(selectedListing(listing));
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
          dispatch(resetBooking());
        });

        // Create and add the marker MapMarkerPopup
        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([listing.longitude, listing.latitude])
          .setPopup(popup)
          .addTo(map.current);

        // Store popup reference for programmatic control
        markerPopups.current[listing.id] = popup;

        markerEl.addEventListener("mouseenter", () =>
          setHoveredListing(listing)
        );
        markerEl.addEventListener("mouseleave", () => setHoveredListing(null));
      });
    }
  }, [listings]);

  // sync hover with map makers and side listings
  useEffect(() => {
    listings &&
      listings.forEach((listing) => {
        const markerEl = document.getElementById(`marker-${listing.id}`);
        if (markerEl) {
          if (
            (hoveredListing && hoveredListing.id === listing.id) ||
            (popupOpen && popupOpen.id === listing.id)
          ) {
            markerEl.style.backgroundColor = "red"; // Example hover style
          } else {
            markerEl.style.backgroundColor = ""; // Reset style
          }
        }
      });
  }, [hoveredListing]);

  useEffect(() => {
    // remove all existing popups so only one appears at a time
    const popups = document.getElementsByClassName("mapboxgl-popup");
    if (popups.length) {
      dispatch(resetBooking());
      popups[0].remove();
    }

    const popup = markerPopups.current[selectedListingId];
    if (popup) {
      popup.addTo(map.current);
      setPopupOpen({ id: selectedListingId });
    }
  }, [selectedListingId]);

  const handleMapStyles = (style) => {
    setMapStyle(style);
  };

  const openDetailDialog = (e) => {
    e.preventDefault();
    setDetailDialog(true);
  };

  const closeDetailDialog = (e) => {
    e.preventDefault();
    setDetailDialog(false);
  };

  return (
    <div className="search-map-wrapper">
      <ButtonComponent type="button" className="search-this-area-button">
        Search this area
      </ButtonComponent>
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
      <ButtonComponent className="locate-me-button">
        <span class="material-symbols-outlined">location_searching</span>
      </ButtonComponent>
      <div ref={mapContainer} className="search-map-container" />
      <DialogComponent
        className="full-width-dialog"
        dialogState={detailDialog}
        closeDialog={closeDetailDialog}
        icon="close"
        backdropClosable={false}
        dialogHeader={`Details: ${selectedListingU?.listing_title}`}
      >
        <div>detail dialog</div>
      </DialogComponent>
    </div>
  );
}
