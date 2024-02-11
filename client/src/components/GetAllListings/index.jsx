import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {GET_ALL_LISTINGS} from "../../utils/Queries"

export default function GetAllListings() {
    const {error, loading, data} = useQuery(GET_ALL_LISTINGS);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        try {
            if (data) {
                console.log(data)
                setListings(data)
            }
        } catch (error) {
            console.log(error)
        }
    }, [data])
  return (
    <div>
      
    </div>
  )
}
