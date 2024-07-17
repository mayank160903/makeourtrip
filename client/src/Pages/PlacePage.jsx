import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "./BookingWidget";
import PlaceGallery from "./PlaceGallery";
import AddressLink from "./AddressLink";
import Perks from "./Perks";

const PlacePage = () => {
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);
  if (!place) return "";

  function handleOnChange(){
    return;
  }
  

  return (
    <div className="mt-4 bg-gray-100 mx-36 px-8 pt-8">
      <h1 className="text-3xl">{place.title}</h1>
      <AddressLink link={place.addLink}>{place.address}</AddressLink>
      <Perks selected={["wifi", "games", "pets", "pool", "parking", "security"]} onChange={handleOnChange} />
      <PlaceGallery place={place} />
      
      <div className="mt-8 mb-8 gap-8 grid grid-cols-1 md:grid-cols-[2fr_1fr]">
        <div>
        <div className="my-4">
        <h2 className="font-semibold text-2xl">Description</h2>
        {place.description}
      </div>
          Check-in: {place.checkIn} <br />
          check-out: {place.checkOut} <br />
          Maximum Number Of Guests: {place.maxGuests}
          
        </div>
        <div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="bg-white -mx-8 px-8 py-8 border-t">
      <div>
        <h2 className="font-semibold text-2xl">
            Extra Information
        </h2>
      </div>
      <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
      </div>
      
    </div>
  );
};

export default PlacePage;
