import React, { useRef, useEffect, useState } from "react";
import DialogComponent from "../PrimitiveComponents/DialogComponent/DialogComponent";
import { createRoot } from "react-dom/client";
import mapboxgl from "mapbox-gl";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import {
  setSelectedListing,
  resetBooking,
  resetUserLocation,
  setUserLocation,
} from "../../reducers/bookingReducer";
import MapMarkerPopup from "../MapMarkerPopup/MapMarkerPopup";
import { mapStyleOptions } from "./mapStyleOptions"; // Adjust the path as necessary
import "mapbox-gl/dist/mapbox-gl.css";
import "./SearchMap.css";
import { useDispatch, useSelector } from "react-redux";
import PinIcon from "../../assets/images/icons/pin_icon3.png";

export default function SearchMap({
  listings,
  hoveredListing,
  setHoveredListing,
  mapCenterCoordinates,
  routeType,
  setRouteData,
  setMapCenterCoordinates
}) {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

  const [mapStyle, setMapStyle] = useState(mapStyleOptions[0]);
  const [popupOpen, setPopupOpen] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerPopups = useRef({});

  const dispatch = useDispatch();

  const [zoom, setZoom] = useState(10);
  const selectedListingId = useSelector(
    (state) => state.bookingCycle.booking.selectedListing.listing?.id
  );
  const selectedListingU = useSelector(
    (state) => state.bookingCycle.booking.selectedListing?.listing
  );

  const userLocation = useSelector((state) => state.bookingCycle.userLocation);

  // clear user location on page refresh
  useEffect(() => {
    dispatch(resetUserLocation());
  }, []);

  useEffect(() => {
    if (selectedListingU && userLocation) {
      const startLngLat = [
        userLocation.coordinates.lng,
        userLocation.coordinates.lat,
      ];
      const endLngLat = [selectedListingU.longitude, selectedListingU.latitude];
      defineRoute(startLngLat, endLngLat, routeType);
    }
  }, [selectedListingU, userLocation, routeType]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle.option,
      center: [mapCenterCoordinates.lng, mapCenterCoordinates.lat],
      zoom: zoom,
    });
  }, [mapCenterCoordinates, mapStyle.option]);

  const defineRoute = async (startLngLat, endLngLat, routeType) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/${routeType}/${startLngLat.join(
      ","
    )};${endLngLat.join(
      ","
    )}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${
      mapboxgl.accessToken
    }`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        setRouteData(data.routes[0]);
        const routeGeoJson = data.routes[0].geometry;

        if (map.current) {
          // Check if the route source already exists
          if (map.current.getSource("route")) {
            map.current.getSource("route").setData(routeGeoJson);
          } else {
            map.current.addSource("route", {
              type: "geojson",
              data: routeGeoJson,
            });

            map.current.addLayer({
              id: "route",
              type: "line",
              source: "route",
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
              paint: {
                "line-color": "#000",
                "line-width": 5,
              },
            });
          }
        }
      } else {
        console.warn("No routes found");
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  const clearRoute = () => {
    if (map.current) {
      // Check if route layer exists
      if (map.current.getLayer("route")) {
        map.current.removeLayer("route");
      }

      // Check if route source exists
      if (map.current.getSource("route")) {
        map.current.removeSource("route");
      }
    }
  };

  // clear route when user location changes
  useEffect(() => {
    console.log("user location", userLocation);
    clearRoute();
  }, [userLocation]);

  useEffect(() => {
    if (map.current) {
      map.current.easeTo({
        center: [mapCenterCoordinates.lng, mapCenterCoordinates.lat],
        zoom: 10,
        essential: true,
      });
    }
  }, [mapCenterCoordinates]);

  useEffect(() => {
    if (map.current) {
      map.current.setStyle(mapStyle.option);
    }
  }, [mapStyle]);

  const mapRef = useRef();

  useEffect(() => {
    if (map.current) {
      // Clear existing markers
      const markers = document.getElementsByClassName("mapboxgl-marker");
      while (markers[0]) {
        markers[0].parentNode.removeChild(markers[0]);
      }

      // Add listing markers
      listings && listings.forEach((listing) => {
        const markerEl = document.createElement("div");
        markerEl.className = "map-marker";
        markerEl.id = `marker-${listing.id}`;

        const popupContainer = document.createElement("div");

        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupContainer
        );

        popup.on("open", () => {
          setPopupOpen(listing);
          dispatch(setSelectedListing(listing));
          createRoot(popupContainer).render(
            <MapMarkerPopup
              listing={listing}
              openDetailDialog={openDetailDialog}
              closeDetailDialog={closeDetailDialog}
              startLngLat={[
                userLocation.coordinates.lng,
                userLocation.coordinates.lat,
              ]}
              accessToken={mapboxgl.accessToken}
            />
          );
        });

        popup.on("close", () => {
          setPopupOpen(null);
          dispatch(resetBooking());
          clearRoute();
        });

        const marker = new mapboxgl.Marker(markerEl)
          .setLngLat([listing.longitude, listing.latitude])
          .setPopup(popup)
          .addTo(map.current);

        markerPopups.current[listing.id] = popup;

        markerEl.addEventListener("mouseenter", () =>
          setHoveredListing(listing)
        );
        markerEl.addEventListener("mouseleave", () => setHoveredListing(null));
      });

      // Add user location marker
      if (
        userLocation &&
        userLocation.coordinates.lat &&
        userLocation.coordinates.lng
      ) {
        const userMarkerEl = document.createElement("div");
        userMarkerEl.className = "custom-user-marker";

        userMarkerEl.style.backgroundImage = `url(${PinIcon})`;
        userMarkerEl.style.width = "40px";
        userMarkerEl.style.height = "40px";
        userMarkerEl.style.backgroundSize = "100%";

        const offset = [0, -15]; // Adjust this as needed to align correctly

        const userMarker = new mapboxgl.Marker({
          element: userMarkerEl,
          offset,
          draggable: true,
        })
          .setLngLat([
            userLocation.coordinates.lng,
            userLocation.coordinates.lat,
          ])
          .addTo(map.current);

        // Handle drag events
        userMarker.on("dragend", (e) => {
          const lngLat = e.target.getLngLat();
          console.log(`Longitude: ${lngLat.lng}, Latitude: ${lngLat.lat}`);
          // Update userLocation in state or Redux if needed
          dispatch(
            setUserLocation({
              coordinates: {
                lng: lngLat.lng,
                lat: lngLat.lat,
              },
              fullAddress: userLocation.fullAddress, // Update if address changes
            })
          );
        });
      }
    }
  }, [listings, userLocation, dispatch]);

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
  }, [hoveredListing, listings, popupOpen]);

  useEffect(() => {
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
  }, [selectedListingId, dispatch]);

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

  const handleLocateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const userLocation = {
          coordinates: {
            lng: longitude,
            lat: latitude,
          },
          fullAddress: "",
        };
        dispatch(setUserLocation(userLocation));
        setMapCenterCoordinates({
          lng: userLocation.coordinates.lng,
          lat: userLocation.coordinates.lat,
        });
      });
    } else {
      console.log("error");
      alert("geolocation not supported on this browser");
    }
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
      <ButtonComponent className="locate-user-button" action={handleLocateUser}>
        <span className="material-symbols-outlined">location_searching</span>
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
