import React, { useEffect, useState } from "react";
import AccountNav from "./AccountNav";
import axios from "axios";
import PlaceImg from "./PlaceImg";
import { Link } from "react-router-dom";
import BookingDates from "./BookingDates";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get(`/bookings`).then((response) => {
        if(Array.isArray(response.data)){
            setBookings(response.data);
        }
        else{
            setBookings([]);
        }
      
    }).catch(error => {
        console.error("Error fetching bookings: ", error);
        setBookings([]);
    })
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="mx-36">
        {bookings?.length === 0 && (
            <div className="text-lg mt-40 text-gray-700 text-center">
                No Upcoming Bookings yet. Maybe Book a stay at your favourite destination? 
            </div>
        )}
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link to={`/account/bookings/${booking._id}`} className="flex my-3 gap-4 bg-gray-200 rounded-2xl overflow-hidden">
              <div className="w-9 grow">
                <PlaceImg place={booking.place} />
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl">{booking.place.title}</h2>

                <div className="text-md">
                  <BookingDates booking={booking} className=" mb-2 mt-4 text-gray-700" />
                  <div className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                    <span className="text-lg">
                    Total Price: ${booking.price}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BookingsPage;
