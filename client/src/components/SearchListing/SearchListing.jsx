import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
  const isHovered = hoveredListing && hoveredListing.id === listing.id;

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
      className="search-listing"
      onMouseEnter={() => setHoveredListing(listing)}
      onMouseLeave={() => setHoveredListing(null)}
      style={{ border: isHovered ? "2px solid blue" : "2px solid black" }}
      // onClick={() => centerMapOnListing(listing)}
    >
      <div className="search-listing-image">
        <Carousel
          swipeable={false}
          draggable={false}
          showDots={false}
          responsive={responsive}
          // ssr={true}
          infinite={true}
          // autoPlay={this.props.deviceType !== "mobile" ? true : false}
          // autoPlaySpeed={1000}
          keyBoardControl={true}
          customTransition="all .5"
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          // deviceType={this.props.deviceType}
          dotListClass="custom-dot-list-style"
          itemClass="carousel-item-padding-40-px"
          arrows={listing.listing_image.length > 1}
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
        >
          {listing?.listing_image.map((image, index) => (
            <img key={index} src={image} alt="image" className="" />
          ))}
        </Carousel>
      </div>
      {listing.listing_title}
      {listing && listing.fullAddress}
      <ButtonComponent
        className="control-button"
        type="button"
        action={() => searchListingSelected(listing)}
      >
        See detail
      </ButtonComponent>
    </div>
  );
}

export const CustomLeftArrow = ({ onClick }) => (
  <button className="custom-arrow custom-arrow-left" onClick={onClick}>
    <span class="material-symbols-outlined">arrow_back_ios</span>
  </button>
);

export const CustomRightArrow = ({ onClick }) => (
  <button type="button" className="custom-arrow custom-arrow-right" onClick={onClick}>
    <span class="material-symbols-outlined">arrow_forward_ios</span>
  </button>
);
