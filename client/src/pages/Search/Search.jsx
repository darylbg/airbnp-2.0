import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LISTINGS } from "../../utils/queries";
import { useDispatch, useSelector } from "react-redux";
import * as Form from "@radix-ui/react-form";
import SearchListing from "../../components/SearchListing/SearchListing";
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
  const { error, loading, data, refetch } = useQuery(GET_ALL_LISTINGS);
  const allListingEntities = useSelector(
    (state) => state.allListings.defaultListings.entities
  );
  const refetchListings = useSelector(
    (state) => state.allListings.refetchListings
  );

  // refetch data when listing added or removed
  useEffect(() => {
    if (refetchListings) {
      refetch().then(() => {
        dispatch(clearRefetchFlag());
      });
    }
  }, [refetchListings, refetch, dispatch]);

  // Get listing data and set to redux
  useEffect(() => {
    if (data) {
      const listings = data.getAllListings;
      dispatch(setAllListings(listings));
    }
  }, [data, dispatch]);

  // get listing data from redux
  useEffect(() => {
    if (allListingEntities) {
      setListings(Object.values(allListingEntities));
    }
  }, [allListingEntities]);

  // if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div className="search-page">
      <div className="search-listings">
        <div className="search-listing-header">
          <div className="search-listings-input">
            <Form.Root>
              <Form.Field>
                <Form.Control placeholder="search address or city"></Form.Control>
              </Form.Field>
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
          />
        )}
      </div>
    </div>
  );
}
