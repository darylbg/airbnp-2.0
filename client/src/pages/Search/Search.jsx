import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LISTINGS } from "../../utils/queries";
import { useDispatch, useSelector } from "react-redux";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import SearchListing from "../../components/SearchListing/SearchListing";
import AddressSearch from "../../components/AddressSearch/AddressSearch";
import "./Search.css";
import SearchMap from "../../components/SearchMap/SearchMap";
import {
  setAllListings,
  clearRefetchFlag,
} from "../../reducers/allListingsReducer";
import ButtonComponent from "../../components/PrimitiveComponents/ButtonComponent/ButtonComponent";

export default function Search() {
  const dispatch = useDispatch();
  const [listings, setListings] = useState(null);
  const [hoveredListing, setHoveredListing] = useState(null);
  const [mapCenterCoordinates, setMapCenterCoordinates] = useState({
    lat: 52.54851,
    lng: -1.9801
  });

  const { error, loading, data, refetch } = useQuery(GET_ALL_LISTINGS);
  const allListingEntities = useSelector(
    (state) => state.allListings.defaultListings.entities
  );
  const refetchListings = useSelector(
    (state) => state.allListings.refetchListings
  );

  useEffect(() => {
    if (refetchListings) {
      refetch().then(() => {
        dispatch(clearRefetchFlag());
      });
    }
  }, [refetchListings, refetch, dispatch]);

  useEffect(() => {
    if (data) {
      const listings = data.getAllListings;
      dispatch(setAllListings(listings));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (allListingEntities) {
      setListings(Object.values(allListingEntities));
    }
  }, [allListingEntities]);

  const centerMapOnListing = (listing) => {
    setMapCenterCoordinates({lat: listing.latitude, lng: listing.longitude});
  }

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddressSearch = (formData) => {
    console.log(formData); // <-- Log form data here
  }

  if (error) return <p>Error :</p>;

  return (
    <div className="search-page">
      <div className="search-listings">
        <div className="search-listing-header">
          <div className="search-listings-input">
            <Form.Root onSubmit={handleSubmit(handleAddressSearch)}>
              <AddressSearch
                setValue={setValue}
                control={control}
                errors={errors}
                showExpandedAddressSearch={false}
                onSubmit={handleSubmit(handleAddressSearch)}
              />
            </Form.Root>
          </div>
          <div className="search-listings-filter">
            <p className="text">10,000+ locations near you</p>
            <ButtonComponent className="default-button control-button">Filter</ButtonComponent>
          </div>
        </div>
        <div className="search-listings-display">
          {listings &&
            listings.map((listing) => (
              <SearchListing
                key={listing._id}
                listing={listing}
                setHoveredListing={setHoveredListing}
                hoveredListing={hoveredListing}
                centerMapOnListing={centerMapOnListing}
              />
            ))}
        </div>
      </div>
      <div className="search-map">
        {loading ? (
          <p>Loading locations...</p>
        ) : (
          <SearchMap
            listings={listings}
            setHoveredListing={setHoveredListing}
            hoveredListing={hoveredListing}
            mapLoading={loading}
            mapCenterCoordinates={mapCenterCoordinates}
          />
        )}
      </div>
    </div>
  );
}
