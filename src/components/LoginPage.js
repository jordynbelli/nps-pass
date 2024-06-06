import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { useAuthContext } from '../AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { setIsAuthenticated } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true // Ensure credentials (like cookies) are sent
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.access_token);
      setError('');
      setSuccess('Successfully logged in!');
      setIsAuthenticated(true);

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 401) {
          setError('Invalid credentials');
        } else {
          setError(`An error occurred: ${error.response.status} - ${error.response.data.message}`);
        }
      } else {
        setError('An error occurred. Please try again.');
      }
      setSuccess('');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <p className="register-message">
            Not yet registered? <a href="/register">Register here for a new account</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
