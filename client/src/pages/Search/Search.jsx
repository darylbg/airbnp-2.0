import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_LISTINGS } from "../../utils/queries";
import {useDispatch, useSelector} from "react-redux";
import * as Form from "@radix-ui/react-form";
import SearchListing from "../../components/SearchListing/SearchListing";
import "./Search.css";
import SearchMap from "../../components/SearchMap/SearchMap";

export default function Search() {
    const dispatch = useDispatch();
    const listingsRedux = useSelector((state) => state)
  const [listings, setListings] = useState(null);
  console.log("listings", listings);
  const { error, loading, data } = useQuery(GET_ALL_LISTINGS);
  useEffect(() => {
    try {
      if (data) {
        // console.log(data)
        setListings(data.getAllListings);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data]);

  return (
    <div className="search-page">
      <div className="search-listings">
        <div className="search-listings-input">
          <Form.Root>
            <Form.Field>
              <Form.Control placeholder="search address or city"></Form.Control>
            </Form.Field>
          </Form.Root>
        </div>
        <div className="search-listings-filter">
          <p className="text">10,000+ locations near you</p>
          <button>Filter</button>
        </div>
        <div className="search-listings-display">
          {listings &&
            listings.map((listing) => (
              <SearchListing key={listing.id} listing={listing} />
            ))}
        </div>
      </div>
      <div className="search-map">
        <SearchMap listings={listings} />
      </div>
    </div>
  );
}
