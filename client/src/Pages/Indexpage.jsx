import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Image from './Image';

const Indexpage = () => {
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [priceRange, setPriceRange] = useState([100, 10000]);

  useEffect(() => {
    axios.get(`/places`).then((response) => {
      setPlaces(response.data);
    });
  }, []);

  const filteredPlaces = places
    .filter((place) =>
      place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((place) => place.price >= priceRange[0] && place.price <= priceRange[1])
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') {
        return a.price - b.price;
      } else if (sortOrder === 'highToLow') {
        return b.price - a.price;
      }
      return 0;
    });

  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    const name = e.target.name;
    setPriceRange((prevRange) => {
      if (name === 'minPrice') {
        return [value, prevRange[1]];
      } else {
        return [prevRange[0], value];
      }
    });
  };

  return (
    <div className="mx-36">
      <div className='bg-primary px-20 -mx-36 pb-3 mb-10'>
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search places..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border max-w-64 border-yellow-500 border-solid rounded-2xl"
        />
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="mx-2 px-2 border border-gray-300 rounded-xl"
        >
          <option value="">Sort by price</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      <div className="flex justify-center gap-3 mb-4 text-white">
        <div className="flex items-center gap-2">
          <label>Min Price:</label>
          <input
            type="range"
            name="minPrice"
            min="100"
            max="10000"
            value={priceRange[0]}
            onChange={handlePriceChange}
            className="slider"
          />
          <span>{priceRange[0]}</span>
        </div>
        <div className="flex items-center gap-2">
          <label>Max Price:</label>
          <input
            type="range"
            name="maxPrice"
            min="100"
            max="10000"
            value={priceRange[1]}
            onChange={handlePriceChange}
            className="slider"
          />
          <span>{priceRange[1]}</span>
        </div>
      </div>
      </div>
      

      <div className="grid gap-4 gap-y-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredPlaces.length > 0 && filteredPlaces.map((place) => (
          <Link key={place._id} to={'/places/' + place._id} className='border border-gray-200 shadow-md rounded-2xl'>
            <div className=" mb-2 rounded-2xl">
              {place.addedPhotos?.[0] && (
                <Image
                  className="rounded-2xl object-cover aspect-square"
                  src={place.addedPhotos[0]}
                  alt=""
                />
              )}
            </div>
            <h2 className="font-bold px-2">{place.address}</h2>
            <h3 className="text-sm px-2 text-gray-500">{place.title}</h3>
            <div className="mt-1 px-2">
              <span className="font-bold text-primary">${place.price}</span> per night
            </div>
            <div className="px-2 text-gray-500">
              Allows {place.maxGuests} guests
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Indexpage;
