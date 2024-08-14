import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedListing } from "../../reducers/bookingReducer";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ButtonComponent from "../PrimitiveComponents/ButtonComponent/ButtonComponent";
import "./SearchListing.css";

export default function SearchListing({
  listing,
  hoveredListing,
  setHoveredListing,
  // CustomLeftArrow,
  // CustomRightArrow
}) {
  const dispatch = useDispatch();

  const selectedListing = useSelector(
    (state) => state.bookingCycle.booking.selectedListing
  );
  const [listingHighlight, setListingHighlight] = useState(false);

  const isHovered = hoveredListing && hoveredListing.id === listing.id;
  const isSelected = selectedListing?.id === listing.id;

  useEffect(() => {
    if (isHovered || isSelected) {
      setListingHighlight(true);
    } else {
      setListingHighlight(false);
    }
  }, [isHovered, selectedListing]);

  const searchListingSelected = (listing) => {
    dispatch(setSelectedListing(listing));
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
      className={`search-listing ${listingHighlight ? "is-hovered" : ""}`}
      onMouseEnter={() => setHoveredListing(listing)}
      onMouseLeave={() => setHoveredListing(null)}
      // style={{ border: isHovered ? "2px solid blue" : "2px solid black" }}
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
          arrows={listing.listing_image?.length > 1}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {listing?.listing_image.map((image, index) => (
            <img key={index} src={image} alt="image" className="" />
          ))}
        </Carousel>
        <div className="search-listing-image-overlay"></div>
      </div>
      <div className="search-listing-content">
        <div className="search-listing-header">
          <span className="subheading">private home</span>
          <h3 className="heading">{listing?.listing_title}</h3>
        </div>
        <div className="search-listing-body">
          <span>{listing?.fullAddress}</span>
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
