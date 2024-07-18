import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "./AccountNav";
import axios from "axios";
import PlaceImg from "./PlaceImg";


const PlacesPage = () => {

    const [places, setPlaces] = useState([]);

    useEffect(() => {
        axios.get(`/user-places`).then(({data})=> {
            setPlaces(data);
        });
    }, []);
  return (
    <div>
        <AccountNav />
        <div className="text-center">
            
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={"/account/places/new"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"  viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add New place
          </Link>
        </div>
        <div className="mt-4 mx-36">
          {places.length === 0 && (
            <div className="text-lg mt-40 text-gray-700 text-center">
              Add your Accomodation in our site to get bookings in the best price!
        </div>
          )}
            {places.length > 0 && places.map(place => (
                    <Link to={'/account/places/'+place._id} className="flex cursor-pointer gap-4 bg-gray-100 p-4 my-5 rounded-2xl">
                        <div className=" flex w-32 h-32 bg-gray-300 shrink-0">
                            <PlaceImg place={place} index={0} />
                        </div>
                        <div className="grow-0 shrink">
                        <h2 className="text-xl">{place.title}</h2>
                        <p className="text-sm mt-2">{place.description} </p>
                        </div>
                    </Link>
                    
                ))}
        </div>
    </div>
  );
};

export default PlacesPage;
