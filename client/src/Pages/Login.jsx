import React, { useContext, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from '../UserContext';

const Login = () => {
  const [email , setEmail] = useState('');
  const [password , setPassword] = useState('');
  const [redirect , setRedirect] = useState(false);

  const {setUser} = useContext(UserContext);

  async function handleLoginSubmit(ev){
    ev.preventDefault();
    try{
      const {data} = await axios.post('/login', {email , password});
      setUser(data);
      alert('Login Successful');
      setRedirect(true);
    } catch(err){
      alert('Login Failed.');
    }    
  }

  if(redirect){
    return <Navigate to={'/'} />
  }

  return (
    <div className='grow flex items-center justify-around'>
        <div className='mt-10 bg-gray-500 p-5 rounded-2xl bg-opacity-55 '>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
      <form className='max-w-md mx-auto' onSubmit={handleLoginSubmit}>
        <input 
        type="email"
        placeholder='your@email.com'
        value={email}
        onChange={ev => setEmail(ev.target.value)}
        />
        <input 
        type="password"
        placeholder='password'
        value={password}
        onChange={ev => setPassword(ev.target.value)}
         />
        <button className='primary'>Login</button>
        <div className='text-center py-2 text-gray-700'>
            Don't have an account yet? <Link className='underline text-black' to={'/register'}>Register</Link>
        </div>
        <div className='text-center text-gray-700'>
            Forgot Password? <Link className='underline text-black' to={'/register'}>Recover Here</Link>
        </div>
      </form>
        </div>
        
    </div>
  )
}

export default Login
