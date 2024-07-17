import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [number, setNumber] = useState(0);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [step, setStep] = useState(1);

  async function registerUser(ev) {
    ev.preventDefault();
    if (password === confirmPass) {
      try {
        const response = await axios.post('/register', {
          name,
          email,
          number,
          password,
        });

        alert('Registration successful! Please check your email for the OTP.');
        setUserId(response.data.userId);
        setStep(2);
      } catch (err) {
        alert('Registration failed. Please try again.');
      }
    } else {
      alert('Passwords do not match. Please try again.');
    }
  }

  async function verifyOtp(ev) {
    ev.preventDefault();
    try {
      await axios.post('/verify-email', { userId, otp });
      alert('Email verified successfully! You can now log in.');
      setStep(1);
    } catch (err) {
      alert('Invalid OTP. Please try again.');
    }
  }

  return (
    <div className="grow flex items-center justify-around">
      <div className="mt-10 bg-gray-500 p-5 rounded-2xl bg-opacity-50">
        {step === 1 && (
          <>
            <h1 className="text-4xl text-center mb-4">Register</h1>
            <form className="max-w-md mx-auto" onSubmit={registerUser}>
              <input
                type="text"
                placeholder="Eg. John Doe"
                value={name}
                onChange={(ev) => setName(ev.target.value)}
              />
              <input
                type="email"
                placeholder="Eg. your@email.com"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
              />
              <input
                type="tel"
                placeholder="Your Contact Number"
                value={number}
                onChange={(ev) => setNumber(ev.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPass}
                onChange={(ev) => setConfirmPass(ev.target.value)}
              />
              <button className="primary">Register</button>
              <div className="text-center py-2 text-gray-700">
                Already a member?{" "}
                <Link className="underline text-black" to={"/login"}>
                  Login
                </Link>
              </div>
            </form>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-4xl text-center mb-4">Verify Email</h1>
            <form className="max-w-md mx-auto" onSubmit={verifyOtp}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(ev) => setOtp(ev.target.value)}
              />
              <button className="primary">Verify</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
