import React, { useEffect, useState } from 'react'
import AccountNav from './AccountNav';
import Perks from './Perks';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PhotosUploader from './PhotosUploader';

const PlacesForm = () => {
    const {id} = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [addLink, setAddLink] = useState('');
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [redirect, setRedirect] = useState(false);
  const [price, setPrice] = useState(100);

  useEffect(() => {
    if(!id){
        return;
    }
    axios.get(`/places/${id}`)
    .then(response => {
        const {data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setDescription(data.description);
        setAddedPhotos(data.addedPhotos);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setAddLink(data.addLink);
        setPrice(data.price);

    })
  }, [id])

  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
            title,
            address,
            addedPhotos,
            description,
            perks,
            addLink,
            extraInfo,
            checkIn,
            checkOut,
            maxGuests,
            price,

    }
    if(id){
        await axios.put(`/places`, {
            id,
            ...placeData
            
          });
          setRedirect(true);
    }
    else{
        await axios.post(`/places`, placeData);
          setRedirect(true);
    }
    
  }

  if(redirect) {
    return <Navigate to={'/account/places'} />
  }

  return (
    <div className="mx-36">
        <AccountNav />
          <form onSubmit={savePlace}>
            {preInput(
              "Title",
              "Title for your place, keep it short and catchy"
            )}
            <input
              type="text"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
              placeholder="title, For Eg. My Lovely Apartment"
            />

            {preInput("Address", "Address to your Place")}
            <input
              value={address}
              onChange={(ev) => setAddress(ev.target.value)}
              type="text"
              placeholder="Address"
            />

            {preInput("Photos", "The More, The Better")}
            <PhotosUploader
              addedPhotos={addedPhotos}
              onChange={setAddedPhotos}
            />

            {preInput("Description", "Describe what your place looks like")}
            <textarea
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />

            {preInput("Perks", "Select the perks offered by your place")}
            <div className="grid gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mt-2">
              <Perks selected={perks} onChange={setPerks} />
            </div>

            {preInput('Address Link','Please provide the Google Maps link to the address of your Accomodation')}
            <input type="text" placeholder='keep it as accurate as possible' value={addLink} onChange={ev => setAddLink(ev.target.value)} />

            {preInput("Extra Information (optional)", "Any other info needed")}
            <textarea
              value={extraInfo}
              onChange={(ev) => setExtraInfo(ev.target.value)}
            />

            {preInput(
              "Check in&out Times",
              "Mention your check in and check out times"
            )}
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              <div>
                <h3 className="mt-2 -mb-1">Check In Time</h3>
                <input
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                  type="text"
                  placeholder="14:10"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Check Out Time</h3>
                <input
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                  type="text"
                  placeholder="11:00"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Number Of Guests</h3>
                <input
                  value={maxGuests}
                  onChange={(ev) => setMaxGuests(ev.target.value)}
                  type="number"
                />
              </div>
              <div>
                <h3 className="mt-2 -mb-1">Price Per Night</h3>
                <input
                  value={price}
                  onChange={(ev) => setPrice(ev.target.value)}
                  type="number"
                />
              </div>
            </div>
            <button className="primary my-4">Save</button>
          </form>
        </div>
  )
}

export default PlacesForm
