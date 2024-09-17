import React, { useEffect, useState } from "react";
import PrimaryButton from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./MapMarkerPopup.css";
import RatingComponent from "../PrimitiveComponents/RatingComponent/RatingComponent";

export default function MapMarkerPopup({
  listing,
  openDetailDialog,
  startLngLat,
  accessToken,
}) {
  const [route, setRoute] = useState(null);
  useEffect(() => {
    const endLngLat = [listing.longitude, listing.latitude];
    const defineRoute = async (startLngLat, endLngLat) => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${startLngLat.join(
        ","
      )};${endLngLat.join(
        ","
      )}?alternatives=true&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true&access_token=${accessToken}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          setRoute(data.routes[0]);
        } else {
          console.warn("No routes found");
        }
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    if (startLngLat && endLngLat) {
      defineRoute(startLngLat, endLngLat);
    }
  }, []);

  const handleDistanceFormat = (meters) => {
    // console.log(routeData?.distance)
    const kilometers = (meters * 0.00062137).toFixed(2);
    return `${kilometers} miles`;
  };

  const handleDurationFormat = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes < 1440) {
      // less than a day
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours} hr${hours > 1 ? "s" : ""} ${
        remainingMinutes > 0 ? remainingMinutes + " min" : ""
      }`;
    } else {
      // one day or more
      const days = Math.floor(minutes / 1440);
      const remainingMinutes = minutes % 1440;
      const hours = Math.floor(remainingMinutes / 60);
      const finalMinutes = remainingMinutes % 60;
      return `${days} day${days > 1 ? "s" : ""} ${
        hours > 0 ? hours + " hr" + (hours > 1 ? "s" : "") : ""
      } ${finalMinutes > 0 ? finalMinutes + " min" : ""}`;
    }
  };

  return (
    <div className={`map-popup popup-availability-${listing.availability}`}>
      <div className="map-popup-heading">
        <h2 className="title">{listing.listing_title}</h2>
        <div className="subheading">
          <span className="price">from {listing.price} /person</span>
          <div className="divider"></div>
          <span>private home</span>
        </div>
      </div>
      <div className="map-popup-content">
        <div className="line-1">
          <div className="popup-availability">
            <span className="caption">Opening times</span>
            <span className="text availability">
              {listing.availability ? "Open now" : "Closed"}
            </span>
          </div>
          <div className="popup-rating">
            <span className="caption">Rating</span>
            <RatingComponent
              value={listing?.average_rating.value}
              count={listing?.average_rating.count}
            />
          </div>
        </div>

        <div className="line-2">
          <div className="popup-directions">
            <span className="material-symbols-outlined">directions_walk</span>
            {route !== null ? (
              <>
                <span className="text">
                  {handleDistanceFormat(route?.distance)}
                </span>
                <span className="text duration">
                  {" "}
                  {handleDurationFormat(route?.duration)}
                </span>
              </>
            ) : (
              <span>set location to view travel</span>
            )}
          </div>
        </div>
      </div>
      <div className="map-popup-action">
        <PrimaryButton
          type="button"
          className="default-button action-button map-popup-button"
          loading={!listing.availability}
          action={(e) => openDetailDialog(listing)}
        >
          Book this bathroom
        </PrimaryButton>
      </div>
    </div>
  );
}
