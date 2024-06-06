import React, { useState } from 'react';
import axios from 'axios';
import './RegistrationPage.css';

function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/register',
        { username, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Registration successful:', response.data);
      setSuccess('Registration successful! Please log in.');
      setError('');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        if (error.response.status === 400) {
          setError(error.response.data.message || 'Registration failed. Please try again.');
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
    <div className="register-page">
      <div className="register-container">
        <div className="register-form">
          <h2>Register</h2>
          <h3>
            Upon registration, you will be able to activate your ExpressPass, manage your account, track reservations, and view National Park information.
          </h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
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
            <button type="submit">Register</button>
          </form>
          {error && <p className="error-message">{error}</p>} {/* Display error message if present */}
          {success && <p className="success-message">{success}</p>} {/* Display success message if present */}
          <p className="login-message">
            Already Registered? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
