import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedListing, setMapCenter } from "../../reducers/bookingReducer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./SearchListing.css";
import RatingComponent from "../PrimitiveComponents/RatingComponent/RatingComponent";

export default function SearchListing({
  listing,
  hoveredListing,
  setHoveredListing,
}) {
  const dispatch = useDispatch();

  const selectedListing = useSelector(
    (state) => state.bookingCycle.booking.selectedListing
  );
  const [listingHighlight, setListingHighlight] = useState(false);

  const isHovered = hoveredListing && hoveredListing.id === listing.id;
  const isSelected = selectedListing?.id === listing?.id;

  useEffect(() => {
    if (isHovered || isSelected) {
      setListingHighlight(true);
    } else {
      setListingHighlight(false);
    }
  }, [isHovered, selectedListing]);

  const searchListingSelected = (listing) => {
    const mapCenter = {
      coordinates: {
        lng: listing.longitude,
        lat: listing.latitude
      },
    };
    console.log(mapCenter);
    dispatch(setSelectedListing(listing));
    dispatch(setMapCenter(mapCenter));
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <div
      className={`search-listing ${
        listingHighlight ? "is-hovered" : ""
      } search-listing-${listing?.availability ? "open" : "closed"}`}
      onMouseEnter={() => setHoveredListing(listing)}
      onMouseLeave={() => setHoveredListing(null)}
    >
      <div className="search-listing-image">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          infinite={true}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          // arrows={true}
          arrows={listing && listing.listing_image.length > 1}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {listing?.listing_image.map((image, index) => (
            <img key={index} src={image} alt="image" className="" />
          ))}
        </Carousel>
      </div>
      <div className="search-listing-content">
        <div className="search-listing-header">
          <span className="subheading">private home</span>
          <h3 className="heading">{listing?.listing_title}</h3>
        </div>
        <div className="search-listing-body">
          <div className="line-1">
          <RatingComponent value={listing?.average_rating.value} count={listing?.average_rating.count} />
            {/* <div className="listing-rating">
              <span class="star">&#9733;</span>
              <span className="value">{listing?.average_rating.value.toFixed(1)}</span>
              <span className="count">{`(${
                listing?.average_rating.count > 0
                  ? listing.average_rating.count
                  : "no reviews"
              })`}</span>
            </div> */}
            <div className="listing-availability">
              {listing?.availability ? "Open now" : "Closed"}
            </div>
          </div>
              <div className="line-2">
                <div className="listing-address">
                  <span className="post-code">{listing?.addressPostCode}...</span><span>full address on checkout</span>
                </div>
              </div>
        </div>
        <div className="search-listing-footer">
          <div className="search-listing-price">
            <span className="text">
              from <strong className="price">£{listing?.price}</strong> /person
            </span>
          </div>
          <ButtonComponent
            className="default-button control-button search-listing-button"
            type="button"
            action={() => searchListingSelected(listing)}
          >
            See detail
          </ButtonComponent>
        </div>
      </div>
    </div>
  );
}

export const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow custom-arrow-left" onClick={onClick}>
    <span className="material-symbols-outlined">arrow_back_ios</span>
  </button>
);

export const CustomRightArrow = ({ onClick }) => (
  <button
    type="button"
    className="custom-arrow custom-arrow-right"
    onClick={onClick}
  >
    <span className="material-symbols-outlined">arrow_forward_ios</span>
  </button>
);
