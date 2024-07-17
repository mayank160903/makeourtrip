import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext'

const Header = () => {
  const {user} = useContext(UserContext);
  return (
    <div>

    <header className="px-36 py-8 bg-primary flex justify-between">
      <Link to={'/'} className="flex items-center gap-1 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 -rotate-90">
<path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
</svg>
<span className="font-bold text-xl text-white">MakeOurTrip</span>

      </Link>
      <div className="flex gap-2 border bg-white border-gray-300 rounded-full py-3 px-4">
        <div>Anywhere</div>
        <div className="border-l border-gray-300"></div>
        <div>Any Week</div>
        <div className="border-l border-gray-300"></div>
        <div>Add Guests</div>
        
      </div>

      <Link to={user? '/account':'/login'} className="flex items-center gap-2 border bg-white border-gray-300 rounded-full py-3 px-4">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
      <div className="bg-white text-primary rounded-full border border-red-500 overflow-hidden">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 relative">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
      </svg>


      </div>

      {!!user && (
        <div>
          {user.name}
        </div>

      )}

      </Link>
    </header>
    <div className='bg-primary text-white px-64 py-4'>
      <div className='text-7xl font-bold py-2'>
      Find Your Next Stay
      </div>
      <div className='text-xl p-1'>
      Search low prices on hotels, homes and much more...
      </div>
    </div>
    </div>

  )
}

export default Header
