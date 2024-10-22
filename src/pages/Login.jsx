import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/Authprovider';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle form input changes
  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    login(email, password)
      .then(() => {
        navigate('/profile');
      })
      .catch(error => {
        console.log(error);
        setError(error);
      });

    setFormData({
      email: '',
      password: ''
    });
  }

  return (
    <div className="h-screen flex justify-center items-center bg-white">
      <form onSubmit={handleSubmit} className="bg-white w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-gray-800 font-bold text-2xl mb-1">Welcome Back!</h1>
        <p className="text-sm font-normal text-gray-600 mb-7">Please log in to your account</p>

        {/* Email Input */}
        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.94 6.94a10.23 10.23 0 00-.5 2.42C2.07 12.9 4.64 15 7.5 15S12.93 12.9 13.56 9.36a10.23 10.23 0 00-.5-2.42L8 3.75 2.94 6.94zM8 1.75l5.06 3.19a10.23 10.23 0 01.88 4.06C13.07 14.44 10.21 17 7.5 17s-5.57-2.56-6.44-7C1.06 5.31 3.81 2.75 8 1.75z" />
          </svg>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="pl-2 outline-none border-none w-full"
            placeholder="Email Address"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border-2 py-2 px-3 rounded-2xl mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 9a2 2 0 00-2 2v2h4v-2a2 2 0 00-2-2zm-3.5 2a3.5 3.5 0 117 0v2a.5.5 0 01-.5.5h-6a.5.5 0 01-.5-.5v-2z" />
          </svg>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="pl-2 outline-none border-none w-full"
            placeholder="Password"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="block w-full bg-indigo-600 mt-4 py-2 rounded-2xl text-white font-semibold mb-2">
          Login
        </button>

        <div className="text-sm font-medium text-gray-500">
          <p>Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link> here</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-2 rounded-md text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 24 24" stroke="currentColor" fill="none">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error.message || 'Warning: Invalid email or password!'}
          </div>
        )}
      </form>
    </div>
  );
}

export default Login;
