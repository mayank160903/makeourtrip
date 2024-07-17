import React from "react"
import { Route, Routes } from "react-router-dom"
import Indexpage from "./Pages/Indexpage"
import Login from "./Pages/Login"
import Layout from "./Layout"
import Register from "./Pages/Register"
import axios from "axios"
import { UserContextProvider } from "./UserContext"
import Account from "./Pages/Account"
import PlacesPage from "./Pages/PlacesPage"
import PlacesForm from "./Pages/PlacesForm"
import PlacePage from "./Pages/PlacePage"
import BookingsPage from "./Pages/BookingsPage"
import BookingPage from "./Pages/BookingPage"
import EditProfile from "./Pages/EditProfile"

axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  
  return (
    <UserContextProvider>

    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Indexpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path ="/account" element={<Account />} />
        <Route path="/account/editprofile" element={<EditProfile />} />
        <Route path ="/account/places" element={<PlacesPage />} />
        <Route path ="/account/places/new" element={<PlacesForm />} />
        <Route path ="/account/places/:id" element={<PlacesForm />} />
        <Route path ="/places/:id" element={<PlacePage />} />
        <Route path ="/account/bookings" element={<BookingsPage />} />
        <Route path ="/account/bookings/:id" element={<BookingPage />} />



      </Route>
    </Routes>

    </UserContextProvider>


  )
}

export default App
